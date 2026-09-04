import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('assets/quantolab');
await fs.mkdir(outDir, { recursive: true });

const sourceBase = (process.env.QUANTOLAB_CAPTURE_BASE || 'https://quantolab.com.br').replace(/\/$/, '');
const localSource = /127\.0\.0\.1|localhost/.test(sourceBase);
const route = name => {
  if (!name) return `${sourceBase}/`;
  return `${sourceBase}/${name}${localSource ? '.html' : ''}`;
};

const captures = [
  { name: 'home-desktop', url: route(''), width: 1440, height: 960, proof: 'h1' },
  { name: 'clt-pj-desktop', url: route('comparador-profissional'), width: 1440, height: 960, proof: 'h1' },
  { name: 'valor-hora-desktop', url: route('valor-hora'), width: 1440, height: 960, proof: 'h1' },
  { name: 'metodologia-desktop', url: route('metodologia'), width: 1440, height: 960, proof: 'h1' },
  { name: 'clt-pj-mobile', url: route('comparador-profissional'), width: 390, height: 844, proof: 'h1' },
];

const browser = await chromium.launch({ headless: true });
const failures = [];
const blockedHosts = ['googlesyndication.com', 'doubleclick.net', 'googleadservices.com', 'googletagmanager.com'];

for (const capture of captures) {
  const page = await browser.newPage({
    viewport: { width: capture.width, height: capture.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });

  await page.addInitScript(() => {
    localStorage.setItem('quantolab-terms-v2026-08-16', 'accepted');
    localStorage.setItem('quantolab-theme', 'light');
  });

  await page.route('**/*', requestRoute => {
    const requestUrl = requestRoute.request().url();
    if (blockedHosts.some(host => requestUrl.includes(host))) return requestRoute.abort();
    return requestRoute.continue();
  });

  try {
    const response = await page.goto(capture.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() ?? 'no response'} at ${capture.url}`);

    const proof = page.locator(capture.proof).first();
    await proof.waitFor({ state: 'visible', timeout: 10000 });
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));

    const state = await proof.evaluate(el => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        text: el.textContent?.trim() || '',
        width: rect.width,
        height: rect.height,
        opacity: Number(style.opacity),
        visibility: style.visibility,
        color: style.color,
      };
    });
    if (!state.text || state.width < 20 || state.height < 10 || state.opacity === 0 || state.visibility === 'hidden') {
      throw new Error(`primary content is not visibly rendered: ${JSON.stringify(state)}`);
    }

    const consentVisible = await page.locator('.terms-consent').count();
    if (consentVisible) throw new Error('terms consent overlay is still visible');

    await page.screenshot({
      path: path.join(outDir, `${capture.name}.png`),
      fullPage: false,
      animations: 'disabled',
    });
    console.log(`${capture.name}: ${state.text.slice(0, 80)}`);
  } catch (error) {
    failures.push(`${capture.name}: ${error.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Captured ${captures.length} QuantoLab source views without external overlays.`);
}
