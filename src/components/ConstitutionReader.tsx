import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  FileText,
  Menu,
  Minus,
  Plus,
  Printer,
  Search,
  Share2,
  X,
} from 'lucide-react';

export interface LegalDocumentReaderProps {
  documentText: string;
  title?: string;
  documentLabel?: string;
  documentId?: string;
  backPath?: string;
  documentPath?: string;
  pageCount?: number;
  initialSectionId?: string;
}

interface ConstitutionPage {
  pageNumber: number;
  text: string;
}

interface ConstitutionSection {
  id: string;
  number: string;
  heading: string;
  pageNumber: number;
  lineIndex: number;
  chapter: string;
  part?: string;
}

interface ConstitutionChapter {
  id: string;
  label: string;
  title: string;
  pageNumber: number;
  lineIndex: number;
  parts: Array<{ label: string; title: string; sections: ConstitutionSection[] }>;
}

interface ConstitutionSchedule {
  id: string;
  label: string;
  title: string;
  pageNumber: number;
  lineIndex: number;
}

type ReadingTheme = 'light' | 'sepia' | 'dark';

const legalTextFont = '"Source Serif 4", "Book Antiqua", "Palatino Linotype", Georgia, serif';
const uiFont = 'Inter, ui-sans-serif, system-ui, sans-serif';
const chapterPattern = /^CHAPTER\s+([IVXLCDM]+)$/i;
const partPattern = /^PART\s+([IVXLCDM]+)$/i;
const sectionPattern = /^(\d{1,3}[A-Z]?)\.\s*(?:—\s*)?(.+)$/;
const orderHeadingPattern = /^(?:ORDER|ORDERS|ORUER|ORDLR)\s*([0-9IVXLCDM]+)\b(?!\s*(?:RULE|RÚLE))\s*(?:[—-]\s*)?(.*)$/i;
const schedulePattern = /^(?:(?:PART|APPENDIX)\s+[IVXLCDM]+\s+)?(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|ELEVENTH|TWELFTH)\s+SCHEDULE\b(.*)$/i;

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const romanToNumber = (value: string) => {
  const numerals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  return value
    .toUpperCase()
    .split('')
    .reduceRight(
      (state, char) => {
        const number = numerals[char] ?? 0;
        return number < state.previous
          ? { total: state.total - number, previous: state.previous }
          : { total: state.total + number, previous: number };
      },
      { total: 0, previous: 0 },
    ).total;
};

const normalizeOrderToken = (value: string) => (/^\d+$/.test(value) ? value : String(romanToNumber(value)));

