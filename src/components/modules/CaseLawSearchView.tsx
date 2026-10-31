import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Award, X } from 'lucide-react';
import caseCatalog from '../../data/caseCatalog.json';
import { getPublishedIngestedCases } from '../../data/caseIngestion';
import { searchCaseLaws, type CaseSearchDocument } from '../../lib/caseSearch';

type SearchCase = CaseSearchDocument & { isLandmark?: boolean };
const CASE_PAGE_BG =
  'bg-[radial-gradient(circle_at_12%_0%,rgba(250,204,21,0.22),transparent_30rem),linear-gradient(180deg,#fffdf6,#ffffff_24rem)]';

const courtLabel = (court: string): string =>
  court === 'Supreme Court of Nigeria' ? 'Supreme Court' : court;

export const CaseLawSearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const publishedCases = useMemo(() => getPublishedIngestedCases(), []);
  const [fullCases, setFullCases] = useState<SearchCase[] | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [retry, setRetry] = useState(0);
  const caseLaws = useMemo(() => [...(fullCases ?? caseCatalog), ...publishedCases], [fullCases, publishedCases]);
  const trimmedQuery = query.trim();
  const needsFullSearch = trimmedQuery.length >= 3;
  useEffect(() => {
    if (!needsFullSearch || fullCases) return;
    let active = true;
    setSearchStatus('loading');
    import('../../data/legalData')
      .then(({ LANDMARK_CASES }) => {
        if (!active) return;
        setFullCases(LANDMARK_CASES);
        setSearchStatus('ready');
      })
      .catch(() => { if (active) setSearchStatus('error'); });
    return () => { active = false; };
  }, [needsFullSearch, fullCases, retry]);
  const searchingText = needsFullSearch && !fullCases && searchStatus !== 'error';
  const results = useMemo(
    () => searchCaseLaws(caseLaws, trimmedQuery),
    [caseLaws, trimmedQuery],
  );
  const suggestions = trimmedQuery.length >= 2 ? results.slice(0, 6) : [];

  useEffect(() => {
    const closeSuggestions = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setSuggestionsOpen(false);
    };

    document.addEventListener('pointerdown', closeSuggestions);
    return () => document.removeEventListener('pointerdown', closeSuggestions);
  }, []);

  const openJudgment = (caseId: string) => {
    setSuggestionsOpen(false);
    navigate(`/case-law/case/${caseId}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const selected = suggestions[activeSuggestion] ?? results[0];
    if (selected) openJudgment(selected.judgment.id);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestion((current) => (current + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestion((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = suggestions[activeSuggestion] ?? suggestions[0];
      if (selected) openJudgment(selected.judgment.id);
    } else if (event.key === 'Escape') {
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
    }
  };

  return (
    <div className={`${CASE_PAGE_BG} min-h-screen py-7 text-neutral-900 sm:py-12`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="lawpex-module-hero lawpex-case-motion relative z-20 overflow-visible rounded-2xl border-b border-amber-200 p-6 pb-8 sm:p-8 sm:pb-10">
          <div className="max-w-4xl">
            <span className="inline-flex items-center bg-[#facc15] px-3 py-1.5 text-xs font-black uppercase text-neutral-950">
              Unified Nigerian law reports
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] text-neutral-950 sm:text-6xl">
              Search Nigerian Case Laws
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              Find the authority you need by party, citation, keyword, legal principle or ratio decidendi.
            </p>
          </div>

          <form className="lawpex-no-reveal mt-8 max-w-5xl" onSubmit={handleSubmit} role="search">
            <label htmlFor="case-law-search" className="mb-2 block text-sm font-black text-neutral-800">
              Search the case library
            </label>
            <div ref={searchRef} className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-700 sm:left-5 sm:h-6 sm:w-6" />
              <input
                id="case-law-search"
                type="text"
                inputMode="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSuggestionsOpen(true);
                  setActiveSuggestion(-1);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search by party, keyword, principle or ratio"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={suggestionsOpen && suggestions.length > 0}
                aria-controls="case-law-suggestions"
                aria-activedescendant={activeSuggestion >= 0 ? `case-suggestion-${activeSuggestion}` : undefined}
                className={`lawpex-focus-ring h-16 w-full rounded-xl border-2 border-neutral-900 bg-white pl-12 text-base font-bold text-neutral-950 shadow-[0_22px_52px_-38px_rgba(24,20,17,0.65)] outline-none placeholder:font-medium placeholder:text-neutral-500 sm:h-[4.75rem] sm:pl-16 sm:text-lg ${query ? 'pr-24 sm:pr-32' : 'pr-16 sm:pr-20'}`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveSuggestion(-1);
                  }}
                  className="lawpex-focus-ring absolute right-14 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 sm:right-20"
                  aria-label="Clear case search"
                  title="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                type="submit"
                disabled={!results.length || !trimmedQuery}
                className="lawpex-focus-ring absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg bg-[#facc15] text-neutral-950 transition hover:bg-[#eab308] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 sm:right-3 sm:h-12 sm:w-12"
                aria-label="Open first matching case"
                title="Open first matching case"
              >
                <Search className="h-5 w-5" />
              </button>

              {suggestionsOpen && suggestions.length > 0 && (
                <div
                  id="case-law-suggestions"
                  role="listbox"
                  className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-[21rem] overflow-y-auto rounded-xl border border-amber-200 bg-white p-1.5 shadow-[0_28px_70px_-34px_rgba(24,20,17,0.55)] sm:max-h-[26rem]"
                >
                  {suggestions.map((suggestion, index) => (
                    <Link
                      id={`case-suggestion-${index}`}
                      key={suggestion.judgment.id}
                      to={`/case-law/case/${suggestion.judgment.id}`}
                      role="option"
                      aria-selected={activeSuggestion === index}
                      onMouseEnter={() => setActiveSuggestion(index)}
                      onClick={() => {
                        setSuggestionsOpen(false);
                        window.scrollTo({ top: 0, behavior: 'auto' });
                      }}
                      className={`lawpex-focus-ring grid gap-1 rounded-lg px-3 py-3 transition sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-4 ${
                        activeSuggestion === index ? 'bg-amber-50' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black text-neutral-950 sm:text-base">
                          {suggestion.judgment.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs font-semibold text-neutral-600 sm:text-sm">
                          {suggestion.matchedField}: {suggestion.excerpt}
                        </span>
                      </span>
                      <span className="text-xs font-black text-amber-800">{suggestion.judgment.citation}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-neutral-600">
            <span>{caseLaws.length} verified reports</span>
            <span>Full judgments</span>
            <span>Ratios and principles</span>
          </div>
        </header>

        <section className="mt-8 sm:mt-10" aria-live="polite" aria-label="Case law search results">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-300 pb-4">
            <div>
              <p className="text-xs font-black uppercase text-amber-700">
                {trimmedQuery ? 'Best matches' : 'Case library'}
              </p>
              <h2 className="mt-1 text-2xl font-black text-neutral-950 sm:text-3xl">
                {trimmedQuery ? `Results for “${trimmedQuery}”` : 'All uploaded cases'}
              </h2>
            </div>
            <p className="text-sm font-bold text-neutral-600">
              {results.length} {results.length === 1 ? 'case' : 'cases'}
            </p>
          </div>

          {needsFullSearch && !fullCases && (
            <div role="status" className="py-3 text-sm text-neutral-700">
              {searchStatus === 'error' ? (
                <span>Legal-text search could not load. <button type="button" className="font-semibold underline" onClick={() => setRetry(value => value + 1)}>Retry</button></span>
              ) : 'Searching ratios, principles and authorities...'}
            </div>
          )}
          {results.length === 0 && !searchingText && !(needsFullSearch && !fullCases && searchStatus === 'error') ? (
            <div className="py-14 sm:py-20">
              <Search className="h-8 w-8 text-amber-700" />
              <h3 className="mt-4 text-xl font-black text-neutral-950">No matching case found</h3>
              <p className="mt-2 max-w-xl text-base leading-7 text-neutral-600">
                Try another party name, a shorter legal phrase, a citation, or a related principle.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-amber-200">
              {results.map((result, index) => (
                <Link
                  key={result.judgment.id}
                  to={`/case-law/case/${result.judgment.id}`}
                  className="lawpex-case-motion group grid gap-4 py-6 transition hover:bg-amber-50/60 active:translate-y-px sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:px-3 sm:py-7"
                  style={{ '--case-delay': `${Math.min(index, 4) * 30}ms` } as React.CSSProperties}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
                >
                  <span className="hidden pt-1 text-sm font-black text-amber-700 sm:block">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-800">
                        {courtLabel(result.judgment.court)}
                      </span>
                      {result.judgment.isLandmark && (
                        <span className="inline-flex items-center gap-1 bg-[#facc15] px-2.5 py-1 text-[11px] font-black text-neutral-950">
                          <Award className="h-3 w-3" /> Landmark
                        </span>
                      )}
                    </span>
                    <span className="mt-3 block text-xl font-black leading-tight text-neutral-950 transition group-hover:text-amber-800 sm:text-2xl">
                      {result.judgment.title}
                    </span>
                    <span className="mt-1.5 block text-sm font-black text-amber-800 sm:text-base">
                      {result.judgment.citation}
                    </span>
                    <span className="mt-3 block max-w-4xl text-sm leading-7 text-neutral-700 sm:text-base">
                      {trimmedQuery && result.matchedField !== 'Party name'
                        ? `${result.matchedField}: ${result.excerpt}`
                        : result.judgment.subject}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 self-center text-sm font-black text-neutral-700 transition group-hover:text-amber-800">
                    Open case
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
