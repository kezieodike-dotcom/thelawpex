import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--no-proxy-server'], timeout: 60000 });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('tmp/source-law-layout', { recursive: true });
try {
  await page.goto(`${base}/nigerian-laws/federation/cama-2020`, { waitUntil: 'commit', timeout: 90000 });
  const search = page.getByRole('textbox', { name: /^Search / });
  await search.waitFor({ timeout: 120000 });
  await search.fill('review and provide general policy guidelines');
  await page.getByRole('button').filter({ hasText: /^PDF page 35\b/ }).click();
  await search.fill('');
  const source = page.locator('article[data-page-number="35"] [data-source-layout="true"]');
  await source.waitFor({ timeout: 120000 });
  const functions = source.locator('aside').filter({ hasText: 'Functions of the Board.' });
  await functions.waitFor();
  const row = functions.locator('xpath=../..');
  assert.match(await row.locator('[data-legal-paragraph]').innerText(), /^4\.\s+The Board shall/);
  assert.ok(!(await source.locator('[data-legal-paragraph]').allTextContents()).join(' ').includes('Functions of the Board.'));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 });
    await row.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const boxes = await row.evaluate(element => {
      const paragraph = element.querySelector('[data-legal-paragraph]').getBoundingClientRect();
      const note = element.querySelector('aside').getBoundingClientRect();
      return { paragraph: { left: paragraph.left, right: paragraph.right, top: paragraph.top, bottom: paragraph.bottom }, note: { left: note.left, right: note.right, top: note.top, bottom: note.bottom }, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    assert.equal(boxes.overflow, false);
    if (width >= 1280) assert.ok(boxes.note.left >= boxes.paragraph.right, 'Right source margin stays to the right of the provision');
    else assert.ok(boxes.note.top >= boxes.paragraph.bottom, 'Mobile annotations are below, not interleaved with the provision');
    await page.screenshot({ path: `tmp/source-law-layout/cama-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const leftNote = page.locator('article[data-page-number="34"] [data-source-note-side="left"]').filter({ hasText: 'Tenure of office and vacancy on the Board.' });
  await leftNote.waitFor();
  await leftNote.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const left = await leftNote.evaluate(element => ({ right: element.getBoundingClientRect().right, bodyLeft: element.parentElement.parentElement.querySelector('[data-legal-paragraph]').getBoundingClientRect().left }));
  assert.ok(left.right <= left.bodyLeft);
  await page.goto(`${base}/court-rules/supreme-court/supreme-court-rules-2024`, { waitUntil: 'commit', timeout: 90000 });
  const ruleSearch = page.getByRole('textbox', { name: /^Search / });
  await ruleSearch.waitFor({ timeout: 120000 });
  await ruleSearch.fill('The Chief Registrar shall have');
  await page.getByRole('button').filter({ hasText: /^PDF page 12\b/ }).click();
  await ruleSearch.fill('');
  const rules = page.locator('article[data-page-number="12"] [data-source-layout="true"]');
  await rules.waitFor({ timeout: 120000 });
  const chief = rules.locator('aside').filter({ hasText: 'Chief Registrar.' }).first();
  await chief.waitFor();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await chief.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: `tmp/source-law-layout/rules-${width}.png` });
  }
  assert.deepEqual(errors, []);
  console.log('PASS: actual CAMA left/right source margins and Supreme Court Order 2 notes are separate and readable on desktop/tablet/mobile.');
} catch (error) {
  console.error(error); console.error('Page:', page.url(), errors);
  await page.screenshot({ path: 'tmp/source-law-layout/failure.png' }).catch(() => {});
  process.exitCode = 1;
} finally { await browser.close(); }
