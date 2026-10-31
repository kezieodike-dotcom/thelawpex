import React, { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ClipboardCheck, Download, FileSearch } from 'lucide-react';
import { toPublishedCaseLaw, type AdminCaseRecord } from '../../data/caseIngestion';
import { hasCurrentReview } from '../../lib/caseReportReview';

const ReportPreview = lazy(() => import('./CaseLawView').then(module => ({ default: module.WholeCasePanel })));
const fieldClass = 'mt-2 w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-900';
const blankReview = { reviewer: '', source: false, metadata: false, ratios: false, principles: false };

export function ReportVerificationPanel({ record, onChange, onValidate, validating }: {
  record: AdminCaseRecord; onChange: (patch: Partial<AdminCaseRecord>) => void; onValidate: () => void; validating: boolean;
}) {
  const [preview, setPreview] = useState(false);
  const [destination, setDestination] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const current = hasCurrentReview(record);
  const review = record.review ?? blankReview;
  const report = useMemo(() => toPublishedCaseLaw(record), [record]);
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `${record.id}-editorial-backup.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  React.useEffect(() => {
    if (!preview || destination === null || !previewRef.current) return;
    const container = previewRef.current;
    const scroll = () => {
      const page = container.querySelector(`[data-report-page-number="${destination}"]`);
      if (!page) return false;
      page.scrollIntoView({ block: 'start' }); setDestination(null); return true;
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => { if (scroll()) observer.disconnect(); });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [preview, destination]);

  return <section className="admin-editor-panel mt-6" aria-label="Report verification">
    <header><h2>Report verification</h2><p>{current ? 'References verified against the LAWPEX reader' : 'Editorial review required before approval'}</p></header>
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={validating} onClick={onValidate} className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"><ClipboardCheck size={18} />{validating ? 'Verifying...' : 'Build and verify report'}</button>
      <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold"><Download size={18} />Export editorial backup</button>
      {current && <button type="button" onClick={() => setPreview(!preview)} className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold"><FileSearch size={18} />{preview ? 'Close report preview' : 'Preview LAWPEX report'}</button>}
    </div>
    <dl className="my-5 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-neutral-500">Extracted characters</dt><dd>{record.sourceExtraction?.text.length.toLocaleString() ?? 'Not extracted'}</dd></div><div><dt className="text-neutral-500">Source quality</dt><dd>{!record.sourceExtraction ? 'Unverified' : record.sourceExtraction.incomplete ? 'OCR / source correction required' : 'Text extracted; visual review required'}</dd></div><div><dt className="text-neutral-500">Source SHA-256</dt><dd className="break-all font-mono text-xs">{record.sourceExtraction?.sha256 ?? 'Unavailable'}</dd></div></dl>
    <label className="block text-sm font-semibold">Exact leading-judgment heading<textarea className={fieldClass} rows={2} value={record.leadingJudgmentHeading ?? ''} onChange={event => onChange({ leadingJudgmentHeading: event.target.value })} /></label>
    {record.duplicateCandidates.length > 0 && <label className="mt-4 block text-sm font-semibold">Duplicate review decision<textarea className={fieldClass} value={record.duplicateResolution ?? ''} onChange={event => onChange({ duplicateResolution: event.target.value })} /></label>}
    <div className="mt-5 space-y-4">{record.principles.map((principle, index) => <label key={index} className="block text-sm font-semibold">Principle {index + 1}: {principle}<textarea aria-label={`Supporting quotation for principle ${index + 1}`} className={fieldClass} rows={3} value={record.principleSources?.[index] ?? ''} onChange={event => { const sources = [...(record.principleSources ?? [])]; sources[index] = event.target.value; onChange({ principleSources: sources }); }} /></label>)}</div>
    {record.validation?.errors.length ? <div role="alert" className="mt-5 border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-900"><strong>Publication blocked</strong><ul className="mt-2 list-disc space-y-2 pl-5">{record.validation.errors.map(error => <li key={error}>{error}</li>)}</ul></div> : null}
    {current && <div className="mt-6"><h3 className="flex items-center gap-2 text-base font-semibold"><CheckCircle2 size={18} className="text-green-700" />Verified source passages</h3><div className="mt-3 divide-y divide-neutral-200">{record.validation?.evidence.map(item => <details key={item.item} className="py-3 text-sm"><summary className="cursor-pointer font-semibold">{item.item}: {item.page.includes('-') ? 'Pp.' : 'P.'} {item.page}, {item.paragraph.includes('-') ? 'paras.' : 'para.'} {item.paragraph}</summary><p className="mt-3 font-semibold">{item.judge}</p><p className="mt-3 whitespace-pre-wrap leading-7">{item.firstText}</p>{item.lastText !== item.firstText && <p className="mt-3 whitespace-pre-wrap leading-7">{item.lastText}</p>}<button type="button" onClick={() => { setPreview(true); setDestination(Number(item.page.split('-')[0])); }} className="mt-3 underline">Open report page {item.page.split('-')[0]}</button></details>)}</div></div>}
    <fieldset disabled={!current} className="mt-6 space-y-3 border-t border-neutral-200 pt-5 disabled:opacity-50"><legend className="font-semibold">Editorial signoff</legend>
      <label className="block text-sm">Reviewer's name<input className={fieldClass} value={review.reviewer} onChange={event => onChange({ review: { ...review, reviewer: event.target.value } })} /></label>
      {([['source', 'I compared the complete extracted judgment and its leading-judgment boundary with the original.'], ['metadata', 'I checked the title, citation, coram, parties, counsel, facts, issues, procedural history and decision.'], ['ratios', 'I checked every ratio, judge attribution, completeness and exact first/last page and paragraph.'], ['principles', 'I checked that the principles are supported, complete and distinct from the ratios.']] as const).map(([key, label]) => <label key={key} className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={review[key]} onChange={event => onChange({ review: { ...review, [key]: event.target.checked } })} className="mt-1 h-4 w-4 shrink-0 accent-yellow-600" />{label}</label>)}
    </fieldset>
    {preview && current && <div ref={previewRef} className="mt-6 min-w-0 border-t border-neutral-200 pt-5"><Suspense fallback={<p role="status">Preparing report preview...</p>}><ReportPreview judgment={report} /></Suspense></div>}
  </section>;
}
