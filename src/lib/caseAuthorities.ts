import { normalizeCaseSearchText } from './caseSearch';

export interface CaseAuthorityReport { id: string; title: string; citation: string; year: number; court: string }
export interface CaseAuthority { text: string; caseId?: string }

function partyKey(title: string) {
  const parties = normalizeCaseSearchText(title).split(' v ');
  if (parties.length !== 2) return '';
  const keys = parties.map(party => party
    .replace(/\b(?:and\s+)?(?:\d+\s+)?(?:ors|anor|anors|another|others)\b/g, ' ')
    .replace(/\b(?:mr|mrs|ms|dr|chief|sir|madam|messrs|the)\b/g, ' ')
    .replace(/\s+/g, ' ').trim());
  return keys.every(Boolean) ? keys.join(' v ') : '';
}

function courtKey(value: string) {
  if (/\bSupreme Court\b|\bS\.?\s*C\.?(?:NJ)?\b/i.test(value)) return 'sc';
  if (/\bCourt of Appeal\b|\bC\.?\s*A\.?\b/i.test(value)) return 'ca';
  return '';
}

export function createCaseAuthorityResolver(reports: CaseAuthorityReport[]) {
  const byParties = new Map<string, CaseAuthorityReport[]>();
  for (const report of new Map(reports.map(report => [report.id, report])).values()) {
    if (!/\bLDLR\s*-\s*\d+/i.test(report.citation)) continue;
    const key = partyKey(report.title);
    if (!key) continue;
    const candidates = byParties.get(key) ?? [];
    candidates.push(report);
    byParties.set(key, candidates);
  }
  return (reference: string): CaseAuthority => {
    const year = /\b(?:18|19|20)\d{2}\b/.exec(reference);
    const title = year ? reference.slice(0, year.index).replace(/[\s([,]+$/, '') : reference;
    const citation = year ? reference.slice(year.index) : '';
    const court = courtKey(citation);
    const reportNumber = /\bLDLR\s*-\s*(\d+)/i.exec(citation)?.[1];
    // Name similarity alone is unsafe: the same parties may appear in several appeals.
    const matches = (byParties.get(partyKey(title)) ?? []).filter(report =>
      (!year || report.year === Number(year[0]))
      && (!court || courtKey(report.court) === court)
      && (!reportNumber || /\bLDLR\s*-\s*(\d+)/i.exec(report.citation)?.[1] === reportNumber));
    if (matches.length !== 1) return { text: reference };
    const match = matches[0];
    return { text: `${match.title} ${match.citation}`, caseId: match.id };
  };
}
