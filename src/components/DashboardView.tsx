import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bookmark,
  FileText,
  Clock,
  Download,
  Bot,
  Zap,
  CheckCircle2,
  Users,
  Search,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Trash2,
  Award
} from 'lucide-react';
import { UserRole, SubscriptionTier } from '../types';

interface DashboardViewProps {
  userRole: UserRole;
  subscription: SubscriptionTier;
  barNumber: string;
  setActiveTab: (tab: string) => void;
  onOpenViewer: (item: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userRole,
  subscription,
  barNumber,
  setActiveTab,
  onOpenViewer
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'saved_cases' | 'saved_drafts' | 'ai_chats' | 'team'>('overview');

  const savedCases = [
    {
      id: 'case-001',
      title: 'Amaechi v. INEC & Ors',
      citation: '(2008) 5 NWLR (Pt. 1080) 227',
      type: 'Case Law',
      savedAt: '2026-07-22'
    },
    {
      id: 'case-002',
      title: 'Salu v. Egeibon',
      citation: '(1994) 6 NWLR (Pt. 348) 23',
      type: 'Case Law',
      savedAt: '2026-07-20'
    },
    {
      id: 'case-005',
      title: 'Kubor v. Dickson',
      citation: '(2013) 4 NWLR (Pt. 1345) 534',
      type: 'Case Law',
      savedAt: '2026-07-18'
    }
  ];

  const savedDrafts = [
    {
      id: 'draft-001',
      title: 'Motion on Notice for Interlocutory Injunction',
      suitNo: 'SUIT NO: LD/10425/2026',
      court: 'High Court of Lagos State',
      updatedAt: '2 hours ago'
    },
    {
      id: 'draft-003',
      title: 'Notice of Appeal (Court of Appeal)',
      suitNo: 'APPEAL NO: CA/L/410/2026',
      court: 'Court of Appeal, Lagos Division',
      updatedAt: 'Yesterday'
    }
  ];

  const aiConversations = [
    {
      query: 'Draft a Motion on Notice for injunction under Lagos High Court Rules 2019',
      timestamp: 'Today at 09:15 AM',
      tokensUsed: 420
    },
    {
      query: 'What are the exceptions to Foss v. Harbottle under CAMA 2020 S.343?',
      timestamp: '22 July 2026',
      tokensUsed: 280
    }
  ];

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Banner */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-neutral-950 font-black flex items-center justify-center text-2xl shadow-xl shadow-yellow-500/20">
                SCN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black font-serif text-white">Barr. O. J. Ademola, SAN</h1>
                  <span className="bg-yellow-400 text-neutral-950 text-xs font-black px-2.5 py-0.5 rounded uppercase">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Supreme Court Enrollment Bar Number:{' '}
                  <strong className="text-yellow-400 font-mono">{barNumber || 'SCN/084251'}</strong> | Chambers: Ademola & Co. Legal Practitioners
                </p>
              </div>
            </div>

            {/* Plan Badge Card */}
            <div className="bg-neutral-950 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-4">
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Current Subscription</div>
                <div className="text-sm font-black text-yellow-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-yellow-400" />
                  {subscription.toUpperCase()} PLAN
                </div>
                <p className="text-[10px] text-neutral-500">Unlimited AI Legal Research & Drafts</p>
              </div>
              <button
                onClick={() => setActiveTab('pricing')}
                className="bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs px-3 py-2 rounded-lg transition"
              >
                Upgrade
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="mt-8 flex flex-wrap gap-2 border-t border-neutral-800 pt-4">
            {[
              { id: 'overview', label: 'Overview & Recent' },
              { id: 'saved_cases', label: `Saved Cases (${savedCases.length})` },
              { id: 'saved_drafts', label: `Custom Drafts (${savedDrafts.length})` },
              { id: 'ai_chats', label: 'AI Search History' },
              { id: 'team', label: 'Chambers Team Folder' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveSubTab(st.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeSubTab === st.id
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-500/20'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Subtabs Content */}
        {activeSubTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-400 font-semibold">Saved Cases</span>
                  <Bookmark className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-white font-serif">{savedCases.length}</div>
                <p className="text-[11px] text-neutral-500 mt-1">Bookmarked for quick court reference</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-400 font-semibold">Saved Legal Drafts</span>
                  <FileText className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-white font-serif">{savedDrafts.length}</div>
                <p className="text-[11px] text-neutral-500 mt-1">Writs, Motions & Addresses</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-400 font-semibold">AI Legal Queries</span>
                  <Bot className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-white font-serif">48</div>
                <p className="text-[11px] text-neutral-500 mt-1">Research sessions this month</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-400 font-semibold">Downloads</span>
                  <Download className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-white font-serif">18</div>
                <p className="text-[11px] text-neutral-500 mt-1">Word & PDF legal documents</p>
              </div>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Recent Activity */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
                    <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      Recent Case Research & Bookmarks
                    </h2>
                    <button onClick={() => setActiveTab('case-law')} className="text-xs text-yellow-400 font-semibold hover:underline flex items-center gap-1">
                      Browse All Case Law <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {savedCases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => onOpenViewer(c)}
                        className="p-4 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-yellow-500/40 rounded-xl transition cursor-pointer flex justify-between items-center group"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition">{c.title}</h3>
                          <p className="text-xs text-yellow-400/80 font-mono mt-0.5">{c.citation}</p>
                          <span className="text-[10px] text-neutral-500 mt-1 inline-block">Saved on {c.savedAt}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-yellow-400 transition" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Saved Custom Drafts */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
                    <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-yellow-400" />
                      Saved Custom Drafts
                    </h2>
                    <button onClick={() => setActiveTab('drafts')} className="text-xs text-yellow-400 font-semibold hover:underline flex items-center gap-1">
                      Draft Library <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {savedDrafts.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setActiveTab('drafts')}
                        className="p-4 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-yellow-500/40 rounded-xl transition cursor-pointer flex justify-between items-center group"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition">{d.title}</h3>
                          <p className="text-xs text-neutral-400 mt-0.5">{d.court} • <span className="text-yellow-400 font-mono">{d.suitNo}</span></p>
                          <span className="text-[10px] text-neutral-500 mt-1 inline-block">Updated {d.updatedAt}</span>
                        </div>
                        <button className="bg-yellow-400 text-neutral-950 font-bold text-xs px-3 py-1.5 rounded-lg group-hover:bg-yellow-300 transition">
                          Edit Process
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Quick Tools */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-yellow-500/40 rounded-2xl p-6 shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 text-neutral-950 font-bold flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white font-serif">Quick AI Legal Assistant</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Ask any question about Nigerian Law, SC Citations, ACJA 2015, or CAMA 2020.
                  </p>

                  <button
                    onClick={() => setActiveTab('ai-assistant')}
                    className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black py-3 rounded-xl text-xs transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Launch AI Research Engine</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                {/* Notifications & Digest */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white font-serif mb-3 border-b border-neutral-800 pb-2">
                    Weekly Legal Updates
                  </h3>
                  <div className="space-y-3 text-xs text-neutral-300">
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-yellow-400 font-bold text-[10px] uppercase">Supreme Court Judgment</span>
                      <p className="font-semibold text-white mt-0.5">S.84 Evidence Act 2023 Amendment Guidelines</p>
                      <p className="text-neutral-500 text-[11px] mt-1">Certified digital signatures now admissible without oral witness in commercial disputes.</p>
                    </div>

                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="text-yellow-400 font-bold text-[10px] uppercase">High Court Practice Direction</span>
                      <p className="font-semibold text-white mt-0.5">Lagos State High Court Virtual Hearing Rules 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'saved_cases' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold font-serif text-white mb-4">Bookmarked Case Law Judgments</h2>
            <div className="space-y-3">
              {savedCases.map((c) => (
                <div key={c.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                    <p className="text-xs text-yellow-400 font-mono mt-1">{c.citation}</p>
                  </div>
                  <button onClick={() => onOpenViewer(c)} className="bg-yellow-400 text-neutral-950 font-bold text-xs px-4 py-2 rounded-lg">
                    Read Full Judgment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'team' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
            <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-serif text-white">Chambers & Law Firm Team Workspace</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mt-2">
              Collaborate with associates, share draft templates, and pool case research across your law firm.
            </p>
            <button onClick={() => setActiveTab('pricing')} className="mt-6 bg-yellow-400 text-neutral-950 font-bold text-xs px-6 py-3 rounded-xl">
              Upgrade to Chambers Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
