import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Gavel,
  GraduationCap,
  Landmark,
  Newspaper,
  Search,
  ShieldCheck,
  Scale,
  Video,
  X,
} from 'lucide-react';
import {
  AREAS_OF_LAW,
  COMPLIANCE_GUIDES,
  LEGAL_ARTICLES,
  LEGAL_DRAFTS_DATA,
  LEARNING_COURSES,
  LANDMARK_CASES,
  NIGERIAN_LAWS_DATA,
} from '../data/legalData';
import { usePublishedCases } from '../lib/publishedCases';
import type { CaseLaw } from '../types';
import { APPEAL_LADDERS, APPEAL_RIGHTS } from '../data/appeals';
import { AFFIDAVITS } from '../data/affidavits';
import { COURT_RULE_BOOKS } from '../data/courtRules';
import { COURTROOM_PROCEDURES } from '../data/procedures';
import { AI_LITIGATION_LESSONS } from '../data/litigationAI';

interface UniversalSearchModalProps {
  isOpen: boolean;
  initialQuery?: string;
  onClose: () => void;
  onSelectItem: (item: any) => void;
}

type SearchKind =
  | 'all'
  | 'cases'
  | 'laws'
  | 'rules'
  | 'drafts'
  | 'appeals'
  | 'affidavits'
  | 'videos'
  | 'articles'
  | 'learning'
  | 'compliance'
  | 'areas';

interface SearchRecord {
  id: string;
  kind: Exclude<SearchKind, 'all'>;
  title: string;
  subtitle: string;
  body: string;
  priority: number;
  item: any;
}

const FILTERS: { id: SearchKind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'cases', label: 'Cases' },
  { id: 'laws', label: 'Laws' },
  { id: 'rules', label: 'Rules' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'appeals', label: 'Appeals' },
  { id: 'affidavits', label: 'Affidavits' },
  { id: 'videos', label: 'Videos' },
  { id: 'articles', label: 'Articles' },
  { id: 'learning', label: 'Learning' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'areas', label: 'Areas' },
];

const ICONS: Record<Exclude<SearchKind, 'all'>, React.ElementType> = {
  cases: Scale,
  laws: BookOpen,
  rules: Gavel,
  drafts: FileText,
  appeals: Landmark,
  affidavits: ShieldCheck,
  videos: Video,
  articles: Newspaper,
  learning: GraduationCap,
  compliance: ShieldCheck,
  areas: BookOpen,
};

const normalise = (value: string) => value.toLowerCase();

const scoreRecord = (record: SearchRecord, query: string): number => {
  if (!query) return record.priority;
  const terms = query.split(/\s+/).filter(Boolean);
  const title = normalise(record.title);
  const subtitle = normalise(record.subtitle);
  const body = normalise(record.body);

  const termScore = terms.reduce((score, term) => {
    if (title.includes(term)) return score + 14;
    if (subtitle.includes(term)) return score + 7;
    if (body.includes(term)) return score + 3;
    return score;
  }, 0);

  return termScore + record.priority;
};

