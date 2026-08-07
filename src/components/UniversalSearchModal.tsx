import React, { useMemo, useState } from 'react';
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
import { APPEAL_LADDERS, APPEAL_RIGHTS } from '../data/appeals';
import { AFFIDAVITS } from '../data/affidavits';
import { COURT_RULE_BOOKS } from '../data/courtRules';
import { COURTROOM_PROCEDURES } from '../data/procedures';
import { AI_LITIGATION_LESSONS } from '../data/litigationAI';

interface UniversalSearchModalProps {
  isOpen: boolean;
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

const buildSearchIndex = (): SearchRecord[] => [
  ...LANDMARK_CASES.map((item) => ({
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
  onClose,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<SearchKind>('all');

  const index = useMemo(buildSearchIndex, []);
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/78 px-4 pt-14 backdrop-blur-sm">
      <div className="lawpex-card flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl text-neutral-900">
        <div className="flex items-center gap-3 border-b border-amber-100 bg-white p-4">
          <Search className="h-5 w-5 shrink-0 text-amber-700" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all LAWPEX resources: cases, statutes, rules, affidavits, videos, articles..."
            className="w-full bg-transparent text-sm font-semibold text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
          />
          <button onClick={onClose} className="lawpex-focus-ring rounded-xl bg-amber-50 p-2 text-neutral-600 hover:text-neutral-950">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-amber-100 bg-[#f8f5ee] px-4 py-3 text-xs">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`lawpex-focus-ring shrink-0 rounded-full px-3 py-1.5 font-black ${
                filterType === filter.id
                  ? 'bg-[#181411] text-white'
                  : 'border border-amber-200 bg-white/80 text-neutral-600 hover:border-amber-400 hover:text-neutral-950'
              }`}
            >
              {filter.label} <span className="opacity-60">{counts[filter.id]}</span>
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="hidden border-r border-amber-100 bg-white/60 p-5 lg:block">
            <p className="lawpex-kicker">Search intelligence</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-neutral-950">Faceted, ranked, cross-module.</h2>
            <p className="mt-3 text-xs leading-6 text-neutral-600">
              Results are weighted toward court hierarchy, direct title matches and PRD-critical
              research assets. The same entry point covers every module listed in the PRD.
            </p>
            <div className="mt-5 space-y-2 text-xs text-neutral-700">
              {['Court hierarchy', 'Recency and title match', 'Full text and principles', 'Draft and export utility'].map((item) => (
                <div key={item} className="rounded-xl border border-amber-100 bg-white p-3 font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="min-h-0 overflow-y-auto p-4">
            {results.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center">
                <h3 className="text-lg font-black text-neutral-950">No matching authority found</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
                  Try a citation, party name, statute section, court rule, practice area or draft title.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map(({ record, score }) => {
                  const Icon = ICONS[record.kind];
                  return (
                    <button
                      key={`${record.kind}-${record.id}`}
                      onClick={() => {
                        onSelectItem(record.item);
                        onClose();
                      }}
                      className="group flex w-full items-start gap-3 rounded-2xl border border-amber-100 bg-white p-4 text-left hover:border-amber-400 hover:bg-amber-50/50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">
                            {record.kind}
                          </span>
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
                            score {score}
                          </span>
                        </span>
                        <span className="mt-1 block text-sm font-black text-neutral-950">{record.title}</span>
                        <span className="mt-1 block truncate text-xs font-semibold text-neutral-500">
                          {record.subtitle}
                        </span>
                      </span>
                      <ArrowRight className="mt-3 h-4 w-4 shrink-0 text-neutral-400 opacity-0 group-hover:opacity-100" />
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
