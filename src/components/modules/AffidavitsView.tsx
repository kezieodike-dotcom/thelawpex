import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import {
  AFFIDAVITS,
  AFFIDAVIT_CATEGORIES,
  affidavitById,
  affidavitCategoryById,
  affidavitsInCategory,
  searchAffidavits,
} from '../../data/affidavits';
import { AffidavitTemplate, LegalDraft } from '../../types';
import { DocumentActions } from '../DocumentActions';
import { buildWordDraft, buildWordList } from '../../lib/copyToWord';

interface AffidavitsViewProps {
  onCustomizeDraft: (draft: LegalDraft) => void;
  /** Category taken from the URL (`/affidavits/:categoryId`). */
  categoryId?: string;
  /** Affidavit taken from the URL (`/affidavits/deposition/:affidavitId`). */
  affidavitId?: string;
}

export const AffidavitsView: React.FC<AffidavitsViewProps> = ({
  onCustomizeDraft,
  categoryId,
  affidavitId,
}) => {
  const affidavit = affidavitId ? affidavitById(affidavitId) : undefined;
  if (affidavit) return <AffidavitDetail affidavit={affidavit} onCustomizeDraft={onCustomizeDraft} />;

  const category = categoryId ? affidavitCategoryById(categoryId) : undefined;
  if (category) return <CategoryPage categoryId={category.id} />;

  return <AffidavitDirectory />;
};

// ---------------------------------------------------------------------------
// Level 1 — the search space and every category of affidavit
// ---------------------------------------------------------------------------

