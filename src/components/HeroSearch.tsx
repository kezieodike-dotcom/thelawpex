import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  Gavel,
  Landmark,
  Search,
  Scale,
  Sparkles,
} from 'lucide-react';

interface HeroSearchProps {
  onSearch: (query?: string, category?: string) => void;
  setActiveTab: (tab: string) => void;
}

const SEARCH_TABS = [
  { id: 'all', label: 'All' },
  { id: 'cases', label: 'Cases' },
  { id: 'statutes', label: 'Statutes' },
  { id: 'rules', label: 'Rules' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'appeals', label: 'Appeals' },
];

const QUICK_PROMPTS = [
  { label: 'Salu v. Egeibon on locus standi', cat: 'cases' },
  { label: 'Section 84 Evidence Act certificate', cat: 'statutes' },
  { label: 'Interlocutory injunction motion', cat: 'drafts' },
  { label: 'Court of Appeal notice on jurisdiction', cat: 'appeals' },
];

const METRICS = [
  { label: 'Authority format', value: 'LDLR' },
  { label: 'Practice areas', value: '20+' },
  { label: 'Jurisdictions', value: '37' },
];

const LIBRARY_SHORTCUTS = [
  { id: 'case-law', title: 'Reports', detail: 'Ratio, facts and principles', icon: Landmark },
  { id: 'court-rules', title: 'Rules', detail: 'Orders and practice directions', icon: Gavel },
  { id: 'drafts', title: 'Drafts', detail: 'Court-ready templates', icon: FileText },
  { id: 'ai-assistant', title: 'AI Desk', detail: 'Ask, draft and summarise', icon: Bot },
];

const RESEARCH_FILE = [
  ['Authority', 'Madukolu jurisdiction test checked'],
  ['Rule', 'Order 39 motion requirements mapped'],
  ['Draft', 'Affidavit facts aligned to prayers'],
];

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) onSearch(searchQuery.trim(), activeCategory);
    else onSearch();
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-amber-200 bg-[#fffdf6] text-[#181411]">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="/hero-justice.jpg"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="absolute bottom-0 right-0 h-full w-full scale-[1.04] object-cover object-[58%_40%] opacity-[0.42] sm:object-[62%_45%] lg:object-[74%_50%] lg:opacity-[0.64]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,246,0.88)_0%,rgba(255,253,246,0.74)_48%,rgba(255,253,246,0.96)_100%)] lg:bg-[linear-gradient(90deg,#fffdf6_0%,rgba(255,253,246,0.98)_38%,rgba(255,253,246,0.68)_66%,rgba(255,253,246,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(250,204,21,0.46),transparent_24rem),radial-gradient(circle_at_88%_16%,rgba(125,211,252,0.2),transparent_24rem),radial-gradient(circle_at_42%_88%,rgba(253,224,71,0.26),transparent_22rem)]" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/82 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-800 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Nigerian litigation intelligence
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.96] tracking-tight text-[#181411] sm:text-5xl lg:text-6xl">
            Research Nigerian law, prepare stronger arguments, and draft with confidence.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-700 sm:text-lg">
            LAWPEX brings case law, court rules, statutes, affidavits, draft processes and AI
            litigation support into one clear workspace for counsel, chambers and the Bench.
          </p>

          <form
            onSubmit={submitSearch}
            className="mt-8 overflow-hidden rounded-[1.55rem] border border-amber-200 bg-white/90 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_34px_90px_-58px_rgba(180,126,18,0.68)] backdrop-blur-2xl"
          >
            <div className="flex flex-wrap gap-1 border-b border-amber-100 pb-2">
              {SEARCH_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`lawpex-focus-ring rounded-lg px-3 py-1.5 text-xs font-bold ${
                    activeCategory === tab.id
                      ? 'bg-[#facc15] text-[#181411]'
                      : 'text-neutral-600 hover:bg-amber-50 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Search LAWPEX</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-700" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search a citation, statute, rule, draft or legal issue..."
                  className="lawpex-focus-ring w-full rounded-xl border border-amber-100 bg-amber-50/55 py-4 pl-12 pr-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:border-amber-300 focus:bg-white focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="lawpex-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#181411] px-5 py-4 text-sm font-black text-yellow-200 hover:bg-[#2a2118]"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => {
                  setSearchQuery(prompt.label);
                  setActiveCategory(prompt.cat);
                }}
                className="lawpex-focus-ring rounded-full border border-amber-200 bg-white/72 px-3 py-1.5 text-[11px] font-semibold text-neutral-700 hover:border-amber-400 hover:bg-yellow-50 hover:text-neutral-950"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-amber-200 border-y border-amber-200 bg-white/58 py-4 backdrop-blur">
            {METRICS.map((metric) => (
              <div key={metric.label} className="px-4 first:pl-0">
                <div className="text-2xl font-black tracking-tight text-[#181411]">{metric.value}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-800">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:pt-8">
          <div className="rounded-[1.75rem] border border-amber-200 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_34px_90px_-58px_rgba(180,126,18,0.58)] backdrop-blur-2xl sm:p-5">
            <div className="rounded-2xl border border-amber-300 bg-[#facc15] p-5 text-[#181411] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#6e4b04]">
                    Active research file
                  </p>
                  <h2 className="mt-2 text-xl font-black tracking-tight">Injunction Strategy</h2>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#181411]">
                  Live
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {RESEARCH_FILE.map(([label, text]) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl border border-[#181411]/10 bg-white/58 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#181411]" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6e4b04]">{label}</p>
                      <p className="mt-0.5 text-xs leading-5 text-[#2b241c]">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {LIBRARY_SHORTCUTS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="group rounded-2xl border border-amber-200 bg-white/82 p-4 text-left hover:-translate-y-0.5 hover:border-amber-400 hover:bg-yellow-50"
                  >
                    <Icon className="h-5 w-5 text-amber-700 transition-transform group-hover:-translate-y-0.5" />
                    <h3 className="mt-3 text-sm font-black text-[#181411]">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-neutral-600">{item.detail}</p>
                  </button>
                );
              })}
            </div>

          </div>
        </aside>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pb-8 text-[11px] font-black uppercase tracking-[0.16em] text-amber-800 sm:px-6 lg:px-8">
        <Scale className="h-4 w-4" />
        Research to rule to draft to court appearance
      </div>
    </section>
  );
};
