export interface CaseSearchDocument {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: number;
  areaOfLaw: string;
  subject: string;
  factsSummary: string;
  catchwords?: string[];
  authoritiesCited?: string[];
  statutesConsidered?: string[];
  keyPrinciples: string[];
  ratioDecidendi: string[];
}

export interface CaseSearchResult<T extends CaseSearchDocument = CaseSearchDocument> {
  judgment: T;
  score: number;
  matchedField: string;
  excerpt: string;
}

interface SearchField {
  label: string;
  values: string[];
  weight: number;
  fuzzy?: boolean;
}

const SEARCH_FIELDS = <T extends CaseSearchDocument>(judgment: T): SearchField[] => [
  { label: 'Party name', values: [judgment.title], weight: 150, fuzzy: true },
  { label: 'Citation', values: [judgment.citation], weight: 132 },
  {
    label: 'Legal topic',
    values: [judgment.areaOfLaw, judgment.subject, ...(judgment.catchwords ?? [])],
    weight: 108,
    fuzzy: true,
  },
  { label: 'Principle of law', values: judgment.keyPrinciples, weight: 96 },
  { label: 'Ratio decidendi', values: judgment.ratioDecidendi, weight: 94 },
  { label: 'Authority cited', values: judgment.authoritiesCited ?? [], weight: 78 },
  { label: 'Statute considered', values: judgment.statutesConsidered ?? [], weight: 76 },
  { label: 'Case facts', values: [judgment.factsSummary], weight: 62 },
];

export const normalizeCaseSearchText = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\bversus\b|\bvs\.?\b/g, ' v ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const levenshteinDistance = (left: string, right: string): number => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex];
      const substitution = diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
      previous[rightIndex] = Math.min(previous[rightIndex] + 1, previous[rightIndex - 1] + 1, substitution);
      diagonal = above;
    }
  }

  return previous[right.length];
};

const similarity = (left: string, right: string): number => {
  const longest = Math.max(left.length, right.length);
  if (!longest) return 1;
  return 1 - levenshteinDistance(left, right) / longest;
};

const excerptAroundMatch = (value: string, normalizedQuery: string): string => {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= 152) return compact;

  const firstTerm = normalizedQuery.split(' ')[0];
  const matchIndex = compact.toLowerCase().indexOf(firstTerm);
  const start = Math.max(0, matchIndex > -1 ? matchIndex - 38 : 0);
  const end = Math.min(compact.length, start + 152);
  return `${start > 0 ? '...' : ''}${compact.slice(start, end).trim()}${end < compact.length ? '...' : ''}`;
};

const scoreValue = (value: string, query: string, allowFuzzy: boolean): number => {
  const normalizedValue = normalizeCaseSearchText(value);
  if (!normalizedValue) return 0;
  if (normalizedValue === query) return 32;
  if (normalizedValue.startsWith(query)) return 27;

  const valueTokens = normalizedValue.split(' ');
  const queryTokens = query.split(' ');
  if (valueTokens.some((token) => token.startsWith(query))) return 23;
  if (normalizedValue.includes(query)) return 19;
  if (queryTokens.every((queryToken) => valueTokens.some((token) => token.includes(queryToken)))) return 15;

  if (allowFuzzy && query.length >= 4) {
    const bestSimilarity = valueTokens.reduce(
      (best, token) => Math.max(best, similarity(query, token)),
      0,
    );
    if (bestSimilarity >= 0.72) return Math.round(bestSimilarity * 14);
  }

  return 0;
};

const scoreShortPrefix = (value: string, query: string): number => {
  const normalizedValue = normalizeCaseSearchText(value);
  if (normalizedValue === query) return 32;
  if (normalizedValue.startsWith(query)) return 27;
  if (normalizedValue.split(' ').some((token) => token.startsWith(query))) return 23;
  return 0;
};

export const searchCaseLaws = <T extends CaseSearchDocument>(
  judgments: T[],
  query: string,
  limit = judgments.length,
): CaseSearchResult<T>[] => {
  const normalizedQuery = normalizeCaseSearchText(query);
  if (!normalizedQuery) {
    return judgments.slice(0, limit).map((judgment) => ({
      judgment,
      score: 0,
      matchedField: 'Case report',
      excerpt: judgment.subject,
    }));
  }

  return judgments
    .map((judgment) => {
      let best: CaseSearchResult<T> | null = null;
      const isShortPrefixQuery = normalizedQuery.length <= 2;

      for (const field of SEARCH_FIELDS(judgment)) {
        if (isShortPrefixQuery && !['Party name', 'Citation'].includes(field.label)) continue;

        for (const value of field.values) {
          const matchScore = isShortPrefixQuery
            ? scoreShortPrefix(value, normalizedQuery)
            : scoreValue(value, normalizedQuery, Boolean(field.fuzzy));
          if (!matchScore) continue;

          const result = {
            judgment,
            score: field.weight + matchScore,
            matchedField: field.label,
            excerpt: field.label === 'Party name' ? judgment.title : excerptAroundMatch(value, normalizedQuery),
          };
          if (!best || result.score > best.score) best = result;
        }
      }

      return best;
    })
    .filter((result): result is CaseSearchResult<T> => Boolean(result))
    .sort((left, right) => right.score - left.score || right.judgment.year - left.judgment.year)
    .slice(0, limit);
};
