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
    title: 'Cheapest Car Insurance Companies 2024 | InsuranceBuddies',
    description: 'Find the cheapest car insurance companies. Compare rates and save up to $867/year on auto insurance.',
};

const cheapestCompanies = [
    { rank: 1, name: 'COUNTRY Financial', avgRate: '$42/mo', minCoverage: '$36/mo', fullCoverage: '$89/mo', bestFor: 'Overall cheapest' },
    { rank: 2, name: 'Auto-Owners', avgRate: '$48/mo', minCoverage: '$41/mo', fullCoverage: '$95/mo', bestFor: 'Midwest drivers' },
    { rank: 3, name: 'USAA', avgRate: '$52/mo', minCoverage: '$45/mo', fullCoverage: '$98/mo', bestFor: 'Military families' },
    { rank: 4, name: 'State Farm', avgRate: '$58/mo', minCoverage: '$50/mo', fullCoverage: '$112/mo', bestFor: 'Bundle discounts' },
    { rank: 5, name: 'GEICO', avgRate: '$62/mo', minCoverage: '$54/mo', fullCoverage: '$118/mo', bestFor: 'Online shoppers' },
    { rank: 6, name: 'Progressive', avgRate: '$68/mo', minCoverage: '$58/mo', fullCoverage: '$134/mo', bestFor: 'High-risk drivers' },
    { rank: 7, name: 'Allstate', avgRate: '$75/mo', minCoverage: '$65/mo', fullCoverage: '$142/mo', bestFor: 'Safe driver rewards' },
    { rank: 8, name: 'Nationwide', avgRate: '$78/mo', minCoverage: '$68/mo', fullCoverage: '$148/mo', bestFor: 'Vanishing deductible' },
    { rank: 9, name: 'Farmers', avgRate: '$82/mo', minCoverage: '$72/mo', fullCoverage: '$156/mo', bestFor: 'Local agents' },
    { rank: 10, name: 'Liberty Mutual', avgRate: '$95/mo', minCoverage: '$82/mo', fullCoverage: '$182/mo', bestFor: 'New car replacement' },
];

export default async function CheapestCarInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-teal-400 font-medium mb-4">UPDATED DECEMBER 2024</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Cheapest Car Insurance Companies
                    </h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        COUNTRY Financial, Auto-Owners, and USAA are among the cheapest auto insurers in the U.S., but the cheapest company for you depends on your specific situation.
                    </p>
                </div>
            </section>

            {/* Key Findings */}
            <section className="py-12 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <h2 className="font-bold text-slate-900 mb-4">Key Findings</h2>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">✓</span>
                                    <span><strong>COUNTRY Financial</strong> has the cheapest overall rates, starting at $42/month on average.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">✓</span>
                                    <span><strong>USAA</strong> offers the best rates for military members and their families.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">✓</span>
                                    <span>Rates can vary by <strong>$100+/month</strong> between companies for the same driver.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rankings Table */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                            10 Cheapest Car Insurance Companies
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-4 px-4 font-semibold text-slate-900">Rank</th>
                                        <th className="text-left py-4 px-4 font-semibold text-slate-900">Company</th>
                                        <th className="text-center py-4 px-4 font-semibold text-slate-900">Avg. Rate</th>
                                        <th className="text-center py-4 px-4 font-semibold text-slate-900">Min Coverage</th>
                                        <th className="text-center py-4 px-4 font-semibold text-slate-900">Full Coverage</th>
                                        <th className="text-left py-4 px-4 font-semibold text-slate-900">Best For</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cheapestCompanies.map((company) => (
                                        <tr key={company.rank} className="border-t border-slate-100 hover:bg-slate-50">
                                            <td className="py-4 px-4">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${company.rank <= 3 ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {company.rank}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-medium text-slate-900">{company.name}</td>
                                            <td className="py-4 px-4 text-center font-bold text-slate-900">{company.avgRate}</td>
                                            <td className="py-4 px-4 text-center text-slate-600">{company.minCoverage}</td>
                                            <td className="py-4 px-4 text-center text-slate-600">{company.fullCoverage}</td>
                                            <td className="py-4 px-4 text-sm text-slate-500">{company.bestFor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="text-xs text-slate-500 text-center mt-4">
                            *Rates based on analysis of 90+ million quotes. Actual rates vary by location and driver profile.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tips to Save */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                            How to Get Cheaper Car Insurance
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'Compare Multiple Quotes', desc: 'Get quotes from at least 3-5 companies to find the best rate.' },
                                { title: 'Bundle Policies', desc: 'Combine auto and home insurance for discounts up to 25%.' },
                                { title: 'Raise Your Deductible', desc: 'A higher deductible means lower monthly premiums.' },
                                { title: 'Ask About Discounts', desc: 'Safe driver, good student, and multi-car discounts add up.' },
                                { title: 'Maintain Good Credit', desc: 'In most states, better credit means lower insurance rates.' },
                                { title: 'Drive Less', desc: 'Low-mileage discounts can save you 5-15% on premiums.' },
                            ].map((tip, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-2">{tip.title}</h3>
                                    <p className="text-sm text-slate-600">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Find Your Cheapest Rate</h2>
                    <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                        Compare personalized quotes from 120+ companies in minutes.
                    </p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

