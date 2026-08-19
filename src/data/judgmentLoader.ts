import { CaseLaw } from '../types';

export interface CaseJudgmentDocument {
  id: string;
  preserveSourceFormatting?: boolean;
  verbatimWholeCase?: boolean;
  fullJudgmentText: string;
  judgmentPages?: NonNullable<CaseLaw['judgmentPages']>;
}

const judgmentModules = import.meta.glob('./judgments/*.json') as Record<
  string,
  () => Promise<{ default: CaseJudgmentDocument }>
>;

export const loadCaseJudgmentDocument = async (caseId: string): Promise<CaseJudgmentDocument | null> => {
  const loader = judgmentModules[`./judgments/${caseId}.json`];
  if (!loader) return null;
  const module = await loader();
  return module.default;
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
