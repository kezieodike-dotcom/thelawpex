import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { LANDMARK_CASES } from '../src/data/legalData.ts';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--no-proxy-server'], timeout: 60000 });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let publications = [];
await page.route('**/api/cases', route => route.fulfill({ json: { cases: publications } }));
await mkdir('tmp/case-authorities', { recursive: true });
try {
  await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'}/case-law/case/case-014`, { waitUntil: 'commit', timeout: 90000 });
  await page.getByRole('button', { name: '4. Authorities & notes' }).waitFor({ timeout: 120000 });
  await page.getByRole('button', { name: '4. Authorities & notes' }).click();
  const idundun = page.getByRole('link', { name: 'Idundun & Ors v. Okumagba & Ors (1976) LDLR-1012 (S.C)', exact: true });
  await idundun.waitFor();
  assert.equal(await page.getByText('Idundun v. Okumagba (1976) 9-10 SC 227', { exact: true }).count(), 0);
  assert.ok(await page.getByText('Igwego v. Ezeugo (1992) 6 NWLR (Pt.249) 561', { exact: true }).isVisible());
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await idundun.scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: `tmp/case-authorities/notes-${width}.png` });
  }
  await idundun.click();
  await page.waitForURL('**/case-law/case/case-001');
  await page.getByRole('heading', { name: 'Idundun & Ors v. Okumagba & Ors', exact: true, level: 1 }).waitFor();
  await page.waitForFunction(() => scrollY < 5);
  assert.equal(await page.getByRole('button', { name: '1. Ratio decidendi' }).getAttribute('aria-current'), 'page');
  assert.ok(await page.getByRole('heading', { name: 'Idundun & Ors v. Okumagba & Ors', exact: true, level: 1 }).isVisible());

  await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'}/case-law/case/case-013`, { waitUntil: 'commit', timeout: 90000 });
  await page.getByRole('button', { name: '4. Authorities & notes' }).click();
  const original = page.getByText('Bello v. Eweka (1981) 1 SC 101', { exact: true });
  await original.waitFor();
  assert.equal(await page.getByRole('link', { name: /Bello v\. Eweka/ }).count(), 0);
  publications = [{ ...LANDMARK_CASES[0], id: 'ingested-bello', title: 'Bello v. Eweka', citation: '(1981) LDLR-500 (S.C)', year: 1981 }];
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  const newlyPublished = page.getByRole('link', { name: 'Bello v. Eweka (1981) LDLR-500 (S.C)', exact: true });
  await newlyPublished.waitFor({ timeout: 30000 });
  await newlyPublished.click();
  await page.waitForURL('**/case-law/case/ingested-bello');
  await page.getByRole('heading', { level: 1, name: 'Bello v. Eweka', exact: true }).waitFor();
  assert.ok(await page.getByRole('heading', { level: 1, name: 'Bello v. Eweka', exact: true }).isVisible());
  await page.waitForFunction(() => scrollY < 5);
  assert.deepEqual(errors, []);
  console.log('PASS: LAWPEX authority citations, top-of-case navigation, responsive cards and automatic publication matching.');
} catch (error) {
  console.error(error);
  await page.screenshot({ path: 'tmp/case-authorities/failure.png' }).catch(() => {});
  process.exitCode = 1;
} finally { await browser.close(); }
