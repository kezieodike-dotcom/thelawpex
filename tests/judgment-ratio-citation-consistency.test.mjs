import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const citationPattern = /^Per .+?\((Pp?\..+?)\)$/gim;

const citationsIn = (text) => [...text.matchAll(citationPattern)].map((match) => match[1]);

const isOrderedSubsequence = (expected, actual) => {
  let expectedIndex = 0;
  for (const citation of actual) {
    if (citation === expected[expectedIndex]) expectedIndex += 1;
  }
  return expectedIndex === expected.length;
};

test('paginated judgments preserve each canonical ratio citation in order', async () => {
  const judgmentDirectory = new URL('../src/data/judgments/', import.meta.url);
  const files = (await readdir(judgmentDirectory)).filter((file) => /^case-\d+\.json$/.test(file));

  for (const file of files) {
    const judgment = JSON.parse(await readFile(new URL(file, judgmentDirectory), 'utf8'));
    if (!Array.isArray(judgment.judgmentPages)) continue;

    const ratioSection = judgment.fullJudgmentText.split(/RATIO DECIDENDI/i)[1] ?? '';
    const canonicalCitations = citationsIn(ratioSection);
    const paginatedText = judgment.judgmentPages
      .flatMap((page) => page.paragraphs ?? [])
      .join('\n');
    const paginatedCitations = citationsIn(paginatedText);

    assert.equal(
      isOrderedSubsequence(canonicalCitations, paginatedCitations),
      true,
      `${file} has ratio citations that differ between full text and paginated data`,
    );
  }
});
