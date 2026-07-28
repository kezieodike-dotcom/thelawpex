import React, { useState } from 'react';
import {
  Search,
  Bot,
  Scale,
  BookOpen,
  FileText,
  Gavel,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Video,
  Award,
  Users
} from 'lucide-react';

interface HeroSearchProps {
  onSearch: (query: string, category: string) => void;
  setActiveTab: (tab: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, activeCategory);
    }
  };

  const quickPrompts = [
    { label: 'Salu v. Egeibon (Locus Standi)', cat: 'cases' },
    { label: 'Section 84 Evidence Act (Electronic Certificate)', cat: 'statutes' },
    { label: 'Motion on Notice for Interlocutory Injunction', cat: 'drafts' },
    { label: 'CAMA 2020 S.18 Single Shareholder Company', cat: 'statutes' },
    { label: 'Order 25 Rule 1 Federal High Court Rules', cat: 'rules' },
    { label: 'Notice of Appeal on Jurisdiction', cat: 'appeals' }
  ];

  return (
    <div className="relative bg-neutral-950 border-b border-yellow-500/20 overflow-hidden text-white pt-12 pb-16">
      {/* Background Yellow Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tagline */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-yellow-500/30 text-xs text-yellow-400 font-semibold shadow-inner">
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span>Powering Nigerian Advocates, Judges & Law Firms with Generative AI</span>
            <span className="hidden sm:inline bg-yellow-400 text-neutral-950 text-[10px] px-2 py-0.5 rounded font-black uppercase">
              V1.0 LIVE
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-[1.15]">
            Every Legal Resource in Nigeria. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
              One Intelligent AI Platform.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Search 15,000+ Supreme Court & Court of Appeal Judgments, Rules of Court for all 36 States + FCT, LFN Statutes, Draft Templates, and AI Litigation Guidance in seconds.
          </p>
        </div>

        {/* Search Engine Container */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-neutral-900/90 border-2 border-yellow-500/40 rounded-2xl shadow-2xl p-3 sm:p-4 backdrop-blur-xl">
            {/* Search Tabs */}
            <div className="flex flex-wrap gap-1 mb-3 border-b border-neutral-800 pb-2">
              {[
                { id: 'all', label: 'All Resources' },
                { id: 'cases', label: 'Case Law' },
                { id: 'statutes', label: 'Statutes & LFN' },
                { id: 'rules', label: 'Court Rules' },
                { id: 'drafts', label: 'Draft Templates' },
                { id: 'appeals', label: 'Appeals' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeCategory === tab.id
                      ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search legal issue, citation e.g. 'Salu v Egeibon', 'Section 84 Evidence Act', 'Motion for Injunction'..."
                  className="w-full bg-neutral-950 text-white placeholder-neutral-500 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold px-6 py-3.5 rounded-xl text-sm transition shadow-lg shadow-yellow-500/20 flex items-center gap-2 whitespace-nowrap"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Prompts */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
              <span className="font-semibold text-yellow-400 text-[11px] uppercase tracking-wider">Popular:</span>
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchQuery(p.label);
                    onSearch(p.label, p.cat);
                  }}
                  className="bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-yellow-400 px-2.5 py-1 rounded-md text-[11px] border border-neutral-800 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="bg-neutral-900/80 hover:bg-neutral-900 border border-yellow-500/30 hover:border-yellow-400 p-4 rounded-xl text-left transition group shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-white text-sm font-bold flex items-center gap-1.5">
              AI Litigation Assistant
            </h3>
            <p className="text-neutral-400 text-xs mt-1">Draft motions, extract ratios, compare judgments in real-time.</p>
          </button>

          <button
            onClick={() => setActiveTab('case-law')}
            className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-yellow-400 p-4 rounded-xl text-left transition group shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-white text-sm font-bold">Case Law Library</h3>
            <p className="text-neutral-400 text-xs mt-1">Supreme Court & CA judgments with Ratio Decidendi breakdowns.</p>
          </button>

          <button
            onClick={() => setActiveTab('court-rules')}
            className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-yellow-400 p-4 rounded-xl text-left transition group shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Gavel className="w-5 h-5" />
            </div>
            <h3 className="text-white text-sm font-bold">Court Rules Library</h3>
            <p className="text-neutral-400 text-xs mt-1">FHC, NICN, High Courts of 36 States & FCT searchable by Order/Rule.</p>
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-yellow-400 p-4 rounded-xl text-left transition group shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-white text-sm font-bold">Legal Draft Templates</h3>
            <p className="text-neutral-400 text-xs mt-1">Thousands of editable court processes, writs, and agreements.</p>
          </button>
        </div>

        {/* Statistics Ticker */}
        <div className="border-t border-b border-neutral-800 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-yellow-400 font-serif">15,000+</div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Case Laws</div>
          </div>
          <div>
            <div className="text-2xl font-black text-yellow-400 font-serif">500+</div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Court Rules</div>
          </div>
          <div>
            <div className="text-2xl font-black text-yellow-400 font-serif">320+</div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">LFN Statutes</div>
          </div>
          <div>
            <div className="text-2xl font-black text-yellow-400 font-serif">1,200+</div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Draft Templates</div>
          </div>
          <div>
            <div className="text-2xl font-black text-yellow-400 font-serif">45,000+</div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Active Lawyers</div>
          </div>
          <div>
            <div className="text-2xl font-black text-yellow-400 font-serif">99.9%</div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
