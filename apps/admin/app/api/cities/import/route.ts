import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



interface ImportResult {
    success: boolean;
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
}

// POST import cities from CSV data
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { data, mode = 'create' } = body;

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ error: 'Data array is required' }, { status: 400 });
        }

        // Pre-fetch all states with country info for lookup
        const states = await prisma.state.findMany({
            include: { country: { select: { code: true } } }
        });
        // Map: "country_code:state_slug" -> stateId
        const stateMap = new Map(
            states.map(s => [`${s.country.code}:${s.slug}`, s.id])
        );

        const result: ImportResult = {
            success: true,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: []
        };

        // Process in batches for performance
        const batchSize = 100;
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            await Promise.all(batch.map(async (row, idx) => {
                const rowNum = i + idx + 1;

                try {
                    const countryCode = row.country_code?.toString().toLowerCase().trim();
                    const stateSlug = row.state_slug?.toString().toLowerCase().trim();
                    const name = row.name?.toString().trim();
                    const slug = row.slug?.toString().toLowerCase().trim() ||
                        name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const population = row.population ? parseInt(row.population) : null;

                    if (!countryCode || !stateSlug || !name || !slug) {
                        result.errors.push(`Row ${rowNum}: Missing required fields`);
                        result.skipped++;
                        return;
                    }

                    const stateId = stateMap.get(`${countryCode}:${stateSlug}`);
                    if (!stateId) {
                        result.errors.push(`Row ${rowNum}: State '${countryCode}:${stateSlug}' not found`);
                        result.skipped++;
                        return;
                    }

                    const existing = await prisma.city.findFirst({
                        where: { stateId, slug }
                    });

                    if (existing) {
                        if (mode === 'create') {
                            result.skipped++;
                            return;
                        }
                        await prisma.city.update({
                            where: { id: existing.id },
                            data: { name, population }
                        });
                        result.updated++;
                    } else {
                        if (mode === 'update') {
                            result.skipped++;
                            return;
                        }
                        await prisma.city.create({
                            data: { stateId, name, slug, population, isActive: true }
                        });
                        result.created++;
                    }
                } catch (error: any) {
                    result.errors.push(`Row ${rowNum}: ${error.message}`);
                    result.skipped++;
                }
            }));
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Import failed:', error);
        return NextResponse.json({ error: 'Import failed' }, { status: 500 });
    }
}
