import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface LinkCheckResult {
    url: string;
    status: 'ok' | 'broken' | 'redirect' | 'timeout' | 'error';
    statusCode?: number;
    redirectTo?: string;
    error?: string;
    page?: string;
}

// Extract all links from HTML content
function extractLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];

    // Match href and src attributes
    const hrefRegex = /(?:href|src)=["']([^"']+)["']/gi;
    let match;

    while ((match = hrefRegex.exec(html)) !== null) {
        const url = match[1];

        // Skip empty, anchors, javascript, mailto, tel
        if (!url || url.startsWith('#') || url.startsWith('javascript:') ||
            url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('data:')) {
            continue;
        }

        // Convert relative URLs to absolute
        let absoluteUrl = url;
        if (url.startsWith('/')) {
            absoluteUrl = baseUrl + url;
        } else if (!url.startsWith('http')) {
            absoluteUrl = baseUrl + '/' + url;
        }

        if (!links.includes(absoluteUrl)) {
            links.push(absoluteUrl);
        }
    }

    return links;
}

// Check if a link is valid
async function checkLink(url: string, timeout: number = 5000): Promise<LinkCheckResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)',
            },
        });

        clearTimeout(timeoutId);

        if (response.status >= 200 && response.status < 300) {
            return { url, status: 'ok', statusCode: response.status };
        }

        if (response.status >= 300 && response.status < 400) {
            const redirectTo = response.headers.get('location') || undefined;
            return { url, status: 'redirect', statusCode: response.status, redirectTo };
        }

        return { url, status: 'broken', statusCode: response.status };
    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            return { url, status: 'timeout', error: 'Request timed out' };
        }

        return { url, status: 'error', error: error.message };
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { pageIds, sampleSize = 10, baseUrl = 'https://myinsurancebuddies.com' } = body;

        // Get pages to check
        let pages;
        if (pageIds && Array.isArray(pageIds) && pageIds.length > 0) {
            pages = await prisma.page.findMany({
                where: { id: { in: pageIds } },
                select: { id: true, slug: true, title: true, content: true },
            });
        } else {
            // Get random sample of pages
            pages = await prisma.page.findMany({
                where: { isPublished: true },
                select: { id: true, slug: true, title: true, content: true },
                take: sampleSize,
            });
        }

        const results: LinkCheckResult[] = [];
        const checkedUrls = new Set<string>();

        for (const page of pages) {
            // Extract links from page content
            const content = typeof page.content === 'string'
                ? page.content
                : JSON.stringify(page.content || '');

            const links = extractLinks(content, baseUrl);

            // Also check the page URL itself
            const pageUrl = `${baseUrl}/${page.slug}`;
            if (!checkedUrls.has(pageUrl)) {
                checkedUrls.add(pageUrl);
                const result = await checkLink(pageUrl);
                results.push({ ...result, page: page.title || page.slug });
            }

            // Check links in content (limit to avoid timeout)
            for (const link of links.slice(0, 5)) {
                if (!checkedUrls.has(link)) {
                    checkedUrls.add(link);
                    const result = await checkLink(link);
                    results.push({ ...result, page: page.title || page.slug });
                }
            }
        }

        // Summary
        const summary = {
            total: results.length,
            ok: results.filter(r => r.status === 'ok').length,
            broken: results.filter(r => r.status === 'broken').length,
            redirect: results.filter(r => r.status === 'redirect').length,
            timeout: results.filter(r => r.status === 'timeout').length,
            error: results.filter(r => r.status === 'error').length,
        };

        return NextResponse.json({ summary, results });
    } catch (error: any) {
        console.error('Link check error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
