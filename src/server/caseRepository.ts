import { Pool } from 'pg';
import type { AdminCaseRecord } from '../data/caseIngestion';

export interface SqlConnection {
  query(sql: string, values?: any[]): Promise<{ rows: any[] }>;
}
export class PublishingError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export interface StoredCase { record: AdminCaseRecord; version: number }

// A private schema keeps editorial data out of providers' public Data APIs.
export const caseSchemaStatements = [
  'CREATE SCHEMA IF NOT EXISTS lawpex',
  `CREATE TABLE IF NOT EXISTS lawpex.cases (
    id text PRIMARY KEY, record jsonb NOT NULL, version integer NOT NULL DEFAULT 1,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS lawpex.sources (
    key text PRIMARY KEY, data bytea NOT NULL, content_type text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS lawpex.sessions (
    token_hash text PRIMARY KEY, expires_at timestamptz NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS lawpex.login_attempts (
    key text PRIMARY KEY, attempts integer NOT NULL, expires_at timestamptz NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS lawpex_published_cases ON lawpex.cases (updated_at DESC)
    WHERE record->>'status' = 'Published'`,
];
export async function initializeCaseDatabase(db: SqlConnection) {
  for (const statement of caseSchemaStatements) await db.query(statement);
}

export class PostgresCaseRepository {
  constructor(public db: SqlConnection) {}
  async list(publishedOnly = false): Promise<StoredCase[]> {
    const { rows } = await this.db.query(`SELECT record, version FROM lawpex.cases ${publishedOnly ? "WHERE record->>'status' = 'Published'" : ''} ORDER BY updated_at DESC`);
    return rows;
  }
  async get(id: string): Promise<StoredCase | null> {
    return (await this.db.query('SELECT record, version FROM lawpex.cases WHERE id = $1', [id])).rows[0] ?? null;
  }
  async save(record: AdminCaseRecord, version: number): Promise<number> {
    const { rows } = version === 0
      ? await this.db.query('INSERT INTO lawpex.cases(id, record) VALUES ($1, $2::jsonb) ON CONFLICT DO NOTHING RETURNING version', [record.id, JSON.stringify(record)])
      : await this.db.query('UPDATE lawpex.cases SET record = $2::jsonb, version = version + 1, updated_at = now() WHERE id = $1 AND version = $3 RETURNING version', [record.id, JSON.stringify(record), version]);
    if (!rows.length) throw new PublishingError(409, 'This case changed in another session. Export your edits, then reload the workspace before saving again.');
    return rows[0].version;
  }
  async remove(id: string, version: number) {
    const { rows } = await this.db.query('DELETE FROM lawpex.cases WHERE id = $1 AND version = $2 RETURNING id', [id, version]);
    if (!rows.length) throw new PublishingError(409, 'This case changed in another session. Reload before deleting it.');
  }
  async saveSource(key: string, data: Buffer, contentType: string) {
    // Original sources and snapshots are immutable, including across sessions.
    const { rows } = await this.db.query(`INSERT INTO lawpex.sources(key, data, content_type) VALUES ($1, $2, $3)
      ON CONFLICT (key) DO UPDATE SET key = EXCLUDED.key WHERE lawpex.sources.data = EXCLUDED.data RETURNING key`, [key, data, contentType]);
    if (!rows.length) throw new PublishingError(409, 'A different source already exists under this identifier. Upload it as a new judgment.');
  }
  async getSource(key: string): Promise<{ data: Buffer; content_type: string } | null> {
    const row = (await this.db.query('SELECT data, content_type FROM lawpex.sources WHERE key = $1', [key])).rows[0];
    return row ? { ...row, data: Buffer.from(row.data) } : null;
  }
  async createSession(tokenHash: string, expires: Date) {
    await this.db.query('DELETE FROM lawpex.sessions WHERE expires_at < now()');
    await this.db.query('INSERT INTO lawpex.sessions(token_hash, expires_at) VALUES ($1, $2)', [tokenHash, expires.toISOString()]);
  }
  async hasSession(tokenHash: string) {
    return (await this.db.query('SELECT 1 FROM lawpex.sessions WHERE token_hash = $1 AND expires_at > now()', [tokenHash])).rows.length > 0;
  }
  async deleteSession(tokenHash: string) {
    await this.db.query('DELETE FROM lawpex.sessions WHERE token_hash = $1', [tokenHash]);
  }
  async allowLogin(key: string) {
    const { rows } = await this.db.query(`INSERT INTO lawpex.login_attempts(key, attempts, expires_at) VALUES ($1, 1, now() + interval '15 minutes')
      ON CONFLICT (key) DO UPDATE SET
        attempts = CASE WHEN lawpex.login_attempts.expires_at < now() THEN 1 ELSE lawpex.login_attempts.attempts + 1 END,
        expires_at = CASE WHEN lawpex.login_attempts.expires_at < now() THEN now() + interval '15 minutes' ELSE lawpex.login_attempts.expires_at END
      RETURNING attempts`, [key]);
    return rows[0].attempts <= 10;
  }
}

let repository: PostgresCaseRepository | null = null;
export function configuredCaseRepository() {
  if (!process.env.DATABASE_URL) return null;
  if (!repository) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000 });
    pool.on('error', (error) => console.error('Publishing database connection failed:', error.message));
    repository = new PostgresCaseRepository(pool);
  }
  return repository;
}
