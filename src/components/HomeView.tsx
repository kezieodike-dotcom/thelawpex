import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  FileText,
  Gavel,
  Landmark,
  Newspaper,
  Scale,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';
import { HeroSearch } from './HeroSearch';
import { TestimonialsSection } from './ui/testimonial-v2';
import { LANDMARK_CASES } from '../data/legalData';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onOpenSearch: (query?: string) => void;
  onOpenCase: (caseId: string) => void;
  onOpenViewer: (item: any) => void;
}

const normaliseCaseQuery = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b(versus|vs)\b/g, 'v')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const findDirectCaseMatch = (query: string) => {
  const needle = normaliseCaseQuery(query);
  if (!needle) return undefined;

  const exactMatch = LANDMARK_CASES.find((item) => {
    const title = normaliseCaseQuery(item.title);
    const citation = normaliseCaseQuery(item.citation);
    return needle === normaliseCaseQuery(item.id)
      || needle === title
      || needle === citation
      || needle.includes(`${title} ${citation}`)
      || (needle.includes(title) && needle.length > title.length);
  });
  if (exactMatch) return exactMatch;

  const ignoredTokens = new Set(['v', 'and', 'anor', 'ors', 'the']);
  const queryTokens = new Set(needle.split(' ').filter((token) => !ignoredTokens.has(token)));
  const partyMatches = LANDMARK_CASES.filter((item) => {
    const partyTokens = normaliseCaseQuery(item.title)
      .split(' ')
      .filter((token) => !ignoredTokens.has(token));
    return partyTokens.length >= 2 && partyTokens.every((token) => queryTokens.has(token));
  });

  return partyMatches.length === 1 ? partyMatches[0] : undefined;
};

const MODULES = [
  { id: 'case-law', title: 'Case Laws', desc: 'Structured reports with facts, issues, ratio and principles.', icon: Scale, tone: 'sky' },
  { id: 'areas-of-law', title: 'Forms and Precedents', desc: 'Search practice areas and open drafting forms, samples and precedents.', icon: BookOpen, tone: 'light' },
  { id: 'court-rules', title: 'Court Rules', desc: 'Magistrate, High Court, NICN, Federal High Court, CA and Supreme Court rules.', icon: Gavel, tone: 'light' },
  { id: 'laws', title: 'Nigerian Laws & Statutes', desc: 'Federal laws and the laws of the 36 states and the FCT.', icon: Landmark, tone: 'light' },
  { id: 'appeals', title: 'Appeals', desc: 'Rights of appeal, leave, timelines and appeal drafts across the court ladder.', icon: Newspaper, tone: 'light' },
  { id: 'drafts', title: 'Draft Library', desc: 'Court processes and agreements prepared for editing.', icon: FileText, tone: 'yellow' },
  { id: 'affidavits', title: 'All Manner of Affidavits', desc: 'Sworn depositions with statutory basis and practice warnings.', icon: ShieldCheck, tone: 'light' },
  { id: 'practicals', title: 'Different Courtroom Procedures', desc: 'Courtroom steps and what counsel says in court.', icon: Video, tone: 'light' },
  { id: 'learn-litigation-ai', title: 'Learn Litigation with AI Tools', desc: 'Prompt-led lessons for research, drafting and advocacy.', icon: Sparkles, tone: 'light' },
  { id: 'articles', title: 'Legal Articles', desc: 'Practice notes and commentary for Nigerian practitioners.', icon: Newspaper, tone: 'light' },
];

