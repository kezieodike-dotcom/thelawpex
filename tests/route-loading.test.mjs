import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('route loading reserves space without displaying the LAWPEX loading card', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const fallback = app.match(/const LegalDocumentFallback = \(\) => \(([\s\S]*?)\n\);/)?.[1];
  assert.ok(fallback, 'The shared route fallback should exist');
  assert.doesNotMatch(fallback, /Loading LAWPEX|rounded-lg|shadow-sm/);
  assert.match(fallback, /aria-busy="true"/);
  assert.match(fallback, /min-h-\[55vh\]/);
});
