import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'How to Shop for Car Insurance | InsuranceBuddies',
    description: 'Learn the best strategies for shopping for car insurance. Compare quotes, find discounts, and save money.',
};

export default async function HowToShopPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p className="text-blue-400 font-medium mb-3 sm:mb-4 text-sm sm:text-base">INSURANCE GUIDE</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        How to Shop for Car Insurance
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto px-2 sm:px-0">
                        You have hundreds of options when shopping for insurance. Here's how to find the best fit.
                    </p>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="py-4 sm:py-6 bg-slate-50 border-b sticky top-[80px] sm:top-[104px] z-40">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <a href="#gather-info" className="text-blue-600 hover:text-blue-700 font-medium">1. Gather Info</a>
                        <span className="text-slate-300 hidden sm:inline">|</span>
                        <a href="#coverage-needs" className="text-blue-600 hover:text-blue-700 font-medium">2. Coverage Needs</a>
                        <span className="text-slate-300 hidden sm:inline">|</span>
                        <a href="#compare-quotes" className="text-blue-600 hover:text-blue-700 font-medium">3. Compare Quotes</a>
                        <span className="text-slate-300 hidden sm:inline">|</span>
                        <a href="#discounts" className="text-blue-600 hover:text-blue-700 font-medium">4. Find Discounts</a>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Intro */}
                        <div className="prose prose-slate max-w-none mb-12 sm:mb-16">
                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                                Shopping for car insurance doesn't have to be overwhelming. With the right approach, you can find quality coverage at a price that fits your budget. This guide walks you through the process step by step.
                            </p>
                        </div>

                        {/* Step 1 */}
                        <div id="gather-info" className="mb-12 sm:mb-16 scroll-mt-32 sm:scroll-mt-40">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-lg sm:text-xl">1</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gather Your Information</h2>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                                <p className="text-slate-600 mb-3 sm:mb-4 text-sm sm:text-base">Before you start comparing quotes, gather these documents:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-slate-600 text-sm sm:text-base">
                                        <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                                        <span><strong>Driver's license</strong> - For all drivers in your household</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-600 text-sm sm:text-base">
                                        <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                                        <span><strong>Vehicle information</strong> - VIN, make, model, year</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-600 text-sm sm:text-base">
                                        <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                                        <span><strong>Current insurance policy</strong> - Coverage details and expiration date</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-slate-600 text-sm sm:text-base">
                                        <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                                        <span><strong>Driving history</strong> - Accidents and violations from past 3-5 years</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div id="coverage-needs" className="mb-12 sm:mb-16 scroll-mt-32 sm:scroll-mt-40">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-lg sm:text-xl">2</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Determine Your Coverage Needs</h2>
                            </div>
                            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                Every state has minimum coverage requirements, but you may want more protection. Consider:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                {[
                                    { title: 'Liability', desc: 'Covers damage you cause to others. Most states require this.' },
                                    { title: 'Collision', desc: 'Covers damage to your car in an accident.' },
                                    { title: 'Comprehensive', desc: 'Covers theft, vandalism, and natural disasters.' },
                                    { title: 'Uninsured Motorist', desc: 'Protects you from uninsured drivers.' },
                                ].map((coverage, i) => (
                                    <div key={i} className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200">
                                        <h4 className="font-bold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">{coverage.title}</h4>
                                        <p className="text-xs sm:text-sm text-slate-600">{coverage.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div id="compare-quotes" className="mb-12 sm:mb-16 scroll-mt-32 sm:scroll-mt-40">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-lg sm:text-xl">3</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Compare Multiple Quotes</h2>
                            </div>
                            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                Getting quotes from at least 3-5 companies is crucial. Rates can vary by hundreds of dollars for the same coverage. Use a comparison site like InsuranceBuddies to save time.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                                <h4 className="font-bold text-blue-800 mb-1 sm:mb-2 text-sm sm:text-base">💡 Pro Tip</h4>
                                <p className="text-blue-700 text-sm sm:text-base">
                                    Make sure you're comparing the same coverage levels across all quotes. A lower price might mean less coverage.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div id="discounts" className="mb-12 sm:mb-16 scroll-mt-32 sm:scroll-mt-40">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-lg sm:text-xl">4</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Ask About Discounts</h2>
                            </div>
                            <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                Most insurers offer various discounts. Make sure to ask about:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                {[
                                    'Multi-policy bundle discount',
                                    'Safe driver discount',
                                    'Good student discount',
                                    'Low mileage discount',
                                    'Anti-theft device discount',
                                    'Defensive driving course discount',
                                    'Pay-in-full discount',
                                    'Paperless billing discount',
                                ].map((discount, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-600 text-sm sm:text-base">
                                        <span className="text-blue-500 flex-shrink-0">✓</span>
                                        <span>{discount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Related Articles */}
                        <div className="border-t border-slate-200 pt-8 sm:pt-12">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Related Articles</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <Link href="/guides/discounts" className="p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-blue-500 transition">
                                    <h4 className="font-semibold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Car Insurance Discounts</h4>
                                    <p className="text-xs sm:text-sm text-slate-500">Discover discounts you may be missing</p>
                                </Link>
                                <Link href="/car-insurance/cheapest" className="p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-blue-500 transition">
                                    <h4 className="font-semibold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Cheapest Car Insurance</h4>
                                    <p className="text-xs sm:text-sm text-slate-500">Find the most affordable options</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Start Shopping?</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto">
                        Compare quotes from 120+ companies in minutes.
                    </p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
