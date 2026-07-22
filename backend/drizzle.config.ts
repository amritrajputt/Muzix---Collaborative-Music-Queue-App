import dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from 'drizzle-kit';

const connectionString = process.env.DATABASE_URL || '';
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  },
});

