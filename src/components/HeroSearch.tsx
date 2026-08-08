import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bot,
  FileText,
  Gavel,
  Landmark,
  Search,
  ShieldCheck,
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
  { label: 'Practice areas', value: '20+' },
  { label: 'Draft families', value: '430+' },
  { label: 'Jurisdictions', value: '37' },
];

const LIBRARY_SHORTCUTS = [
  { id: 'case-law', title: 'Case Law', detail: 'Ratio, facts and principles', icon: Landmark },
  { id: 'court-rules', title: 'Court Rules', detail: 'Orders, rules and process areas', icon: Gavel },
  { id: 'drafts', title: 'Drafts', detail: 'Court-ready templates', icon: FileText },
  { id: 'ai-assistant', title: 'AI Research', detail: 'Ask, draft and summarise', icon: Bot },
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
    <section className="lawpex-hero-shell relative isolate overflow-hidden border-b border-amber-200/80 bg-[#f8f5ee] text-[#181411]">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="/legal-tech.jpg"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="absolute right-0 top-0 h-full w-full object-cover object-[68%_50%] opacity-[0.32]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fbf8f1_0%,rgba(251,248,241,0.96)_43%,rgba(251,248,241,0.74)_72%,rgba(251,248,241,0.52)_100%)]" />
        <div className="absolute left-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_20%_20%,rgba(217,162,29,0.22),transparent_24rem)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f8f5ee] to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-white/78 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-800 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Nigerian litigation intelligence
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-[#181411] sm:text-5xl lg:text-6xl">
            Research, draft and argue Nigerian law from one precise workspace.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-700 sm:text-lg">
            LAWPEX brings case law, court rules, statutes, affidavits, draft processes and AI
            litigation support into a focused workspace for counsel, chambers and the Bench.
          </p>

          <form
            onSubmit={submitSearch}
            className="lawpex-command mt-8 overflow-hidden rounded-[1.35rem] p-2"
          >
            <div className="flex flex-wrap gap-1 border-b border-amber-100 pb-2">
              {SEARCH_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`lawpex-focus-ring rounded-lg px-3 py-1.5 text-xs font-bold ${
                    activeCategory === tab.id
                      ? 'bg-[#e6ad22] text-[#181411]'
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
                  className="lawpex-focus-ring w-full rounded-xl border border-transparent bg-amber-50/70 py-4 pl-12 pr-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:border-amber-300 focus:bg-white focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="lawpex-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#181411] px-5 py-4 text-sm font-black text-white hover:bg-[#2a2118]"
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
                className="lawpex-focus-ring rounded-full border border-amber-200 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-neutral-700 hover:border-amber-400 hover:text-neutral-950"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-amber-200/80 border-y border-amber-200/80 bg-white/38 py-4 backdrop-blur">
            {METRICS.map((metric) => (
              <div key={metric.label} className="px-4 first:pl-0">
                <div className="text-2xl font-black tracking-tight text-[#181411]">{metric.value}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:pt-8">
          <div className="lawpex-panel rounded-[1.75rem] p-4 sm:p-5">
            <div className="lawpex-dark-panel rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
                    Active research file
                  </p>
                  <h2 className="mt-2 text-xl font-black tracking-tight">Injunction Strategy</h2>
                </div>
                <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#181411]">
                  Live
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  ['Authority', 'Madukolu jurisdiction test checked'],
                  ['Rule', 'Order 39 motion requirements mapped'],
                  ['Draft', 'Affidavit facts aligned to prayers'],
                ].map(([label, text]) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.07] p-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">{label}</p>
                      <p className="mt-0.5 text-xs leading-5 text-white/82">{text}</p>
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
                    className="group rounded-2xl border border-amber-200/80 bg-white/84 p-4 text-left hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-50"
                  >
                    <Icon className="h-5 w-5 text-amber-700 transition-transform group-hover:-translate-y-0.5" />
                    <h3 className="mt-3 text-sm font-black text-neutral-950">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-neutral-600">{item.detail}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <p className="text-xs leading-5 text-neutral-700">
                Designed for Nigerian procedure: court headings, party labels, filing sequence,
                cited authorities and Word-ready export are built into the workflow.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
