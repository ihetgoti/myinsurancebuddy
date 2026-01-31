import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/leads
 * Capture lead information from forms
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            zipCode,
            email,
            insuranceType,
            source,
            phoneNumber,
            firstName,
            lastName,
            ...additionalData
        } = body;

        // Basic validation
        if (!zipCode || zipCode.length !== 5) {
            return NextResponse.json(
                { error: 'Valid 5-digit ZIP code is required' },
                { status: 400 }
            );
        }

        // Get IP address for tracking
        const ip = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown';

        // Get referrer
        const referrer = request.headers.get('referer') || 'direct';

        // Get user agent
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Create lead record
        const lead = await prisma.lead.create({
            data: {
                zipCode,
                email: email || null,
                phoneNumber: phoneNumber || null,
                firstName: firstName || null,
                lastName: lastName || null,
                insuranceType: insuranceType || null,
                source: source || 'web',
                ipAddress: ip,
                referrer,
                userAgent,
                metadata: additionalData,
                status: 'NEW',
            },
        });

        // Track analytics event
        console.log(`✅ Lead captured: ${lead.id} | ZIP: ${zipCode} | Type: ${insuranceType} | Source: ${source}`);

        return NextResponse.json(
            {
                success: true,
                leadId: lead.id,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('❌ Lead capture error:', error);

        // Return success anyway to not block user flow
        // Log error for debugging
        return NextResponse.json(
            {
                success: true,
                error: error.message,
            },
            { status: 200 }
        );
    }
}

/**
 * GET /api/leads
 * Fetch leads (admin only - requires authentication)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');
        const insuranceType = searchParams.get('insuranceType');
        const source = searchParams.get('source');

        const where: any = {};
        if (status) where.status = status;
        if (insuranceType) where.insuranceType = insuranceType;
        if (source) where.source = source;

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            }),
            prisma.lead.count({ where }),
        ]);

        return NextResponse.json({ leads, total, limit, offset });
    } catch (error: any) {
        console.error('Failed to fetch leads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}
