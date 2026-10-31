import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

// Run against a started LAWPEX server. Set PLAYWRIGHT_MODULE to a local Playwright installation.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }), headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultTimeout(30000);
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const storageKey = 'lawpex.admin.case-ingestion.v1';
const overflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
await mkdir('tmp/admin-ui', { recursive: true });
try {
  await page.goto(`${base}/admin`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.getByRole('heading', { name: 'Your editorial overview' }).waitFor();
  await overflow();
  assert.equal(await page.locator('.admin-metric').count(), 4);
  assert.equal(await page.getByText('Your editorial queue is clear').count(), 1);
  await page.screenshot({ path: 'tmp/admin-ui/desktop-overview.png', fullPage: true });

  await page.getByRole('button', { name: 'Published library', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search published cases' }).fill('Amayo');
  assert.equal(await page.locator('.admin-table tbody tr').count(), 2);
  await page.getByLabel('Filter by court').selectOption('Court of Appeal');
  assert.equal(await page.locator('.admin-table tbody tr').count(), 1);
  await page.getByRole('textbox', { name: 'Search published cases' }).fill('no-such-case-xyz');
  await page.getByRole('heading', { name: 'No matching cases' }).waitFor();

  const fixture = {
    id: 'ingested-ui-test', status: 'Approved', createdAt: '2026-10-30T12:00:00Z', updatedAt: '2026-10-30T12:00:00Z',
    sourceDocument: { fileName: 'editorial-test.docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 100, storageKey: 'ui-test' },
    title: 'Editorial test judgment', citation: '(2026) LDLR-999 (SC)', court: 'Supreme Court of Nigeria', year: 2026,
    judicialDivision: '', dateDelivered: '', suitNumber: '', presidingJudges: [], appearances: { appellant: '', respondent: '' },
    areaOfLaw: '', subject: 'Test', proceduralHistory: '', factsSummary: '', issuesForDetermination: [], decisionSummary: '',
    ratios: [{ heading: 'Test ratio', exactText: 'Unchanged judicial quotation.', attribution: 'Test judge', sourcePage: '7', sourceParagraph: 'C-D' }],
    principles: ['Distinct principle'], authorities: [], statutes: [], practiceNotes: [], fullJudgmentText: 'Original text.', warnings: [], duplicateCandidates: [], auditLog: [],
  };
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify([value])), { key: storageKey, value: fixture });
  await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('lawpex-case-sources', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('documents');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { request.result.close(); resolve(); };
  }));
  await page.goto(`${base}/admin?view=case-law&record=ingested-ui-test`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Editorial review', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Ratio decidendi (1)', exact: true }).click();
  assert.equal(await page.getByLabel('LAWPEX paragraph or paragraphs').inputValue(), '');
  assert.equal(await page.getByLabel('LAWPEX paragraph or paragraphs').getAttribute('readonly'), '');
  await page.getByLabel('Ratio heading').fill('Edited test ratio');
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key))[0], storageKey);
  assert.equal(saved.ratios[0].heading, 'Edited test ratio');
  assert.equal(saved.ratios[0].exactText, fixture.ratios[0].exactText);
  await page.getByRole('button', { name: 'Move to Approved', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Publication blocked' }).waitFor();
  assert.equal(await page.evaluate((key) => JSON.parse(localStorage.getItem(key))[0].status, storageKey), 'Under Review');
  await page.getByRole('button', { name: 'Principles & authorities', exact: true }).click();
  assert.equal(await page.getByLabel('Principles of law').inputValue(), '1. Distinct principle');
  await page.getByRole('button', { name: 'Source document', exact: true }).click();
  assert.equal(await page.getByLabel('Extracted source text (read-only)').inputValue(), 'Original text.');
  await page.getByRole('button', { name: 'Audit history', exact: true }).click();
  await page.getByText('Editorial field edited', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Ratio decidendi (1)', exact: true }).click();
  await page.screenshot({ path: 'tmp/admin-ui/desktop-review.png', fullPage: true });
  await overflow();

  await page.goto(`${base}/admin?view=case-law&status=Draft`, { waitUntil: 'networkidle' });
  await page.getByText('No records match this search or status.').waitFor();
  await page.getByRole('button', { name: 'All (1)', exact: true }).click();
  await page.getByLabel('Search editorial queue').fill('editorial test');
  await page.getByRole('button', { name: /Editorial test judgment/ }).waitFor();
  await page.getByLabel('Search editorial queue').fill('not-found');
  await page.getByText('No records match this search or status.').waitFor();

  // Exercise upload UI with a deterministic service response; no real case is published.
  await page.route('**/api/admin/case-law/extract', (route) => route.fulfill({ json: { draft: { title: 'Uploaded UI test', fullJudgmentText: 'Preserved test source.' } } }));
  await page.locator('input[type=file]').setInputFiles({ name: 'ui-test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nUI test source\n%%EOF') });
  await page.getByRole('button', { name: 'Extract and create review draft' }).click();
  await page.getByRole('heading', { name: 'Uploaded UI test', exact: true }).waitFor();
  assert.equal(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).length, storageKey), 2);

  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
    await overflow();
    if (width < 768) {
      await page.getByRole('button', { name: 'Open admin navigation' }).click();
      await page.getByRole('button', { name: /^Case workspace/ }).click();
      assert.equal(await page.getByRole('button', { name: 'Open admin navigation' }).getAttribute('aria-expanded'), 'false');
    } else {
      await page.getByRole('button', { name: /^Case workspace/ }).click();
    }
    await page.getByRole('heading', { name: 'Upload a judgment', exact: true }).waitFor();
    await overflow();
    await page.getByRole('button', { name: /Editorial test judgment/ }).click();
    await page.getByRole('button', { name: 'Ratio decidendi (1)', exact: true }).click();
    await overflow();
    if (width === 390) await page.screenshot({ path: 'tmp/admin-ui/mobile-review.png', fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'tmp/admin-ui/mobile-overview.png', fullPage: true });
  assert.deepEqual(errors, []);
  console.log('PASS: overview, library search, court filter, queue filtering, source upload, editorial sections, saved edits, publication guard, mobile navigation, responsive widths and no browser errors.');
} catch (error) {
  await page.screenshot({ path: 'tmp/admin-ui/failure.png', fullPage: true });
  console.error(await page.locator('.admin-body').innerText());
  throw error;
} finally {
  await context.close();
  await browser.close();
}