const buildSearchIndex = (publishedCases: CaseLaw[]): SearchRecord[] => [
  ...[...LANDMARK_CASES, ...publishedCases].map((item) => ({
    id: item.id,
    kind: 'cases' as const,
    title: item.title,
    subtitle: `${item.citation} · ${item.court} · ${item.year}`,
    body: [
      item.subject,
      item.areaOfLaw,
      item.factsSummary,
      item.decisionSummary,
      ...item.keyPrinciples,
      ...item.ratioDecidendi,
    ].join(' '),
    priority: item.court === 'Supreme Court of Nigeria' ? 10 : 7,
    item,
  })),
  ...NIGERIAN_LAWS_DATA.map((item) => ({
    id: item.id,
    kind: 'laws' as const,
    title: item.title,
    subtitle: `${item.citation} · ${item.category}`,
    body: [item.description, item.shortTitle, item.state ?? '', ...item.sections.map((s) => `${s.heading} ${s.content}`)].join(' '),
    priority: 8,
    item,
  })),
  ...COURT_RULE_BOOKS.flatMap((book) =>
    book.orders.flatMap((order) =>
      order.rules.map((rule) => ({
        id: `${book.id}-${order.orderNumber}-${rule.ruleNumber}`,
        kind: 'rules' as const,
        title: `${book.courtName}: Order ${order.orderNumber} Rule ${rule.ruleNumber}`,
        subtitle: `${order.title} · ${order.processArea}`,
        body: `${rule.title} ${rule.content} ${book.summary}`,
        priority: 8,
        item: {
          title: rule.title,
          orderTitle: order.title,
          content: rule.content,
          description: `${book.courtName}, Order ${order.orderNumber} Rule ${rule.ruleNumber}`,
        },
      })),
    ),
  ),
  ...LEGAL_DRAFTS_DATA.map((item) => ({
    id: item.id,
    kind: 'drafts' as const,
    title: item.title,
    subtitle: `${item.category} · ${item.areaOfLaw}`,
    body: `${item.description} ${item.sampleText} ${item.variables.join(' ')}`,
    priority: item.isCustomizableWithAI ? 8 : 5,
    item,
  })),
  ...APPEAL_RIGHTS.map((item) => ({
    id: item.id,
    kind: 'appeals' as const,
    title: item.title,
    subtitle: item.constitutionalBasis,
    body: `${item.summary} ${item.whenItApplies.join(' ')} ${item.practiceNotes.join(' ')}`,
    priority: 8,
    item: { title: item.title, description: item.summary, content: item.whenItApplies.join('\n') },
  })),
  ...APPEAL_LADDERS.map((item) => ({
    id: item.id,
    kind: 'appeals' as const,
    title: item.title,
    subtitle: `${item.fromCourt} to ${item.toCourt}`,
    body: `${item.summary} ${item.requirements.join(' ')} ${item.drafts.map((d) => d.sampleText).join(' ')}`,
    priority: 7,
    item: { title: item.title, description: item.summary, content: item.requirements.join('\n') },
  })),
  ...AFFIDAVITS.map((item) => ({
    id: item.id,
    kind: 'affidavits' as const,
    title: item.title,
    subtitle: `${item.category} · ${item.deponent}`,
    body: `${item.description} ${item.whenToUse} ${item.sampleText} ${item.keywords.join(' ')}`,
    priority: 7,
    item: { ...item, sampleText: item.sampleText },
  })),
  ...COURTROOM_PROCEDURES.map((item) => ({
    id: item.id,
    kind: 'videos' as const,
    title: item.title,
    subtitle: `${item.track} · ${item.typicalDuration}`,
    body: `${item.summary} ${item.governingRules.join(' ')} ${item.stages.flatMap((s) => s.steps).join(' ')}`,
    priority: 6,
    item: { title: item.title, description: item.summary, content: item.stages.map((s) => `${s.heading}\n${s.steps.join('\n')}`).join('\n\n') },
  })),
  ...LEGAL_ARTICLES.map((item) => ({
    id: item.id,
    kind: 'articles' as const,
    title: item.title,
    subtitle: `${item.category} · ${item.author}`,
    body: `${item.excerpt} ${item.fullContent} ${item.tags.join(' ')}`,
    priority: 5,
    item: { title: item.title, description: item.excerpt, content: item.fullContent },
  })),
  ...AI_LITIGATION_LESSONS.map((item) => ({
    id: item.id,
    kind: 'learning' as const,
    title: item.title,
    subtitle: `${item.stage} · ${item.level} · ${item.durationMinutes} min`,
    body: `${item.objective} ${item.whatTheAiDoes} ${item.body} ${item.prompts.map((p) => p.prompt).join(' ')}`,
    priority: 6,
    item: { title: item.title, description: item.objective, content: item.body },
  })),
  ...LEARNING_COURSES.map((item) => ({
    id: item.id,
    kind: 'learning' as const,
    title: item.title,
    subtitle: `${item.level} · ${item.durationHours} hours`,
    body: `${item.description} ${item.topics.join(' ')}`,
    priority: 5,
    item: { title: item.title, description: item.description, content: item.topics.join('\n') },
  })),
  ...COMPLIANCE_GUIDES.map((item) => ({
    id: item.id,
    kind: 'compliance' as const,
    title: item.title,
    subtitle: `${item.sector} · ${item.regulatoryBody}`,
    body: `${item.overview} ${item.checklist.join(' ')} ${item.keyComplianceItems.map((i) => `${i.requirement} ${i.penalty}`).join(' ')}`,
    priority: 6,
    item: { title: item.title, description: item.overview, content: item.checklist.join('\n') },
  })),
  ...AREAS_OF_LAW.map((item) => ({
    id: item.id,
    kind: 'areas' as const,
    title: item.title,
    subtitle: `${item.draftCount}+ drafts · ${item.caseCount}+ cases`,
    body: `${item.description} ${item.popularTopics.join(' ')} ${item.applicableStatutes.join(' ')} ${item.principlesOfLaw.join(' ')}`,
    priority: 7,
    item: { title: item.title, description: item.description, content: item.checklists.join('\n') },
  })),
];

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  initialQuery = '',
  onClose,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<SearchKind>('all');

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setFilterType('all');
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  const { cases: publishedCases } = usePublishedCases();
  const index = useMemo(() => buildSearchIndex(publishedCases), [publishedCases]);
  const needle = query.trim().toLowerCase();

  const results = useMemo(() => {
    return index
      .filter((record) => filterType === 'all' || record.kind === filterType)
      .map((record) => ({ record, score: scoreRecord(record, needle) }))
      .filter(({ score }) => !needle || score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 36);
  }, [filterType, index, needle]);

  const counts = useMemo(
    () =>
      FILTERS.reduce<Record<string, number>>((acc, filter) => {
        acc[filter.id] =
          filter.id === 'all' ? index.length : index.filter((record) => record.kind === filter.id).length;
        return acc;
      }, {}),
    [index],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#181411]/84 px-3 pt-4 backdrop-blur-md sm:px-4 sm:pt-10">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Universal legal search"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[1.35rem] border border-amber-200 bg-[#fffdf6] text-neutral-900 shadow-[0_32px_90px_-44px_rgba(0,0,0,0.72)] sm:max-h-[90dvh] sm:rounded-[1.8rem]"
      >
        <div className="flex items-center gap-3 border-b border-amber-200 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all LAWPEX resources: cases, statutes, rules, affidavits, videos, articles..."
            aria-label="Search all LAWPEX resources"
            className="min-w-0 w-full bg-transparent text-sm font-bold text-neutral-950 placeholder:text-neutral-500 focus:outline-none sm:text-base"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="lawpex-focus-ring rounded-2xl bg-amber-50 p-2.5 text-neutral-700 hover:bg-amber-100 hover:text-neutral-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          role="group"
          aria-label="Filter search results"
          className="lawpex-scrollbar-hide flex min-h-[68px] shrink-0 snap-x snap-proximity items-center gap-2 overflow-x-auto overscroll-x-contain border-b border-amber-200 bg-[#fff8df] px-3 py-3 text-xs shadow-[inset_0_-1px_0_rgba(180,126,18,0.12)] sm:flex-wrap sm:overflow-x-visible sm:px-5"
        >
          {FILTERS.map((filter) => (
            <button
              type="button"
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              aria-pressed={filterType === filter.id}
              className={`lawpex-focus-ring min-h-11 shrink-0 snap-start rounded-full px-4 py-2 font-black transition active:scale-[0.98] ${
                filterType === filter.id
                  ? 'bg-[#181411] text-yellow-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                  : 'border border-amber-300 bg-white text-neutral-700 hover:border-amber-500 hover:text-neutral-950'
              }`}
            >
              {filter.label} <span className={filterType === filter.id ? 'text-yellow-300' : 'text-amber-700'}>{counts[filter.id]}</span>
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 bg-white lg:grid-cols-[0.66fr_1.34fr]">
          <aside className="hidden border-r border-amber-200 bg-[#fffdf6] p-5 lg:block">
            <p className="lawpex-kicker">Search intelligence</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-neutral-950">
              Faceted, ranked, cross-module.
            </h2>
            <p className="mt-3 text-xs leading-6 text-neutral-700">
              Results are weighted toward court hierarchy, direct title matches and PRD-critical
              research assets. The same entry point covers every module listed in the PRD.
            </p>
            <div className="mt-5 space-y-2 text-xs text-neutral-700">
              {['Court hierarchy', 'Recency and title match', 'Full text and principles', 'Draft and export utility'].map((item) => (
                <div key={item} className="rounded-xl border border-amber-200 bg-white p-3 font-bold shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="min-h-0 overflow-y-auto overscroll-contain bg-white p-2.5 sm:p-4">
            <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-neutral-200 px-1 pb-2.5 sm:mb-3 sm:pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">
                  {needle ? 'Best matches' : 'Browse the library'}
                </p>
                <p className="mt-0.5 text-sm font-bold text-neutral-950">
                  {filterType === 'all' ? 'All resources' : FILTERS.find((filter) => filter.id === filterType)?.label}
                </p>
              </div>
              <p role="status" className="shrink-0 text-xs font-semibold tabular-nums text-neutral-600">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            {results.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center">
                <h3 className="text-lg font-black text-neutral-950">No matching authority found</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
                  Try a citation, party name, statute section, court rule, practice area or draft title.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map(({ record }) => {
                  const Icon = ICONS[record.kind];
                  return (
                    <button
                      type="button"
                      key={`${record.kind}-${record.id}`}
                      data-search-result
                      onClick={() => {
                        onSelectItem(record.item);
                        onClose();
                      }}
                      className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_1rem] items-start gap-3 rounded-xl border border-amber-200 bg-white p-3 text-left shadow-[0_18px_45px_-38px_rgba(120,82,20,0.46)] transition-colors hover:border-amber-500 hover:bg-[#fffaf0] sm:grid-cols-[2.75rem_minmax(0,1fr)_1rem] sm:rounded-2xl sm:p-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 ring-1 ring-amber-200 sm:h-11 sm:w-11 sm:rounded-2xl">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex min-h-5 flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">
                            {record.kind}
                          </span>
                        </span>
                        <span className="mt-1 block break-words text-sm font-black leading-5 text-neutral-950 sm:text-base sm:leading-6">
                          {record.title}
                        </span>
                        <span data-search-subtitle className="mt-1 block break-words text-xs font-medium leading-5 text-neutral-600 sm:text-sm">
                          {record.subtitle}
                        </span>
                      </span>
                      <ArrowRight className="mt-3 h-4 w-4 shrink-0 text-amber-700 transition group-hover:translate-x-0.5 sm:opacity-0 sm:group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
