import assert from 'node:assert/strict';
import test from 'node:test';
import { ratioSourceReferenceFromText } from '../src/lib/ratioSourceReference';

test('reads a single cited page and paragraph', () => {
  assert.deepEqual(
    ratioSourceReferenceFromText('Per ATANDA FATAI-WILLIAMS, JSC (P. 10, para. F)'),
    { page: 10, paragraph: 'F' },
  );
});

test('uses the starting location for a page and paragraph range', () => {
  assert.deepEqual(
    ratioSourceReferenceFromText('Per ATANDA FATAI-WILLIAMS, JSC (Pp. 11-12, paras. A-B)'),
    { page: 11, paragraph: 'A' },
  );
});

test('supports typographic range separators and long labels', () => {
  assert.deepEqual(
    ratioSourceReferenceFromText('Per TEST, J.S.C. (Pages 22–23, paragraphs G–C)'),
    { page: 22, paragraph: 'G' },
  );
});

test('does not create an unverified source reference', () => {
  assert.equal(ratioSourceReferenceFromText('Per TEST, J.S.C.'), undefined);
});
