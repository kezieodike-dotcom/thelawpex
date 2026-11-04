import React, { useMemo } from 'react';

type LegalAnchor = { id: string; kind: 'chapter' | 'schedule' | 'section' };
export interface SourceLegalLine {
  index: number; x: number; y: number; height: number; side: 'body' | 'left' | 'right';
}
export interface SourceLegalPage { textHash: string; lines: SourceLegalLine[]; coverage?: number }
export interface SourceLegalDocument { version: number; sourceSha256: string; pages: Record<string, SourceLegalPage> }
const EMPTY_ANCHORS = new Map<string, LegalAnchor>();
const legalTextFont = '"Source Serif 4", "Book Antiqua", "Palatino Linotype", Georgia, serif';
const structuralLine = /^(?:\d{1,3}[.)]|\d{1,3}\s*[-\u2014]|\([a-z0-9]+\)|ORDER\b|ORUER\b|ORDLR\b|CHAPTER\b|PART\b|FORM\s+\d+)/i;

export function hashLegalText(text: string) {
  let value = 2166136261;
  for (const byte of new TextEncoder().encode(text.replace(/\r\n?/g, '\n'))) value = Math.imul(value ^ byte, 16777619) >>> 0;
  return value.toString(16).padStart(8, '0');
}

interface LegalTextBlock { indices: number[]; heading: boolean; y: number; left: number[][]; right: number[][] }

function buildBlocks(text: string, pageNumber: number, anchors: Map<string, LegalAnchor>, layout?: SourceLegalPage) {
  const lines = text.split(/\r?\n/);
  const nonempty = lines.flatMap((line, index) => line.trim() ? [index] : []);
  const sourceIndices = new Set(nonempty);
  const valid = Boolean(layout && Array.isArray(layout.lines) && layout.textHash === hashLegalText(text)
    && layout.lines.length === nonempty.length && new Set(layout.lines.map(line => line.index)).size === nonempty.length
    && layout.lines.every(line => sourceIndices.has(line.index) && ['body', 'left', 'right'].includes(line.side)
      && Number.isFinite(line.x) && Number.isFinite(line.y) && Number.isFinite(line.height) && line.height > 0));
  const positions = new Map(valid ? layout!.lines.map(line => [line.index, line]) : []);
  const body = nonempty.filter(index => !valid || positions.get(index)?.side === 'body' || anchors.has(`${pageNumber}:${index}`));
  const blocks: LegalTextBlock[] = [];
  let current: LegalTextBlock | undefined;
  let previous: number | undefined;
  for (const index of body) {
    const value = lines[index].trim();
    const position = positions.get(index);
    const previousPosition = previous === undefined ? undefined : positions.get(previous);
    const anchor = anchors.get(`${pageNumber}:${index}`);
    const heading = Boolean(anchor && anchor.kind !== 'section') || (/[A-Z]/.test(value) && value === value.toUpperCase());
    const blank = previous !== undefined && lines.slice(previous + 1, index).some(line => !line.trim());
    const sourceGap = position && previousPosition && position.y >= 0 && previousPosition.y >= 0
      && position.y - previousPosition.y > previousPosition.height * 1.45;
    const sourceIndent = position && previousPosition && position.y > previousPosition.y
      && position.x - previousPosition.x > previousPosition.height * 1.25;
    if (!current || structuralLine.test(value) || anchor || heading !== current.heading || blank || sourceGap || sourceIndent) {
      current = { indices: [], heading, y: position?.y ?? -1, left: [], right: [] };
      blocks.push(current);
    }
    current.indices.push(index);
    previous = index;
  }
  if (valid) {
    for (const side of ['left', 'right'] as const) {
      const notes = layout!.lines.filter(line => line.side === side && !anchors.has(`${pageNumber}:${line.index}`)).sort((a, b) => a.y - b.y || a.x - b.x);
      const groups: SourceLegalLine[][] = [];
      for (const note of notes) {
        const group = groups.at(-1);
        const last = group?.at(-1);
        if (!last || note.y - last.y > last.height * 1.6) groups.push([note]);
        else group!.push(note);
      }
      for (const group of groups) {
        const target = blocks.filter(block => block.y >= 0).reduce<LegalTextBlock | undefined>((best, block) =>
          !best || Math.abs(block.y - group[0].y) < Math.abs(best.y - group[0].y) ? block : best, undefined);
        if (target) target[side].push(group.map(line => line.index));
        else {
          // Keep annotations visible even on pages without a located main paragraph.
          blocks.push({ indices: [], heading: false, y: group[0].y, left: side === 'left' ? [group.map(line => line.index)] : [], right: side === 'right' ? [group.map(line => line.index)] : [] });
        }
      }
    }
  }
  return { lines, blocks, valid };
}

