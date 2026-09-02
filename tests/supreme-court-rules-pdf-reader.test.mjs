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

test('Supreme Court Rules page embeds the PDF and identifies the searchable digest', async () => {
  const view = await readFile(projectFile('src/components/modules/CourtRulesView.tsx'), 'utf8');

  assert.match(view, /OfficialPdfReader/);
  assert.match(view, /book\.documentPath &&/);
  assert.match(view, /Searchable rule digest/);
});
