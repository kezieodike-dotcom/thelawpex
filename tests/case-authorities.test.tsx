import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { LANDMARK_CASES } from '../src/data/legalData';
import { createCaseAuthorityResolver } from '../src/lib/caseAuthorities';
import { CitedCasesList } from '../src/components/CitedCasesList';

test('a referred Idundun case uses its LAWPEX report instead of the source law report', () => {
  const resolve = createCaseAuthorityResolver(LANDMARK_CASES);
  for (const reference of ['Idundun v. Okumagba (1976) 9-10 SC 227', 'IDUNDUN & ORS. VS OKUMAGBA & ORS.', 'Idundun v. Okumagba']) {
    assert.deepEqual(resolve(reference), { text: 'Idundun & Ors v. Okumagba & Ors (1976) LDLR-1012 (S.C)', caseId: 'case-001' });
  }
});

test('missing reports keep their original references and become links when published', () => {
  const reference = 'Bello v. Eweka (1981) 1 SC 101';
  assert.deepEqual(createCaseAuthorityResolver(LANDMARK_CASES)(reference), { text: reference });
  const published = { id: 'ingested-bello', title: 'Bello v. Eweka', year: 1981, court: 'Supreme Court of Nigeria', citation: '(1981) LDLR-500 (S.C)' };
  assert.deepEqual(createCaseAuthorityResolver([...LANDMARK_CASES, published])(reference), { text: 'Bello v. Eweka (1981) LDLR-500 (S.C)', caseId: 'ingested-bello' });
  assert.deepEqual(createCaseAuthorityResolver(LANDMARK_CASES)(reference), { text: reference });
});

test('the same parties at different courts are distinguished by year and court, never guessed', () => {
  const resolve = createCaseAuthorityResolver(LANDMARK_CASES);
  assert.equal(resolve('Amayo v. Erinmwingbovo (2000) 2 NWLR 1').caseId, 'case-013');
  assert.equal(resolve('Amayo v. Erinmwingbovo (2006) 11 SC 1').caseId, 'case-018');
  assert.equal(resolve('Amayo v. Erinmwingbovo').caseId, undefined);
  assert.equal(resolve('Amayo v. Erinmwingbovo (2001) 2 NWLR 1').caseId, undefined);
  assert.equal(resolve('Amayo v. Erinmwingbovo (2006) (C.A)').caseId, undefined);
  assert.equal(resolve('Idundun v. A Different Party (1976) 9 SC 227').caseId, undefined);
  assert.equal(resolve('As cited in the full source judgment').caseId, undefined);
});

test('duplicate editions do not silently select a different judgment and valid LDLR references resolve', () => {
  const original = LANDMARK_CASES.find(judgment => judgment.id === 'case-001')!;
  const other = { ...original, id: 'ingested-other', citation: '(1976) LDLR-2000 (S.C)' };
  const resolve = createCaseAuthorityResolver([...LANDMARK_CASES, other]);
  assert.equal(resolve('Idundun v. Okumagba (1976) 9-10 SC 227').caseId, undefined);
  assert.equal(resolve('Idundun v. Okumagba (1976) LDLR-1012 (SC)').caseId, 'case-001');
  assert.equal(resolve('Idundun v. Okumagba (1976) LDLR-9999 (SC)').caseId, undefined);
});

test('authority cards link only published matches with readable LAWPEX text', () => {
  const resolve = createCaseAuthorityResolver(LANDMARK_CASES);
  const html = renderToStaticMarkup(<MemoryRouter><CitedCasesList items={[
    resolve('Idundun v. Okumagba (1976) 9-10 SC 227'),
    resolve('Bello v. Eweka (1981) 1 SC 101'),
  ]} /></MemoryRouter>);
  assert.match(html, /href="\/case-law\/case\/case-001"/);
  assert.ok(html.includes('(1976) LDLR-1012 (S.C)'));
  assert.ok(!html.includes('9-10 SC 227'));
  assert.ok(html.includes('Bello v. Eweka (1981) 1 SC 101'));
  assert.equal((html.match(/<a /g) ?? []).length, 1);
});
