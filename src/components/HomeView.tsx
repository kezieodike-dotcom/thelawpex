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
  onOpenViewer: (item: any) => void;
}

const MODULES = [
  { id: 'areas-of-law', title: 'Areas of Law', desc: 'Search practice areas and open the full workflow for each subject.', icon: BookOpen, tone: 'light' },
  { id: 'court-rules', title: 'Court Rules', desc: 'Magistrate, High Court, NICN, Federal High Court, CA and Supreme Court rules.', icon: Gavel, tone: 'light' },
  { id: 'case-law', title: 'Case Law', desc: 'Structured reports with facts, issues, ratio and principles.', icon: Scale, tone: 'sky' },
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
    a: 'LAWPEX is an AI-powered Nigerian litigation workspace for legal research, statutes, court rules, court processes, affidavits, case law and legal education.',
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

const moduleClass = (tone: string, isWide: boolean) => {
  const base =
    'group relative overflow-hidden rounded-[1.4rem] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_24px_70px_-52px_rgba(24,20,17,0.55)] hover:-translate-y-1';
  const span = isWide ? 'sm:col-span-2' : '';
  if (tone === 'yellow') {
    return `${base} ${span} border border-[#d9a21d]/40 bg-[#facc15] text-[#181411]`;
  }
  if (tone === 'sky') {
    return `${base} ${span} border border-sky-200 bg-sky-50 text-[#181411] hover:border-sky-300 hover:bg-white`;
  }
  return `${base} ${span} border border-amber-200/80 bg-white/82 text-[#181411] hover:border-amber-400 hover:bg-white`;
};

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenSearch, onOpenViewer }) => {
  const latestCases = [...LANDMARK_CASES].sort((a, b) => b.year - a.year).slice(0, 5);
  const primaryCase = latestCases[0];
  const secondaryCases = latestCases.slice(1);

  return (
    <div className="overflow-hidden">
      <HeroSearch onSearch={(query) => onOpenSearch(query)} />

      <section className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:px-8 lg:py-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="lawpex-kicker">Platform map</p>
          <h2 className="mt-3 max-w-md text-3xl font-black leading-tight tracking-tight text-[#181411] sm:text-4xl">
            A brighter way to move through Nigerian legal work.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-neutral-700">
            Start from an issue, confirm the governing law, test it against authorities, then move
            into drafting and appearance preparation without losing context.
          </p>
          <button
            onClick={() => onOpenSearch()}
            className="lawpex-focus-ring mt-7 inline-flex items-center gap-2 rounded-full bg-[#181411] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-amber-200 hover:bg-[#2a2118]"
          >
            Open universal search
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MODULES.map((item, index) => {
            const Icon = item.icon;
            const isWide = index === 0 || index === 1 || index === 9;
            const accentColor = item.tone === 'sky' ? 'text-sky-700' : 'text-[#8a5f05]';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={moduleClass(item.tone, isWide)}
              >
                <div className="absolute right-4 top-4 text-5xl font-black leading-none opacity-[0.045]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white/72 ring-1 ring-black/5 ${accentColor}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <h3 className="mt-5 text-lg font-black tracking-tight">{item.title}</h3>
                <p className="mt-2 max-w-md text-xs leading-6 text-neutral-700">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f8fcff] py-16 text-[#181411] lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-[1.75rem] border border-sky-200 bg-white p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_70px_-54px_rgba(14,116,144,0.38)]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-700">
              Latest structured report
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Latest Case Laws</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-700">
              Open a judgment for principles of law, ratio decidendi and full text, then carry the
              relevant note directly into drafting.
            </p>

            {primaryCase && (
              <button
                onClick={() => onOpenViewer(primaryCase)}
                className="lawpex-focus-ring mt-8 w-full rounded-[1.4rem] border border-amber-300 bg-[#facc15] p-5 text-left text-[#181411] hover:-translate-y-1 hover:bg-[#fde047]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6e4b04]">
                      {primaryCase.court} / {primaryCase.year}
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight">{primaryCase.title}</h3>
                    <p className="mt-2 text-xs font-bold text-[#5d4308]">{primaryCase.citation}</p>
                  </div>
                  <BadgeCheck className="h-5 w-5 shrink-0" />
                </div>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {secondaryCases.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onOpenViewer(item)}
                className="group rounded-[1.2rem] border border-sky-200 bg-white p-4 text-left shadow-[0_18px_55px_-48px_rgba(14,116,144,0.42)] hover:-translate-y-0.5 hover:border-amber-300 hover:bg-yellow-50"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700">
                      {String(index + 2).padStart(2, '0')} / {item.court} / {item.year}
                    </p>
                    <h3 className="mt-1 text-sm font-black text-[#181411] group-hover:text-amber-800">{item.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-neutral-500">{item.citation}</p>
                  </div>
                  {item.isLandmark && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-300 px-2 py-1 text-[10px] font-black uppercase text-[#181411]">
                      <BadgeCheck className="h-3 w-3" />
                      Landmark
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:px-8">
        <div>
          <p className="lawpex-kicker">Answers</p>
          <h2 className="mt-3 max-w-md text-3xl font-black tracking-tight text-[#181411]">
            Questions counsel usually ask first.
          </h2>
        </div>
        <div className="rounded-[1.7rem] border border-amber-200/80 bg-white/82 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_70px_-56px_rgba(24,20,17,0.55)] sm:p-7">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
};
