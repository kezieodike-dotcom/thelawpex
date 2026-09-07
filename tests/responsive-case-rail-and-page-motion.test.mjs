import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('case details use a vertical mobile rail while preserving the desktop sidebar', async () => {
  const caseView = await readFile(
    new URL('../src/components/modules/CaseLawView.tsx', import.meta.url),
    'utf8',
  );

  assert.match(caseView, /grid-cols-\[4\.75rem_minmax\(0,1fr\)\]/);
  assert.match(caseView, /lawpex-case-mobile-rail/);
  assert.match(caseView, /aria-label="Case sections"/);
  assert.match(caseView, /mobileLabel=/);
  assert.match(caseView, /aria-current=\{active \? 'page' : undefined\}/);
  assert.match(caseView, /lg:grid-cols-\[18rem_minmax\(0,1fr\)\]/);
  assert.doesNotMatch(caseView, /snap-x gap-2 overflow-x-auto/);
});

test('landing pages use the shared blur-free viewport reveal system only', async () => {
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

  assert.match(app, /const pageCardSelectors/);
  assert.match(app, /const animatedLandingPaths = new Set\(\[/);
  assert.match(app, /'\/areas-of-law'/);
  assert.match(app, /'\/nigerian-laws'/);
  assert.match(app, /'\/courtroom-practicals'/);
  assert.match(app, /'\/learning'/);
  assert.match(app, /if \(!animatedLandingPaths\.has\(pathname\)\)/);
  assert.match(app, /pathname\.startsWith\('\/documents\/'\)/);
  assert.doesNotMatch(app, /pathname\.startsWith\('\/documents\/'\).*animatedLandingPaths/);
  assert.match(app, /MutationObserver/);
  assert.match(app, /\.lawpex-report-page/);

  const revealRule = css.slice(css.indexOf('.lawpex-reveal {'), css.indexOf('.lawpex-reveal-in {'));
  assert.doesNotMatch(revealRule, /blur|filter/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const courtRules = await readFile(
    new URL('../src/components/modules/CourtRulesView.tsx', import.meta.url),
    'utf8',
  );
  const laws = await readFile(
    new URL('../src/components/modules/NigerianLawsView.tsx', import.meta.url),
    'utf8',
  );
  assert.match(courtRules, /data-lawpex-reveal/);
  assert.match(courtRules, /lawpex-no-reveal w-10 h-10/);
  assert.match(laws, /data-lawpex-reveal/);
  assert.match(laws, /lawpex-no-reveal w-10 h-10/);
});
