import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import SiteDirectory from '@/components/directory/SiteDirectory';
import SmartBreadcrumb from '@/components/navigation/SmartBreadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Site Directory | Browse All Insurance Guides',
    description: 'Browse our comprehensive directory of insurance guides organized by type, state, and city. Find the best insurance coverage for your needs.',
};

async function getDirectoryData() {
    // Fetch all insurance types
    const insuranceTypes = await prisma.insuranceType.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
    });

    // Fetch all countries
    const countries = await prisma.country.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
    });

    // Fetch all states
    const states = await prisma.state.findMany({
        where: { isActive: true },
        include: { country: true },
        orderBy: { name: 'asc' },
        take: 100, // Limit for performance
    });

    // Fetch all cities (top 200)
    const cities = await prisma.city.findMany({
        where: { isActive: true },
        include: { state: { include: { country: true } } },
        orderBy: { population: 'desc' },
        take: 200,
    });

    // Get page counts for each category
    const pageCount = await prisma.page.count({ where: { isPublished: true } });

    return {
        insuranceTypes,
        countries,
        states,
        cities,
        pageCount,
    };
}

export default async function DirectoryPage() {
    const { insuranceTypes, countries, states, cities, pageCount } = await getDirectoryData();

    // Build directory sections
    const sections = [
        {
            id: 'insurance-types',
            title: 'Insurance Types',
            icon: 'insurance' as const,
            count: pageCount,
            items: insuranceTypes.map(type => ({
                id: type.id,
                title: type.name,
                href: `/${type.slug}`,
                count: undefined, // Could add per-type page count
            })),
        },
        {
            id: 'states',
            title: 'Browse by State',
            icon: 'state' as const,
            count: states.length,
            items: states.map(state => ({
                id: state.id,
                title: `${state.name}, ${state.country.name}`,
                href: `/car-insurance/${state.country.code}/${state.slug}`,
            })),
        },
        {
            id: 'cities',
            title: 'Major Cities',
            icon: 'city' as const,
            count: cities.length,
            items: cities.map(city => ({
                id: city.id,
                title: `${city.name}, ${city.state.code?.toUpperCase()}`,
                href: `/car-insurance/${city.state.country.code}/${city.state.slug}/${city.slug}`,
            })),
        },
        {
            id: 'countries',
            title: 'Countries',
            icon: 'location' as const,
            count: countries.length,
            items: countries.map(country => ({
                id: country.id,
                title: country.name,
                href: `/car-insurance/${country.code}`,
            })),
        },
    ];

    const breadcrumbItems = [
        { label: 'Home', href: '/', type: 'home' as const },
        { label: 'Directory', href: '/directory', type: 'page' as const },
    ];

    // Header data
    const [headerInsuranceTypes, headerStates] = await Promise.all([
        prisma.insuranceType.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            orderBy: { name: 'asc' },
            take: 10,
        }),
    ]);

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={headerInsuranceTypes} states={headerStates} />
            <SmartBreadcrumb items={breadcrumbItems} />
            
            <main>
                <SiteDirectory sections={sections} />

                {/* SEO Content Section */}
                <section className="py-16 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            About Our Insurance Directory
                        </h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Welcome to the most comprehensive insurance directory on the web. 
                                We&apos;ve organized thousands of pages covering every major insurance type 
                                across all 50 states and hundreds of cities nationwide.
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Whether you&apos;re looking for auto insurance in Texas, home insurance in 
                                California, or health insurance options in Florida, our programmatic 
                                system generates detailed, location-specific guides to help you make 
                                informed decisions.
                            </p>
                            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                                How to Navigate
                            </h3>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Browse by insurance type to compare coverage options</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Explore by state to see local requirements and rates</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Search for specific cities to get hyper-local information</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Use the search bar to find exactly what you need</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <Footer insuranceTypes={headerInsuranceTypes} />
        </div>
    );
}
