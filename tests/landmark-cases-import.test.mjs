import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const caseIds = ['case-008', 'case-009', 'case-010', 'case-011', 'case-012'];

test('the five supplied landmark cases have verbatim judgment documents', async () => {
  for (const caseId of caseIds) {
    const document = JSON.parse(
      await readFile(new URL(`../src/data/judgments/${caseId}.json`, import.meta.url), 'utf8'),
    );

    assert.equal(document.id, caseId);
    assert.equal(document.preserveSourceFormatting, true);
    assert.equal(document.verbatimWholeCase, true);
    assert.match(document.fullJudgmentText, /RATIO DECIDENDI/);
    assert.match(document.fullJudgmentText, /Suit No:/);
  }
});

test('the imported cases are the only landmark-tagged case additions', async () => {
  const imported = await readFile(new URL('../src/data/importedLandmarkCases.ts', import.meta.url), 'utf8');
  const legalData = await readFile(new URL('../src/data/legalData.ts', import.meta.url), 'utf8');

  for (const caseId of caseIds) assert.match(imported, new RegExp(`"id": "${caseId}"`));
  assert.match(imported, /"isLandmark": true/);
  assert.match(legalData, /\.\.\.IMPORTED_LANDMARK_CASES/);
  assert.equal((legalData.match(/isLandmark: true/g) ?? []).length, 0);
  assert.equal((legalData.match(/isLandmark: false/g) ?? []).length, 7);
});
