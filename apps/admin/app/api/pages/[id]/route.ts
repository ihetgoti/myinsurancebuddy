import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@myinsurancebuddy/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET single page
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const page = await prisma.page.findUnique({
            where: { id: params.id },
            include: {
                insuranceType: true,
                country: true,
                state: { include: { country: true } },
                city: { include: { state: { include: { country: true } } } },
            }
        });

        if (!page) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error('Failed to fetch page:', error);
        return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
    }
}

// PATCH update page
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            heroTitle,
            heroSubtitle,
            sections,
            metaTitle,
            metaDescription,
            isPublished
        } = body;

        const currentPage = await prisma.page.findUnique({ where: { id: params.id } });
        if (!currentPage) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Handle publishing
        let publishedAt = currentPage.publishedAt;
        if (isPublished && !currentPage.isPublished) {
            publishedAt = new Date();
        }

        const page = await prisma.page.update({
            where: { id: params.id },
            data: {
                ...(heroTitle !== undefined && { heroTitle }),
                ...(heroSubtitle !== undefined && { heroSubtitle }),
                ...(sections !== undefined && { sections }),
                ...(metaTitle !== undefined && { metaTitle }),
                ...(metaDescription !== undefined && { metaDescription }),
                ...(isPublished !== undefined && { isPublished, publishedAt }),
            },
            include: {
                insuranceType: { select: { id: true, name: true, slug: true } },
                country: { select: { id: true, code: true, name: true } },
                state: { select: { id: true, slug: true, name: true } },
                city: { select: { id: true, slug: true, name: true } },
            }
        });

        return NextResponse.json(page);
    } catch (error) {
        console.error('Failed to update page:', error);
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
}

// DELETE page
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.page.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete page:', error);
        return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
    }
}
