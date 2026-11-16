import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const editorial = JSON.parse(await readFile(new URL('./november-cases-editorial.json', import.meta.url), 'utf8'));
const extractedDirectory = path.join(root, process.argv[2] || 'tmp/case-imports/source');
const sourceDirectory = process.argv[3] || 'C:/Users/USER/Downloads';
const outputDirectory = path.join(root, 'doc/case-imports/november-2026');
const clean = (text = '') => text.replace(/\s+/g, ' ').trim();
const extracted = {};

await mkdir(outputDirectory, { recursive: true });
await mkdir(path.join(root, 'public/documents/cases'), { recursive: true });
await mkdir(path.join(root, 'src/data/judgments'), { recursive: true });

for (const name of await readdir(extractedDirectory)) {
  if (!name.endsWith('.json')) continue;
  const document = JSON.parse(await readFile(path.join(extractedDirectory, name), 'utf8'));
  extracted[name.replace(/\.json$/i, '')] = document;
}

const splitIssues = (raw) => {
  const text = clean(raw).replace(/^On appeal[^:]*:\s*/i, '');
  const numbered = text.split(/(?=\b\d+[.)]\s+)/).map(item => clean(item.replace(/^\d+[.)]\s*/, ''))).filter(Boolean);
  if (numbered.length > 1) return numbered;
  return text ? [text.replace(/^['"]|['"]$/g, '')] : [];
};

const parseSummary = (paragraphs, ratioIndex) => {
  const summaryIndex = paragraphs.findIndex(text => /JUDGMENT SUMMARY/i.test(text));
  const text = clean(paragraphs.slice(summaryIndex + 1, ratioIndex).join(' '));
  const facts = text.match(/FACTS(?: OF THE CASE)?\s*:\s*([\s\S]*?)\s+ISSUES?\s*:/i)?.[1];
  const issues = text.match(/ISSUES?\s*:\s*([\s\S]*?)\s+DECISION\s*\/\s*HELD\s*:/i)?.[1];
  const decision = text.match(/DECISION\s*\/\s*HELD\s*:\s*([\s\S]*)$/i)?.[1];
  return {
    facts: clean(facts || text),
    issues: splitIssues(issues || ''),
    decision: clean(decision || ''),
  };
};

const parseRatios = (paragraphs, ratioIndex, count, id) => {
  const ratios = [];
  let cursor = ratioIndex + 1;
  while (ratios.length < count && cursor < paragraphs.length) {
    while (!clean(paragraphs[cursor]) && cursor < paragraphs.length) cursor += 1;
    const heading = clean(paragraphs[cursor++]);
    const bodyParts = [];
    while (cursor < paragraphs.length && !/^Per\s+/i.test(clean(paragraphs[cursor]))) {
      if (clean(paragraphs[cursor])) bodyParts.push(paragraphs[cursor].trim());
      cursor += 1;
    }
    if (cursor >= paragraphs.length) throw new Error(`${id}: missing attribution for ratio ${ratios.length + 1}`);
    let attribution = clean(paragraphs[cursor++]);
    let body = bodyParts.join('\n\n').trim();

    if (id === 'case-025' && ratios.length === 4 && /See Madukolu\s*$/i.test(body.replace(/["”]\s*$/, ''))) {
      body = body.replace(/["”]\s*$/, '') + ' & Ors v. Nkemdilim (1962) 2 SCNLR 341; (1962) 1 All NLR (Pt.4) 587."';
    }
    if (id === 'case-027' && ratios.length === 0) {
      attribution = 'Per IKECHI FRANCIS OGBUAGU, J.S.C. (P., para.)';
    }
    if (id === 'case-026' && ratios.length === 16) {
      body = '"This issue simply deals with the effect of the failure of an appellant in an appeal to file a reply brief in response to a preliminary objection raised by the respondent in the respondent\'s brief of argument. Failure to file a reply brief to respond to the respondent\'s preliminary objection to the competence of the appellant\'s appeal arising from filing a bad appellant\'s brief, does not automatically lead to the upholding of the preliminary objection and striking out of the appeal as conceived by the appellant in this issue. A reply brief required to be filed by an appellant under Order 6 Rule 5 of the Court of Appeal Rules, only affords an appellant an opportunity to respond to any new points arising from the respondent\'s brief. It is obviously not a necessity or mandatory as claimed by the appellant." (DISSENTING)';
    }
    if (id === 'case-027' && ratios.length === 5) {
      body = body.replace(/Alano/g, 'Atano').replace(/The Slate/g, 'The State');
    }
    if (id === 'case-028' && ratios.length === 6) {
      body = body.replace(/SCNJ \(PU\)/g, 'SCNJ (Pt.1)').replace(/Akpatu/g, 'Akpotu');
    }

    ratios.push({ heading, body, attribution, sourceAttribution: clean(paragraphs[cursor - 1]) });
  }
  if (ratios.length !== count) throw new Error(`${id}: expected ${count} ratios, found ${ratios.length}`);
  return { ratios, bodyStart: cursor };
};

const cases = [];
const provenance = [];
const sourceParagraphs = {};

for (const entry of editorial) {
  const source = extracted[entry.file];
  if (!source) throw new Error(`Missing extracted source ${entry.file}`);
  const paragraphs = source.paragraphs.map(item => item.text ?? '');
  const nonEmpty = paragraphs.map(text => text.trim()).filter(Boolean);
  sourceParagraphs[entry.file] = paragraphs;

  const first = nonEmpty.find(text => /(?:LDLR|LPELR)-\d+/i.test(text));
  const citation = first?.match(/\((\d{4})\)\s*(?:LDLR|LPELR)-(\d+)\s*\((S\.?C|C\.?A)\)/i);
  if (!citation) throw new Error(`${entry.id}: unrecognised citation ${first}`);
  const courtCode = citation[3].replace(/\./g, '').toUpperCase();
  const ratioIndex = paragraphs.findIndex(text => /^RATIO(?:\(S\))? DECIDENDI$/i.test(clean(text)));
  if (ratioIndex < 0) throw new Error(`${entry.id}: ratio section not found`);
  const { ratios, bodyStart } = parseRatios(paragraphs, ratioIndex, entry.ratioCount, entry.id);
  const summary = parseSummary(paragraphs, ratioIndex);
  const sourceName = `${entry.file}.docx`;
  const originalPath = path.join(sourceDirectory, sourceName);
  const original = await readFile(originalPath);
  const sourceSha256 = createHash('sha256').update(original).digest('hex');
  const preservedPath = path.join(root, 'public/documents/cases', `${entry.id}.docx`);
  await copyFile(originalPath, preservedPath);

  const fullJudgmentText = paragraphs.join('\n\n').trim().replace(
    /([A-Z]),\s*J\.\s*S\.\s*C\.\s*\n+\s*(\(Delivering\s+the\s+(?:Leading\s+Judgment|Lead\s+Ruling)\)\s*:)/g,
    '$1, J.S.C. $2',
  );
  const judgment = {
    id: entry.id,
    preserveSourceFormatting: true,
    verbatimWholeCase: true,
    sourceFile: sourceName,
    sourceSha256,
    fullJudgmentText,
  };
  await writeFile(path.join(root, 'src/data/judgments', `${entry.id}.json`), `${JSON.stringify(judgment, null, 2)}\n`);

  const tableRows = source.tables?.flatMap(table => table.rows) ?? [];
  const judges = tableRows
    .filter(row => /Justice of the (?:Supreme Court|Court of Appeal)/i.test(clean(row[1])))
    .map(row => `${clean(row[0])}, ${courtCode === 'SC' ? 'J.S.C.' : 'J.C.A.'}`);
  const dateLine = nonEmpty.find(text => /^On\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday)/i.test(text));
  const dateDelivered = clean(dateLine || '').replace(/^On\s+/i, '').replace(/,\s*the\s+(\d+)(?:st|nd|rd|th)\s+day\s+of\s+([A-Za-z]+),\s*(\d{4})/i, ', $1 $2 $3');
  const suitNumber = clean(nonEmpty.find(text => /^Suit No\s*:/i.test(text)) || '').replace(/^Suit No\s*:\s*/i, '');
  const appearancesIndex = nonEmpty.findIndex(text => /^Appearances\s*:/i.test(text));
  const appearanceLines = appearancesIndex >= 0 ? nonEmpty.slice(appearancesIndex + 1, appearancesIndex + 9) : [];
  const appellantAppearance = appearanceLines.find(text => /For\s+(?:the\s+)?Appellant/i.test(text));
  const respondentAppearance = appearanceLines.find(text => /For\s+(?:the\s+)?Respondent/i.test(text));
  const formattedRatios = ratios.map(({ heading, body, attribution }) => [heading, body, attribution].filter(Boolean).join('\n'));

  cases.push({
    id: entry.id,
    title: entry.title,
    citation: `(${citation[1]}) LDLR-${citation[2]} (${courtCode.split('').join('.')})`,
    sourceUrl: `/documents/cases/${entry.id}.docx`,
    suitNumber,
    court: courtCode === 'SC' ? 'Supreme Court of Nigeria' : 'Court of Appeal',
    year: Number(citation[1]),
    dateDelivered,
    presidingJudges: judges,
    appearances: {
      ...(appellantAppearance ? { appellant: clean(appellantAppearance.replace(/For\s+(?:the\s+)?Appellant.*$/i, '')) } : {}),
      ...(respondentAppearance ? { respondent: clean(respondentAppearance.replace(/For\s+(?:the\s+)?Respondent.*$/i, '')) } : {}),
    },
    areaOfLaw: entry.areaOfLaw,
    subject: entry.subject,
    catchwords: [...new Set(ratios.map(({ heading }) => heading.split(/\s+-\s+/).slice(0, 2).join(' - ')))],
    proceduralHistory: entry.proceduralHistory,
    factsSummary: summary.facts,
    issuesForDetermination: summary.issues.length ? summary.issues : [entry.subject],
    decisionSummary: summary.decision,
    ratioDecidendi: formattedRatios,
    authoritiesCited: entry.authoritiesCited ?? [],
    statutesConsidered: entry.statutesConsidered ?? [],
    practiceNotes: entry.practiceNotes ?? [],
    hasFullJudgment: true,
    keyPrinciples: entry.keyPrinciples,
    isLandmark: false,
  });

  provenance.push({
    id: entry.id,
    sourceFile: sourceName,
    sha256: sourceSha256,
    sourceParagraphs: paragraphs.length,
    ratios: ratios.length,
    judgmentCharacters: fullJudgmentText.length,
    bodyStartsAtParagraph: bodyStart,
  });
  console.log(`${entry.id}: ${entry.title}; ${ratios.length} ratios; ${fullJudgmentText.length} characters`);
}

await writeFile(path.join(root, 'src/data/novemberCases.ts'), `import { CaseLaw } from '../types';\n\n// Generated by scripts/import-november-cases.mjs; citations are finalized by audit-november-cases.ts.\nexport const NOVEMBER_CASES = JSON.parse(${JSON.stringify(JSON.stringify(cases))}) as CaseLaw[];\n`);
await writeFile(path.join(outputDirectory, 'source-paragraphs.json'), `${JSON.stringify(sourceParagraphs, null, 2)}\n`);
await writeFile(path.join(outputDirectory, 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
