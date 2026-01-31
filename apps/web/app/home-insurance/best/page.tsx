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
    title: 'Best Home Insurance Companies 2024 | InsuranceBuddies',
    description: 'Compare the best home insurance companies based on coverage, rates, and customer satisfaction.',
};

const bestCompanies = [
    { rank: 1, name: 'USAA', rating: 4.9, avgRate: '$98/mo', bestFor: 'Military families', jdPower: 879 },
    { rank: 2, name: 'Amica', rating: 4.8, avgRate: '$115/mo', bestFor: 'Customer service', jdPower: 868 },
    { rank: 3, name: 'State Farm', rating: 4.7, avgRate: '$125/mo', bestFor: 'Agent support', jdPower: 842 },
    { rank: 4, name: 'Allstate', rating: 4.5, avgRate: '$142/mo', bestFor: 'Coverage options', jdPower: 821 },
    { rank: 5, name: 'Liberty Mutual', rating: 4.3, avgRate: '$156/mo', bestFor: 'Customization', jdPower: 808 },
];

export default async function BestHomeInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-blue-400 font-medium mb-4 text-sm sm:text-base">UPDATED DECEMBER 2024</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Best Home Insurance Companies
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                        Find the best home insurance companies based on coverage, customer satisfaction, and value.
                    </p>
                </div>
            </section>

            {/* Companies List */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                        {bestCompanies.map((company) => (
                            <div key={company.rank} className={`bg-white rounded-xl border ${company.rank === 1 ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} p-4 sm:p-6`}>
                                {company.rank === 1 && (
                                    <div className="text-blue-600 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">🏆 BEST OVERALL</div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-lg sm:text-2xl font-bold text-slate-400 flex-shrink-0">
                                            {company.rank}
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{company.name}</h3>
                                            <p className="text-xs sm:text-sm text-slate-500">Best for: {company.bestFor}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 justify-center">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="font-bold text-sm sm:text-base">{company.rating}</span>
                                            </div>
                                            <span className="text-xs text-slate-500">Rating</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-slate-900 text-sm sm:text-base">{company.avgRate}</div>
                                            <span className="text-xs text-slate-500">Avg. Rate</span>
                                        </div>
                                        <Link href="/get-quote" className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base">
                                            Get Quote
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why These Companies */}
            <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">How We Ranked These Companies</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                { title: 'Financial Strength', desc: 'Ability to pay claims', icon: '💪' },
                                { title: 'Customer Service', desc: 'J.D. Power ratings', icon: '🎧' },
                                { title: 'Coverage Options', desc: 'Variety of policies', icon: '🛡️' },
                                { title: 'Affordability', desc: 'Competitive rates', icon: '💰' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                                    <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 block">{item.icon}</span>
                                    <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{item.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Compare Home Insurance Quotes</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">Find the best coverage for your home.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
