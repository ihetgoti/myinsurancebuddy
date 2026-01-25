import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Static pages from the web app (manually maintained)
const STATIC_PAGES = [
    // Home
    { slug: '/', title: 'Home', category: 'main', type: 'static' },

    // Main navigation pages
    { slug: '/about', title: 'About Us', category: 'main', type: 'static' },
    { slug: '/contact', title: 'Contact', category: 'main', type: 'static' },
    { slug: '/faq', title: 'FAQ', category: 'main', type: 'static' },
    { slug: '/blog', title: 'Blog', category: 'main', type: 'static' },
    { slug: '/careers', title: 'Careers', category: 'main', type: 'static' },
    { slug: '/privacy', title: 'Privacy Policy', category: 'legal', type: 'static' },
    { slug: '/terms', title: 'Terms of Service', category: 'legal', type: 'static' },

    // Insurance type landing pages
    { slug: '/car-insurance', title: 'Car Insurance', category: 'insurance', type: 'static' },
    { slug: '/car-insurance/best', title: 'Best Car Insurance', category: 'insurance', type: 'static' },
    { slug: '/car-insurance/cheapest', title: 'Cheapest Car Insurance', category: 'insurance', type: 'static' },
    { slug: '/car-insurance/calculator', title: 'Car Insurance Calculator', category: 'tools', type: 'static' },

    { slug: '/home-insurance', title: 'Home Insurance', category: 'insurance', type: 'static' },
    { slug: '/home-insurance/best', title: 'Best Home Insurance', category: 'insurance', type: 'static' },
    { slug: '/home-insurance/cheap', title: 'Cheap Home Insurance', category: 'insurance', type: 'static' },
    { slug: '/home-insurance/cost', title: 'Home Insurance Cost', category: 'insurance', type: 'static' },
    { slug: '/home-insurance/how-much', title: 'How Much Home Insurance', category: 'insurance', type: 'static' },

    { slug: '/homeowners-insurance', title: 'Homeowners Insurance', category: 'insurance', type: 'static' },
    { slug: '/homeowners-insurance/coverage/condo-insurance', title: 'Condo Insurance', category: 'insurance', type: 'static' },
    { slug: '/homeowners-insurance/coverage/flood-insurance', title: 'Flood Insurance', category: 'insurance', type: 'static' },

    { slug: '/health-insurance', title: 'Health Insurance', category: 'insurance', type: 'static' },
    { slug: '/renters-insurance', title: 'Renters Insurance', category: 'insurance', type: 'static' },
    { slug: '/renters-insurance/best-renters-insurance-companies', title: 'Best Renters Insurance', category: 'insurance', type: 'static' },
    { slug: '/renters-insurance/cheap-renters-insurance', title: 'Cheap Renters Insurance', category: 'insurance', type: 'static' },

    { slug: '/motorcycle-insurance', title: 'Motorcycle Insurance', category: 'insurance', type: 'static' },
    { slug: '/pet-insurance', title: 'Pet Insurance', category: 'insurance', type: 'static' },
    { slug: '/business-insurance', title: 'Business Insurance', category: 'insurance', type: 'static' },
    { slug: '/business-insurance/best-business-insurance', title: 'Best Business Insurance', category: 'insurance', type: 'static' },

    { slug: '/commercial-auto-insurance', title: 'Commercial Auto Insurance', category: 'insurance', type: 'static' },
    { slug: '/commercial-auto-insurance/best-commercial-auto-insurance', title: 'Best Commercial Auto Insurance', category: 'insurance', type: 'static' },
    { slug: '/commercial-auto-insurance/cheap-commercial-auto-insurance', title: 'Cheap Commercial Auto Insurance', category: 'insurance', type: 'static' },

    // Tools and resources
    { slug: '/tools', title: 'Insurance Tools', category: 'tools', type: 'static' },
    { slug: '/tools/insurance-calculator', title: 'Insurance Calculator', category: 'tools', type: 'static' },
    { slug: '/compare', title: 'Compare Insurance', category: 'tools', type: 'static' },
    { slug: '/get-quote', title: 'Get a Quote', category: 'tools', type: 'static' },
    { slug: '/glossary', title: 'Insurance Glossary', category: 'resources', type: 'static' },
    { slug: '/resources', title: 'Resources', category: 'resources', type: 'static' },

    // Guides
    { slug: '/guides', title: 'Insurance Guides', category: 'guides', type: 'static' },
    { slug: '/guides/by-vehicle', title: 'Insurance by Vehicle', category: 'guides', type: 'static' },
    { slug: '/guides/discounts', title: 'Insurance Discounts', category: 'guides', type: 'static' },
    { slug: '/guides/how-to-shop', title: 'How to Shop for Insurance', category: 'guides', type: 'static' },
    { slug: '/guides/reviews', title: 'Insurance Reviews', category: 'guides', type: 'static' },

    // Location-based landing pages
    { slug: '/states', title: 'Insurance by State', category: 'location', type: 'static' },
    { slug: '/cities', title: 'Insurance by City', category: 'location', type: 'static' },

    // User pages
    { slug: '/login', title: 'Login', category: 'user', type: 'static' },
    { slug: '/signup', title: 'Sign Up', category: 'user', type: 'static' },
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const type = searchParams.get('type'); // 'static', 'dynamic', or 'all'
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        let allPages: any[] = [];

        // Add static pages if requested
        if (!type || type === 'all' || type === 'static') {
            let staticPages = STATIC_PAGES.map((p, idx) => ({
                id: `static-${idx}`,
                slug: p.slug,
                title: p.title,
                category: p.category,
                type: 'static',
                isPublished: true, // Static pages are always published
                isEditable: true,
                url: p.slug,
            }));

            if (category && category !== 'all') {
                staticPages = staticPages.filter(p => p.category === category);
            }

            if (search) {
                const searchLower = search.toLowerCase();
                staticPages = staticPages.filter(p =>
                    p.title.toLowerCase().includes(searchLower) ||
                    p.slug.toLowerCase().includes(searchLower)
                );
            }

            allPages = [...allPages, ...staticPages];
        }

        // Add dynamic pages from database if requested
        if (!type || type === 'all' || type === 'dynamic') {
            const dbPages = await prisma.page.findMany({
                orderBy: { updatedAt: 'desc' },
                include: {
                    insuranceType: { select: { id: true, name: true, slug: true } },
                    state: { select: { id: true, slug: true, name: true } },
                    city: { select: { id: true, slug: true, name: true } },
                }
            });

            const dynamicPages = dbPages.map(p => ({
                id: p.id,
                slug: `/${p.slug}`,
                title: p.title || p.slug,
                category: 'dynamic',
                type: 'dynamic',
                isPublished: p.isPublished,
                isAiGenerated: p.isAiGenerated,
                aiGeneratedAt: p.aiGeneratedAt,
                publishedAt: p.publishedAt,
                insuranceType: p.insuranceType?.name,
                state: p.state?.name,
                city: p.city?.name,
                geoLevel: p.geoLevel,
                isEditable: true,
                url: `/${p.slug}`,
            }));

            if (search) {
                const searchLower = search.toLowerCase();
                const filteredDynamic = dynamicPages.filter(p =>
                    p.title.toLowerCase().includes(searchLower) ||
                    p.slug.toLowerCase().includes(searchLower)
                );
                allPages = [...allPages, ...filteredDynamic];
            } else {
                allPages = [...allPages, ...dynamicPages];
            }
        }

        // Get total before pagination
        const total = allPages.length;

        // Apply pagination
        const paginatedPages = allPages.slice(offset, offset + limit);

        // Get category counts
        const categoryCounts = {
            all: STATIC_PAGES.length,
            main: STATIC_PAGES.filter(p => p.category === 'main').length,
            insurance: STATIC_PAGES.filter(p => p.category === 'insurance').length,
            tools: STATIC_PAGES.filter(p => p.category === 'tools').length,
            resources: STATIC_PAGES.filter(p => p.category === 'resources').length,
            guides: STATIC_PAGES.filter(p => p.category === 'guides').length,
            location: STATIC_PAGES.filter(p => p.category === 'location').length,
            legal: STATIC_PAGES.filter(p => p.category === 'legal').length,
            user: STATIC_PAGES.filter(p => p.category === 'user').length,
        };

        // Get dynamic page count
        const dynamicCount = await prisma.page.count();

        return NextResponse.json({
            pages: paginatedPages,
            total,
            limit,
            offset,
            staticCount: STATIC_PAGES.length,
            dynamicCount,
            categoryCounts,
        });
    } catch (error) {
        console.error('Failed to fetch all pages:', error);
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
}
