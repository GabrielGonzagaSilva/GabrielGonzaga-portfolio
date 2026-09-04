import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('assets/quantolab');
await fs.mkdir(outDir, { recursive: true });

const captures = [
  { name: 'home-desktop', url: 'https://quantolab.com.br/', width: 1440, height: 960 },
  { name: 'clt-pj-desktop', url: 'https://quantolab.com.br/comparador-profissional', width: 1440, height: 960 },
  { name: 'valor-hora-desktop', url: 'https://quantolab.com.br/valor-hora', width: 1440, height: 960 },
  { name: 'metodologia-desktop', url: 'https://quantolab.com.br/metodologia', width: 1440, height: 960 },
  { name: 'clt-pj-mobile', url: 'https://quantolab.com.br/comparador-profissional', width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const failures = [];

for (const capture of captures) {
  const page = await browser.newPage({
    viewport: { width: capture.width, height: capture.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });

  try {
    const response = await page.goto(capture.url, { waitUntil: 'networkidle', timeout: 45000 });
    if (!response || response.status() >= 400) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);

    await page.addStyleTag({ content: `
      html { scroll-behavior: auto !important; }
      *, *::before, *::after { animation: none !important; transition: none !important; }
      iframe[src*="doubleclick"], iframe[src*="googlesyndication"], ins.adsbygoogle,
      [id*="google_ads"], [class*="ad-slot"], [class*="ads-slot"] { display: none !important; }
    `});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(600);

    const title = await page.title();
    if (!title) throw new Error('missing document title');

    await page.screenshot({
      path: path.join(outDir, `${capture.name}.png`),
      fullPage: false,
      animations: 'disabled',
    });
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
  console.log(`Captured ${captures.length} QuantoLab product views.`);
}
