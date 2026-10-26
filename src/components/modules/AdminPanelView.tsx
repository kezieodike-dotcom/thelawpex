import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  FileCheck2,
  FileText,
  Shield,
  Users,
} from 'lucide-react';
import { ADMIN_DOMAINS } from '../../data/platform';
import { AdminCaseIngestionView } from './AdminCaseIngestionView';
import { getCaseIngestionRecords } from '../../data/caseIngestion';

type AdminTab = 'overview' | 'case-law' | 'verifications' | 'content' | 'analytics';

export const AdminPanelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [records, setRecords] = useState(getCaseIngestionRecords);

  useEffect(() => {
    const refresh = () => setRecords(getCaseIngestionRecords());
    window.addEventListener('lawpex-case-ingestion-updated', refresh);
    return () => window.removeEventListener('lawpex-case-ingestion-updated', refresh);
  }, []);

  const ingestionCounts = useMemo(() => ({
    total: records.length,
    review: records.filter((record) => record.status === 'Under Review').length,
    published: records.filter((record) => record.status === 'Published').length,
    drafts: records.filter((record) => record.status === 'Draft').length,
  }), [records]);

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'case-law', label: 'Case Law Ingestion', icon: FileCheck2 },
    { id: 'verifications', label: 'Verifications', icon: Users },
    { id: 'content', label: 'Content Ops', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5ee] py-8 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="lawpex-panel rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#181411] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">
                <Shield className="h-3.5 w-3.5" />
                Super admin control plane
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-neutral-950">
                LAWPEX Platform Administration
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-neutral-600">
                Governs users, subscriptions, content publishing, legal corpus quality, email
                automation, analytics and AI retrieval quality as specified in the PRD.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`lawpex-focus-ring inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${
                      activeTab === tab.id
                        ? 'bg-[#181411] text-white'
                        : 'border border-amber-200 bg-white/80 text-neutral-600 hover:border-amber-400 hover:text-neutral-950'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Panel title="Administrative Domains" subtitle="The PRD control-plane functions, grouped by operating domain.">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {ADMIN_DOMAINS.map((domain) => (
                    <div key={domain.domain} className="rounded-2xl border border-amber-100 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-black text-neutral-950">{domain.domain}</h3>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs leading-5 text-neutral-600">
                        {domain.functions.map((item) => (
                          <li key={item} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Live Case-Law Activity" subtitle="Counts from the current editorial ingestion workspace.">
                <div className="space-y-3">
                  <Health icon={FileCheck2} label="Source records" value={String(ingestionCounts.total)} state="Uploaded into this browser workspace" />
                  <Health icon={AlertTriangle} label="Awaiting review" value={String(ingestionCounts.review)} state="Requires editorial verification" warning={ingestionCounts.review > 0} />
                  <Health icon={CheckCircle2} label="Published from ingestion" value={String(ingestionCounts.published)} state="Visible in public case-law search" />
                  <Health icon={FileText} label="Drafts" value={String(ingestionCounts.drafts)} state="Not yet ready for publication" />
                </div>
              </Panel>
            </div>
          )}

          {activeTab === 'verifications' && (
            <Panel title="Verification Queue" subtitle="The account-verification service is not connected to this workspace yet.">
              <EmptyState title="No live verification records" detail="Connect the identity and account service before displaying or acting on verification data." />
            </Panel>
          )}

          {activeTab === 'case-law' && <AdminCaseIngestionView />}

          {activeTab === 'content' && (
            <Panel title="Publishing Workflow" subtitle="Live case-law ingestion is available in the Case Law Ingestion tab. Other content pipelines are not connected yet.">
              <div className="grid gap-3 sm:grid-cols-3">
                <LiveMetric label="Source records" value={ingestionCounts.total} />
                <LiveMetric label="In review" value={ingestionCounts.review} />
                <LiveMetric label="Published" value={ingestionCounts.published} />
              </div>
            </Panel>
          )}

          {activeTab === 'analytics' && (
            <Panel title="Analytics" subtitle="Analytics will appear when the production event and reporting services are connected.">
              <EmptyState title="No analytics data connected" detail="This panel intentionally shows no sample targets or fabricated performance figures." />
            </Panel>
          )}
        </section>
      </div>
    </div>
  );
};

const Panel: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="lawpex-card rounded-3xl p-6">
    <div className="mb-5 border-b border-amber-100 pb-4">
      <h2 className="text-xl font-black tracking-tight text-neutral-950">{title}</h2>
      <p className="mt-1 text-xs leading-6 text-neutral-600">{subtitle}</p>
    </div>
    {children}
  </div>
);

const Health: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  state: string;
  warning?: boolean;
}> = ({ icon: Icon, label, value, state, warning }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-white p-4">
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${warning ? 'bg-red-50 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
      <Icon className="h-5 w-5" />
    </span>
    <div>
      <div className="text-xs font-bold text-neutral-500">{label}</div>
      <div className="mt-1 text-lg font-black text-neutral-950">{value}</div>
      <div className="mt-1 text-[11px] text-neutral-500">{state}</div>
    </div>
  </div>
);

const LiveMetric: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="rounded-2xl border border-amber-100 bg-white p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">{label}</p>
    <p className="mt-2 text-2xl font-black text-neutral-950">{value}</p>
  </div>
);

const EmptyState: React.FC<{ title: string; detail: string }> = ({ title, detail }) => (
  <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-10 text-center">
    <p className="text-sm font-black text-neutral-900">{title}</p>
    <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-neutral-500">{detail}</p>
  </div>
);
