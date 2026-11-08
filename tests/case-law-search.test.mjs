import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { searchCaseLaws } from '../src/lib/caseSearch.ts';

const makeCase = (overrides) => ({
  id: 'case-test',
  title: 'Sample v. State',
  citation: '(2026) LDLR-9999 (S.C)',
  court: 'Supreme Court of Nigeria',
  year: 2026,
  areaOfLaw: 'Evidence',
  subject: 'Admissibility of evidence',
  factsSummary: 'A short factual history.',
  issuesForDetermination: [],
  decisionSummary: '',
  ratioDecidendi: [],
  keyPrinciples: [],
  presidingJudges: [],
  suitNumber: '',
  ...overrides,
});

const cases = [
  makeCase({
    id: 'case-dele',
    title: 'Dele Akinwale v. The State',
    citation: '(2024) LDLR-1401 (C.A)',
    court: 'Court of Appeal',
    ratioDecidendi: ['Proof beyond reasonable doubt rests on credible evidence.'],
  }),
  makeCase({
    id: 'case-adekunle',
    title: 'Adeoye Adekunle v. The State',
    citation: '(2018) LDLR-1200 (C.A)',
    court: 'Court of Appeal',
    catchwords: ['Criminal law', 'Confessional statement'],
    keyPrinciples: ['Jurisdiction must be resolved before the merits of an appeal.'],
  }),
  makeCase({
    id: 'case-evidence',
    title: 'Ola v. Commissioner of Police',
    citation: '(2020) LDLR-811 (S.C)',
    ratioDecidendi: ['Electronic evidence requires the statutory certificate where applicable.'],
  }),
];

test('citation searches find dotted reports with either dotted or undotted court abbreviations', () => {
  for (const court of ['CA', 'C.A']) {
    assert.equal(searchCaseLaws(cases, `LDLR-1401 (${court})`)[0]?.judgment.id, 'case-dele');
  }
  for (const court of ['SC', 'S.C']) {
    assert.equal(searchCaseLaws(cases, `LDLR-811 (${court})`)[0]?.judgment.id, 'case-evidence');
  }
});

test('party-name prefixes are suggested from two characters', () => {
  const results = searchCaseLaws(cases, 'De', 6);

  assert.equal(results[0]?.judgment.id, 'case-dele');
  assert.equal(results[0]?.matchedField, 'Party name');
  assert.deepEqual(results.map((result) => result.judgment.id), ['case-dele']);
});

test('close misspellings still find the intended party name', () => {
  const results = searchCaseLaws(cases, 'Adekundle', 6);

  assert.equal(results[0]?.judgment.id, 'case-adekunle');
});

test('legal principles and ratio decidendi are part of the same index', () => {
  assert.equal(searchCaseLaws(cases, 'jurisdiction', 6)[0]?.judgment.id, 'case-adekunle');
  assert.equal(searchCaseLaws(cases, 'statutory certificate', 6)[0]?.judgment.id, 'case-evidence');
});

test('exact title-prefix matches outrank body-text matches', () => {
  const withBodyMatch = makeCase({
    id: 'case-body-match',
    title: 'Okoro v. State',
    factsSummary: 'The witness was called by Dele Akinwale.',
  });

  const results = searchCaseLaws([...cases, withBodyMatch], 'Dele', 6);
  assert.equal(results[0]?.judgment.id, 'case-dele');
});

test('the public Case Laws page is a unified accessible search interface', async () => {
  const source = await readFile(
    new URL('../src/components/modules/CaseLawSearchView.tsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /Search Nigerian Case Laws/);
  assert.match(source, /role="combobox"/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /event\.key === 'Enter'/);
  assert.match(source, /Party, citation or keyword/);
  assert.match(source, /aria-expanded=\{showSuggestions\}/);
  assert.match(source, /aria-activedescendant=/);
  assert.match(source, /to=\{`\/case-law\/case\/\$\{suggestion\.judgment\.id\}`\}/);
  assert.doesNotMatch(source, /All uploaded cases/);
  assert.doesNotMatch(source, /Case library/);
  const detail = await readFile(new URL('../src/components/modules/CaseLawView.tsx', import.meta.url), 'utf8');
  assert.match(detail, /if \(courtSlug\) return <Navigate replace to="\/case-law"/);
  assert.doesNotMatch(source, /const CourtDirectory/);
  assert.doesNotMatch(source, /const CourtCaseList/);
});

test('the homepage hero and Case Laws search share the animated landmark prompt', async () => {
  const [heroSearch, caseSearch, prompt] = await Promise.all([
    readFile(new URL('../src/components/HeroSearch.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/modules/CaseLawSearchView.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/LandmarkSearchPrompt.tsx', import.meta.url), 'utf8'),
  ]);

  assert.match(heroSearch, /<LandmarkSearchPrompt/);
  assert.match(heroSearch, /testId="home-search-landmark-prompt"/);
  assert.match(caseSearch, /<LandmarkSearchPrompt/);
  assert.match(prompt, /isLandmark/);
  assert.match(prompt, /lawpex-case-search-prompt/);
});
