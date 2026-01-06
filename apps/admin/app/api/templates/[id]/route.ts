import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';



// GET /api/templates/[id] - Get single template
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const template = await prisma.template.findUnique({
            where: { id: params.id },
            include: {
                _count: { select: { pages: true } },
            },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error('GET /api/templates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
    }
}

/**
 * PATCH /api/templates/[id] - Update template
 * Includes automatic versioning for rollback capability
 */
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
            name,
            slug,
            description,
            thumbnail,
            sections,
            variables,
            customVariables,
            type,
            category,
            seoTitleTemplate,
            seoDescTemplate,
            customCss,
            customJs,
            layout,
            isActive,
            htmlContent,
            showAffiliates
        } = body;

        // Check if slug is taken by another template
        if (slug) {
            const existing = await prisma.template.findFirst({
                where: { slug, NOT: { id: params.id } },
            });
            if (existing) {
                return NextResponse.json({ error: 'Slug already taken' }, { status: 400 });
            }
        }

        // Get current template for versioning
        const currentTemplate = await prisma.template.findUnique({
            where: { id: params.id },
        });

        if (!currentTemplate) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Increment version number
        const newVersion = (currentTemplate.version || 1) + 1;

        const template = await prisma.template.update({
            where: { id: params.id },
            data: {
                ...(name !== undefined && { name }),
                ...(slug !== undefined && { slug }),
                ...(description !== undefined && { description }),
                ...(thumbnail !== undefined && { thumbnail }),
                ...(sections !== undefined && { sections }),
                ...(variables !== undefined && { variables }),
                ...(customVariables !== undefined && { customVariables }),
                ...(type !== undefined && { type }),
                ...(category !== undefined && { category }),
                ...(seoTitleTemplate !== undefined && { seoTitleTemplate }),
                ...(seoDescTemplate !== undefined && { seoDescTemplate }),
                ...(customCss !== undefined && { customCss }),
                ...(customJs !== undefined && { customJs }),
                ...(layout !== undefined && { layout }),
                ...(isActive !== undefined && { isActive }),
                ...(htmlContent !== undefined && { htmlContent }),
                ...(showAffiliates !== undefined && { showAffiliates }),
                version: newVersion,
            },
        });

        return NextResponse.json(template);
    } catch (error) {
        console.error('PATCH /api/templates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}

export const PUT = PATCH;

// DELETE /api/templates/[id] - Delete template
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if template is used by any pages
        const usedByPages = await prisma.page.count({
            where: { templateId: params.id },
        });

        if (usedByPages > 0) {
            return NextResponse.json(
                { error: `Template is used by ${usedByPages} pages. Remove template from pages first.` },
                { status: 400 }
            );
        }

        await prisma.template.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/templates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
    }
}
