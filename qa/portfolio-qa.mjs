import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.QA_OUT_DIR || 'qa-output';

const pages = [
  { name: 'home', path: '/', h1: '.home-hero__copy h1', portrait: '.home-about__media img' },
  { name: 'work', path: '/work/', h1: '.page-title' },
  { name: 'about', path: '/about/', h1: '.page-title', portrait: '.profile-photo' },
  { name: 'experience', path: '/experience/', h1: '.page-title' },
  { name: 'aureum-hub', path: '/work/aureum-hub/', h1: '.case-title' },
  { name: 'quantolab', path: '/work/quantolab/', h1: '.case-title' },
];

/* Canonical production range plus required review widths. */
const viewports = [
  { name: 'wide', width: 2560, height: 1440, mode: 'desktop' },
  { name: 'desktop', width: 1440, height: 1100, mode: 'desktop' },
  { name: 'laptop', width: 1280, height: 900, mode: 'desktop' },
  { name: 'tablet', width: 1024, height: 900, mode: 'tablet' },
  { name: 'tablet-compact', width: 768, height: 900, mode: 'tablet' },
  { name: 'mobile-large', width: 430, height: 900, mode: 'mobile' },
  { name: 'mobile', width: 390, height: 844, mode: 'mobile' },
  { name: 'narrow', width: 320, height: 720, mode: 'mobile' },
];

const expectedByMode = {
  desktop: { header: [64, 72], minFooter: 70, h1: [56, 132], caseH1: [52, 112], brand: [9, 12] },
  tablet: { header: [62, 72], minFooter: 70, h1: [48, 100], caseH1: [44, 82], brand: [9, 12] },
  mobile: { header: [58, 66], minFooter: 66, h1: [46, 80], caseH1: [46, 80], brand: [8, 11] },
};

