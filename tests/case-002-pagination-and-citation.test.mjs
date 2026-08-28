import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const expectedCitation = '(Pp. 8-9, paras. F-A)';

test('Theresa Udo page seven is filled and its ratio points to the current pages and paragraphs', async () => {
  const judgment = JSON.parse(
    await readFile(new URL('../src/data/judgments/case-002.json', import.meta.url), 'utf8'),
  );
  const source = judgment.fullJudgmentText;

  assert.match(
    source,
    /ordering her to render accounts to respondents\.\n\nOn her issue 5/i,
    'the issue 5 argument must begin as a separate pagination block',
  );
  assert.match(
    source,
    /refusal of the Court to award her damages was wrongful\.\n\nRespondents on their part/i,
    'the respondents argument must begin as a separate pagination block',
  );

  const ratioSection = source.split(/RATIO DECIDENDI/i)[1] ?? '';
  assert.match(ratioSection, new RegExp(expectedCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  const paginatedText = judgment.judgmentPages
    .flatMap((page) => page.paragraphs ?? [])
    .join('\n');
  assert.match(paginatedText, new RegExp(expectedCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  const caseView = await readFile(
    new URL('../src/components/modules/CaseLawView.tsx', import.meta.url),
    'utf8',
  );
  const overrideStart = caseView.indexOf("judgment.id === 'case-002'");
  const overrideEnd = caseView.indexOf("if (judgment.id === 'case-004')", overrideStart);
  assert.match(
    caseView.slice(overrideStart, overrideEnd),
    new RegExp(expectedCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
  );
});
