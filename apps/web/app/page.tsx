import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ZipCodeForm from '@/components/ZipCodeForm';
import CarrierLogos from '@/components/CarrierLogos';
import TrustpilotBadge from '@/components/TrustpilotBadge';

export const dynamic = 'force-dynamic';

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

            {/* Hero Section - Compare.com Style */}
            <section className="relative bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] pt-8 pb-20 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-teal-500/5 to-transparent rounded-full"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center pt-12">
                        {/* Insurance Type Tabs */}
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 mb-10 border border-white/20">
                            <button className="px-6 py-2.5 rounded-full bg-white text-[#0B1B34] font-semibold text-sm transition-all">
                                Car
                            </button>
                            <button className="px-6 py-2.5 rounded-full text-white/80 hover:text-white font-medium text-sm transition-all">
                                Bundle
                            </button>
                            <button className="px-6 py-2.5 rounded-full text-white/80 hover:text-white font-medium text-sm transition-all">
                                Home
                            </button>
                            <button className="px-6 py-2.5 rounded-full text-white/80 hover:text-white font-medium text-sm transition-all">
                                Pet
                            </button>
                            <button className="px-6 py-2.5 rounded-full text-white/80 hover:text-white font-medium text-sm transition-all">
                                Plan
                            </button>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Compare Car Insurance<br />
                            <span className="text-teal-400">Quotes & Save</span>
                        </h1>

                        <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
                            Compare rates from 120+ top insurance companies. Our customers save up to $867 per year.
                        </p>

                        {/* ZIP Code Form */}
                        <ZipCodeForm />

                        <p className="text-sm text-white/50 mt-4">
                            Been here before? <Link href="/login" className="text-teal-400 hover:text-teal-300 underline">Get your quotes back.</Link>
                        </p>

                        {/* Trustpilot Badge */}
                        <div className="mt-8">
                            <TrustpilotBadge />
                        </div>
                    </div>

                    {/* Carrier Logos */}
                    <div className="mt-16">
                        <p className="text-center text-white/40 text-xs uppercase tracking-widest mb-6">auto insurance</p>
                        <CarrierLogos />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
                        How InsuranceBuddies Saves You Time and Money
                    </h2>
                    <p className="text-center text-slate-500 mb-16 max-w-2xl mx-auto">
                        We make comparing insurance quotes simple, fast, and free.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">See All Your Options</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Not all insurance companies offer the same rates. We give you access to real, accurate quotes from more than 120 top companies.
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Find the Right Fit</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Compare several auto insurance quotes at once, side by side. Select the policy that best fits your needs and budget.
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Cut Your Bill in Half</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Our customers save up to $867† per year on their car insurance, cutting their insurance bills by up to 50%.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-[#0B1B34] to-[#1A3A5C] text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Leading Innovation in Insurance Shopping for 12+ Years
                    </h2>
                    <p className="text-center text-white/60 mb-16 max-w-3xl mx-auto">
                        InsuranceBuddies delivers on its promise to help customers save money and find the best insurance. As a licensed insurance agent in all 50 states, we exist to empower customers with bite-sized tips to ease those big decisions.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-teal-400 mb-2">58M+</div>
                            <div className="text-sm text-white/60 uppercase tracking-widest">Total Quotes</div>
                            <p className="text-white/40 text-sm mt-2">Our customers have compared more than 58 million insurance quotes.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-teal-400 mb-2">$340M</div>
                            <div className="text-sm text-white/60 uppercase tracking-widest">All-Time Savings</div>
                            <p className="text-white/40 text-sm mt-2">Our shoppers lowered their annual premiums by up to $867.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-teal-400 mb-2">8M+</div>
                            <div className="text-sm text-white/60 uppercase tracking-widest">Happy Customers</div>
                            <p className="text-white/40 text-sm mt-2">More than eight million customers have found the right policy.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insurance Types Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Expert Guides by Category</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Select an insurance type to find detailed coverage options, state requirements, and savings opportunities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {insuranceTypes.map((type) => (
                            <Link
                                key={type.id}
                                href={`/${type.slug}`}
                                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl text-white">{type.icon || '🛡️'}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                                            {type.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-3">
                                            {type.description || `Compare ${type.name.toLowerCase()} quotes and find the best rates.`}
                                        </p>
                                        <span className="text-sm font-semibold text-teal-600 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                                            Compare Quotes →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rate Comparison Table */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
                        Why It's Important to Compare Personalized Quotes
                    </h2>
                    <p className="text-center text-slate-500 mb-12 max-w-3xl mx-auto">
                        Multiple factors affect your car insurance rates, and each insurance company calculates premiums differently. That means prices can vary by hundreds of dollars.
                    </p>

                    <div className="max-w-5xl mx-auto overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Company</th>
                                    <th className="text-center py-4 px-4 font-semibold text-slate-900">Average Premium</th>
                                    <th className="text-center py-4 px-4 font-semibold text-slate-900">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Progressive', logo: '🔵', premium: '$134/mo' },
                                    { name: 'USAA', logo: '🔴', premium: '$76/mo' },
                                    { name: 'Liberty Mutual', logo: '🟡', premium: '$182/mo' },
                                    { name: 'Allstate', logo: '🟠', premium: '$107/mo' },
                                    { name: 'State Farm', logo: '🔴', premium: '$89/mo' },
                                ].map((company, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{company.logo}</span>
                                                <span className="font-medium text-slate-900">{company.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="font-bold text-slate-900">{company.premium}</span>
                                            <span className="text-xs text-slate-400 block">*average rate</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <Link href="/get-quote" className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors">
                                                Get Quotes
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Popular States Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Insurance Rates by State</h2>
                            <p className="text-slate-600">Local regulations and rates vary significantly. Find your state.</p>
                        </div>
                        <Link href="/states" className="hidden md:inline-flex items-center font-semibold text-teal-600 hover:text-teal-700">
                            View All States →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {states.map(state => (
                            <Link
                                key={state.id}
                                href={`/car-insurance/${state.country.code}/${state.slug}`}
                                className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all bg-white"
                            >
                                <span className="font-medium text-slate-700 group-hover:text-slate-900 text-sm">{state.name}</span>
                                <span className="text-slate-300 group-hover:text-teal-500 transition-colors">→</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/states" className="font-semibold text-teal-600">View All States →</Link>
                    </div>
                </div>
            </section>

            {/* Recent Articles */}
            {recentPages.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center tracking-tight">
                            Your Resource for All Things Insurance
                        </h2>
                        <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
                            Expert guides and articles to help you make informed insurance decisions.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {recentPages.map(page => (
                                <article key={page.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group">
                                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                        <span className="text-6xl opacity-50">{page.insuranceType?.icon || '📄'}</span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded">{page.insuranceType?.name || 'Insurance'}</span>
                                            <span className="text-xs text-slate-400">{page.publishedAt ? new Date(page.publishedAt).toLocaleDateString() : 'Recently'}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                                            <Link href={`/pages/${page.id}`}>
                                                {page.title || `${page.insuranceType?.name || 'Insurance'} in ${page.city?.name || page.state?.name || 'Your Area'}`}
                                            </Link>
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                            Detailed breakdown of coverage options, legal requirements, and top providers.
                                        </p>
                                        <Link href={`/pages/${page.id}`} className="text-sm font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1">
                                            Read More →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            { q: 'Why is it important to compare car insurance?', a: 'Insurance companies calculate your rates based on factors like your driving history, location, age, and gender. Every insurer values each factor differently, so any two companies may give you widely different quotes.' },
                            { q: 'How often should you compare car insurance quotes?', a: 'We recommend comparing quotes every six or 12 months, or whenever your policy is coming up for renewal.' },
                            { q: 'What\'s the easiest way to compare car insurance?', a: 'By far the easiest way to compare car insurance is with an insurance-comparison site. You only have to enter your information once to get quotes from multiple companies.' },
                            { q: 'Which company has the cheapest car insurance?', a: 'The cheapest company varies by driver profile and location. That\'s why comparing personalized quotes is so important.' },
                        ].map((faq, index) => (
                            <details key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                                <summary className="p-6 cursor-pointer font-semibold text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    {faq.q}
                                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Saving?</h2>
                    <p className="text-teal-100 max-w-2xl mx-auto mb-10 text-lg">
                        Join millions of Americans who saved an average of $867/year by comparing with InsuranceBuddies.
                    </p>
                    <Link
                        href="/get-quote"
                        className="inline-block bg-white text-teal-700 px-10 py-4 rounded-xl font-bold hover:bg-teal-50 transition-all transform hover:-translate-y-1 shadow-lg"
                    >
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
