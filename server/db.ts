import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@shared/schema';
import * as dotenv from 'dotenv';
dotenv.config();

// Default to a dummy URL so the server can boot. 
// Queries will fail properly when attempted if this isn't overridden in the Secrets panel.
const dbUrl = process.env.DATABASE_URL || 'libsql://dummy-database.turso.io';
const authToken = process.env.DATABASE_AUTH_TOKEN || '';

export const client = createClient({
  url: dbUrl,
  authToken: authToken,
});

export const db = drizzle(client, { schema });
