import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.QA_OUT_DIR || 'qa-output';
const viewports = [
  { name: 'wide', width: 2560, height: 1440, h1: 56, mode: 'desktop' },
  { name: 'desktop', width: 1440, height: 1100, h1: 56, mode: 'desktop' },
  { name: 'tablet', width: 1024, height: 900, h1: 46, mode: 'desktop' },
  { name: 'mobile', width: 390, height: 844, h1: 34, mode: 'mobile' },
  { name: 'narrow', width: 320, height: 720, h1: 34, mode: 'mobile' },
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
const near = (actual, expected, tolerance = 1.5) => Math.abs(actual - expected) <= tolerance;

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  const response = await page.goto(`${baseURL}/work/quantolab/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts?.ready);

  const result = await page.evaluate(() => {
    const h1 = document.querySelector('.case-title');
    const h1Style = h1 ? getComputedStyle(h1) : null;
    const work = document.querySelector('.desktop-nav a[aria-current="page"], .mobile-panel a[aria-current="page"]');
    const live = document.querySelector('.ql-live-link');
    const canvas = document.querySelector('.ql-product-canvas');
    const menu = document.querySelector('.mobile-menu-button');
    const desktopNav = document.querySelector('.desktop-nav');
    const realShots = [...document.querySelectorAll('.ql-real-shot')];
    const fakeMockups = document.querySelectorAll('.ql-browser-frame, .ql-calculator, .ql-interface-window, .ql-mini-phone, .ql-product-scene').length;
    const visible = el => el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
    return {
      h1Size: h1Style ? parseFloat(h1Style.fontSize) : null,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyWidth: document.body.scrollWidth,
      brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
      liveHref: live?.href || '',
      liveTarget: live?.target || '',
      hasCanvas: Boolean(canvas),
      realShotCount: realShots.length,
      realShotSources: realShots.map(img => img.getAttribute('src') || ''),
      fakeMockups,
      workLabel: work?.textContent?.trim() || '',
      bodyText: document.body.innerText,
      menuVisible: visible(menu),
      navVisible: visible(desktopNav),
    };
  });

  const prefix = `quantolab/${viewport.name}`;
  if (!response || response.status() >= 400) failures.push(`${prefix}: route returned ${response?.status() ?? 'no response'}`);
  if (!near(result.h1Size, viewport.h1)) failures.push(`${prefix}: H1 ${result.h1Size}px expected ~${viewport.h1}px`);
  if (result.scrollWidth > result.clientWidth + 1 || result.bodyWidth > result.clientWidth + 1) failures.push(`${prefix}: horizontal overflow`);
  if (result.brokenImages.length) failures.push(`${prefix}: broken images ${result.brokenImages.join(', ')}`);
  if (!result.hasCanvas) failures.push(`${prefix}: product preview missing`);
  if (result.realShotCount < 5) failures.push(`${prefix}: expected at least 5 real product captures, found ${result.realShotCount}`);
  if (result.fakeMockups !== 0) failures.push(`${prefix}: legacy fake mockup elements remain (${result.fakeMockups})`);
  for (const asset of ['home-desktop.png', 'clt-pj-desktop.png', 'clt-pj-mobile.png', 'valor-hora-desktop.png', 'metodologia-desktop.png']) {
    if (!result.realShotSources.some(src => src.endsWith(asset))) failures.push(`${prefix}: real product asset missing: ${asset}`);
  }
  if (!result.liveHref.startsWith('https://quantolab.com.br')) failures.push(`${prefix}: live product link is incorrect`);
  if (result.liveTarget !== '_blank') failures.push(`${prefix}: live product should open safely in a new tab`);
  if (result.workLabel !== 'Work') failures.push(`${prefix}: Work navigation is not active`);
  for (const proof of ['28', '0', '2026', 'Fill', 'Calculate', 'Explain', 'Compare', 'A calculator can be mathematically correct']) {
    if (!result.bodyText.toLowerCase().includes(proof.toLowerCase())) failures.push(`${prefix}: evidence text missing: ${proof}`);
  }
  if (viewport.mode === 'mobile') {
    if (!result.menuVisible || result.navVisible) failures.push(`${prefix}: mobile navigation behavior is incorrect`);
  } else if (!result.navVisible) {
    failures.push(`${prefix}: desktop navigation missing`);
  }
  if (consoleErrors.length) failures.push(`${prefix}: console errors ${consoleErrors.join(' | ')}`);

  await page.screenshot({ path: path.join(outDir, `quantolab-case-${viewport.name}.png`), fullPage: true });
  await page.close();
}

await browser.close();
await fs.writeFile(path.join(outDir, 'quantolab-case-report.json'), JSON.stringify({ failures, scenarios: viewports.length }, null, 2));
console.log(JSON.stringify({ failures, scenarios: viewports.length }, null, 2));
if (failures.length) process.exitCode = 1;
