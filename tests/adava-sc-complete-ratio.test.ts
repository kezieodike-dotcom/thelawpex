import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LANDMARK_CASES } from '../src/data/legalData.ts';
import { auditCaseRatioCitations, inspectRatioSources, WholeCasePanel } from '../src/components/modules/CaseLawView.tsx';
import { normalizeQuoteText } from '../src/lib/reportQuoteLocator.ts';

const document = JSON.parse(readFileSync(new URL('../src/data/judgments/case-005.json', import.meta.url), 'utf8'));
const judgment = { ...LANDMARK_CASES.find(item => item.id === 'case-005')!, ...document };
const opinionHeading = 'WALTER SAMUEL NKANU ONNOGHEN, J.S.C. :';
const opinion = judgment.fullJudgmentText.split(opinionHeading)[1];
const opening = 'The law is settled that for an accused person to be convicted';
const quotation = opinion.slice(opinion.indexOf(opening), opinion.indexOf('Section 221 of the Penal Code which creates')).trim();

test('Adava SC ratio four includes every ingredient and the complete source quotation', () => {
  const { ratios } = inspectRatioSources(judgment);
  assert.equal(ratios.length, 4);
  assert.equal(normalizeQuoteText(ratios[3].body), normalizeQuoteText(quotation));
  for (const ingredient of ['(a) that a human being was killed.', '(b) the accused(s) caused the death of the deceased.', '(c) that the act of the accused(s)']) {
    assert.ok(ratios[3].body.includes(ingredient), `missing ingredient: ${ingredient}`);
  }
});

test('Adava SC summary repeats the complete ratio and its citation matches the judicial passage', () => {
  const { pages, correctedPages } = inspectRatioSources(judgment);
  const leadIndex = pages.findIndex(page => page.blocks.some(block => block.startsLeadingJudgment));
  const summary = correctedPages.slice(0, leadIndex).flatMap(page => page.blocks).map(block => block.text).join(' ');
  assert.ok(normalizeQuoteText(summary).includes(normalizeQuoteText(quotation)), 'the summary must include the complete quotation');
  const ratio = auditCaseRatioCitations(judgment)[3];
  assert.ok(ratio.evidence, 'the complete quotation must resolve to the judicial opinion');
  assert.equal(ratio.evidence.coverage, 1);
  assert.match(ratio.attribution, /Per WALTER SAMUEL NKANU ONNOGHEN, J\.S\.C\. \(P\. 7, paras\. F-G\)/);
  assert.equal(ratio.evidence.start.pageNumber, 7);
  assert.equal(ratio.evidence.start.label, 'F');
  assert.equal(ratio.evidence.end.pageNumber, 7);
  assert.equal(ratio.evidence.end.label, 'G');
  assert.ok(summary.includes(ratio.attribution));
  const html = renderToStaticMarkup(React.createElement(WholeCasePanel, { judgment }));
  const headnote = html.slice(0, html.indexOf('Delivering the Leading Judgment'));
  assert.ok(normalizeQuoteText(headnote.replace(/<[^>]*>/g, '')).includes(normalizeQuoteText(quotation)));
});

test('completing the headnote leaves the judicial opinions and their page numbers intact', () => {
  const heading = 'IDRIS LEGBO KUTIGI, J.S.C. (Delivering the Leading Judgment):';
  const body = judgment.fullJudgmentText.slice(judgment.fullJudgmentText.indexOf(heading));
  assert.equal(createHash('sha256').update(body).digest('hex'), 'e3949191e997b40da907f7bd1e785167ee2de4c04ab256350b291da4eb0987be');
  assert.equal(inspectRatioSources(judgment).pages.length + 1, 13);
});
