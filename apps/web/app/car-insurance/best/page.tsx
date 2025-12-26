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
    title: 'The 10 Best Car Insurance Companies 2024 | InsuranceBuddies',
    description: 'Discover the best car insurance companies based on rates, customer service, and coverage options.',
};

const bestCompanies = [
    { rank: 1, name: 'USAA', rating: 4.9, avgRate: '$76/mo', jdPower: 882, amBest: 'A++', bestFor: 'Military families', pros: ['Lowest rates for members', 'Excellent customer service', 'Strong financial rating'], cons: ['Limited to military members'] },
    { rank: 2, name: 'State Farm', rating: 4.7, avgRate: '$89/mo', jdPower: 835, amBest: 'A++', bestFor: 'Local agent support', pros: ['Largest insurer in US', 'Great bundle discounts', 'Drive Safe & Save program'], cons: ['Rates vary by location'] },
    { rank: 3, name: 'GEICO', rating: 4.6, avgRate: '$86/mo', jdPower: 827, amBest: 'A++', bestFor: 'Online shoppers', pros: ['Easy online experience', 'Competitive rates', 'Many discounts'], cons: ['No local agents'] },
    { rank: 4, name: 'Progressive', rating: 4.5, avgRate: '$134/mo', jdPower: 823, amBest: 'A+', bestFor: 'High-risk drivers', pros: ['Name Your Price tool', 'Snapshot program', 'Accepts high-risk drivers'], cons: ['Higher average rates'] },
    { rank: 5, name: 'Allstate', rating: 4.4, avgRate: '$107/mo', jdPower: 819, amBest: 'A+', bestFor: 'Safe driver rewards', pros: ['Drivewise rewards', 'Accident forgiveness', 'Deductible rewards'], cons: ['Pricier than average'] },
];

export default async function BestCarInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-teal-400 font-medium mb-4">UPDATED DECEMBER 2024</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        The 10 Best Car Insurance Companies
                    </h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Progressive, State Farm, and USAA are among the best car insurance companies. But the best company for you depends on your specific needs.
                    </p>
                </div>
            </section>

            {/* Rankings */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {bestCompanies.map((company) => (
                            <div key={company.rank} className={`bg-white rounded-xl border ${company.rank === 1 ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200'} overflow-hidden`}>
                                {company.rank === 1 && (
                                    <div className="bg-teal-600 text-white text-center py-2 text-sm font-semibold">
                                        🏆 BEST OVERALL
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-400">
                                                {company.rank}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{company.name}</h3>
                                                <p className="text-sm text-slate-500">Best for: {company.bestFor}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="font-bold">{company.rating}</span>
                                                </div>
                                                <span className="text-xs text-slate-500">Our Rating</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-slate-900">{company.avgRate}</div>
                                                <span className="text-xs text-slate-500">Avg. Rate</span>
                                            </div>
                                            <Link
                                                href="/get-quote"
                                                className={`px-6 py-2 rounded-lg font-semibold transition ${company.rank === 1 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                Get Quote
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-semibold text-green-600 mb-2">✓ Pros</h4>
                                            <ul className="space-y-1">
                                                {company.pros.map((pro, i) => (
                                                    <li key={i} className="text-sm text-slate-600">• {pro}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-600 mb-2">✗ Cons</h4>
                                            <ul className="space-y-1">
                                                {company.cons.map((con, i) => (
                                                    <li key={i} className="text-sm text-slate-600">• {con}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Ratings</h4>
                                            <div className="space-y-1 text-sm text-slate-600">
                                                <p>J.D. Power: <strong>{company.jdPower}/1000</strong></p>
                                                <p>AM Best: <strong>{company.amBest}</strong></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How We Rated */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How We Rated Companies</h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                { title: 'Price', weight: '30%', desc: 'Average rates across coverage levels' },
                                { title: 'Customer Service', weight: '25%', desc: 'J.D. Power satisfaction scores' },
                                { title: 'Financial Strength', weight: '25%', desc: 'AM Best ratings and stability' },
                                { title: 'Coverage Options', weight: '20%', desc: 'Available discounts and features' },
                            ].map((factor, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                                    <div className="text-2xl font-bold text-teal-600 mb-2">{factor.weight}</div>
                                    <h3 className="font-bold text-slate-900 mb-1">{factor.title}</h3>
                                    <p className="text-xs text-slate-500">{factor.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Find Your Best Rate</h2>
                    <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                        Compare personalized quotes from top-rated companies.
                    </p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

