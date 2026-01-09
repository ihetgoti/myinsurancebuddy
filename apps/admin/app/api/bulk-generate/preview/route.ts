import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            dataSource,
            csvData,
            templateId,
            insuranceTypeId,
            variableMapping,
            slugPattern,
        } = body;

        const preview: any[] = [];

        if (dataSource === 'csv' && csvData) {
            for (const row of csvData.slice(0, 10)) {
                // Build variables from mapping
                const variables: Record<string, string> = {};
                Object.entries(variableMapping || {}).forEach(([varName, csvColumn]) => {
                    let value = row[csvColumn as string] || '';
                    // Try parsing JSON if it looks like an array or object
                    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                        try {
                            value = JSON.parse(value);
                        } catch (e) {
                            // Keep as string if parse fails
                        }
                    }
                    variables[varName] = value;
                });

                // Generate slug
                let slug = slugPattern || '{{slug}}';
                Object.entries(variables).forEach(([key, value]) => {
                    const slugValue = (value || '').toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    slug = slug.replace(new RegExp(`{{${key}}}`, 'g'), slugValue);
                    slug = slug.replace(new RegExp(`{{${key}_slug}}`, 'g'), slugValue);
                });

                // Clean up slug
                slug = slug.replace(/{{[^}]+}}/g, '').replace(/\/+/g, '/').replace(/(^\/|\/$)/g, '');

                // Check if exists
                const exists = slug ? await prisma.page.findUnique({
                    where: { slug },
                    select: { id: true },
                }) : null;

                preview.push({
                    slug,
                    title: variables.page_title || variables.title || 'Untitled',
                    exists: !!exists,
                    variables,
                });
            }
        }

        return NextResponse.json({ preview });
    } catch (error) {
        console.error('Failed to generate preview:', error);
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
    }
}