const AffidavitDirectory: React.FC = () => {
  const [query, setQuery] = useState('');
  const needle = query.trim();
  const matches = useMemo(() => searchAffidavits(needle), [needle]);

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            Module 6
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            All Manner of Affidavits
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            Every affidavit a Nigerian practitioner swears — from a change of name at the registry to
            a counter affidavit that defeats an injunction. Each carries the full sworn text, the law
            it is sworn under, and the defects that get depositions struck out.
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search affidavits e.g. 'bail', 'urgency', 'loss of C of O', 'counter affidavit', 'Oaths Act'..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <p className="text-[11px] text-neutral-500 mt-3">
            {AFFIDAVITS.length} affidavits across {AFFIDAVIT_CATEGORIES.length} categories — search
            runs across the sworn text itself.
          </p>
        </div>

        {/* A search turns the page into a flat list of hits */}
        {needle ? (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider">
              {matches.length} {matches.length === 1 ? 'affidavit' : 'affidavits'} matching “{needle}”
            </h2>

            {matches.length === 0 ? (
              <p className="text-sm text-neutral-600">
                No affidavit in the library matches “{needle}”.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((affidavit) => (
                  <AffidavitCard key={affidavit.id} affidavit={affidavit} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {AFFIDAVIT_CATEGORIES.map((category) => {
              const count = affidavitsInCategory(category.id).length;

              return (
                <Link
                  key={category.id}
                  to={`/affidavits/${category.id}`}
                  className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-5 transition shadow-lg group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-yellow-700" />
                      <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
                        Sworn under the Oaths Act
                      </span>
                    </div>
                    <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                      {category.label}
                    </h2>
                    <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">
                      {count} {count === 1 ? 'affidavit' : 'affidavits'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-yellow-700" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const AffidavitCard: React.FC<{ affidavit: AffidavitTemplate }> = ({ affidavit }) => (
  <Link
    to={`/affidavits/deposition/${affidavit.id}`}
    className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-5 transition shadow-lg group flex flex-col justify-between"
  >
    <div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition">
          {affidavit.title}
        </h3>
        <ChevronRight className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
      </div>
      <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">{affidavit.description}</p>
    </div>

    <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center gap-2">
      <span className="bg-white border border-neutral-200 text-neutral-600 text-[10px] px-2 py-0.5 rounded">
        {affidavit.courtHeadingRequired ? 'Filed under a court heading' : 'Standalone deposition'}
      </span>
      <span className="bg-white border border-neutral-200 text-neutral-600 text-[10px] px-2 py-0.5 rounded">
        Deponent: {affidavit.deponent}
      </span>
    </div>
  </Link>
);

// ---------------------------------------------------------------------------
// Level 2 — the affidavits inside a category
// ---------------------------------------------------------------------------

const CategoryPage: React.FC<{ categoryId: AffidavitTemplate['category'] }> = ({ categoryId }) => {
  const category = affidavitCategoryById(categoryId)!;
  const affidavits = affidavitsInCategory(categoryId);
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const visible = affidavits.filter(
    (affidavit) =>
      !needle ||
      [affidavit.title, affidavit.description, affidavit.whenToUse, ...affidavit.keywords]
        .join(' ')
        .toLowerCase()
        .includes(needle),
  );

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to="/affidavits"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All affidavits
          </Link>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            {category.label}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            {category.description}
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find an affidavit in this category..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-neutral-600">No affidavit here matches “{query}”.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map((affidavit) => (
              <AffidavitCard key={affidavit.id} affidavit={affidavit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Level 3 — one affidavit: the sworn text and everything around it
// ---------------------------------------------------------------------------

const AffidavitDetail: React.FC<{
  affidavit: AffidavitTemplate;
  onCustomizeDraft: (draft: LegalDraft) => void;
}> = ({ affidavit, onCustomizeDraft }) => {
  const category = affidavitCategoryById(affidavit.category);

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
          <Link
            to={`/affidavits/${affidavit.category}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {category?.label ?? 'All affidavits'}
          </Link>

          <h1 className="text-xl sm:text-3xl font-black font-serif text-neutral-900 mt-2 leading-snug">
            {affidavit.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 mt-2 leading-relaxed">
            {affidavit.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg">
              {affidavit.courtHeadingRequired
                ? 'Filed under a court heading'
                : 'Standalone — no court heading'}
            </span>
            <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-yellow-700" />
              {affidavit.deponent}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <Panel title="When you use it" subtitle="The situation this deposition answers.">
            <p className="text-xs text-neutral-700 leading-relaxed bg-white border border-neutral-200 rounded-xl p-4">
              {affidavit.whenToUse}
            </p>
          </Panel>

          <Panel
            title="Sworn under"
            subtitle="The law that authorises the deposition and any rule that requires it."
          >
            <ul className="space-y-2">
              {affidavit.statutoryBasis.map((basis, index) => (
                <li
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-800 leading-relaxed"
                >
                  <BookOpen className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                  <span>{basis}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Practice notes"
            subtitle="What gets affidavits of this kind struck out, and how to avoid it."
          >
            <ul className="space-y-2">
              {affidavit.practiceNotes.map((note, index) => (
                <li
                  key={index}
                  className="bg-white border border-neutral-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            <DocumentActions
              className="mt-4"
              html={buildWordList('Practice notes', affidavit.title, affidavit.practiceNotes)}
              filename={`${affidavit.title} - practice notes`}
              hint="Copy the practice notes to MS Word."
            />
          </Panel>

          <Panel
            title="The sworn text"
            subtitle="Court-ready. Replace every bracketed placeholder before the affidavit is deposed to."
          >
            <pre className="bg-white border border-neutral-200 rounded-xl p-4 text-[11px] leading-relaxed text-neutral-800 whitespace-pre-wrap font-mono overflow-x-auto max-h-[45rem] overflow-y-auto">
              {affidavit.sampleText}
            </pre>

            <DocumentActions
              className="mt-4"
              html={buildWordDraft(
                affidavit.title,
                `LAWPEX — ${category?.label ?? 'Affidavit library'}`,
                affidavit.sampleText,
              )}
              filename={affidavit.title}
              hint="Copy the affidavit to MS Word — the layout of the deposition is preserved."
            />

            <button
              onClick={() =>
                onCustomizeDraft({
                  id: affidavit.id,
                  title: affidavit.title,
                  category: 'Affidavits',
                  areaOfLaw: category?.label ?? 'Affidavits',
                  description: affidavit.description,
                  courtHeadingRequired: affidavit.courtHeadingRequired,
                  sampleText: affidavit.sampleText,
                  variables: [],
                  downloadCount: 0,
                  isCustomizableWithAI: true,
                })
              }
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Customise this affidavit with AI
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );
};

const Panel: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xl">
    <div className="border-b border-neutral-200 pb-3 mb-4">
      <h2 className="text-lg font-black font-serif text-neutral-900">{title}</h2>
      <p className="text-[11px] text-neutral-600 mt-0.5">{subtitle}</p>
    </div>
    {children}
  </div>
);
