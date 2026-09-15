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
