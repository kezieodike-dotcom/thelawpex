import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('affidavit module is renamed to sample agreements and affidavits', async () => {
  const routes = await readFile(projectFile('src/routes.ts'), 'utf8');
  const home = await readFile(projectFile('src/components/HomeView.tsx'), 'utf8');
  const view = await readFile(projectFile('src/components/modules/AffidavitsView.tsx'), 'utf8');

  assert.match(routes, /label: 'Sample Agreements and Affidavits'/);
  assert.match(routes, /title: `Sample Agreements and Affidavits/);
  assert.doesNotMatch(routes, /All Manner of Affidavits/);
  assert.match(home, /Sample Agreements and Affidavits/);
  assert.doesNotMatch(home, /All Manner of Affidavits/);
  assert.match(view, /SAMPLE AGREEMENTS AND AFFIDAVITS/);
  assert.doesNotMatch(view, /All Manner of Affidavits/);
});

test('opened module separates sample agreements from sample affidavits', async () => {
  const view = await readFile(projectFile('src/components/modules/AffidavitsView.tsx'), 'utf8');

  assert.match(view, /SAMPLE_AGREEMENTS/);
  assert.match(view, /Sample agreements/);
  assert.match(view, /Sample affidavits/);
  assert.match(view, /grid-cols-1 lg:grid-cols-\[minmax\(0,0\.9fr\)_minmax\(0,1\.1fr\)\]/);
  assert.match(view, /AgreementCard/);
  assert.match(view, /AffidavitCard/);
});

test('uploaded MOU is listed as an original agreement document', async () => {
  const view = await readFile(projectFile('src/components/modules/AffidavitsView.tsx'), 'utf8');

  assert.match(view, /agreement-mou-turve-anambra-tech/);
  assert.match(view, /MOU Turve Anambra Tech/);
  assert.match(view, /\/documents\/agreements\/mou-turve-anambra-tech\.docx/);
  assert.match(view, /Download original DOCX/);
});
