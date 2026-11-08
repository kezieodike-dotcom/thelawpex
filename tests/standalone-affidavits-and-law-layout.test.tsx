import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AffidavitsView } from '../src/components/modules/AffidavitsView';
import { LegalDocumentReader } from '../src/components/ConstitutionReader';
import { LegalPageText } from '../src/components/LegalPageText';

const render = (element: React.ReactNode) => renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>);

test('affidavit directory lists standalone documents directly, without litigation-process samples', () => {
  const html = render(<AffidavitsView onCustomizeDraft={() => {}} />);
  assert.ok(html.includes('Affidavit for Change of Name'));
  assert.ok(html.includes('Affidavit of Loss of Document'));
  assert.ok(!html.includes('Affidavit in Support of Bail Application'));
  assert.ok(!html.includes('Counter Affidavit (Opposing a Motion)'));
  assert.ok(!html.includes('Verifying Affidavit (Originating Summons / Petition)'));
  assert.ok(html.includes('/affidavits/deposition/'));
  assert.ok(html.includes('/affidavits/agreement/'));
});

test('both Constitution routes omit source pages one to five and retain subsequent source numbers', () => {
  const text = readFileSync(new URL('../src/data/constitution1999Text.txt', import.meta.url), 'utf8');
  for (const documentId of ['constitution', 'const-1999']) {
    const html = render(<LegalDocumentReader documentId={documentId} documentText={text} />);
    for (let page = 1; page <= 5; page++) assert.ok(!html.includes(`data-page-number="${page}"`));
    assert.ok(html.includes('data-page-number="7"'));
    assert.ok(html.includes('data-page-number="280"'));
  }
});

test('law paragraphs join PDF-wrapped lines and keep numbered provisions in separate paragraphs', () => {
  const text = '## Page 1\n1. A person shall provide\nthe documents required\nby this Act.\n\n2. The Commission shall\nkeep proper records.';
  const html = render(<LegalDocumentReader documentId="sample-law" documentText={text} />);
  assert.match(html, /1\. A person shall provide the documents required by this Act\./);
  assert.match(html, /2\. The Commission shall keep proper records\./);
  assert.equal((html.match(/data-legal-paragraph=/g) ?? []).length, 2);
});

test('plain text retains every extracted line without guessing which words are margin notes', () => {
  const text = '## Page 1\nForm of\napplication.\n1. Every application to the Court\nshall be by motion on notice\nstating the grounds relied upon.';
  const html = render(<LegalDocumentReader documentId="sample-law" documentText={text} />);
  assert.match(html, /1\. Every application to the Court shall be by motion on notice stating the grounds relied upon\./);
  assert.ok(html.includes('Form of application.'));
});

test('section anchors survive paragraph reflow', () => {
  const html = render(<LegalDocumentReader documentId="sample-law" documentText={'## Page 1\nCHAPTER I\nGeneral\n1. Supremacy of this Act\nA person shall comply\nwith these provisions.'} />);
  assert.ok(html.includes('id="sample-law-section-1"'));
  assert.match(html, /A person shall comply with these provisions\./);
});

test('wrapped uppercase headings flow together and operative sentences are never marginal notes', () => {
  const html = render(<LegalPageText pageNumber={1} text={'AN ACT TO PROVIDE\nFOR THE REGISTRATION OF COMPANIES\n\nFormal notices are required.\n\nTime to comply shall be ten days.'} />);
  assert.match(html, /AN ACT TO PROVIDE FOR THE REGISTRATION OF COMPANIES/);
  assert.ok(!html.includes('<aside'));
});