const inRange = (actual, [min, max]) => Number.isFinite(actual) && actual >= min && actual <= max;
const intersects = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), baseURL, results: [], failures: [] };
const fail = (entry, message) => {
  entry.failures.push(message);
  report.failures.push(`${entry.page}/${entry.viewport}: ${message}`);
};

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });

  for (const pageSpec of pages) {
    const page = await context.newPage();
    const entry = { page: pageSpec.name, viewport: viewport.name, width: viewport.width, height: viewport.height, failures: [] };
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => pageErrors.push(String(err)));

    const response = await page.goto(`${baseURL}${pageSpec.path}`, { waitUntil: 'networkidle' });
    if (!response || response.status() >= 400) fail(entry, `route returned ${response?.status() ?? 'no response'}`);
    await page.evaluate(() => document.fonts?.ready);

    const metrics = await page.evaluate(({ h1Selector, portraitSelector }) => {
      const rect = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return { x: r.x, y: r.y, left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height, fontSize: parseFloat(cs.fontSize), lineHeight: cs.lineHeight, borderRadius: cs.borderRadius };
      };

      const header = rect('.site-header');
      const footer = rect('.site-footer');
      const headerInner = rect('.header-inner');
      const nav = rect('.desktop-nav');
      const menu = rect('.mobile-menu-button');
      const h1 = rect(h1Selector);
      const portrait = portraitSelector ? rect(portraitSelector) : null;
      const brand = document.querySelector('.brand');
      const brandStyle = brand ? getComputedStyle(brand) : null;
      const skipLink = document.querySelector('.skip-link');
      const main = document.querySelector('main');
      const firstH1 = document.querySelector('h1');

      const brokenImages = [...document.images]
        .filter(img => img.complete && img.naturalWidth === 0)
        .map(img => img.getAttribute('src'));

      const footerLabels = [...document.querySelectorAll('.footer-label')].map(el => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      });

      const overflowing = [...document.querySelectorAll('body *')].flatMap(el => {
        const r = el.getBoundingClientRect();
        if (r.right > document.documentElement.clientWidth + 2 || r.left < -2) {
          return [{ tag: el.tagName.toLowerCase(), cls: typeof el.className === 'string' ? el.className.slice(0, 90) : '', left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) }];
        }
        return [];
      }).slice(0, 12);

      return {
        header, footer, headerInner, nav, menu, h1, portrait,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        brand: brandStyle ? { fontSize: parseFloat(brandStyle.fontSize), lineHeight: brandStyle.lineHeight } : null,
        brokenImages,
        footerLabels,
        overflowing,
        semantics: { skipLink: Boolean(skipLink), main: Boolean(main), h1Count: document.querySelectorAll('h1').length, firstH1: firstH1?.textContent?.trim() || '' },
      };
    }, { h1Selector: pageSpec.h1, portraitSelector: pageSpec.portrait || null });

    entry.metrics = metrics;
    const exp = expectedByMode[viewport.mode];

    if (!metrics.header || !inRange(metrics.header.height, exp.header)) fail(entry, `header height ${metrics.header?.height ?? 'missing'} outside ${exp.header[0]}–${exp.header[1]}px`);
    if (!metrics.footer || metrics.footer.height < exp.minFooter) fail(entry, `footer height ${metrics.footer?.height ?? 'missing'} below ${exp.minFooter}px`);

    if (!metrics.headerInner) fail(entry, 'header inner missing');
    else {
      const gutter = Math.min(72, Math.max(20, viewport.width * .045));
      const contentWidth = Math.min(1540, viewport.width - 2 * gutter);
      const expectedLeft = (viewport.width - contentWidth) / 2;
      const actualLeft = metrics.headerInner.left;
      const actualRight = viewport.width - metrics.headerInner.right;
      if (Math.abs(actualLeft - expectedLeft) > 2.5 || Math.abs(actualRight - expectedLeft) > 2.5) {
        fail(entry, `header axes ${actualLeft.toFixed(1)}/${actualRight.toFixed(1)} expected ~${expectedLeft.toFixed(1)}`);
      }
    }

    if (!metrics.h1) fail(entry, 'primary H1 missing');
    else {
      const range = ['aureum-hub', 'quantolab'].includes(pageSpec.name) ? exp.caseH1 : exp.h1;
      if (!inRange(metrics.h1.fontSize, range)) fail(entry, `H1 ${metrics.h1.fontSize}px outside ${range[0]}–${range[1]}px`);
    }

    if (!metrics.semantics.skipLink) fail(entry, 'skip link missing');
    if (!metrics.semantics.main) fail(entry, 'main landmark missing');
    if (metrics.semantics.h1Count !== 1) fail(entry, `expected exactly one H1, found ${metrics.semantics.h1Count}`);

    if (metrics.scrollWidth > metrics.clientWidth + 2 || metrics.bodyScrollWidth > metrics.clientWidth + 2) {
      const details = metrics.overflowing.map(x => `${x.tag}.${x.cls}[${x.left},${x.right}]`).join(' | ');
      fail(entry, `horizontal overflow ${metrics.scrollWidth}/${metrics.bodyScrollWidth} > ${metrics.clientWidth}${details ? `; offenders: ${details}` : ''}`);
    }

    if (metrics.brokenImages.length) fail(entry, `broken images: ${metrics.brokenImages.join(', ')}`);
    if (consoleErrors.length) fail(entry, `console errors: ${consoleErrors.join(' | ')}`);
    if (pageErrors.length) fail(entry, `page errors: ${pageErrors.join(' | ')}`);
    if (metrics.brand && !inRange(metrics.brand.fontSize, exp.brand)) fail(entry, `brand font ${metrics.brand.fontSize}px outside ${exp.brand[0]}–${exp.brand[1]}px`);

    if (metrics.footerLabels.length >= 2 && intersects(metrics.footerLabels[0], metrics.footerLabels[1])) fail(entry, 'footer labels overlap');

    if (viewport.mode === 'mobile') {
      if (metrics.nav && metrics.nav.width > 0) fail(entry, 'desktop navigation visible on mobile');
      if (!metrics.menu || metrics.menu.height < 44 || metrics.menu.width < 44) fail(entry, `mobile MENU missing or touch target too small (${metrics.menu?.width ?? 0}×${metrics.menu?.height ?? 0}px)`);
    } else if (!metrics.nav || metrics.nav.width <= 0) {
      fail(entry, 'desktop navigation missing');
    }

    if (pageSpec.portrait && metrics.portrait) {
      const ratio = metrics.portrait.width / Math.max(metrics.portrait.height, 1);
      if (metrics.portrait.width < 260) fail(entry, `portrait too narrow (${metrics.portrait.width.toFixed(1)}px)`);
      if (ratio < .70 || ratio > 1.02) fail(entry, `portrait ratio ${ratio.toFixed(2)} outside editorial range`);
    }

    const screenshot = path.join(outDir, `${pageSpec.name}-${viewport.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    entry.screenshot = screenshot;
    report.results.push(entry);
    await page.close();
  }

  await context.close();
}

await browser.close();
await fs.writeFile(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ failures: report.failures, resultCount: report.results.length }, null, 2));
if (report.failures.length) process.exitCode = 1;
