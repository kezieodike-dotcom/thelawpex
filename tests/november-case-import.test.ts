import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { auditCaseRatioCitations } from '../src/components/modules/CaseLawView.tsx';
import { LANDMARK_CASES } from '../src/data/legalData.ts';
import { searchCaseLaws } from '../src/lib/caseSearch.ts';

const expected = [
  ['case-019', 'Arowolo v. Akapo & Ors', '(2006) LDLR-591 (S.C)', 1],
  ['case-020', 'Auto Import Export v. Adebayo & Ors', '(2005) LDLR-693 (S.C)', 19],
  ['case-021', 'Awoyoolu & Anor v. Aro & Anor', '(2006) LDLR-694 (S.C)', 8],
  ['case-022', 'Bhojsons Plc v. Kalio', '(2006) LDLR-695 (S.C)', 10],
  ['case-023', 'Boniface Anyika & Company Lagos Nig. Ltd. v. Uzor', '(2006) LDLR-695 (S.C)', 10],
  ['case-024', 'Chigbu v. Tonimas Nig. Ltd. & Anor', '(2006) LDLR-696 (S.C)', 9],
  ['case-025', "Cotecna Int'l Ltd. v. Ivory Merchant Bank Ltd", '(2006) LDLR-697 (S.C)', 5],
  ['case-026', 'Dada v. Dosunmu', '(2006) LDLR-699 (S.C)', 17],
  ['case-027', 'Dagayya v. State', '(2006) LDLR-700 (S.C)', 20],
  ['case-028', 'Duke v. Akpabuyo L.G.', '(2006) LDLR-220 (S.C)', 13],
  ['case-029', 'Ebhota & Ors v. Plateau Investment and Property Development Co. Ltd', '(2006) LDLR-221 (S.C)', 3],
  ['case-030', 'Ebre & Ors v. State', '(2001) LDLR-222 (S.C)', 9],
  ['case-031', 'Nwankwoala & Anor v. State', '(2006) LDLR-698 (S.C)', 7],
] as const;

const sourceParagraphs = JSON.parse(readFileSync(new URL('../doc/case-imports/november-2026/source-paragraphs.json', import.meta.url), 'utf8'));
const catalog = JSON.parse(readFileSync(new URL('../src/data/caseCatalog.json', import.meta.url), 'utf8'));
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

for (const [id, title, citation, ratioCount] of expected) {
  test(`${id}: reviewed report preserves source and resolves every ratio`, () => {
    const metadata = LANDMARK_CASES.find(item => item.id === id);
    assert.ok(metadata, `${id} must be registered`);
    assert.equal(metadata.title, title);
    assert.equal(metadata.citation, citation);
    assert.equal(metadata.reportFormatVersion, 'lawpex-reviewed-v1');
    assert.equal(metadata.isLandmark, false);
    assert.equal(metadata.ratioDecidendi.length, ratioCount);
    assert.ok(metadata.factsSummary && metadata.proceduralHistory && metadata.decisionSummary);
    assert.ok(metadata.issuesForDetermination.length);
    assert.ok(metadata.keyPrinciples.length);
    assert.ok(metadata.keyPrinciples.every(principle => !metadata.ratioDecidendi.includes(principle)));

    const source = JSON.parse(readFileSync(new URL(`../src/data/judgments/${id}.json`, import.meta.url), 'utf8'));
    const original = new URL(`../public/documents/cases/${id}.docx`, import.meta.url);
    assert.ok(existsSync(original));
    assert.equal(createHash('sha256').update(readFileSync(original)).digest('hex'), source.sourceSha256);
    const originalText = normalize(sourceParagraphs[source.sourceFile.replace(/\.docx$/i, '')].join(' '));
    const renderedText = normalize(source.fullJudgmentText);
    const leadingMarker = renderedText.includes('deliveringtheleadruling') ? 'deliveringtheleadruling' : 'deliveringtheleadingjudgment';
    assert.ok(originalText.includes(leadingMarker) && renderedText.includes(leadingMarker));
    assert.equal(renderedText.slice(renderedText.indexOf(leadingMarker)), originalText.slice(originalText.indexOf(leadingMarker)), 'the complete judicial opinions must remain verbatim');

    const audited = auditCaseRatioCitations({ ...metadata, ...source });
    assert.equal(audited.length, ratioCount);
    audited.forEach((ratio, index) => {
      assert.ok(ratio.evidence, `${id} ratio ${index + 1} must be found in a judicial opinion`);
      assert.match(ratio.attribution!, /\(Pp?\. \d+(?:-\d+)?, paras?\. [A-G](?:-[A-G])?\)/);
      assert.ok(metadata.ratioDecidendi[index].endsWith(ratio.attribution!), `${id} ratio ${index + 1} must use the reader citation`);
    });
  });
}

test('all November reports are discoverable from the search-only Case Laws landing page', () => {
  for (const [id, title] of expected) {
    const query = title.split(/\s+/).slice(0, 2).join(' ');
    assert.ok(searchCaseLaws(catalog, query).some(result => result.judgment.id === id), `${title} must be searchable by party name`);
  }
});
