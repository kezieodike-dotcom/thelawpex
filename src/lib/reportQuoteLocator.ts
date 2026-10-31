export interface CitationParagraph {
  pageNumber: number;
  label?: string;
  text: string;
  judge?: string;
}

// Ignore typography and scanned running headers, never substantive words.
export const normalizeQuoteText = (text: string) => text
  .replace(/AMAECHI\s+V\.?\s+INEC\s*&\s*ORS(?:\s+\d+\b)?/gi, '')
  .replace(/FAWEHINMI\s+V\.?\s+NBA\s*&\s*ORS\s*\(NO\s*2\)(?:\s+\d+\b)?/gi, '')
  .replace(/\(?Dissenting\)?["\s]*$/i, '')
  .toLowerCase().replace(/[^a-z0-9]/g, '');

export const createQuoteIndex = (paragraphs: CitationParagraph[]) => {
  let text = '';
  const ranges = paragraphs.map(paragraph => {
    const start = text.length;
    text += normalizeQuoteText(paragraph.text);
    return { start, end: text.length, paragraph };
  });
  return { text, ranges };
};

type QuoteIndex = ReturnType<typeof createQuoteIndex>;
type Boundary = { start: number; end: number; edits: number };

// Semi-global alignment is confined to an exact anchor's neighbourhood. It
// tolerates a few source transcription differences without guessing a location.
const alignBoundary = (needle: string, source: string, base: number): Boundary => {
  let costs = new Uint16Array(source.length + 1);
  let starts = Uint16Array.from({ length: source.length + 1 }, (_, i) => i);
  for (let i = 1; i <= needle.length; i++) {
    const nextCosts = new Uint16Array(source.length + 1);
    const nextStarts = new Uint16Array(source.length + 1);
    nextCosts[0] = i;
    for (let j = 1; j <= source.length; j++) {
      const diagonal = costs[j - 1] + Number(needle[i - 1] !== source[j - 1]);
      const deletion = costs[j] + 1;
      const insertion = nextCosts[j - 1] + 1;
      const best = Math.min(diagonal, deletion, insertion);
      nextCosts[j] = best;
      nextStarts[j] = best === diagonal ? starts[j - 1] : best === deletion ? starts[j] : nextStarts[j - 1];
    }
    costs = nextCosts;
    starts = nextStarts;
  }
  let end = 0;
  for (let i = 1; i < costs.length; i++) if (costs[i] < costs[end]) end = i;
  return { start: base + starts[end], end: base + end, edits: costs[end] };
};

const locateBoundary = (text: string, needle: string, from = 0, until = text.length): Boundary[] => {
  const exact: Boundary[] = [];
  let offset = text.indexOf(needle, from);
  while (offset >= 0 && offset + needle.length <= until) {
    exact.push({ start: offset, end: offset + needle.length, edits: 0 });
    offset = text.indexOf(needle, offset + 1);
  }
  if (exact.length || needle.length < 80) return exact;

  const matches: Boundary[] = [];
  const candidates = new Set<number>();
  for (const anchorStart of [0, 40, 80, needle.length - 32]) {
    const anchor = needle.slice(anchorStart, anchorStart + 32);
    let found = text.indexOf(anchor, from);
    while (found >= 0 && found < until) {
      const base = Math.max(from, found - anchorStart - 12);
      if (!candidates.has(base)) {
        candidates.add(base);
        const match = alignBoundary(needle, text.slice(base, Math.min(until, base + needle.length + 24)), base);
        if (match.edits <= 6 && !matches.some(m => Math.abs(m.start - match.start) < 12)) matches.push(match);
      }
      found = text.indexOf(anchor, found + 1);
    }
  }
  return matches;
};

const locateContinuousQuote = (index: QuoteIndex, quote: string) => {
  const needle = normalizeQuoteText(quote);
  if (needle.length < 32) return undefined;
  const boundaryLength = Math.min(160, needle.length);
  const openings = locateBoundary(index.text, needle.slice(0, boundaryLength));
  const candidates: Array<{ start: number; end: number; coverage: number; edits: number }> = [];
  for (const opening of openings) {
    const closings = locateBoundary(
      index.text, needle.slice(-boundaryLength), opening.start,
      Math.min(index.text.length, opening.start + Math.ceil(needle.length * 1.35) + 500),
    );
    for (const closing of closings) {
      const source = index.text.slice(opening.start, closing.end);
      if (source.length < needle.length * 0.85 || source.length > needle.length * 1.35 + 500) continue;
      let matched = 0;
      let windows = 0;
      let cursor = 0;
      for (let i = 0; i < needle.length; i += 32) {
        const window = needle.slice(i, i + 32);
        if (window.length < 16) continue;
        windows++;
        const found = source.indexOf(window, cursor);
        if (found >= 0) { matched++; cursor = found + window.length; }
      }
      let coverage = matched / windows;
      // One transcription error can invalidate a whole 32-character window in
      // a short quotation. Verify the complete bounded passage in that case.
      if (coverage < 0.90 && needle.length <= 400) {
        const aligned = alignBoundary(needle, source, 0);
        if (aligned.edits <= 1 && aligned.start === 0 && aligned.end === source.length) {
          coverage = (needle.length - aligned.edits) / needle.length;
        }
      }
      if (coverage >= 0.90) candidates.push({ start: opening.start, end: closing.end, coverage, edits: opening.edits + closing.edits });
    }
  }
  candidates.sort((a, b) => b.coverage - a.coverage || a.edits - b.edits);
  const match = candidates[0];
  if (!match) return undefined;
  // Ambiguous quotations require editorial review rather than an arbitrary page.
  if (candidates.some((other, i) => i > 0 && other.start !== match.start && other.coverage === match.coverage && other.edits === match.edits)) return undefined;
  const start = index.ranges.find(r => match.start >= r.start && match.start < r.end)?.paragraph;
  const end = index.ranges.find(r => match.end - 1 >= r.start && match.end - 1 < r.end)?.paragraph;
  return start && end ? { start, end, coverage: match.coverage, boundaryEdits: match.edits } : undefined;
};

export const locateReportQuote = (index: QuoteIndex, quote: string) => {
  const continuous = locateContinuousQuote(index, quote);
  if (continuous) return continuous;
  const segments = quote.split(/\.{3,}|\u2026/).map(normalizeQuoteText).filter(Boolean);
  if (segments.length < 2 || segments.some(segment => segment.length < 32)) return undefined;

  // Only explicit editorial ellipses permit gaps. Every remaining word must
  // match, in order, within a bounded passage in the same judicial opinion.
  const matches: Array<{ start: number; end: number }> = [];
  const visit = (part: number, from: number, start: number) => {
    if (matches.length > 1) return;
    if (part === segments.length) { matches.push({ start, end: from }); return; }
    let offset = index.text.indexOf(segments[part], from);
    const until = part === 0 ? index.text.length : from + 8000;
    while (offset >= 0 && offset <= until && matches.length <= 1) {
      visit(part + 1, offset + segments[part].length, part === 0 ? offset : start);
      offset = index.text.indexOf(segments[part], offset + 1);
    }
  };
  visit(0, 0, 0);
  if (matches.length !== 1) return undefined;
  const match = matches[0];
  const ranges = index.ranges.filter(range => range.end > match.start && range.start < match.end);
  const start = ranges[0]?.paragraph;
  const end = ranges[ranges.length - 1]?.paragraph;
  if (!start || !end || ranges.some(range => range.paragraph.judge !== start.judge)) return undefined;
  return { start, end, coverage: 1, boundaryEdits: 0 };
};
