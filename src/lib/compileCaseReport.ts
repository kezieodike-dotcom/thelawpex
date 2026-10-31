import { formatRatio, toPublishedCaseLaw, type AdminCaseRecord } from '../data/caseIngestion';
import { createExactPassageIndex, locateExactPassage, normalizedWords, reviewFingerprint, validateEditorialFields, type PassageEvidence } from './caseReportReview';

const section = (heading: string, content: string | string[]) => [heading, Array.isArray(content) ? content.join('\n\n') : content].join('\n\n');
export function assembleReport(record: AdminCaseRecord, judicialText: string) {
  return [
    'SUMMARY OF JUDGMENT',
    section('PROCEDURAL HISTORY', record.proceduralHistory),
    section('FACTS', record.factsSummary),
    section('ISSUES FOR DETERMINATION', record.issuesForDetermination),
    section('DECISION / HELD', record.decisionSummary),
    section('PRINCIPLES OF LAW', record.principles),
    section('AUTHORITIES', record.authorities),
    section('STATUTES', record.statutes),
    section('PRACTICE NOTES', record.practiceNotes),
    section('RATIO DECIDENDI', record.ratios.map(formatRatio)),
    judicialText,
  ].join('\n\n');
}

export async function compileCaseReport(input: AdminCaseRecord): Promise<AdminCaseRecord> {
  const { getReportCitationTargets, isLeadingJudgmentStart } = await import('../components/modules/CaseLawView');
  let record = { ...input, review: undefined, validation: undefined, preparedReportText: undefined } as AdminCaseRecord;
  const errors = validateEditorialFields(record);
  const source = record.sourceExtraction?.text ?? '';
  const heading = record.leadingJudgmentHeading?.trim() ?? '';
  const offset = heading ? source.indexOf(heading) : -1;
  const formattedHeading = heading.endsWith(':') ? heading : `${heading}:`;
  const leadMarker = /\(\s*Delivering\s+(?:the\s+)?(?:Leading|Lead)\s+Judg(?:e)?ment\s*\)/i;
  if (leadMarker.test(source) && !leadMarker.test(heading)) errors.push('The document identifies a leading judgment. Select that complete heading, not a supporting opinion.');
  if (offset < 0 || /^Per\b/i.test(heading) || source.indexOf(heading, offset + heading.length) >= 0 || !isLeadingJudgmentStart(formattedHeading)) {
    errors.push('Select the unique, exact leading-judgment judge heading from the extracted source. It must identify the judge delivering the judgment, not a Per attribution in the headnote.');
  }
  let evidence: PassageEvidence[] = [];
  if (!errors.length) {
    const judicialText = `${formattedHeading}${source.slice(offset + heading.length)}`;
    let stable = false;
    for (let pass = 0; pass < 6; pass++) {
      await new Promise(resolve => setTimeout(resolve, 0));
      record.preparedReportText = assembleReport(record, judicialText);
      const targets = getReportCitationTargets(toPublishedCaseLaw(record));
      if (!targets.length) { errors.push('The report has no labelled judicial paragraphs. Check the leading-judgment boundary.'); break; }
      const sourceIndex = createExactPassageIndex(targets);
      evidence = [];
      const ratios = record.ratios.map((ratio, index) => {
        const match = locateExactPassage(sourceIndex, ratio.exactText);
        if (!match.location || !match.first || !match.last) { errors.push(`Ratio ${index + 1}: ${match.error}`); return ratio; }
        const name = normalizedWords(ratio.attribution.replace(/^Per\s+/i, '').replace(/\([^)]*\)/g, '').replace(/:\s*$/, ''));
        const sourceJudge = normalizedWords((match.first.judge ?? '').replace(/\([^)]*\)/g, '').replace(/:\s*$/, ''));
        if (name !== sourceJudge) errors.push(`Ratio ${index + 1}: attribution does not match its source judge (${match.first.judge}).`);
        evidence.push({ item: `Ratio ${index + 1}`, ...match.location, firstText: match.first.text, lastText: match.last.text, judge: match.first.judge ?? '' });
        return { ...ratio, sourcePage: match.location.page, sourceParagraph: match.location.paragraph };
      });
      record.principles.forEach((_, index) => {
        const match = locateExactPassage(sourceIndex, record.principleSources?.[index] ?? '');
        if (!match.location || !match.first || !match.last) errors.push(`Principle ${index + 1}: ${match.error}`);
        else evidence.push({ item: `Principle ${index + 1}`, ...match.location, firstText: match.first.text, lastText: match.last.text, judge: match.first.judge ?? '' });
      });
      if (errors.length) break;
      const before = record.preparedReportText;
      record = { ...record, ratios };
      record.preparedReportText = assembleReport(record, judicialText);
      if (before === record.preparedReportText) { stable = true; break; }
    }
    if (!stable && !errors.length) errors.push('Pagination did not stabilise. Publication is blocked until the report is reviewed.');
  }
  if (errors.length) record.preparedReportText = undefined;
  record.validation = { errors: [...new Set(errors)], evidence, checkedAt: new Date().toISOString(), fingerprint: reviewFingerprint(record) };
  return record;
}
