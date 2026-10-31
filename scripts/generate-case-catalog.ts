import { readFile, writeFile } from 'node:fs/promises';
import { LANDMARK_CASES } from '../src/data/legalData.ts';

// Keep the landing page independent of full ratios, opinions and reader code.
const catalog = LANDMARK_CASES.map(({ id, title, citation, court, year, areaOfLaw, subject, isLandmark }) => ({
  id, title, citation, court, year, areaOfLaw, subject, isLandmark,
  factsSummary: '', keyPrinciples: [], ratioDecidendi: [],
}));
const output = new URL('../src/data/caseCatalog.json', import.meta.url);
const json = `${JSON.stringify(catalog, null, 2)}\n`;
if (await readFile(output, 'utf8').catch(() => '') !== json) await writeFile(output, json);
console.log(`Case catalogue: ${catalog.length} cases, ${Buffer.byteLength(json)} bytes.`);
