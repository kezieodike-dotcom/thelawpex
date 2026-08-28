import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Adekunle leading judgment heading is a single detectable source block', async () => {
  const judgment = JSON.parse(
    await readFile(new URL('../src/data/judgments/case-004.json', import.meta.url), 'utf8'),
  );

  assert.match(
    judgment.fullJudgmentText,
    /MAHMUD MOHAMMED, J\.S\.C\.\s+\(Delivering the Leading Judgment\):\n\nA\tThe appellant/i,
  );
  assert.equal(
    judgment.preserveSourceFormatting,
    true,
    'Adekunle must use compact source pagination instead of sparse imported pages',
  );

  const caseView = await readFile(
    new URL('../src/components/modules/CaseLawView.tsx', import.meta.url),
    'utf8',
  );
  assert.match(caseView, /denseSourceJudgmentIds = new Set\(\['case-003', 'case-004'\]\)/);
});
