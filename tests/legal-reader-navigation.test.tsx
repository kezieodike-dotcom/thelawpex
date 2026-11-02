import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { LegalDocumentReader } from '../src/components/ConstitutionReader';
import { OfficialTextReader } from '../src/components/OfficialTextReader';

const renderReader = (documentText: string) => renderToStaticMarkup(
  <MemoryRouter><LegalDocumentReader documentId="sample-law" title="Sample source" documentText={documentText} /></MemoryRouter>,
);

test('a short single-page law does not opt into fast reader navigation', () => {
  assert.ok(!renderReader('## Page 1\nShort source text.').includes('data-long-text-reader'));
});

test('a multi-page law or rule opts into fast reader navigation', () => {
  assert.ok(renderReader('## Page 1\nFirst source page.\n## Page 2\nSecond source page.').includes('data-long-text-reader'));
});

test('a long single-page legal text opts into fast reader navigation', () => {
  assert.ok(renderReader('## Page 1\n' + 'Source text paragraph. '.repeat(400)).includes('data-long-text-reader'));
});

test('the embedded official text reader only opts in for long documents', () => {
  const short = renderToStaticMarkup(<OfficialTextReader title="Sample source" documentText="Short source text." />);
  const long = renderToStaticMarkup(<OfficialTextReader title="Sample source" documentText={'Source text paragraph. '.repeat(400)} />);
  assert.ok(!short.includes('data-long-text-reader'));
  assert.ok(long.includes('data-long-text-reader'));
});
