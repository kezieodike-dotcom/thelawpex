import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import handler from '../api/index';

test('Vercel rewrites reach JSON API routes rather than the frontend fallback', async () => {
  const app = express();
  app.use(handler);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  try {
    const health = await fetch(`${base}/api?route=health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).status, 'ok');
    const unknown = await fetch(`${base}/api?route=missing-endpoint`);
    assert.equal(unknown.status, 404);
    assert.match(unknown.headers.get('content-type')!, /application\/json/);
    assert.match((await unknown.json()).error, /No API route/);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
