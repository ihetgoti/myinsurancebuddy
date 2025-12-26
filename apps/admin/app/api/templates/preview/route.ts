import { NextRequest, NextResponse } from 'next/server';
import { renderFullPage } from '@/lib/templates';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { templateId, context, options } = body;

        if (!templateId) {
            return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
        }

        const html = renderFullPage(templateId, context || {}, options || {});

        if (!html) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json({ html });
    } catch (error: any) {
        console.error('Preview error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
