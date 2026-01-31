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
    description: 'Discover the best car insurance companies based on rates, customer service, and coverage options. Compare top-rated insurers and find the best coverage for your needs.',
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
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-blue-400 font-medium mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">UPDATED DECEMBER 2024</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        The 10 Best Car Insurance Companies
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
                        Progressive, State Farm, and USAA are among the best car insurance companies. But the best company for you depends on your specific needs.
                    </p>
                </div>
            </section>

            {/* Comparison Table - Desktop */}
            <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 text-center">Best Car Insurance Comparison</h2>
                        <p className="text-sm sm:text-base text-slate-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
                            Compare ratings, prices, and features to find the best car insurance company for your needs.
                        </p>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hidden md:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Rank</th>
                                            <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Company</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Rating</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Avg. Rate</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">J.D. Power</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">AM Best</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bestCompanies.map((company, index) => (
                                            <tr key={company.rank} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${company.rank === 1 ? 'bg-blue-100 text-blue-700' : company.rank <= 3 ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                                        {company.rank}
                                                    </span>
                                                </td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6">
                                                    <div>
                                                        <span className="font-semibold text-slate-900 text-sm sm:text-base">{company.name}</span>
                                                        <p className="text-xs text-slate-500">{company.bestFor}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="font-semibold text-sm sm:text-base">{company.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center font-semibold text-slate-900 text-sm sm:text-base">{company.avgRate}</td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center text-sm text-slate-600">{company.jdPower}/1000</td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">{company.amBest}</span>
                                                </td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                                    <Link href="/get-quote" className="text-blue-600 font-semibold hover:text-blue-700 text-sm sm:text-base">
                                                        Get Quote →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {bestCompanies.map((company) => (
                                <div key={company.rank} className={`bg-white rounded-xl border ${company.rank === 1 ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} overflow-hidden`}>
                                    {company.rank === 1 && (
                                        <div className="bg-blue-600 text-white text-center py-2 text-xs sm:text-sm font-semibold">
                                            🏆 BEST OVERALL
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${company.rank <= 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {company.rank}
                                                </span>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{company.name}</h3>
                                                    <p className="text-xs text-slate-500">{company.bestFor}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="font-semibold text-sm">{company.rating}</span>
                                                </div>
                                                <span className="text-xs text-slate-500">Our Rating</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                                            <div className="bg-slate-50 rounded-lg p-2">
                                                <div className="font-bold text-slate-900 text-sm">{company.avgRate}</div>
                                                <span className="text-xs text-slate-500">Avg. Rate</span>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-2">
                                                <div className="font-bold text-slate-900 text-sm">{company.jdPower}</div>
                                                <span className="text-xs text-slate-500">J.D. Power</span>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-2">
                                                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">{company.amBest}</span>
                                                <span className="text-xs text-slate-500 block">AM Best</span>
                                            </div>
                                        </div>
                                        <Link href="/get-quote" className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
                                            Get Quote
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Rankings */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Detailed Company Reviews</h2>
                        
                        {bestCompanies.map((company) => (
                            <div key={company.rank} className={`bg-white rounded-xl border ${company.rank === 1 ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} overflow-hidden`}>
                                {company.rank === 1 && (
                                    <div className="bg-blue-600 text-white text-center py-2 text-xs sm:text-sm font-semibold">
                                        🏆 BEST OVERALL
                                    </div>
                                )}
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-slate-400">
                                                {company.rank}
                                            </div>
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{company.name}</h3>
                                                <p className="text-xs sm:text-sm text-slate-500">Best for: {company.bestFor}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="text-center">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="font-bold text-sm sm:text-base">{company.rating}</span>
                                                </div>
                                                <span className="text-xs text-slate-500">Our Rating</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-slate-900 text-sm sm:text-base">{company.avgRate}</div>
                                                <span className="text-xs text-slate-500">Avg. Rate</span>
                                            </div>
                                            <Link
                                                href="/get-quote"
                                                className={`hidden sm:block px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm transition ${company.rank === 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                Get Quote
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-slate-100">
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-semibold text-green-600 mb-2">✓ Pros</h4>
                                            <ul className="space-y-1">
                                                {company.pros.map((pro, i) => (
                                                    <li key={i} className="text-xs sm:text-sm text-slate-600">• {pro}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-semibold text-red-600 mb-2">✗ Cons</h4>
                                            <ul className="space-y-1">
                                                {company.cons.map((con, i) => (
                                                    <li key={i} className="text-xs sm:text-sm text-slate-600">• {con}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2">Ratings</h4>
                                            <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                                                <p>J.D. Power: <strong>{company.jdPower}/1000</strong></p>
                                                <p>AM Best: <strong>{company.amBest}</strong></p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href="/get-quote"
                                        className={`sm:hidden block w-full text-center mt-4 px-4 py-2 rounded-lg font-semibold text-sm transition ${company.rank === 1 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                    >
                                        Get Quote
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How We Rated */}
            <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">How We Rated Companies</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                            {[
                                { title: 'Price', weight: '30%', desc: 'Average rates across coverage levels' },
                                { title: 'Customer Service', weight: '25%', desc: 'J.D. Power satisfaction scores' },
                                { title: 'Financial Strength', weight: '25%', desc: 'AM Best ratings and stability' },
                                { title: 'Coverage Options', weight: '20%', desc: 'Available discounts and features' },
                            ].map((factor, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">{factor.weight}</div>
                                    <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{factor.title}</h3>
                                    <p className="text-xs text-slate-500">{factor.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Find Your Best Rate</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                        Compare personalized quotes from top-rated companies.
                    </p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
