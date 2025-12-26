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

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Cheap Renters Insurance
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Renters insurance is one of the most affordable types of coverage. Learn how to get the best rates.
                    </p>
                </div>
            </section>

            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                            <div className="text-4xl font-bold text-teal-600 mb-2">$5-$15</div>
                            <p className="text-sm text-slate-600">Cheapest monthly rates</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                            <div className="text-4xl font-bold text-teal-600 mb-2">$15</div>
                            <p className="text-sm text-slate-600">Average monthly cost</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                            <div className="text-4xl font-bold text-teal-600 mb-2">$30K</div>
                            <p className="text-sm text-slate-600">Typical coverage amount</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">How to Get Cheap Renters Insurance</h2>

                        <div className="space-y-6">
                            {[
                                { title: 'Bundle with Auto Insurance', desc: 'Combining renters and auto insurance can save you 5-15% on both policies.' },
                                { title: 'Choose a Higher Deductible', desc: 'A $1,000 deductible instead of $500 can lower your premium significantly.' },
                                { title: 'Only Get Coverage You Need', desc: 'Don\'t over-insure. Calculate the actual value of your belongings.' },
                                { title: 'Ask About Discounts', desc: 'Security systems, smoke detectors, and being claim-free can all reduce your rate.' },
                                { title: 'Compare Multiple Quotes', desc: 'Rates vary widely between companies. Always compare at least 3-5 quotes.' },
                                { title: 'Pay Annually', desc: 'Paying your full annual premium upfront often comes with a discount.' },
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-teal-600 font-bold text-sm">{i + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{tip.title}</h3>
                                        <p className="text-slate-600">{tip.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Find Cheap Renters Insurance</h2>
                    <p className="text-teal-100 mb-8">Compare quotes starting at $5/month.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

