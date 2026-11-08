import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { createPublishedCaseStore } from '../src/lib/publishedCases';

test('a fresh public session fetches shared publications and refresh removes withdrawals', async () => {
  let cases = [{ id: 'ingested-public', title: 'Shared judgment' }];
  let unavailable = false;
  const app = express();
  app.get('/api/cases', (_req, res) => unavailable ? res.status(503).json({ error: 'Unavailable' }) : res.json({ cases }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${(server.address() as any).port}`;
  try {
    const store = createPublishedCaseStore(`${origin}/api/cases`);
    assert.equal(store.getSnapshot().loaded, false);
    await store.refresh();
    assert.equal(store.getSnapshot().cases[0].id, 'ingested-public');
    cases = [];
    await store.refresh();
    assert.deepEqual(store.getSnapshot().cases, []);
    unavailable = true;
    await store.refresh();
    assert.ok(store.getSnapshot().error);
    assert.deepEqual(store.getSnapshot().cases, []);
    unavailable = false;
    cases = [{ id: 'ingested-new', title: 'New case' }];
    const secondBrowser = createPublishedCaseStore(`${origin}/api/cases`);
    await secondBrowser.refresh();
    assert.equal(secondBrowser.getSnapshot().cases[0].id, 'ingested-new');
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