const FAQS = [
  {
    q: 'What is LAWPEX?',
    a: 'LAWPEX is an AI-powered Nigerian litigation workspace for legal research, statutes, court rules, court processes, affidavits, case laws and legal education.',
  },
  {
    q: 'Is the AI output final legal advice?',
    a: 'No. It is drafting and research assistance. Counsel should verify every authority, rule, date, filing requirement and court-specific practice point before use.',
  },
  {
    q: 'Which jurisdictions does it cover?',
    a: 'The product is organised around Nigerian federal law, appellate courts, federal specialist courts, the 36 states and the Federal Capital Territory.',
  },
  {
    q: 'Can I export materials?',
    a: 'Yes. Many resources include copy-to-Word and .doc download actions so drafts, principles and rules can move directly into working documents.',
  },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#181411]/10 py-5 last:border-b-0">
      <button
        onClick={() => setOpen((value) => !value)}
        className="lawpex-focus-ring flex w-full items-center justify-between gap-4 rounded-lg text-left"
      >
        <span className="text-sm font-black text-[#181411]">{q}</span>
        <ChevronDown className={`h-4 w-4 text-[#8a5f05] ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">{a}</p>}
    </div>
  );
};

const moduleClass = (tone: string, index: number) => {
  const base = 'lawpex-module-tile group relative flex flex-col overflow-hidden rounded-lg border p-5 text-left sm:p-6';
  const layout = index === 0
    ? 'md:col-span-2 md:row-span-2'
    : index === MODULES.length - 1
      ? 'md:col-span-4 md:min-h-[160px]'
      : '';
  if (tone === 'yellow') return `${base} ${layout} border-[#181411]/20 bg-[#f7c915] text-[#181411]`;
  if (tone === 'sky') return `${base} ${layout} border-sky-200 bg-[#dff5ff] text-[#181411]`;
  return `${base} ${layout} border-[#181411]/12 bg-white text-[#181411]`;
};

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenSearch, onOpenCase, onOpenViewer }) => {
  const latestCases = [...LANDMARK_CASES].sort((a, b) => b.year - a.year).slice(0, 5);
  const primaryCase = latestCases[0];
  const secondaryCases = latestCases.slice(1);

  return (
    <div className="lawpex-home overflow-hidden bg-[#fffdf6]">
      <HeroSearch
        onSearch={(query) => {
          const directCase = query ? findDirectCaseMatch(query) : undefined;
          if (directCase) {
            onOpenCase(directCase.id);
            return;
          }
          onOpenSearch(query);
        }}
      />

      <section className="border-b border-[#181411]/10 bg-[#f7c915] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase text-[#5f4a08]">The LAWPEX workspace</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-[#181411] sm:text-4xl">
                One legal issue. Every tool you need to move it forward.
              </h2>
            </div>
            <button
              onClick={() => onOpenSearch()}
              className="lawpex-focus-ring inline-flex h-[52px] w-fit items-center gap-3 rounded-md bg-[#181411] px-5 text-sm font-bold text-white hover:bg-[#332b23]"
            >
              Open Universal Legal Search
              <ArrowRight className="h-4 w-4 text-[#f7c915]" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-4">
          {MODULES.map((item, index) => {
            const Icon = item.icon;
            const accentColor = item.tone === 'sky' ? 'text-sky-800' : 'text-[#181411]';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                data-lawpex-reveal="module-card"
                className={moduleClass(item.tone, index)}
              >
                <div className="absolute right-4 top-4 text-4xl font-bold leading-none opacity-[0.08]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-md border border-[#181411]/10 bg-white/82 ${accentColor}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <h3 className={`${index === 0 ? 'mt-auto pt-12 text-2xl sm:text-3xl' : 'mt-5 text-lg'} font-bold leading-tight`}>{item.title}</h3>
                <p className={`${index === 0 ? 'text-sm sm:text-base' : 'text-sm'} mt-2 max-w-md leading-6 text-neutral-700`}>
                  {item.desc}
                </p>
              </button>
            );
          })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#181411]/10 bg-[#eaf7fc] py-16 text-[#181411] lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase text-sky-800">
              Latest structured report
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Latest Case Laws</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-neutral-700">
              Open a judgment for principles of law, ratio decidendi and full text, then carry the
              relevant note directly into drafting.
            </p>

            {primaryCase && (
              <button
                onClick={() => onOpenViewer(primaryCase)}
                data-lawpex-reveal="module-card"
                className="lawpex-focus-ring mt-8 w-full rounded-lg border border-[#181411]/15 bg-[#f7c915] p-5 text-left text-[#181411] hover:-translate-y-1 hover:bg-[#ffda35]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6e4b04]">
                      {primaryCase.court} / {primaryCase.year}
                    </p>
                    <h3 className="mt-2 text-xl font-bold leading-snug">{primaryCase.title}</h3>
                    <p className="mt-2 text-xs font-bold text-[#5d4308]">{primaryCase.citation}</p>
                  </div>
                  <BadgeCheck className="h-5 w-5 shrink-0" />
                </div>
              </button>
            )}
          </div>

          <div className="border-t border-[#181411]/15">
            {secondaryCases.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onOpenViewer(item)}
                data-lawpex-reveal="module-card"
                className="group block w-full border-b border-[#181411]/15 bg-white/35 px-1 py-5 text-left hover:bg-white/75 sm:px-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700">
                      {String(index + 2).padStart(2, '0')} / {item.court} / {item.year}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-[#181411] group-hover:text-sky-900">{item.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-neutral-600">{item.citation}</p>
                  </div>
                  {item.isLandmark && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-md bg-[#f7c915] px-2 py-1 text-[10px] font-bold uppercase text-[#181411]">
                      <BadgeCheck className="h-3 w-3" />
                      Landmark
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="border-t border-[#181411]/10 bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-12">
        <div>
          <p className="text-xs font-bold uppercase text-[#8a5f05]">Answers</p>
          <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight text-[#181411]">
            Questions counsel usually ask first.
          </h2>
        </div>
        <div className="border-t border-[#181411]/15">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
        </div>
      </section>
    </div>
  );
};
