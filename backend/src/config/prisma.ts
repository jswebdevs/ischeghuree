import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

// 1. Create a global object to hold our cached connections across nodemon restarts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

// 2. Reuse the existing pool if it exists, or create a new one
if (!globalForPrisma.pgPool) {
  console.log('🔄 Creating new PostgreSQL pool (max: 5)...');
}

const pool = globalForPrisma.pgPool ?? new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000,
});

// Cache the pool globally so nodemon doesn't spawn new ones
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pgPool = pool;
}

// 3. Initialize the Adapter
const adapter = new PrismaPg(pool);

// 4. Reuse the existing Prisma instance if it exists
const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter,
  log: ['error', 'warn'], 
});

// Cache Prisma globally
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;