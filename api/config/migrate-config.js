import { config } from 'dotenv';
config();

export default {
  databaseUrl: process.env.DATABASE_URL,
  dir: 'migrations',
  migrationsTable: 'pgmigrations',
  verbose: true,
};
