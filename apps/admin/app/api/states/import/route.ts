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

// POST import states from CSV data
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

        // Pre-fetch all countries for lookup
        const countries = await prisma.country.findMany();
        const countryMap = new Map(countries.map(c => [c.code.toLowerCase(), c.id]));

        const result: ImportResult = {
            success: true,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: []
        };

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNum = i + 1;

            try {
                const countryCode = row.country_code?.toString().toLowerCase().trim();
                const name = row.name?.toString().trim();
                const slug = row.slug?.toString().toLowerCase().trim() ||
                    name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const code = row.code?.toString().toUpperCase().trim();

                if (!countryCode || !name || !slug) {
                    result.errors.push(`Row ${rowNum}: Missing country_code, name, or slug`);
                    result.skipped++;
                    continue;
                }

                const countryId = countryMap.get(countryCode);
                if (!countryId) {
                    result.errors.push(`Row ${rowNum}: Country '${countryCode}' not found`);
                    result.skipped++;
                    continue;
                }

                const existing = await prisma.state.findFirst({
                    where: { countryId, slug }
                });

                if (existing) {
                    if (mode === 'create') {
                        result.skipped++;
                        continue;
                    }
                    await prisma.state.update({
                        where: { id: existing.id },
                        data: { name, code }
                    });
                    result.updated++;
                } else {
                    if (mode === 'update') {
                        result.skipped++;
                        continue;
                    }
                    await prisma.state.create({
                        data: { countryId, name, slug, code, isActive: true }
                    });
                    result.created++;
                }
            } catch (error: any) {
                result.errors.push(`Row ${rowNum}: ${error.message}`);
                result.skipped++;
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Import failed:', error);
        return NextResponse.json({ error: 'Import failed' }, { status: 500 });
    }
}
