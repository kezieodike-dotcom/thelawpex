import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const caseViewUrl = new URL('../src/components/modules/CaseLawView.tsx', import.meta.url);

test('suit numbers are confined to the first page of the whole-case report', async () => {
  const caseView = await readFile(caseViewUrl, 'utf8');
  const suitNumberReferences = caseView.match(/judgment\.suitNumber/g) ?? [];

  assert.equal(
    suitNumberReferences.length,
    2,
    'only the whole-case copy opening and the visible formal opening page may use the suit number',
  );
  assert.doesNotMatch(caseView, /\{judgment\.citation\}\s*-\s*\{judgment\.suitNumber\}/);
  assert.doesNotMatch(
    caseView.slice(0, caseView.indexOf('const getCaseOpeningText')),
    /judgment\.suitNumber/,
    'court lists and case search must not expose or search by suit number',
  );
  assert.match(caseView, /`Suit No: \$\{judgment\.suitNumber\}`/);
  assert.match(caseView, />Suit No: \{judgment\.suitNumber\}</);
});

test('whole-case pages retain every supporting judge heading before that judge opinion', async () => {
  const caseView = await readFile(caseViewUrl, 'utf8');

  assert.match(caseView, /const reportSectionsFromSourceBlocks/);
  assert.match(caseView, /reportSectionsFromSourceBlocks\(blocks\)\.map/);

  const judgment = JSON.parse(
    await readFile(new URL('../src/data/judgments/case-005.json', import.meta.url), 'utf8'),
  );
  const source = judgment.fullJudgmentText;
  const kalgoHeading = source.indexOf('UMARU ATU KALGO, J.S.C. :', 1000);
  const kalgoOpening = source.indexOf('I have had a preview of the judgment just delivered', kalgoHeading);
  const onnoghenHeading = source.indexOf('WALTER SAMUEL NKANU ONNOGHEN, J.S.C. :', 1000);
  const onnoghenOpening = source.indexOf('This is an appeal against the', onnoghenHeading);

  assert.ok(kalgoHeading > -1 && kalgoOpening > kalgoHeading);
  assert.ok(onnoghenHeading > kalgoOpening && onnoghenOpening > onnoghenHeading);
});
