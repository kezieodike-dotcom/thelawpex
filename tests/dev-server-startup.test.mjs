import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test('dev server binds the port without waiting for Vite middleware startup', async () => {
  const server = await readFile(projectFile('server.ts'), 'utf8');

  assert.match(server, /let viteReady:/);
  assert.match(server, /const getViteReady = \(\) =>/);
  assert.match(server, /viteReady \?\?= createViteServer/);
  assert.match(server, /app\.use\(async \(req, res, next\)/);
  assert.doesNotMatch(server, /const vite = await createViteServer/);
  assert.match(server, /app\.listen\(PORT, "0\.0\.0\.0"/);
  assert.match(server, /Vite middleware is still starting/);
});
