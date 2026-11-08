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
await mkdir('tmp/law-reader-layout', { recursive: true });
try {
  await page.goto(`${base}/affidavits`, { waitUntil: 'commit', timeout: 90000 });
  const affidavits = page.locator('a[href^="/affidavits/deposition/"]');
  await affidavits.first().waitFor({ timeout: 120000 });
  assert.equal(await affidavits.count(), 6);
  assert.ok(!(await affidavits.allTextContents()).join(' ').includes('Bail Application'));
  const search = page.getByPlaceholder(/Search agreements or affidavits/);
  await search.fill('bail');
  await page.getByText('No sample affidavit matches "bail".').waitFor();
  assert.equal(await affidavits.count(), 0);
  await search.fill('change of name');
  await affidavits.first().click();
  await page.getByRole('heading', { name: 'Affidavit for Change of Name', exact: true }).waitFor();

  for (const route of ['/constitution', '/nigerian-laws/federation/const-1999']) {
    await page.goto(`${base}${route}`, { waitUntil: 'commit', timeout: 90000 });
    const firstPage = page.locator('article[data-page-number]').first();
    await firstPage.waitFor({ timeout: 120000 });
    assert.equal(await firstPage.getAttribute('data-page-number'), '7');
    for (let number = 1; number <= 5; number++) assert.equal(await page.locator(`article[data-page-number="${number}"]`).count(), 0);
  }

  await page.goto(`${base}/nigerian-laws/federation/cama-2020`, { waitUntil: 'commit', timeout: 90000 });
  const lawSearch = page.getByRole('textbox', { name: /^Search / });
  await lawSearch.waitFor({ timeout: 120000 });
  await lawSearch.fill('The Board shall');
  const result = page.getByRole('button').filter({ hasText: /^PDF page/ }).first();
  await result.waitFor();
  const pageNumber = (await result.innerText()).match(/PDF page (\d+)/)[1];
  await result.click();
  await lawSearch.fill('');
  const text = page.locator(`article[data-page-number="${pageNumber}"] [data-legal-text]`);
  await text.waitFor();
  const boardParagraph = text.locator('[data-legal-paragraph]').filter({ hasText: 'The Board shall' }).first();
  await boardParagraph.waitFor();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 });
    await boardParagraph.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const layout = await text.evaluate(element => {
      const paragraphs = Array.from(element.querySelectorAll('[data-legal-paragraph]'));
      const notes = Array.from(element.querySelectorAll('aside'));
      return {
        lineHeight: parseFloat(getComputedStyle(element).lineHeight),
        fontSize: parseFloat(getComputedStyle(element).fontSize),
        overflow: document.documentElement.scrollWidth > innerWidth,
        spaced: paragraphs.slice(1).every((paragraph, index) => paragraph.getBoundingClientRect().top - paragraphs[index].getBoundingClientRect().bottom >= 20),
        overlappingNotes: notes.some(note => paragraphs.some(paragraph => {
          const a = note.getBoundingClientRect(); const b = paragraph.getBoundingClientRect();
          return Math.min(a.right, b.right) > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top);
        })),
      };
    });
    assert.ok(layout.lineHeight / layout.fontSize >= 1.8);
    assert.ok(layout.spaced, `Paragraphs have clear gaps at ${width}px`);
    assert.equal(layout.overflow, false);
    assert.equal(layout.overlappingNotes, false);
    await page.screenshot({ path: `tmp/law-reader-layout/cama-${width}.png` });
  }
  assert.deepEqual(errors, []);
  console.log('PASS: standalone directory and search, both Constitution routes omit pages 1-5, spacious legal paragraphs and nonoverlapping notes on desktop/mobile.');
} catch (error) {
  console.error(error);
  console.error('Page:', page.url(), 'Browser errors:', errors);
  await page.screenshot({ path: 'tmp/law-reader-layout/failure.png' }).catch(() => {});
  process.exitCode = 1;
} finally { await browser.close(); }
