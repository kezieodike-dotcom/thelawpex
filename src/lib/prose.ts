import { escapeHtml } from './copyToWord';

/**
 * The article bodies stored in LAWPEX use a deliberately small subset of Markdown:
 * `## ` for a heading, `- ` for a bullet, `**bold**` inline, and a blank line between
 * blocks. This module is the single place that knows how to read it.
 */

export type ProseBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'paragraph'; text: string };

/** Splits a markdown-lite body into the blocks a reader sees. */
export function parseProse(body: string): ProseBlock[] {
  const blocks: ProseBlock[] = [];

  for (const chunk of body.split(/\n{2,}/)) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('## ')) {
      blocks.push({ kind: 'heading', text: trimmed.slice(3).trim() });
      continue;
    }

    const lines = trimmed.split('\n');
    if (lines.every((line) => line.trimStart().startsWith('- '))) {
      blocks.push({ kind: 'bullets', items: lines.map((line) => line.trimStart().slice(2)) });
      continue;
    }

    blocks.push({ kind: 'paragraph', text: lines.join(' ') });
  }

  return blocks;
}

/** Splits a line into plain and bold runs so `**emphasis**` survives into the page. */
export function parseInline(text: string): { text: string; bold: boolean }[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false },
    );
}

const inlineToHtml = (text: string): string =>
  parseInline(text)
    .map((run) => (run.bold ? `<strong>${escapeHtml(run.text)}</strong>` : escapeHtml(run.text)))
    .join('');

/** Renders a markdown-lite body as the HTML that MS Word reads best. */
export function proseToWordHtml(title: string, subtitle: string, body: string): string {
  const rendered = parseProse(body)
    .map((block) => {
      if (block.kind === 'heading') return `<h3>${escapeHtml(block.text)}</h3>`;
      if (block.kind === 'bullets')
        return `<ul>${block.items.map((item) => `<li>${inlineToHtml(item)}</li>`).join('')}</ul>`;
      return `<p>${inlineToHtml(block.text)}</p>`;
    })
    .join('');

  return `<h2>${escapeHtml(title)}</h2>${
    subtitle ? `<p class="citation">${escapeHtml(subtitle)}</p>` : ''
  }${rendered}`;
}
