import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(60000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await mkdir('tmp/judgment-pagination', { recursive: true });
  for (const id of ['case-013', 'case-014', 'case-015', 'case-016', 'case-017', 'case-018']) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/case-law/case/${id}`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '5. Read the whole case', exact: true }).click();
    await page.locator('[data-report-page-number="8"]').waitFor();
    const pages = await page.locator('.lawpex-report-page').evaluateAll(articles => articles.map(article => {
      const paragraphs = [...article.querySelectorAll('[data-paragraph-label]')];
      const headings = [...article.querySelectorAll('p.font-sans')];
      return {
        number: Number(article.dataset.reportPageNumber),
        textLength: paragraphs.reduce((sum, paragraph) => sum + paragraph.textContent.length, 0),
        labels: paragraphs.map(paragraph => paragraph.dataset.paragraphLabel).join(''),
        stranded: paragraphs.length ? headings.filter(heading => !heading.nextElementSibling?.hasAttribute('data-paragraph-label')).map(heading => heading.textContent) : [],
      };
    }));
    for (const article of pages.filter(article => article.labels)) {
      assert.equal(article.labels, 'ABCDEFG'.slice(0, article.labels.length), `${id}, page ${article.number}: ordered labels`);
      assert.deepEqual(article.stranded, [], `${id}, page ${article.number}: orphaned heading`);
      if (article.number !== pages.at(-1).number) assert.ok(article.textLength > 2000, `${id}, page ${article.number}: blank space`);
    }
    if (id === 'case-016') {
      assert.ok(pages.find(article => article.number === 8).textLength > 3500, 'Amadi page eight must contain the opinion, not only the judge name');
      await page.locator('[data-report-page-number="8"]').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tmp/judgment-pagination/amadi-desktop.png', animations: 'disabled' });
    }
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${id}: horizontal overflow at ${width}px`);
      if (id === 'case-016' && width === 390) {
        await page.locator('[data-report-page-number="8"]').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'tmp/judgment-pagination/amadi-mobile.png', animations: 'disabled' });
      }
    }
    console.log(`${id}: ${pages.length + 1} pages, desktop/mobile pagination passed`);
  }
  assert.deepEqual(errors, [], 'no browser exceptions');
} finally {
  await browser.close();
}
