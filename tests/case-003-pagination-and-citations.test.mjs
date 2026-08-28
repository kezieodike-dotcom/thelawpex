import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const expectedCitations = [
  '(P. 7, paras. C-D)',
  '(P. 7, paras. D-E)',
  '(P. 8, para. C)',
  '(P. 8, paras. C-D)',
  '(P. 9, paras. B-C)',
];

const citationPattern = /^Per\s+.+?JSC\s*(\(Pp?\..+?\))$/gim;

test('Adewuyi uses compact pages and ratio references matching the rendered A-G bands', async () => {
  const judgment = JSON.parse(
    await readFile(new URL('../src/data/judgments/case-003.json', import.meta.url), 'utf8'),
  );
  const ratioSection = judgment.fullJudgmentText.split(/RATIO DECIDENDI/i)[1] ?? '';
  const sourceCitations = [...ratioSection.matchAll(citationPattern)].map((match) => match[1]);

  assert.deepEqual(sourceCitations.slice(0, expectedCitations.length), expectedCitations);

  const paginatedText = judgment.judgmentPages
    .flatMap((page) => page.paragraphs ?? [])
    .join('\n');
  for (const citation of expectedCitations) {
    assert.match(paginatedText, new RegExp(citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  const caseView = await readFile(
    new URL('../src/components/modules/CaseLawView.tsx', import.meta.url),
    'utf8',
  );
  assert.match(
    caseView,
    /denseSourceJudgmentIds = new Set\(\['case-003', 'case-004'\]\)/,
  );

  const citationFunctionStart = caseView.indexOf('const manualRatioCitation');
  const overrideStart = caseView.indexOf("if (judgment.id === 'case-003')", citationFunctionStart);
  const overrideEnd = caseView.indexOf("if (judgment.id === 'case-004')", overrideStart);
  const overrideBlock = caseView.slice(overrideStart, overrideEnd);
  for (const citation of expectedCitations) {
    assert.match(overrideBlock, new RegExp(citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
