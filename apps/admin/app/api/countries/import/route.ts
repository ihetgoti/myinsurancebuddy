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

// POST import countries from CSV data
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { data, mode = 'create' } = body; // mode: 'create' | 'update' | 'upsert'

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ error: 'Data array is required' }, { status: 400 });
        }

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
                const code = row.code?.toString().toLowerCase().trim();
                const name = row.name?.toString().trim();

                if (!code || !name) {
                    result.errors.push(`Row ${rowNum}: Missing code or name`);
                    result.skipped++;
                    continue;
                }

                const existing = await prisma.country.findUnique({ where: { code } });

                if (existing) {
                    if (mode === 'create') {
                        result.skipped++;
                        continue;
                    }
                    // Update existing
                    await prisma.country.update({
                        where: { id: existing.id },
                        data: { name }
                    });
                    result.updated++;
                } else {
                    if (mode === 'update') {
                        result.skipped++;
                        continue;
                    }
                    // Create new
                    await prisma.country.create({
                        data: { code, name, isActive: true }
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
