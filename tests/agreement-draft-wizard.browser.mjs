import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true, args: ['--no-proxy-server'], timeout: 60000,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const output = 'tmp/agreement-draft-wizard';
await mkdir(output, { recursive: true });
try {
  await page.goto(`${base}/ai-assistant`, { waitUntil: 'commit', timeout: 90000 });
  const courtChoice = page.getByRole('button', { name: 'Court Ready Working Document', exact: true });
  const agreementChoice = page.getByRole('button', { name: 'Legal Agreement', exact: true });
  await agreementChoice.waitFor({ timeout: 120000 });
  assert.equal(await page.getByLabel('Case scenario and issues', { exact: false }).isVisible(), false);
  await courtChoice.click();
  await page.getByLabel('Matter title', { exact: false }).fill('Court brief retained');
  await page.getByLabel('Case scenario and issues', { exact: false }).fill('An unlawful eviction.');
  await agreementChoice.click();
  const panel = page.getByRole('region', { name: 'Legal agreement draft' });
  assert.equal(await panel.getByText('Your agreement draft will appear here', { exact: true }).isVisible(), true);
  assert.equal(await panel.getByLabel('Claimant / Applicant', { exact: false }).count(), 0);
  assert.equal(await panel.getByLabel('Court or jurisdiction', { exact: false }).count(), 0);
  await panel.getByRole('button', { name: 'Generate agreement', exact: true }).click();
  await panel.getByText('Describe the nature of the agreement and the transaction.', { exact: true }).waitFor();
  await panel.getByLabel('Agreement title', { exact: false }).fill('Deed of Assignment');
  await panel.getByLabel('Names of parties', { exact: false }).fill('Ada: assignor; Chidi: assignee');
  await panel.getByLabel('Describe the nature', { exact: false }).fill('The assignor agrees to sell land in Port Harcourt to the assignee.');
  await panel.getByLabel('Drafting instructions', { exact: false }).fill('Draft a deed with completion conditions.');
  await panel.locator('input[type=file]').setInputFiles({ name: 'title.txt', mimeType: 'text/plain', buffer: Buffer.from('Existing title particulars') });
  await courtChoice.click();
  assert.equal(await page.getByLabel('Matter title', { exact: false }).inputValue(), 'Court brief retained');
  await agreementChoice.click();
  assert.equal(await panel.getByLabel('Agreement title', { exact: false }).inputValue(), 'Deed of Assignment');
  assert.equal(await panel.getByText('title.txt', { exact: true }).isVisible(), true);
  await page.getByRole('button', { name: 'Board Assistant Minutes, reports and board packs', exact: false }).click();
  await page.getByRole('button', { name: 'Draft Wizard Court documents and legal agreements', exact: false }).click();
  assert.equal(await panel.getByLabel('Agreement title', { exact: false }).inputValue(), 'Deed of Assignment');

  let uploaded;
  await page.route('**/api/ai/draft-wizard', async (route) => {
    const request = route.request();
    const form = await new Response(request.postDataBuffer(), { headers: { 'content-type': request.headers()['content-type'] } }).formData();
    uploaded = form;
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.fulfill({ json: { documentTitle: 'Deed of Assignment', draftText: 'DEED OF ASSIGNMENT\n\nBETWEEN ADA AND CHIDI\n\nCompletion conditions supplied for review.', documentCount: 1, notice: 'Counsel must verify terms and execution requirements.' } });
  });
  await panel.getByRole('button', { name: 'Generate agreement', exact: true }).click();
  const draft = panel.getByRole('textbox', { name: 'Generated agreement draft' });
  await draft.waitFor();
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Generated agreement draft');
  assert.equal(uploaded.get('draftType'), 'agreement');
  assert.equal(uploaded.get('agreementParties'), 'Ada: assignor; Chidi: assignee');
  assert.equal(uploaded.has('claimant'), false);
  assert.equal(await uploaded.get('documents').text(), 'Existing title particulars');
  await draft.fill('DEED OF ASSIGNMENT\n\nReviewed agreement wording.');
  const downloading = page.waitForEvent('download');
  await panel.getByRole('button', { name: 'Download .docx', exact: true }).click();
  const download = await downloading;
  assert.match(download.suggestedFilename(), /\.docx$/);
  const bytes = await readFile(await download.path());
  assert.equal(bytes.readUInt32LE(0), 0x04034b50);
  assert.ok(bytes.includes(Buffer.from('Reviewed agreement wording.')));
  await page.screenshot({ path: `${output}/desktop.png`, fullPage: true });

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await agreementChoice.scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No horizontal overflow at ${width}px`);
    await page.screenshot({ path: `${output}/mobile-${width}.png`, fullPage: true });
  }
  await panel.getByRole('button', { name: 'Start agreement again', exact: true }).click();
  assert.equal(await panel.getByLabel('Agreement title', { exact: false }).inputValue(), '');
  assert.equal(await panel.getByText('title.txt', { exact: true }).count(), 0);
  await panel.getByLabel('Describe the nature', { exact: false }).fill('A service arrangement.');
  await panel.getByLabel('Drafting instructions', { exact: false }).fill('Prepare a services agreement.');
  await page.unroute('**/api/ai/draft-wizard');
  await page.route('**/api/ai/draft-wizard', (route) => route.fulfill({ status: 503, json: { error: 'Drafting temporarily unavailable.' } }));
  await panel.getByRole('button', { name: 'Generate agreement', exact: true }).click();
  await panel.getByRole('alert').filter({ hasText: 'Drafting temporarily unavailable.' }).waitFor();
  assert.equal(await panel.getByLabel('Describe the nature', { exact: false }).inputValue(), 'A service arrangement.');
  await courtChoice.click();
  assert.equal(await page.getByLabel('Matter title', { exact: false }).inputValue(), 'Court brief retained');
  assert.deepEqual(errors, []);
  console.log('PASS: separate court/agreement briefs, validation, upload payload, generation preview, editing, real DOCX, reset, errors and responsive widths.');
} catch (error) {
  console.error(error);
  console.error('Page:', page.url(), 'Browser errors:', errors);
  await page.screenshot({ path: `${output}/failure.png`, fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
