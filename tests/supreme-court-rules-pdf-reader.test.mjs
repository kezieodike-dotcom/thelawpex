import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('Supreme Court Rules 2024 is registered with its official PDF', async () => {
  const rules = await readFile(projectFile('src/data/courtRules.ts'), 'utf8');

  assert.match(rules, /documentPath\?: string/);
  assert.match(rules, /documentPages\?: number/);
  assert.match(
    rules,
    /id: 'supreme-court'[\s\S]*edition: 'Supreme Court Rules'[\s\S]*year: 2024/,
  );
  assert.match(
    rules,
    /id: 'supreme-court'[\s\S]*documentPath: '\/documents\/court-rules\/supreme-court-rules-2024\.pdf'/,
  );
  assert.match(rules, /id: 'supreme-court'[\s\S]*documentPages: 104/);

  const pdf = await stat(
    projectFile('public/documents/court-rules/supreme-court-rules-2024.pdf'),
  );
  assert.ok(pdf.size > 8_000_000);
});

test('Supreme Court Rules page provides the PDF fallback and identifies the searchable digest', async () => {
  const view = await readFile(projectFile('src/components/modules/CourtRulesView.tsx'), 'utf8');

  assert.match(view, /OfficialPdfReader/);
  assert.match(view, /book\.documentPath \?/);
  assert.match(view, /Searchable rule digest/);
});

test('Supreme Court Rules page exposes the official rules as selectable text', async () => {
  const rules = await readFile(projectFile('src/data/courtRules.ts'), 'utf8');
  const view = await readFile(projectFile('src/components/modules/CourtRulesView.tsx'), 'utf8');
  const reader = await readFile(projectFile('src/components/OfficialTextReader.tsx'), 'utf8');
  const text = await readFile(projectFile('src/data/supremeCourtRules2024Text.ts'), 'utf8');

  assert.match(rules, /documentText\?: string/);
  assert.match(rules, /id: 'supreme-court'[\s\S]*documentText: supremeCourtRules2024Text/);
  assert.match(view, /OfficialTextReader/);
  assert.match(view, /documentText=\{book\.documentText\}/);
  assert.match(reader, /documentPath/);
  assert.match(reader, /lawpex-no-reveal/);
  assert.doesNotMatch(reader, /parseProse/);
  assert.doesNotMatch(reader, /font-mono text-\[12px\]/);
  assert.match(reader, /font-serif text-\[15px\]/);
  assert.match(reader, /<pre/);
  assert.match(reader, /rawText/);
  assert.match(text, /ORDER 1/);
  assert.match(text, /Short title/);
});
