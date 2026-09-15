import { CaseLaw } from '../types';

export interface CaseJudgmentDocument {
  id: string;
  preserveSourceFormatting?: boolean;
  verbatimWholeCase?: boolean;
  fullJudgmentText: string;
  judgmentPages?: NonNullable<CaseLaw['judgmentPages']>;
}

const judgmentModules = (
  import.meta.env ? import.meta.glob('./judgments/*.json') : {}
) as Record<string, () => Promise<{ default: CaseJudgmentDocument }>>;

const pendingJudgmentLoads = new Map<string, Promise<CaseJudgmentDocument | null>>();

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const loadCaseJudgmentDocument = async (caseId: string): Promise<CaseJudgmentDocument | null> => {
  const pending = pendingJudgmentLoads.get(caseId);
  if (pending) return pending;

  const loader = judgmentModules[`./judgments/${caseId}.json`];
  if (!loader) return null;

  const request = (async () => {
    try {
      const module = await loader();
      return module.default;
    } catch {
      // A newly started development server can briefly reject a dynamic chunk.
      // Retry once before surfacing a loading failure to the reader.
      await pause(350);
      const module = await loader();
      return module.default;
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
