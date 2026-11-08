import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--no-proxy-server'], timeout: 120000 });
const page = await browser.newPage({ hasTouch: true, viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(30000);

try {
  await mkdir('tmp/universal-search-modal', { recursive: true });
  await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'}/`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  const heroSearch = page.getByLabel('Search LAWPEX').first();
  await heroSearch.fill('Tunde');
  await heroSearch.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Universal legal search' });
  await dialog.waitFor();
  const filters = page.getByRole('group', { name: 'Filter search results' });
  const casesFilter = filters.getByRole('button', { name: /Cases/ });
  await casesFilter.waitFor();

  const layout = await filters.evaluate(element => {
    const buttons = [...element.querySelectorAll('button')];
    const bounds = element.getBoundingClientRect();
    return {
      scrollbarWidth: getComputedStyle(element).scrollbarWidth,
      horizontallyScrollable: element.scrollWidth > element.clientWidth,
      minimumButtonHeight: Math.min(...buttons.map(button => button.getBoundingClientRect().height)),
      buttonsInsideRow: buttons.every(button => {
        const buttonBounds = button.getBoundingClientRect();
        return buttonBounds.top >= bounds.top && buttonBounds.bottom <= bounds.bottom;
      }),
      pageOverflow: document.documentElement.scrollWidth > innerWidth,
    };
  });

  assert.equal(layout.scrollbarWidth, 'none');
  assert.equal(layout.horizontallyScrollable, true);
  assert.ok(layout.minimumButtonHeight >= 44);
  assert.equal(layout.buttonsInsideRow, true);
  assert.equal(layout.pageOverflow, false);
  assert.equal(await dialog.getByText(/score \d+/i).count(), 0);
  assert.equal(await filters.getByRole('button', { name: /All/ }).getAttribute('aria-pressed'), 'true');

  const firstResult = dialog.locator('[data-search-result]').first();
  await firstResult.waitFor();
  assert.equal(await firstResult.locator('[data-search-subtitle]').evaluate(element => getComputedStyle(element).whiteSpace), 'normal');
  await page.screenshot({ path: 'tmp/universal-search-modal/mobile.png' });

  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await heroSearch.fill('Tunde');
  await heroSearch.press('Enter');
  await dialog.waitFor();
  const desktopFilters = page.getByRole('group', { name: 'Filter search results' });
  const desktopLayout = await desktopFilters.evaluate(element => {
    const rowBounds = element.getBoundingClientRect();
    return {
      horizontallyScrollable: element.scrollWidth > element.clientWidth,
      filtersVisible: [...element.querySelectorAll('button')].every(button => {
      const buttonBounds = button.getBoundingClientRect();
        return buttonBounds.left >= rowBounds.left
          && buttonBounds.right <= rowBounds.right
          && buttonBounds.top >= rowBounds.top
          && buttonBounds.bottom <= rowBounds.bottom;
      }),
    };
  });
  assert.equal(desktopLayout.horizontallyScrollable, false);
  assert.equal(desktopLayout.filtersVisible, true);
  await page.screenshot({ path: 'tmp/universal-search-modal/desktop.png' });
} finally {
  await browser.close();
}
