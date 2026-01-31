import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states, topCities] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            orderBy: { name: 'asc' },
        }),
        prisma.city.findMany({
            where: { isActive: true },
            include: {
                state: { include: { country: true } }
            },
            orderBy: { population: 'desc' },
            take: 200,
        }),
    ]);
    return { insuranceTypes, states, topCities };
}

export const metadata: Metadata = {
    title: 'Insurance by City | Browse Local Insurance Rates',
    description: 'Find insurance information for cities across the US. Compare local rates, requirements, and top providers in your area.',
    keywords: ['insurance by city', 'local insurance rates', 'city insurance guides'],
};

export default async function CitiesPage() {
    const { insuranceTypes, states, topCities } = await getData();

    // Group cities by state
    const citiesByState = topCities.reduce((acc: Record<string, typeof topCities>, city) => {
        const stateName = city.state.name;
        if (!acc[stateName]) acc[stateName] = [];
        acc[stateName].push(city);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states.slice(0, 12)} />

            {/* Hero Section */}
            <section className="bg-slate-900 py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700 mb-4 sm:mb-6">
                        <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                        <span className="text-xs sm:text-sm font-medium text-blue-300 uppercase tracking-wider">City Directory</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Insurance by City
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto px-2 sm:px-0">
                        Find local insurance rates and top providers in your city. Compare coverage options tailored to your area.
                    </p>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-6 sm:py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm text-slate-500 font-medium">Popular Cities:</span>
                        {topCities.slice(0, 8).map(city => (
                            <Link
                                key={city.id}
                                href={`/states/${city.state.country.code}/${city.state.slug}/${city.slug}`}
                                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            >
                                {city.name}
                            </Link>
                        ))}
                        <Link href="#all-cities" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Cities by State */}
            <section id="all-cities" className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        {Object.entries(citiesByState).sort().map(([stateName, cities]) => (
                            <div key={stateName} className="mb-8 sm:mb-10 lg:mb-12">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4 border-b border-slate-200 pb-2">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                                        {stateName}
                                    </h2>
                                    <span className="text-xs sm:text-sm text-slate-500 ml-auto">
                                        {cities.length} cities
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                                    {cities.slice(0, 15).map((city) => (
                                        <Link
                                            key={city.id}
                                            href={`/states/${city.state.country.code}/${city.state.slug}/${city.slug}`}
                                            className="p-2 sm:p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-xs sm:text-sm text-slate-700 hover:text-blue-700 font-medium truncate"
                                        >
                                            {city.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {topCities.length === 0 && (
                            <div className="text-center py-16 sm:py-20">
                                <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-sm sm:text-base text-slate-500">No cities available yet. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Browse by State CTA */}
            <section className="py-12 sm:py-16 bg-slate-50 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
                        Looking for a Specific State?
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-xl mx-auto">
                        Browse our complete directory of all 50 states to find insurance information for your region.
                    </p>
                    <Link
                        href="/states"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        Browse All States
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
