import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const expectedCitations = [
  '(P. 17, paras. D-G)',
  '(P. 18, paras. A-G)',
  '(Pp. 19-21, paras. A-D)',
  '(Pp. 21-22, paras. E-C)',
  '(P. 22, paras. C-G)',
  '(P. 23, paras. A-E)',
  '(Pp. 23-24, paras. E-C)',
  '(Pp. 24-25, paras. C-D)',
  '(Pp. 25-26, paras. E-E)',
  '(Pp. 26-27, paras. E-C)',
  '(Pp. 27-28, paras. C-D)',
];

const ratioCitationPattern = /^Per OBANDE FESTUS OGBUINYA\s*,?\s*JCA\s*(\(Pp?\..+?\))$/gim;

test('Adeoye Adekunle ratios use the approved page and paragraph references everywhere', async () => {
  const judgment = JSON.parse(
    await readFile(new URL('../src/data/judgments/case-006.json', import.meta.url), 'utf8'),
  );
  const ratioSection = judgment.fullJudgmentText.split('RATIO DECIDENDI')[1] ?? '';
  const sourceCitations = [...ratioSection.matchAll(ratioCitationPattern)].map((match) => match[1]);

  assert.deepEqual(sourceCitations.slice(0, expectedCitations.length), expectedCitations);

  const caseView = await readFile(
    new URL('../src/components/modules/CaseLawView.tsx', import.meta.url),
    'utf8',
  );
  const overrideStart = caseView.indexOf("if (judgment.id === 'case-006')");
  const overrideEnd = caseView.indexOf("if (judgment.id === 'case-007')", overrideStart);
  const overrideBlock = caseView.slice(overrideStart, overrideEnd);

  for (const citation of expectedCitations) {
    assert.match(overrideBlock, new RegExp(citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
