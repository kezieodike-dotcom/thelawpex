import type { AdminCaseRecord, CaseIngestionStatus } from '../data/caseIngestion';

export const REPORT_LAYOUT_VERSION = 'lawpex-reviewed-v1';
export interface PassageTarget { pageNumber: number; label?: string; text: string; judge?: string }
export interface PassageEvidence {
  item: string;
  page: string;
  paragraph: string;
  firstText: string;
  lastText: string;
  judge: string;
}
export interface ReportValidation {
  fingerprint: string;
  checkedAt: string;
  errors: string[];
  evidence: PassageEvidence[];
}

const words = (value: string) => value.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
export const normalizedWords = (value: string) => words(value).join(' ');

// Match complete word sequences, never a guessed start/end or a fuzzy partial quote.
export function createExactPassageIndex(targets: PassageTarget[]) {
  const tokens: string[] = [];
  const owners: PassageTarget[] = [];
  for (const target of targets) {
    for (const word of words(target.text)) { tokens.push(word); owners.push(target); }
  }
  return { tokens, owners };
}
export function locateExactPassage(targets: PassageTarget[] | ReturnType<typeof createExactPassageIndex>, quotation: string) {
  const needle = words(quotation);
  const { tokens, owners } = Array.isArray(targets) ? createExactPassageIndex(targets) : targets;
  if (!needle.length) return { error: 'The source quotation is empty.' };
  const hits: number[] = [];
  for (let start = 0; start <= tokens.length - needle.length; start++) {
    if (tokens[start] !== needle[0]) continue;
    if (needle.every((word, index) => tokens[start + index] === word)) hits.push(start);
    if (hits.length > 1) break;
  }
  if (hits.length !== 1) return { error: hits.length ? 'Quotation occurs more than once. Supply a longer unique passage.' : 'Exact quotation was not found in the labelled judgment. No reference has been guessed.' };
  const start = hits[0];
  const end = start + needle.length - 1;
  const first = owners[start];
  const last = owners[end];
  if (!first.label || !last.label || !first.judge || owners.slice(start, end + 1).some(target => target.judge !== first.judge)) {
    return { error: 'Quotation must lie within labelled paragraphs of one identified judge.' };
  }
  const page = first.pageNumber === last.pageNumber ? String(first.pageNumber) : `${first.pageNumber}-${last.pageNumber}`;
  const paragraph = first.pageNumber === last.pageNumber && first.label === last.label ? first.label : `${first.label}-${last.label}`;
  return { location: { page, paragraph }, first, last };
}

// This detects stale local review, not authenticity. Server-side signing/auth is required for shared publishing.
export function reviewFingerprint(record: AdminCaseRecord) {
  const { validation, review, status, updatedAt, auditLog, ...content } = record;
  const text = JSON.stringify([REPORT_LAYOUT_VERSION, content]);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
  return `${text.length}:${(hash >>> 0).toString(16)}`;
}
export const hasCurrentReview = (record: AdminCaseRecord) => Boolean(record.validation && !record.validation.errors.length && record.validation.fingerprint === reviewFingerprint(record));
export const hasEditorialSignoff = (record: AdminCaseRecord) => Boolean(record.review?.reviewer.trim() && record.review.source && record.review.metadata && record.review.ratios && record.review.principles);

export function publicationGaps(record: AdminCaseRecord) {
  const errors: string[] = [];
  if (!hasCurrentReview(record)) errors.push('a current successful report validation');
  if (!record.preparedReportText || !record.sourceExtraction?.sha256) errors.push('the generated report and preserved source fingerprint');
  if (!hasEditorialSignoff(record)) errors.push('reviewer name and all editorial signoffs');
  return errors;
}

export function applyEditorialChange(record: AdminCaseRecord, patch: Partial<AdminCaseRecord>): AdminCaseRecord {
  const nextStatus: CaseIngestionStatus = ['Approved', 'Published'].includes(record.status) ? 'Under Review' : record.status;
  return { ...record, ...patch, status: nextStatus, validation: undefined, review: undefined, preparedReportText: undefined };
}

export function validateEditorialFields(record: AdminCaseRecord): string[] {
  const errors: string[] = [];
  for (const [label, value] of Object.entries({ title: record.title, citation: record.citation, facts: record.factsSummary, 'procedural history': record.proceduralHistory, decision: record.decisionSummary, 'date delivered': record.dateDelivered, 'suit number': record.suitNumber })) {
    if (!value?.trim()) errors.push(`Missing ${label}.`);
  }
  const citation = record.citation.match(/^\((\d{4})\) LDLR-(\d+) \((SC|CA)\)$/);
  const court = record.court === 'Supreme Court of Nigeria' ? 'SC' : record.court === 'Court of Appeal' ? 'CA' : '';
  if (!citation || Number(citation[1]) !== record.year || citation[3] !== court) errors.push('Citation must match year and court: (2025) LDLR-124 (SC) or (CA).');
  if (!record.presidingJudges.some(judge => judge.trim())) errors.push('The coram is missing.');
  if (!record.issuesForDetermination.some(issue => issue.trim())) errors.push('Issues for determination are missing.');
  if (!record.ratios.length) errors.push('No ratios have been entered.');
  if (!record.principles.length) errors.push('Distinct principles of law are missing.');
  if (!record.sourceExtraction?.text || !record.sourceExtraction.sha256) errors.push('Reprocess the original document to obtain an independent source extraction.');
  if (record.sourceExtraction?.incomplete) errors.push('Source extraction is incomplete or requires OCR. Upload a checked text-bearing source.');
  if (record.fullJudgmentText !== record.sourceExtraction?.text) errors.push('Extracted source text has changed. Reprocess the original or upload a corrected source.');
  if (record.duplicateCandidates.length && !record.duplicateResolution?.trim()) errors.push('Resolve the possible duplicate before approval.');
  const seen = new Set<string>();
  record.ratios.forEach((ratio, index) => {
    const text = normalizedWords(ratio.exactText);
    if (!ratio.heading.trim() || !ratio.attribution.trim() || text.split(' ').length < 6) errors.push(`Ratio ${index + 1}: a heading, judge and substantive exact quotation are required.`);
    if (seen.has(text)) errors.push(`Ratio ${index + 1}: duplicated quotation.`);
    seen.add(text);
  });
  record.principles.forEach((principle, index) => {
    const text = normalizedWords(principle);
    if (!text || record.ratios.some(ratio => normalizedWords(ratio.exactText).includes(text) || text.includes(normalizedWords(ratio.exactText)))) errors.push(`Principle ${index + 1} repeats ratio wording; supply a distinct legal proposition.`);
    if (!record.principleSources?.[index]?.trim()) errors.push(`Principle ${index + 1} needs an exact supporting judicial passage.`);
  });
  return errors;
}
