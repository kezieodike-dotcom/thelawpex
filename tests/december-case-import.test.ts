import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { auditCaseRatioCitations } from '../src/components/modules/CaseLawView.tsx';
import { LANDMARK_CASES } from '../src/data/legalData.ts';
import { searchCaseLaws } from '../src/lib/caseSearch.ts';

const expected = [
  ['case-032', 'Echere & Ors v. Ezirike & Ors', '(2006) LDLR-223 (S.C)', 12],
  ['case-033', 'Elabanjo & Anor v. Dawodu', '(2006) LDLR-225 (S.C)', 11],
  ['case-034', 'Elegushi & Ors v. Oseni & Ors', '(2006) LDLR-226 (S.C)', 8],
  ['case-035', 'Emespo J. Continental Ltd. v. Corona Shifah-Rtsgesellschaft Mbh & Co. (Owners of M.V. Concordia)', '(2006) LDLR-227 (S.C)', 6],
  ['case-036', 'Fagbenro v. Arobadi & Ors', '(2006) LDLR-228 (S.C)', 7],
  ['case-037', 'Fasakin Foods (Nig.) Ltd. v. Shosanya', '(2006) LDLR-229 (S.C)', 14],
  ['case-038', 'Gbadamosi & Anor v. Governor of Oyo State & Ors', '(2006) LDLR-300 (S.C)', 2],
  ['case-039', 'Help (Nig.) Ltd. v. Silver Anchor (Nig.) Ltd.', '(2006) LDLR-301 (S.C)', 6],
  ['case-040', 'Ibama v. S.P.D.C. (Nig.) Ltd.', '(2005) LDLR-302 (S.C)', 6],
  ['case-041', 'Ibiyeye v. Fojule & Ors', '(2006) LDLR-304 (S.C)', 2],
  ['case-042', 'Ideozu & Ors v. Ochoma & Ors', '(2006) LDLR-305 (S.C)', 4],
  ['case-043', 'Iderima v. Rivers State Civil Service Commission', '(2005) LDLR-306 (S.C)', 3],
  ['case-044', 'Ifeta v. S.P.D.C. Nig. Ltd.', '(2006) LDLR-307 (S.C)', 9],
  ['case-045', 'Igabele v. State', '(2006) LDLR-308 (S.C)', 15],
  ['case-046', 'Ugoji v. Onukogu', '(2006) LDLR-224 (S.C)', 4],
] as const;

const catalog = JSON.parse(readFileSync(new URL('../src/data/caseCatalog.json', import.meta.url), 'utf8'));

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

    const audited = auditCaseRatioCitations({ ...metadata, ...source });
    assert.equal(audited.length, ratioCount);
    audited.forEach((ratio, index) => {
      assert.ok(ratio.evidence, `${id} ratio ${index + 1} must be found in a judicial opinion`);
      assert.match(ratio.attribution!, /\(Pp?\. \d+(?:-\d+)?, paras?\. [A-G](?:-[A-G])?\)/);
      assert.ok(metadata.ratioDecidendi[index].endsWith(ratio.attribution!), `${id} ratio ${index + 1} must use the reader citation`);
      assert.ok(metadata.ratioSourceReferences?.[index]?.page, `${id} ratio ${index + 1} must expose its exact reader target`);
    });
  });
}

test('all December reports are discoverable from the Case Laws search', () => {
  for (const [id, title] of expected) {
    const query = title.split(/\s+/).slice(0, 2).join(' ');
    assert.ok(searchCaseLaws(catalog, query).some(result => result.judgment.id === id), `${title} must be searchable by party name`);
  }
});

test('judge attributions retain the correct panel spelling', () => {
  const echere = LANDMARK_CASES.find(item => item.id === 'case-032');
  assert.ok(echere);
  assert.match(echere.ratioDecidendi[0], /KATSINA-ALU/);
  assert.doesNotMatch(echere.ratioDecidendi[0], /KASTINA-ALU/);
});
