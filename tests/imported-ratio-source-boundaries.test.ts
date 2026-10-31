import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LANDMARK_CASES } from '../src/data/legalData.ts';
import { auditCaseRatioCitations, inspectRatioSources, WholeCasePanel } from '../src/components/modules/CaseLawView.tsx';
import { createQuoteIndex, locateReportQuote, normalizeQuoteText } from '../src/lib/reportQuoteLocator.ts';

const loadCase = (id: string) => ({
  ...LANDMARK_CASES.find(c => c.id === id)!,
  ...JSON.parse(readFileSync(new URL(`../src/data/judgments/${id}.json`, import.meta.url), 'utf8')),
});

test('Mojekwu ratio two cites its actual opening and closing paragraphs', () => {
  const ratios = auditCaseRatioCitations(loadCase('case-008'));
  assert.match(ratios[0].attribution, /\(P\. 16, paras\. A-F\)/);
  assert.match(ratios[1].attribution, /\(Pp\. 16-17, paras\. F-C\)/);
});

test('Fawehinmi recognises Agbaje as the leading judge before the supporting opinions', () => {
  const { targets } = inspectRatioSources(loadCase('case-011'));
  assert.ok(targets[0].pageNumber < 10, 'the leading judgment must start before page ten, not at Obaseki on page 71');
  assert.ok(targets.some(t => t.text.includes("Halsbury")), 'Agbaje judgment must be searchable');
});

test('a missing quotation never resolves to the ratio headnote itself', () => {
  const judgment = loadCase('case-012');
  const phrase = 'This invented sentence is deliberately absent from the judicial opinions.';
  judgment.ratioDecidendi = [`EVIDENCE - PROOF - A missing passage\n"${phrase}"\nPer TEST JUDGE, JCA (P., para.)`];
  judgment.fullJudgmentText = judgment.fullJudgmentText.replace('RATIO DECIDENDI', `RATIO DECIDENDI\n\n${judgment.ratioDecidendi[0]}\n\n`);
  assert.equal(auditCaseRatioCitations(judgment)[0].resolved, false);
});

test('both quote boundaries are required, including the actual final words', () => {
  const body = 'The court must determine the question before it on the evidence presented by the parties. '.repeat(3);
  const ending = 'The appeal is dismissed and the order of the trial court is affirmed.';
  const index = createQuoteIndex([{ pageNumber: 16, label: 'A', text: body }, { pageNumber: 16, label: 'F', text: ending }]);
  const result = locateReportQuote(index, body + ending);
  assert.equal(result?.start.label, 'A');
  assert.equal(result?.end.label, 'F');
  assert.equal(locateReportQuote(index, body + 'This completely unrelated disposition cannot be found anywhere in the original court judgment.'), undefined);
});

const decode = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&(?:amp|lt|gt|quot|#x27|#39);/g, entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'" }[entity]!));

test('short quotations tolerate a bounded source typo, not a changed proposition', () => {
  const quote = 'Estoppel per rem judicatam or estoppel of record arises where an issue of fact has been judicially determined in a final manner between the parties or their privies by a court or tribunal having jurisdiction in the matter and the same issue comes directly in question in subsequent proceedings between the parties or their privies.';
  const index = createQuoteIndex([{pageNumber: 8, label: 'E', text: quote.replace('or estoppel', 'or estopel')}]);
  const match = locateReportQuote(index, quote);
  assert.equal(match?.start.label, 'E');
  assert.ok(match!.coverage > 0.99);
  assert.equal(locateReportQuote(index, quote.replace('having jurisdiction', 'lacking jurisdiction')), undefined);
});

test('explicit ellipses require every quoted segment in source order', () => {
  const opening = 'The conviction of the appellants cannot be upheld on the evidence at trial.';
  const middle = 'By section 218 of the Criminal Procedure Code';
  const ending = 'an accused person can be convicted of a lesser offence even though not charged with it.';
  const index = createQuoteIndex([
    { pageNumber: 7, label: 'A', text: opening, judge: 'KALGO' },
    { pageNumber: 7, label: 'B', text: 'Discussion of the trial evidence. '.repeat(30), judge: 'KALGO' },
    { pageNumber: 7, label: 'C', text: middle + ' Cap. 30 of Laws of Northern Nigeria. ' + ending, judge: 'KALGO' },
  ]);
  const match = locateReportQuote(index, `${opening}... ${middle}... ${ending}`);
  assert.equal(match?.start.label, 'A');
  assert.equal(match?.end.label, 'C');
  assert.equal(locateReportQuote(index, `${opening}... An invented legal proposition that is not in the judgment... ${ending}`), undefined);
  assert.equal(locateReportQuote(index, `${ending}... ${opening}`), undefined);
  assert.equal(locateReportQuote(index, `${opening} ${middle} ${ending}`), undefined, 'unmarked omissions must not be accepted');
});

for (const id of LANDMARK_CASES.map(judgment => judgment.id)) {
  test(`${id}: every citation uses the paragraphs actually rendered, and matches the full-case headnote`, () => {
    const judgment = loadCase(id);
    const { targets, pages, correctedPages } = inspectRatioSources(judgment);
    const ratios = auditCaseRatioCitations(judgment);
    const html = renderToStaticMarkup(React.createElement(WholeCasePanel, { judgment }));
    const renderedTargets: Array<{ pageNumber: number; label: string; text: string }> = [];
    for (const article of html.matchAll(/<article\b[^>]*data-report-page-number="(\d+)"[^>]*>([\s\S]*?)<\/article>/g)) {
      const labels: string[] = [];
      for (const paragraph of article[2].matchAll(/<p\b[^>]*data-paragraph-label="([A-G])"[^>]*>([\s\S]*?)<\/p>/g)) {
        labels.push(paragraph[1]);
        renderedTargets.push({ pageNumber: Number(article[1]), label: paragraph[1], text: decode(paragraph[2]).slice(1) });
      }
      assert.deepEqual(labels, 'ABCDEFG'.slice(0, labels.length).split(''), `page ${article[1]} must have unique, ordered labels starting at A`);
    }
    assert.equal(renderedTargets.length, targets.length);
    targets.forEach((target, i) => {
      assert.equal(renderedTargets[i].pageNumber, target.pageNumber);
      assert.equal(renderedTargets[i].label, target.label);
      assert.equal(normalizeQuoteText(renderedTargets[i].text), normalizeQuoteText(target.text));
    });
    const leadIndex = pages.findIndex(p => p.blocks.some(b => b.startsLeadingJudgment));
    const headnote = correctedPages.slice(0, leadIndex).flatMap(p => p.blocks).map(b => b.text).join(' ').replace(/\s+/g, ' ');
    ratios.forEach((ratio, i) => {
      assert.ok(ratio.evidence, `${id} ratio ${i + 1} needs matched source text`);
      assert.ok(ratio.evidence.coverage >= 0.9);
      assert.ok(ratio.evidence.start.pageNumber >= leadIndex + 2);
      assert.ok(ratio.evidence.end.pageNumber >= ratio.evidence.start.pageNumber);
      assert.ok(headnote.includes(ratio.attribution.replace(/\s+/g, ' ')), `${id} ratio ${i + 1} differs in the full-case headnote: ${ratio.attribution}`);
    });
    assert.deepEqual(correctedPages.slice(leadIndex), pages.slice(leadIndex), 'citation corrections must not rewrite the judgment body');
  });
}
