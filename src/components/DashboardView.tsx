import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  Bot,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
  Search,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import { SubscriptionTier, UserRole } from '../types';
import { NOTIFICATIONS, SUBSCRIPTION_USAGE } from '../data/platform';

interface DashboardViewProps {
  userRole: UserRole;
  subscription: SubscriptionTier;
  barNumber: string;
  setActiveTab: (tab: string) => void;
  onOpenViewer: (item: any) => void;
}

type DashboardTab =
  | 'overview'
  | 'searches'
  | 'bookmarks'
  | 'drafts'
  | 'ai'
  | 'downloads'
  | 'subscription'
  | 'notifications'
  | 'certificates'
  | 'team';

const savedCases = [
  { id: 'case-007', title: 'Tunde Adava & Anor v. The State', citation: '(2002) LDLR (CA) pt 357', savedAt: '2026-07-22' },
  { id: 'case-006', title: 'Adeoye Adekunle v. The State', citation: '(2018) LDLR (CA) pt 1200', savedAt: '2026-07-20' },
  { id: 'case-004', title: 'Adekunle v. State', citation: '(2006) LDLR (SC) pt 67', savedAt: '2026-07-18' },
];

const savedDrafts = [
  { id: 'draft-001', title: 'Motion on Notice for Interlocutory Injunction', suitNo: 'SUIT NO: LD/10425/2026', court: 'High Court of Lagos State', updatedAt: '2 hours ago' },
  { id: 'draft-003', title: 'Notice of Appeal (Court of Appeal)', suitNo: 'APPEAL NO: CA/L/410/2026', court: 'Court of Appeal, Lagos Division', updatedAt: 'Yesterday' },
];

const recentSearches = [
  { query: 'locus standi in constitutional actions', scope: 'Case law + principles', time: 'Today, 09:12' },
  { query: 'Order 25 summary judgment Federal High Court', scope: 'Court rules', time: 'Yesterday, 16:44' },
  { query: 'leave to appeal out of time trinity prayers', scope: 'Appeals Centre', time: '22 July 2026' },
];

const draftSessions = [
  { query: 'Draft a Motion on Notice for injunction under Lagos High Court Rules 2019', timestamp: 'Today at 09:15', tokensUsed: 420, status: 'Exportable' },
  { query: 'Compare Madukolu v. Nkemdilim and Salu v. Egeibon on jurisdiction', timestamp: '22 July 2026', tokensUsed: 318, status: 'Saved' },
  { query: 'Generate cross-examination questions for police IPO', timestamp: '18 July 2026', tokensUsed: 280, status: 'Needs verification' },
];

const downloads = [
  { title: 'Written address on preliminary objection', type: 'Word', date: 'Today', matter: 'Prime Lands Realty Ltd' },
  { title: 'Section 84 Evidence Act extract', type: 'PDF', date: 'Yesterday', matter: 'Commercial debt recovery' },
  { title: 'Notice of Appeal draft', type: 'Word', date: '19 July 2026', matter: 'Jurisdiction appeal' },
];

