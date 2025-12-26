import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
    notFound: vi.fn(),
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        insuranceType: {
            findMany: vi.fn().mockResolvedValue([]),
            findUnique: vi.fn().mockResolvedValue(null),
        },
        page: {
            findMany: vi.fn().mockResolvedValue([]),
            findUnique: vi.fn().mockResolvedValue(null),
            findFirst: vi.fn().mockResolvedValue(null),
        },
        state: {
            findMany: vi.fn().mockResolvedValue([]),
            findFirst: vi.fn().mockResolvedValue(null),
        },
        country: {
            findUnique: vi.fn().mockResolvedValue(null),
        },
        city: {
            findFirst: vi.fn().mockResolvedValue(null),
        },
    },
}));

