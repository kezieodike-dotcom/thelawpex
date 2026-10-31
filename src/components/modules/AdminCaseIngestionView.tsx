import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  FileUp,
  History,
  LockKeyhole,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { LANDMARK_CASES } from '../../data/legalData';
import {
  AdminCaseRecord,
  CaseIngestionStatus,
  getCaseIngestionRecords,
  getSourceDocument,
  normaliseCaseText,
  saveCaseIngestionRecords,
  saveSourceDocument,
  upsertCaseIngestionRecord,
} from '../../data/caseIngestion';
import { CaseLaw } from '../../types';
import { applyEditorialChange, publicationGaps, hasCurrentReview, reviewFingerprint } from '../../lib/caseReportReview';
import { ReportVerificationPanel } from './ReportVerificationPanel';

const FIELD_CLASS = 'mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100';
const TEXTAREA_CLASS = `${FIELD_CLASS} min-h-28 resize-y leading-6`;
const STATUS_ORDER: CaseIngestionStatus[] = ['Draft', 'Under Review', 'Approved', 'Published'];
const OriginalDocxPreview = React.lazy(() => import('../DocxPreview').then(module => ({ default: module.DocxPreview })));

const emptyRecord = (file: File): AdminCaseRecord => {
  const now = new Date().toISOString();
  const id = `ingested-${Date.now()}`;
  return {
    id,
    status: 'Draft',
    createdAt: now,
    updatedAt: now,
    sourceDocument: { fileName: file.name, fileType: file.type || 'application/octet-stream', size: file.size, storageKey: id },
    title: file.name.replace(/\.(pdf|docx)$/i, '').replace(/[-_]+/g, ' '),
    citation: '',
    court: 'Supreme Court of Nigeria',
    year: 0,
    judicialDivision: '',
    dateDelivered: '',
    suitNumber: '',
    presidingJudges: [],
    appearances: { appellant: '', respondent: '' },
    areaOfLaw: '',
    subject: '',
    proceduralHistory: '',
    factsSummary: '',
    issuesForDetermination: [],
    decisionSummary: '',
    ratios: [],
    principles: [],
    authorities: [],
    statutes: [],
    practiceNotes: [],
    fullJudgmentText: '',
    warnings: [],
    duplicateCandidates: [],
    auditLog: [{ at: now, action: 'Source uploaded and draft created', status: 'Draft' }],
  };
};

const asList = (value: unknown): string[] => Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];

const mergeExtractedDraft = (base: AdminCaseRecord, draft: Partial<AdminCaseRecord>): AdminCaseRecord => ({
  ...base,
  ...draft,
  sourceDocument: base.sourceDocument,
  id: base.id,
  status: base.status,
  createdAt: base.createdAt,
  updatedAt: new Date().toISOString(),
  presidingJudges: asList(draft.presidingJudges),
  issuesForDetermination: asList(draft.issuesForDetermination),
  ratios: Array.isArray(draft.ratios) ? draft.ratios : [],
  principles: asList(draft.principles),
  authorities: asList(draft.authorities),
  statutes: asList(draft.statutes),
  practiceNotes: asList(draft.practiceNotes),
  appearances: { ...base.appearances, ...(draft.appearances || {}) },
  auditLog: Array.isArray(draft.auditLog) ? draft.auditLog : base.auditLog,
});

