import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  ClipboardList,
  Copy,
  Download,
  FileCheck2,
  FileText,
  Gavel,
  LoaderCircle,
  LockKeyhole,
  Paperclip,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from 'lucide-react';
import {
  DRAFT_WIZARD_MAX_FILES,
  buildDraftWizardFormData,
  validateDraftWizardFile,
  validateDraftWizardInput,
  type DraftWizardErrors,
} from '../lib/aiDraftWizard';
import { downloadDraftDocx } from '../lib/downloadDraftDocx';

type WizardStage = 1 | 2 | 3 | 4;

interface MatterForm {
  matterTitle: string;
  court: string;
  claimant: string;
  defendant: string;
  facts: string;
  instructions: string;
}

interface GeneratedDraft {
  documentTitle: string;
  draftText: string;
  documentCount: number;
  notice: string;
}

const EMPTY_FORM: MatterForm = {
  matterTitle: '',
  court: '',
  claimant: '',
  defendant: '',
  facts: '',
  instructions: '',
};

const STEPS = [
  { id: 1 as const, short: 'Scenario', title: 'Provide Case Scenario/Issues', icon: ClipboardList },
  { id: 2 as const, short: 'Documents', title: 'Upload Letters/Documents', icon: Paperclip },
  { id: 3 as const, short: 'Instructions', title: 'Provide Draft Instructions', icon: WandSparkles },
  { id: 4 as const, short: 'Draft', title: 'Review & Download', icon: FileCheck2 },
];

const FIELD_CLASS =
  'lawpex-focus-ring mt-2 w-full rounded-lg border border-amber-200 bg-white px-3.5 py-3 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200';

