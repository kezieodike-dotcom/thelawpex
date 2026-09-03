import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('the supplied federal Acts are registered with their official PDF documents', async () => {
  const laws = await readFile(projectFile('src/data/lawsLibrary.ts'), 'utf8');

  assert.match(laws, /documentPath\?: string/);
  assert.match(laws, /id: 'electoral-act-2026'[\s\S]*title: 'Electoral Act 2026'/);
  assert.match(laws, /citation: 'Act No\. 1 of 2026'/);
  assert.match(laws, /documentPath: '\/documents\/laws\/electoral-act-2026\.pdf'/);
  assert.match(
    laws,
    /id: 'civil-aviation-2022'[\s\S]*documentPath: '\/documents\/laws\/civil-aviation-act-2022\.pdf'/,
  );

  const electoralPdf = await stat(projectFile('public/documents/laws/electoral-act-2026.pdf'));
  const aviationPdf = await stat(projectFile('public/documents/laws/civil-aviation-act-2022.pdf'));
  assert.ok(electoralPdf.size > 300_000);
  assert.ok(aviationPdf.size > 900_000);
});

test('federal-law cards display official documents inside an accessible in-page reader', async () => {
  const view = await readFile(
    projectFile('src/components/modules/NigerianLawsView.tsx'),
    'utf8',
  );
  const reader = await readFile(projectFile('src/components/OfficialPdfReader.tsx'), 'utf8');

  assert.match(view, /OfficialPdfReader/);
  assert.match(view, /law\.documentPath \?/);
  assert.match(reader, /Official PDF/);
  assert.match(reader, /<iframe/);
  assert.match(reader, /src=\{`\$\{documentPath\}#view=FitH`\}/);
  assert.match(reader, /title=\{`\$\{title\} official PDF`\}/);
  assert.match(reader, /Open full screen/);
});