const certificates = [
  { title: 'Civil Litigation & Rules of Court', status: '74% complete', issued: 'Pending assessment' },
  { title: 'AI-Assisted Legal Research', status: 'Completed', issued: 'Certificate ready' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  userRole,
  subscription,
  barNumber,
  setActiveTab,
  onOpenViewer,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<DashboardTab>('overview');
  const usage = SUBSCRIPTION_USAGE[subscription];

  const tabs: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'searches', label: 'Recent Searches', icon: Search },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'drafts', label: 'Saved Drafts', icon: FileText },
    { id: 'ai', label: 'Wizard Drafts', icon: Bot },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'subscription', label: 'Subscription', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'certificates', label: 'Certificates', icon: GraduationCap },
    { id: 'team', label: 'Team Folder', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5ee] py-8 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="lawpex-panel overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#181411] text-lg font-black text-amber-300">
                SCN
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                    Barr. O. J. Ademola, SAN
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                </div>
                <p className="mt-2 text-xs leading-6 text-neutral-600">
                  Role: <strong>{userRole.replace('_', ' ')}</strong> · Bar number:{' '}
                  <strong className="font-mono text-amber-800">{barNumber || 'SCN/084251'}</strong> ·
                  Chambers workspace active
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-amber-200 bg-white/70 p-3 text-xs sm:grid-cols-4">
              <Usage label="Searches" value={usage.searches} />
              <Usage label="AI" value={usage.ai} />
              <Usage label="Downloads" value={usage.downloads} />
              <Usage label="Seats" value={usage.seats} />
            </div>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto border-t border-amber-100 pt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`lawpex-focus-ring inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${
                    activeSubTab === tab.id
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
        </section>

        <section className="mt-8">
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <Panel title="Matter command centre" subtitle="PRD workspace panels consolidated for daily litigation work.">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Metric icon={Bookmark} label="Saved cases" value={String(savedCases.length)} detail="Curated authority folders" />
                  <Metric icon={FileText} label="Saved drafts" value={String(savedDrafts.length)} detail="Work-in-progress processes" />
                  <Metric icon={Bot} label="Wizard drafts" value={String(draftSessions.length)} detail="Saved drafting sessions" />
                  <Metric icon={Download} label="Downloads" value={String(downloads.length)} detail="Export audit trail" />
                </div>
              </Panel>

              <Panel title="Next best actions" subtitle="One-click continuation paths from the dashboard.">
                <div className="space-y-2">
                  <Action label="Resume case-law research" onClick={() => setActiveSubTab('searches')} />
                  <Action label="Open draft library" onClick={() => setActiveTab('drafts')} />
                  <Action label="Launch Ai Draft Wizard" onClick={() => setActiveTab('ai-assistant')} />
                  <Action label="Review subscription usage" onClick={() => setActiveSubTab('subscription')} />
                </div>
              </Panel>
            </div>
          )}

          {activeSubTab === 'searches' && (
            <ListPanel title="Recent Searches" subtitle="One-click resumption of prior research threads.">
              {recentSearches.map((item) => (
                <Row key={item.query} title={item.query} meta={`${item.scope} · ${item.time}`} onClick={() => setActiveTab('case-law')} />
              ))}
            </ListPanel>
          )}

          {activeSubTab === 'bookmarks' && (
            <ListPanel title="Bookmarks" subtitle="Unified bookmarks across cases, rules, statutes, articles and videos.">
              {savedCases.map((item) => (
                <Row key={item.id} title={item.title} meta={`${item.citation} · Saved ${item.savedAt}`} onClick={() => onOpenViewer(item)} />
              ))}
            </ListPanel>
          )}

          {activeSubTab === 'drafts' && (
            <ListPanel title="Saved Drafts" subtitle="Work-in-progress court processes and agreements.">
              {savedDrafts.map((item) => (
                <Row key={item.id} title={item.title} meta={`${item.court} · ${item.suitNo} · Updated ${item.updatedAt}`} onClick={() => setActiveTab('drafts')} />
              ))}
            </ListPanel>
          )}

          {activeSubTab === 'ai' && (
            <ListPanel title="Saved Wizard Drafts" subtitle="Drafting sessions retained per user and exportable to Word.">
              {draftSessions.map((item) => (
                <Row key={item.query} title={item.query} meta={`${item.timestamp} · ${item.tokensUsed} tokens · ${item.status}`} onClick={() => setActiveTab('ai-assistant')} />
              ))}
            </ListPanel>
          )}

          {activeSubTab === 'downloads' && (
            <ListPanel title="Download History" subtitle="Audit trail of every Word and PDF export.">
              {downloads.map((item) => (
                <Row key={`${item.title}-${item.date}`} title={item.title} meta={`${item.type} · ${item.matter} · ${item.date}`} onClick={() => undefined} />
              ))}
            </ListPanel>
          )}

          {activeSubTab === 'subscription' && (
            <Panel title="Subscription Status" subtitle="Plan, renewal, seats, usage and upgrade path.">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric icon={Zap} label="Current plan" value={subscription.toUpperCase()} detail="Active subscription" />
                <Metric icon={CalendarClock} label="Renewal" value="31 Aug" detail="Auto-renewal ready" />
                <Metric icon={Users} label="Seats" value={usage.seats} detail="Firm allocation" />
                <Metric icon={ShieldCheck} label="Verification" value="Passed" detail="Counsel badge active" />
              </div>
              <button onClick={() => setActiveTab('pricing')} className="lawpex-focus-ring mt-5 rounded-xl bg-[#e6ad22] px-5 py-3 text-xs font-black text-[#181411]">
                Manage plan
              </button>
            </Panel>
          )}

          {activeSubTab === 'notifications' && (
            <ListPanel title="Notifications" subtitle="Digest, new judgments, new laws, court-rule updates and AI tips.">
              {NOTIFICATIONS.map((item) => (
                <Row key={item.title} title={item.title} meta={`${item.type} · ${item.cadence} · ${item.channel} · ${item.detail}`} onClick={() => undefined} />
              ))}
            </ListPanel>
          )}

          {activeSubTab === 'certificates' && (
            <ListPanel title="Certificates" subtitle="Learning Centre credentials stored on the user profile.">
              {certificates.map((item) => (
                <Row key={item.title} title={item.title} meta={`${item.status} · ${item.issued}`} onClick={() => setActiveTab('learning')} />
              ))}
            </ListPanel>
          )}

          {activeSubTab === 'team' && (
            <Panel title="Chambers Team Folder" subtitle="Shared folders, team collaboration, internal notes and firm-level analytics.">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Metric icon={FolderOpen} label="Shared folders" value="8" detail="Matter workspaces" />
                <Metric icon={Users} label="Assigned seats" value="7 / 10" detail="Associates onboarded" />
                <Metric icon={FileText} label="Internal notes" value="42" detail="Chambers annotations" />
              </div>
              <button onClick={() => setActiveTab('pricing')} className="lawpex-focus-ring mt-5 rounded-xl bg-[#181411] px-5 py-3 text-xs font-black text-white">
                Upgrade team capacity
              </button>
            </Panel>
          )}
        </section>
      </div>
    </div>
  );
};

const Usage: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="font-black text-neutral-950">{value}</div>
    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">{label}</div>
  </div>
);

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

const ListPanel: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <Panel title={title} subtitle={subtitle}>
    <div className="space-y-2">{children}</div>
  </Panel>
);

const Metric: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
}> = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-2xl border border-amber-100 bg-white p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-bold text-neutral-600">{label}</span>
      <Icon className="h-4 w-4 text-amber-700" />
    </div>
    <div className="mt-2 text-2xl font-black tracking-tight text-neutral-950">{value}</div>
    <p className="mt-1 text-[11px] leading-5 text-neutral-500">{detail}</p>
  </div>
);

const Row: React.FC<{ title: string; meta: string; onClick: () => void }> = ({ title, meta, onClick }) => (
  <button
    onClick={onClick}
    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-amber-100 bg-white p-4 text-left hover:border-amber-400 hover:bg-amber-50"
  >
    <span>
      <span className="block text-sm font-black text-neutral-950">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-neutral-500">{meta}</span>
    </span>
    <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-amber-700" />
  </button>
);

const Action: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="lawpex-focus-ring flex w-full items-center justify-between rounded-2xl border border-amber-100 bg-white px-4 py-3 text-left text-sm font-black text-neutral-800 hover:border-amber-400 hover:bg-amber-50"
  >
    {label}
    <ChevronRight className="h-4 w-4 text-amber-700" />
  </button>
);
