import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const portServer = createServer();
await new Promise(resolve => portServer.listen(0, '127.0.0.1', resolve));
const port = portServer.address().port;
await new Promise(resolve => portServer.close(resolve));
const child = spawn(process.execPath, ['dist/server.cjs'], { env: { ...process.env, NODE_ENV: 'production', PORT: String(port), GEMINI_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let logs = '';
child.stdout.on('data', chunk => { logs += chunk; });
child.stderr.on('data', chunk => { logs += chunk; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null) throw new Error(logs);
    try { ready = (await fetch(`http://127.0.0.1:${port}/api/health`)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, logs || 'Server did not become ready');
  const bytes = await readFile(new URL('../public/documents/cases/case-013.docx', import.meta.url));
  const form = new FormData();
  form.set('document', new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'case-013.docx');
  form.set('title', '');
  form.set('court', 'Court of Appeal');
  const response = await fetch(`http://127.0.0.1:${port}/api/admin/case-law/extract`, { method: 'POST', body: form });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.ok(result.draft.fullJudgmentText.length > 1000);
  assert.equal(result.draft.fullJudgmentText, result.draft.sourceExtraction.text);
  assert.equal(result.draft.sourceExtraction.sha256, createHash('sha256').update(bytes).digest('hex'));
  assert.equal(result.draft.sourceExtraction.textSha256, createHash('sha256').update(result.draft.fullJudgmentText).digest('hex'));
  assert.deepEqual(result.draft.ratios, []);
  assert.ok(result.warnings.some(warning => /not configured/.test(warning)));
  console.log(`PASS: real DOCX multipart upload, ${result.draft.fullJudgmentText.length} source characters retained, independent extraction and SHA-256 verification without AI.`);
} finally {
  if (child.exitCode === null) { child.kill(); await new Promise(resolve => child.once('exit', resolve)); }
}
