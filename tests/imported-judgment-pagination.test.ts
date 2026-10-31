import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { LANDMARK_CASES } from '../src/data/legalData.ts';
import { inspectRatioSources } from '../src/components/modules/CaseLawView.tsx';

for (const id of ['case-013', 'case-014', 'case-015', 'case-016', 'case-017', 'case-018']) {
  test(`${id}: judicial pages fill available space without orphaned judge headings`, () => {
    const judgment = {
      ...LANDMARK_CASES.find(c => c.id === id)!,
      ...JSON.parse(readFileSync(new URL(`../src/data/judgments/${id}.json`, import.meta.url), 'utf8')),
    };
    const { pages } = inspectRatioSources(judgment);
    const leadIndex = pages.findIndex(page => page.blocks.some(block => block.startsLeadingJudgment));
    assert.ok(leadIndex >= 0);
    assert.ok(pages[leadIndex].blocks[0].startsLeadingJudgment, 'leading judgment starts a fresh page');
    const judicialPages = pages.slice(leadIndex);
    for (const [index, page] of judicialPages.entries()) {
      if (index === judicialPages.length - 1) continue;
      const last = page.blocks.at(-1)!;
      assert.ok(!(last.startsLeadingJudgment && last.text.length < 180), `page ${leadIndex + index + 2} strands a judge heading`);
      assert.ok(page.blocks.reduce((sum, block) => sum + block.text.length + (block.isHeading ? 220 : 90), 0) >= 4100,
        `page ${leadIndex + index + 2} leaves usable space before more judgment text`);
    }
    const compact = (text: string) => text.replace(/\s+/g, '');
    // Use the established reader's source normalization, including scan-marker cleanup.
    const previousPages = inspectRatioSources({ ...judgment, reportFormatVersion: 'lawpex-reviewed-v1' }).pages;
    const original = compact(previousPages.flatMap(page => page.blocks).map(block => block.text).join(' '));
    const opening = compact(judicialPages[0].blocks[0].text);
    assert.ok(original.includes(opening));
    assert.equal(compact(judicialPages.flatMap(page => page.blocks).map(block => block.text).join(' ')),
      original.slice(original.indexOf(opening)), 'pagination preserves every source character in order');
  });
}
