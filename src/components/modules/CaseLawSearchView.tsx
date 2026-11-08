import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ArrowDown, Award, X } from 'lucide-react';
import caseCatalog from '../../data/caseCatalog.json';
import { usePublishedCases } from '../../lib/publishedCases';
import { searchCaseLaws, type CaseSearchDocument } from '../../lib/caseSearch';

type SearchCase = CaseSearchDocument & { isLandmark?: boolean };
const CASE_PAGE_BG =
  'bg-[radial-gradient(circle_at_12%_0%,rgba(250,204,21,0.22),transparent_30rem),linear-gradient(180deg,#fffdf6,#ffffff_24rem)]';
const LANDMARK_SEARCH_PROMPTS = caseCatalog
  .filter(({ isLandmark }) => isLandmark)
  .slice(0, 2)
  .map(({ title }) => title);

const courtLabel = (court: string): string =>
  court === 'Supreme Court of Nigeria' ? 'Supreme Court' : court;

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const literal = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.split(new RegExp(`(${literal})`, 'gi')).map((part, index) =>
    index % 2 ? <mark key={index} className="rounded-sm bg-amber-100 text-inherit">{part}</mark> : part,
  );
}

export const CaseLawSearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [landmarkPromptIndex, setLandmarkPromptIndex] = useState(0);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { cases: publishedCases, error: libraryError, refresh: refreshLibrary } = usePublishedCases();
  const [fullCases, setFullCases] = useState<SearchCase[] | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [retry, setRetry] = useState(0);
  const caseLaws = useMemo(() => [...(fullCases ?? caseCatalog), ...publishedCases], [fullCases, publishedCases]);
  const trimmedQuery = query.trim();
  const showLandmarkPrompt = !query && !searchFocused && LANDMARK_SEARCH_PROMPTS.length > 0;
  const needsFullSearch = trimmedQuery.length >= 3;
  useEffect(() => {
    if (!showLandmarkPrompt || LANDMARK_SEARCH_PROMPTS.length < 2) return;
    const timer = window.setInterval(() => {
      setLandmarkPromptIndex((current) => (current + 1) % LANDMARK_SEARCH_PROMPTS.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [showLandmarkPrompt]);

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
  const showSuggestions = suggestionsOpen && suggestions.length > 0;
  const activeSuggestion = suggestions.findIndex(({ judgment }) => judgment.id === activeSuggestionId);
  const closeSuggestions = useCallback(() => {
    setSuggestionsOpen(false);
    setActiveSuggestionId(null);
  }, []);

  useEffect(() => {
    const dismissOnOutsideClick = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) closeSuggestions();
    };

    // Keep the in-flow panel in place until an outside click finishes.
    document.addEventListener('click', dismissOnOutsideClick);
    return () => document.removeEventListener('click', dismissOnOutsideClick);
  }, [closeSuggestions]);

  useEffect(() => {
    if (!showSuggestions || activeSuggestion < 0) return;
    const list = suggestionsRef.current;
    const row = list?.children.item(activeSuggestion);
    if (!list || !row) return;
    const bounds = list.getBoundingClientRect();
    const option = row.getBoundingClientRect();
    if (option.bottom > bounds.bottom) list.scrollTop += option.bottom - bounds.bottom;
    else if (option.top < bounds.top) list.scrollTop -= bounds.top - option.top;
  }, [activeSuggestion, showSuggestions]);

  const openJudgment = (caseId: string) => {
    closeSuggestions();
    navigate(`/case-law/case/${caseId}`);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmedQuery) return;
    const selected = suggestions[activeSuggestion] ?? results[0];
    if (selected) openJudgment(selected.judgment.id);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') {
      closeSuggestions();
      return;
    }
    if (!suggestions.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setSuggestionsOpen(true);
      const next = event.key === 'ArrowDown'
        ? (activeSuggestion + 1) % suggestions.length
        : activeSuggestion <= 0 ? suggestions.length - 1 : activeSuggestion - 1;
      setActiveSuggestionId(suggestions[next].judgment.id);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = suggestions[activeSuggestion] ?? suggestions[0];
      if (selected) openJudgment(selected.judgment.id);
    }
  };

  const viewResults = () => {
    closeSuggestions();
    requestAnimationFrame(() => {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <div className={`${CASE_PAGE_BG} min-h-screen py-7 text-neutral-900 sm:py-12`}>
      {libraryError && <p role="status" className="mx-auto max-w-7xl px-4 text-sm text-amber-900">Newly published cases could not be loaded. The existing collection is available. <button onClick={() => void refreshLibrary()} className="underline">Retry</button></p>}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={searchRef}>
          <header className="lawpex-module-hero lawpex-case-motion rounded-2xl border-b border-amber-200 p-4 sm:p-8">
            <div className="max-w-4xl">
              <span className="inline-flex items-center bg-[#facc15] px-3 py-1.5 text-xs font-black uppercase text-neutral-950">
                Unified Nigerian law reports
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-neutral-950 sm:text-5xl">
                Search Nigerian Case Laws
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">
                Find the authority you need by party, citation, keyword, legal principle or ratio decidendi.
              </p>
              <p className="mt-3 text-sm font-semibold">{caseLaws.length} verified reports</p>
            </div>

            <form className="lawpex-no-reveal mt-5" onSubmit={handleSubmit} role="search">
              <label htmlFor="case-law-search" className="mb-2 block text-sm font-black text-neutral-800">
                Search the case library
              </label>
              <div className="flex h-14 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-1.5 focus-within:ring-2 focus-within:ring-amber-400 sm:gap-2">
                <Search aria-hidden="true" className="ml-1 h-5 w-5 shrink-0 text-amber-700 sm:ml-2" />
                <div className="relative h-full min-w-0 flex-1">
                  <input
                    ref={inputRef}
                    id="case-law-search"
                    type="text"
                    inputMode="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setSuggestionsOpen(true);
                      setActiveSuggestionId(null);
                    }}
                    onFocus={() => {
                      setSearchFocused(true);
                      setSuggestionsOpen(true);
                    }}
                    onBlur={() => setSearchFocused(false)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={showLandmarkPrompt ? '' : 'Party, citation or keyword'}
                    autoComplete="off"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions}
                    aria-controls={showSuggestions ? 'case-law-suggestions' : undefined}
                    aria-activedescendant={showSuggestions && activeSuggestion >= 0 ? `case-suggestion-${activeSuggestion}` : undefined}
                    className="h-full w-full min-w-0 bg-transparent px-1 text-base font-semibold text-neutral-950 outline-none placeholder:font-normal placeholder:text-neutral-500"
                  />
                  {showLandmarkPrompt && (
                    <span
                      key={landmarkPromptIndex}
                      data-testid="case-search-landmark-prompt"
                      aria-hidden="true"
                      className="lawpex-case-search-prompt pointer-events-none absolute inset-0 flex min-w-0 items-center overflow-hidden px-1 text-sm font-medium text-neutral-500 sm:text-base"
                    >
                      <span className="block min-w-0 truncate">
                        {LANDMARK_SEARCH_PROMPTS[landmarkPromptIndex]}
                      </span>
                    </span>
                  )}
                </div>
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      closeSuggestions();
                      inputRef.current?.focus();
                    }}
                    className="lawpex-focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                    aria-label="Clear case search"
                    title="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!results.length || !trimmedQuery}
                  className="lawpex-focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#facc15] text-neutral-950 transition-colors hover:bg-[#eab308] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
                  aria-label="Open first matching case"
                  title="Open first matching case"
                >
                  <Search className="h-5 w-5" />
                </button>

              </div>
            </form>
          </header>

          {showSuggestions && (
            <div className="lawpex-no-reveal mt-3 rounded-lg border border-amber-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-neutral-950">Quick matches</h2>
                <span className="text-xs tabular-nums text-neutral-600">{suggestions.length} of {results.length}</span>
              </div>
              <div
                ref={suggestionsRef}
                id="case-law-suggestions"
                role="listbox"
                aria-label="Matching cases"
                className="max-h-[clamp(8rem,36dvh,23rem)] divide-y divide-neutral-100 overflow-y-auto overscroll-contain"
              >
                {suggestions.map((suggestion, index) => (
                  <Link
                    id={`case-suggestion-${index}`}
                    key={suggestion.judgment.id}
                    to={`/case-law/case/${suggestion.judgment.id}`}
                    role="option"
                    tabIndex={-1}
                    aria-selected={activeSuggestion === index}
                    onClick={closeSuggestions}
                    className={`grid grid-cols-[minmax(0,1fr)_1rem] items-center gap-3 border-l-2 px-3.5 py-3 transition-colors ${
                      activeSuggestion === index ? 'border-amber-500 bg-amber-50' : 'border-transparent hover:bg-neutral-50'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block break-words text-sm font-semibold leading-5 text-neutral-950 sm:text-base sm:leading-6">
                        {highlightMatch(suggestion.judgment.title, trimmedQuery)}
                      </span>
                      <span className="mt-1 block break-words text-xs font-medium leading-5 text-amber-800 sm:text-sm">
                        {suggestion.judgment.citation}
                      </span>
                    </span>
                    <ChevronRight aria-hidden="true" className="h-4 w-4 text-neutral-500" />
                  </Link>
                ))}
              </div>
              <div className="border-t border-neutral-200 px-2 py-1">
                <button type="button" onClick={viewResults} className="lawpex-focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-semibold text-amber-900 hover:bg-amber-50">
                  View search results <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <section ref={resultsRef} tabIndex={-1} className="mt-8 scroll-mt-28 outline-none sm:mt-10" aria-label="Case law search results">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-300 pb-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-amber-700">
                {trimmedQuery ? 'Best matches' : 'Case library'}
              </p>
              <h2 className="mt-1 break-words text-2xl font-bold text-neutral-950 sm:text-3xl">
                {trimmedQuery ? `Results for “${trimmedQuery}”` : 'All uploaded cases'}
              </h2>
            </div>
            <p role="status" className="text-sm font-semibold tabular-nums text-neutral-600">
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
                  className="lawpex-case-motion lawpex-focus-ring group grid grid-cols-[minmax(0,1fr)_1rem] gap-3 px-2 py-5 transition-colors hover:bg-amber-50/60 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:gap-4 sm:px-3 sm:py-6"
                  style={{ '--case-delay': `${Math.min(index, 4) * 30}ms` } as React.CSSProperties}
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
                    <span className="mt-3 block break-words text-lg font-bold leading-snug text-neutral-950 transition-colors group-hover:text-amber-800 sm:text-xl">
                      {highlightMatch(result.judgment.title, trimmedQuery)}
                    </span>
                    <span className="mt-1 block break-words text-sm font-semibold text-amber-800">
                      {highlightMatch(result.judgment.citation, trimmedQuery)}
                    </span>
                    <span className="mt-3 block max-w-4xl break-words text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">
                      {trimmedQuery && !['Party name', 'Citation', 'Case report'].includes(result.matchedField) ? <>
                        <span className="mb-0.5 block text-xs font-semibold text-neutral-600">{result.matchedField}</span>
                        {highlightMatch(result.excerpt, trimmedQuery)}
                      </> : result.judgment.subject}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 self-center text-sm font-semibold text-neutral-700 transition-colors group-hover:text-amber-800">
                    <span className="hidden sm:inline">Open case</span>
                    <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
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