export const AILegalAssistantView: React.FC = () => {
  const [stage, setStage] = useState<WizardStage>(1);
  const [form, setForm] = useState<MatterForm>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<DraftWizardErrors>({});
  const [fileError, setFileError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (!prompt) return;
    setForm((current) => ({ ...current, instructions: prompt }));
    searchParams.delete('prompt');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const updateField = (field: keyof MatterForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'facts' || field === 'instructions') {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const addFiles = (incoming: File[]) => {
    setFileError('');
    const next = [...files];
    for (const file of incoming) {
      const validationError = validateDraftWizardFile(file);
      if (validationError) {
        setFileError(`${file.name}: ${validationError}`);
        continue;
      }
      if (next.some((existing) => existing.name === file.name && existing.size === file.size)) continue;
      if (next.length >= DRAFT_WIZARD_MAX_FILES) {
        setFileError(`Upload no more than ${DRAFT_WIZARD_MAX_FILES} supporting documents.`);
        break;
      }
      next.push(file);
    }
    setFiles(next);
  };

  const goForward = () => {
    if (stage === 1) {
      const nextErrors = validateDraftWizardInput({ facts: form.facts, instructions: 'pending' });
      if (nextErrors.facts) {
        setErrors(nextErrors);
        return;
      }
      setStage(2);
      return;
    }
    if (stage === 2) setStage(3);
  };

  const selectStage = (nextStage: WizardStage) => {
    const canVisit = nextStage <= stage || (nextStage === 2 && form.facts.trim()) ||
      (nextStage === 3 && form.facts.trim()) || (nextStage === 4 && generatedDraft);
    if (canVisit) setStage(nextStage);
  };

  const generateDraft = async () => {
    const nextErrors = validateDraftWizardInput(form);
    setErrors(nextErrors);
    setRequestError('');
    if (nextErrors.facts) {
      setStage(1);
      return;
    }
    if (nextErrors.instructions) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/draft-wizard', {
        method: 'POST',
        body: buildDraftWizardFormData({ ...form, files }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The draft could not be generated.');
      setGeneratedDraft(data);
      setStage(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'The draft could not be generated.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetWizard = () => {
    setStage(1);
    setForm(EMPTY_FORM);
    setFiles([]);
    setErrors({});
    setFileError('');
    setRequestError('');
    setGeneratedDraft(null);
    setCopied(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyDraft = async () => {
    if (!generatedDraft) return;
    await navigator.clipboard.writeText(generatedDraft.draftText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const completedSteps = [Boolean(form.facts.trim()), stage > 2 || files.length > 0, Boolean(form.instructions.trim()), Boolean(generatedDraft)];

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-neutral-950">
      <section className="border-b border-amber-200 bg-[#1c1917] text-white">
        <div className="mx-auto grid max-w-[1400px] gap-7 px-5 py-9 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10 lg:py-12">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase text-amber-300">
              <Sparkles className="h-4 w-4" />
              Nigerian legal drafting workspace
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">Ai Draft Wizard</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              Turn a complete client brief and its supporting documents into a structured court-ready working draft.
            </p>
          </div>
          <div className="flex items-center gap-3 border-l-2 border-amber-400 pl-4 text-sm text-stone-300">
            <LockKeyhole className="h-5 w-5 shrink-0 text-amber-300" />
            <span className="max-w-xs">Documents are processed for this request and are not stored on the server.</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-6 overflow-x-auto border-b border-amber-200 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
          <div className="flex min-w-max gap-2">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => selectStage(step.id)}
                  aria-current={stage === step.id ? 'step' : undefined}
                  className={`lawpex-focus-ring flex h-11 items-center gap-2 rounded-lg px-3 text-xs font-bold ${
                    stage === step.id ? 'bg-amber-300 text-stone-950' : 'border border-amber-200 bg-white text-stone-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {step.id}. {step.short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-black uppercase text-amber-800">Drafting sequence</p>
              <nav aria-label="Ai Draft Wizard steps" className="border-y border-amber-200">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  const active = stage === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => selectStage(step.id)}
                      aria-current={active ? 'step' : undefined}
                      className={`lawpex-focus-ring flex w-full items-center gap-3 border-b border-amber-100 px-2 py-4 text-left last:border-b-0 ${active ? 'bg-amber-100' : 'hover:bg-white'}`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-amber-300' : completedSteps[step.id - 1] ? 'bg-stone-900 text-amber-300' : 'border border-amber-200 bg-white text-stone-500'}`}>
                        {completedSteps[step.id - 1] && !active ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase text-amber-800">Step {step.id}</span>
                        <span className="mt-0.5 block text-sm font-bold text-stone-900">{step.title}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-7 border-l-2 border-amber-300 pl-4">
                <p className="text-xs font-black uppercase text-stone-500">Matter in progress</p>
                <p className="mt-2 break-words text-sm font-bold text-stone-900">{form.matterTitle || 'Untitled matter'}</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">{form.court || 'Court and jurisdiction not yet supplied'}</p>
                <p className="mt-3 text-xs font-semibold text-amber-800">{files.length} supporting document{files.length === 1 ? '' : 's'}</p>
              </div>
            </div>
          </aside>

          <section className="min-w-0 border border-amber-200 bg-white shadow-[0_24px_70px_-56px_rgba(68,49,12,0.55)]">
            <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-amber-800">Step {stage} of 4</p>
                  <h2 className="mt-1 text-xl font-black sm:text-2xl">{STEPS[stage - 1].title}</h2>
                </div>
                {(form.facts || form.instructions || files.length > 0) && (
                  <button type="button" onClick={resetWizard} aria-label="Start again" className="lawpex-focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-stone-600 hover:bg-white hover:text-stone-950">
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:inline">Start again</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              {stage === 1 && (
                <div className="max-w-4xl">
                  <div className="mb-8">
                    <h3 className="text-lg font-black">Set out the matter clearly</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Include the material events, dates, relationship between the parties, steps already taken and the legal problem to be addressed.</p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-bold text-stone-800 sm:col-span-2">
                      Matter title <span className="font-normal text-stone-400">(optional)</span>
                      <input value={form.matterTitle} onChange={(event) => updateField('matterTitle', event.target.value)} className={FIELD_CLASS} placeholder="Okafor unlawful eviction matter" />
                    </label>
                    <label className="text-sm font-bold text-stone-800 sm:col-span-2">
                      Court or jurisdiction <span className="font-normal text-stone-400">(optional)</span>
                      <input value={form.court} onChange={(event) => updateField('court', event.target.value)} className={FIELD_CLASS} placeholder="High Court of Rivers State, Port Harcourt Judicial Division" />
                    </label>
                    <label className="text-sm font-bold text-stone-800">
                      Claimant / Applicant <span className="font-normal text-stone-400">(optional)</span>
                      <input value={form.claimant} onChange={(event) => updateField('claimant', event.target.value)} className={FIELD_CLASS} placeholder="Client or applicant name" />
                    </label>
                    <label className="text-sm font-bold text-stone-800">
                      Defendant / Respondent <span className="font-normal text-stone-400">(optional)</span>
                      <input value={form.defendant} onChange={(event) => updateField('defendant', event.target.value)} className={FIELD_CLASS} placeholder="Opposing party name" />
                    </label>
                    <label className="text-sm font-bold text-stone-800 sm:col-span-2">
                      Case scenario and issues <span className="text-red-700">*</span>
                      <textarea value={form.facts} onChange={(event) => updateField('facts', event.target.value)} rows={11} className={`${FIELD_CLASS} resize-y leading-6`} aria-invalid={Boolean(errors.facts)} aria-describedby={errors.facts ? 'facts-error' : 'facts-help'} placeholder="Describe the client's account in full. Include the chronology, important dates, disputed conduct, loss suffered and the outcome the client wants." />
                      {errors.facts ? <span id="facts-error" className="mt-2 block text-sm font-semibold text-red-700">{errors.facts}</span> : <span id="facts-help" className="mt-2 block text-xs leading-5 text-stone-500">Do not include information that is unrelated to preparing the document.</span>}
                    </label>
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div className="max-w-4xl">
                  <div className="mb-8">
                    <h3 className="text-lg font-black">Add the documents behind the brief</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Upload tenancy agreements, letters, notices, contracts, correspondence or other material the draft should reflect. This step is optional.</p>
                  </div>
                  <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.txt,.md" className="sr-only" onChange={(event) => { addFiles(Array.from(event.target.files ?? [])); event.target.value = ''; }} />
                  <div
                    onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => { event.preventDefault(); setIsDragging(false); addFiles(Array.from(event.dataTransfer.files)); }}
                    className={`border-2 border-dashed px-5 py-12 text-center transition-colors ${isDragging ? 'border-amber-500 bg-amber-100' : 'border-amber-300 bg-amber-50/60'}`}
                  >
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-stone-900 text-amber-300"><Upload className="h-5 w-5" /></span>
                    <p className="mt-4 text-base font-black">Drop supporting documents here</p>
                    <p className="mt-1 text-sm text-stone-500">PDF, DOCX, TXT or MD. Up to 10 MB each.</p>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="lawpex-focus-ring mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-amber-300 px-5 text-sm font-black text-stone-950 hover:bg-amber-200 active:translate-y-px">
                      <Plus className="h-4 w-4" /> Select documents
                    </button>
                  </div>
                  {fileError && <p role="alert" className="mt-3 border-l-2 border-red-600 pl-3 text-sm font-semibold text-red-700">{fileError}</p>}
                  {files.length > 0 && (
                    <div className="mt-7 divide-y divide-amber-100 border-y border-amber-200">
                      {files.map((file) => (
                        <div key={`${file.name}-${file.size}`} className="flex items-center gap-3 py-4">
                          <FileText className="h-5 w-5 shrink-0 text-amber-700" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{file.name}</p>
                            <p className="mt-0.5 text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button type="button" onClick={() => setFiles((current) => current.filter((item) => item !== file))} aria-label={`Remove ${file.name}`} className="lawpex-focus-ring rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-700"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {stage === 3 && (
                <div className="max-w-4xl">
                  <div className="mb-8">
                    <h3 className="text-lg font-black">Direct the draft precisely</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">State the document to prepare, remedies or reliefs to claim, issues to emphasise and any formatting or strategic instruction.</p>
                  </div>
                  <label className="text-sm font-bold text-stone-800">
                    Lawyer's drafting instruction <span className="text-red-700">*</span>
                    <textarea value={form.instructions} onChange={(event) => updateField('instructions', event.target.value)} rows={13} className={`${FIELD_CLASS} resize-y leading-6`} aria-invalid={Boolean(errors.instructions)} aria-describedby={errors.instructions ? 'instructions-error' : 'instructions-help'} placeholder="Draft a comprehensive originating process for unlawful eviction. Claim special and general damages, an injunction and costs. Include all supporting processes normally required." />
                    {errors.instructions ? <span id="instructions-error" className="mt-2 block text-sm font-semibold text-red-700">{errors.instructions}</span> : <span id="instructions-help" className="mt-2 block text-xs leading-5 text-stone-500">The wizard will use your instruction together with the facts and every uploaded document.</span>}
                  </label>
                  <div className="mt-7 grid gap-3 border-y border-amber-200 py-5 sm:grid-cols-3">
                    <BriefCheck label="Scenario supplied" complete={Boolean(form.facts.trim())} />
                    <BriefCheck label={`${files.length} document${files.length === 1 ? '' : 's'} attached`} complete={files.length > 0} optional />
                    <BriefCheck label="Instruction supplied" complete={Boolean(form.instructions.trim())} />
                  </div>
                  {requestError && <div role="alert" className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">{requestError}</div>}
                </div>
              )}

              {stage === 4 && generatedDraft && (
                <div>
                  <div className="flex flex-col gap-5 border-b border-amber-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-amber-800">Generated working draft</p>
                      <h3 className="mt-2 text-xl font-black">{generatedDraft.documentTitle}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Review and edit the document below before downloading the Word version.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={copyDraft} className="lawpex-focus-ring inline-flex h-11 items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 text-sm font-bold hover:bg-amber-50">
                        {copied ? <Check className="h-4 w-4 text-green-700" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}
                      </button>
                      <button type="button" onClick={() => downloadDraftDocx(generatedDraft.documentTitle, generatedDraft.draftText)} className="lawpex-focus-ring inline-flex h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-black hover:bg-amber-200 active:translate-y-px">
                        <Download className="h-4 w-4" /> Download .docx
                      </button>
                    </div>
                  </div>
                  <textarea value={generatedDraft.draftText} onChange={(event) => setGeneratedDraft((current) => current ? { ...current, draftText: event.target.value } : current)} aria-label="Generated legal draft" className="lawpex-focus-ring mt-7 min-h-[720px] w-full resize-y border-0 bg-white px-1 py-2 font-serif text-base leading-8 text-stone-950 outline-none sm:px-6 sm:text-lg" />
                  <div className="mt-6 flex gap-3 border-l-2 border-amber-400 bg-amber-50 px-4 py-4 text-sm leading-6 text-stone-700">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" />
                    <p>{generatedDraft.notice}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-amber-200 bg-stone-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <button type="button" onClick={() => setStage((current) => Math.max(1, current - 1) as WizardStage)} disabled={stage === 1} className="lawpex-focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-amber-200 bg-white px-5 text-sm font-bold disabled:invisible">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {stage < 3 && (
                <button type="button" onClick={goForward} className="lawpex-focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-black text-white hover:bg-stone-800 active:translate-y-px">
                  {stage === 1 ? 'Add supporting documents' : 'Continue to instructions'} <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {stage === 3 && (
                <button type="button" onClick={generateDraft} disabled={isGenerating} className="lawpex-focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-amber-300 px-6 text-sm font-black text-stone-950 hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70 active:translate-y-px">
                  {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Gavel className="h-4 w-4" />}
                  {isGenerating ? 'Preparing legal draft...' : 'Generate court document'}
                </button>
              )}
              {stage === 4 && (
                <button type="button" onClick={() => setStage(3)} className="lawpex-focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-black text-white hover:bg-stone-800">
                  <WandSparkles className="h-4 w-4" /> Revise instructions
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

const BriefCheck: React.FC<{ label: string; complete: boolean; optional?: boolean }> = ({ label, complete, optional }) => (
  <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
    <span className={`flex h-7 w-7 items-center justify-center rounded-md ${complete ? 'bg-stone-900 text-amber-300' : 'border border-amber-200 bg-white text-stone-400'}`}>
      {complete ? <Check className="h-3.5 w-3.5" /> : optional ? <Paperclip className="h-3.5 w-3.5" /> : <ClipboardCheck className="h-3.5 w-3.5" />}
    </span>
    {label}{optional && !complete ? ' (optional)' : ''}
  </div>
);
