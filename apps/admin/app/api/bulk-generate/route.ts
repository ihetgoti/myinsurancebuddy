import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET() {
    try {
        const jobs = await prisma.bulkJob.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                template: { select: { name: true } },
                insuranceType: { select: { name: true } },
            },
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Failed to fetch bulk jobs:', error);
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            name,
            dataSource,
            csvData,
            csvFileName,
            templateId,
            insuranceTypeId,
            geoLevel,
            variableMapping,
            slugPattern,
            publishOnCreate,
            updateExisting,
            skipExisting,
            validateData,
            dryRun,
        } = body;

        if (!templateId) {
            return NextResponse.json({ error: 'Template is required' }, { status: 400 });
        }

        const job = await prisma.bulkJob.create({
            data: {
                name: name || `Bulk Job - ${new Date().toISOString()}`,
                templateId,
                insuranceTypeId: insuranceTypeId || null,
                dataSource: dataSource?.toUpperCase() || 'CSV',
                geoLevel: geoLevel || null,
                csvData: csvData || null,
                csvFileName: csvFileName || null,
                variableMapping: variableMapping || null,
                slugPattern: slugPattern || null,
                totalRows: csvData?.length || 0,
                publishOnCreate: publishOnCreate || false,
                updateExisting: updateExisting || false,
                skipExisting: skipExisting !== false,
                validateData: validateData !== false,
                dryRun: dryRun || false,
                status: 'PENDING',
            },
            include: {
                template: { select: { name: true } },
                insuranceType: { select: { name: true } },
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error('Failed to create bulk job:', error);
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
}
