import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
  args: ['--no-proxy-server'],
  timeout: 120_000,
});

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  page.setDefaultTimeout(120_000);
  await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'}/case-law/case/case-031`, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  });

  await page.getByRole('button', { name: /EVIDENCE.*CONTRADICTION IN EVIDENCE/i }).first().click();
  const ratioHeading = page.locator('#ratio-decidendi-reader h3');
  await ratioHeading.waitFor();
  assert.equal(
    await ratioHeading.evaluate(element => element.scrollWidth > element.clientWidth),
    false,
    'long ratio headings must wrap within the mobile card',
  );

  await page.getByRole('button', { name: 'Open source passage' }).click();
  const selector = '[data-case-report-id="case-031"] [data-report-page-number="14"] [data-paragraph-label="C"]';
  await page.locator(selector).waitFor();
  await page.waitForFunction((targetSelector) => {
    const target = document.querySelector(targetSelector);
    if (!target) return false;
    const box = target.getBoundingClientRect();
    return box.top >= 0 && box.top < innerHeight * 0.75;
  }, selector);
  await page.waitForFunction(() => /Page\s+14\s+of/i.test(document.querySelector('[data-report-page-tracker]')?.textContent ?? ''));
  assert.match(await page.locator('[data-report-page-tracker]').innerText(), /Page\s+14\s+of/i);

  await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'}/case-law/case/case-001`, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  });
  await page.getByRole('button', { name: /WRONGFUL ADMISSION\/REJECTION OF EVIDENCE/i }).first().click();
  await page.getByRole('button', { name: 'Open source passage' }).waitFor();
  await page.getByRole('button', { name: 'Open source passage' }).click();

  const earlyCaseSelector = '[data-case-report-id="case-001"] [data-report-page-number="10"] [data-paragraph-label="F"]';
  await page.locator(earlyCaseSelector).waitFor();
  await page.waitForFunction((targetSelector) => {
    const target = document.querySelector(targetSelector);
    if (!target) return false;
    const box = target.getBoundingClientRect();
    return box.top >= 0 && box.top < innerHeight * 0.75;
  }, earlyCaseSelector);
  await page.waitForFunction(() => /Page\s+10\s+of/i.test(document.querySelector('[data-report-page-tracker]')?.textContent ?? ''));
  assert.match(await page.locator('[data-report-page-tracker]').innerText(), /Page\s+10\s+of/i);

} finally {
  await browser.close();
}
