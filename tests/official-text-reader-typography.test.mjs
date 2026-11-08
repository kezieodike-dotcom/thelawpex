import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OfficialTextReader } from '../src/components/OfficialTextReader.tsx';

test('official text reader keeps raw text while using a more readable legal-document layout', async () => {
  const html = renderToStaticMarkup(React.createElement(OfficialTextReader, {
    title: 'Sample Act',
    documentText: '## Page 1\n\n1. This provision continues\nonto the next extracted line.\n\n2. This is a separate provision.',
  }));
  assert.match(html, /1\. This provision continues onto the next extracted line\./);
  assert.match(html, /2\. This is a separate provision\./);
  assert.equal((html.match(/data-legal-paragraph=/g) ?? []).length, 2);
  assert.match(html, /space-y-6/);
  assert.match(html, /font-size:17px/);
  assert.match(html, /leading-\[1\.85\]/);
  assert.match(html, /Page 1/);
});
