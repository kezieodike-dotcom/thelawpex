import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  DRAFT_WIZARD_ACCEPTED_EXTENSIONS,
  DRAFT_WIZARD_MAX_FILE_BYTES,
  buildDraftWizardFormData,
  validateDraftWizardFile,
  validateDraftWizardInput,
} from '../src/lib/aiDraftWizard.ts';
import { extractSupportingDocumentText, parseMultipartForm } from '../src/server/draftWizard.ts';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('draft wizard requires case facts and drafting instructions', () => {
  assert.deepEqual(validateDraftWizardInput({ facts: '', instructions: '' }), {
    facts: 'Provide the client\'s case scenario and legal issues.',
    instructions: 'Tell the wizard what legal document to prepare.',
  });

  assert.deepEqual(
    validateDraftWizardInput({
      facts: 'The landlord changed the locks while the tenancy was subsisting.',
      instructions: 'Prepare an originating process for unlawful eviction.',
    }),
    {},
  );
});

test('supporting document validation accepts the approved professional formats', () => {
  assert.deepEqual(DRAFT_WIZARD_ACCEPTED_EXTENSIONS, ['.pdf', '.docx', '.txt', '.md']);
  assert.equal(
    validateDraftWizardFile({ name: 'tenancy-agreement.pdf', size: 2_000_000 }),
    null,
  );
  assert.match(
    validateDraftWizardFile({ name: 'evidence.exe', size: 200 }) ?? '',
    /PDF, DOCX, TXT or MD/,
  );
  assert.match(
    validateDraftWizardFile({
      name: 'brief.docx',
      size: DRAFT_WIZARD_MAX_FILE_BYTES + 1,
    }) ?? '',
    /10 MB/,
  );
});

test('draft wizard serialises the complete matter into multipart form data', () => {
  const file = new File(['notice'], 'quit-notice.txt', { type: 'text/plain' });
  const form = buildDraftWizardFormData({
    matterTitle: 'Okafor unlawful eviction',
    court: 'High Court of Rivers State',
    claimant: 'Chinaza Okafor',
    defendant: 'Prime Quays Limited',
    facts: 'The landlord changed the locks.',
    instructions: 'Draft the appropriate originating process and claim damages.',
    files: [file],
  });

  assert.equal(form.get('matterTitle'), 'Okafor unlawful eviction');
  assert.equal(form.get('facts'), 'The landlord changed the locks.');
  assert.equal(form.getAll('documents').length, 1);
});

test('server parser reads browser multipart fields and supporting files', async () => {
  const form = new FormData();
  form.set('facts', 'The landlord changed the locks.');
  form.set('instructions', 'Prepare the appropriate originating process.');
  form.append('documents', new File(['NOTICE TO QUIT'], 'notice.txt', { type: 'text/plain' }));
  const request = new Request('http://localhost', { method: 'POST', body: form });
  const body = Buffer.from(await request.arrayBuffer());
  const parsed = parseMultipartForm(body, request.headers.get('content-type') ?? '');

  assert.equal(parsed.fields.facts, 'The landlord changed the locks.');
  assert.equal(parsed.fields.instructions, 'Prepare the appropriate originating process.');
  assert.equal(parsed.files[0]?.filename, 'notice.txt');
  assert.equal(parsed.files[0]?.data.toString('utf8'), 'NOTICE TO QUIT');
});

test('assistant route is presented as the Ai Draft Wizard throughout navigation', async () => {
  const [routes, launcher, footer, dashboard] = await Promise.all([
    readFile(projectFile('src/routes.ts'), 'utf8'),
    readFile(projectFile('src/components/AssistantLauncher.tsx'), 'utf8'),
    readFile(projectFile('src/components/Footer.tsx'), 'utf8'),
    readFile(projectFile('src/components/DashboardView.tsx'), 'utf8'),
  ]);

  assert.match(routes, /label: 'Ai Draft Wizard'/);
  assert.match(launcher, /Ai Draft Wizard/);
  assert.match(footer, /Ai Draft Wizard/);
  assert.match(dashboard, /Launch Ai Draft Wizard/);
});

test('draft wizard exposes the approved four-stage drafting workflow', async () => {
  const source = await readFile(projectFile('src/components/AILegalAssistantView.tsx'), 'utf8');

  assert.match(source, /Provide Case Scenario\/Issues/);
  assert.match(source, /Upload Letters\/Documents/);
  assert.match(source, /Provide Draft Instructions/);
  assert.match(source, /Review & Download/);
  assert.match(source, /accept="\.pdf,\.docx,\.txt,\.md"/);
  assert.match(source, /\/api\/ai\/draft-wizard/);
  assert.match(source, /Download \.docx/);
  assert.doesNotMatch(source, /Suggested Litigation Prompts/);
  assert.doesNotMatch(source, /fallbackMsg/);
});

test('server handles multipart legal drafting without persisting uploads', async () => {
  const server = await readFile(projectFile('server.ts'), 'utf8');

  assert.match(server, /express\.raw\(\{ type: 'multipart\/form-data'/);
  assert.match(server, /post\(\s*"\/api\/ai\/draft-wizard"/);
  assert.match(server, /parseMultipartForm/);
  assert.match(server, /extractSupportingDocumentText/);
  assert.match(server, /No uploaded document is persisted/);
  assert.match(server, /facts and drafting instructions are required/i);
});

test('Word export produces a real docx file', async () => {
  const { createDraftDocxBlob } = await import('../src/lib/downloadDraftDocx.ts');
  const blob = createDraftDocxBlob('Notice of Motion', 'IN THE HIGH COURT\n\nBETWEEN:');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const packageText = new TextDecoder().decode(bytes);

  assert.equal(
    blob.type,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  );
  assert.deepEqual(Array.from(bytes.slice(0, 4)), [0x50, 0x4b, 0x03, 0x04]);
  assert.match(packageText, /word\/document\.xml/);
  assert.match(packageText, /\[Content_Types\]\.xml/);
  assert.match(
    extractSupportingDocumentText({
      fieldName: 'documents',
      filename: 'notice-of-motion.docx',
      contentType: blob.type,
      data: Buffer.from(bytes),
    }),
    /IN THE HIGH COURT[\s\S]*BETWEEN:/,
  );
});
