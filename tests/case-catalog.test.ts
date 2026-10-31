import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { LANDMARK_CASES } from '../src/data/legalData.ts';
import { searchCaseLaws } from '../src/lib/caseSearch.ts';

const catalog = JSON.parse(readFileSync(new URL('../src/data/caseCatalog.json', import.meta.url), 'utf8'));
test('the lightweight catalogue retains every case and its current display metadata', () => {
  assert.equal(catalog.length, LANDMARK_CASES.length);
  LANDMARK_CASES.forEach((source, i) => {
    for (const key of ['id', 'title', 'citation', 'court', 'year', 'areaOfLaw', 'subject', 'isLandmark']) {
      assert.deepEqual(catalog[i][key], source[key], `${source.id} ${key}`);
    }
    assert.deepEqual(catalog[i].ratioDecidendi, []);
    assert.deepEqual(catalog[i].keyPrinciples, []);
    assert.equal(catalog[i].fullJudgmentText, undefined);
  });
  assert.ok(Buffer.byteLength(JSON.stringify(catalog)) < 16000);
});
test('party-name suggestions work without downloading full ratios', () => {
  assert.ok(searchCaseLaws(catalog, 'Ad').some(result => result.judgment.id === 'case-006'));
  assert.equal(searchCaseLaws(catalog, 'Mojekwu')[0].judgment.id, 'case-008');
});
