import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myinsurancebuddies.com';

/**
 * POST /api/seo/sitemaps/auto-submit
 * Enable/disable automatic sitemap submission
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled, schedule = 'daily', searchEngines = ['google', 'bing'] } = await req.json();

    // Get or create site settings
    let settings = await prisma.siteSettings.findFirst();
    
    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          autoSitemapSubmit: enabled,
          sitemapSubmitSchedule: schedule,
          sitemapSearchEngines: searchEngines,
        },
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          siteName: 'MyInsuranceBuddies',
          autoSitemapSubmit: enabled,
          sitemapSubmitSchedule: schedule,
          sitemapSearchEngines: searchEngines,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Auto-submit ${enabled ? 'enabled' : 'disabled'}`,
      config: { enabled, schedule, searchEngines },
    });
  } catch (error: any) {
    console.error('Auto-submit config error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/seo/sitemaps/auto-submit
 * Get auto-submit status and trigger if needed
 */
export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings?.autoSitemapSubmit) {
      return NextResponse.json({ 
        enabled: false,
        message: 'Auto-submit is disabled' 
      });
    }

    // Check if submission is due
    const lastSubmit = settings.lastSitemapSubmit;
    const schedule = settings.sitemapSubmitSchedule || 'daily';
    
    const scheduleMs = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
    }[schedule as string] || 24 * 60 * 60 * 1000;

    const isDue = !lastSubmit || (Date.now() - new Date(lastSubmit).getTime()) > scheduleMs;

    if (!isDue) {
      return NextResponse.json({
        enabled: true,
        lastSubmit,
        nextSubmit: new Date(new Date(lastSubmit!).getTime() + scheduleMs).toISOString(),
        message: 'Not due for submission yet',
      });
    }

    // Trigger submission
    const engines = (settings.sitemapSearchEngines as string[]) || ['google', 'bing'];
    const results = await submitToSearchEngines(engines);

    // Update last submit time
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { lastSitemapSubmit: new Date() },
    });

    return NextResponse.json({
      enabled: true,
      submitted: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Auto-submit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Submit to multiple search engines
async function submitToSearchEngines(engines: string[]) {
  const sitemaps = [
    `${SITE_URL}/sitemap-index.xml`,
    `${SITE_URL}/sitemap-main.xml`,
    `${SITE_URL}/sitemap-pages.xml`,
  ];

  const results: Record<string, any> = {};

  for (const engine of engines) {
    results[engine] = [];

    for (const sitemap of sitemaps) {
      try {
        let submitUrl: string;

        if (engine === 'google') {
          submitUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
        } else if (engine === 'bing') {
          submitUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
        } else {
          continue;
        }

        const response = await fetch(submitUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'MyInsuranceBuddies Sitemap Submitter/1.0',
          },
        });

        results[engine].push({
          sitemap,
          success: response.ok,
          status: response.status,
        });
      } catch (error: any) {
        results[engine].push({
          sitemap,
          success: false,
          error: error.message,
        });
      }
    }
  }

  return results;
}
