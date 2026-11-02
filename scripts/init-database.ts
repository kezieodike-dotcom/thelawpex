import 'dotenv/config';
import { Pool } from 'pg';
import { initializeCaseDatabase } from '../src/server/caseRepository';

if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before initializing shared publishing.');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
try {
  await initializeCaseDatabase(pool);
  console.log('LAWPEX shared publishing tables are ready.');
} finally { await pool.end(); }
