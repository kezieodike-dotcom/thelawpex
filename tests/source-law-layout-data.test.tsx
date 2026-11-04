import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { hashLegalText, LegalPageText } from '../src/components/LegalPageText';

function pages(name: string) {
  let text: string;
  try { text = readFileSync(new URL(`../src/data/${name}.txt`, import.meta.url), 'utf8'); }
  catch {
    const source = readFileSync(new URL(`../src/data/${name}.ts`, import.meta.url), 'utf8');
    text = JSON.parse(source.match(/export const \w+\s*=\s*(.*);\s*$/s)![1]);
  }
  return new Map(text.replace(/\r\n?/g, '\n').split(/(?=^## Page \d+\s*$)/m).flatMap(chunk => {
    const match = chunk.match(/^## Page (\d+)\s*\n([\s\S]*)$/);
    return match ? [[match[1], match[2]] as [string, string]] : [];
  }));
}

test('every registered law and rule layout preserves its canonical lines and source PDF binding', () => {
  const documents = [
    ['cama-note-book-full-version', 'camaNoteBookFullVersionText', 'laws'],
    ['supreme-court-rules-2024', 'supremeCourtRules2024Text', 'court-rules'],
    ['court-of-appeal-rules-2021', 'courtOfAppealRules2021Text', 'court-rules'],
    ['constitution-1999-as-amended', 'constitution1999Text', 'laws'],
    ['oaths-act', 'oathsActText', 'laws'],
    ['fundamental-rights-enforcement-procedure-rules-2009', 'fundamentalRightsEnforcementProcedureRules2009Text', 'laws'],
    ['efcc-act-2004', 'efccAct2004Text', 'laws'],
    ['fccpa-2018', 'fccpa2018Text', 'laws'],
    ['stamp-duties-act', 'stampDutiesActText', 'laws'],
    ['civil-aviation-act-2022', 'civilAviationAct2022Text', 'laws'],
    ['electoral-act-2026', 'electoralAct2026Text', 'laws'],
  ];
  const registered = JSON.parse(readFileSync(new URL('../src/data/legalSourceLayouts.json', import.meta.url), 'utf8'));
  assert.deepEqual([...registered].sort(), documents.map(([name]) => name).sort());
  for (const [name, textName, directory] of documents) {
    const text = pages(textName);
    const layout = JSON.parse(readFileSync(new URL(`../public/documents/layouts/${name}.json`, import.meta.url), 'utf8'));
    const pdf = readFileSync(new URL(`../public/documents/${directory}/${name}.pdf`, import.meta.url));
    assert.equal(layout.sourceSha256, createHash('sha256').update(pdf).digest('hex'), name);
    for (const [number, page] of Object.entries(layout.pages) as [string, any][]) {
      const original = text.get(number);
      assert.notEqual(original, undefined, `${name} ${number}: canonical source page exists`);
      assert.equal(page.textHash, hashLegalText(original!), `${name} ${number}: source text unchanged`);
      const indices = original!.split('\n').flatMap((line, index) => line.trim() ? [index] : []);
      assert.deepEqual(page.lines.map((line: any) => line.index).sort((a: number, b: number) => a-b), indices, `${name} ${number}: every line exactly once`);
    }
  }
});

test('CAMA source coordinates cover every canonical nonempty line exactly once', () => {
  const text = pages('camaNoteBookFullVersionText');
  const layout = JSON.parse(readFileSync(new URL('../public/documents/layouts/cama-note-book-full-version.json', import.meta.url), 'utf8'));
  assert.ok(Object.keys(layout.pages).length > 500);
  for (const [number, page] of Object.entries(layout.pages) as [string, any][]) {
    const original = text.get(number)!;
    assert.equal(page.textHash, hashLegalText(original), `CAMA ${number}: source binding`);
    const indices = original.split('\n').flatMap((line, index) => line.trim() ? [index] : []);
    assert.deepEqual(page.lines.map((line: any) => line.index).sort((a: number, b: number) => a-b), indices, `CAMA ${number}: no missing or duplicated text`);
  }
});

test('actual CAMA left and right annotations remain outside the main legal text', () => {
  const text = pages('camaNoteBookFullVersionText');
  const layout = JSON.parse(readFileSync(new URL('../public/documents/layouts/cama-note-book-full-version.json', import.meta.url), 'utf8'));
  for (const [number, side, label] of [['34', 'left', 'Tenure of office and vacancy on the Board.'], ['35', 'right', 'Functions of the Board.']]) {
    const html = renderToStaticMarkup(<LegalPageText text={text.get(number)!} pageNumber={Number(number)} sourceLayout={layout.pages[number]} />);
    assert.ok(html.includes(`data-source-note-side="${side}"`));
    assert.ok(html.includes(label));
    const body = [...html.matchAll(/<p[^>]*data-legal-paragraph[^>]*>(.*?)<\/p>/gs)].map(match => match[1]).join(' ');
    assert.ok(!body.includes(label));
  }
});

test('the Supreme Court Order 2 example keeps all six annotations out of the rule body', () => {
  const text = pages('supremeCourtRules2024Text');
  const layout = JSON.parse(readFileSync(new URL('../public/documents/layouts/supreme-court-rules-2024.json', import.meta.url), 'utf8'));
  const html = renderToStaticMarkup(<LegalPageText text={text.get('12')!} pageNumber={12} sourceLayout={layout.pages['12']} />);
  assert.ok(html.includes('data-source-layout="true"'));
  const notes = [...html.matchAll(/<aside[^>]*>(.*?)<\/aside>/gs)].map(match => match[1].replace(/<[^>]*>/g, '')).join(' ');
  for (const label of ['Chief Registrar.', 'Other Registrars.', 'Powers of the Chief Registrar.', 'Seal of the Court.', 'Custody of the Seal.', 'Books to be kept by the Registrar.']) {
    assert.ok(notes.includes(label), label);
  }
  const body = [...html.matchAll(/<p[^>]*data-legal-paragraph[^>]*>(.*?)<\/p>/gs)].map(match => match[1]).join(' ');
  assert.ok(body.includes('1. The Chief Registrar shall have custody of the records of the Court both physical and electronic'));
  assert.ok(!body.includes('Books to be'));
});
