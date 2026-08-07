import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ArrowLeft, Gavel, Scale, Landmark, Building2 } from 'lucide-react';
import {
  COURT_RULE_CATEGORIES,
  CourtRuleBook,
  CourtRuleCategoryId,
  categoryById,
  editionLabel,
  ruleBookById,
  ruleBooksInCategory,
  searchRuleBook,
} from '../../data/courtRules';
import { DocumentActions } from '../DocumentActions';
import { buildWordSection } from '../../lib/copyToWord';

interface CourtRulesViewProps {
  /** Court category taken from the URL (`/court-rules/:categoryId`). */
  categoryId?: string;
  /** Rule book taken from the URL (`/court-rules/:categoryId/:bookId`). */
  bookId?: string;
}

const CATEGORY_ICONS: Record<CourtRuleCategoryId, React.ElementType> = {
  magistrate: Building2,
  'high-court': Landmark,
  'national-industrial-court': Scale,
  'federal-high-court': Landmark,
  'court-of-appeal': Gavel,
  'supreme-court': Gavel,
};

export const CourtRulesView: React.FC<CourtRulesViewProps> = ({ categoryId, bookId }) => {
  const category = categoryId ? categoryById(categoryId) : undefined;
  const book = bookId ? ruleBookById(bookId) : undefined;

  if (book && category) return <RuleBookPage book={book} categoryLabel={category.label} />;
  if (category) return <CategoryPage categoryId={category.id} />;
  return <CategoryDirectory />;
};

// ---------------------------------------------------------------------------
// Level 1 — the six categories of rule book
// ---------------------------------------------------------------------------

const CategoryDirectory: React.FC = () => (
  <div className="bg-white text-neutral-900 min-h-screen py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
          Module 2
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">Court Rules</h1>
        <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
          The rules of every court you will appear in. Open a court and use the search banner to go
          straight to a rule, an Order, or an area of court process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {COURT_RULE_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id];
          const books = ruleBooksInCategory(category.id);

          return (
            <Link
              key={category.id}
              to={`/court-rules/${category.id}`}
              className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-6 transition shadow-lg group flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/70 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                    {category.label}
                  </h2>
                  <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">
                  {category.isStateBased
                    ? `${books.length} jurisdictions — click and see them`
                    : `${books[0]?.orders.length ?? 0} Orders`}
                </span>
                <ChevronRight className="w-4 h-4 text-yellow-700" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Level 2 — the courts inside a category
// ---------------------------------------------------------------------------

const CategoryPage: React.FC<{ categoryId: CourtRuleCategoryId }> = ({ categoryId }) => {
  const category = categoryById(categoryId)!;
  const books = ruleBooksInCategory(categoryId);
  const [query, setQuery] = useState('');

  // A single-court category has nothing to pick from — go straight to its rules.
  if (!category.isStateBased && books.length === 1) {
    return <RuleBookPage book={books[0]} categoryLabel={category.label} />;
  }

  const needle = query.trim().toLowerCase();
  const visible = books.filter(
    (book) => !needle || book.courtName.toLowerCase().includes(needle) || book.state?.toLowerCase().includes(needle),
  );

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to="/court-rules"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All court rules
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
              placeholder="Find a state e.g. Lagos, Kano, Rivers, Federal Capital Territory..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((book) => (
            <Link
              key={book.id}
              to={`/court-rules/${categoryId}/${book.id}`}
              className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-xl p-4 transition group flex items-center justify-between gap-3"
            >
              <div>
                <h2 className="text-sm font-bold font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                  {book.state}
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">{book.courtName}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-yellow-700 shrink-0" />
            </Link>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-sm text-neutral-600">No jurisdiction matches “{query}”.</p>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Level 3 — one rule book, with the rule/order/process search banner
// ---------------------------------------------------------------------------

const RuleBookPage: React.FC<{ book: CourtRuleBook; categoryLabel: string }> = ({
  book,
  categoryLabel,
}) => {
  const [query, setQuery] = useState('');
  const hits = useMemo(() => searchRuleBook(book, query), [book, query]);

  const processAreas = useMemo(
    () => Array.from(new Set(book.orders.map((order) => order.processArea))),
    [book],
  );

  const totalRules = book.orders.reduce((count, order) => count + order.rules.length, 0);

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with the search banner on top, as every rule book carries */}
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <Link
            to={`/court-rules/${book.category}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {categoryLabel}
          </Link>

          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            {book.courtName}
          </h1>
          <p className="text-[11px] text-yellow-700 font-mono mt-1">{editionLabel(book)}</p>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-2 leading-relaxed">
            {book.summary}
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search rule / order / area of court process e.g. 'Order 25', 'rule 2', 'summary judgment', 'service'..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {processAreas.map((area) => (
              <button
                key={area}
                onClick={() => setQuery(area)}
                className="bg-white border border-neutral-200 hover:border-yellow-500/80 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg transition"
              >
                {area}
              </button>
            ))}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="bg-yellow-400 text-neutral-950 font-bold text-[11px] px-2.5 py-1 rounded-lg"
              >
                Clear search
              </button>
            )}
          </div>

          <p className="text-[11px] text-neutral-500 mt-4">
            Showing {hits.length} of {totalRules} rules across {book.orders.length} Orders.
            {book.state && ' Order numbering varies between editions — confirm against the edition currently gazetted in your state before filing.'}
          </p>
        </div>

        {/* Results */}
        {hits.length === 0 ? (
          <p className="text-sm text-neutral-600">
            No rule in {book.courtName} matches “{query}”.
          </p>
        ) : (
          <div className="space-y-4">
            {hits.map(({ order, rule }) => (
              <div
                key={`${order.orderNumber}-${rule.ruleNumber}-${rule.title}`}
                className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/80 p-6 rounded-2xl transition shadow-lg space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-yellow-400/20 text-yellow-700 font-bold text-[10px] px-2 py-0.5 rounded border border-yellow-400/60">
                        Order {order.orderNumber} Rule {rule.ruleNumber}
                      </span>
                      <span className="bg-yellow-200 text-neutral-700 text-[10px] px-2 py-0.5 rounded">
                        {order.processArea}
                      </span>
                    </div>
                    <h3 className="text-base font-bold font-serif text-neutral-900 mt-1.5">{rule.title}</h3>
                    <p className="text-xs text-yellow-700 font-medium">{order.title}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 text-xs text-neutral-700 leading-relaxed">
                  {rule.content}
                </div>

                <DocumentActions
                  html={buildWordSection(
                    `Order ${order.orderNumber} Rule ${rule.ruleNumber} — ${rule.title}`,
                    `${book.courtName} — ${editionLabel(book)}`,
                    [rule.content],
                  )}
                  filename={`${book.courtName} Order ${order.orderNumber} Rule ${rule.ruleNumber}`}
                  hint="Copy this rule to MS Word for your written address."
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
