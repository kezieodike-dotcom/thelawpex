import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultTimeout(60000);
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const key = 'lawpex.admin.case-ingestion.v1';
const heading = 'TEST JUSTICE, J.S.C. (Delivering the Leading Judgment):';
const text = `Original cover material\n\n${heading}\n\nThe court must hear both parties before deciding the substantive dispute. A fair hearing is required in the determination of civil rights.\n\nThe appeal is dismissed for the reasons stated above.`;
const bytes = 'deterministic source fixture';
const fixture = {
  id: 'ingested-verification-test', status: 'Draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  sourceDocument: { fileName: 'test.docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: bytes.length, storageKey: 'ingested-verification-test' },
  sourceExtraction: { text, sha256: createHash('sha256').update(bytes).digest('hex'), textSha256: createHash('sha256').update(text).digest('hex'), pages: 0, incomplete: false },
  fullJudgmentText: text, leadingJudgmentHeading: heading,
  title: 'Verification test v. State', citation: '(2025) LDLR-124 (SC)', court: 'Supreme Court of Nigeria', year: 2025,
  judicialDivision: '', dateDelivered: '1 January 2025', suitNumber: 'SC/TEST', presidingJudges: ['TEST JUSTICE, J.S.C.'],
  appearances: { appellant: '', respondent: '' }, areaOfLaw: 'Evidence', subject: 'Fair hearing',
  proceduralHistory: 'An appeal from a lower court.', factsSummary: 'The parties disputed a hearing.', issuesForDetermination: ['Whether the hearing was fair.'], decisionSummary: 'Appeal dismissed.',
  ratios: [{ heading: 'FAIR HEARING - DUTY - Whether both parties must be heard', exactText: 'The court must hear both parties before deciding the substantive dispute.', attribution: 'TEST JUSTICE, J.S.C.', sourcePage: '999', sourceParagraph: 'G' }],
  principles: ['Fair hearing protects the opportunity of each party to be heard.'], principleSources: ['A fair hearing is required in the determination of civil rights.'],
  authorities: [], statutes: [], practiceNotes: [], warnings: [], duplicateCandidates: [], auditLog: [],
};
try {
  await page.goto(`${base}/admin`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.evaluate(async ({ key, fixture, bytes }) => {
    localStorage.setItem(key, JSON.stringify([fixture]));
    await new Promise((resolve, reject) => {
      const request = indexedDB.open('lawpex-case-sources', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('documents');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const transaction = request.result.transaction('documents', 'readwrite');
        transaction.objectStore('documents').put(new Blob([bytes]), fixture.id);
        transaction.oncomplete = () => { request.result.close(); resolve(); };
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }, { key, fixture, bytes });
  await page.goto(`${base}/admin?view=case-law&record=${fixture.id}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Move to Under Review', exact: true }).click();
  await page.getByRole('button', { name: 'Move to Approved', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Publication blocked' }).waitFor();
  await page.getByRole('button', { name: 'Build and verify report', exact: true }).click();
  await page.getByRole('heading', { name: 'Verified source passages' }).waitFor();
  const checked = await page.evaluate(key => JSON.parse(localStorage.getItem(key))[0], key);
  assert.equal(checked.validation.errors.length, 0);
  assert.notEqual(checked.ratios[0].sourcePage, '999');
  await page.getByRole('button', { name: 'Ratio decidendi (1)', exact: true }).click();
  assert.equal(await page.getByLabel('LAWPEX page or pages').inputValue(), checked.ratios[0].sourcePage);
  assert.equal(await page.getByLabel('LAWPEX page or pages').getAttribute('readonly'), '');
  await page.getByLabel("Reviewer's name").fill('Test editor');
  for (const checkbox of await page.locator('fieldset input[type=checkbox]').all()) await checkbox.check();
  await page.getByRole('button', { name: 'Preview LAWPEX report', exact: true }).click();
  await page.locator('[data-report-page-number="1"]').waitFor();
  await mkdir('tmp/admin-verification', { recursive: true });
  await page.getByRole('region', { name: 'Report verification' }).evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.screenshot({ path: 'tmp/admin-verification/desktop.png' });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow at ${width}`);
  }
  await page.getByRole('region', { name: 'Report verification' }).evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.screenshot({ path: 'tmp/admin-verification/mobile.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Move to Approved', exact: true }).click();
  await page.getByRole('button', { name: 'Approve and publish', exact: true }).click();
  await page.waitForFunction(key => JSON.parse(localStorage.getItem(key))[0].status === 'Published', key);
  assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key))[0].status, key), 'Published');
  assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key))[0].auditLog.filter(event => event.snapshotKey).length, key), 2);
  await page.goto(`${base}/case-law/case/${fixture.id}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Whether both parties must be heard/ }).click();
  await page.getByRole('button', { name: 'Open source passage', exact: true }).click();
  const paragraph = page.locator(`[data-report-page-number="${checked.ratios[0].sourcePage}"] [data-paragraph-label="${checked.ratios[0].sourceParagraph}"]`);
  await paragraph.waitFor();
  assert.match(await paragraph.textContent(), /The court must hear both parties/);
  assert.equal(await page.getByText('The full judgment could not be loaded.', { exact: false }).count(), 0);
  await page.goto(`${base}/admin?view=case-law&record=${fixture.id}`, { waitUntil: 'networkidle' });
  await page.getByLabel('Case title', { exact: true }).last().fill('Edited judgment');
  const edited = await page.evaluate(key => JSON.parse(localStorage.getItem(key))[0], key);
  assert.equal(edited.status, 'Under Review');
  assert.equal(edited.validation, undefined);
  assert.equal(edited.review, undefined);
  assert.deepEqual(errors, []);
  console.log('PASS: blocked approval, exact report references, signoffs, local publication, source navigation, edit invalidation, desktop and mobile.');
} finally { await browser.close(); }
