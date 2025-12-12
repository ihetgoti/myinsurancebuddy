import { NextRequest, NextResponse } from 'next/server';

const WEB_API_URL = process.env.WEB_API_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
    const apiUrl = `${WEB_API_URL}/api/templates`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie')! } : {}),
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const apiUrl = `${WEB_API_URL}/api/templates`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie')! } : {}),
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
