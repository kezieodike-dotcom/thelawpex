import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { extractCaseSource, suggestCaseReport, caseSuggestionSchema } from '../src/server/caseReportExtraction';

test('extracts DOCX independently of AI and retains source fingerprint', async () => {
  const bytes = await readFile(new URL('../public/documents/cases/case-013.docx', import.meta.url));
  const result = await extractCaseSource(bytes, 'docx');
  assert.ok(result.sourceExtraction.text.length > 1000);
  assert.match(result.sourceExtraction.sha256, /^[a-f0-9]{64}$/);
  assert.equal(result.sourceExtraction.incomplete, false);
  const offline = await suggestCaseReport(null, 'test', result.sourceExtraction.text, {});
  assert.equal(offline.suggestions, null);
  assert.ok(offline.warnings.length);
});
test('rejects a disguised file instead of guessing source text', async () => {
  await assert.rejects(extractCaseSource(Buffer.from('not a PDF'), 'pdf'));
  await assert.rejects(extractCaseSource(Buffer.from('not a DOCX'), 'docx'));
});
test('AI schema strips full-text rewriting and refuses malformed ratios', () => {
  assert.equal('fullJudgmentText' in caseSuggestionSchema.parse({ fullJudgmentText: 'Invented content' }), false);
  assert.throws(() => caseSuggestionSchema.parse({ ratios: [{ exactText: 42 }] }));
});
test('a long document is never silently truncated for AI', async () => {
  let called = false;
  const ai = { models: { generateContent: () => { called = true; } } } as any;
  const result = await suggestCaseReport(ai, 'test', 'x'.repeat(300001), {});
  assert.equal(called, false);
  assert.equal(result.suggestions, null);
  assert.match(result.warnings[0], /All source text is retained/);
});
