import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('official text reader keeps raw text while using a more readable legal-document layout', async () => {
  const reader = await readFile(projectFile('src/components/OfficialTextReader.tsx'), 'utf8');

  assert.match(reader, /fontFamily: legalDocumentFont/);
  assert.match(reader, /const legalDocumentFont =/);
  assert.match(reader, /max-w-5xl/);
  assert.match(reader, /leading-\[1\.9\]/);
  assert.match(reader, /text-\[16px\]/);
  assert.match(reader, /sm:text-\[17px\]/);
  assert.match(reader, /whitespace-pre-wrap/);
  assert.match(reader, /page.rawText/);
  assert.match(reader, /Page \{page\.pageNumber\}/);
});
