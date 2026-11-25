export type RatioSourceReference = {
  page: number;
  paragraph: string;
};

const SOURCE_REFERENCE_PATTERN =
  /\(\s*(?:Pp?|Pages?)\.?\s*(\d+)(?:\s*[-–—]\s*\d+)?\s*,?\s*paras?(?:graph)?s?\.?\s*([A-G])(?:\s*[-–—]\s*[A-G])?\s*\)/i;

/**
 * Reads the first page and paragraph from a report attribution such as
 * "Per ... (Pp. 11-12, paras. A-B)". The first cited location is the point
 * where the quoted ratio begins in the paginated judgment.
 */
export const ratioSourceReferenceFromText = (text?: string): RatioSourceReference | undefined => {
  if (!text) return undefined;

  const match = text.match(SOURCE_REFERENCE_PATTERN);
  if (!match) return undefined;

  const page = Number(match[1]);
  const paragraph = match[2].toUpperCase();
  if (!Number.isInteger(page) || page < 1) return undefined;

  return { page, paragraph };
};
