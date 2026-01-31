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
    title: 'Cheap Home Insurance: How to Save | InsuranceBuddies',
    description: 'Learn how to find cheap home insurance without sacrificing coverage. Tips and strategies to lower your premiums.',
};

const savingsTips = [
    { title: 'Bundle with Auto Insurance', savings: '5-25%', desc: 'Combining home and auto policies with the same insurer is the easiest way to save.' },
    { title: 'Increase Your Deductible', savings: '10-25%', desc: 'Raising your deductible from $500 to $1,000 can significantly lower your premium.' },
    { title: 'Improve Home Security', savings: '5-15%', desc: 'Install smoke detectors, burglar alarms, and deadbolts for discounts.' },
    { title: 'Maintain Good Credit', savings: '10-20%', desc: 'In most states, a better credit score means lower insurance rates.' },
    { title: 'Stay Claims-Free', savings: '5-10%', desc: 'Avoid filing small claims to maintain a clean history and lower rates.' },
    { title: 'Update Your Home', savings: '5-15%', desc: 'Updating electrical, plumbing, and roofing can reduce risk and premiums.' },
    { title: 'Shop Around Annually', savings: 'Varies', desc: 'Rates change frequently. Compare quotes every year to ensure you have the best deal.' },
    { title: 'Ask About Discounts', savings: '5-10%', desc: 'Many insurers offer discounts for retirees, non-smokers, and loyal customers.' },
];

const cheapCompanies = [
    { name: 'USAA', avgRate: '$98/mo', rating: 4.9, note: 'Military only' },
    { name: 'Erie Insurance', avgRate: '$105/mo', rating: 4.6, note: 'Limited states' },
    { name: 'Auto-Owners', avgRate: '$112/mo', rating: 4.4, note: 'Great value' },
    { name: 'State Farm', avgRate: '$125/mo', rating: 4.7, note: 'Nationwide' },
];

export default async function CheapHomeInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Cheap Home Insurance
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                        Learn how to find affordable home insurance without sacrificing the coverage you need.
                    </p>
                </div>
            </section>

            {/* Cheapest Companies */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Cheapest Home Insurance Companies</h2>
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {cheapCompanies.map((company, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 hover:shadow-lg transition">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">{company.name}</h3>
                                        <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                            {company.avgRate}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-sm text-slate-600">{company.rating}</span>
                                        </div>
                                        <span className="text-xs sm:text-sm text-slate-500">{company.note}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Savings Tips */}
            <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Ways to Save on Home Insurance</h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {savingsTips.map((tip, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 hover:shadow-lg transition">
                                    <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{tip.title}</h3>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                                            {tip.savings}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">{tip.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 sm:mt-12 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                            <h3 className="font-bold text-blue-800 mb-2 text-sm sm:text-base">💡 Pro Tip</h3>
                            <p className="text-blue-700 text-sm sm:text-base">
                                The best way to find cheap home insurance is to compare quotes from multiple companies. Rates can vary by hundreds of dollars for the same coverage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Find Cheap Home Insurance</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">Compare quotes and start saving today.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
