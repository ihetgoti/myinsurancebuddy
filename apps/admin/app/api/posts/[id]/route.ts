import { NextRequest, NextResponse } from 'next/server';

const WEB_API_URL = process.env.WEB_API_URL || 'http://localhost:3000';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const apiUrl = `${WEB_API_URL}/api/posts/${params.id}`;

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
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const apiUrl = `${WEB_API_URL}/api/posts/${params.id}`;

        const response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie')! } : {}),
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const apiUrl = `${WEB_API_URL}/api/posts/${params.id}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                ...(request.headers.get('cookie') ? { cookie: request.headers.get('cookie')! } : {}),
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
