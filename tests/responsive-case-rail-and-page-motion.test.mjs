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

test('non-home module cards use the shared blur-free viewport reveal system', async () => {
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

  assert.match(app, /const pageCardSelectors/);
  assert.match(app, /MutationObserver/);
  assert.match(app, /\.lawpex-report-page/);
  assert.doesNotMatch(app, /if \(pathname !== HOME_ROUTE\.path\)/);

  const revealRule = css.slice(css.indexOf('.lawpex-reveal {'), css.indexOf('.lawpex-reveal-in {'));
  assert.doesNotMatch(revealRule, /blur|filter/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
