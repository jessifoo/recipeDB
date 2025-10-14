/**
 * Database Infrastructure
 * Singleton Prisma client with transaction utilities
 */

import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

/**
 * Transaction utility - Execute multiple operations atomically
 * @example
 * const result = await transaction(async (tx) => {
 *   const user = await tx.user.create({ data: { ... } });
 *   await tx.profile.create({ data: { userId: user.id } });
 *   return user;
 * });
 */
export async function transaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return db.$transaction(fn);
}

/**
 * Health check - Verify database connectivity
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Graceful shutdown - Close database connections
 */
export async function disconnect(): Promise<void> {
  await db.$disconnect();
}
