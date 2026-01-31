import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { MapPin, Flag, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            orderBy: { name: 'asc' },
        }),
    ]);
    return { insuranceTypes, states };
}

export const metadata: Metadata = {
    title: 'Insurance by State | All 50 US States',
    description: 'Find insurance information for all 50 US states. Explore state-specific requirements, rates, regulations, and local providers.',
    keywords: ['insurance by state', 'state insurance requirements', 'US insurance rates by state'],
};

export default async function StatesPage() {
    const { insuranceTypes, states } = await getData();

    // Group states by first letter
    const groupedStates = states.reduce((acc: Record<string, typeof states>, state) => {
        const letter = state.name[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(state);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states.slice(0, 12)} />

            {/* Hero Section */}
            <section className="bg-slate-900 py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700 mb-4 sm:mb-6">
                        <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                        <span className="text-xs sm:text-sm font-medium text-blue-300 uppercase tracking-wider">State Directory</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Insurance by State
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto px-2 sm:px-0">
                        Explore state-specific requirements, rates, and top providers across all 50 US states.
                    </p>
                    <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs sm:text-sm">
                            {states.length} States
                        </span>
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs sm:text-sm">
                            {insuranceTypes.length} Insurance Types
                        </span>
                    </div>
                </div>
            </section>

            {/* Quick Navigation */}
            <section className="py-4 sm:py-6 bg-slate-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                        {Object.keys(groupedStates).sort().map((letter) => (
                            <a
                                key={letter}
                                href={`#section-${letter}`}
                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                            >
                                {letter}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* States by Letter */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        {Object.entries(groupedStates).sort().map(([letter, stateList]) => (
                            <div key={letter} id={`section-${letter}`} className="mb-8 sm:mb-10 lg:mb-12 scroll-mt-24">
                                <div className="flex items-center gap-3 mb-3 sm:mb-4 border-b-2 border-blue-100 pb-2">
                                    <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg font-bold text-sm sm:text-base">
                                        {letter}
                                    </span>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                        States Starting with {letter}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                                    {stateList.map((state) => (
                                        <Link
                                            key={state.id}
                                            href={`/states/${state.country.code}/${state.slug}`}
                                            className="group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                                        >
                                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <span className="text-sm sm:text-base text-slate-700 group-hover:text-blue-700 font-medium block truncate">
                                                    {state.name}
                                                </span>
                                                <span className="text-xs text-slate-400">{state.code}</span>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {states.length === 0 && (
                            <div className="text-center py-16 sm:py-20">
                                <Flag className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-sm sm:text-base text-slate-500">No states available yet. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Browse by City CTA */}
            <section className="py-12 sm:py-16 bg-slate-50 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
                        Looking for City-Specific Information?
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-xl mx-auto">
                        Browse our city directory to find insurance rates and providers in your local area.
                    </p>
                    <Link
                        href="/cities"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        Browse Cities
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
