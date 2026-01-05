import { prisma } from './prisma';

export async function getPublishedPosts(limit?: number) {
    return prisma.blogPost.findMany({
        where: {
            isPublished: true,
            publishedAt: { lte: new Date() }
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        include: {
            author: { select: { name: true, email: true } },
            category: true
        }
    });
}

export async function getPostBySlug(slug: string) {
    return prisma.blogPost.findFirst({
        where: { slug, isPublished: true },
        include: {
            author: { select: { name: true, email: true } },
            category: true
        }
    });
}

export async function getRelatedPosts(categoryId: string | null, currentId: string, limit = 3) {
    const where: any = {
        isPublished: true,
        id: { not: currentId },
        publishedAt: { lte: new Date() }
    };

    if (categoryId) {
        where.categoryId = categoryId;
    }

    return prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: limit,
        include: {
            category: true
        }
    });
}
