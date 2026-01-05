import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const templates = await prisma.template.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { pages: true } },
            },
        });

        return NextResponse.json(templates);
    } catch (error) {
        console.error('GET /api/templates error:', error);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
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
            htmlContent,
            showAffiliates,
        } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Auto-generate slug from name if not provided
        const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Normalize type to match Enum (HTML, PAGE, etc)
        const normalizedType = type ? type.toUpperCase() : 'PAGE';

        const template = await prisma.template.create({
            data: {
                name,
                slug: finalSlug,
                description,
                thumbnail,
                htmlContent,
                sections: sections || [],
                variables: variables || {},
                customVariables: customVariables || [],
                type: normalizedType,
                category,
                seoTitleTemplate,
                seoDescTemplate,
                customCss,
                customJs,
                layout: layout || 'default',
                showAffiliates,
            },
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('POST /api/templates error:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
