import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, BookOpen, ChartNoAxesCombined, CheckCheck, ChevronRight, Clock3, FileCheck2, Files, LayoutDashboard, Menu, Plus, Search, ShieldCheck, Users, X } from 'lucide-react';
import { LogoMark } from '../LogoMark';
import { getCaseIngestionRecords } from '../../data/caseIngestion';
import caseCatalog from '../../data/caseCatalog.json';
import './admin-workspace.css';

const AdminCaseIngestionView = lazy(() => import('./AdminCaseIngestionView').then((module) => ({ default: module.AdminCaseIngestionView })));
const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'case-law', label: 'Case workspace', icon: FileCheck2 },
  { id: 'content', label: 'Published library', icon: BookOpen },
  { id: 'verifications', label: 'Verifications', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined },
] as const;
type AdminTab = typeof NAV[number]['id'];

export const AdminPanelView: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const activeTab: AdminTab = NAV.find((item) => item.id === params.get('view'))?.id ?? 'overview';
  const [records, setRecords] = useState(getCaseIngestionRecords);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [court, setCourt] = useState('All courts');
  useEffect(() => {
    const refresh = () => setRecords(getCaseIngestionRecords());
    window.addEventListener('lawpex-case-ingestion-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('lawpex-case-ingestion-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  const navigate = (view: AdminTab, extra: Record<string, string> = {}) => {
    setParams({ view, ...extra });
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const counts = {
    drafts: records.filter((r) => r.status === 'Draft').length,
    review: records.filter((r) => r.status === 'Under Review').length,
    approved: records.filter((r) => r.status === 'Approved').length,
  };
  const library = useMemo(() => [...caseCatalog, ...records.filter((r) => r.status === 'Published')], [records]);
  const visibleCases = library.filter((item) =>
    (court === 'All courts' || item.court === court) &&
    `${item.title} ${item.citation} ${item.subject}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const recent = [...records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const title = NAV.find((item) => item.id === activeTab)!.label;

  return (
    <div className="admin-workspace">
      <aside className="admin-rail">
        <Link to="/" className="admin-brand" aria-label="LAWPEX home">
          <LogoMark className="h-10 w-10 rounded-lg" alt="" />
          <span><strong>LAWPEX</strong><small>Administration</small></span>
        </Link>
        <button className="admin-mobile-toggle" aria-label={menuOpen ? 'Close admin navigation' : 'Open admin navigation'} aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <div id="admin-navigation" className={`admin-rail-content ${menuOpen ? 'is-open' : ''}`}>
          <p className="admin-nav-label">WORKSPACE</p>
          <nav aria-label="Admin navigation">
            {NAV.map(({ id, label, icon: Icon }) => <button key={id} aria-current={activeTab === id ? 'page' : undefined} onClick={() => navigate(id)}><Icon size={19} /><span>{label}</span>{id === 'case-law' && counts.review > 0 && <b>{counts.review}</b>}</button>)}
          </nav>
          <div className="admin-rail-bottom">
            <Link to="/case-law"><ArrowUpRight size={18} /> Open public site</Link>
            <div className="admin-storage"><ShieldCheck size={19} /><span>Editorial workspace<small>Records saved in this browser</small></span></div>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar"><span>Administration <ChevronRight size={14} /> <strong>{title}</strong></span><Link to="/">Back to LAWPEX <ArrowUpRight size={16} /></Link></header>
        <div className="admin-body">
          <div className="admin-page-heading">
            <div><p className="admin-eyebrow">CONTENT & EDITORIAL</p><h1>{activeTab === 'overview' ? 'Your editorial overview' : title}</h1><p>{activeTab === 'overview' ? 'Cases, review activity and publishing at a glance.' : activeTab === 'case-law' ? 'Judgment intake and source-verified editorial review.' : activeTab === 'content' ? `${library.length} published cases in the LAWPEX collection.` : 'Workspace services and reporting.'}</p></div>
            {activeTab !== 'case-law' && <button className="admin-button primary" onClick={() => navigate('case-law', { upload: '1' })}><Plus size={18} /> Upload judgment</button>}
          </div>

          {activeTab === 'overview' && <>
            <div className="admin-metrics">
              {[
                { label: 'Published cases', value: library.length, icon: BookOpen, view: 'content' as AdminTab, tone: 'green', status: '' },
                { label: 'Awaiting review', value: counts.review, icon: Clock3, view: 'case-law' as AdminTab, tone: 'yellow', status: 'Under Review' },
                { label: 'Approved', value: counts.approved, icon: CheckCheck, view: 'case-law' as AdminTab, tone: 'blue', status: 'Approved' },
                { label: 'Drafts', value: counts.drafts, icon: Files, view: 'case-law' as AdminTab, tone: 'neutral', status: 'Draft' },
              ].map(({ label, value, icon: Icon, view, tone, status }) => <button key={label} className="admin-metric" onClick={() => navigate(view, status ? { status } : {})}><span className={`admin-metric-icon ${tone}`}><Icon size={20} /></span><span className="admin-metric-label">{label}</span><strong>{value}</strong><ArrowUpRight size={16} className="admin-metric-arrow" /></button>)}
            </div>

            <div className="admin-overview-grid">
              <section className="admin-section">
                <div className="admin-section-heading"><h2>Recent editorial activity</h2><button className="admin-text-button" onClick={() => navigate('case-law')}>View queue <ArrowRight size={16} /></button></div>
                {recent.length ? <div className="admin-records">{recent.map((r) => <button key={r.id} onClick={() => navigate('case-law', { record: r.id })}><span className="admin-document-icon"><FileCheck2 size={20} /></span><span><strong>{r.title}</strong><small>{r.citation || 'Citation pending'}</small></span><Status status={r.status} /><ChevronRight size={16} /></button>)}</div> : <div className="admin-empty"><span className="admin-empty-icon"><ArrowDownToLine size={28} /></span><h3>Your editorial queue is clear</h3><p>No uploaded judgments in this browser workspace.</p><button className="admin-button" onClick={() => navigate('case-law', { upload: '1' })}><Plus size={16} /> Add a judgment</button></div>}
                <div className="admin-section-footer"><ShieldCheck size={16} /> {records.length} source records in this browser</div>
              </section>
              <section className="admin-pipeline">
                <h2>Publishing pipeline</h2>
                {[
                  ['01', 'Draft', 'Source uploaded', counts.drafts],
                  ['02', 'Under Review', 'Editorial verification', counts.review],
                  ['03', 'Approved', 'Ready for publication', counts.approved],
                  ['04', 'Published', 'Published from this workspace', records.filter((r) => r.status === 'Published').length],
                ].map(([number, status, caption, count]) => <button key={status} onClick={() => navigate('case-law', { status: String(status) })}><span className="admin-step">{number}</span><span><strong>{status}</strong><small>{caption}</small></span><b>{count}</b><ChevronRight size={14} /></button>)}
              </section>
            </div>
            <section className="admin-section admin-library-preview"><div className="admin-section-heading"><div><h2>Published collection</h2><p>Available in public case-law search</p></div><button className="admin-text-button" onClick={() => navigate('content')}>View all cases <ArrowRight size={16} /></button></div><CaseTable cases={library.slice(-5).reverse()} /></section>
          </>}

          {activeTab === 'content' && <section className="admin-section"><div className="admin-library-toolbar"><label className="admin-search"><Search size={18} /><input aria-label="Search published cases" placeholder="Search title, citation or subject" value={query} onChange={(e) => setQuery(e.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={16} /></button>}</label><select aria-label="Filter by court" value={court} onChange={(e) => setCourt(e.target.value)}><option>All courts</option><option>Supreme Court of Nigeria</option><option>Court of Appeal</option></select></div><CaseTable cases={visibleCases} /><div className="admin-section-footer" role="status">{visibleCases.length} of {library.length} cases</div></section>}

          {activeTab === 'case-law' && <Suspense fallback={<div className="admin-loading" role="status">Loading editorial workspace...</div>}><AdminCaseIngestionView key={params.get('record') || params.get('status') || 'workspace'} initialSelectedId={params.get('record')} initialStatus={params.get('status')} /></Suspense>}
          {activeTab === 'verifications' && <ServiceEmpty icon={Users} title="Verification service not connected" detail="Account verification records will appear here once an identity service is connected." />}
          {activeTab === 'analytics' && <ServiceEmpty icon={ChartNoAxesCombined} title="No reporting service connected" detail="Traffic and usage data are not available in this workspace." />}
        </div>
        <footer className="admin-footer"><span>LAWPEX Administration</span><span>Editorial control. Source integrity.</span></footer>
      </div>
    </div>
  );
};

const Status = ({ status }: { status: string }) => <span className="admin-status" data-status={status}>{status}</span>;
const CaseTable = ({ cases }: { cases: { id: string; title: string; citation: string; court: string }[] }) => <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Case title</th><th>Court</th><th>Status</th><th><span className="sr-only">Open case</span></th></tr></thead><tbody>{cases.map((item) => <tr key={item.id}><td><Link to={`/case-law/case/${item.id}`}>{item.title}</Link><small>{item.citation}</small></td><td>{item.court === 'Supreme Court of Nigeria' ? 'Supreme Court' : item.court}</td><td><Status status="Published" /></td><td><Link className="admin-icon-button" aria-label={`Open ${item.title}`} title="Open case" to={`/case-law/case/${item.id}`}><ArrowUpRight size={18} /></Link></td></tr>)}</tbody></table>{!cases.length && <div className="admin-empty"><Search size={25} /><h3>No matching cases</h3><p>Try another name or citation.</p></div>}</div>;
const ServiceEmpty = ({ icon: Icon, title, detail }: { icon: React.ElementType; title: string; detail: string }) => <section className="admin-section"><div className="admin-empty"><span className="admin-empty-icon"><Icon size={28} /></span><h2>{title}</h2><p>{detail}</p><span className="admin-status">Not connected</span></div></section>;
