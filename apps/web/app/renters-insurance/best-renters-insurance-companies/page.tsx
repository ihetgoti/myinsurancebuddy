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
    title: 'Best Renters Insurance Companies 2024 | InsuranceBuddies',
    description: 'Compare the best renters insurance companies based on coverage, price, and customer satisfaction.',
};

const companies = [
    { rank: 1, name: 'Lemonade', rating: 4.8, avgRate: '$12/mo', bestFor: 'Tech-savvy renters', pros: ['Instant quotes', 'Fast claims via app', 'Affordable rates'], cons: ['Limited coverage options'] },
    { rank: 2, name: 'USAA', rating: 4.9, avgRate: '$10/mo', bestFor: 'Military families', pros: ['Lowest rates', 'Excellent service', 'Strong financials'], cons: ['Military only'] },
    { rank: 3, name: 'State Farm', rating: 4.7, avgRate: '$18/mo', bestFor: 'Agent support', pros: ['Large agent network', 'Bundle discounts', 'Reliable claims'], cons: ['Higher rates'] },
    { rank: 4, name: 'Allstate', rating: 4.5, avgRate: '$20/mo', bestFor: 'Coverage options', pros: ['Identity protection', 'Many discounts', 'Good app'], cons: ['Pricier than average'] },
    { rank: 5, name: 'Progressive', rating: 4.4, avgRate: '$15/mo', bestFor: 'Online shoppers', pros: ['Easy online quotes', 'Bundle savings', 'Name Your Price'], cons: ['No local agents'] },
];

export default async function BestRentersInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p className="text-blue-400 font-medium mb-3 sm:mb-4 text-sm sm:text-base">UPDATED DECEMBER 2024</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Best Renters Insurance Companies
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto px-2 sm:px-0">
                        Find the best renters insurance based on coverage, price, and customer satisfaction.
                    </p>
                </div>
            </section>

            {/* Companies List */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                        {companies.map((company) => (
                            <div key={company.rank} className={`bg-white rounded-xl border ${company.rank === 1 ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} overflow-hidden`}>
                                {company.rank === 1 && (
                                    <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                                        🏆 BEST OVERALL
                                    </div>
                                )}
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold text-slate-400 flex-shrink-0">
                                                {company.rank}
                                            </div>
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{company.name}</h3>
                                                <p className="text-xs sm:text-sm text-slate-500">Best for: {company.bestFor}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                                            <div className="text-center">
                                                <div className="font-bold text-slate-900 text-sm sm:text-base">{company.avgRate}</div>
                                                <span className="text-xs text-slate-500">Avg. Rate</span>
                                            </div>
                                            <Link href="/get-quote" className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base">
                                                Get Quote
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-semibold text-green-600 mb-1 sm:mb-2">✓ Pros</h4>
                                            <ul className="space-y-0.5 sm:space-y-1">
                                                {company.pros.map((pro, i) => (
                                                    <li key={i} className="text-xs sm:text-sm text-slate-600">• {pro}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-600 mb-1 sm:mb-2">✗ Cons</h4>
                                            <ul className="space-y-0.5 sm:space-y-1">
                                                {company.cons.map((con, i) => (
                                                    <li key={i} className="text-xs sm:text-sm text-slate-600">• {con}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Compare Renters Insurance Quotes</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">Find the best rate for your situation.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
