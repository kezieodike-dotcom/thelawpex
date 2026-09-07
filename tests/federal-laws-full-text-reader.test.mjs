import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

const requestedLaws = [
  {
    id: 'electoral-act-2026',
    title: 'Electoral Act 2026',
    textImport: 'electoralAct2026Text',
    textPath: 'src/data/electoralAct2026Text.txt',
    documentPath: '/documents/laws/electoral-act-2026.pdf',
    pdfPath: 'public/documents/laws/electoral-act-2026.pdf',
    requiredText: /ELECTORAL ACT|Electoral Act/i,
  },
  {
    id: 'civil-aviation-2022',
    title: 'Civil Aviation Act 2022',
    textImport: 'civilAviationAct2022Text',
    textPath: 'src/data/civilAviationAct2022Text.txt',
    documentPath: '/documents/laws/civil-aviation-act-2022.pdf',
    pdfPath: 'public/documents/laws/civil-aviation-act-2022.pdf',
    requiredText: /CIVIL AVIATION ACT|Civil Aviation Act/i,
  },
  {
    id: 'national-industrial-court-act',
    title: 'National Industrial Court Act',
    textImport: 'nationalIndustrialCourtActText',
    textPath: 'src/data/nationalIndustrialCourtActText.txt',
    documentPath: '/documents/laws/national-industrial-court-act.pdf',
    pdfPath: 'public/documents/laws/national-industrial-court-act.pdf',
    requiredText: /NATIONAL INDUSTRIAL COURT ACT|National Industrial Court Act/i,
  },
  {
    id: 'cama-2020',
    title: 'Companies and Allied Matters Act 2020',
    textImport: 'camaNoteBookFullVersionText',
    textPath: 'src/data/camaNoteBookFullVersionText.txt',
    documentPath: '/documents/laws/cama-note-book-full-version.pdf',
    pdfPath: 'public/documents/laws/cama-note-book-full-version.pdf',
    requiredText: /COMPANIES AND ALLIED MATTERS ACT|CAMA/i,
  },
];

test('the requested Laws of the Federation documents are registered with full text readers', async () => {
  const laws = await readFile(projectFile('src/data/lawsLibrary.ts'), 'utf8');

  for (const law of requestedLaws) {
    assert.match(laws, new RegExp(`import \\{ ${law.textImport} \\}`));
    assert.match(laws, new RegExp(`id: '${law.id}'[\\s\\S]*title: '${law.title}'`));
    assert.match(
      laws,
      new RegExp(`id: '${law.id}'[\\s\\S]*documentPath: '${law.documentPath.replaceAll('/', '\\/')}'`),
    );
    assert.match(laws, new RegExp(`id: '${law.id}'[\\s\\S]*documentPages: \\d+`));
    assert.match(laws, new RegExp(`id: '${law.id}'[\\s\\S]*documentText: ${law.textImport}`));

    const pdf = await stat(projectFile(law.pdfPath));
    assert.ok(pdf.size > 100_000, `${law.pdfPath} should contain the uploaded source PDF`);

    const text = await readFile(projectFile(law.textPath), 'utf8');
    assert.match(text, /## Page 1/);
    assert.match(text, law.requiredText);
    assert.ok(text.length > 10_000, `${law.textPath} should contain the full extracted document text`);
  }
});

test('the federal laws page renders full law text before falling back to PDF-only display', async () => {
  const view = await readFile(projectFile('src/components/modules/NigerianLawsView.tsx'), 'utf8');

  assert.match(view, /law\.documentText \?/);
  assert.match(view, /OfficialTextReader/);
  assert.match(view, /documentText=\{law\.documentText\}/);
});
