import { CaseLaw } from '../types';
import { publicationGaps, type ReportValidation } from '../lib/caseReportReview';

export type CaseIngestionStatus = 'Draft' | 'Under Review' | 'Approved' | 'Published' | 'Rejected';

export interface IngestedRatioDraft {
  heading: string;
  exactText: string;
  attribution: string;
  sourcePage: string;
  sourceParagraph: string;
}

export interface CaseAuditEvent {
  at: string;
  action: string;
  status: CaseIngestionStatus;
  snapshotKey?: string;
}

export interface AdminCaseRecord {
  sourceExtraction?: { text: string; sha256: string; textSha256: string; pages: number; incomplete: boolean };
  leadingJudgmentHeading?: string;
  duplicateResolution?: string;
  principleSources?: string[];
  preparedReportText?: string;
  validation?: ReportValidation;
  review?: { reviewer: string; source: boolean; metadata: boolean; ratios: boolean; principles: boolean };
  id: string;
  status: CaseIngestionStatus;
  createdAt: string;
  updatedAt: string;
  sourceDocument: {
    fileName: string;
    fileType: string;
    size: number;
    storageKey: string;
  };
  title: string;
  citation: string;
  court: CaseLaw['court'];
  year: number;
  judicialDivision: string;
  dateDelivered: string;
  suitNumber: string;
  presidingJudges: string[];
  appearances: { appellant: string; respondent: string };
  areaOfLaw: string;
  subject: string;
  proceduralHistory: string;
  factsSummary: string;
  issuesForDetermination: string[];
  decisionSummary: string;
  ratios: IngestedRatioDraft[];
  principles: string[];
  authorities: string[];
  statutes: string[];
  practiceNotes: string[];
  fullJudgmentText: string;
  warnings: string[];
  duplicateCandidates: string[];
  auditLog: CaseAuditEvent[];
}

const RECORDS_KEY = 'lawpex.admin.case-ingestion.v1';
const SOURCE_DB_NAME = 'lawpex-case-sources';
const SOURCE_STORE_NAME = 'documents';

const browserStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

export const getCaseIngestionRecords = (): AdminCaseRecord[] => {
  const storage = browserStorage();
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(RECORDS_KEY) || '[]');
    return Array.isArray(parsed) ? (parsed as AdminCaseRecord[]) : [];
  } catch {
    return [];
  }
};

export const saveCaseIngestionRecords = (records: AdminCaseRecord[]) => {
  browserStorage()?.setItem(RECORDS_KEY, JSON.stringify(records));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lawpex-case-ingestion-updated'));
  }
};

export const upsertCaseIngestionRecord = (record: AdminCaseRecord) => {
  const records = getCaseIngestionRecords();
  const next = records.some((item) => item.id === record.id)
    ? records.map((item) => (item.id === record.id ? record : item))
    : [record, ...records];
  saveCaseIngestionRecords(next);
};

export const updateCaseIngestionStatus = (id: string, status: CaseIngestionStatus) => {
  const record = getCaseIngestionRecords().find((item) => item.id === id);
  if (!record) return;
  if (['Approved', 'Published'].includes(status) && publicationGaps(record).length) throw new Error('A verified report and editorial signoff are required.');
  if (status === 'Approved' && record.status !== 'Under Review') throw new Error('Move the draft to review before approval.');
  if (status === 'Published' && record.status !== 'Approved') throw new Error('Approve the report before publication.');
  upsertCaseIngestionRecord({
    ...record,
    status,
    updatedAt: new Date().toISOString(),
    auditLog: [...record.auditLog, { at: new Date().toISOString(), action: `Status changed to ${status}`, status }],
  });
};

export const getPublishedIngestedCases = (): CaseLaw[] =>
  getCaseIngestionRecords()
    .filter((record) => record.status === 'Published' && publicationGaps(record).length === 0)
    .map((record) => toPublishedCaseLaw(record));

export const toPublishedCaseLaw = (record: AdminCaseRecord): CaseLaw => ({
  reportFormatVersion: 'lawpex-reviewed-v1',
  ratioSourceReferences: record.ratios.map(ratio => ({ page: Number(ratio.sourcePage.split('-')[0]), paragraph: ratio.sourceParagraph.split('-')[0] })),
  id: record.id,
  title: record.title,
  citation: record.citation,
  suitNumber: record.suitNumber,
  court: record.court,
  year: record.year,
  judicialDivision: record.judicialDivision || undefined,
  dateDelivered: record.dateDelivered || undefined,
  presidingJudges: record.presidingJudges,
  appearances: record.appearances,
  areaOfLaw: record.areaOfLaw,
  subject: record.subject,
  proceduralHistory: record.proceduralHistory,
  factsSummary: record.factsSummary,
  issuesForDetermination: record.issuesForDetermination,
  decisionSummary: record.decisionSummary,
  ratioDecidendi: record.ratios.map(formatRatio),
  keyPrinciples: record.principles,
  authoritiesCited: record.authorities,
  statutesConsidered: record.statutes,
  practiceNotes: record.practiceNotes,
  fullJudgmentText: record.preparedReportText || record.fullJudgmentText || undefined,
  hasFullJudgment: Boolean(record.fullJudgmentText),
  preserveSourceFormatting: true,
  verbatimWholeCase: true,
  isLandmark: false,
});

export const formatRatio = (ratio: IngestedRatioDraft) => {
  const page = ratio.sourcePage.trim().replace(/^p{1,2}\.?\s*/i, '');
  const paragraph = ratio.sourceParagraph.trim().replace(/^para(?:graph)?\.?\s*/i, '');
  const location = [page && `${page.includes('-') ? 'Pp.' : 'P.'} ${page}`, paragraph && `${paragraph.includes('-') ? 'paras.' : 'para.'} ${paragraph}`]
    .filter(Boolean)
    .join(', ');
  const attribution = ratio.attribution ? `Per ${ratio.attribution.replace(/^Per\s+/i, '').trim()}${location ? ` (${location})` : ''}` : location ? `(${location})` : '';
  return [ratio.heading, ratio.exactText && `"${ratio.exactText}"`, attribution].filter(Boolean).join('\n\n');
};

export const saveSourceDocument = (storageKey: string, file: File): Promise<void> => {
  if (typeof indexedDB === 'undefined') return Promise.resolve();
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SOURCE_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(SOURCE_STORE_NAME);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction(SOURCE_STORE_NAME, 'readwrite');
      transaction.objectStore(SOURCE_STORE_NAME).put(file, storageKey);
      transaction.oncomplete = () => { request.result.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
  });
};

export const getSourceDocument = (storageKey: string): Promise<Blob | null> => {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SOURCE_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(SOURCE_STORE_NAME);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction(SOURCE_STORE_NAME, 'readonly');
      const lookup = transaction.objectStore(SOURCE_STORE_NAME).get(storageKey);
      transaction.oncomplete = () => request.result.close();
      lookup.onsuccess = () => resolve((lookup.result as Blob | undefined) ?? null);
      lookup.onerror = () => reject(lookup.error);
    };
  });
};

export const normaliseCaseText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
