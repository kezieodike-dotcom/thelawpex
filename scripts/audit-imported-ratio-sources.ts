import { readFile, writeFile } from 'node:fs/promises';
import { LANDMARK_CASES } from '../src/data/legalData.ts';
import { auditCaseRatioCitations, inspectRatioSources } from '../src/components/modules/CaseLawView.tsx';

const firstSeven = process.argv.includes('--first-seven');
const ids = firstSeven
  ? ['case-001', 'case-002', 'case-003', 'case-004', 'case-005', 'case-006', 'case-007']
  : ['case-008', 'case-009', 'case-010', 'case-011', 'case-012'];
const report = [
  firstSeven ? '# First Seven Cases: Ratio Citation Audit' : '# Imported Case Ratio Citation Audit',
  '',
  'References below use the current LAWPEX report pages and the visible paragraph letters beside the judgment text. The formal opening is page 1. Only leading and supporting judicial opinions are searched, never the introductory ratios.',
  '',
  'The reader, ratio detail, full-case headnotes and Word export share the same paragraph boundaries. A paragraph begins beside its letter and ends immediately before the next labelled paragraph. Labels restart at A on each page and never repeat within a page.',
  '',
  'Matching ignores punctuation, spacing and known scanned running headers. Both quotation boundaries must match; small transcription differences are accepted only with exact nearby anchors, at most six character edits per 160-character boundary and at least 90% ordered quotation-window coverage. Quotation wording and original source files are preserved. Ambiguous or unmatched passages are not assigned guessed references.',
  '',
  'Explicit ellipses are checked by matching every quoted segment in order within the same judicial opinion. They do not permit invented or reordered text. No reference is obtained from a ratio headnote itself.',
  '',
  `Reproduce with \`node --import tsx scripts/audit-imported-ratio-sources.ts${firstSeven ? ' --first-seven' : ''}\`.`,
];
let total = 0;
for (const id of ids) {
  const metadata = LANDMARK_CASES.find(c => c.id === id)!;
  const judgment = {...metadata, ...JSON.parse(await readFile(new URL(`../src/data/judgments/${id}.json`, import.meta.url), 'utf8'))};
  const { pages, targets } = inspectRatioSources(judgment);
  const ratios = auditCaseRatioCitations(judgment);
  report.push('', `## ${metadata.title}`, '', `${ratios.length} ratios; ${pages.length + 1} pages; leading judgment starts on page ${targets[0].pageNumber}.`, '', '| Ratio | Corrected attribution and source reference | Ordered text coverage |', '| --- | --- | --- |');
  ratios.forEach((ratio, index) => {
    if (!ratio.resolved || !ratio.evidence) throw new Error(`${id} ratio ${index + 1} lacks source evidence`);
    report.push(`| ${index + 1} | ${ratio.attribution} | ${(ratio.evidence.coverage * 100).toFixed(1)}% |`);
    total++;
  });
  console.log(`${id}: ${ratios.length}/${ratios.length} matched, ${pages.length + 1} pages`);
}
report.push('', '## Source Corrections', '');
report.push(...(firstSeven ? [
  '- These references replace historical manual overrides. The latest audit checks the actual rendered paragraph text, not just whether a reference is populated.',
  '- Paragraph labels now remain attached to the same text on mobile and desktop. The original document and quotation wording are unchanged; report page counts are unchanged.',
  '- Idundun: Fatai-Williams in the headnotes and Fatayi-Williams in the opinion identify the same judge. Ratio 2 spans page 11 A to page 12 A, not a single paragraph A.',
  '- Adava SC: ratios 3 and 4 contain explicit ellipses in the supplied document; all remaining quoted segments were located in order in Kalgo\'s and Onnoghen\'s opinions respectively.',
  '- Adeoye Adekunle: historical references were two pages behind the current report; all eleven now use the current page numbers and attached paragraph labels.',
  '- Tunde Adava CA: the two references remain page 9 A and page 9 B.',
] : [
  '- Mojekwu ratio 1 remains P. 16, paras. A-F, as supplied by the editor.',
  '- Fawehinmi: the split leading-judgment heading is recognised before Agbaje\'s opinion. Ratio 10\'s quotation occurs in Karibi-Whyte\'s opinion; the displayed attribution is corrected accordingly.',
  '- Ojukwu: the source heading "JUDGMENT SUMMARY" is retained along with the six introductory ratios; references account for these restored pages.',
  '- The first seven cases are now audited separately in first-seven-case-ratio-audit.md using the same source-linked method.',
]));
report.push('', `Total: ${total} ratios matched to source passages.`, '');
await writeFile(new URL(`../doc/${firstSeven ? 'first-seven-case-ratio-audit' : 'imported-case-ratio-audit'}.md`, import.meta.url), report.join('\n'));
console.log(`Saved audit for ${total} ratios.`);
