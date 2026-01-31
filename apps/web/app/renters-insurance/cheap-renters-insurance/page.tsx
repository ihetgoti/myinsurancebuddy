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
    title: 'Cheap Renters Insurance | InsuranceBuddies',
    description: 'Find cheap renters insurance starting at $5/month. Learn how to save on renters insurance coverage.',
};

export default async function CheapRentersInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Cheap Renters Insurance
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto px-2 sm:px-0">
                        Renters insurance is one of the most affordable types of coverage. Learn how to get the best rates.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-10 sm:py-12 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">$5-$15</div>
                            <p className="text-xs sm:text-sm text-slate-600">Cheapest monthly rates</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">$15</div>
                            <p className="text-xs sm:text-sm text-slate-600">Average monthly cost</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">$30K</div>
                            <p className="text-xs sm:text-sm text-slate-600">Typical coverage amount</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">How to Get Cheap Renters Insurance</h2>

                        <div className="space-y-4 sm:space-y-6">
                            {[
                                { title: 'Bundle with Auto Insurance', desc: 'Combining renters and auto insurance can save you 5-15% on both policies.' },
                                { title: 'Choose a Higher Deductible', desc: 'A $1,000 deductible instead of $500 can lower your premium significantly.' },
                                { title: 'Only Get Coverage You Need', desc: 'Don\'t over-insure. Calculate the actual value of your belongings.' },
                                { title: 'Ask About Discounts', desc: 'Security systems, smoke detectors, and being claim-free can all reduce your rate.' },
                                { title: 'Compare Multiple Quotes', desc: 'Rates vary widely between companies. Always compare at least 3-5 quotes.' },
                                { title: 'Pay Annually', desc: 'Paying your full annual premium upfront often comes with a discount.' },
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 font-bold text-xs sm:text-sm">{i + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">{tip.title}</h3>
                                        <p className="text-slate-600 text-sm sm:text-base">{tip.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Find Cheap Renters Insurance</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">Compare quotes starting at $5/month.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
