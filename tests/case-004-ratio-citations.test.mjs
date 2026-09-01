import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const expectedCitations = [
  '(P. 7, paras. A-B)',
  '(P. 7, paras. B-C)',
  '(Pp. 7-8, paras. G-A)',
  '(P. 8, para. A)',
  '(P. 8, para. B)',
  '(P. 8, paras. B-C)',
  '(P. 8, paras. E-F)',
  '(Pp. 8-9, paras. C-B)',
  '(P. 10, paras. B-C)',
  '(P. 10, paras. G-A)',
  '(P. 11, paras. E-F)',
  '(P. 11, paras. G-A)',
  '(P. 11, para. A)',
  '(P. 12, paras. F-A)',
];

const ratioCitationPattern = /^Per (?:MAHMUD MOHAMMED|GEORGE ADESOLA OGUNTADE|IKECHI FRANCIS OGBUAGU)\s*,?\s*J\.?S\.?C\.?\s*(\(Pp?\..+?\))$/gim;

test('Adekunle ratios match the rendered Whole Case pages and A-G bands', async () => {
  const judgment = JSON.parse(
    await readFile(new URL('../src/data/judgments/case-004.json', import.meta.url), 'utf8'),
  );
  const ratioSection = judgment.fullJudgmentText.split('RATIO DECIDENDI')[1] ?? '';
  const sourceCitations = [...ratioSection.matchAll(ratioCitationPattern)].map((match) => match[1]);

  assert.deepEqual(sourceCitations.slice(0, expectedCitations.length), expectedCitations);

  const paginatedText = judgment.judgmentPages
    .flatMap((page) => page.paragraphs)
    .join('\n');
  const paginatedCitations = [...paginatedText.matchAll(ratioCitationPattern)].map(
    (match) => match[1],
  );

  assert.deepEqual(paginatedCitations.slice(0, expectedCitations.length), expectedCitations);

  const caseView = await readFile(
    new URL('../src/components/modules/CaseLawView.tsx', import.meta.url),
    'utf8',
  );
  const overrideStart = caseView.indexOf("if (judgment.id === 'case-004')");
  const overrideEnd = caseView.indexOf("if (judgment.id === 'case-005')", overrideStart);
  const overrideBlock = caseView.slice(overrideStart, overrideEnd);

  for (const citation of expectedCitations) {
    assert.match(overrideBlock, new RegExp(citation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
