import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Submit sitemaps to Google using their ping endpoint
 * Google ping endpoint: https://www.google.com/ping?sitemap=<sitemap_url>
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sitemapUrl = null, pingAll = false } = await request.json();

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myinsurancebuddies.com';

        // List of all sitemaps
        const allSitemaps = [
            `${siteUrl}/sitemap-index.xml`,
            `${siteUrl}/sitemap-main.xml`,
            `${siteUrl}/sitemap-pages.xml`,
            `${siteUrl}/sitemap-niches.xml`,
            `${siteUrl}/sitemap-states.xml`,
            `${siteUrl}/sitemap-cities.xml`,
            `${siteUrl}/sitemap-posts.xml`,
        ];

        const sitemapsToPing = pingAll
            ? allSitemaps
            : sitemapUrl
                ? [sitemapUrl]
                : [`${siteUrl}/sitemap-index.xml`]; // Default to sitemap index

        const results: Array<{ url: string; success: boolean; message: string }> = [];

        for (const sitemap of sitemapsToPing) {
            try {
                // Google ping endpoint
                const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`;

                const response = await fetch(googlePingUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'MyInsuranceBuddies Sitemap Submitter/1.0',
                    },
                });

                if (response.ok) {
                    results.push({
                        url: sitemap,
                        success: true,
                        message: 'Submitted to Google successfully',
                    });
                } else {
                    results.push({
                        url: sitemap,
                        success: false,
                        message: `Google returned status ${response.status}`,
                    });
                }
            } catch (error: any) {
                results.push({
                    url: sitemap,
                    success: false,
                    message: error.message || 'Failed to ping Google',
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            success: failCount === 0,
            message: `Submitted ${successCount} sitemap(s) to Google${failCount > 0 ? `, ${failCount} failed` : ''}`,
            results,
            submittedAt: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Sitemap ping error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to submit sitemaps' },
            { status: 500 }
        );
    }
}
