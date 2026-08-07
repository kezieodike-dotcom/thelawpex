import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bot,
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
import { LANDMARK_CASES } from '../data/legalData';
import { PLATFORM_STATS } from '../data/platform';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenViewer: (item: any) => void;
}

const MODULES = [
  { id: 'areas-of-law', title: 'Areas of Law', desc: 'Practice areas with drafts, principles, laws and checklists.', icon: BookOpen },
  { id: 'case-law', title: 'Case Law', desc: 'Judgments structured by facts, issues, ratio and principles.', icon: Scale },
  { id: 'court-rules', title: 'Court Rules', desc: 'Orders and rules across federal, appellate and state courts.', icon: Gavel },
  { id: 'drafts', title: 'Draft Library', desc: 'Court processes and agreements prepared for editing.', icon: FileText },
  { id: 'affidavits', title: 'Affidavits', desc: 'Sworn depositions with statutory basis and practice warnings.', icon: ShieldCheck },
  { id: 'practicals', title: 'Courtroom Procedures', desc: 'Step-by-step proceedings and what counsel says in court.', icon: Video },
  { id: 'appeals', title: 'Appeals Centre', desc: 'Notices, records, briefs, timelines and leave applications.', icon: Landmark },
  { id: 'learn-litigation-ai', title: 'AI Litigation Training', desc: 'Prompt-led lessons for research, drafting and advocacy.', icon: Sparkles },
  { id: 'articles', title: 'Legal Articles', desc: 'Practice notes and commentary for Nigerian practitioners.', icon: Newspaper },
  { id: 'ai-assistant', title: 'AI Legal Assistant', desc: 'Ask, draft and summarise with Nigerian-law context.', icon: Bot },
];

const TESTIMONIALS = [
  {
    quote:
      'The best part is not speed alone. LAWPEX gives juniors the structure of a proper written address before they start typing.',
    name: 'Chinonso Okafor',
    title: 'Legal Practitioner, Lagos',
  },
  {
    quote:
      'Facts, issues and ratio are separated cleanly. It reduces the noise when a court is checking an authority under pressure.',
    name: 'Hon. Justice A. B. Mustapha',
    title: 'High Court Judge',
  },
  {
    quote:
      'Our chambers uses it as a drafting checkpoint. The Word export alone saves time across motions, affidavits and notices.',
    name: 'Amaka Eze',
    title: 'Managing Partner, Eze & Associates',
  },
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
    <div className="border-b border-amber-200/80 py-4">
      <button
        onClick={() => setOpen((value) => !value)}
        className="lawpex-focus-ring flex w-full items-center justify-between gap-4 rounded-lg text-left"
      >
        <span className="text-sm font-black text-neutral-950">{q}</span>
        <ChevronDown className={`h-4 w-4 text-amber-700 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">{a}</p>}
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenSearch, onOpenViewer }) => {
  const latestCases = [...LANDMARK_CASES].sort((a, b) => b.year - a.year).slice(0, 5);

  return (
    <div>
      <HeroSearch onSearch={() => onOpenSearch()} setActiveTab={setActiveTab} />

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="lawpex-kicker">Platform map</p>
          <h2 className="mt-3 max-w-md text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
            Built around how litigation work actually moves.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-neutral-700">
            Start with the legal issue, open the governing law, test it against authorities, then
            move into drafting and courtroom preparation without changing tools.
          </p>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="lawpex-focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-[#181411] px-5 py-3 text-sm font-black text-white hover:bg-[#2a2118]"
          >
            Try AI assistant
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MODULES.map((item, index) => {
            const Icon = item.icon;
            const isWide = index === 0 || index === 3 || index === 9;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group lawpex-card rounded-2xl p-5 text-left hover:-translate-y-0.5 hover:border-amber-400 hover:bg-white ${
                  isWide ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 ring-1 ring-amber-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-neutral-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 text-base font-black text-neutral-950">{item.title}</h3>
                <p className="mt-1 text-xs leading-6 text-neutral-600">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-y border-amber-200/80 bg-white/70 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="lawpex-kicker">Live statistics band</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
                Platform depth at a glance
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-neutral-600">
              Counters mirror the PRD credibility layer: legal depth, practical utility, active
              users and commercial traction.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className="lawpex-card rounded-2xl p-4">
                <div className="text-2xl font-black tracking-tight text-neutral-950">{stat.value}</div>
                <div className="mt-1 text-xs font-black text-neutral-800">{stat.label}</div>
                <div className="mt-1 text-[11px] leading-5 text-neutral-500">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-amber-200/80 bg-[#181411] py-14 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-300">Freshly structured</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Latest Case Laws</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/68">
              Open a judgment for principles of law, ratio decidendi and full text, then copy the
              relevant note directly into Word.
            </p>
            <button
              onClick={() => setActiveTab('case-law')}
              className="lawpex-focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-black text-[#181411] hover:bg-amber-200"
            >
              View all cases
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {latestCases.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onOpenViewer(item)}
                className="group rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left hover:border-amber-300/70 hover:bg-white/[0.09]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-300">
                      {String(index + 1).padStart(2, '0')} / {item.court} / {item.year}
                    </p>
                    <h3 className="mt-1 text-sm font-black text-white group-hover:text-amber-200">{item.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-white/55">{item.citation}</p>
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

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure key={item.name} className="lawpex-card rounded-2xl p-6">
              <blockquote className="text-sm leading-7 text-neutral-800">"{item.quote}"</blockquote>
              <figcaption className="mt-5 border-t border-amber-100 pt-4">
                <div className="font-black text-neutral-950">{item.name}</div>
                <div className="mt-1 text-xs font-semibold text-amber-800">{item.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="lawpex-panel rounded-3xl p-6 sm:p-8">
          <p className="lawpex-kicker">Answers</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">Frequently asked questions</h2>
          <div className="mt-4">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
