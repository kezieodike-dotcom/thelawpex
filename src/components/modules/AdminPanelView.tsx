import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  FileText,
  Mail,
  Scale,
  Shield,
  Users,
} from 'lucide-react';
import { ADMIN_DOMAINS, KPI_TARGETS } from '../../data/platform';

type AdminTab = 'overview' | 'verifications' | 'content' | 'analytics';

const verificationQueue = [
  { id: 'usr-101', name: 'Barr. Temitope Alabi', kind: 'NBA number', credential: 'SCN/092104', status: 'Pending SCN verification' },
  { id: 'usr-102', name: 'Hon. Justice M. K. Danjuma', kind: 'Judicial credential', credential: 'FCT High Court appointment letter', status: 'Manual review required' },
  { id: 'usr-103', name: 'Adigun & Co. Legal Practitioners', kind: 'Firm account', credential: '10 requested seats', status: 'Seat admin review' },
];

const contentPipeline = [
  { type: 'Judgments', queued: 228, review: 41, published: 15480 },
  { type: 'Statutes', queued: 9, review: 12, published: 4620 },
  { type: 'Court Rules', queued: 6, review: 17, published: 1248 },
  { type: 'Articles', queued: 34, review: 19, published: 2020 },
  { type: 'Videos', queued: 11, review: 7, published: 86 },
];

export const AdminPanelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
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
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                          {domain.health}
                        </span>
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

              <Panel title="System Health" subtitle="Operational indicators for launch readiness.">
                <div className="space-y-3">
                  <Health icon={Activity} label="Search latency" value="1.4s avg" state="Within PRD target" />
                  <Health icon={Scale} label="Citation linking" value="94.2%" state="Needs continuous review" />
                  <Health icon={Mail} label="Digest delivery" value="Scheduled" state="Email + in-app" />
                  <Health icon={AlertTriangle} label="Manual reviews" value="53" state="Action required" warning />
                </div>
              </Panel>
            </div>
          )}

          {activeTab === 'verifications' && (
            <Panel title="Verification Queue" subtitle="NBA, judicial and firm-account checks before subscription activation.">
              <div className="space-y-2">
                {verificationQueue.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-black text-neutral-950">{item.name}</h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {item.kind} · {item.credential} · {item.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-xl bg-[#e6ad22] px-3 py-2 text-xs font-black text-[#181411]">Approve</button>
                      <button className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-black text-neutral-700">Request info</button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {activeTab === 'content' && (
            <Panel title="Publishing Workflow" subtitle="Draft, review and publish states for legal content ingestion.">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-xs">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">
                      <th className="border-b border-amber-100 p-3">Content type</th>
                      <th className="border-b border-amber-100 p-3">Queued</th>
                      <th className="border-b border-amber-100 p-3">Review</th>
                      <th className="border-b border-amber-100 p-3">Published</th>
                      <th className="border-b border-amber-100 p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentPipeline.map((item) => (
                      <tr key={item.type}>
                        <td className="border-b border-amber-50 p-3 font-black text-neutral-950">{item.type}</td>
                        <td className="border-b border-amber-50 p-3">{item.queued}</td>
                        <td className="border-b border-amber-50 p-3">{item.review}</td>
                        <td className="border-b border-amber-50 p-3">{item.published.toLocaleString()}</td>
                        <td className="border-b border-amber-50 p-3">
                          <button className="rounded-lg bg-amber-100 px-2 py-1 font-black text-amber-800">Open queue</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}

          {activeTab === 'analytics' && (
            <Panel title="Year 1 KPI Targets" subtitle="Growth, revenue, content depth, engagement, quality and performance targets.">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {KPI_TARGETS.map((item) => (
                  <div key={item.metric} className="rounded-2xl border border-amber-100 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">{item.category}</p>
                    <h3 className="mt-2 text-sm font-black text-neutral-950">{item.metric}</h3>
                    <p className="mt-2 text-2xl font-black tracking-tight text-neutral-950">{item.target}</p>
                  </div>
                ))}
              </div>
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
