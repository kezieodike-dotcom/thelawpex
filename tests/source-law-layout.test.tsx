import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as renderer from '../src/components/LegalPageText';

test('source layout fingerprints are stable and detect text changes', () => {
  assert.equal(typeof (renderer as any).hashLegalText, 'function');
  assert.equal((renderer as any).hashLegalText('hello'), '4f9f2cab');
  assert.notEqual((renderer as any).hashLegalText('hello'), (renderer as any).hashLegalText('Hello'));
});

test('PDF margin coordinates attach late-extracted notes to their own provisions on either side', () => {
  const text = '4. The Board shall perform its functions.\n(a) It shall review the policy.\n5. Members shall be paid allowances.\nFunctions of\nthe Board.\nRemuneration\nof members.';
  const hash = (renderer as any).hashLegalText;
  assert.equal(typeof hash, 'function');
  const lines = [
    { index: 0, x: 120, y: 100, height: 12, side: 'body' },
    { index: 1, x: 120, y: 120, height: 12, side: 'body' },
    { index: 2, x: 120, y: 200, height: 12, side: 'body' },
    { index: 3, x: 444, y: 100, height: 10, side: 'right' },
    { index: 4, x: 444, y: 110, height: 10, side: 'right' },
    { index: 5, x: 40, y: 200, height: 10, side: 'left' },
    { index: 6, x: 40, y: 210, height: 10, side: 'left' },
  ];
  const html = renderToStaticMarkup(React.createElement(renderer.LegalPageText, {
    text, pageNumber: 35, sourceLayout: { textHash: hash(text), lines },
  } as any));
  assert.ok(html.includes('data-source-layout="true"'));
  assert.ok(html.includes('data-source-note-side="left"'));
  assert.ok(html.includes('data-source-note-side="right"'));
  const first = html.slice(html.indexOf('data-source-block="0"'), html.indexOf('data-source-block="1"'));
  assert.ok(first.includes('Functions of the Board.'));
  assert.ok(!first.includes('Remuneration'));
  assert.ok(!/<p[^>]*data-legal-paragraph[^>]*>[^<]*Functions/.test(html));
});

test('source-free text does not guess marginal annotations from legal words', () => {
  const html = renderToStaticMarkup(<renderer.LegalPageText pageNumber={1} text={'Functions of the Commission.\nThe Commission has the following duties.'} />);
  assert.ok(!html.includes('<aside'));
  assert.ok(html.includes('Functions of the Commission.'));
});

test('stale or invalid coordinate data cannot hide any original words', () => {
  const text = 'The original statutory words must remain visible.';
  for (const sourceLayout of [
    { textHash: 'stale', lines: [{ index: 0, x: 0, y: 0, height: 10, side: 'left' }] },
    { textHash: renderer.hashLegalText(text), lines: [{ index: 0, x: 0, y: 0, height: 10, side: 'unknown' }] },
  ]) {
    const html = renderToStaticMarkup(React.createElement(renderer.LegalPageText, { text, pageNumber: 1, sourceLayout } as any));
    assert.ok(html.includes(text));
    assert.ok(!html.includes('data-source-layout="true"'));
  }
});
