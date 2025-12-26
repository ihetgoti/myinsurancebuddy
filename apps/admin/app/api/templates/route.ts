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
        } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        // Check slug uniqueness
        const existing = await prisma.template.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: 'Template with this slug already exists' }, { status: 400 });
        }

        const template = await prisma.template.create({
            data: {
                name,
                slug,
                description,
                thumbnail,
                sections: sections || [],
                variables: variables || {},
                customVariables: customVariables || [],
                type: type || 'PAGE',
                category,
                seoTitleTemplate,
                seoDescTemplate,
                customCss,
                customJs,
                layout: layout || 'default',
            },
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('POST /api/templates error:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