const parsePages = (documentText: string): ConstitutionPage[] =>
  documentText
    .split(/(?=^## Page \d+\s*$)/m)
    .map((chunk) => {
      const match = chunk.match(/^## Page (\d+)\s*\n([\s\S]*)$/);
      return { pageNumber: Number(match?.[1] ?? 0), text: match?.[2] ?? chunk };
    })
    .filter((page) => page.pageNumber > 0);

const isArrangementPage = (text: string) => /ARRANGEMENT\s+OF\s+(?:RULES|SECTIONS)|ARRANGEMENT\s+OF\s+ORDERS/i.test(text);

const nextNonEmptyLine = (lines: string[], index: number) => {
  for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
    const value = lines[cursor].trim();
    if (value) return value;
  }
  return '';
};

const marginalNoteStartPattern = /^(?:Form(?:\s+of)?(?:\s+\d+)?|Time\s+to|Title\s+of|Functions?(?:\s+of)?|Remuneration|Proceedings(?:\s+of)?|Cap\.|Allowances|Qualifications|Tenure|Meetings|Powers?(?:\s+of)?|Duties?(?:\s+of)?|Composition(?:\s+of)?|Mode\s+of|Notice\s+of)/i;
const structuralLinePattern = /^(?:\d{1,3}[.)]|\d{1,3}\s*[—-]|\([a-z0-9]+\)|ORDER\b|ORUER\b|ORDLR\b|CHAPTER\b|PART\b|FORM\s+\d+)/i;

const marginalNoteIndices = (lines: string[]) => {
  const indices = new Set<number>();
  lines.forEach((line, startIndex) => {
    const trimmed = line.trim();
    if (!trimmed || !marginalNoteStartPattern.test(trimmed) || trimmed.length > 42) return;
    indices.add(startIndex);

    // PDF text extraction can interleave a marginal note with the rule body.
    // Keep the short continuation lines in the note rail without moving the
    // numbered rule or any full sentence out of the main text column.
    for (let index = startIndex + 1; index < Math.min(lines.length, startIndex + 9); index += 1) {
      const continuation = lines[index].trim();
      if (!continuation || structuralLinePattern.test(continuation)) continue;
      const previous = lines[index - 1]?.trim() ?? '';
      if (continuation.length <= 20 && (/^[a-z]/.test(continuation) || (/^LFN[,\s]/i.test(continuation) && /^Cap\./i.test(previous)))) {
        indices.add(index);
      }
    }
  });
  return indices;
};

const LegalPageText: React.FC<{
  text: string;
  pageNumber: number;
  fontScale: number;
  anchorByPageLine: Map<string, { id: string; kind: 'chapter' | 'schedule' | 'section' }>;
}> = ({ text, pageNumber, fontScale, anchorByPageLine }) => {
  const lines = text.split(/\r?\n/);
  const noteIndices = marginalNoteIndices(lines);

  return (
    <div className="space-y-0 break-words text-[15px] leading-[1.9] sm:text-[17px] sm:leading-[2.05]" style={{ fontFamily: legalTextFont, fontSize: `clamp(15px, ${17 * fontScale}px, 22px)`, letterSpacing: '0.012em', wordSpacing: '0.035em' }}>
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={`${pageNumber}-${lineIndex}`} aria-hidden="true" className="h-3 sm:h-4" />;

        const marginal = noteIndices.has(lineIndex);
        const anchor = anchorByPageLine.get(`${pageNumber}:${lineIndex}`);
        const content = anchor ? (
          <span id={anchor.id} className={`scroll-mt-28 ${anchor.kind === 'chapter' || anchor.kind === 'schedule' ? 'font-bold text-emerald-950' : ''}`}>
            {line}
          </span>
        ) : line;

        return (
          <div key={`${pageNumber}-${lineIndex}`} className={`grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-7 ${structuralLinePattern.test(trimmed) ? 'pt-2' : ''}`}>
            <p className={`min-w-0 whitespace-pre-wrap break-words ${marginal ? 'sm:invisible' : ''}`}>{marginal ? '' : content}</p>
            {marginal && (
              <aside className="-mx-1 my-1 min-w-0 rounded border-l-4 border-yellow-400/80 bg-yellow-50 px-3 py-2 text-[12px] font-semibold leading-5 text-emerald-950/75 sm:mx-0 sm:my-0 sm:rounded-none sm:border-l-2 sm:bg-transparent sm:py-0.5">
                {line}
              </aside>
            )}
          </div>
        );
      })}
    </div>
  );
};

