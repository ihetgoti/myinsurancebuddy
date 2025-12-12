import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const templates = await prisma.programmaticTemplate.findMany({
            include: {
                _count: {
                    select: { pages: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Map to match the expected interface
        const formattedTemplates = templates.map(t => ({
            id: t.id,
            name: t.name,
            description: null, // Add description field to schema if needed
            templateType: 'CUSTOM', // Map from actual type if exists
            isActive: true, // Add isActive field to schema if needed
            createdAt: t.createdAt.toISOString(),
            _count: { pages: 0 }, // Update when pages relation is fixed
        }));

        return NextResponse.json(formattedTemplates);
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
        const { name, templateHtml, placeholders } = body;

        if (!name || !templateHtml) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const template = await prisma.programmaticTemplate.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                templateHtml,
                placeholders: placeholders || [],
                createdById: session.user.id,
            },
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('POST /api/templates error:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
