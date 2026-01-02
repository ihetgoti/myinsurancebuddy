import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



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
                ...(heroTitle !== undefined && { title: heroTitle }),
                ...(heroSubtitle !== undefined && { subtitle: heroSubtitle }),
                ...(sections !== undefined && { content: sections }), // Schema uses 'content' for sections JSON
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

        // Create audit log for update
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'UPDATE',
                entityType: 'Page',
                entityId: params.id,
                entityName: page.title || page.slug,
                changes: {
                    ...(heroTitle !== undefined && { title: { old: currentPage.title, new: heroTitle } }),
                    ...(isPublished !== undefined && { isPublished: { old: currentPage.isPublished, new: isPublished } }),
                },
            },
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

        // Get page info before delete for audit
        const page = await prisma.page.findUnique({
            where: { id: params.id },
            select: { id: true, title: true, slug: true }
        });

        if (!page) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        await prisma.page.delete({ where: { id: params.id } });

        // Create audit log for delete
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'DELETE',
                entityType: 'Page',
                entityId: params.id,
                entityName: page.title || page.slug,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete page:', error);
        return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
    }
}
