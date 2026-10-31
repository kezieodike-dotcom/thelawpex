import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { LANDMARK_CASES } from '../src/data/legalData.ts';
import { auditCaseRatioCitations } from '../src/components/modules/CaseLawView.tsx';

const expected = [
  ['case-013', '(2000) LDLR-219 (CA)', 1],
  ['case-014', '(2006) LDLR-217 (SC)', 10],
  ['case-015', '(2006) LDLR-212 (SC)', 16],
  ['case-016', '(2005) LDLR-213 (SC)', 2],
  ['case-017', '(2006) LDLR-216 (SC)', 13],
  ['case-018', '(2006) LDLR-218 (SC)', 8],
] as const;

for (const [id, citation, count] of expected) {
  test(`${id}: complete source, distinct principles and source-linked ratios`, () => {
    const metadata = LANDMARK_CASES.find(c => c.id === id);
    assert.ok(metadata, `${id} must be registered`);
    assert.equal(metadata.citation, citation);
    assert.equal(metadata.isLandmark, false);
    assert.equal(metadata.ratioDecidendi.length, count);
    assert.ok(metadata.factsSummary && metadata.proceduralHistory && metadata.decisionSummary);
    assert.ok(metadata.issuesForDetermination.length);
    assert.ok(metadata.keyPrinciples.length);
    assert.ok(metadata.keyPrinciples.every(p => !metadata.ratioDecidendi.includes(p)));
    const source = JSON.parse(readFileSync(new URL(`../src/data/judgments/${id}.json`, import.meta.url), 'utf8'));
    const original = new URL(`../public/documents/cases/${id}.docx`, import.meta.url);
    assert.ok(existsSync(original));
    assert.equal(createHash('sha256').update(readFileSync(original)).digest('hex'), source.sourceSha256);
    const extracted = JSON.parse(readFileSync(new URL('../doc/case-imports/october-2026/source-paragraphs.json', import.meta.url), 'utf8'));
    const originalParagraphs: string[] = extracted[source.sourceFile.replace(/\.docx$/, '')];
    const words = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const renderedSource = originalParagraphs.some(p => /JUDGMENT SUMMARY/.test(p))
      ? source.fullJudgmentText
      : source.fullJudgmentText.replace('JUDGMENT SUMMARY', '');
    assert.equal(words(renderedSource), words(originalParagraphs.join(' ')), 'the complete source wording must survive the import');
    assert.ok(source.fullJudgmentText.includes('Delivering the Leading Judgment'));
    const ratios = auditCaseRatioCitations({...metadata, ...source});
    assert.equal(ratios.length, count);
    ratios.forEach((r, i) => {
      assert.ok(r.evidence, `${id} ratio ${i + 1} requires both quotation boundaries`);
      assert.match(r.attribution!, /\(Pp?\. \d+(?:-\d+)?, paras?\. [A-G](?:-[A-G])?\)/);
    });
  });
}
