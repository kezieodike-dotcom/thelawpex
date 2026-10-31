import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const batch = JSON.parse(await readFile(new URL('./additional-cases-editorial.json', import.meta.url), 'utf8'));
const extracted = JSON.parse((await readFile(path.join(root, process.argv[2] || 'doc/case-imports/october-2026/source-paragraphs.json'), 'utf8')).replace(/^\uFEFF/, ''));
const sourceDirectory = process.argv[3] || path.join(root, 'public/documents/cases');
const clean = text => text.replace(/\s+/g, ' ').trim();
const cases = [];
const provenance = [];
await mkdir(path.join(root, 'public/documents/cases'), {recursive: true});
await mkdir(path.join(root, 'doc/case-imports/october-2026'), {recursive: true});

for (const {file, ...editorial} of batch) {
  const paragraphs = extracted[file];
  if (!paragraphs) throw new Error(`Missing source: ${file}`);
  const first = paragraphs.find(p => /LDLR/.test(p));
  const citation = first.match(/\((\d{4})\)\s*LDLR-(\d+)\s*\((SC|CA)\)/);
  if (!citation) throw new Error(`Unrecognised citation: ${first}`);
  const ratioIndex = paragraphs.findIndex(p => p.trim() === 'RATIO DECIDENDI');
  const ratioDecidendi = [];
  let pending = [];
  let lastAttribution = ratioIndex;
  for (let i = ratioIndex + 1; i < paragraphs.length; i++) {
    const line = paragraphs[i].trim();
    if (/Delivering/i.test(line)) break;
    if (!line) continue;
    pending.push(line);
    if (/^Per\s+/i.test(line)) {
      if (pending.length < 3) throw new Error(`Incomplete ratio in ${file}`);
      ratioDecidendi.push(pending.join('\n'));
      pending = [];
      lastAttribution = i;
    }
  }
  const summaryIndex = paragraphs.findIndex(p => /JUDGMENT SUMMARY/.test(p));
  const summary = clean(paragraphs.slice(summaryIndex + 1, ratioIndex).join(' '));
  const facts = summary.match(/FACTS(?: OF THE CASE)?:([\s\S]*?)ISSUES:/i)?.[1]?.trim();
  const decision = summary.split(/DECISION\/HELD:/i)[1]?.trim();
  if (!facts || !decision || !ratioDecidendi.length) throw new Error(`Incomplete report: ${file}`);
  const coramStart = paragraphs.findIndex(p => /Before Their Lordship/i.test(p));
  const between = paragraphs.findIndex(p => /^BETWEEN\s*$/i.test(p));
  const judges = paragraphs.slice(coramStart + 1, between).filter(p => p.trim() && !/^Justice /i.test(p)).map(p => `${clean(p)}, J${citation[3]}`);
  const date = clean(paragraphs.find(p => /^On /.test(p)) || '').replace(/^On /, '').replace(/, the (\d+)(?:st|nd|rd|th) day of ([A-Za-z]+), (\d+)/, ', $1 $2 $3');
  const suitNumber = clean(paragraphs.find(p => /^Suit No:/i.test(p)) || '').replace(/^Suit No:\s*/i, '');
  const appearanceIndex = paragraphs.findIndex(p => /^Appearances:/i.test(p));
  const appearances = {};
  if (appearanceIndex !== -1) {
    const counsel = paragraphs.slice(appearanceIndex + 1).filter(p => p.trim());
    for (const [key, role] of [['appellant','Appellant'],['respondent','Respondent']]) {
      const line = counsel.find(p => new RegExp(`For ${role}`, 'i').test(p));
      if (line) appearances[key] = clean(line.replace(new RegExp(`For ${role}.*$`, 'i'), ''));
    }
  }
  // Join copied hard-wrapped lines, but retain blank-line paragraph boundaries.
  // The untouched DOCX and extracted paragraph array remain the source of record.
  const body = paragraphs.slice(lastAttribution + 1).join('\n')
    .replace(/\(Delivering\s+the\s+Leading\s+Judgment\)/gi, '(Delivering the Leading Judgment)')
    .replace(/(^|\n)([A-Z][A-Z \t\u00a0.'-]{3,100},\s*J\.\s*S\.\s*C\.)[ \t\u00a0]*\n/g, '$1$2:\n')
    .replace(/(J\.\s*S\.\s*C\.)\s*:\s*(\(Delivering)/g, '$1 $2')
    .replace(/([A-Z][A-Z\s.'-]{3,100},\s*J\.?\s*(?:S\.?\s*C|C\.?\s*A)\.?)\s*(\(Delivering the Leading Judgment\)\s*:|:)/g, '\n\n$1 $2\n\n');
  let opening = paragraphs.slice(0, ratioIndex).join('\n');
  if (summaryIndex === -1) opening = opening.replace(/INTRODUCTION:/, 'JUDGMENT SUMMARY\n\nINTRODUCTION:');
  const fullJudgmentText = `${opening}\n\nRATIO DECIDENDI\n\n${ratioDecidendi.map(r => r.split('\n').join('\n\n')).join('\n\n')}\n\n${body}`.trim();
  let originalPath = path.join(sourceDirectory, `${file}.docx`);
  try { await access(originalPath); } catch { originalPath = path.join(sourceDirectory, `${editorial.id}.docx`); }
  const original = await readFile(originalPath);
  const sourceSha256 = createHash('sha256').update(original).digest('hex');
  const preservedPath = path.join(root, `public/documents/cases/${editorial.id}.docx`);
  if (path.resolve(originalPath) !== path.resolve(preservedPath)) await copyFile(originalPath, preservedPath);
  const judgment = {id: editorial.id, preserveSourceFormatting: true, verbatimWholeCase: true, sourceFile: `${file}.docx`, sourceSha256, fullJudgmentText};
  await writeFile(path.join(root, `src/data/judgments/${editorial.id}.json`), JSON.stringify(judgment, null, 2) + '\n');
  cases.push({
    ...editorial,
    citation: `(${citation[1]}) LDLR-${citation[2]} (${citation[3]})`,
    year: Number(citation[1]),
    court: citation[3] === 'SC' ? 'Supreme Court of Nigeria' : 'Court of Appeal',
    suitNumber,
    judicialDivision: clean(paragraphs.find(p => /JUDICIAL DIVISION/.test(p)) || '').replace(/^\(|\)$/g, ''),
    dateDelivered: date,
    presidingJudges: judges,
    appearances,
    factsSummary: editorial.factsSummary || facts,
    decisionSummary: decision,
    ratioDecidendi,
    hasFullJudgment: true,
    isLandmark: false,
    sourceUrl: `/documents/cases/${editorial.id}.docx`,
    catchwords: [...new Set(ratioDecidendi.map(r => clean(r.split('\n')[0].split(/\s+-\s+/).slice(0, 2).join(' - '))))],
  });
  provenance.push({id: editorial.id, file: `${file}.docx`, sha256: sourceSha256, paragraphs: paragraphs.length, ratios: ratioDecidendi.length});
  console.log(`${editorial.id}: ${editorial.title}, ${ratioDecidendi.length} ratios, ${fullJudgmentText.length} characters`);
}
await writeFile(path.join(root, 'src/data/additionalCases.ts'), `import { CaseLaw } from '../types';\n\n// Generated by scripts/import-additional-cases.mjs. Editorial fields live in its JSON manifest.\nexport const ADDITIONAL_CASES: CaseLaw[] = ${JSON.stringify(cases, null, 2)};\n`);
await writeFile(path.join(root, 'doc/case-imports/october-2026/provenance.json'), JSON.stringify(provenance, null, 2) + '\n');
await writeFile(path.join(root, 'doc/case-imports/october-2026/source-paragraphs.json'), JSON.stringify(extracted, null, 2) + '\n');
