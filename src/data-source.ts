import { DataSource } from 'typeorm';
import { env } from './config/env';

const { DATABASE_URL, NODE_ENV } = env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: NODE_ENV === 'development',
  logging: NODE_ENV === 'development',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});
