import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';

export async function ensureTestDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not defined');

  const parsed = new URL(url);
  const dbName = parsed.pathname.replace(/^\//, '');
  const schema = parsed.searchParams.get('schema') || 'public';

  const adminUrl = new URL(parsed.toString());
  adminUrl.pathname = '/postgres';

  const admin = new PrismaClient({
    datasources: { db: { url: adminUrl.toString() } },
  });

  try {
    await admin.$connect();
    const exists = await admin.$queryRawUnsafe<{ exists: boolean }[]>(
      `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = '${dbName}') AS exists;`,
    );

    if (!exists[0]?.exists) {
      await admin.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
      console.log(`[test-db] created database ${dbName}`);
    }
  } finally {
    await admin.$disconnect();
  }

  const testDb = new PrismaClient({
    datasources: { db: { url } },
  });
  try {
    await testDb.$connect();
    await testDb.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
  } finally {
    await testDb.$disconnect();
  }

  execSync('npx prisma migrate deploy', {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}
