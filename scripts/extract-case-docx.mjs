import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';
import { DOMParser } from '@xmldom/xmldom';

const sourceDirectory = process.argv[2] || 'C:/Users/USER/Downloads';
const outputDirectory = process.argv[3] || 'tmp/case-imports/december-source';
const sourceNames = process.argv.slice(4).length ? process.argv.slice(4) : [
  'ECHERE',
  'ELABANJO',
  'ELEGUSHI',
  'EMESPO J',
  'FAGBENRO V',
  'FASAKIN FOODS',
  'GBADAMOSI',
  'HELP',
  'IBAMA V',
  'IBIYEYE V',
  'IDEOZU',
  'IDERIMA V',
  'IFETA V',
  'IGABELE V',
  'UGOJI V',
];

if (!sourceNames.length) {
  throw new Error('Pass one or more DOCX basenames after the output directory.');
}

const localName = (node) => node?.localName || node?.nodeName?.split(':').at(-1);
const elementChildren = (node) => Array.from(node?.childNodes ?? []).filter(child => child.nodeType === 1);
const descendants = (node, name) => {
  const matches = [];
  const visit = (current) => {
    for (const child of elementChildren(current)) {
      if (localName(child) === name) matches.push(child);
      visit(child);
    }
  };
  visit(node);
  return matches;
};
const attr = (node, name) => node?.getAttribute(`w:${name}`) ?? node?.getAttribute(name) ?? '';

const paragraphText = (paragraph) => {
  let text = '';
  const breaks = [];
  const visit = (node) => {
    for (const child of Array.from(node?.childNodes ?? [])) {
      if (child.nodeType !== 1) continue;
      const name = localName(child);
      if (name === 't') text += child.textContent ?? '';
      else if (name === 'tab') text += '\t';
      else if (name === 'br') {
        const type = attr(child, 'type');
        breaks.push(type === 'page' ? 'page' : 'line');
        text += type === 'page' ? '\n\f\n' : '\n';
      } else if (name === 'lastRenderedPageBreak') {
        breaks.push('rendered-page');
        text += '\n\f\n';
      } else if (name !== 'del' && name !== 'delText') visit(child);
    }
  };
  visit(paragraph);
  return { text: text.replace(/\n{3,}/g, '\n\n').trim(), breaks };
};

const paragraphStyle = (paragraph) => {
  const style = descendants(paragraph, 'pStyle')[0];
  return attr(style, 'val') || 'Normal';
};

const tableRows = (table) => descendants(table, 'tr').map(row =>
  elementChildren(row)
    .filter(child => localName(child) === 'tc')
    .map(cell => descendants(cell, 'p').map(paragraph => paragraphText(paragraph).text).filter(Boolean).join('\n')),
);

await mkdir(outputDirectory, { recursive: true });

for (const sourceName of sourceNames) {
  const source = path.join(sourceDirectory, `${sourceName}.docx`);
  const zip = await JSZip.loadAsync(await readFile(source));
  const documentXml = await zip.file('word/document.xml')?.async('text');
  if (!documentXml) throw new Error(`${sourceName}: word/document.xml is missing`);

  const document = new DOMParser().parseFromString(documentXml, 'application/xml');
  const body = descendants(document, 'body')[0];
  const paragraphs = [];
  const tables = [];
  let paragraphIndex = 0;
  let tableIndex = 0;

  for (const child of elementChildren(body)) {
    if (localName(child) === 'p') {
      paragraphIndex += 1;
      const { text, breaks } = paragraphText(child);
      if (text || breaks.length) {
        paragraphs.push({ index: paragraphIndex, style: paragraphStyle(child), text, breaks });
      }
    } else if (localName(child) === 'tbl') {
      tables.push({ index: tableIndex, rows: tableRows(child) });
      tableIndex += 1;
    }
  }

  const result = { source, paragraphs, tables };
  await writeFile(path.join(outputDirectory, `${sourceName}.json`), `${JSON.stringify(result, null, 2)}\n`);
  console.log(`${sourceName}: ${paragraphs.length} paragraphs, ${tables.length} tables`);
}
