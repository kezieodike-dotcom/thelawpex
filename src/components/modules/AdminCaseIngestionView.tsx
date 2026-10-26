import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  updateCaseIngestionStatus,
} from '../../data/caseIngestion';
import { CaseLaw } from '../../types';

const FIELD_CLASS = 'mt-1.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100';
const TEXTAREA_CLASS = `${FIELD_CLASS} min-h-28 resize-y leading-6`;
const STATUS_ORDER: CaseIngestionStatus[] = ['Draft', 'Under Review', 'Approved', 'Published'];

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
    year: new Date().getFullYear(),
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

export const AdminCaseIngestionView: React.FC = () => {
  const [records, setRecords] = useState<AdminCaseRecord[]>(getCaseIngestionRecords);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [citation, setCitation] = useState('');
  const [court, setCourt] = useState<CaseLaw['court']>('Supreme Court of Nigeria');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [busy, setBusy] = useState(false);
  const [reprocessingId, setReprocessingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = records.find((record) => record.id === selectedId) ?? null;

  const counts = useMemo(() => STATUS_ORDER.reduce<Record<string, number>>((result, status) => {
    result[status] = records.filter((record) => record.status === status).length;
    return result;
  }, {}), [records]);

  const refresh = (nextRecords: AdminCaseRecord[]) => {
    setRecords(nextRecords);
    saveCaseIngestionRecords(nextRecords);
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
      body.append('title', base.title);
      body.append('citation', base.citation);
      body.append('court', base.court);
      body.append('year', String(base.year));
      const response = await fetch('/api/admin/case-law/extract', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The extraction service could not process this judgment.');

      const extracted = mergeExtractedDraft(base, result.draft || {});
      extracted.warnings = [...base.warnings, ...(result.warnings || [])];
      extracted.duplicateCandidates = result.duplicateCandidates || findDuplicateCandidates(extracted, records);
      const nextRecords = [extracted, ...records];
      refresh(nextRecords);
      setSelectedId(extracted.id);
      setFile(null);
      setTitle('');
      setCitation('');
      setNotice('Extraction complete. Review every field before approval or publication.');
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      const fallback = { ...base, warnings: ['AI extraction was unavailable. Complete the record manually before review.'] };
      const nextRecords = [fallback, ...records];
      refresh(nextRecords);
      setSelectedId(fallback.id);
      setNotice(error instanceof Error ? `${error.message} A draft record was created for manual completion.` : 'A draft record was created for manual completion.');
    } finally {
      setBusy(false);
    }
  };

  const updateSelected = (patch: Partial<AdminCaseRecord>) => {
    if (!selected) return;
    if (patch.status === 'Published') {
      const missing = publishingGaps(selected);
      if (missing.length > 0) {
        setNotice(`Publication blocked. Complete: ${missing.join(', ')}.`);
        return;
      }
    }
    const now = new Date().toISOString();
    const nextStatus = patch.status ?? (selected.status === 'Published' ? 'Under Review' : selected.status);
    const action = patch.status ? `Status changed to ${patch.status}` : selected.status === 'Published' ? 'Published record edited; returned to Under Review' : 'Editorial field edited';
    const updated = {
      ...selected,
      ...patch,
      status: nextStatus,
      updatedAt: now,
      auditLog: [...selected.auditLog, { at: now, action, status: nextStatus }],
    };
    const nextRecords = records.map((record) => record.id === updated.id ? updated : record);
    setRecords(nextRecords);
    upsertCaseIngestionRecord(updated);
  };

  const removeRecord = (id: string) => {
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
      const now = new Date().toISOString();
      const merged: AdminCaseRecord = {
        ...record,
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
        fullJudgmentText: record.fullJudgmentText || draft.fullJudgmentText || '',
        warnings: [...new Set([...record.warnings, ...(result.warnings || []), 'Source reprocessed; existing editorial values were preserved.'])],
        updatedAt: now,
        status: record.status === 'Published' ? 'Under Review' : record.status,
        auditLog: [...record.auditLog, { at: now, action: 'Source reprocessed; existing editorial values preserved', status: record.status === 'Published' ? 'Under Review' : record.status }],
      };
      const nextRecords = records.map((item) => item.id === record.id ? merged : item);
      refresh(nextRecords);
      setNotice('Reprocessing complete. Review any newly filled fields before approval.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The source could not be reprocessed.');
    } finally {
      setReprocessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="rounded-2xl border border-amber-100 bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">{status}</p>
            <p className="mt-2 text-2xl font-black text-neutral-950">{counts[status] || 0}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Panel title="Upload a judgment" subtitle="The original source is retained unchanged while an extraction draft is prepared.">
          <div className="rounded-2xl border border-dashed border-amber-400 bg-amber-50/60 p-5 text-center">
            <UploadCloud className="mx-auto h-8 w-8 text-amber-700" />
            <p className="mt-3 text-sm font-black text-neutral-950">PDF or DOCX judgment</p>
            <p className="mt-1 text-xs leading-5 text-neutral-600">Upload the source exactly as received from the approved source.</p>
            <input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="sr-only" />
            <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#181411] px-4 py-2.5 text-xs font-black text-white hover:bg-neutral-800">
              <FileUp className="h-4 w-4" /> Choose source
            </button>
            {file && <p className="mt-3 break-all text-xs font-bold text-amber-800">{file.name} · {formatBytes(file.size)}</p>}
          </div>

          <div className="mt-5 space-y-3">
            <label className="block text-xs font-black text-neutral-800">Case title<input value={title} onChange={(event) => setTitle(event.target.value)} className={FIELD_CLASS} placeholder="Adekunle v. State" /></label>
            <label className="block text-xs font-black text-neutral-800">Citation<input value={citation} onChange={(event) => setCitation(event.target.value)} className={FIELD_CLASS} placeholder="(2025) LDLR-124 (SC)" /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-black text-neutral-800">Court<select value={court} onChange={(event) => setCourt(event.target.value as CaseLaw['court'])} className={FIELD_CLASS}><option>Supreme Court of Nigeria</option><option>Court of Appeal</option><option>Federal High Court</option><option>National Industrial Court</option><option>State High Court</option></select></label>
              <label className="block text-xs font-black text-neutral-800">Year<input type="number" value={year} onChange={(event) => setYear(event.target.value)} className={FIELD_CLASS} /></label>
            </div>
            <button type="button" disabled={busy || !file} onClick={handleExtract} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#facc15] px-4 py-3 text-sm font-black text-[#181411] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500">
              {busy ? <span className="animate-pulse">Preparing review...</span> : <><Search className="h-4 w-4" /> Extract and create review draft</>}
            </button>
            {notice && <p className="border-l-2 border-amber-500 pl-3 text-xs leading-5 text-neutral-700" role="status">{notice}</p>}
          </div>
        </Panel>

        <Panel title="Editorial queue" subtitle="Only Approved records can be published to public case-law search.">
          {records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-5 py-12 text-center">
              <FileCheck2 className="mx-auto h-8 w-8 text-neutral-400" />
              <p className="mt-3 text-sm font-black text-neutral-800">No judgment drafts yet</p>
              <p className="mt-1 text-xs text-neutral-500">Upload the first source document to start the controlled workflow.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((record) => (
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

      {selected && <ReviewEditor record={selected} onChange={updateSelected} onStatusChange={(status) => updateSelected({ status })} onDelete={() => removeRecord(selected.id)} onReprocess={() => handleReprocess(selected)} reprocessing={reprocessingId === selected.id} />}
    </div>
  );
};

const ReviewEditor: React.FC<{ record: AdminCaseRecord; onChange: (patch: Partial<AdminCaseRecord>) => void; onStatusChange: (status: CaseIngestionStatus) => void; onDelete: () => void; onReprocess: () => void; reprocessing: boolean }> = ({ record, onChange, onStatusChange, onDelete, onReprocess, reprocessing }) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const setList = (key: 'issuesForDetermination' | 'principles' | 'authorities' | 'statutes' | 'practiceNotes', value: string) => onChange({ [key]: value.split(/\n+/).map((item) => item.replace(/^\s*(?:\d+\.|[-*])\s*/, '').trim()).filter(Boolean) });
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
    <Panel title="Editorial review" subtitle="Verify every extracted field against the original source before publishing.">
      <div className="flex flex-col gap-4 border-b border-amber-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div><div className="flex flex-wrap items-center gap-2"><StatusBadge status={record.status} /><span className="text-xs font-semibold text-neutral-500">Source preserved: {record.sourceDocument.fileName}</span></div><h3 className="mt-3 text-xl font-black text-neutral-950">{record.title || 'Untitled judgment'}</h3><p className="mt-1 text-xs text-neutral-500">Updated {new Date(record.updatedAt).toLocaleString()}</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={reprocessing} onClick={onReprocess} className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-black text-neutral-800 hover:border-amber-400 disabled:cursor-wait disabled:opacity-60"><Search className="h-4 w-4" /> {reprocessing ? 'Reprocessing...' : 'Reprocess source'}</button>
          {record.status !== 'Published' && <button type="button" onClick={() => onStatusChange(nextStatus)} className="inline-flex items-center gap-2 rounded-xl bg-[#181411] px-3 py-2 text-xs font-black text-white hover:bg-neutral-800"><CheckCircle2 className="h-4 w-4 text-amber-300" /> {nextStatus === 'Published' ? 'Approve and publish' : `Move to ${nextStatus}`}</button>}
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Remove</button>
        </div>
      </div>

      {(record.warnings.length > 0 || record.duplicateCandidates.length > 0) && <div className="mt-5 grid gap-3 md:grid-cols-2">{record.warnings.length > 0 && <Notice icon={AlertTriangle} title="Verification warnings" items={record.warnings} tone="amber" />}{record.duplicateCandidates.length > 0 && <Notice icon={ClipboardCheck} title="Possible duplicates" items={record.duplicateCandidates} tone="blue" />}</div>}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-emerald-700" /><h4 className="text-sm font-black text-neutral-950">Original source preserved</h4></div>
          <p className="mt-2 text-xs leading-5 text-neutral-700">Review the extracted fields against the unchanged uploaded document. No case may be published until the source, ratios and references are checked.</p>
          {sourceUrl && <a href={sourceUrl} download={record.sourceDocument.fileName} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-emerald-900 ring-1 ring-emerald-200 hover:bg-emerald-50"><Save className="h-3.5 w-3.5" /> Download source</a>}
        </div>
        {sourceUrl && record.sourceDocument.fileType === 'application/pdf' && <iframe src={`${sourceUrl}#view=FitH`} title={`Source document for ${record.title}`} className="h-64 w-full rounded-2xl border border-neutral-200 bg-neutral-100 lg:h-80" />}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="text-xs font-black text-neutral-800">Case title<input value={record.title} onChange={(event) => onChange({ title: event.target.value })} className={FIELD_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800">Citation<input value={record.citation} onChange={(event) => onChange({ citation: event.target.value })} className={FIELD_CLASS} placeholder="(2025) LDLR-124 (SC)" /></label>
        <label className="text-xs font-black text-neutral-800">Court<select value={record.court} onChange={(event) => onChange({ court: event.target.value as CaseLaw['court'] })} className={FIELD_CLASS}><option>Supreme Court of Nigeria</option><option>Court of Appeal</option><option>Federal High Court</option><option>National Industrial Court</option><option>State High Court</option></select></label>
        <label className="text-xs font-black text-neutral-800">Subject<input value={record.subject} onChange={(event) => onChange({ subject: event.target.value })} className={FIELD_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800 lg:col-span-2">Procedural history<textarea value={record.proceduralHistory} onChange={(event) => onChange({ proceduralHistory: event.target.value })} className={TEXTAREA_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800 lg:col-span-2">Facts summary<textarea value={record.factsSummary} onChange={(event) => onChange({ factsSummary: event.target.value })} className={TEXTAREA_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800 lg:col-span-2">Issues for determination <span className="font-normal text-neutral-500">(one issue per line)</span><textarea value={record.issuesForDetermination.map((item, index) => `${index + 1}. ${item}`).join('\n')} onChange={(event) => setList('issuesForDetermination', event.target.value)} className={TEXTAREA_CLASS} /></label>
        <label className="text-xs font-black text-neutral-800 lg:col-span-2">Decision / held<textarea value={record.decisionSummary} onChange={(event) => onChange({ decisionSummary: event.target.value })} className={TEXTAREA_CLASS} /></label>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ListEditor label="Principles of law" items={record.principles} onChange={(value) => setList('principles', value)} />
        <ListEditor label="Authorities and notes" items={record.authorities} onChange={(value) => setList('authorities', value)} />
        <ListEditor label="Statutes considered" items={record.statutes} onChange={(value) => setList('statutes', value)} />
        <ListEditor label="Practice notes" items={record.practiceNotes} onChange={(value) => setList('practiceNotes', value)} />
      </div>

      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-amber-700" /><h4 className="text-sm font-black text-neutral-950">Ratio decidendi source links</h4></div>
        <p className="mt-1 text-xs leading-5 text-neutral-600">Each ratio must preserve the judge’s exact wording. Record the actual source page or page range and the labelled paragraph or paragraph range where the quotation starts and ends. Multiline quotations are preserved exactly.</p>
        <div className="mt-4 space-y-4">
          {record.ratios.map((ratio, index) => <div key={`ratio-${index}`} className="rounded-2xl border border-amber-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.12em] text-amber-800">Ratio {index + 1}</p><button type="button" onClick={() => removeRatio(index)} aria-label={`Remove ratio ${index + 1}`} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <label className="text-xs font-black text-neutral-800 lg:col-span-2">Ratio heading<input value={ratio.heading} onChange={(event) => updateRatio(index, { heading: event.target.value })} className={FIELD_CLASS} placeholder="EVIDENCE - CALLING OF EVIDENCE - Whether..." /></label>
              <label className="text-xs font-black text-neutral-800 lg:col-span-2">Exact judicial wording<textarea value={ratio.exactText} onChange={(event) => updateRatio(index, { exactText: event.target.value })} className={`${TEXTAREA_CLASS} min-h-32`} placeholder="Paste the exact passage from the judgment. Do not summarise." /></label>
              <label className="text-xs font-black text-neutral-800">Judge / attribution<input value={ratio.attribution} onChange={(event) => updateRatio(index, { attribution: event.target.value })} className={FIELD_CLASS} placeholder="IDRIS LEGBO KUTIGI, J.S.C." /></label>
              <label className="text-xs font-black text-neutral-800">Source page or pages<input value={ratio.sourcePage} onChange={(event) => updateRatio(index, { sourcePage: event.target.value })} className={FIELD_CLASS} placeholder="9 or 11-12" /></label>
              <label className="text-xs font-black text-neutral-800 lg:col-span-2">Source paragraph or paragraphs<input value={ratio.sourceParagraph} onChange={(event) => updateRatio(index, { sourceParagraph: event.target.value })} className={FIELD_CLASS} placeholder="A or C-D" /></label>
            </div>
          </div>)}
          <button type="button" onClick={addRatio} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-black text-neutral-800 hover:bg-amber-50"><Plus className="h-4 w-4 text-amber-700" /> Add ratio</button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-amber-100 pt-5 text-xs text-neutral-500"><LockKeyhole className="h-4 w-4 text-amber-700" /> Publication is an editorial action. Approved records are searchable only after publication.</div>
      <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-2"><HistoryIcon className="h-4 w-4 text-neutral-600" /><h4 className="text-xs font-black uppercase tracking-[0.12em] text-neutral-700">Version history and audit log</h4></div>
        <div className="mt-3 space-y-2">{record.auditLog.slice().reverse().slice(0, 8).map((event, index) => <div key={`${event.at}-${index}`} className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600"><span>{event.action}</span><span className="font-mono text-[10px] text-neutral-400">{new Date(event.at).toLocaleString()} · {event.status}</span></div>)}</div>
      </div>
    </Panel>
  );
};

const ListEditor: React.FC<{ label: string; items: string[]; onChange: (value: string) => void }> = ({ label, items, onChange }) => <label className="text-xs font-black text-neutral-800">{label} <span className="font-normal text-neutral-500">(one item per line)</span><textarea value={items.map((item, index) => `${index + 1}. ${item}`).join('\n')} onChange={(event) => onChange(event.target.value)} className={`${TEXTAREA_CLASS} min-h-32`} /></label>;

const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => <History className={className} />;

const findDuplicateCandidates = (record: AdminCaseRecord, existing: AdminCaseRecord[]) => {
  const title = normaliseCaseText(record.title);
  const citation = normaliseCaseText(record.citation);
  return [...LANDMARK_CASES.map((item) => ({ title: item.title, citation: item.citation })), ...existing.map((item) => ({ title: item.title, citation: item.citation }))]
    .filter((item) => (title && normaliseCaseText(item.title) === title) || (citation && normaliseCaseText(item.citation) === citation))
    .map((item) => `${item.title} · ${item.citation}`);
};

const publishingGaps = (record: AdminCaseRecord) => {
  const gaps: string[] = [];
  if (!record.title.trim()) gaps.push('case title');
  if (!record.citation.trim()) gaps.push('citation');
  if (!record.fullJudgmentText.trim()) gaps.push('full judgment text');
  if (!record.factsSummary.trim()) gaps.push('facts');
  if (!record.issuesForDetermination.length) gaps.push('issues for determination');
  if (!record.decisionSummary.trim()) gaps.push('decision / held');
  if (!record.ratios.length) gaps.push('at least one ratio');
  if (record.ratios.some((ratio) => !ratio.exactText.trim() || !ratio.sourcePage.trim() || !ratio.sourceParagraph.trim())) gaps.push('complete ratio wording, page and paragraph references');
  return gaps;
};

const formatBytes = (bytes: number) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const StatusBadge: React.FC<{ status: CaseIngestionStatus }> = ({ status }) => <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${status === 'Published' ? 'bg-emerald-100 text-emerald-800' : status === 'Rejected' ? 'bg-red-100 text-red-800' : status === 'Approved' ? 'bg-blue-100 text-blue-800' : status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700'}`}>{status}</span>;

const Notice: React.FC<{ icon: React.ElementType; title: string; items: string[]; tone: 'amber' | 'blue' }> = ({ icon: Icon, title, items, tone }) => <div className={`rounded-2xl border p-4 ${tone === 'amber' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'}`}><div className="flex items-center gap-2 text-xs font-black text-neutral-950"><Icon className="h-4 w-4" />{title}</div><ul className="mt-2 space-y-1 text-xs leading-5 text-neutral-700">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>;

const Panel: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 border-b border-amber-100 pb-4"><h2 className="text-xl font-black tracking-tight text-neutral-950">{title}</h2><p className="mt-1 text-xs leading-6 text-neutral-600">{subtitle}</p></div>{children}</section>;
