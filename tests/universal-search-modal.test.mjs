import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the universal search modal keeps mobile filters and results readable', async () => {
  const source = await readFile(
    new URL('../src/components/UniversalSearchModal.tsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /aria-label="Filter search results"/);
  assert.match(source, /lawpex-scrollbar-hide/);
  assert.match(source, /aria-pressed=\{filterType === filter\.id\}/);
  assert.doesNotMatch(source, /score \{score\}/);
  assert.doesNotMatch(source, /block truncate text-xs/);
});