const buildStructure = (pages: ConstitutionPage[], documentId: string) => {
  const chapters: ConstitutionChapter[] = [];
  const schedules: ConstitutionSchedule[] = [];
  const sections = new Map<string, ConstitutionSection>();
  let currentChapter: ConstitutionChapter | undefined;
  let currentPart: { label: string; title: string; sections: ConstitutionSection[] } | undefined;
  const rulesBodyPage = documentId.startsWith('rules-')
    ? pages.find((page) => /^\s*S\.?\s*I\.?\s*No\.?\s*\d+\s+of\s+\d+/im.test(page.text))?.pageNumber
    : undefined;

  for (const page of pages) {
    const arrangementPage = isArrangementPage(page.text);
    const lines = page.text.split(/\r?\n/);
    lines.forEach((rawLine, index) => {
      const line = rawLine.trim();
      if (!line) return;

      const scheduleMatch = line.match(schedulePattern);
      if (scheduleMatch) {
        const id = `${documentId}-${slugify(scheduleMatch[1])}-schedule`;
        const scheduleTitle = scheduleMatch[2]?.trim().replace(/^[—:-]\s*/, '') || nextNonEmptyLine(lines, index);
        const existingSchedule = schedules.find((schedule) => schedule.id === id);
        if (existingSchedule && page.pageNumber > existingSchedule.pageNumber) {
          existingSchedule.title = scheduleTitle;
          existingSchedule.pageNumber = page.pageNumber;
          existingSchedule.lineIndex = index;
        }
        if (!schedules.some((schedule) => schedule.id === id)) {
          schedules.push({
            id,
            label: `${scheduleMatch[1]} Schedule`,
            title: scheduleTitle,
            pageNumber: page.pageNumber,
            lineIndex: index,
          });
        }
        return;
      }

      const chapterMatch = line.match(chapterPattern);
      const orderMatch = line.match(orderHeadingPattern);
      const headingMatch = chapterMatch || orderMatch;
      if (headingMatch) {
        if (orderMatch && (arrangementPage || (rulesBodyPage && page.pageNumber < rulesBodyPage))) return;
        const orderTitle = orderMatch?.[2]?.trim().replace(/^[—:-]\s*/, '') ?? '';
        const heading = chapterMatch ? headingMatch[0].trim() : `ORDER ${normalizeOrderToken(orderMatch![1])}`;
        const chapterId = `${documentId}-${slugify(heading)}`;
        if (!chapters.some((chapter) => chapter.id === chapterId)) {
          currentChapter = {
            id: chapterId,
            label: chapterMatch ? `Chapter ${chapterMatch[1]}` : heading,
            title: chapterMatch ? nextNonEmptyLine(lines, index) : orderTitle,
            pageNumber: page.pageNumber,
            lineIndex: index,
            parts: [],
          };
          chapters.push(currentChapter);
        } else {
          currentChapter = chapters.find((chapter) => chapter.id === chapterId);
        }
        currentPart = undefined;
        return;
      }

      if (!currentChapter) return;

      const partMatch = line.match(partPattern);
      if (partMatch) {
        const partLabel = `Part ${partMatch[1]}`;
        currentPart = currentChapter.parts.find((part) => part.label === partLabel);
        if (!currentPart) {
          currentPart = { label: partLabel, title: nextNonEmptyLine(lines, index), sections: [] };
          currentChapter.parts.push(currentPart);
        }
        return;
      }

      const sectionMatch = line.match(sectionPattern);
      if (!sectionMatch) return;
      const number = sectionMatch[1];
      const id = `${documentId}-section-${slugify(number)}`;
      if (sections.has(id)) return;
      const section = {
        id,
        number,
        heading: sectionMatch[2].trim(),
        pageNumber: page.pageNumber,
        lineIndex: index,
        chapter: currentChapter.label,
        part: currentPart?.label,
      };
      sections.set(id, section);
      if (currentPart) currentPart.sections.push(section);
      else {
        const unassignedPart = currentChapter.parts.find((part) => part.label === 'General');
        const part = unassignedPart ?? { label: 'General', title: '', sections: [] };
        if (!unassignedPart) currentChapter.parts.push(part);
        part.sections.push(section);
      }
    });
  }

  chapters.sort((left, right) => left.pageNumber - right.pageNumber || left.lineIndex - right.lineIndex);
  schedules.sort((left, right) => left.pageNumber - right.pageNumber || left.lineIndex - right.lineIndex);

  return { chapters, schedules, sections: [...sections.values()] };
};

