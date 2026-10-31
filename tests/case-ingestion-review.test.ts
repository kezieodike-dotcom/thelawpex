import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locateExactPassage, reviewFingerprint, hasCurrentReview, applyEditorialChange } from '../src/lib/caseReportReview';
import type { AdminCaseRecord } from '../src/data/caseIngestion';
import { compileCaseReport } from '../src/lib/compileCaseReport';
import { toPublishedCaseLaw, formatRatio } from '../src/data/caseIngestion';
import { getReportCitationTargets } from '../src/components/modules/CaseLawView';

const targets = [
  { pageNumber: 9, label: 'G', text: 'The court must hear', judge: 'JUDGE ONE, J.S.C.:' },
  { pageNumber: 10, label: 'A', text: 'both parties before deciding.', judge: 'JUDGE ONE, J.S.C.:' },
];
test('references cover the exact first and last labelled paragraphs across pages', () => {
  assert.deepEqual(locateExactPassage(targets, 'must hear both parties').location, { page: '9-10', paragraph: 'G-A' });
});
test('does not guess a missing, partial-word, ambiguous, or cross-judge quotation', () => {
  assert.ok(locateExactPassage(targets, 'court should hear').error);
  assert.ok(locateExactPassage(targets, 'arties').error);
  assert.ok(locateExactPassage([...targets, ...targets], 'must hear').error);
  assert.ok(locateExactPassage([targets[0], { ...targets[1], judge: 'JUDGE TWO' }], 'must hear both').error);
});
test('punctuation and whitespace differences are harmless, word differences are not', () => {
  assert.ok(locateExactPassage(targets, 'hear\n both parties').location);
  assert.ok(locateExactPassage(targets, 'hear both party').error);
});
test('editorial edits invalidate approved content and signoffs', () => {
  const record = { status: 'Approved', title: 'Original', auditLog: [], review: { source: true }, validation: { errors: [] } } as unknown as AdminCaseRecord;
  const updated = applyEditorialChange(record, { title: 'Changed' });
  assert.equal(updated.status, 'Under Review');
  assert.equal(updated.validation, undefined);
  assert.equal(updated.review, undefined);
});
test('review proof is tied to content and report layout version', () => {
  const record = { title: 'Original', status: 'Under Review', auditLog: [], updatedAt: '', review: undefined } as unknown as AdminCaseRecord;
  record.validation = { fingerprint: reviewFingerprint(record), errors: [], checkedAt: '', evidence: [] };
  assert.equal(hasCurrentReview(record), true);
  assert.equal(hasCurrentReview({ ...record, title: 'Changed' }), false);
});

export function sampleRecord(): AdminCaseRecord {
  const heading = 'TEST JUSTICE, J.S.C. (Delivering the Leading Judgment):';
  const text = `Original cover material\n\n${heading}\n\nThe court must hear both parties before deciding the substantive dispute. A fair hearing is required in the determination of civil rights.\n\nThe appeal is dismissed for the reasons stated above.`;
  return {
    id: 'ingested-test', status: 'Draft', createdAt: '', updatedAt: '',
    sourceDocument: { fileName: 'test.docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 100, storageKey: 'ingested-test' },
    sourceExtraction: { text, sha256: 'fixture', textSha256: 'fixture', pages: 0, incomplete: false },
    fullJudgmentText: text, leadingJudgmentHeading: heading,
    title: 'Test v. State', citation: '(2025) LDLR-124 (SC)', court: 'Supreme Court of Nigeria', year: 2025,
    judicialDivision: '', dateDelivered: '1 January 2025', suitNumber: 'SC/TEST', presidingJudges: ['TEST JUSTICE, J.S.C.'],
    appearances: { appellant: '', respondent: '' }, areaOfLaw: 'Evidence', subject: 'Fair hearing',
    proceduralHistory: 'An appeal from a lower court.', factsSummary: 'The parties disputed a hearing.', issuesForDetermination: ['Whether the hearing was fair.'], decisionSummary: 'Appeal dismissed.',
    ratios: [{ heading: 'FAIR HEARING - DUTY - Whether both parties must be heard', exactText: 'The court must hear both parties before deciding the substantive dispute.', attribution: 'TEST JUSTICE, J.S.C.', sourcePage: '999', sourceParagraph: 'G' }],
    principles: ['Fair hearing protects the opportunity of each party to be heard.'], principleSources: ['A fair hearing is required in the determination of civil rights.'],
    authorities: [], statutes: [], practiceNotes: [], warnings: [], duplicateCandidates: [], auditLog: [],
  };
}
test('builds one report, computes references using the reader and preserves judicial wording', async () => {
  const input = sampleRecord();
  const result = await compileCaseReport(input);
  assert.deepEqual(result.validation?.errors, []);
  assert.ok(hasCurrentReview(result));
  assert.notEqual(result.ratios[0].sourcePage, '999');
  assert.ok(result.preparedReportText?.includes(formatRatio(result.ratios[0])));
  assert.ok(result.preparedReportText?.endsWith(input.fullJudgmentText.slice(input.fullJudgmentText.indexOf(input.leadingJudgmentHeading!))));
  const targets = getReportCitationTargets(toPublishedCaseLaw(result));
  const actual = locateExactPassage(targets, input.ratios[0].exactText);
  assert.equal(actual.location?.page, result.ratios[0].sourcePage);
  assert.equal(actual.location?.paragraph, result.ratios[0].sourceParagraph);
  assert.ok(targets.every(target => !target.text.includes('An appeal from a lower court.')));
});
test('blocks altered source, invented quotations, incorrect judges and repeated principles', async () => {
  for (const edit of [
    (record: AdminCaseRecord) => { record.fullJudgmentText += 'invented'; },
    (record: AdminCaseRecord) => { record.ratios[0].exactText = 'This sentence was never uttered by any judge.'; },
    (record: AdminCaseRecord) => { record.ratios[0].attribution = 'WRONG JUSTICE, J.S.C.'; },
    (record: AdminCaseRecord) => { record.principles[0] = record.ratios[0].exactText; },
  ]) {
    const record = sampleRecord(); edit(record);
    const result = await compileCaseReport(record);
    assert.ok(result.validation?.errors.length);
    assert.equal(hasCurrentReview(result), false);
    assert.equal(result.preparedReportText, undefined);
  }
});
