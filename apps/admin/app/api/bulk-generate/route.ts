import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, GeoLevel, JobStatus } from '@myinsurancebuddy/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/bulk-generate - List all bulk jobs
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const jobs = await prisma.bulkJob.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                template: { select: { name: true, slug: true } },
                insuranceType: { select: { name: true, slug: true, icon: true } },
            },
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error('GET /api/bulk-generate error:', error);
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}

// POST /api/bulk-generate - Create new bulk job
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            templateId,
            insuranceTypeId,
            geoLevel,
            countryId,
            stateId,
            csvData,
            variableMapping,
            publishOnCreate,
            skipExisting,
        } = body;

        // Validation
        if (!templateId || !insuranceTypeId || !geoLevel) {
            return NextResponse.json(
                { error: 'templateId, insuranceTypeId, and geoLevel are required' },
                { status: 400 }
            );
        }

        // Verify template and insurance type exist
        const [template, insuranceType] = await Promise.all([
            prisma.template.findUnique({ where: { id: templateId } }),
            prisma.insuranceType.findUnique({ where: { id: insuranceTypeId } }),
        ]);

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }
        if (!insuranceType) {
            return NextResponse.json({ error: 'Insurance type not found' }, { status: 404 });
        }

        // Calculate total pages based on geo level and filters
        let totalPages = 0;
        if (geoLevel === 'STATE') {
            totalPages = await prisma.state.count({
                where: {
                    isActive: true,
                    ...(countryId && { countryId }),
                },
            });
        } else if (geoLevel === 'CITY') {
            totalPages = await prisma.city.count({
                where: {
                    isActive: true,
                    ...(stateId && { stateId }),
                    ...(countryId && { state: { countryId } }),
                },
            });
        } else if (geoLevel === 'COUNTRY') {
            totalPages = await prisma.country.count({
                where: { isActive: true },
            });
        } else if (geoLevel === 'NICHE') {
            totalPages = 1; // Just the niche page
        }

        const job = await prisma.bulkJob.create({
            data: {
                name: name || `${insuranceType.name} - ${geoLevel} Pages`,
                templateId,
                insuranceTypeId,
                geoLevel: geoLevel as GeoLevel,
                countryId: countryId || null,
                stateId: stateId || null,
                csvData: csvData || null,
                variableMapping: variableMapping || null,
                publishOnCreate: publishOnCreate ?? false,
                skipExisting: skipExisting ?? true,
                totalPages,
                status: 'PENDING' as JobStatus,
            },
            include: {
                template: { select: { name: true } },
                insuranceType: { select: { name: true } },
            },
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error('POST /api/bulk-generate error:', error);
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
}
