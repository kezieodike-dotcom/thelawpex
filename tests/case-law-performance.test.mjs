import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the application shell does not eagerly load full legal-document text', async () => {
  const appSource = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(appSource, /from ['"]\.\/data\/constitution1999Text['"]/);
  assert.doesNotMatch(appSource, /from ['"]\.\/data\/lawsLibrary['"]/);
  assert.doesNotMatch(appSource, /from ['"]\.\/data\/courtRules['"]/);
  assert.doesNotMatch(appSource, /import \{ CourtRulesView \}/);
  assert.doesNotMatch(appSource, /import \{ NigerianLawsView \}/);
  assert.doesNotMatch(appSource, /import \{ UniversalSearchModal \}/);
  assert.match(appSource, /lazy\(\(\) => import\('\.\/components\/modules\/CourtRulesView'\)/);
  assert.match(appSource, /lazy\(\(\) => import\('\.\/components\/modules\/NigerianLawsView'\)/);
  assert.match(appSource, /isSearchOpen &&/);
});

test('case citation targets are memoized per merged judgment document', async () => {
  const caseViewSource = await readFile(
    new URL('../src/components/modules/CaseLawView.tsx', import.meta.url),
    'utf8',
  );

  assert.match(caseViewSource, /const reportCitationTargetsCache = new WeakMap/);
  assert.match(caseViewSource, /reportCitationTargetsCache\.get\(judgment\)/);
  assert.match(caseViewSource, /reportCitationTargetsCache\.set\(judgment,/);
});

test('the case landing route does not load the judgment reader or full search corpus', async () => {
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
  assert.match(app, /path="\/case-law" element=\{<CaseLawSearchView \/>\}/);
  const landing = await readFile(new URL('../src/components/modules/CaseLawSearchView.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(landing, /from ['"].*(?:legalData|CaseLawView|judgmentLoader|reportQuoteLocator)['"]/);
  assert.match(landing, /import\('\.\.\/\.\.\/data\/legalData'\)/);
  assert.match(landing, /caseCatalog\.json/);
});

test('the case search animation never hides the search interface', async () => {
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
  const rule = css.match(/\.lawpex-case-motion\s*\{([^}]+)\}/)?.[1];
  assert.ok(rule);
  assert.doesNotMatch(rule, /opacity:\s*0/);
  const animation = css.slice(css.indexOf('@keyframes lawpex-case-rise'), css.indexOf('@keyframes lawpex-hero-aurora'));
  assert.doesNotMatch(animation, /opacity:\s*0/);
});
