export const DRAFT_WIZARD_ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md'] as const;
export const DRAFT_WIZARD_MAX_FILE_BYTES = 10 * 1024 * 1024;
export const DRAFT_WIZARD_MAX_FILES = 8;

export interface DraftWizardInput {
  matterTitle?: string;
  court?: string;
  claimant?: string;
  defendant?: string;
  facts: string;
  instructions: string;
  files?: File[];
}

export type DraftWizardErrors = Partial<Record<'facts' | 'instructions', string>>;

export function validateDraftWizardInput(input: Pick<DraftWizardInput, 'facts' | 'instructions'>): DraftWizardErrors {
  const errors: DraftWizardErrors = {};

  if (!input.facts.trim()) {
    errors.facts = "Provide the client's case scenario and legal issues.";
  }
  if (!input.instructions.trim()) {
    errors.instructions = 'Tell the wizard what legal document to prepare.';
  }

  return errors;
}

export function validateDraftWizardFile(file: Pick<File, 'name' | 'size'>): string | null {
  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  if (!DRAFT_WIZARD_ACCEPTED_EXTENSIONS.includes(extension as (typeof DRAFT_WIZARD_ACCEPTED_EXTENSIONS)[number])) {
    return 'Upload a PDF, DOCX, TXT or MD document.';
  }
  if (file.size > DRAFT_WIZARD_MAX_FILE_BYTES) {
    return 'Each supporting document must be 10 MB or smaller.';
  }
  if (file.size === 0) {
    return 'This document is empty.';
  }
  return null;
}

export function buildDraftWizardFormData(input: DraftWizardInput): FormData {
  const form = new FormData();
  form.set('matterTitle', input.matterTitle?.trim() ?? '');
  form.set('court', input.court?.trim() ?? '');
  form.set('claimant', input.claimant?.trim() ?? '');
  form.set('defendant', input.defendant?.trim() ?? '');
  form.set('facts', input.facts.trim());
  form.set('instructions', input.instructions.trim());
  input.files?.forEach((file) => form.append('documents', file, file.name));
  return form;
}
