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
import * as draftPrompts from '../src/server/draftWizard.ts';

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

test('agreement validation asks for a transaction description, not a case scenario', () => {
  assert.deepEqual(validateDraftWizardInput({ draftType: 'agreement', facts: ' ', instructions: '' }), {
    facts: 'Describe the nature of the agreement and the transaction.',
    instructions: 'Tell the wizard what agreement to prepare and any specific terms.',
  });
  assert.deepEqual(validateDraftWizardInput({
    draftType: 'agreement', facts: 'A buyer is acquiring land in Port Harcourt.',
    instructions: 'Prepare a deed of assignment with completion conditions.',
  }), {});
});

test('agreement requests carry optional title, parties and supporting documents without court fields', () => {
  const form = buildDraftWizardFormData({
    draftType: 'agreement', agreementTitle: ' Deed of Assignment ',
    agreementParties: ' Ada: assignor; Chidi: assignee ',
    court: 'Stale court value', claimant: 'Stale claimant', defendant: 'Stale defendant',
    facts: ' Sale of land in Rivers State. ', instructions: ' Include completion conditions. ',
    files: [new File(['Existing title'], 'title.txt')],
  });
  assert.equal(form.get('draftType'), 'agreement');
  assert.equal(form.get('agreementTitle'), 'Deed of Assignment');
  assert.equal(form.get('agreementParties'), 'Ada: assignor; Chidi: assignee');
  assert.equal(form.get('facts'), 'Sale of land in Rivers State.');
  assert.equal(form.getAll('documents').length, 1);
  for (const field of ['court', 'claimant', 'defendant', 'matterTitle']) assert.equal(form.has(field), false);
});

test('server prepares an agreement-specific brief and professional review notice', () => {
  const build = draftPrompts.buildDraftWizardPrompt;
  assert.equal(typeof build, 'function');
  const result = build({
    draftType: 'agreement', agreementTitle: 'Deed of Mortgage',
    agreementParties: 'Mortgagor: Ada; Mortgagee: Chidi',
    facts: 'Security over land in Lagos.', instructions: 'Secure the agreed loan.',
    court: 'Do not use this court',
  }, 'Existing title supplied.', false);
  assert.match(result.prompt, /AGREEMENT TITLE: Deed of Mortgage/);
  assert.match(result.prompt, /PARTIES AND THEIR ROLES: Mortgagor: Ada; Mortgagee: Chidi/);
  assert.match(result.prompt, /NATURE OF THE AGREEMENT/);
  assert.match(result.prompt, /Existing title supplied/);
  assert.doesNotMatch(result.prompt, /CLAIMANT|DEFENDANT|CASE SCENARIO|Do not use this court/);
  assert.match(result.systemInstruction, /Do not add court headings/);
  assert.match(result.systemInstruction, /Never invent/);
  assert.match(result.systemInstruction, /execution|signature/);
  assert.match(result.notice, /execution/);
  assert.equal(result.documentTitle, 'Deed of Mortgage');
});

test('agreement title, parties and uploads remain optional; legacy requests stay court drafts', () => {
  const build = draftPrompts.buildDraftWizardPrompt;
  assert.equal(typeof build, 'function');
  const agreement = build({ draftType: 'agreement', facts: 'A service arrangement.', instructions: 'Draft terms.' }, '', false);
  assert.equal(agreement.documentTitle, 'LAWPEX Legal Agreement');
  assert.match(agreement.prompt, /PARTIES AND THEIR ROLES: Not supplied/);
  const court = build({ facts: 'An unlawful eviction.', instructions: 'Claim damages.', court: 'High Court of Rivers State' }, '', true);
  assert.match(court.prompt, /COURT \/ JURISDICTION: High Court of Rivers State/);
  assert.match(court.prompt, /CASE SCENARIO AND ISSUES/);
  assert.match(court.prompt, /attached PDF/);
  assert.throws(() => build({ draftType: 'other' }, '', false), /Invalid draft type/);
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

  assert.match(source, /Case scenario and issues/);
  assert.match(source, /Add the documents behind the brief/);
  assert.match(source, /Lawyer's drafting instruction/);
  assert.match(source, /Generated working draft/);
  assert.match(source, /accept="\.pdf,\.docx,\.txt,\.md"/);
  assert.match(source, /\/api\/ai\/draft-wizard/);
  assert.match(source, /Download \.docx/);
  assert.doesNotMatch(source, /Suggested Litigation Prompts/);
  assert.doesNotMatch(source, /fallbackMsg/);
});

test('wizard step controls allow direct navigation through all four stages', async () => {
  const source = await readFile(projectFile('src/components/AILegalAssistantView.tsx'), 'utf8');

  assert.match(source, /const selectStage = \(nextStage: WizardStage\) => \{\s*setStage\(nextStage\);/);
  assert.match(source, /Your draft will appear here/);
  assert.match(source, /onClick=\{\(\) => selectStage\(3\)\}/);
});

test('the first wizard tool offers court documents and legal agreements separately', async () => {
  const source = await readFile(projectFile('src/components/AILegalAssistantView.tsx'), 'utf8');
  assert.match(source, /Court Ready Working Document/);
  assert.match(source, /Legal Agreement/);
  assert.match(source, /AgreementDraftPanel/);
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
