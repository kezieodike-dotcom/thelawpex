import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PostgresCaseRepository, initializeCaseDatabase } from '../src/server/caseRepository';
import { PGlite } from '@electric-sql/pglite';
import { createPublishingRouter } from '../src/server/casePublishing';
import { hashAdminPassword } from '../src/server/adminAuth';
import { sampleRecord } from './case-ingestion-review.test';
import { compileCaseReport } from '../src/lib/compileCaseReport';
import { hasCurrentReview } from '../src/lib/caseReportReview';

test('review validation survives database JSON property reordering', async () => {
  const reviewed = await compileCaseReport(sampleRecord());
  const reordered = JSON.parse(JSON.stringify(reviewed, (_key, value) => value && typeof value === 'object' && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b))) : value));
  assert.equal(hasCurrentReview(reordered), true);
});

test('shared publication is authenticated, durable, isolated from drafts and withdrawn on edits', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'lawpex-publishing-'));
  let db = new PGlite(directory);
  const query = async (sql: string, params?: unknown[]) => db.query(sql, params);
  const repository = new PostgresCaseRepository({ query });
  await initializeCaseDatabase({ query });
  const config = { email: 'editor@example.com', passwordHash: await hashAdminPassword('a-test-password-with-entropy'), secret: 'test-session-secret-with-at-least-32-characters', secure: false };
  const app = express();
  app.use(express.json({ limit: '16mb' }));
  app.use('/api', createPublishingRouter({ repository, auth: config }));
  app.use((error: any, _req: any, res: any, _next: any) => res.status(error.status || 500).json({ error: error.message }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${(server.address() as any).port}`;
  const request = (url: string, init: RequestInit = {}) => fetch(`${origin}/api${url}`, init);
  const json = (value: unknown, cookie = '') => ({ 'Content-Type': 'application/json', Origin: origin, Cookie: cookie });
  try {
    assert.equal((await request('/admin/cases')).status, 401);
    assert.equal((await request('/admin/case-law/extract', { method: 'POST', headers: { Origin: origin } })).status, 401);
    assert.equal((await request('/admin/session', { method: 'POST', headers: json({}), body: JSON.stringify({ email: config.email, password: 'wrong' }) })).status, 401);
    const login = await request('/admin/session', { method: 'POST', headers: json({}), body: JSON.stringify({ email: config.email, password: 'a-test-password-with-entropy' }) });
    assert.equal(login.status, 200);
    assert.match(login.headers.get('set-cookie')!, /HttpOnly/);
    const cookie = login.headers.get('set-cookie')!.split(';')[0];
    assert.equal((await request('/admin/session', { headers: { Cookie: cookie } })).status, 200);
    const record = { ...sampleRecord(), id: 'ingested-integration', updatedAt: new Date().toISOString() };
    const source = Buffer.from('Original source document');
    record.sourceExtraction!.sha256 = (await import('node:crypto')).createHash('sha256').update(source).digest('hex');
    record.sourceExtraction!.textSha256 = (await import('node:crypto')).createHash('sha256').update(record.sourceExtraction!.text).digest('hex');
    const sourceKey = encodeURIComponent(record.sourceDocument.storageKey);
    assert.equal((await request(`/admin/sources/${sourceKey}`, { method: 'PUT', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/octet-stream' }, body: source })).status, 200);
    const save = (data: typeof record, version: number) => request(`/admin/cases/${record.id}`, { method: 'PUT', headers: json({}, cookie), body: JSON.stringify({ record: data, version }) });
    let result = await save(record, 0);
    assert.equal(result.status, 200, await result.text());
    assert.deepEqual(await (await request('/cases')).json(), { cases: [] });
    assert.equal((await save({ ...record, status: 'Published' }, 1)).status, 422);
    let reviewed = await compileCaseReport(record);
    assert.deepEqual(reviewed.validation?.errors, []);
    reviewed.review = { reviewer: 'Editor', source: true, metadata: true, ratios: true, principles: true };
    assert.equal((await save({ ...reviewed, status: 'Under Review' }, 1)).status, 200);
    assert.equal((await save({ ...reviewed, status: 'Approved' }, 2)).status, 200);
    assert.equal((await save({ ...reviewed, status: 'Published' }, 3)).status, 200);
    const publicResult = await request('/cases');
    assert.match(publicResult.headers.get('cache-control')!, /no-store/);
    const published = (await publicResult.json()).cases;
    assert.equal(published.length, 1);
    assert.equal(published[0].title, record.title);
    assert.equal(published[0].sourceDocument, undefined);
    assert.equal(published[0].auditLog, undefined);
    assert.equal((await request(`/cases/${record.id}`)).status, 200);
    assert.equal((await save({ ...record, title: 'Stale overwrite' }, 1)).status, 409);
    assert.equal((await request(`/admin/cases/${record.id}`, { method: 'DELETE', headers: json({}, cookie), body: JSON.stringify({ version: 1 }) })).status, 409);
    assert.equal((await request(`/admin/cases/${record.id}`, { method: 'PUT', headers: { ...json({}, cookie), Origin: 'https://attacker.example' }, body: JSON.stringify({ record, version: 4 }) })).status, 403);
    await db.close();
    db = new PGlite(directory);
    assert.equal((await repository.list())[0].record.status, 'Published');
    assert.equal((await save({ ...reviewed, status: 'Under Review', title: 'Edited title' }, 4)).status, 200);
    assert.deepEqual((await (await request('/cases')).json()).cases, []);
    assert.equal((await request(`/cases/${record.id}`)).status, 404);
    assert.equal((await request('/admin/session', { method: 'DELETE', headers: json({}, cookie) })).status, 200);
    assert.equal((await request('/admin/cases', { headers: { Cookie: cookie } })).status, 401);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
    await db.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('missing configuration denies login and admin reads', async () => {
  const app = express();
  app.use(express.json());
  app.use('/api', createPublishingRouter({ repository: null, auth: null }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${(server.address() as any).port}`;
  try {
    assert.equal((await fetch(`${origin}/api/admin/cases`)).status, 503);
    const response = await fetch(`${origin}/api/admin/session`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(response.status, 503);
    assert.equal((await fetch(`${origin}/api/cases`)).status, 503);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
