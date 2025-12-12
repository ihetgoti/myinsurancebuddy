import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

// GET /api/templates/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const template = await prisma.programmaticTemplate.findUnique({
            where: { id: params.id },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Map to expected format
        const formattedTemplate = {
            id: template.id,
            name: template.name,
            slug: template.slug,
            type: 'STATE',
            titleTemplate: template.name,
            metaTitleTemplate: null,
            metaDescriptionTemplate: null,
            contentTemplate: template.templateHtml,
            isActive: true,
        };

        return NextResponse.json(formattedTemplate);
    } catch (error) {
        console.error('GET /api/templates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
    }
}

// PATCH /api/templates/[id]
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
        const { name, slug, contentTemplate, titleTemplate, metaTitleTemplate, metaDescriptionTemplate, isActive } = body;

        const template = await prisma.programmaticTemplate.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(contentTemplate && { templateHtml: contentTemplate }),
            },
        });

        return NextResponse.json(template);
    } catch (error) {
        console.error('PATCH /api/templates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}

// DELETE /api/templates/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.programmaticTemplate.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/templates/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
    }
}
