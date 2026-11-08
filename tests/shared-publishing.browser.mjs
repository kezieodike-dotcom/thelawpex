import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const adminBase = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:18081';
const publicBase = process.env.TEST_PUBLIC_URL || 'http://127.0.0.1:18080';
for (const base of [adminBase, publicBase]) assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Run this destructive fixture test only against the local publishing-preview server.');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, timeout: 30_000 });
const admin = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const visitor = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await admin.newPage();
const publicPage = await visitor.newPage();
const errors = [];
for (const target of [page, publicPage]) { target.setDefaultTimeout(30000); target.on('pageerror', error => errors.push(error.message)); }
await mkdir('tmp/admin-shared-ui', { recursive: true });
const saved = () => page.getByText(/All changes saved/).waitFor();
try {
  await page.goto(`${adminBase}/?view=case-law&record=ingested-browser-check`);
  await page.getByLabel('Email', { exact: true }).fill('browser-test@example.com');
  await page.getByLabel('Password', { exact: true }).fill('browser-test-password-2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('heading', { name: 'Editorial review', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Approve and publish', exact: true }).click();
  await page.getByText('Published successfully. This case is now available on the main LAWPEX site.').waitFor();
  await saved();
  await page.screenshot({ path: 'tmp/admin-shared-ui/admin-published.png', fullPage: false });
  await publicPage.goto(`${publicBase}/case-law/case/ingested-browser-check`);
  await publicPage.getByRole('heading', { name: 'Shared publishing browser verification', exact: true }).first().waitFor();
  await publicPage.screenshot({ path: 'tmp/admin-shared-ui/public-case.png', fullPage: false });
  await publicPage.goto(`${publicBase}/case-law`);
  await publicPage.getByLabel('Search the case library', { exact: true }).fill('Shared publishing browser');
  await publicPage.getByRole('link', { name: /Shared publishing browser verification/ }).first().waitFor();
  await publicPage.keyboard.press('Control+k');
  await publicPage.getByPlaceholder('Search all LAWPEX resources: cases, statutes, rules, affidavits, videos, articles...').fill('Shared publishing browser');
  await publicPage.getByRole('button', { name: /Shared publishing browser verification/ }).first().waitFor();
  await page.getByLabel('Case title', { exact: true }).fill('Withdrawn edited case');
  await saved();
  await publicPage.goto(`${publicBase}/case-law/case/ingested-browser-check`);
  await publicPage.getByRole('heading', { name: 'This judgment is not currently published' }).waitFor();

  // Hold a real status response while the user continues editing.
  const existing = await (await admin.request.get(`${adminBase}/api/admin/cases`)).json();
  if (!existing.records.some(item => item.record.id === 'ingested-race-check')) {
    const draft = { ...existing.records[0].record, id: 'ingested-race-check', title: 'Concurrent edit check', status: 'Draft' };
    const created = await admin.request.put(`${adminBase}/api/admin/cases/ingested-race-check`, { headers: { Origin: adminBase }, data: { record: draft, version: 0 } });
    assert.equal(created.status(), 200, await created.text());
  }
  await page.goto(`${adminBase}/?view=case-law&record=ingested-race-check`);
  await page.getByRole('heading', { name: 'Editorial review', exact: true }).waitFor();
  let release;
  let intercepted;
  const reached = new Promise(resolve => { intercepted = resolve; });
  const hold = new Promise(resolve => { release = resolve; });
  await page.route('**/api/admin/cases/ingested-race-check', async route => {
    if (route.request().method() !== 'PUT') return route.continue();
    const response = await route.fetch(); intercepted(); await hold; await route.fulfill({ response });
  }, { times: 1 });
  await page.getByRole('button', { name: 'Move to Under Review', exact: true }).click();
  await reached;
  await page.getByLabel('Case title', { exact: true }).fill('A newer edit during status save');
  release();
  await saved();
  assert.equal(await page.getByLabel('Case title', { exact: true }).inputValue(), 'A newer edit during status save');
  await page.reload();
  assert.equal(await page.getByLabel('Case title', { exact: true }).inputValue(), 'A newer edit during status save');

  const queue = await admin.request.get(`${adminBase}/api/admin/cases`);
  const template = (await queue.json()).records.find(item => item.record.id === 'ingested-race-check').record;
  const imported = { ...template, id: 'ingested-import-check', sourceDocument: { ...template.sourceDocument, storageKey: 'imported-source' } };
  const backup = { format: 'lawpex-editorial-backup-v1', records: [imported], sources: [{ key: 'imported-source', type: 'application/octet-stream', base64: Buffer.from('Imported preserved source').toString('base64') }] };
  let releaseImport;
  let importReached;
  const sourceReached = new Promise(resolve => { importReached = resolve; });
  const sourceHold = new Promise(resolve => { releaseImport = resolve; });
  await page.route('**/api/admin/sources/imported-source', async route => { const response = await route.fetch(); importReached(); await sourceHold; await route.fulfill({ response }); }, { times: 1 });
  await page.getByLabel('Import old workspace backup').setInputFiles({ name: 'legacy-transfer.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await sourceReached;
  await page.getByLabel('Case title', { exact: true }).fill('Edited while importing another record');
  releaseImport();
  await page.getByText(/Imported 1 draft records/).waitFor();
  await saved();
  await page.reload();
  assert.equal(await page.getByLabel('Case title', { exact: true }).inputValue(), 'Edited while importing another record');
  const afterImport = await (await admin.request.get(`${adminBase}/api/admin/cases`)).json();
  assert.ok(afterImport.records.some(item => item.record.id === 'ingested-import-check'));
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: 'tmp/admin-shared-ui/admin-mobile.png', fullPage: false });
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByRole('button', { name: 'Sign in', exact: true }).waitFor();
  assert.equal((await admin.request.get(`${adminBase}/api/admin/cases`)).status(), 401);
  assert.deepEqual(errors, []);
  console.log('PASS: admin login, shared publication, fresh public reader/search/universal search, withdrawal, status-save race, import-save race, responsive layout and logout.');
} finally { await browser.close(); }
