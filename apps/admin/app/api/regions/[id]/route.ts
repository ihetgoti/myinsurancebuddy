import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

// GET /api/regions/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const region = await prisma.region.findUnique({
            where: { id: params.id },
        });

        if (!region) {
            return NextResponse.json({ error: 'Region not found' }, { status: 404 });
        }

        return NextResponse.json(region);
    } catch (error) {
        console.error('GET /api/regions/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch region' }, { status: 500 });
    }
}

// PATCH /api/regions/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const existingRegion = await prisma.region.findUnique({
            where: { id: params.id },
        });

        if (!existingRegion) {
            return NextResponse.json({ error: 'Region not found' }, { status: 404 });
        }

        const body = await request.json();
        const { name, slug, stateCode, population, medianIncome, timezone, seoSummary, legalNotes } = body;

        // Check if slug is being changed and already exists
        if (slug && slug !== existingRegion.slug) {
            const slugExists = await prisma.region.findUnique({
                where: { slug },
            });
            if (slugExists) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
            }
        }

        const region = await prisma.region.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(stateCode !== undefined && { stateCode }),
                ...(population !== undefined && { population }),
                ...(medianIncome !== undefined && { medianIncome }),
                ...(timezone !== undefined && { timezone }),
                ...(seoSummary !== undefined && { seoSummary }),
                ...(legalNotes !== undefined && { legalNotes }),
            },
        });

        // Create audit log
        try {
            await prisma.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: 'UPDATE_REGION',
                    entityType: 'Region',
                    entityId: region.id,
                    changes: { before: existingRegion, after: region },
                },
            });
        } catch (auditError) {
            console.error('Failed to create audit log:', auditError);
        }

        return NextResponse.json(region);
    } catch (error: any) {
        console.error('PATCH /api/regions/[id] error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ 
            error: error.message || 'Failed to update region' 
        }, { status: 500 });
    }
}

// DELETE /api/regions/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const region = await prisma.region.findUnique({
            where: { id: params.id },
        });

        if (!region) {
            return NextResponse.json({ error: 'Region not found' }, { status: 404 });
        }

        // Check if region is used by any pages
        const pageCount = await prisma.programmaticPage.count({
            where: { regionId: params.id },
        });

        if (pageCount > 0) {
            return NextResponse.json({ 
                error: `Cannot delete region: it is used by ${pageCount} page(s)` 
            }, { status: 400 });
        }

        await prisma.region.delete({
            where: { id: params.id },
        });

        // Create audit log
        try {
            await prisma.auditLog.create({
                data: {
                    userId: session.user.id,
                    action: 'DELETE_REGION',
                    entityType: 'Region',
                    entityId: params.id,
                    changes: { before: region },
                },
            });
        } catch (auditError) {
            console.error('Failed to create audit log:', auditError);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('DELETE /api/regions/[id] error:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to delete region' 
        }, { status: 500 });
    }
}
