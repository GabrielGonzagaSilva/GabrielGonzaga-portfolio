import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.QA_OUT_DIR || 'qa-output';

const pages = [
  { name: 'home', path: '/', h1: '.home-identity h1', portrait: '.home-about__photo' },
  { name: 'work', path: '/work/', h1: '.page-title' },
  { name: 'about', path: '/about/', h1: '.page-title', portrait: '.profile-photo' },
  { name: 'experience', path: '/experience/', h1: '.page-title' },
  { name: 'aureum-hub', path: '/work/aureum-hub/', h1: '.case-title' },
];

/* Covers the supported 320–2560px range, plus the canonical Figma widths. */
const viewports = [
  { name: 'wide', width: 2560, height: 1440, mode: 'desktop' },
  { name: 'desktop', width: 1440, height: 1100, mode: 'desktop' },
  { name: 'tablet', width: 1024, height: 900, mode: 'tablet' },
  { name: 'mobile', width: 390, height: 844, mode: 'mobile' },
  { name: 'narrow', width: 320, height: 720, mode: 'mobile' },
];

const expectedByMode = {
  desktop: { header: 76, footer: 88, baseGutter: 72, pageH1: 80, caseH1: 64 },
  tablet: { header: 76, footer: 80, baseGutter: 48, pageH1: 56, caseH1: 50 },
  mobile: { header: 68, footer: 72, baseGutter: 20, pageH1: 40, caseH1: 40 },
};

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), baseURL, results: [], failures: [] };

