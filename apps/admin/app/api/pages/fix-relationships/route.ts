import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/pages/fix-relationships
 * Fix pages with missing state/city relationships based on their slug
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all valid states for checking orphaned references
        const allStates = await prisma.state.findMany({ select: { id: true } });
        const validStateIds = new Set(allStates.map(s => s.id));

        // Find all pages that should have state/city relationships but don't
        // OR have orphaned relationships (pointing to deleted states)
        const allPagesToCheck = await prisma.page.findMany({
            where: {
                geoLevel: { in: ['STATE', 'CITY'] },
            },
            select: {
                id: true,
                slug: true,
                geoLevel: true,
                stateId: true,
                cityId: true,
                countryId: true,
            }
        });

        // Filter to pages that need fixing
        const pagesWithMissingRelationships = allPagesToCheck.filter(p => {
            // Missing stateId
            if (!p.stateId) return true;
            // Orphaned stateId (points to deleted state)
            if (!validStateIds.has(p.stateId)) return true;
            // CITY level without cityId
            if (p.geoLevel === 'CITY' && !p.cityId) return true;
            return false;
        });

        const results = {
            total: pagesWithMissingRelationships.length,
            fixed: 0,
            errors: [] as string[],
            details: [] as any[],
        };

        // Get all states and cities for lookup
        const states = await prisma.state.findMany({
            select: { id: true, slug: true, countryId: true }
        });
        const cities = await prisma.city.findMany({
            select: { id: true, slug: true, stateId: true }
        });

        const stateBySlug = new Map(states.map(s => [s.slug, s]));
        const cityBySlugAndState = new Map(cities.map(c => [`${c.stateId}:${c.slug}`, c]));

        for (const page of pagesWithMissingRelationships) {
            try {
                // Parse slug: "car-insurance/us/california" or "car-insurance/us/california/los-angeles"
                const parts = page.slug.split('/');
                // parts[0] = insurance-type, parts[1] = country, parts[2] = state, parts[3] = city (optional)

                const updateData: any = {};

                if (parts.length >= 3) {
                    const stateSlug = parts[2];
                    const state = stateBySlug.get(stateSlug);

                    // Fix stateId if missing OR if it's orphaned (points to deleted state)
                    const needsStateUpdate = !page.stateId || !validStateIds.has(page.stateId);
                    if (state && needsStateUpdate) {
                        updateData.stateId = state.id;
                        if (!page.countryId) {
                            updateData.countryId = state.countryId;
                        }
                    }

                    if (parts.length >= 4 && state) {
                        const citySlug = parts[3];
                        const city = cityBySlugAndState.get(`${state.id}:${citySlug}`);

                        if (city && !page.cityId) {
                            updateData.cityId = city.id;
                        }
                    }
                }

                if (Object.keys(updateData).length > 0) {
                    await prisma.page.update({
                        where: { id: page.id },
                        data: updateData
                    });
                    results.fixed++;
                    results.details.push({
                        id: page.id,
                        slug: page.slug,
                        fixed: updateData,
                    });
                }
            } catch (error: any) {
                results.errors.push(`Page ${page.id} (${page.slug}): ${error.message}`);
            }
        }

        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Fix relationships error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET /api/pages/fix-relationships
 * Check which pages have missing relationships (dry run)
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find pages with potential issues
        const pagesWithIssues = await prisma.page.findMany({
            where: {
                OR: [
                    // STATE level pages without stateId
                    { geoLevel: 'STATE', stateId: null },
                    // CITY level pages without stateId or cityId
                    { geoLevel: 'CITY', stateId: null },
                    { geoLevel: 'CITY', cityId: null },
                ]
            },
            select: {
                id: true,
                slug: true,
                geoLevel: true,
                stateId: true,
                cityId: true,
                countryId: true,
                title: true,
            },
            take: 100, // Limit for preview
        });

        // Also check for pages that have state/city but geoLevel doesn't match
        const inconsistentPages = await prisma.page.findMany({
            where: {
                OR: [
                    // Has cityId but geoLevel is not CITY
                    { cityId: { not: null }, geoLevel: { not: 'CITY' } },
                    // Has stateId but no cityId and geoLevel is not STATE
                    { stateId: { not: null }, cityId: null, geoLevel: { not: 'STATE' } },
                ]
            },
            select: {
                id: true,
                slug: true,
                geoLevel: true,
                stateId: true,
                cityId: true,
                title: true,
            },
            take: 50,
        });

        // Check pages with empty state name (state exists but name is empty)
        const pagesWithState = await prisma.page.findMany({
            where: {
                stateId: { not: null },
                geoLevel: { in: ['STATE', 'CITY'] },
            },
            include: {
                state: { select: { id: true, name: true, slug: true } },
                city: { select: { id: true, name: true, slug: true } },
            },
            take: 20,
        });

        const pagesWithEmptyStateName = pagesWithState.filter(p => !p.state?.name);

        // Check for orphaned relationships (stateId points to non-existent state)
        // This happens if states were deleted but pages still reference them
        const allStateIds = await prisma.state.findMany({ select: { id: true } });
        const validStateIds = new Set(allStateIds.map(s => s.id));

        const pagesWithStateId = await prisma.page.findMany({
            where: {
                stateId: { not: null },
            },
            select: {
                id: true,
                slug: true,
                stateId: true,
                geoLevel: true,
            },
        });

        const orphanedPages = pagesWithStateId.filter(p => p.stateId && !validStateIds.has(p.stateId));

        return NextResponse.json({
            missingRelationships: {
                count: pagesWithIssues.length,
                pages: pagesWithIssues,
            },
            inconsistentGeoLevel: {
                count: inconsistentPages.length,
                pages: inconsistentPages,
            },
            emptyStateName: {
                count: pagesWithEmptyStateName.length,
                pages: pagesWithEmptyStateName.map(p => ({
                    id: p.id,
                    slug: p.slug,
                    stateId: p.stateId,
                    state: p.state,
                })),
            },
            orphanedRelationships: {
                count: orphanedPages.length,
                description: 'Pages with stateId pointing to deleted/non-existent states',
                pages: orphanedPages.slice(0, 20),
            },
            sampleValidPages: pagesWithState.slice(0, 5).map(p => ({
                id: p.id,
                slug: p.slug,
                geoLevel: p.geoLevel,
                state: p.state,
                city: p.city,
            })),
        });
    } catch (error: any) {
        console.error('Check relationships error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
