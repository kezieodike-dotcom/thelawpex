import React, { useState } from 'react';
import {
  Scale,
  ArrowRight,
  Quote,
  Star,
  ChevronDown,
  Bot,
  Gavel,
  FileText,
  BookOpen,
  Landmark,
  Video,
  Newspaper,
  Sparkles,
} from 'lucide-react';
import { HeroSearch } from './HeroSearch';
import { LANDMARK_CASES } from '../data/legalData';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenViewer: (item: any) => void;
}

const FEATURED_SECTIONS = [
  { id: 'areas-of-law', title: 'Areas of Law', desc: '20 practice areas with drafts, statutes, rules, principles & checklists.', icon: BookOpen },
  { id: 'case-law', title: 'Latest Case Laws', desc: 'Structured Supreme Court & Court of Appeal judgments with ratio.', icon: Scale },
  { id: 'ai-assistant', title: 'AI Legal Assistant', desc: 'Drafting, summarisation and authority discovery grounded in Nigerian law.', icon: Bot },
  { id: 'court-rules', title: 'Court Rules', desc: 'Rules of every Nigerian court, searchable by Order and Rule.', icon: Gavel },
  { id: 'drafts', title: 'Legal Drafts', desc: 'Thousands of editable, AI-customisable court processes.', icon: FileText },
  { id: 'practicals', title: 'Courtroom Practicals', desc: 'Video demonstrations of advocacy with downloadable notes.', icon: Video },
  { id: 'appeals', title: 'Appeals Library', desc: 'End-to-end appellate guidance, drafts, timelines and flowcharts.', icon: Landmark },
  { id: 'articles', title: 'Legal Articles', desc: 'Categorised, searchable commentary and practice notes.', icon: Newspaper },
];

const TESTIMONIALS = [
  {
    quote:
      'LAWPEX has cut my research time before filing deadlines from hours to minutes. Pulling the ratio in Amaechi v. INEC and a matching motion draft in the same workspace is a game changer.',
    name: 'Chinonso Okafor',
    title: 'Legal Practitioner, Lagos',
  },
  {
    quote:
      'The structured case records — facts, issues, ratio, obiter — are exactly how a judge wants authorities presented. Verifying counsel’s citations from the Bench is now effortless.',
    name: 'Hon. Justice A. B. Mustapha',
    title: 'High Court Judge (Judiciary tier)',
  },
  {
    quote:
      'Our chambers standardised drafting on LAWPEX. Shared folders and AI-customised templates mean our juniors produce court-ready processes on the first pass.',
    name: 'Amaka Eze, Managing Partner',
    title: 'Eze & Associates',
  },
];

const FAQS = [
  {
    q: 'What is LAWPEX?',
    a: 'LAWPEX is an AI-powered legal research, litigation, courtroom-practice and legal-education platform built specifically for Nigerian legal practitioners. It combines case law, statutes, court rules, drafting templates, appeals resources, courtroom training and an AI Litigation Assistant in a single subscription platform.',
  },
  {
    q: 'How accurate is the AI Litigation Assistant?',
    a: 'The assistant is grounded in Nigerian legal materials via retrieval-augmented generation and every substantive response carries verifiable citations. Where Nigerian authority is absent it flags this rather than fabricating. All AI output is marked as drafting assistance, not legal advice.',
  },
  {
    q: 'Do I need a Nigerian Bar Association number to register?',
    a: 'No. Registration is open with role selection. NBA number verification is optional and unlocks a verified-counsel badge, while judges and magistrates can apply for verified access on the Judiciary tier.',
  },
  {
    q: 'What subscription plans are available?',
    a: 'Free (limited searches, limited AI, selected articles), Professional (unlimited access, billed monthly/quarterly/yearly), Chambers (multi-seat with shared folders and collaboration) and Judiciary (dedicated verified access for judges, magistrates and judicial researchers).',
  },
  {
    q: 'Which courts and jurisdictions are covered?',
    a: 'Court rules for the Supreme Court, Court of Appeal, Federal High Court, National Industrial Court, the High Courts of all 36 States and the FCT, plus Magistrate, Customary and Sharia courts. Statutes span federal, all 36 states and the FCT.',
  },
  {
    q: 'Can I export drafts and judgments?',
    a: 'Yes. Drafts export to editable Word (.docx) and PDF, and any section of a judgment can be copied to Word or downloaded as a formatted, citable PDF. Every export is logged in your download history.',
  },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-neutral-900/60 transition"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-yellow-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800 pt-3">
          {a}
        </div>
      )}
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenSearch, onOpenViewer }) => {
  const latestCases = [...LANDMARK_CASES].sort((a, b) => b.year - a.year).slice(0, 6);

  return (
    <div>
      <HeroSearch
        onSearch={() => onOpenSearch()}
        setActiveTab={setActiveTab}
      />

      {/* Featured Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Explore the Platform</span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">Featured Sections</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED_SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className="bg-neutral-900 hover:bg-neutral-900 border border-neutral-800 hover:border-yellow-400 p-5 rounded-xl text-left transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-white text-sm font-bold">{s.title}</h3>
                <p className="text-neutral-400 text-xs mt-1 leading-relaxed">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Latest Case Laws */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Freshly Structured</span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">Latest Case Laws</h2>
          </div>
          <button
            onClick={() => setActiveTab('case-law')}
            className="text-yellow-400 text-xs font-bold hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestCases.map((c) => (
            <button
              key={c.id}
              onClick={() => onOpenViewer(c)}
              className="bg-neutral-900 border border-neutral-800 hover:border-yellow-400 rounded-xl p-5 text-left transition group flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">{c.court}</span>
                {c.isLandmark && (
                  <span className="bg-yellow-400 text-neutral-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    Landmark
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold font-serif text-white leading-snug group-hover:text-yellow-300 transition">
                {c.title}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1">{c.citation}</p>
              <p className="text-xs text-neutral-400 mt-3 line-clamp-2 flex-1">{c.subject}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-yellow-400 font-bold mt-3">
                <Scale className="w-3.5 h-3.5" /> Read ratio & full judgment
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-900/40 border-y border-neutral-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Trusted by the Profession</span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">What Practitioners Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 flex flex-col">
                <Quote className="w-7 h-7 text-yellow-400/70 mb-3" />
                <p className="text-sm text-neutral-200 leading-relaxed flex-1">“{t.quote}”</p>
                <div className="flex items-center gap-0.5 mt-4 mb-2">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-[11px] text-neutral-400">{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="relative overflow-hidden bg-neutral-900 border border-yellow-500/30 rounded-2xl p-8 sm:p-10 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white">
              One platform for research, drafting, advocacy & AI
            </h2>
            <p className="text-sm text-neutral-300 mt-2 max-w-2xl mx-auto">
              Plans for individual practitioners, chambers and the judiciary. Start free — upgrade when you are ready.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setActiveTab('pricing')}
                className="bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold px-6 py-3 rounded-xl text-sm transition flex items-center gap-2"
              >
                View Pricing <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl text-sm border border-neutral-800 transition flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-yellow-400" /> Try the AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Answers</span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </div>
  );
};
