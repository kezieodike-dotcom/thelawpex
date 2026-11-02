// Disposable, local-only browser verification server. Never use these test credentials in deployment.
import express from 'express';
import { PGlite } from '@electric-sql/pglite';
import { createHash } from 'node:crypto';
import { createApiApp } from '../server';
import { PostgresCaseRepository, initializeCaseDatabase } from '../src/server/caseRepository';
import { hashAdminPassword } from '../src/server/adminAuth';
import { sampleRecord } from './case-ingestion-review.test';
import { compileCaseReport } from '../src/lib/compileCaseReport';

const db = new PGlite();
const connection = { query: (sql: string, values?: any[]) => db.query(sql, values) };
await initializeCaseDatabase(connection);
const repository = new PostgresCaseRepository(connection);
const record = sampleRecord();
record.id = 'ingested-browser-check'; record.title = 'Shared publishing browser verification';
const source = Buffer.from('Browser verification source fixture');
record.sourceExtraction!.sha256 = createHash('sha256').update(source).digest('hex');
record.sourceExtraction!.textSha256 = createHash('sha256').update(record.sourceExtraction!.text).digest('hex');
await repository.saveSource(record.sourceDocument.storageKey, source, 'application/octet-stream');
const reviewed = await compileCaseReport(record);
reviewed.status = 'Approved';
reviewed.review = { reviewer: 'Browser test editor', source: true, metadata: true, ratios: true, principles: true };
await repository.save(reviewed, 0);
await repository.save({ ...record, id: 'ingested-race-check', title: 'Concurrent edit check', status: 'Draft' }, 0);
const auth = { email: 'browser-test@example.com', passwordHash: await hashAdminPassword('browser-test-password-2026'), secret: 'local-only-browser-test-session-secret-2026', secure: false };
for (const [port, directory] of [[18080, 'dist'], [18081, 'dist-admin']] as const) {
  const app = createApiApp({ repository, auth });
  app.use(express.static(directory));
  app.get('*', (_req, res) => res.sendFile('index.html', { root: directory }));
  app.listen(port, '127.0.0.1', () => console.log(`Browser verification ${directory}: http://127.0.0.1:${port}`));
}
