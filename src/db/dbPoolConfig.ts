import { Pool } from 'pg';
import { env } from '../config/env';

const { DATABASE_URL, NODE_ENV } = env;

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
