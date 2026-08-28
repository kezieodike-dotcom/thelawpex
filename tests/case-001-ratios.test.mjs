import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const wrongfulAdmissionHeading =
  'EVIDENCE - WRONGFUL ADMISSION/REJECTION OF EVIDENCE - Whether a wrongfully admitted/excluded evidence could constitute a ground for reversing a decision on appeal';
const titleHeading =
  'EVIDENCE - PROOF OF TITLE TO LAND - Ways of proving title/ownership of land';

test('Idundun contains only the two supplied ratios with their authoritative citations', async () => {
  const judgment = JSON.parse(
    await readFile(new URL('../src/data/judgments/case-001.json', import.meta.url), 'utf8'),
  );
  const source = judgment.fullJudgmentText.replace(/\r\n/g, '\n');
  const leadingIndex = source.indexOf('ATANDA FATAYI-WILLIAMS, J.S.C. (Delivering the Leading Judgment):');
  const ratioSection = source.slice(source.indexOf('RATIO DECIDENDI'), leadingIndex);

  assert.match(source, /^D\.O\. IDUNDUN & ORS v\. DANIEL OKUMAGBA/);
  assert.match(source, /\(1976\) LDLR \(SC\) pt 1012/);
  assert.equal((ratioSection.match(/^EVIDENCE - /gm) ?? []).length, 2);
  assert.ok(ratioSection.indexOf(wrongfulAdmissionHeading) < ratioSection.indexOf(titleHeading));
  assert.match(ratioSection, /Per ATANDA FATAI-WILLIAMS ,JSC \(P\. 10, para\. F\)/);
  assert.match(ratioSection, /Per ATANDA FATAI-WILLIAMS ,JSC \(Pp\. 11-12, paras\. A-A\)/);

  const paginatedParagraphs = judgment.judgmentPages.flatMap((page) => page.paragraphs);
  assert.match(paginatedParagraphs[0], /^D\.O\. IDUNDUN & ORS v\. DANIEL OKUMAGBA/);
  assert.equal(paginatedParagraphs.filter((text) => /^RATIO DECIDENDI$/i.test(text)).length, 1);
  const paginatedRatioIndex = paginatedParagraphs.indexOf('RATIO DECIDENDI');
  const paginatedLeadIndex = paginatedParagraphs.findIndex((text) =>
    /^ATANDA FATAYI-WILLIAMS, J\.S\.C\. \(Delivering the Leading Judgment\):/.test(text),
  );
  const paginatedRatios = paginatedParagraphs.slice(paginatedRatioIndex, paginatedLeadIndex);
  assert.equal(paginatedRatios.filter((text) => /^EVIDENCE - /.test(text)).length, 2);
  assert.ok(paginatedRatios.includes('Per ATANDA FATAI-WILLIAMS ,JSC (P. 10, para. F)'));
  assert.ok(paginatedRatios.includes('Per ATANDA FATAI-WILLIAMS ,JSC (Pp. 11-12, paras. A-A)'));

  const caseView = await readFile(
    new URL('../src/components/modules/CaseLawView.tsx', import.meta.url),
    'utf8',
  );
  const overrideStart = caseView.indexOf("judgment.id === 'case-001'");
  const overrideEnd = caseView.indexOf("judgment.id === 'case-002'", overrideStart);
  const overrideBlock = caseView.slice(overrideStart, overrideEnd);
  assert.match(overrideBlock, /\(P\. 10, para\. F\)/);
  assert.match(overrideBlock, /\(Pp\. 11-12, paras\. A-A\)/);

  const legalData = await readFile(new URL('../src/data/legalData.ts', import.meta.url), 'utf8');
  const caseStart = legalData.indexOf("id: 'case-001'");
  const caseEnd = legalData.indexOf("id: 'case-002'", caseStart);
  const caseBlock = legalData.slice(caseStart, caseEnd);
  const fallbackMatch = caseBlock.match(/ratioDecidendi:\s*\[([\s\S]*?)\],\s*keyPrinciples:/);
  assert.ok(fallbackMatch, 'case-001 fallback ratios must be present');
  const fallbackRatios = fallbackMatch[1];
  assert.equal((fallbackRatios.match(/^\s*"/gm) ?? []).length, 2);
  assert.match(fallbackRatios, /WRONGFUL ADMISSION\/REJECTION OF EVIDENCE/);
  assert.match(fallbackRatios, /PROOF OF TITLE TO LAND/);
  assert.match(fallbackRatios, /P\. 10, para\. F/);
  assert.match(fallbackRatios, /Pp\. 11-12, paras\. A-A/);
});
