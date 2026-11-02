import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, FileSignature, FileText, LoaderCircle, Plus, RotateCcw, ShieldCheck, Upload, X } from 'lucide-react';
import {
  buildDraftWizardFormData, DRAFT_WIZARD_MAX_FILES,
  validateDraftWizardFile, validateDraftWizardInput, type DraftWizardErrors,
} from '../lib/aiDraftWizard';
import { downloadDraftDocx } from '../lib/downloadDraftDocx';

const FIELD_CLASS = 'lawpex-focus-ring mt-2 w-full rounded-lg border border-amber-200 bg-white px-3.5 py-3 text-base font-normal leading-6 text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200';
const EMPTY_FORM = { agreementTitle: '', agreementParties: '', facts: '', instructions: '' };
interface AgreementDraft {
  documentTitle: string;
  draftText: string;
  documentCount: number;
  notice: string;
}

export function AgreementDraftPanel({ active }: { active: boolean }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<DraftWizardErrors>({});
  const [fileError, setFileError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [draft, setDraft] = useState<AgreementDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const factsRef = useRef<HTMLTextAreaElement>(null);
  const instructionsRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const activeRef = useRef(active);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => () => {
    requestRef.current?.abort();
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'facts' || field === 'instructions') setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function addFiles(incoming: File[]) {
    if (busy) return;
    const next = [...files];
    let message = '';
    for (const file of incoming) {
      const error = validateDraftWizardFile(file);
      if (error) { message = `${file.name}: ${error}`; continue; }
      if (next.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) continue;
      if (next.length >= DRAFT_WIZARD_MAX_FILES) {
        message = `Upload no more than ${DRAFT_WIZARD_MAX_FILES} supporting documents.`;
        break;
      }
      next.push(file);
    }
    setFiles(next);
    setFileError(message);
  }

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    const nextErrors = validateDraftWizardInput({ ...form, draftType: 'agreement' });
    setErrors(nextErrors);
    setRequestError('');
    if (nextErrors.facts || nextErrors.instructions) {
      (nextErrors.facts ? factsRef : instructionsRef).current?.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setBusy(true);
    try {
      const response = await fetch('/api/ai/draft-wizard', {
        method: 'POST', signal: controller.signal,
        body: buildDraftWizardFormData({ ...form, draftType: 'agreement', files }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The agreement could not be generated.');
      if (!data.draftText?.trim()) throw new Error('The drafting service returned an empty agreement. Please try again.');
      setDraft(data);
      setCopied(false);
      requestAnimationFrame(() => {
        if (activeRef.current) {
          outputRef.current?.focus({ preventScroll: true });
          outputRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      });
    } catch (error) {
      if (!controller.signal.aborted) setRequestError(error instanceof Error ? error.message : 'The agreement could not be generated.');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  function reset() {
    setForm(EMPTY_FORM);
    setFiles([]);
    setErrors({});
    setFileError('');
    setRequestError('');
    setDraft(null);
    setCopied(false);
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.draftText);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setRequestError('The agreement could not be copied. You can still download the Word document.');
    }
  }

  return (
    <section hidden={!active} aria-label="Legal agreement draft" className="min-w-0 border border-amber-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-amber-200 bg-amber-50 px-5 py-5 sm:px-8">
        <h2 className="flex items-center gap-3 text-xl font-bold sm:text-2xl"><FileSignature className="h-6 w-6 shrink-0 text-amber-800" />Legal Agreement</h2>
        <button type="button" onClick={reset} disabled={busy} aria-label="Start agreement again" title="Start agreement again" className="lawpex-focus-ring rounded-lg p-3 text-stone-600 hover:bg-white disabled:opacity-50"><RotateCcw className="h-4 w-4" /></button>
      </div>
      <form onSubmit={generate} noValidate className="px-5 sm:px-8">
        <fieldset disabled={busy} className="min-w-0 space-y-8 py-7 disabled:opacity-70 sm:py-8">
          <legend className="sr-only">Agreement details and instructions</legend>
          <div className="grid gap-6">
            <label className="text-sm font-semibold text-stone-800">
              Agreement title <span className="font-normal text-stone-500">(optional)</span>
              <input value={form.agreementTitle} onChange={(event) => updateField('agreementTitle', event.target.value)} className={FIELD_CLASS} placeholder="Deed of Assignment, Deed of Mortgage" />
            </label>
            <label className="text-sm font-semibold text-stone-800">
              Names of parties to the agreement <span className="font-normal text-stone-500">(optional)</span>
              <textarea value={form.agreementParties} onChange={(event) => updateField('agreementParties', event.target.value)} rows={3} className={`${FIELD_CLASS} resize-y`} placeholder="Assignor: [name]; Assignee: [name]. Include each party's role and address, if known." />
            </label>
            <label className="text-sm font-semibold text-stone-800">
              Describe the nature of the agreement <span className="text-red-700">*</span>
              <textarea ref={factsRef} value={form.facts} onChange={(event) => updateField('facts', event.target.value)} rows={7} required className={`${FIELD_CLASS} resize-y`} aria-invalid={Boolean(errors.facts)} aria-describedby={errors.facts ? 'agreement-facts-error' : undefined} placeholder="Describe the transaction, the parties' relationship, the property or services involved, agreed terms, payment and important dates." />
              {errors.facts && <span id="agreement-facts-error" className="mt-2 block text-sm text-red-700">{errors.facts}</span>}
            </label>
          </div>
          <div className="border-t border-amber-200 pt-7">
            <h3 className="text-base font-semibold">Supporting documents <span className="font-normal text-stone-500">(optional)</span></h3>
            <input ref={uploadRef} type="file" multiple accept=".pdf,.docx,.txt,.md" aria-label="Agreement supporting documents" className="sr-only" onChange={(event) => { addFiles(Array.from(event.target.files ?? [])); event.target.value = ''; }} />
            <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(Array.from(event.dataTransfer.files)); }} className={`mt-4 rounded-lg border border-dashed p-5 ${dragging ? 'border-amber-600 bg-amber-100' : 'border-amber-300 bg-amber-50/50'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3"><Upload className="h-5 w-5 shrink-0 text-amber-800" /><p className="text-sm leading-6 text-stone-600">PDF, DOCX, TXT or MD<br />Up to 8 documents, 10 MB each</p></div>
                <button type="button" onClick={() => uploadRef.current?.click()} className="lawpex-focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-amber-100"><Plus className="h-4 w-4" />Select documents</button>
              </div>
            </div>
            {fileError && <p role="alert" className="mt-3 break-words text-sm text-red-700">{fileError}</p>}
            {files.length > 0 && <ul className="mt-3 divide-y divide-amber-100">
              {files.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center gap-3 py-3">
                <FileText className="h-5 w-5 shrink-0 text-amber-800" />
                <span className="min-w-0 flex-1 break-words text-sm">{file.name}</span>
                <button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${file.name}`} title={`Remove ${file.name}`} className="lawpex-focus-ring rounded-lg p-3 text-stone-500 hover:bg-red-50 hover:text-red-700"><X className="h-4 w-4" /></button>
              </li>)}
            </ul>}
          </div>
          <label className="block border-t border-amber-200 pt-7 text-sm font-semibold text-stone-800">
            Drafting instructions <span className="text-red-700">*</span>
            <textarea ref={instructionsRef} value={form.instructions} onChange={(event) => updateField('instructions', event.target.value)} rows={7} required className={`${FIELD_CLASS} resize-y`} aria-invalid={Boolean(errors.instructions)} aria-describedby={errors.instructions ? 'agreement-instructions-error' : undefined} placeholder="Draft a comprehensive deed of assignment. Include the agreed purchase price, payment schedule, title warranties, conditions for completion and execution provisions. Mark missing particulars for confirmation." />
            {errors.instructions && <span id="agreement-instructions-error" className="mt-2 block text-sm text-red-700">{errors.instructions}</span>}
          </label>
        </fieldset>
        {requestError && <p role="alert" className="mb-5 break-words border-l-2 border-red-600 bg-red-50 p-4 text-sm leading-6 text-red-800">{requestError}</p>}
        <div className="flex justify-end border-t border-amber-200 py-5">
          <button type="submit" disabled={busy} className="lawpex-focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-300 px-5 py-3 text-base font-semibold text-stone-950 hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70 sm:w-auto">
            {busy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <FileSignature className="h-5 w-5" />}
            {busy ? 'Preparing agreement...' : 'Generate agreement'}
          </button>
        </div>
      </form>
      <div aria-busy={busy} className="border-t border-amber-200 px-5 py-7 sm:px-8">
        {draft ? <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="min-w-0 break-words text-xl font-bold">{draft.documentTitle}</h3>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyDraft} className="lawpex-focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-amber-300 px-4 text-sm font-semibold hover:bg-amber-50">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}</button>
              <button type="button" onClick={() => downloadDraftDocx(draft.documentTitle, draft.draftText)} className="lawpex-focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-semibold hover:bg-amber-200"><Download className="h-4 w-4" />Download .docx</button>
            </div>
          </div>
          <textarea ref={outputRef} value={draft.draftText} onChange={(event) => { setDraft((current) => current ? { ...current, draftText: event.target.value } : current); setCopied(false); }} aria-label="Generated agreement draft" className="lawpex-focus-ring mt-6 min-h-[560px] w-full scroll-mt-28 resize-y rounded-lg border border-amber-200 bg-white px-4 py-5 font-serif text-base leading-8 text-stone-950 outline-none sm:px-6 sm:text-lg" />
          <div className="mt-5 flex items-start gap-3 border-l-2 border-amber-400 bg-amber-50 p-4 text-sm leading-6 text-stone-700"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" /><p>{draft.notice}</p></div>
        </> : <div className="py-5">
          <FileSignature className="h-7 w-7 text-amber-800" />
          <h3 role="status" className="mt-4 text-lg font-semibold">{busy ? 'Preparing your agreement...' : 'Your agreement draft will appear here'}</h3>
        </div>}
      </div>
    </section>
  );
}
