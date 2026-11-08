import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--no-proxy-server'], timeout: 120000 });
const page = await browser.newPage({ hasTouch: true });
page.setDefaultTimeout(30000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await mkdir('tmp/case-search-suggestions', { recursive: true });
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'}/`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const heroSearch = page.getByLabel('Search LAWPEX').first();
    const heroPrompt = page.getByTestId('home-search-landmark-prompt');
    await heroPrompt.waitFor({ timeout: 3000 });
    assert.match(await heroPrompt.textContent(), /Mojekwu v\. Mojekwu|Amaechi v\. INEC & Ors/);
    assert.equal(await heroPrompt.getAttribute('aria-hidden'), 'true');
    assert.equal(await heroPrompt.evaluate(element => getComputedStyle(element).pointerEvents), 'none');
    await page.waitForFunction(
      () => Number(getComputedStyle(document.querySelector('[data-testid="home-search-landmark-prompt"]')).opacity) > 0.9,
    );
    await page.screenshot({ path: `tmp/case-search-suggestions/home-${viewport.width}.png` });
    await heroSearch.focus();
    await heroPrompt.waitFor({ state: 'hidden' });
    assert.equal(await heroSearch.getAttribute('placeholder'), 'Ask a legal question, search a citation, statute, rule or draft...');
    await heroSearch.fill('Evidence');
    assert.equal(await heroPrompt.isVisible(), false);
    await heroSearch.fill('');
    await heroSearch.blur();
    await heroPrompt.waitFor();
  }
  for (const viewport of [{ width: 320, height: 560 }, { width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'}/case-law`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const search = page.getByRole('combobox');
    const landmarkPrompt = page.getByTestId('case-search-landmark-prompt');
    await landmarkPrompt.waitFor();
    assert.equal(await page.getByRole('region', { name: 'Case law search results' }).count(), 0);
    assert.equal(await page.locator('a[href^="/case-law/case/"]').count(), 0);
    assert.match(await landmarkPrompt.textContent(), /Mojekwu v\. Mojekwu|Amaechi v\. INEC & Ors/);
    assert.equal(await landmarkPrompt.getAttribute('aria-hidden'), 'true');
    assert.equal(await landmarkPrompt.evaluate(element => getComputedStyle(element).pointerEvents), 'none');
    await page.waitForFunction(
      () => Number(getComputedStyle(document.querySelector('[data-testid="case-search-landmark-prompt"]')).opacity) > 0.9,
    );
    await page.screenshot({ path: `tmp/case-search-suggestions/idle-${viewport.width}.png` });
    if (viewport.width === 320) {
      const firstLandmark = await landmarkPrompt.textContent();
      await page.waitForFunction(
        previous => document.querySelector('[data-testid="case-search-landmark-prompt"]')?.textContent !== previous,
        firstLandmark,
      );
      assert.notEqual(await landmarkPrompt.textContent(), firstLandmark);
    }
    await search.focus();
    await landmarkPrompt.waitFor({ state: 'hidden' });
    await search.fill('Evidence');
    const list = page.getByRole('listbox');
    await list.getByRole('option').first().waitFor();
    const layout = await list.evaluate(element => {
      const form = document.querySelector('form[role="search"]');
      const results = document.querySelector('[aria-label="Case law search results"]');
      const row = element.querySelector('[role="option"]');
      const [title, citation] = row.firstElementChild.children;
      const listBox = element.getBoundingClientRect();
      return {
        formBottom: form.getBoundingClientRect().bottom,
        listTop: listBox.top,
        listBottom: listBox.bottom,
        resultsTop: results.getBoundingClientRect().top,
        titleBottom: title.getBoundingClientRect().bottom,
        citationTop: citation.getBoundingClientRect().top,
        rowOverflow: row.scrollWidth > row.clientWidth,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    assert.ok(layout.formBottom <= layout.listTop, 'quick matches begin below the input');
    assert.ok(layout.listBottom <= layout.resultsTop, 'quick matches never cover the full results');
    assert.ok(layout.titleBottom <= layout.citationTop, 'the case name and citation have separate lines');
    assert.equal(layout.rowOverflow, false);
    assert.equal(layout.horizontalOverflow, false);
    await search.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.screenshot({ path: `tmp/case-search-suggestions/${viewport.width}.png`, animations: 'disabled' });
    if (viewport.width === 320) {
      const results = page.getByRole('region', { name: 'Case law search results' });
      await page.getByRole('button', { name: 'View search results' }).tap();
      await list.waitFor({ state: 'hidden' });
      await results.locator('mark').filter({ hasText: /evidence/i }).first().waitFor();
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Case law search results');
      await search.fill('zzzzunmatched'.repeat(20));
      await page.getByRole('heading', { name: 'No matching case found' }).waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.getByRole('button', { name: 'Clear case search' }).tap();
      assert.equal(await search.inputValue(), '');
      assert.equal(await search.evaluate(element => element === document.activeElement), true);
      assert.equal(await page.getByRole('region', { name: 'Case law search results' }).count(), 0);
      assert.equal(await page.locator('a[href^="/case-law/case/"]').count(), 0);
      await search.fill('Evidence');
      await list.waitFor();
    }
    if (viewport.width === 390) {
      const first = list.getByRole('option').first();
      const destination = await first.getAttribute('href');
      await first.tap();
      await page.waitForURL(`**${destination}`);
      console.log('390x844: readable suggestions and touch navigation passed');
      continue;
    }
    if (viewport.width === 768) {
      const firstResult = page.getByRole('region', { name: 'Case law search results' }).getByRole('link').first();
      const destination = await firstResult.getAttribute('href');
      await firstResult.tap();
      await page.waitForURL(`**${destination}`);
      console.log('768x900: opening a full result while quick matches are visible passed');
      continue;
    }
    await search.press('Escape');
    await list.waitFor({ state: 'hidden' });
    assert.equal(await search.getAttribute('aria-activedescendant'), null);
    await search.press('ArrowUp');
    await list.waitFor();
    assert.equal(await list.getByRole('option').last().getAttribute('aria-selected'), 'true');
    await search.press('ArrowDown');
    await list.waitFor();
    assert.equal(await search.getAttribute('aria-activedescendant'), 'case-suggestion-0');
    const destination = await list.getByRole('option').first().getAttribute('href');
    await search.press('Enter');
    await page.waitForURL(`**${destination}`);
    console.log(`${viewport.width}x${viewport.height}: clear, unclipped suggestions and keyboard navigation passed`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'}/case-law`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  const reducedMotionPrompt = page.getByTestId('case-search-landmark-prompt');
  await reducedMotionPrompt.waitFor();
  assert.equal(await reducedMotionPrompt.evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
