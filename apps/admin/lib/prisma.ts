/**
 * Shared Prisma Client Singleton for Admin App
 * Prevents "too many clients" error in development/production
 */
import { PrismaClient } from '@myinsurancebuddy/db';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

