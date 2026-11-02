import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, timeout: 60000 });
const page = await browser.newPage();
page.setDefaultTimeout(30000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await mkdir('tmp/case-search-suggestions', { recursive: true });
  for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 560 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/case-law`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const search = page.getByRole('combobox');
    await search.fill('Evidence');
    const list = page.getByRole('listbox');
    await list.getByRole('option').first().waitFor();
    await search.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.screenshot({ path: `tmp/case-search-suggestions/${viewport.width}.png`, animations: 'disabled' });
    const layout = await list.evaluate(element => {
      const hero = element.closest('header');
      const form = element.closest('form');
      const stats = form.nextElementSibling;
      const row = element.querySelector('[role="option"]');
      const text = row.firstElementChild;
      const title = text.children[0].getBoundingClientRect();
      const excerpt = text.children[1].getBoundingClientRect();
      const citation = row.lastElementChild.getBoundingClientRect();
      const listBox = element.getBoundingClientRect();
      const pointY = Math.max(title.top, listBox.top) + Math.min(title.height / 2, 10);
      const topElement = document.elementFromPoint(title.left + 20, pointY);
      return {
        heroOverflow: getComputedStyle(hero).overflowY,
        formZ: Number(getComputedStyle(form).zIndex),
        statsZ: Number(getComputedStyle(stats).zIndex),
        titleBottom: title.bottom, excerptTop: excerpt.top, excerptBottom: excerpt.bottom,
        citationTop: citation.top, mobile: innerWidth < 640,
        suggestionOnTop: row.contains(topElement),
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    assert.equal(layout.heroOverflow, 'visible', 'the hero must not clip the suggestion list');
    assert.ok(layout.formZ > layout.statsZ, 'suggestions must sit above the report statistics');
    assert.equal(layout.suggestionOnTop, true, 'report statistics must not cover the suggestion text');
    assert.ok(layout.titleBottom <= layout.excerptTop, 'title and matching excerpt must not overlap');
    if (layout.mobile) assert.ok(layout.excerptBottom <= layout.citationTop, 'excerpt and citation must not overlap');
    assert.equal(layout.horizontalOverflow, false);
    await search.press('Escape');
    await list.waitFor({ state: 'hidden' });
    await search.press('ArrowDown');
    await list.waitFor();
    assert.equal(await search.getAttribute('aria-activedescendant'), 'case-suggestion-0');
    const destination = await list.getByRole('option').first().getAttribute('href');
    await search.press('Enter');
    await page.waitForURL(`**${destination}`);
    console.log(`${viewport.width}x${viewport.height}: clear, unclipped suggestions and keyboard navigation passed`);
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