const getSectionIdFromHash = () => {
  if (typeof window === 'undefined') return '';
  return window.location.hash.replace(/^#/, '');
};

export const LegalDocumentReader: React.FC<LegalDocumentReaderProps> = ({
  documentText,
  title = 'THE CONSTITUTION OF THE FEDERAL REPUBLIC OF NIGERIA 1999',
  documentLabel = 'Official source text',
  documentId = 'constitution',
  backPath = '/nigerian-laws/federation',
  documentPath,
  pageCount,
  initialSectionId,
}) => {
  const isConstitutionDocument = documentId === 'constitution' || documentId === 'const-1999';
  const pages = useMemo(
    () => parsePages(documentText).filter((page) => !isConstitutionDocument || (page.pageNumber > 5 && page.text.trim().length > 0)),
    [documentText, isConstitutionDocument],
  );
  const structure = useMemo(() => buildStructure(pages, documentId), [documentId, pages]);
  const isRulesDocument = documentId.startsWith('rules-');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<ReadingTheme>('light');
  const [fontScale, setFontScale] = useState(1);
  const [tocOpen, setTocOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<string[]>(structure.chapters.slice(0, 1).map((chapter) => chapter.id));
  const startPage = isConstitutionDocument ? (pages[0]?.pageNumber ?? 1) : 1;
  const [activePage, setActivePage] = useState(startPage);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const initialVisiblePages = useMemo(
    () => new Set(pages.filter((page) => Math.abs(page.pageNumber - startPage) <= 1).map((page) => page.pageNumber)),
    [pages, startPage],
  );
  const [visiblePages, setVisiblePages] = useState<Set<number>>(initialVisiblePages);
  const pageRefs = useRef<Record<number, HTMLElement | null>>({});
  const anchorByPageLine = useMemo(() => {
    const anchors = new Map<string, { id: string; kind: 'chapter' | 'schedule' | 'section' }>();
    structure.chapters.forEach((chapter) => anchors.set(`${chapter.pageNumber}:${chapter.lineIndex}`, { id: chapter.id, kind: 'chapter' }));
    structure.schedules.forEach((schedule) => anchors.set(`${schedule.pageNumber}:${schedule.lineIndex}`, { id: schedule.id, kind: 'schedule' }));
    structure.sections.forEach((section) => anchors.set(`${section.pageNumber}:${section.lineIndex}`, { id: section.id, kind: 'section' }));
    return anchors;
  }, [structure]);

  useEffect(() => {
    setVisiblePages(initialVisiblePages);
  }, [initialVisiblePages]);

  const goToPage = (pageNumber: number, anchorId?: string) => {
    setActivePage(pageNumber);
    setTocOpen(false);
    setVisiblePages((current) => {
      const next = new Set(current);
      pages
        .filter((page) => Math.abs(page.pageNumber - pageNumber) <= 1)
        .forEach((page) => next.add(page.pageNumber));
      return next;
    });
    window.setTimeout(() => {
      const target = anchorId ? document.getElementById(anchorId) : pageRefs.current[pageNumber];
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const goToChapter = (chapter: ConstitutionChapter) => {
    window.history.replaceState(null, '', `#${chapter.id}`);
    goToPage(chapter.pageNumber, chapter.id);
    setExpandedChapters((current) => current.includes(chapter.id) ? current : [...current, chapter.id]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top))[0];
        if (!visibleEntry) return;

        const pageNumber = Number(visibleEntry.target.getAttribute('data-page-number'));
        if (!pageNumber) return;
        setActivePage(pageNumber);
        setVisiblePages((current) => {
          const next = new Set(current);
          pages
            .filter((page) => Math.abs(page.pageNumber - pageNumber) <= 1)
            .forEach((page) => next.add(page.pageNumber));
          return next;
        });
      },
      { rootMargin: '520px 0px', threshold: 0.01 },
    );

    Object.values(pageRefs.current).forEach((page) => {
      if (page) observer.observe(page);
    });

    return () => observer.disconnect();
  }, [pages]);

  useEffect(() => {
    const storedScale = window.localStorage.getItem('constitution-font-scale');
    const storedTheme = window.localStorage.getItem('constitution-theme') as ReadingTheme | null;
    if (storedScale) setFontScale(Number(storedScale));
    if (storedTheme === 'light' || storedTheme === 'sepia' || storedTheme === 'dark') setTheme(storedTheme);
    const target = initialSectionId || getSectionIdFromHash();
    if (target) {
      const section = structure.sections.find((item) => item.id === target || item.id === `${documentId}-${target}`);
      const chapter = structure.chapters.find((item) => item.id === target || item.id === `${documentId}-${target}`);
      const schedule = structure.schedules.find((item) => item.id === target || item.id === `${documentId}-${target}`);
      if (section) window.setTimeout(() => goToPage(section.pageNumber, section.id), 0);
      else if (chapter) window.setTimeout(() => goToChapter(chapter), 0);
      else if (schedule) window.setTimeout(() => goToSchedule(schedule), 0);
    }
  }, [documentId, initialSectionId, structure.sections, structure.chapters, structure.schedules]);

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem('constitution-bookmarks') || '[]') as string[];
    setBookmarked(saved.includes(getSectionIdFromHash()));
  }, []);

  const goToSection = (section: ConstitutionSection) => {
    window.history.replaceState(null, '', `#${section.id}`);
    setBookmarked(JSON.parse(window.localStorage.getItem('constitution-bookmarks') || '[]').includes(section.id));
    goToPage(section.pageNumber, section.id);
  };

  const goToSchedule = (schedule: ConstitutionSchedule) => {
    window.history.replaceState(null, '', `#${schedule.id}`);
    goToPage(schedule.pageNumber, schedule.id);
  };

  const toggleBookmark = () => {
    const section = structure.sections.find((item) => item.pageNumber === activePage);
    if (!section) return;
    const bookmarks = JSON.parse(window.localStorage.getItem('constitution-bookmarks') || '[]') as string[];
    const next = bookmarks.includes(section.id) ? bookmarks.filter((item) => item !== section.id) : [...bookmarks, section.id];
    window.localStorage.setItem('constitution-bookmarks', JSON.stringify(next));
    window.history.replaceState(null, '', `#${section.id}`);
    setBookmarked(next.includes(section.id));
  };

  const copyPage = async () => {
    const page = pages.find((item) => item.pageNumber === activePage);
    if (!page) return;
    await navigator.clipboard.writeText(page.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const shareReader = async () => {
    if (navigator.share) await navigator.share({ title: 'Constitution of the Federal Republic of Nigeria', url: window.location.href });
    else await navigator.clipboard.writeText(window.location.href);
  };

  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return pages
      .map((page) => {
        const haystack = page.text.toLowerCase();
        const index = haystack.indexOf(needle);
        if (index < 0) return null;
        const start = Math.max(0, index - 90);
        const end = Math.min(page.text.length, index + needle.length + 150);
        return { pageNumber: page.pageNumber, snippet: page.text.slice(start, end).replace(/\s+/g, ' ') };
      })
      .filter((result): result is { pageNumber: number; snippet: string } => Boolean(result))
      .slice(0, 40);
  }, [pages, query]);

  const themeClass = theme === 'dark' ? 'bg-neutral-950 text-neutral-100' : theme === 'sepia' ? 'bg-[#f4eddf] text-[#30271d]' : 'bg-[#f5f7f5] text-neutral-950';
  const pageClass = theme === 'dark' ? 'border-neutral-800 bg-neutral-900 text-neutral-100' : theme === 'sepia' ? 'border-[#d8cbb4] bg-[#fbf5e9] text-[#30271d]' : 'border-neutral-200 bg-white text-neutral-950';
  return (
    <main className={`min-h-[100dvh] overflow-x-hidden ${themeClass}`} style={{ fontFamily: uiFont }}>
      <header className="border-b border-emerald-950/20 bg-[#123b2a] text-white print:bg-white print:text-black">
        <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <Link to={backPath} className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200 hover:text-white print:hidden">
                Back to library
              </Link>
              <h1 className="mt-3 max-w-4xl text-2xl font-black leading-tight sm:text-4xl">{title}</h1>
              <p className="mt-2 text-sm text-emerald-100">{documentLabel}</p>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button type="button" onClick={() => setTocOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-200/40 px-3 text-xs font-bold lg:hidden"><Menu className="h-4 w-4" /> Contents</button>
              {documentPath && <a href={documentPath} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-3 text-xs font-bold text-emerald-950"><FileText className="h-4 w-4" /> Source PDF <ExternalLink className="h-3.5 w-3.5" /></a>}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1680px] gap-0 px-0 py-4 sm:px-4 sm:py-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className={`${tocOpen ? 'fixed inset-0 z-20 block bg-black/40 p-4' : 'hidden'} lg:static lg:block lg:bg-transparent lg:p-0 print:hidden`}>
          <div className={`${tocOpen ? 'h-full max-w-sm overflow-y-auto bg-[#f3f7ef] p-5 shadow-xl' : ''} sticky top-5 border-r border-emerald-900/10 bg-[#f3f7ef] lg:h-[calc(100dvh-2rem)] lg:overflow-y-auto lg:overscroll-contain`}>
            <div className="flex items-center justify-between border-b border-emerald-900/20 pb-3">
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-900">Contents</h2>
              <button type="button" onClick={() => setTocOpen(false)} className="rounded p-1 lg:hidden" aria-label="Close contents"><X className="h-4 w-4" /></button>
            </div>
            <nav aria-label={`${title} table of contents`} className="mt-3 space-y-1">
              <button type="button" onClick={() => goToPage(startPage)} className="w-full rounded px-2 py-2 text-left text-sm font-bold hover:bg-emerald-50">{isConstitutionDocument ? 'Preamble' : 'Document start'}</button>
              {isRulesDocument && structure.chapters.length > 0 && (
                <div className="border-y border-emerald-900/15 py-3">
                  <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-900">Orders</p>
                  <div className="space-y-0.5">
                    {structure.chapters.map((chapter) => {
                      const expanded = expandedChapters.includes(chapter.id);
                      return (
                        <div key={chapter.id}>
                          <button type="button" onClick={() => goToChapter(chapter)} className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm font-black hover:bg-emerald-50" title={`Go to ${chapter.label}`}>
                            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            <span>{chapter.label}</span>
                          </button>
                          {expanded && <div className="ml-3 border-l border-emerald-900/20 pl-2">
                            <button type="button" onClick={() => goToPage(chapter.pageNumber, chapter.id)} className="w-full px-2 py-1.5 text-left text-xs text-neutral-600 hover:text-emerald-800">{chapter.title || chapter.label}</button>
                            {chapter.parts.map((part) => <div key={`${chapter.id}-${part.label}`}>
                              {part.title && <p className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-800">{part.label} - {part.title}</p>}
                              {part.sections.map((section) => <button key={section.id} type="button" onClick={() => goToSection(section)} className="block w-full truncate px-2 py-1.5 text-left text-xs text-neutral-600 hover:text-emerald-800">{section.number}. {section.heading}</button>)}
                            </div>)}
                          </div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {!isRulesDocument && structure.schedules.length > 0 && (
                <div className="border-y border-emerald-900/15 py-3">
                  <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-900">Schedules</p>
                  <div className="space-y-0.5">
                    {structure.schedules.map((schedule) => (
                      <button key={schedule.id} type="button" onClick={() => goToSchedule(schedule)} className="block w-full whitespace-normal break-words rounded px-2 py-1.5 text-left text-xs font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900" title={`${schedule.label}${schedule.title ? ` - ${schedule.title}` : ''}`}>
                        {schedule.label}{schedule.title ? ` - ${schedule.title}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!isRulesDocument && structure.chapters.map((chapter) => {
                const expanded = expandedChapters.includes(chapter.id);
                return (
                  <div key={chapter.id}>
                    <button type="button" onClick={() => goToChapter(chapter)} className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm font-black hover:bg-emerald-50">
                      {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      <span>{chapter.label}</span>
                    </button>
                    {expanded && <div className="ml-3 border-l border-emerald-900/20 pl-2">
                      <button type="button" onClick={() => goToPage(chapter.pageNumber)} className="w-full px-2 py-1.5 text-left text-xs text-neutral-600 hover:text-emerald-800">{chapter.title}</button>
                      {chapter.parts.map((part) => <div key={`${chapter.id}-${part.label}`}>
                        {part.title && <p className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-800">{part.label} - {part.title}</p>}
                        {part.sections.map((section) => <button key={section.id} type="button" onClick={() => goToSection(section)} className="block w-full truncate px-2 py-1.5 text-left text-xs text-neutral-600 hover:text-emerald-800">{section.number}. {section.heading}</button>)}
                      </div>)}
                    </div>}
                  </div>
                );
              })}
              {isRulesDocument && structure.schedules.length > 0 && (
                <div className="border-y border-emerald-900/15 py-3">
                  <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-900">Schedules</p>
                  <div className="space-y-0.5">
                    {structure.schedules.map((schedule) => (
                      <button key={schedule.id} type="button" onClick={() => goToSchedule(schedule)} className="block w-full whitespace-normal break-words rounded px-2 py-1.5 text-left text-xs font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900" title={`${schedule.label}${schedule.title ? ` - ${schedule.title}` : ''}`}>
                        {schedule.label}{schedule.title ? ` - ${schedule.title}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 bg-white">
          <div className="sticky top-0 z-10 mb-4 border-b border-emerald-900/15 bg-white px-3 py-3 print:hidden sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full min-w-0 basis-full sm:min-w-[220px] sm:flex-1 sm:basis-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-800" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title}`} aria-label={`Search ${title}`} className="h-10 w-full rounded-lg border border-emerald-900/20 bg-white pl-9 pr-3 text-sm text-neutral-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
              </div>
              <button type="button" onClick={() => setFontScale((scale) => { const next = Math.max(0.9, Number((scale - 0.1).toFixed(1))); window.localStorage.setItem('constitution-font-scale', String(next)); return next; })} className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg border border-emerald-900/20 bg-white px-3 text-xs font-bold text-neutral-800" aria-label="Decrease text size"><Minus className="h-3.5 w-3.5" /> A</button>
              <button type="button" onClick={() => setFontScale((scale) => { const next = Math.min(1.3, Number((scale + 0.1).toFixed(1))); window.localStorage.setItem('constitution-font-scale', String(next)); return next; })} className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg border border-emerald-900/20 bg-white px-3 text-xs font-bold text-neutral-800" aria-label="Increase text size">A <Plus className="h-3.5 w-3.5" /></button>
              <select value={theme} onChange={(event) => { const next = event.target.value as ReadingTheme; setTheme(next); window.localStorage.setItem('constitution-theme', next); }} aria-label="Reading theme" className="h-10 rounded-lg border border-emerald-900/20 bg-white px-3 text-xs font-bold text-neutral-800"><option value="light">Light</option><option value="sepia">Sepia</option><option value="dark">Dark</option></select>
              <button type="button" onClick={toggleBookmark} className={`inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg border px-3 text-xs font-bold ${bookmarked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-emerald-900/20 bg-white text-neutral-800'}`}><Bookmark className="h-3.5 w-3.5" /> {bookmarked ? 'Saved' : 'Save'}</button>
              <button type="button" onClick={copyPage} className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg border border-emerald-900/20 bg-white px-3 text-xs font-bold text-neutral-800"><Copy className="h-3.5 w-3.5" /> {copied ? 'Copied' : 'Copy'}</button>
              <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg border border-emerald-900/20 bg-white px-3 text-xs font-bold text-neutral-800"><Printer className="h-3.5 w-3.5" /> Print</button>
              <button type="button" onClick={shareReader} className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg border border-emerald-900/20 bg-white px-3 text-xs font-bold text-neutral-800"><Share2 className="h-3.5 w-3.5" /> Share</button>
            </div>
          </div>

          {query.trim() && <div className="mb-5 border-l-2 border-emerald-700 bg-emerald-50 p-4 print:hidden"><p className="text-xs font-black uppercase tracking-wider text-emerald-900">{searchResults.length} matching page{searchResults.length === 1 ? '' : 's'}</p>{searchResults.length > 0 ? <div className="mt-3 space-y-2">{searchResults.map((result) => <button key={result.pageNumber} type="button" onClick={() => goToPage(result.pageNumber)} className="block w-full text-left text-xs leading-5 text-neutral-700 hover:text-emerald-900"><span className="font-black text-emerald-800">PDF page {result.pageNumber}</span> - {result.snippet}</button>)}</div> : <p className="mt-2 text-sm text-neutral-700">No matching text was found in the source document.</p>}</div>}

          <div className="space-y-4 px-1 pb-6 sm:px-5">
            {pages.map((page) => {
              const isVisible = visiblePages.has(page.pageNumber);
              return (
                <article
                  key={page.pageNumber}
                  ref={(element) => { pageRefs.current[page.pageNumber] = element; }}
                  id={`${documentId}-page-${page.pageNumber}`}
                  data-page-number={page.pageNumber}
                  className={`scroll-mt-24 min-w-0 overflow-hidden border px-3 py-5 shadow-[0_12px_35px_-30px_rgba(15,23,42,0.5)] sm:px-10 sm:py-9 lg:px-14 ${pageClass} ${isVisible ? '' : 'min-h-[30rem] sm:min-h-[42rem]'}`}
                >
                  <div className="mb-5 flex items-center justify-between border-b border-current/10 pb-3 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-800">
                    <span>Source document text</span>
                    <span>PDF page {page.pageNumber}{pageCount ? ` of ${pageCount}` : ''}</span>
                  </div>
                  {isVisible ? (
                    <LegalPageText text={page.text} pageNumber={page.pageNumber} fontScale={fontScale} anchorByPageLine={anchorByPageLine} />
                  ) : (
                    <div aria-hidden="true" className="h-72 animate-pulse rounded bg-emerald-950/[0.03] sm:h-[30rem]" />
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export const ConstitutionReader = LegalDocumentReader;
