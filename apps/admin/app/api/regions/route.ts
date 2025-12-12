import { NextRequest, NextResponse } from 'next/server';

const WEB_API_URL = process.env.WEB_API_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
    const apiUrl = `${WEB_API_URL}/api/regions`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
    }
}