const near = (actual, target, tolerance = 1.5) => Math.abs(actual - target) <= tolerance;
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
        return { x: r.x, y: r.y, width: r.width, height: r.height, fontSize: parseFloat(cs.fontSize), lineHeight: cs.lineHeight, borderRadius: cs.borderRadius };
      };
      const header = rect('.site-header');
      const footer = rect('.site-footer');
      const headerInner = rect('.header-inner');
      const footerInner = rect('.footer-inner');
      const nav = rect('.desktop-nav');
      const menu = rect('.mobile-menu-button');
      const h1 = rect(h1Selector);
      const portrait = portraitSelector ? rect(portraitSelector) : null;
      const portraitVariance = portraitSelector ? (() => {
        const img = document.querySelector(portraitSelector);
        if (!(img instanceof HTMLImageElement) || !img.complete || img.naturalWidth === 0) return null;
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return null;
        try {
          ctx.drawImage(img, 0, 0, 32, 32);
          const data = ctx.getImageData(0, 0, 32, 32).data;
          const luma = [];
          for (let i = 0; i < data.length; i += 4) luma.push(.2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2]);
          const mean = luma.reduce((sum, value) => sum + value, 0) / luma.length;
          const variance = luma.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / luma.length;
          return Math.sqrt(variance);
        } catch {
          return null;
        }
      })() : null;

      const sections = [...document.querySelectorAll('main > .section, main > .home-section')];
      const dividerCount = sections.slice(1).filter(section => parseFloat(getComputedStyle(section).borderTopWidth) >= .5).length;
      const brand = document.querySelector('.brand');
      const brandStyle = brand ? getComputedStyle(brand) : null;
      const brokenImages = [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src'));
      const footerLabels = [...document.querySelectorAll('.footer-label')].map(el => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, width: r.width };
      });
      const visibleInteractive = [...document.querySelectorAll('a,button')].filter(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
      }).map(el => ({ tag: el.tagName, text: (el.textContent || '').trim().slice(0,40), width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }));

      return {
        header, footer, headerInner, footerInner, nav, menu, h1, portrait, portraitVariance,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        sectionCount: sections.length,
        dividerCount,
        brand: brandStyle ? { fontSize: parseFloat(brandStyle.fontSize), lineHeight: brandStyle.lineHeight } : null,
        brokenImages,
        footerLabels,
        visibleInteractive,
      };
    }, { h1Selector: pageSpec.h1, portraitSelector: pageSpec.portrait || null });

    entry.metrics = metrics;
    const exp = expectedByMode[viewport.mode];

    if (!metrics.header || !near(metrics.header.height, exp.header)) fail(entry, `header height ${metrics.header?.height ?? 'missing'} expected ~${exp.header}`);
    if (!metrics.footer || !near(metrics.footer.height, exp.footer, 2)) fail(entry, `footer height ${metrics.footer?.height ?? 'missing'} expected ~${exp.footer}`);

    if (!metrics.headerInner) fail(entry, 'header inner missing');
    else {
      const contentWidth = Math.min(viewport.width - (2 * (viewport.width >= 1600 ? 96 : exp.baseGutter)), 1296);
      const expectedLeft = (viewport.width - contentWidth) / 2;
      const left = metrics.headerInner.x;
      const right = viewport.width - (metrics.headerInner.x + metrics.headerInner.width);
      if (!near(left, expectedLeft, 2) || !near(right, expectedLeft, 2)) fail(entry, `header gutters ${left.toFixed(1)}/${right.toFixed(1)} expected ~${expectedLeft.toFixed(1)}`);
    }

    if (!metrics.h1) fail(entry, 'primary H1 missing');
    else {
      const target = pageSpec.name === 'aureum-hub' ? exp.caseH1 : exp.pageH1;
      if (!near(metrics.h1.fontSize, target, 1)) fail(entry, `H1 ${metrics.h1.fontSize}px expected ~${target}px`);
    }

    if (metrics.sectionCount > 1 && metrics.dividerCount !== metrics.sectionCount - 1) fail(entry, `section dividers ${metrics.dividerCount}/${metrics.sectionCount - 1} expected`);
    if (metrics.scrollWidth > metrics.clientWidth + 1 || metrics.bodyScrollWidth > metrics.clientWidth + 1) fail(entry, `horizontal overflow ${metrics.scrollWidth}/${metrics.bodyScrollWidth} > ${metrics.clientWidth}`);
    if (metrics.brokenImages.length) fail(entry, `broken images: ${metrics.brokenImages.join(', ')}`);
    if (consoleErrors.length) fail(entry, `console errors: ${consoleErrors.join(' | ')}`);
    if (pageErrors.length) fail(entry, `page errors: ${pageErrors.join(' | ')}`);
    if (metrics.brand && !near(metrics.brand.fontSize, 14, .5)) fail(entry, `brand font ${metrics.brand.fontSize}px expected 14px`);

    if (metrics.footerLabels.length >= 2 && metrics.footerLabels[0].right > metrics.footerLabels[1].left - 4) fail(entry, 'footer labels overlap');

    if (viewport.mode === 'mobile') {
      if (metrics.nav && metrics.nav.width > 0) fail(entry, 'desktop navigation visible on mobile');
      if (!metrics.menu || metrics.menu.height < 44) fail(entry, `mobile MENU missing or touch target too small (${metrics.menu?.height ?? 0}px)`);
    } else {
      if (!metrics.nav || metrics.nav.width <= 0) fail(entry, 'desktop navigation missing');
    }

    if (pageSpec.portrait && metrics.portrait) {
      const p = metrics.portrait;
      if (metrics.portraitVariance === null || metrics.portraitVariance < 8) fail(entry, `portrait does not contain enough rendered image detail (variance ${metrics.portraitVariance ?? 'null'})`);
      if (pageSpec.name === 'home') {
        if (viewport.mode === 'desktop' && (!near(p.width,320,2) || !near(p.height,382,2))) fail(entry, `Home portrait ${p.width.toFixed(1)}×${p.height.toFixed(1)} expected 320×382`);
        if (viewport.mode === 'tablet' && (!near(p.width,400,2) || !near(p.height,477,2))) fail(entry, `Home tablet portrait ${p.width.toFixed(1)}×${p.height.toFixed(1)} expected 400×477`);
        if (viewport.mode === 'mobile') {
          const expectedWidth = viewport.width - 40;
          const expectedHeight = expectedWidth * 6 / 5;
          if (!near(p.width,expectedWidth,2) || !near(p.height,expectedHeight,3)) fail(entry, `Home mobile portrait ${p.width.toFixed(1)}×${p.height.toFixed(1)} expected ${expectedWidth}×${expectedHeight.toFixed(0)}`);
        }
      }
      if (pageSpec.name === 'about') {
        if (viewport.mode === 'desktop' && (!near(p.width,480,2) || !near(p.height,560,2))) fail(entry, `About portrait ${p.width.toFixed(1)}×${p.height.toFixed(1)} expected 480×560`);
        if (viewport.mode === 'tablet' && (!near(p.width,360,2) || !near(p.height,430,2))) fail(entry, `About tablet portrait ${p.width.toFixed(1)}×${p.height.toFixed(1)} expected 360×430`);
        if (viewport.mode === 'mobile') {
          const expectedWidth = viewport.width - 40;
          const expectedHeight = expectedWidth * 6 / 5;
          if (!near(p.width,expectedWidth,2) || !near(p.height,expectedHeight,3)) fail(entry, `About mobile portrait ${p.width.toFixed(1)}×${p.height.toFixed(1)} expected ${expectedWidth}×${expectedHeight.toFixed(0)}`);
        }
      }
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