export const LegalPageText: React.FC<{
  text: string;
  pageNumber: number;
  fontScale?: number;
  anchorByPageLine?: Map<string, LegalAnchor>;
  sourceLayout?: SourceLegalPage;
}> = ({ text, pageNumber, fontScale = 1, anchorByPageLine = EMPTY_ANCHORS, sourceLayout }) => {
  const { lines, blocks, valid } = useMemo(() => buildBlocks(text, pageNumber, anchorByPageLine, sourceLayout), [text, pageNumber, anchorByPageLine, sourceLayout]);
  const hasLeft = blocks.some(block => block.left.length);
  const hasRight = blocks.some(block => block.right.length);
  const columns = hasLeft && hasRight ? 'xl:grid-cols-[8rem_minmax(0,1fr)_8rem]' : hasLeft ? 'xl:grid-cols-[8rem_minmax(0,1fr)]' : hasRight ? 'xl:grid-cols-[minmax(0,1fr)_8rem]' : '';
  return <div data-legal-text="" data-source-layout={valid ? 'true' : undefined} className="space-y-6 break-words leading-[1.85]" style={{ fontFamily: legalTextFont, fontSize: `${17 * fontScale}px`, letterSpacing: 0 }}>
    {blocks.map((block, index) => {
      const content = block.indices.map(line => lines[line].trim()).join(' ');
      const anchor = anchorByPageLine.get(`${pageNumber}:${block.indices[0]}`);
      return <div key={`${pageNumber}-${index}`} data-source-block={index} className={`grid min-w-0 grid-cols-1 items-start gap-3 xl:gap-x-7 ${columns}`}>
        {block.indices.length > 0 && <p data-legal-paragraph="" id={anchor?.id} className={`min-w-0 scroll-mt-28 ${hasLeft ? 'xl:col-start-2' : 'xl:col-start-1'} xl:row-start-1 ${block.heading ? 'pt-2 font-bold' : ''}`} style={!block.heading && valid ? { paddingLeft: /^\([a-z0-9]+\)/i.test(content) ? '1.25em' : undefined, textIndent: /^\([a-z0-9]+\)/i.test(content) ? '-0.75em' : '1.25em' } : undefined}>{content}</p>}
        {(['left', 'right'] as const).map(side => block[side].length ? <div key={side} className={`min-w-0 space-y-4 xl:row-start-1 ${side === 'left' ? 'xl:col-start-1' : hasLeft && hasRight ? 'xl:col-start-3' : 'xl:col-start-2'}`}>
          {block[side].map((note, noteIndex) => <aside key={noteIndex} data-source-note-side={side} aria-label={`Source ${side} margin note`} className="border-l-2 border-yellow-400 bg-yellow-50 px-3 py-2 text-[13px] font-normal leading-6 text-neutral-700 xl:border-neutral-200 xl:bg-transparent xl:py-0">
            <span className="mb-1 block font-sans text-[10px] font-semibold uppercase text-yellow-800 xl:hidden">Marginal note</span>
            {note.map(line => lines[line].trim()).join(' ')}
          </aside>)}
        </div> : null)}
      </div>;
    })}
  </div>;
};
