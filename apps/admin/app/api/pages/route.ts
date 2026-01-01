import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



// GET all pages with filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const insuranceTypeId = searchParams.get('insuranceTypeId');
        const geoLevel = searchParams.get('geoLevel');
        const countryId = searchParams.get('countryId');
        const stateId = searchParams.get('stateId');
        const cityId = searchParams.get('cityId');
        const isPublished = searchParams.get('isPublished');
        const idsOnly = searchParams.get('idsOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = {};
        if (insuranceTypeId) where.insuranceTypeId = insuranceTypeId;
        if (geoLevel) where.geoLevel = geoLevel;
        if (countryId) where.countryId = countryId;
        if (stateId) where.stateId = stateId;
        if (cityId) where.cityId = cityId;
        if (isPublished !== null) where.isPublished = isPublished === 'true';

        // If idsOnly, return just the IDs for bulk selection
        if (idsOnly) {
            const pages = await prisma.page.findMany({
                where,
                select: { id: true },
            });
            const ids = pages.map(p => p.id);
            return NextResponse.json({ ids, total: ids.length });
        }

        const [pages, total] = await Promise.all([
            prisma.page.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                skip: offset,
                take: limit,
                include: {
                    insuranceType: { select: { id: true, name: true, slug: true, icon: true } },
                    country: { select: { id: true, code: true, name: true } },
                    state: { select: { id: true, slug: true, name: true } },
                    city: { select: { id: true, slug: true, name: true } },
                }
            }),
            prisma.page.count({ where })
        ]);

        return NextResponse.json({ pages, total, limit, offset });
    } catch (error) {
        console.error('Failed to fetch pages:', error);
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
}

// POST create new page
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            insuranceTypeId,
            geoLevel,
            countryId,
            stateId,
            cityId,
            heroTitle,
            heroSubtitle,
            sections,
            metaTitle,
            metaDescription,
            isPublished
        } = body;

        if (!insuranceTypeId || !geoLevel) {
            return NextResponse.json({ error: 'Insurance type and geo level are required' }, { status: 400 });
        }

        // Validate geo level requirements
        if (geoLevel === 'COUNTRY' && !countryId) {
            return NextResponse.json({ error: 'Country is required for country-level pages' }, { status: 400 });
        }
        if (geoLevel === 'STATE' && (!countryId || !stateId)) {
            return NextResponse.json({ error: 'Country and state are required for state-level pages' }, { status: 400 });
        }
        if (geoLevel === 'CITY' && (!countryId || !stateId || !cityId)) {
            return NextResponse.json({ error: 'Country, state, and city are required for city-level pages' }, { status: 400 });
        }

        // Check for duplicate page
        const existing = await prisma.page.findFirst({
            where: {
                insuranceTypeId,
                geoLevel: geoLevel as any,
                countryId: countryId || null,
                stateId: stateId || null,
                cityId: cityId || null,
            }
        });

        if (existing) {
            return NextResponse.json({ error: 'A page already exists for this insurance type and location' }, { status: 400 });
        }

        // Generate slug based on geo level and names
        const insuranceType = await prisma.insuranceType.findUnique({ where: { id: insuranceTypeId } });
        const state = stateId ? await prisma.state.findUnique({ where: { id: stateId } }) : null;
        const city = cityId ? await prisma.city.findUnique({ where: { id: cityId } }) : null;

        let slug = insuranceType?.slug || '';
        if (state) slug += `/${state.slug}`;
        if (city) slug += `/${city.slug}`;

        const page = await prisma.page.create({
            data: {
                slug,
                insuranceTypeId,
                geoLevel: geoLevel as any,
                countryId: geoLevel !== 'NICHE' ? countryId : null,
                stateId: ['STATE', 'CITY'].includes(geoLevel) ? stateId : null,
                cityId: geoLevel === 'CITY' ? cityId : null,
                title: heroTitle,
                subtitle: heroSubtitle,
                content: sections || [],
                metaTitle,
                metaDescription,
                isPublished: isPublished ?? false,
                publishedAt: isPublished ? new Date() : null,
            },
            include: {
                insuranceType: { select: { id: true, name: true, slug: true } },
                country: { select: { id: true, code: true, name: true } },
                state: { select: { id: true, slug: true, name: true } },
                city: { select: { id: true, slug: true, name: true } },
            }
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'Page',
                entityId: page.id,
                entityName: page.title || page.slug,
                metadata: { geoLevel, insuranceTypeId },
            },
        });

        return NextResponse.json(page, { status: 201 });
    } catch (error) {
        console.error('Failed to create page:', error);
        return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }
}
