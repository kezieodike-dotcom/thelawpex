import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('Court of Appeal Rules 2021 is registered with its official PDF and text', async () => {
  const rules = await readFile(projectFile('src/data/courtRules.ts'), 'utf8');

  assert.match(rules, /courtOfAppealRules2021Text/);
  assert.match(
    rules,
    /id: 'court-of-appeal'[\s\S]*edition: 'Court of Appeal Rules'[\s\S]*year: 2021/,
  );
  assert.match(
    rules,
    /id: 'court-of-appeal'[\s\S]*documentPath: '\/documents\/court-rules\/court-of-appeal-rules-2021\.pdf'/,
  );
  assert.match(rules, /id: 'court-of-appeal'[\s\S]*documentPages: 97/);
  assert.match(rules, /id: 'court-of-appeal'[\s\S]*documentText: courtOfAppealRules2021Text/);

  const pdf = await stat(
    projectFile('public/documents/court-rules/court-of-appeal-rules-2021.pdf'),
  );
  assert.ok(pdf.size > 10_000_000);
});

test('Court of Appeal Rules text keeps the official page order and raw rule wording', async () => {
  const text = await readFile(projectFile('src/data/courtOfAppealRules2021Text.ts'), 'utf8');

  assert.match(text, /## Page 1/);
  assert.match(text, /COURTOFAPPEALRULES,2021/);
  assert.match(text, /ORDER1/);
  assert.match(text, /Short Title/);
});
