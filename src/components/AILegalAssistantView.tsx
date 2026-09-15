import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  ClipboardCheck,
  Copy,
  Download,
  FileCheck2,
  FileSearch,
  FileText,
  Gavel,
  LoaderCircle,
  LockKeyhole,
  Paperclip,
  Search,
  Send,
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
type AssistantMode = 'draft' | 'board' | 'revisor' | 'researcher';

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

interface BoardForm {
  meetingTitle: string;
  meetingDate: string;
  attendees: string;
  agenda: string;
  meetingNotes: string;
  outputType: string;
}

interface ResearchForm {
  question: string;
  jurisdiction: string;
  focus: string;
}

interface AssistantModePanelProps {
  mode: Exclude<AssistantMode, 'draft'>;
  boardForm: BoardForm;
  setBoardForm: React.Dispatch<React.SetStateAction<BoardForm>>;
  boardOutput: string;
  boardBusy: boolean;
  boardError: string;
  onGenerateBoard: () => void;
  reviewInputRef: React.RefObject<HTMLInputElement | null>;
  reviewFile: File | null;
  setReviewFile: React.Dispatch<React.SetStateAction<File | null>>;
  reviewInstructions: string;
  setReviewInstructions: React.Dispatch<React.SetStateAction<string>>;
  reviewOutput: string;
  reviewBusy: boolean;
  reviewError: string;
  onReview: () => void;
  researchForm: ResearchForm;
  setResearchForm: React.Dispatch<React.SetStateAction<ResearchForm>>;
  researchOutput: string;
  researchBusy: boolean;
  researchError: string;
  onResearch: () => void;
}

const EMPTY_FORM: MatterForm = {
  matterTitle: '',
  court: '',
  claimant: '',
  defendant: '',
  facts: '',
  instructions: '',
};

const ASSISTANT_MODES: Array<{
  id: AssistantMode;
  label: string;
  description: string;
  icon: React.ElementType;
}> = [
  { id: 'draft', label: 'Draft Wizard', description: 'Build court-ready working drafts', icon: WandSparkles },
  { id: 'board', label: 'Board Assistant', description: 'Minutes, reports and board packs', icon: BriefcaseBusiness },
  { id: 'revisor', label: 'Revisor', description: 'Review uploaded documents against instructions', icon: FileSearch },
  { id: 'researcher', label: 'Researcher', description: 'Turn a legal question into a research brief', icon: BookOpenCheck },
];

const FIELD_CLASS =
  'lawpex-focus-ring mt-2 w-full rounded-lg border border-amber-200 bg-white px-3.5 py-3 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200';

