import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const region = searchParams.get('region'); // State Name e.g. Texas
    const regionCode = searchParams.get('region_code'); // State Code e.g. TX
    const countryCode = searchParams.get('country_code') || 'US';

    if (!region) {
        return NextResponse.json({ url: '/states' });
    }

    try {
        // 1. Find the Country
        const country = await prisma.country.findUnique({
            where: { code: countryCode.toLowerCase() },
        });

        if (!country) {
            return NextResponse.json({ url: '/states' });
        }

        // 2. Find the State
        // Try precise match with regionCode if available, else region Name
        let state = await prisma.state.findFirst({
            where: {
                countryId: country.id,
                OR: [
                    { code: regionCode || undefined },
                    { name: { equals: region, mode: 'insensitive' } }
                ],
                isActive: true,
            },
        });

        if (!state) {
            return NextResponse.json({ url: '/states' });
        }

        const stateUrl = `/states/${country.code}/${state.slug}`;
        let finalUrl = stateUrl;
        let locationName = state.name;
        let type = 'STATE';

        // 3. Find the City (if provided)
        if (city) {
            const cityRecord = await prisma.city.findFirst({
                where: {
                    stateId: state.id,
                    name: { equals: city, mode: 'insensitive' },
                    isActive: true,
                    // Optional: only link to city if it has published pages?
                    // User said "present in our page", usually implies content exists.
                    pages: {
                        some: { isPublished: true }
                    }
                },
            });

            if (cityRecord) {
                finalUrl = `${stateUrl}/${cityRecord.slug}`;
                locationName = cityRecord.name;
                type = 'CITY';
            }
        }

        return NextResponse.json({
            url: finalUrl,
            name: locationName,
            type: type
        });

    } catch (error) {
        console.error('Location resolve error:', error);
        return NextResponse.json({ url: '/states' });
    }
}
