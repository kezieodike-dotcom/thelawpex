/**
 * Clipboard and download helpers for getting legal text out of LAWPEX and into MS Word
 * with its formatting intact.
 *
 * Writing `text/html` to the clipboard (rather than plain text) is what lets Word keep
 * headings, bold text and paragraph breaks when the user pastes.
 */

const WORD_DOCUMENT = (body: string) => `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.6; color: #000; }
      h1 { font-size: 16pt; } h2 { font-size: 14pt; } h3 { font-size: 12.5pt; }
      .citation { font-style: italic; }
      li { margin-bottom: 8pt; }
    </style>
  </head>
  <body>${body}</body>
</html>`;

/** Strips tags so the plain-text clipboard flavour stays readable. */
const toPlainText = (html: string): string =>
  html
    .replace(/<\s*(br|\/p|\/li|\/h[1-6]|\/div)\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/**
 * Copies `html` to the clipboard in a Word-friendly form.
 * Falls back to plain text where the rich clipboard API is unavailable.
 */
export async function copyToWord(html: string): Promise<boolean> {
  const document = WORD_DOCUMENT(html);
  const plain = toPlainText(html);

  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([document], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        }),
      ]);
      return true;
    }

    await navigator.clipboard.writeText(plain);
    return true;
  } catch {
    try {
      await navigator.clipboard.writeText(plain);
      return true;
    } catch {
      return false;
    }
  }
}

/** Downloads `html` as a .doc file that opens directly in MS Word. */
export function downloadAsWord(html: string, filename: string): void {
  const blob = new Blob([WORD_DOCUMENT(html)], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/[^\w\-. ]+/g, '').trim() || 'lawpex-document';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Escapes text so it can be dropped into the Word HTML without breaking it. */
export const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Turns a court process typed as plain text into Word markup, keeping the line breaks
 * and the leading indentation that give a court process its shape on the page.
 */
export function buildWordDraft(title: string, subtitle: string, text: string): string {
  const body = text
    .split('\n')
    .map((line) => {
      const indent = line.match(/^ */)?.[0].length ?? 0;
      const content = escapeHtml(line.trimStart());
      if (!content) return '<p>&nbsp;</p>';
      return `<p style="margin:0 0 6pt 0">${'&nbsp;'.repeat(indent)}${content}</p>`;
    })
    .join('');

  return `<h2>${escapeHtml(title)}</h2>${
    subtitle ? `<p class="citation">${escapeHtml(subtitle)}</p>` : ''
  }<div style="font-family:'Times New Roman',serif">${body}</div>`;
}

/** Wraps a titled list of paragraphs in the markup Word renders best. */
export function buildWordSection(title: string, subtitle: string, blocks: string[]): string {
  const body = blocks.map((block) => `<p>${block}</p>`).join('');
  return `<h2>${title}</h2>${subtitle ? `<p class="citation">${subtitle}</p>` : ''}${body}`;
}

/** Wraps a numbered list of principles in the markup Word renders best. */
export function buildWordList(title: string, subtitle: string, items: string[]): string {
  const body = items.map((item) => `<li>${item}</li>`).join('');
  return `<h2>${title}</h2>${subtitle ? `<p class="citation">${subtitle}</p>` : ''}<ol>${body}</ol>`;
}