export const AILegalAssistantView: React.FC = () => {
  const [mode, setMode] = useState<AssistantMode>('draft');
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
  const [boardForm, setBoardForm] = useState<BoardForm>({
    meetingTitle: '',
    meetingDate: '',
    attendees: '',
    agenda: '',
    meetingNotes: '',
    outputType: 'Board minutes',
  });
  const [boardOutput, setBoardOutput] = useState('');
  const [boardBusy, setBoardBusy] = useState(false);
  const [boardError, setBoardError] = useState('');
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [reviewInstructions, setReviewInstructions] = useState('');
  const [reviewOutput, setReviewOutput] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [researchForm, setResearchForm] = useState<ResearchForm>({ question: '', jurisdiction: 'Nigeria', focus: 'Authorities and procedure' });
  const [researchOutput, setResearchOutput] = useState('');
  const [researchBusy, setResearchBusy] = useState(false);
  const [researchError, setResearchError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reviewInputRef = useRef<HTMLInputElement>(null);

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

  const selectMode = (nextMode: AssistantMode) => {
    setMode(nextMode);
    window.setTimeout(() => document.getElementById(`assistant-${nextMode}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const selectStage = (nextStage: WizardStage) => {
    setStage(nextStage);
    window.setTimeout(() => document.getElementById(`draft-step-${nextStage}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const askAssistant = async (prompt: string, modeName: string, context: unknown) => {
    const response = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, mode: modeName, context }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The assistant could not complete this request.');
    return data.answer as string;
  };

  const generateBoardWork = async () => {
    if (!boardForm.meetingNotes.trim() && !boardForm.agenda.trim()) {
      setBoardError('Add meeting notes or an agenda before generating the board document.');
      return;
    }
    setBoardBusy(true);
    setBoardError('');
    try {
      setBoardOutput(await askAssistant(
        `Prepare a ${boardForm.outputType} from the board meeting information below. Preserve supplied names, dates, decisions and action owners exactly. Clearly separate confirmed decisions, resolutions, action items, risks and matters for follow-up. Do not invent missing information; mark it [TO BE CONFIRMED].\n\nMeeting: ${boardForm.meetingTitle || '[Untitled meeting]'}\nDate: ${boardForm.meetingDate || '[Date not supplied]'}\nAttendees: ${boardForm.attendees || '[Not supplied]'}\nAgenda:\n${boardForm.agenda || '[Not supplied]'}\nMeeting notes:\n${boardForm.meetingNotes || '[Not supplied]'}`,
        'board-assistant',
        boardForm,
      ));
    } catch (error) {
      setBoardError(error instanceof Error ? error.message : 'The board document could not be generated.');
    } finally {
      setBoardBusy(false);
    }
  };

  const reviewDocument = async () => {
    if (!reviewFile) {
      setReviewError('Choose a document to review first.');
      return;
    }
    if (!reviewInstructions.trim()) {
      setReviewError('Provide specific review instructions first.');
      return;
    }
    setReviewBusy(true);
    setReviewError('');
    try {
      const body = new FormData();
      body.append('instructions', reviewInstructions);
      body.append('documents', reviewFile);
      const response = await fetch('/api/ai/revisor', { method: 'POST', body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The document could not be reviewed.');
      setReviewOutput(data.reviewText || 'No review was returned.');
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'The document could not be reviewed.');
    } finally {
      setReviewBusy(false);
    }
  };

  const runResearch = async () => {
    if (!researchForm.question.trim()) {
      setResearchError('Enter a research question first.');
      return;
    }
    setResearchBusy(true);
    setResearchError('');
    try {
      setResearchOutput(await askAssistant(
        `Research this Nigerian legal question as a research assistant. Return a concise research brief with: issue, short answer, governing constitutional/statutory provisions, relevant Nigerian cases or authorities, procedural implications, open questions and verification checklist. Do not fabricate authorities or quotations; say plainly when a source must be verified.\n\nQuestion: ${researchForm.question}\nJurisdiction: ${researchForm.jurisdiction}\nResearch focus: ${researchForm.focus}`,
        'researcher',
        researchForm,
      ));
    } catch (error) {
      setResearchError(error instanceof Error ? error.message : 'The research brief could not be generated.');
    } finally {
      setResearchBusy(false);
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

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-neutral-950">
      <section className="border-b border-amber-200 bg-[#1c1917] text-white">
        <div className="mx-auto grid max-w-[1400px] gap-7 px-5 py-9 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10 lg:py-12">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase text-amber-300">
              <Sparkles className="h-4 w-4" />
              Nigerian legal drafting workspace
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">AI Workbench</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              Draft, prepare, review and research from one focused workspace for Nigerian legal work.
            </p>
          </div>
          <div className="flex items-center gap-3 border-l-2 border-amber-400 pl-4 text-sm text-stone-300">
            <LockKeyhole className="h-5 w-5 shrink-0 text-amber-300" />
            <span className="max-w-xs">Documents are processed for this request and are not stored on the server.</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-amber-800">AI Workbench</p>
            <nav aria-label="AI Workbench tools" className="border-y border-amber-200">
              {ASSISTANT_MODES.map((assistant) => {
                const Icon = assistant.icon;
                const active = mode === assistant.id;
                return (
                  <button
                    key={assistant.id}
                    type="button"
                    onClick={() => selectMode(assistant.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`lawpex-focus-ring flex w-full min-h-20 items-start gap-3 border-b border-amber-100 px-3 py-4 text-left transition last:border-b-0 ${active ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-800 hover:bg-amber-50'}`}
                  >
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-amber-300 text-stone-950' : 'bg-amber-100 text-amber-800'}`}><Icon className="h-4 w-4" /></span>
                    <span>
                      <span className="block text-sm font-black">{assistant.label}</span>
                      <span className={`mt-1 block text-xs leading-5 ${active ? 'text-stone-300' : 'text-stone-500'}`}>{assistant.description}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">
        {mode === 'draft' ? (
          <>
          <section className="min-w-0 border border-amber-200 bg-white shadow-[0_24px_70px_-56px_rgba(68,49,12,0.55)]">
            <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-amber-800">Draft Wizard · 4 steps on this page</p>
                  <h2 className="mt-1 text-xl font-black sm:text-2xl">Build, review and export your draft</h2>
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
              <div id="draft-step-1" className="max-w-4xl scroll-mt-24">
                  <div className="mb-8">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-amber-800">Step 1</p>
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

              <div id="draft-step-2" className="max-w-4xl scroll-mt-24">
                  <div className="mb-8">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-amber-800">Step 2</p>
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

              <div id="draft-step-3" className="max-w-4xl scroll-mt-24">
                  <div className="mb-8">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-amber-800">Step 3</p>
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

              {generatedDraft ? <div id="draft-step-4" className="scroll-mt-24">
                  <div className="flex flex-col gap-5 border-b border-amber-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">Step 4 · Generated working draft</p>
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
                </div> : <div id="draft-step-4" className="max-w-2xl scroll-mt-24 py-8">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">Step 4</p>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                    <FileCheck2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-black">Your draft will appear here</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">Complete the scenario, optional supporting documents and drafting instruction before generating the court document.</p>
                  <button type="button" onClick={() => selectStage(3)} className="lawpex-focus-ring mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-stone-900 px-5 text-sm font-black text-white hover:bg-stone-800 active:translate-y-px">
                    <WandSparkles className="h-4 w-4" /> Continue drafting
                  </button>
                </div>}
            </div>

            <div className="flex flex-col gap-3 border-t border-amber-200 bg-stone-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => selectStage(1)} className="lawpex-focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 text-xs font-bold hover:bg-amber-50"><ArrowLeft className="h-3.5 w-3.5" /> Start of brief</button>
                <button type="button" onClick={() => selectStage(3)} className="lawpex-focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 text-xs font-bold hover:bg-amber-50">Instructions <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
              <button type="button" onClick={generateDraft} disabled={isGenerating} className="lawpex-focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-amber-300 px-6 text-sm font-black text-stone-950 hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70 active:translate-y-px">
                {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Gavel className="h-4 w-4" />}
                {isGenerating ? 'Preparing legal draft...' : 'Generate court document'}
              </button>
            </div>
          </section>
          </>
        ) : (
          <AssistantModePanel
            mode={mode}
            boardForm={boardForm}
            setBoardForm={setBoardForm}
            boardOutput={boardOutput}
            boardBusy={boardBusy}
            boardError={boardError}
            onGenerateBoard={generateBoardWork}
            reviewInputRef={reviewInputRef}
            reviewFile={reviewFile}
            setReviewFile={setReviewFile}
            reviewInstructions={reviewInstructions}
            setReviewInstructions={setReviewInstructions}
            reviewOutput={reviewOutput}
            reviewBusy={reviewBusy}
            reviewError={reviewError}
            onReview={reviewDocument}
            researchForm={researchForm}
            setResearchForm={setResearchForm}
            researchOutput={researchOutput}
            researchBusy={researchBusy}
            researchError={researchError}
            onResearch={runResearch}
          />
        )}
        </div>
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

const AssistantModePanel: React.FC<AssistantModePanelProps> = ({
  mode,
  boardForm,
  setBoardForm,
  boardOutput,
  boardBusy,
  boardError,
  onGenerateBoard,
  reviewInputRef,
  reviewFile,
  setReviewFile,
  reviewInstructions,
  setReviewInstructions,
  reviewOutput,
  reviewBusy,
  reviewError,
  onReview,
  researchForm,
  setResearchForm,
  researchOutput,
  researchBusy,
  researchError,
  onResearch,
}) => {
  const [copied, setCopied] = useState(false);
  const output = mode === 'board' ? boardOutput : mode === 'revisor' ? reviewOutput : researchOutput;

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id={`assistant-${mode}`} className="grid gap-8 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
      <div className="border border-amber-200 bg-white p-5 shadow-[0_24px_70px_-56px_rgba(68,49,12,0.55)] sm:p-8">
        {mode === 'board' && (
          <>
            <ModeHeading icon={BriefcaseBusiness} eyebrow="Board Assistant" title="Turn board records into usable governance documents" description="Prepare minutes, decision reports and board packs from the meeting record. Supplied facts are preserved and missing items are marked for confirmation." />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <AssistantInput label="Meeting title" value={boardForm.meetingTitle} onChange={(value) => setBoardForm((current) => ({ ...current, meetingTitle: value }))} placeholder="Quarterly board meeting" />
              <label className="text-sm font-bold text-stone-800">Meeting date<input type="date" value={boardForm.meetingDate} onChange={(event) => setBoardForm((current) => ({ ...current, meetingDate: event.target.value }))} className={FIELD_CLASS} /></label>
              <label className="text-sm font-bold text-stone-800 sm:col-span-2">Output type<select value={boardForm.outputType} onChange={(event) => setBoardForm((current) => ({ ...current, outputType: event.target.value }))} className={FIELD_CLASS}><option>Board minutes</option><option>Board decision report</option><option>Board pack</option><option>Action tracker</option></select></label>
              <label className="text-sm font-bold text-stone-800 sm:col-span-2">Attendees and apologies<textarea value={boardForm.attendees} onChange={(event) => setBoardForm((current) => ({ ...current, attendees: event.target.value }))} rows={4} className={`${FIELD_CLASS} resize-y leading-6`} placeholder="Names, roles, chair, secretary and apologies" /></label>
              <label className="text-sm font-bold text-stone-800 sm:col-span-2">Agenda<textarea value={boardForm.agenda} onChange={(event) => setBoardForm((current) => ({ ...current, agenda: event.target.value }))} rows={5} className={`${FIELD_CLASS} resize-y leading-6`} placeholder="Agenda items and papers considered" /></label>
              <label className="text-sm font-bold text-stone-800 sm:col-span-2">Meeting notes and decisions <span className="text-red-700">*</span><textarea value={boardForm.meetingNotes} onChange={(event) => setBoardForm((current) => ({ ...current, meetingNotes: event.target.value }))} rows={10} className={`${FIELD_CLASS} resize-y leading-6`} placeholder="Record the discussion, decisions, resolutions, action owners, deadlines, conflicts and matters arising." /></label>
            </div>
            {boardError && <AssistantError message={boardError} />}
            <AssistantAction onClick={onGenerateBoard} busy={boardBusy} label="Generate board document" icon={BarChart3} />
          </>
        )}

        {mode === 'revisor' && (
          <>
            <ModeHeading icon={FileSearch} eyebrow="Revisor" title="Review a document against a precise instruction" description="Upload one document, describe exactly what should be checked, and receive a structured review with findings, risk points and suggested next actions." />
            <input ref={reviewInputRef} type="file" accept=".pdf,.docx,.txt,.md" className="sr-only" onChange={(event) => setReviewFile(event.target.files?.[0] ?? null)} />
            <button type="button" onClick={() => reviewInputRef.current?.click()} className="mt-8 flex w-full items-center gap-4 border-2 border-dashed border-amber-300 bg-amber-50/70 p-5 text-left hover:border-amber-500">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-amber-300"><Upload className="h-5 w-5" /></span>
              <span><span className="block text-sm font-black">{reviewFile ? reviewFile.name : 'Choose a document to review'}</span><span className="mt-1 block text-xs leading-5 text-stone-500">PDF, DOCX, TXT or MD. The file is processed for this request.</span></span>
            </button>
            <label className="mt-6 block text-sm font-bold text-stone-800">Review instruction <span className="text-red-700">*</span><textarea value={reviewInstructions} onChange={(event) => setReviewInstructions(event.target.value)} rows={12} className={`${FIELD_CLASS} resize-y leading-6`} placeholder="Check this agreement for missing commercial terms, inconsistent party names, termination risks and provisions that require counsel confirmation." /></label>
            {reviewError && <AssistantError message={reviewError} />}
            <AssistantAction onClick={onReview} busy={reviewBusy} label="Generate review" icon={FileSearch} />
          </>
        )}

        {mode === 'researcher' && (
          <>
            <ModeHeading icon={BookOpenCheck} eyebrow="Researcher" title="Start a disciplined Nigerian legal research brief" description="Frame the question, jurisdiction and research objective. The assistant returns issues, authorities, procedure and a verification checklist." />
            <label className="mt-8 block text-sm font-bold text-stone-800">Research question <span className="text-red-700">*</span><textarea value={researchForm.question} onChange={(event) => setResearchForm((current) => ({ ...current, question: event.target.value }))} rows={9} className={`${FIELD_CLASS} resize-y leading-6`} placeholder="Can a claimant amend an originating process after pleadings have closed, and what prejudice must be addressed?" /></label>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-stone-800">Jurisdiction<input value={researchForm.jurisdiction} onChange={(event) => setResearchForm((current) => ({ ...current, jurisdiction: event.target.value }))} className={FIELD_CLASS} placeholder="Nigeria, Lagos State, Federal High Court" /></label>
              <label className="text-sm font-bold text-stone-800">Research focus<select value={researchForm.focus} onChange={(event) => setResearchForm((current) => ({ ...current, focus: event.target.value }))} className={FIELD_CLASS}><option>Authorities and procedure</option><option>Statutory framework</option><option>Case law and ratio</option><option>Litigation strategy and risks</option></select></label>
            </div>
            {researchError && <AssistantError message={researchError} />}
            <AssistantAction onClick={onResearch} busy={researchBusy} label="Research question" icon={Search} />
          </>
        )}
      </div>

      <div className="border border-amber-200 bg-stone-900 p-5 text-white shadow-[0_24px_70px_-56px_rgba(68,49,12,0.65)] sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-stone-700 pb-5">
          <div><p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Workspace output</p><h2 className="mt-2 text-xl font-black sm:text-2xl">{mode === 'board' ? 'Board document' : mode === 'revisor' ? 'Review findings' : 'Research brief'}</h2></div>
          {output && <button type="button" onClick={copyOutput} className="inline-flex h-10 items-center gap-2 rounded-lg border border-stone-600 px-3 text-xs font-bold hover:border-amber-300 hover:text-amber-200"><Copy className="h-3.5 w-3.5" /> {copied ? 'Copied' : 'Copy'}</button>}
        </div>
        {output ? <textarea value={output} readOnly aria-label="Assistant output" className="mt-6 min-h-[680px] w-full resize-y border-0 bg-transparent font-serif text-base leading-8 text-stone-100 outline-none sm:text-lg" /> : <div className="flex min-h-[680px] flex-col items-center justify-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-300 text-stone-950"><Send className="h-6 w-6" /></span><h3 className="mt-5 text-lg font-black">Your output will appear here</h3><p className="mt-2 max-w-sm text-sm leading-6 text-stone-400">Complete the workspace on the left and generate a reviewable working document.</p></div>}
        <div className="mt-6 flex gap-3 border-l-2 border-amber-300 bg-stone-800 px-4 py-4 text-sm leading-6 text-stone-300"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><p>AI output is working assistance. Verify facts, authorities, governance records and professional conclusions before relying on it.</p></div>
      </div>
    </section>
  );
};

const ModeHeading: React.FC<{ icon: React.ElementType; eyebrow: string; title: string; description: string }> = ({ icon: Icon, eyebrow, title, description }) => (
  <div className="border-b border-amber-200 pb-6"><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-800"><Icon className="h-4 w-4" /> {eyebrow}</div><h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">{description}</p></div>
);

const AssistantInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder: string }> = ({ label, value, onChange, placeholder }) => (
  <label className="text-sm font-bold text-stone-800">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className={FIELD_CLASS} placeholder={placeholder} /></label>
);

const AssistantAction: React.FC<{ onClick: () => void; busy: boolean; label: string; icon: React.ElementType }> = ({ onClick, busy, label, icon: Icon }) => (
  <button type="button" onClick={onClick} disabled={busy} className="lawpex-focus-ring mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-amber-300 px-5 text-sm font-black text-stone-950 hover:bg-amber-200 disabled:cursor-wait disabled:opacity-70"><Icon className={`h-4 w-4 ${busy ? 'animate-pulse' : ''}`} /> {busy ? 'Working...' : label}</button>
);

const AssistantError: React.FC<{ message: string }> = ({ message }) => <div role="alert" className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">{message}</div>;
