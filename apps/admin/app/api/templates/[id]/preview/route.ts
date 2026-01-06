import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/templates/[id]/preview
 * Generate a preview HTML for the template with sample data
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const template = await prisma.template.findUnique({
            where: { id: params.id },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Sample variables for preview
        const sampleVariables: Record<string, string> = {
            page_title: 'Car Insurance in Los Angeles, California',
            page_subtitle: 'Compare the best car insurance rates and save up to $500/year',
            insurance_type: 'Car Insurance',
            insurance_type_slug: 'car-insurance',
            country: 'United States',
            country_code: 'US',
            state: 'California',
            state_code: 'CA',
            state_slug: 'california',
            city: 'Los Angeles',
            city_slug: 'los-angeles',
            location: 'Los Angeles',
            avg_premium: '$150',
            avg_savings: '$500',
            population: '3,900,000',
            current_year: new Date().getFullYear().toString(),
            current_month: new Date().toLocaleString('default', { month: 'long' }),
            site_name: 'MyInsuranceBuddies',
            site_url: 'https://myinsurancebuddies.com',
        };

        // Replace variables in SEO templates
        const replaceVars = (text: string | null): string => {
            if (!text) return '';
            let result = text;
            Object.entries(sampleVariables).forEach(([key, value]) => {
                result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });
            return result;
        };

        const previewData = {
            template: {
                id: template.id,
                name: template.name,
                sections: template.sections,
                customCss: template.customCss,
            },
            seo: {
                title: replaceVars(template.seoTitleTemplate) || 'Preview Title',
                description: replaceVars(template.seoDescTemplate) || 'Preview description',
            },
            variables: sampleVariables,
            previewUrl: `/preview/template/${template.id}`,
        };

        return NextResponse.json(previewData);
    } catch (error) {
        console.error('GET /api/templates/[id]/preview error:', error);
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
    }
}

