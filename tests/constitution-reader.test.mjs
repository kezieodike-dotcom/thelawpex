import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('the Constitution reader is sourced from all 280 extracted PDF pages', async () => {
  const text = await readFile(projectFile('src/data/constitution1999Text.txt'), 'utf8');
  const pages = [...text.matchAll(/^## Page (\d+)\s*$/gm)].map((match) => Number(match[1]));

  assert.equal(pages.length, 280);
  assert.deepEqual([pages[0], pages.at(-1)], [1, 280]);
  assert.match(text, /CHAPTER I/);
  assert.match(text, /SCHEDULES/);
  assert.match(text, /33\.\s+Right to life/);
});

test('the Constitution has a dedicated reader route and document-derived controls', async () => {
  const app = await readFile(projectFile('src/App.tsx'), 'utf8');
  const reader = await readFile(projectFile('src/components/ConstitutionReader.tsx'), 'utf8');

  assert.match(app, /path="\/constitution"/);
  assert.match(app, /path="\/constitution\/:sectionId"/);
  assert.match(app, /constitution1999Text/);
  assert.match(reader, /placeholder={`Search \$\{title\}`}/);
  assert.match(reader, /Reading theme/);
  assert.match(reader, /constitution-bookmarks/);
  assert.match(reader, /Schedules/);
  assert.match(reader, /Source order preserved/);
});
