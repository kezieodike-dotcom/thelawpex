import { CaseLaw } from '../types';

export interface CaseJudgmentDocument {
  id: string;
  preserveSourceFormatting?: boolean;
  verbatimWholeCase?: boolean;
  fullJudgmentText: string;
  judgmentPages?: NonNullable<CaseLaw['judgmentPages']>;
}

// Keep full judgments out of the application JavaScript chunks. Vite emits
// each JSON file as a separate asset, so the case list and first page can load
// without parsing every long judgment up front.
const judgmentDocumentUrls = (
  import.meta.env
    ? import.meta.glob('./judgments/*.json', {
        eager: true,
        import: 'default',
        query: '?url',
      })
    : {}
) as Record<string, string>;

const pendingJudgmentLoads = new Map<string, Promise<CaseJudgmentDocument | null>>();
const loadedJudgmentDocuments = new Map<string, CaseJudgmentDocument>();

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const loadCaseJudgmentDocument = async (caseId: string): Promise<CaseJudgmentDocument | null> => {
  const cached = loadedJudgmentDocuments.get(caseId);
  if (cached) return cached;

  const pending = pendingJudgmentLoads.get(caseId);
  if (pending) return pending;

  const documentUrl = judgmentDocumentUrls[`./judgments/${caseId}.json`];
  if (!documentUrl) return null;

  const request = (async () => {
    try {
      const response = await fetch(documentUrl, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Judgment request failed with ${response.status}`);
      const document = (await response.json()) as CaseJudgmentDocument;
      loadedJudgmentDocuments.set(caseId, document);
      return document;
    } catch {
      // A newly started development server can briefly reject an asset request.
      // Retry once before surfacing a loading failure to the reader.
      await pause(350);
      const response = await fetch(documentUrl, { cache: 'reload' });
      if (!response.ok) throw new Error(`Judgment request failed with ${response.status}`);
      const document = (await response.json()) as CaseJudgmentDocument;
      loadedJudgmentDocuments.set(caseId, document);
      return document;
    }
  })().finally(() => pendingJudgmentLoads.delete(caseId));

  pendingJudgmentLoads.set(caseId, request);
  return request;
};

export const mergeCaseJudgmentDocument = (
  judgment: CaseLaw,
  document: CaseJudgmentDocument | null,
): CaseLaw =>
  document
    ? {
        ...judgment,
        preserveSourceFormatting: document.preserveSourceFormatting,
        verbatimWholeCase: document.verbatimWholeCase,
        fullJudgmentText: document.fullJudgmentText,
        judgmentPages: document.judgmentPages,
      }
    : judgment;
