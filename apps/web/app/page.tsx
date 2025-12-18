import { PrismaClient } from '@myinsurancebuddy/db';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getHomeData() {
    const [insuranceTypes, states, recentPages] = await Promise.all([
        prisma.insuranceType.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            orderBy: { name: 'asc' },
            take: 12,
        }),
        prisma.page.findMany({
            where: { isPublished: true },
            include: {
                insuranceType: true,
                state: true,
                city: true,
            },
            orderBy: { publishedAt: 'desc' },
            take: 6,
        }),
    ]);

    return { insuranceTypes, states, recentPages };
}

export default async function HomePage() {
    const { insuranceTypes, states, recentPages } = await getHomeData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero Section */}
            <section className="relative bg-slate-900 pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center pt-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-8">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Trusted by over 1 million policyholders
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                            Insurance Made Simple. <br />
                            <span className="text-slate-400">Information You Can Trust.</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                            Navigate the complex world of insurance with confidence. un-biased guides, state-specific regulations, and transparent coverage comparisons.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/get-quote"
                                className="w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition shadow-lg text-center"
                            >
                                Start Your Search
                            </Link>
                            <Link
                                href="/compare"
                                className="w-full sm:w-auto bg-transparent border border-slate-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-slate-800 transition text-center"
                            >
                                Compare Rates
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="border-b border-gray-100 bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder logos for trust signals - using text for now to keep it clean */}
                        <span className="text-xl font-bold text-slate-800">Forbes</span>
                        <span className="text-xl font-bold text-slate-800">Bloomberg</span>
                        <span className="text-xl font-bold text-slate-800">Reuters</span>
                        <span className="text-xl font-bold text-slate-800">WSJ</span>
                    </div>
                </div>
            </section>

            {/* Main Content Areas */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Expert Guides by Category</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Select an insurance type to find detailed coverage options, state requirements, and savings opportunities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {insuranceTypes.map((type) => (
                            <Link
                                key={type.id}
                                href={`/${type.slug}`}
                                className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 ring-1 ring-slate-900/5"
                            >
                                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors duration-300">
                                    <span className="text-2xl group-hover:text-white transition-colors">{type.icon || '✦'}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {type.name}
                                </h3>
                                <p className="text-slate-500 leading-relaxed mb-6">
                                    {type.description || `Comprehensive guide to ${type.name.toLowerCase()} policies, providers, and local regulations.`}
                                </p>
                                <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                                    Browse Guides <span className="ml-1">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats / Proof */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12 text-center divider-x">
                        <div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">50+</div>
                            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">States Covered</div>
                        </div>
                        <div className="hidden md:block w-px bg-slate-100"></div>
                        <div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">10,000+</div>
                            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Articles Published</div>
                        </div>
                        <div className="hidden md:block w-px bg-slate-100"></div>
                        <div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">4.9/5</div>
                            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Customer Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular States Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Coverage usage by State</h2>
                            <p className="text-slate-600">Local regulations and rates vary significantly.</p>
                        </div>
                        <Link href="/states" className="hidden md:inline-flex items-center font-semibold text-blue-600 hover:text-blue-700">
                            View All Locations →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {states.map(state => (
                            <Link
                                key={state.id}
                                href={`/car-insurance/${state.country.code}/${state.slug}`}
                                className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white"
                            >
                                <span className="font-medium text-slate-700 group-hover:text-slate-900">{state.name}</span>
                                <span className="text-slate-300 group-hover:text-blue-500 transition-colors">→</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/states" className="font-semibold text-blue-600">View All Locations →</Link>
                    </div>
                </div>
            </section>

            {/* Recent Updates - Minimalist List */}
            {recentPages.length > 0 && (
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center tracking-tight">Latest Insurance Insights</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {recentPages.map(page => (
                                <article key={page.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <span className="text-blue-600">{page.insuranceType.name}</span>
                                        <span>•</span>
                                        <span>{page.publishedAt ? new Date(page.publishedAt).toLocaleDateString() : 'Recently'}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug hover:text-blue-600 transition-colors">
                                        <Link href={`/pages/${page.id}`}>
                                            {page.heroTitle || `${page.insuranceType.name} in ${page.city?.name || page.state?.name || 'Your Area'}`}
                                        </Link>
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                        Detailed breakdown of coverage options, legal requirements, and top providers in {page.city?.name || page.state?.name}.
                                    </p>
                                    <Link href={`/pages/${page.id}`} className="text-sm font-semibold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1">
                                        Read Analysis →
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA - Minimalist */}
            <section className="bg-slate-900 py-24 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Ready to secure your future?</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
                        Join millions of Americans who saved an average of $500/year by comparing with InsuranceBuddies.
                    </p>
                    <Link
                        href="/get-quote"
                        className="inline-block bg-white text-slate-900 px-10 py-4 rounded-lg font-bold hover:bg-slate-100 transition-all transform hover:-translate-y-1 shadow-lg"
                    >
                        Get Your Free Quote
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
