import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, ArrowRight, CheckCircle2, Shield, TrendingDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
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
    ]);
    return { insuranceTypes, states };
}

export default async function ComparePage() {
    const { insuranceTypes, states } = await getData();

    const companies = [
        { name: 'Progressive', premium: '$134/mo', rating: '4.5/5', savings: 'Up to 30%' },
        { name: 'GEICO', premium: '$98/mo', rating: '4.7/5', savings: 'Up to 25%' },
        { name: 'State Farm', premium: '$89/mo', rating: '4.6/5', savings: 'Up to 20%' },
        { name: 'USAA', premium: '$76/mo', rating: '4.8/5', savings: 'Up to 35%' },
        { name: 'Allstate', premium: '$107/mo', rating: '4.4/5', savings: 'Up to 22%' },
        { name: 'Liberty Mutual', premium: '$182/mo', rating: '4.3/5', savings: 'Up to 15%' },
        { name: 'Farmers', premium: '$145/mo', rating: '4.4/5', savings: 'Up to 18%' },
        { name: 'Nationwide', premium: '$128/mo', rating: '4.5/5', savings: 'Up to 20%' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Compare Insurance Rates
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        See how rates vary between top insurance carriers. The same coverage can cost 2-3x more depending on the company.
                    </p>
                </div>
            </section>

            {/* Why Compare */}
            <section className="py-12 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingDown className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Save Up to 40%</h3>
                            <p className="text-sm text-slate-500">Same coverage, different prices. Find the best rate for your situation.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Top-Rated Carriers</h3>
                            <p className="text-sm text-slate-500">All companies listed have A+ ratings from AM Best.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">No Obligation</h3>
                            <p className="text-sm text-slate-500">Get quotes from multiple carriers without commitment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rate Comparison Table */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-4">
                        Average Monthly Premiums by Carrier
                    </h2>
                    <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">
                        Based on national averages for full coverage auto insurance. Your rate may vary based on location, driving history, and coverage needs.
                    </p>

                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Company</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Avg. Premium</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider hidden md:table-cell">Rating</th>
                                    <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider hidden md:table-cell">Potential Savings</th>
                                    <th className="text-center py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {companies.map((company, index) => (
                                    <tr key={index} className="group hover:bg-blue-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-slate-900">{company.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-bold text-slate-900 tabular-nums">{company.premium}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right hidden md:table-cell">
                                            <span className="text-slate-600">{company.rating}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right hidden md:table-cell">
                                            <span className="text-green-600 font-medium">{company.savings}</span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Link
                                                href="/get-quote"
                                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Get Quote
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        * Rates shown are national averages and for illustration purposes only. Actual rates vary by location and individual factors.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Find Your Best Rate?</h2>
                    <p className="text-slate-500 mb-8 max-w-xl mx-auto">
                        Browse our state-specific guides for rates and coverage requirements in your area.
                    </p>
                    <Link
                        href="/states"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all"
                    >
                        Browse by State
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