export const AdminCaseIngestionView: React.FC<{ initialSelectedId?: string | null; initialStatus?: string | null }> = ({ initialSelectedId, initialStatus }) => {
  const [records, setRecords] = useState<AdminCaseRecord[]>(getCaseIngestionRecords);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus && [...STATUS_ORDER, 'Rejected'].includes(initialStatus as CaseIngestionStatus) ? initialStatus : 'All');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [citation, setCitation] = useState('');
  const [court, setCourt] = useState<CaseLaw['court']>('Supreme Court of Nigeria');
  const [year, setYear] = useState('');
  const [busy, setBusy] = useState(false);
  const [reprocessingId, setReprocessingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [validating, setValidating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const selected = records.find((record) => record.id === selectedId) ?? null;
  const filteredRecords = records.filter((record) => (statusFilter === 'All' || record.status === statusFilter) && `${record.title} ${record.citation} ${record.sourceDocument.fileName}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (selectedId) reviewRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [selectedId]);

  const refresh = (nextRecords: AdminCaseRecord[]) => {
    saveCaseIngestionRecords(nextRecords);
    setRecords(nextRecords);
  };

  const handleExtract = async () => {
    if (!file) {
      setNotice('Choose a PDF or DOCX judgment first.');
      return;
    }
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['pdf', 'docx'].includes(extension)) {
      setNotice('Only PDF and DOCX judgments can enter the case ingestion queue.');
      return;
    }

    setBusy(true);
    setNotice('Preserving the source and preparing an extraction review...');
    const base = emptyRecord(file);
    base.title = title.trim() || base.title;
    base.citation = citation.trim();
    base.court = court;
    base.year = Number(year) || base.year;

    try {
      await saveSourceDocument(base.sourceDocument.storageKey, file);
      const body = new FormData();
      body.append('document', file);
      body.append('title', title.trim());
      body.append('citation', base.citation);
      body.append('court', base.court);
      body.append('year', String(base.year));
      const response = await fetch('/api/admin/case-law/extract', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The extraction service could not process this judgment.');

      const extracted = mergeExtractedDraft(base, result.draft || {});
      extracted.warnings = [...base.warnings, ...(result.warnings || [])];
      const currentRecords = getCaseIngestionRecords();
      extracted.duplicateCandidates = findDuplicateCandidates(extracted, currentRecords);
      const nextRecords = [extracted, ...currentRecords];
      refresh(nextRecords);
      setSelectedId(extracted.id);
      setFile(null);
      setTitle('');
      setCitation('');
      setNotice('Extraction complete. Review every field before approval or publication.');
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      const fallback = { ...base, warnings: ['AI extraction was unavailable. Complete the record manually before review.'] };
      const nextRecords = [fallback, ...getCaseIngestionRecords()];
      refresh(nextRecords);
      setSelectedId(fallback.id);
      setNotice(error instanceof Error ? `${error.message} A draft record was created for manual completion.` : 'A draft record was created for manual completion.');
    } finally {
      setBusy(false);
    }
  };

  const updateSelected = async (patch: Partial<AdminCaseRecord>) => {
    if (!selected) return;
    if (patch.status === 'Approved' || patch.status === 'Published') {
      const missing = publicationGaps(selected);
      if (patch.status === 'Published' && selected.status !== 'Approved') missing.push('approval before publication');
      if (patch.status === 'Approved' && selected.status !== 'Under Review') missing.push('move the draft to Under Review first');
      if (missing.length > 0) {
        setNotice(`Publication blocked. Complete: ${missing.join(', ')}.`);
        return;
      }
    }
    const now = new Date().toISOString();
    const editorial = !patch.status && !patch.review;
    const changed = editorial ? applyEditorialChange(selected, patch) : { ...selected, ...patch };
    const nextStatus = patch.status ?? (patch.review && ['Approved', 'Published'].includes(changed.status) ? 'Under Review' : changed.status);
    const action = patch.status ? `Status changed to ${patch.status}` : selected.status === 'Published' ? 'Published record edited; returned to Under Review' : 'Editorial field edited';
    const updated = {
      ...changed,
      status: nextStatus,
      updatedAt: now,
      auditLog: [...selected.auditLog, { at: now, action, status: nextStatus }],
    };
    const nextRecords = records.map((record) => record.id === updated.id ? updated : record);
    try {
      if (patch.status === 'Approved' || patch.status === 'Published') {
        const snapshotKey = `${selected.id}:revision:${crypto.randomUUID()}`;
        await saveSourceDocument(snapshotKey, new File([JSON.stringify(updated, null, 2)], `${selected.id}-revision.json`, { type: 'application/json' }));
        const current = getCaseIngestionRecords().find(record => record.id === selected.id);
        if (JSON.stringify(current) !== JSON.stringify(selected)) { setNotice('The draft changed while saving its revision. Review the latest changes before approval.'); return; }
        updated.auditLog[updated.auditLog.length - 1] = { ...updated.auditLog[updated.auditLog.length - 1], snapshotKey };
      }
      upsertCaseIngestionRecord(updated); setRecords(nextRecords);
    }
    catch { setNotice('Changes could not be saved. Browser storage may be full; export an editorial backup before continuing.'); }
  };

  const handleValidate = async () => {
    if (!selected) return;
    setValidating(true);
    setNotice('Building the report and verifying exact quotations against its labelled pages...');
    try {
      const source = await getSourceDocument(selected.sourceDocument.storageKey);
      if (!source) throw new Error('The original source document is missing. Upload or reprocess it before verification.');
      const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await source.arrayBuffer())), byte => byte.toString(16).padStart(2, '0')).join('');
      if (digest !== selected.sourceExtraction?.sha256) throw new Error('The preserved source does not match its extraction fingerprint. Reprocess the source.');
      const textDigest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(selected.sourceExtraction.text))), byte => byte.toString(16).padStart(2, '0')).join('');
      if (textDigest !== selected.sourceExtraction.textSha256) throw new Error('The extracted text no longer matches its fingerprint. Reprocess the preserved source.');
      const { compileCaseReport } = await import('../../lib/compileCaseReport');
      const checked = await compileCaseReport({ ...selected, duplicateCandidates: findDuplicateCandidates(selected, getCaseIngestionRecords().filter(record => record.id !== selected.id)), status: 'Under Review' });
      const latest = getCaseIngestionRecords();
      const current = latest.find(record => record.id === selected.id);
      if (!current || reviewFingerprint(current) !== reviewFingerprint(selected)) throw new Error('The draft changed during verification. Run verification again on the latest edits.');
      checked.auditLog = [...selected.auditLog, { at: new Date().toISOString(), action: checked.validation?.errors.length ? 'Report verification failed; publication blocked' : 'Report verified against canonical LAWPEX pages and paragraphs', status: checked.status }];
      refresh(latest.map(record => record.id === checked.id ? checked : record));
      setNotice(checked.validation?.errors.length ? 'Verification found blocking issues. Review the report checks below.' : 'Source references verified. Compare the report with the original and complete all editorial signoffs.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Verification failed.'); }
    finally { setValidating(false); }
  };

  const removeRecord = (id: string) => {
    if (!window.confirm('Remove this draft from the editorial queue? Export a backup first if you need to retain its editorial work.')) return;
    const nextRecords = records.filter((record) => record.id !== id);
    refresh(nextRecords);
    if (selectedId === id) setSelectedId(null);
  };

  const handleReprocess = async (record: AdminCaseRecord) => {
    setReprocessingId(record.id);
    setNotice('Reprocessing the preserved source without replacing reviewed fields...');
    try {
      const source = await getSourceDocument(record.sourceDocument.storageKey);
      if (!source) throw new Error('The preserved source document could not be found in this browser.');
      const file = new File([source], record.sourceDocument.fileName, { type: record.sourceDocument.fileType });
      const body = new FormData();
      body.append('document', file);
      body.append('title', record.title);
      body.append('citation', record.citation);
      body.append('court', record.court);
      body.append('year', String(record.year));
      const response = await fetch('/api/admin/case-law/extract', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The source could not be reprocessed.');
      const draft = result.draft as Partial<AdminCaseRecord>;
      const latest = getCaseIngestionRecords();
      const current = latest.find(item => item.id === record.id);
      if (!current || reviewFingerprint(current) !== reviewFingerprint(record)) throw new Error('The draft changed while reprocessing. Existing edits have been preserved; reprocess again.');
      const now = new Date().toISOString();
      const merged: AdminCaseRecord = {
        ...record,
        sourceExtraction: draft.sourceExtraction,
        leadingJudgmentHeading: record.leadingJudgmentHeading || draft.leadingJudgmentHeading,
        principleSources: record.principleSources?.length ? record.principleSources : draft.principleSources,
        validation: undefined,
        review: undefined,
        preparedReportText: undefined,
        judicialDivision: record.judicialDivision || draft.judicialDivision || '',
        dateDelivered: record.dateDelivered || draft.dateDelivered || '',
        suitNumber: record.suitNumber || draft.suitNumber || '',
        presidingJudges: record.presidingJudges.length ? record.presidingJudges : asList(draft.presidingJudges),
        appearances: record.appearances.appellant || record.appearances.respondent ? record.appearances : { ...record.appearances, ...(draft.appearances || {}) },
        areaOfLaw: record.areaOfLaw || draft.areaOfLaw || '',
        subject: record.subject || draft.subject || '',
        proceduralHistory: record.proceduralHistory || draft.proceduralHistory || '',
        factsSummary: record.factsSummary || draft.factsSummary || '',
        issuesForDetermination: record.issuesForDetermination.length ? record.issuesForDetermination : asList(draft.issuesForDetermination),
        decisionSummary: record.decisionSummary || draft.decisionSummary || '',
        ratios: record.ratios.length ? record.ratios : Array.isArray(draft.ratios) ? draft.ratios : [],
        principles: record.principles.length ? record.principles : asList(draft.principles),
        authorities: record.authorities.length ? record.authorities : asList(draft.authorities),
        statutes: record.statutes.length ? record.statutes : asList(draft.statutes),
        practiceNotes: record.practiceNotes.length ? record.practiceNotes : asList(draft.practiceNotes),
        fullJudgmentText: draft.sourceExtraction?.text || '',
        warnings: [...new Set([...record.warnings, ...(result.warnings || []), 'Source reprocessed; existing editorial values were preserved.'])],
        updatedAt: now,
        status: ['Approved', 'Published'].includes(record.status) ? 'Under Review' : record.status,
        auditLog: [...record.auditLog, { at: now, action: 'Source reprocessed; existing editorial values preserved', status: record.status === 'Published' ? 'Under Review' : record.status }],
      };
      const nextRecords = latest.map((item) => item.id === record.id ? merged : item);
      refresh(nextRecords);
      setNotice('Reprocessing complete. Review any newly filled fields before approval.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The source could not be reprocessed.');
    } finally {
      setReprocessingId(null);
    }
  };

  return (
    <div className="admin-ingestion space-y-6">
      <p className="border-l-2 border-amber-500 bg-amber-50 p-4 text-sm text-neutral-800">Local editorial workspace. Drafts, original files and publication are stored in this browser only; they are not shared with other administrators or visitors.</p>
      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Panel title="Upload a judgment" subtitle="PDF and DOCX source documents">
          <div className="rounded-2xl border border-dashed border-amber-400 bg-amber-50/60 p-5 text-center">
            <UploadCloud className="mx-auto h-8 w-8 text-amber-700" />
            <p className="mt-3 text-sm font-black text-neutral-950">PDF or DOCX judgment</p>
            <p className="mt-1 text-xs leading-5 text-neutral-600">Original document retained unchanged</p>
            <input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="sr-only" />
            <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#181411] px-4 py-2.5 text-xs font-black text-white hover:bg-neutral-800">
              <FileUp className="h-4 w-4" /> Choose source
            </button>
            {file && <p className="mt-3 break-all text-xs font-bold text-amber-800">{file.name} · {formatBytes(file.size)}</p>}
          </div>

          <div className="mt-5 space-y-3">
            <label className="block text-xs font-black text-neutral-800">Case title<input value={title} onChange={(event) => setTitle(event.target.value)} className={FIELD_CLASS} placeholder="Adekunle v. State" /></label>
            <label className="block text-xs font-black text-neutral-800">Citation<input value={citation} onChange={(event) => setCitation(event.target.value)} className={FIELD_CLASS} placeholder="(2025) LDLR-124 (SC)" /></label>
            <div className="grid gap-3">
              <label className="block text-xs font-black text-neutral-800">Court<select value={court} onChange={(event) => setCourt(event.target.value as CaseLaw['court'])} className={FIELD_CLASS}><option>Supreme Court of Nigeria</option><option>Court of Appeal</option><option>Federal High Court</option><option>National Industrial Court</option><option>State High Court</option></select></label>
              <label className="block text-xs font-black text-neutral-800">Year<input type="number" value={year} onChange={(event) => setYear(event.target.value)} className={FIELD_CLASS} /></label>
            </div>
            <button type="button" disabled={busy || !file} onClick={handleExtract} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#facc15] px-4 py-3 text-sm font-black text-[#181411] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500">
              {busy ? <span className="animate-pulse">Preparing review...</span> : <><Search className="h-4 w-4" /> Extract and create review draft</>}
            </button>
          </div>
        </Panel>

        <Panel title="Editorial queue" subtitle={`${records.length} source records in this browser`}>
          <label className="admin-search"><Search size={18} /><input aria-label="Search editorial queue" placeholder="Search case or source document" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <div className="admin-queue-filters" aria-label="Filter queue by status">
            {['All', ...STATUS_ORDER, ...(records.some((record) => record.status === 'Rejected') ? ['Rejected'] : [])].map((status) => <button key={status} type="button" aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>{status} <span>({status === 'All' ? records.length : records.filter((record) => record.status === status).length})</span></button>)}
          </div>
          {records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-5 py-12 text-center">
              <FileCheck2 className="mx-auto h-8 w-8 text-neutral-400" />
              <p className="mt-3 text-sm font-black text-neutral-800">No judgment drafts yet</p>
              <p className="mt-1 text-xs text-neutral-500">Uploaded judgments will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {!filteredRecords.length && <p className="py-8 text-center text-sm text-neutral-500" role="status">No records match this search or status.</p>}
              {filteredRecords.map((record) => (
                <button key={record.id} type="button" onClick={() => setSelectedId(record.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${selectedId === record.id ? 'border-amber-500 bg-amber-50' : 'border-amber-100 bg-white hover:border-amber-300'}`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-amber-300"><FileCheck2 className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-black text-neutral-950">{record.title}</span><span className="mt-1 block truncate text-xs text-neutral-500">{record.citation || 'Citation pending'} · {record.sourceDocument.fileName}</span></span>
                  <StatusBadge status={record.status} />
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {notice && <p className="border-l-2 border-amber-500 bg-white p-4 text-sm leading-5 text-neutral-700" role="status">{notice}</p>}
      {selected && <div ref={reviewRef} className="scroll-mt-5"><ReviewEditor key={selected.id} record={selected} onChange={updateSelected} onStatusChange={(status) => updateSelected({ status })} onDelete={() => removeRecord(selected.id)} onReprocess={() => handleReprocess(selected)} reprocessing={reprocessingId === selected.id} /><ReportVerificationPanel record={selected} onChange={updateSelected} onValidate={handleValidate} validating={validating} /></div>}
    </div>
  );
};

const ReviewEditor: React.FC<{ record: AdminCaseRecord; onChange: (patch: Partial<AdminCaseRecord>) => void; onStatusChange: (status: CaseIngestionStatus) => void; onDelete: () => void; onReprocess: () => void; reprocessing: boolean }> = ({ record, onChange, onStatusChange, onDelete, onReprocess, reprocessing }) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [section, setSection] = useState('Case details');
  const setList = (key: 'issuesForDetermination' | 'principles' | 'authorities' | 'statutes' | 'practiceNotes', value: string) => onChange({ ...(key === 'principles' ? { principleSources: [] } : {}), [key]: value.split(/\n+/).map((item) => item.replace(/^\s*(?:\d+\.|[-*])\s*/, '').trim()).filter(Boolean) });
  const updateRatio = (index: number, patch: Partial<AdminCaseRecord['ratios'][number]>) => onChange({ ratios: record.ratios.map((ratio, ratioIndex) => ratioIndex === index ? { ...ratio, ...patch } : ratio) });
  const addRatio = () => onChange({ ratios: [...record.ratios, { heading: '', exactText: '', attribution: '', sourcePage: '', sourceParagraph: '' }] });
  const removeRatio = (index: number) => onChange({ ratios: record.ratios.filter((_, ratioIndex) => ratioIndex !== index) });
  const nextStatus = STATUS_ORDER[Math.min(STATUS_ORDER.indexOf(record.status) + 1, STATUS_ORDER.length - 1)];

  useEffect(() => {
    let active = true;
    let objectUrl = '';
    getSourceDocument(record.sourceDocument.storageKey).then((source) => {
      if (!active || !source) return;
      objectUrl = URL.createObjectURL(source);
      setSourceUrl(objectUrl);
    }).catch(() => setSourceUrl(''));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [record.sourceDocument.storageKey]);

  return (
    <Panel title="Editorial review" subtitle="Changes saved to this browser workspace">
      <div className="flex flex-col gap-4 border-b border-amber-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div><div className="flex flex-wrap items-center gap-2"><StatusBadge status={record.status} /><span className="text-xs font-semibold text-neutral-500">Source preserved: {record.sourceDocument.fileName}</span></div><h3 className="mt-3 text-xl font-black text-neutral-950">{record.title || 'Untitled judgment'}</h3><p className="mt-1 text-xs text-neutral-500">Updated {new Date(record.updatedAt).toLocaleString()}</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={reprocessing} onClick={onReprocess} className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-black text-neutral-800 hover:border-amber-400 disabled:cursor-wait disabled:opacity-60"><Search className="h-4 w-4" /> {reprocessing ? 'Reprocessing...' : 'Reprocess source'}</button>
          {record.status !== 'Published' && <button type="button" onClick={() => onStatusChange(nextStatus)} className="inline-flex items-center gap-2 rounded-xl bg-[#181411] px-3 py-2 text-xs font-black text-white hover:bg-neutral-800"><CheckCircle2 className="h-4 w-4 text-amber-300" /> {nextStatus === 'Published' ? 'Approve and publish' : `Move to ${nextStatus}`}</button>}
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Remove</button>
        </div>
      </div>

      {(record.warnings.length > 0 || record.duplicateCandidates.length > 0) && <div className="mt-5 grid gap-3 md:grid-cols-2">{record.warnings.length > 0 && <Notice icon={AlertTriangle} title="Verification warnings" items={record.warnings} tone="amber" />}{record.duplicateCandidates.length > 0 && <Notice icon={ClipboardCheck} title="Possible duplicates" items={record.duplicateCandidates} tone="blue" />}</div>}

      <nav className="admin-review-tabs" aria-label="Editorial sections">{['Case details', 'Principles & authorities', 'Ratio decidendi', 'Source document', 'Audit history'].map((label) => <button key={label} type="button" aria-pressed={section === label} onClick={() => setSection(label)}>{label}{label === 'Ratio decidendi' ? ` (${record.ratios.length})` : ''}</button>)}</nav>

      <div hidden={section !== 'Source document'}>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-emerald-700" /><h4 className="text-sm font-black text-neutral-950">Original source preserved</h4></div>
          <p className="mt-2 text-xs leading-5 text-neutral-700">Review the extracted fields against the unchanged uploaded document. No case may be published until the source, ratios and references are checked.</p>
          {sourceUrl && <a href={sourceUrl} download={record.sourceDocument.fileName} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-emerald-900 ring-1 ring-emerald-200 hover:bg-emerald-50"><Save className="h-3.5 w-3.5" /> Download source</a>}
        </div>
        {section === 'Source document' && sourceUrl && record.sourceDocument.fileName.toLowerCase().endsWith('.pdf') && <iframe src={`${sourceUrl}#view=FitH`} title={`Source document for ${record.title}`} className="h-64 w-full rounded-2xl border border-neutral-200 bg-neutral-100 lg:h-80" />}
        {section === 'Source document' && sourceUrl && record.sourceDocument.fileName.toLowerCase().endsWith('.docx') && <div className="max-h-[40rem] min-w-0 overflow-auto"><React.Suspense fallback={<p role="status">Preparing original document...</p>}><OriginalDocxPreview src={sourceUrl} /></React.Suspense></div>}
      </div>
      <label className="mt-5 block text-sm font-semibold">Extracted source text (read-only)<textarea readOnly value={record.fullJudgmentText} className={`${TEXTAREA_CLASS} min-h-80`} /></label>
      </div>

      <div hidden={section !== 'Case details'} className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="text-xs font-black text-neutral-800">Case title<input value={record.title} onChange={(event) => onChange({ title: event.target.value })} className={FIELD_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800">Citation<input value={record.citation} onChange={(event) => onChange({ citation: event.target.value })} className={FIELD_CLASS} placeholder="(2025) LDLR-124 (SC)" /></label>
        <label className="text-xs font-black text-neutral-800">Court<select value={record.court} onChange={(event) => onChange({ court: event.target.value as CaseLaw['court'] })} className={FIELD_CLASS}><option>Supreme Court of Nigeria</option><option>Court of Appeal</option><option>Federal High Court</option><option>National Industrial Court</option><option>State High Court</option></select></label>
        <label className="text-xs font-black text-neutral-800">Subject<input value={record.subject} onChange={(event) => onChange({ subject: event.target.value })} className={FIELD_CLASS} /></label>
        {(['judicialDivision', 'dateDelivered', 'suitNumber', 'areaOfLaw'] as const).map(key => <label key={key} className="text-xs font-black text-neutral-800">{{ judicialDivision: 'Judicial division', dateDelivered: 'Date delivered', suitNumber: 'Suit number', areaOfLaw: 'Area of law' }[key]}<input value={record[key]} onChange={event => onChange({ [key]: event.target.value })} className={FIELD_CLASS} /></label>)}
        <label className="text-xs font-black text-neutral-800">Year<input type="number" value={record.year} onChange={event => onChange({ year: Number(event.target.value) })} className={FIELD_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800">Coram (one judge per line)<textarea value={record.presidingJudges.join('\n')} onChange={event => onChange({ presidingJudges: event.target.value.split('\n') })} className={TEXTAREA_CLASS} /></label>
        {(['appellant', 'respondent'] as const).map(key => <label key={key} className="text-xs font-black text-neutral-800">Counsel for {key}<input value={record.appearances[key]} onChange={event => onChange({ appearances: { ...record.appearances, [key]: event.target.value } })} className={FIELD_CLASS} /></label>)}
        <label className="text-xs font-black text-neutral-800 lg:col-span-2">Procedural history<textarea value={record.proceduralHistory} onChange={(event) => onChange({ proceduralHistory: event.target.value })} className={TEXTAREA_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800 lg:col-span-2">Facts summary<textarea value={record.factsSummary} onChange={(event) => onChange({ factsSummary: event.target.value })} className={TEXTAREA_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800 lg:col-span-2">Issues for determination <span className="font-normal text-neutral-500">(one issue per line)</span><textarea value={record.issuesForDetermination.map((item, index) => `${index + 1}. ${item}`).join('\n')} onChange={(event) => setList('issuesForDetermination', event.target.value)} className={TEXTAREA_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800 lg:col-span-2">Decision / held<textarea value={record.decisionSummary} onChange={(event) => onChange({ decisionSummary: event.target.value })} className={TEXTAREA_CLASS} /></label>
      </div>

      <div hidden={section !== 'Principles & authorities'} className="mt-6 grid gap-5 lg:grid-cols-2">
        <ListEditor label="Principles of law" items={record.principles} onChange={(value) => setList('principles', value)} />
        <ListEditor label="Authorities and notes" items={record.authorities} onChange={(value) => setList('authorities', value)} />
        <ListEditor label="Statutes considered" items={record.statutes} onChange={(value) => setList('statutes', value)} />
        <ListEditor label="Practice notes" items={record.practiceNotes} onChange={(value) => setList('practiceNotes', value)} />
      </div>

      <div hidden={section !== 'Ratio decidendi'} className="admin-review-ratios mt-6">
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-amber-700" /><h4 className="text-sm font-black text-neutral-950">Ratio decidendi source links</h4></div>
        <p className="mt-1 text-xs leading-5 text-neutral-600">Exact judicial quotations only. LAWPEX page and A-G references are calculated during report verification, not supplied by AI.</p>
        <div className="mt-4 space-y-4">
          {record.ratios.map((ratio, index) => <div key={`ratio-${index}`} className="rounded-2xl border border-amber-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.12em] text-amber-800">Ratio {index + 1}</p><button type="button" onClick={() => removeRatio(index)} aria-label={`Remove ratio ${index + 1}`} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <label className="text-xs font-black text-neutral-800 lg:col-span-2">Ratio heading<input value={ratio.heading} onChange={(event) => updateRatio(index, { heading: event.target.value })} className={FIELD_CLASS} placeholder="EVIDENCE - CALLING OF EVIDENCE - Whether..." /></label>
              <label className="text-xs font-black text-neutral-800 lg:col-span-2">Exact judicial wording<textarea value={ratio.exactText} onChange={(event) => updateRatio(index, { exactText: event.target.value })} className={`${TEXTAREA_CLASS} min-h-32`} placeholder="Paste the exact passage from the judgment. Do not summarise." /></label>
              <label className="text-xs font-black text-neutral-800">Judge / attribution<input value={ratio.attribution} onChange={(event) => updateRatio(index, { attribution: event.target.value })} className={FIELD_CLASS} placeholder="IDRIS LEGBO KUTIGI, J.S.C." /></label>
              <label className="text-xs font-black text-neutral-800">LAWPEX page or pages<input readOnly value={hasCurrentReview(record) ? ratio.sourcePage : ''} className={FIELD_CLASS} placeholder="Awaiting verification" /></label>
              <label className="text-xs font-black text-neutral-800 lg:col-span-2">LAWPEX paragraph or paragraphs<input readOnly value={hasCurrentReview(record) ? ratio.sourceParagraph : ''} className={FIELD_CLASS} placeholder="Awaiting verification" /></label>
            </div>
          </div>)}
          <button type="button" onClick={addRatio} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-black text-neutral-800 hover:bg-amber-50"><Plus className="h-4 w-4 text-amber-700" /> Add ratio</button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-amber-100 pt-5 text-xs text-neutral-500"><LockKeyhole className="h-4 w-4 text-amber-700" /> Publication is an editorial action. Approved records are searchable only after publication.</div>
      <div hidden={section !== 'Audit history'} className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-2"><HistoryIcon className="h-4 w-4 text-neutral-600" /><h4 className="text-xs font-black uppercase tracking-[0.12em] text-neutral-700">Version history and audit log</h4></div>
        <div className="mt-3 max-h-96 space-y-2 overflow-auto">{record.auditLog.slice().reverse().map((event, index) => <div key={`${event.at}-${index}`} className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600"><span>{event.action}</span><span className="font-mono text-[10px] text-neutral-400">{new Date(event.at).toLocaleString()} · {event.status}</span>{event.snapshotKey && <button type="button" onClick={async () => { const snapshot = await getSourceDocument(event.snapshotKey!); if (!snapshot) return; const url = URL.createObjectURL(snapshot); const link = document.createElement('a'); link.href = url; link.download = `${record.id}-${event.status}-revision.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }} className="underline">Download saved revision</button>}</div>)}</div>
      </div>
    </Panel>
  );
};

const ListEditor: React.FC<{ label: string; items: string[]; onChange: (value: string) => void }> = ({ label, items, onChange }) => <label className="text-xs font-black text-neutral-800">{label} <span className="font-normal text-neutral-500">(one item per line)</span><textarea value={items.map((item, index) => `${index + 1}. ${item}`).join('\n')} onChange={(event) => onChange(event.target.value)} className={`${TEXTAREA_CLASS} min-h-32`} /></label>;

const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => <History className={className} />;

const findDuplicateCandidates = (record: AdminCaseRecord, existing: AdminCaseRecord[]) => {
  const title = normaliseCaseText(record.title);
  const citation = normaliseCaseText(record.citation);
  return [...LANDMARK_CASES.map((item) => ({ title: item.title, citation: item.citation, hash: undefined as string | undefined })), ...existing.map((item) => ({ title: item.title, citation: item.citation, hash: item.sourceExtraction?.sha256 }))]
    .filter((item) => (item.hash && item.hash === record.sourceExtraction?.sha256) || (title && normaliseCaseText(item.title) === title) || (citation && normaliseCaseText(item.citation) === citation))
    .map((item) => `${item.title} · ${item.citation}`);
};

const formatBytes = (bytes: number) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const StatusBadge: React.FC<{ status: CaseIngestionStatus }> = ({ status }) => <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${status === 'Published' ? 'bg-emerald-100 text-emerald-800' : status === 'Rejected' ? 'bg-red-100 text-red-800' : status === 'Approved' ? 'bg-blue-100 text-blue-800' : status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700'}`}>{status}</span>;

const Notice: React.FC<{ icon: React.ElementType; title: string; items: string[]; tone: 'amber' | 'blue' }> = ({ icon: Icon, title, items, tone }) => <div className={`rounded-2xl border p-4 ${tone === 'amber' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'}`}><div className="flex items-center gap-2 text-xs font-black text-neutral-950"><Icon className="h-4 w-4" />{title}</div><ul className="mt-2 space-y-1 text-xs leading-5 text-neutral-700">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>;

const Panel: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => <section className="admin-editor-panel"><header><h2>{title}</h2><p>{subtitle}</p></header>{children}</section>;
