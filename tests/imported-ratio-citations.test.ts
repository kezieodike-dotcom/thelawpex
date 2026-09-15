import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { LANDMARK_CASES } from '../src/data/legalData.ts';
import {
  auditCaseRatioCitations,
  paginateCaseSourceForAudit,
} from '../src/components/modules/CaseLawView.tsx';

const importedCaseIds = ['case-008', 'case-009', 'case-010', 'case-011', 'case-012'];

const loadImportedCase = async (caseId: string) => {
  const metadata = LANDMARK_CASES.find((item) => item.id === caseId);
  assert.ok(metadata, `Missing metadata for ${caseId}`);

  const document = JSON.parse(
    await readFile(new URL(`../src/data/judgments/${caseId}.json`, import.meta.url), 'utf8'),
  );

  return { ...metadata, ...document };
};

test('every imported ratio resolves to a current report page and paragraph', async () => {
  for (const caseId of importedCaseIds) {
    const judgment = await loadImportedCase(caseId);
    const audit = auditCaseRatioCitations(judgment);

    assert.equal(
      audit.length,
      judgment.ratioDecidendi.length,
      `${caseId} should expose only its declared ratio points`,
    );

    audit.forEach((ratio, index) => {
      assert.equal(
        ratio.heading.replace(/\s+/g, ' '),
        judgment.ratioDecidendi[index].split(/\r?\n/)[0].replace(/\s+/g, ' ').trim(),
        `${caseId} ratio ${index + 1} should keep only the legal proposition in its heading`,
      );
      assert.match(
        ratio.attribution,
        /\(Pp?\. \d+(?:-\d+)?, paras?\. [A-G](?:-[A-G])?\)/,
        `${caseId} ratio ${index + 1} is missing a complete report citation`,
      );
      assert.doesNotMatch(
        ratio.attribution,
        /\(Pp\. \d+-\d+, para\. [A-G]\)/,
        `${caseId} ratio ${index + 1} must show both paragraph markers when it spans pages`,
      );
      assert.equal(ratio.resolved, true, `${caseId} ratio ${index + 1} did not match the judgment`);
    });
  }
});

test('every ratio in the complete case library has a populated report citation', async () => {
  for (const metadata of LANDMARK_CASES) {
    const judgment = await loadImportedCase(metadata.id);
    const audit = auditCaseRatioCitations(judgment);

    assert.ok(audit.length > 0, `${metadata.id} should expose at least one ratio`);
    audit.forEach((ratio, index) => {
      assert.equal(ratio.resolved, true, `${metadata.id} ratio ${index + 1} did not match the judgment`);
      assert.match(
        ratio.attribution,
        /\(Pp?\. \d+(?:-\d+)?, paras?\. [A-G](?:-[A-G])?\)/,
        `${metadata.id} ratio ${index + 1} has an incomplete report citation`,
      );
    });
  }
});

test('imported source pagination splits oversized text blocks', async () => {
  for (const caseId of importedCaseIds) {
    const judgment = await loadImportedCase(caseId);
    const pages = paginateCaseSourceForAudit(judgment);

    assert.ok(pages.length > 1, `${caseId} should be paginated`);
    pages.forEach((page, index) => {
      assert.ok(
        page.characterCount <= 5_500,
        `${caseId} page ${index + 2} is oversized at ${page.characterCount} characters`,
      );
    });
  }
});
