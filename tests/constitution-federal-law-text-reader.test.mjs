import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('the 1999 Constitution is the first Law of the Federation with official PDF and text', async () => {
  const laws = await readFile(projectFile('src/data/lawsLibrary.ts'), 'utf8');

  assert.match(laws, /constitution1999Text/);
  assert.match(
    laws,
    /export const FEDERAL_LAWS: FederalLawEntry\[\] = \[\s*\/\/ Constitution & Courts\s*\{\s*id: 'const-1999'/,
  );
  assert.match(
    laws,
    /id: 'const-1999'[\s\S]*documentPath: '\/documents\/laws\/constitution-1999-as-amended\.pdf'/,
  );
  assert.match(laws, /id: 'const-1999'[\s\S]*documentPages: 280/);
  assert.match(laws, /id: 'const-1999'[\s\S]*documentText: constitution1999Text/);

  const pdf = await stat(projectFile('public/documents/laws/constitution-1999-as-amended.pdf'));
  assert.ok(pdf.size > 15_000_000);
});

test('federal-law cards can render official law text before falling back to PDF-only display', async () => {
  const view = await readFile(projectFile('src/components/modules/NigerianLawsView.tsx'), 'utf8');
  const text = await readFile(projectFile('src/data/constitution1999Text.txt'), 'utf8');

  assert.match(view, /OfficialTextReader/);
  assert.match(view, /documentText=\{law\.documentText\}/);
  assert.match(text, /## Page 1/);
  assert.match(text, /CONSTITUTION/);
  assert.match(text, /FEDERAL[\s\S]*REPUBLIC[\s\S]*OF[\s\S]*NIGERIA/);
});
