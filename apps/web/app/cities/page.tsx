import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

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

export const metadata = {
    title: 'All Cities | MyInsuranceBuddies',
    description: 'Find insurance information for cities across the US. Local rates, requirements, and top providers.',
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

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Insurance by City</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Find local insurance rates and top providers in your city.
                    </p>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <span className="text-sm text-slate-500">Popular:</span>
                        {topCities.slice(0, 10).map(city => (
                            <Link
                                key={city.id}
                                href={`/states/${city.state.country.code}/${city.state.slug}/${city.slug}`}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                {city.name}, {city.state.code}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {Object.entries(citiesByState).sort().map(([stateName, cities]) => (
                            <div key={stateName} className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                                    {stateName}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                    {cities.slice(0, 20).map((city) => (
                                        <Link
                                            key={city.id}
                                            href={`/states/${city.state.country.code}/${city.state.slug}/${city.slug}`}
                                            className="p-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-sm text-slate-700 hover:text-slate-900"
                                        >
                                            {city.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {topCities.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-slate-500">No cities available yet. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
