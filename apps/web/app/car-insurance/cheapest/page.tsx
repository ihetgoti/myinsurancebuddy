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
    description: 'Find the cheapest car insurance companies. Compare rates and save up to $867/year on auto insurance. Get free quotes from affordable insurers.',
};

const cheapestCompanies = [
    { rank: 1, name: 'COUNTRY Financial', avgRate: '$42/mo', minCoverage: '$36/mo', fullCoverage: '$89/mo', bestFor: 'Overall cheapest', savings: '$540/yr' },
    { rank: 2, name: 'Auto-Owners', avgRate: '$48/mo', minCoverage: '$41/mo', fullCoverage: '$95/mo', bestFor: 'Midwest drivers', savings: '$468/yr' },
    { rank: 3, name: 'USAA', avgRate: '$52/mo', minCoverage: '$45/mo', fullCoverage: '$98/mo', bestFor: 'Military families', savings: '$420/yr' },
    { rank: 4, name: 'State Farm', avgRate: '$58/mo', minCoverage: '$50/mo', fullCoverage: '$112/mo', bestFor: 'Bundle discounts', savings: '$348/yr' },
    { rank: 5, name: 'GEICO', avgRate: '$62/mo', minCoverage: '$54/mo', fullCoverage: '$118/mo', bestFor: 'Online shoppers', savings: '$300/yr' },
    { rank: 6, name: 'Progressive', avgRate: '$68/mo', minCoverage: '$58/mo', fullCoverage: '$134/mo', bestFor: 'High-risk drivers', savings: '$228/yr' },
    { rank: 7, name: 'Allstate', avgRate: '$75/mo', minCoverage: '$65/mo', fullCoverage: '$142/mo', bestFor: 'Safe driver rewards', savings: '$144/yr' },
    { rank: 8, name: 'Nationwide', avgRate: '$78/mo', minCoverage: '$68/mo', fullCoverage: '$148/mo', bestFor: 'Vanishing deductible', savings: '$108/yr' },
    { rank: 9, name: 'Farmers', avgRate: '$82/mo', minCoverage: '$72/mo', fullCoverage: '$156/mo', bestFor: 'Local agents', savings: '$60/yr' },
    { rank: 10, name: 'Liberty Mutual', avgRate: '$95/mo', minCoverage: '$82/mo', fullCoverage: '$182/mo', bestFor: 'New car replacement', savings: '-' },
];

export default async function CheapestCarInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-blue-400 font-medium mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">UPDATED DECEMBER 2024</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Cheapest Car Insurance Companies
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
                        COUNTRY Financial, Auto-Owners, and USAA are among the cheapest auto insurers in the U.S., but the cheapest company for you depends on your specific situation.
                    </p>
                </div>
            </section>

            {/* Key Findings */}
            <section className="py-8 sm:py-12 bg-slate-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
                            <h2 className="font-bold text-slate-900 mb-3 sm:mb-4 text-base sm:text-lg">Key Findings</h2>
                            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">✓</span>
                                    <span><strong>COUNTRY Financial</strong> has the cheapest overall rates, starting at $42/month on average.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">✓</span>
                                    <span><strong>USAA</strong> offers the best rates for military members and their families.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">✓</span>
                                    <span>Rates can vary by <strong>$100+/month</strong> between companies for the same driver.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rankings Table - Desktop */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 text-center">10 Cheapest Car Insurance Companies</h2>
                        <p className="text-sm sm:text-base text-slate-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
                            Compare monthly rates for minimum and full coverage from the most affordable insurers.
                        </p>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hidden md:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Rank</th>
                                            <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Company</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Avg. Rate</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Min Coverage</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Full Coverage</th>
                                            <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Best For</th>
                                            <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-slate-900 text-sm">Est. Savings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cheapestCompanies.map((company, index) => (
                                            <tr key={company.rank} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${company.rank <= 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {company.rank}
                                                    </span>
                                                </td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6">
                                                    <span className="font-semibold text-slate-900 text-sm sm:text-base">{company.name}</span>
                                                </td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center font-bold text-blue-600 text-sm sm:text-base">{company.avgRate}</td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-600 text-sm">{company.minCoverage}</td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center text-slate-600 text-sm">{company.fullCoverage}</td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-slate-500">{company.bestFor}</td>
                                                <td className="py-3 sm:py-4 px-3 sm:px-6 text-center">
                                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">{company.savings}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {cheapestCompanies.map((company) => (
                                <div key={company.rank} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${company.rank <= 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {company.rank}
                                                </span>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm">{company.name}</h3>
                                                    <p className="text-xs text-slate-500">{company.bestFor}</p>
                                                </div>
                                            </div>
                                            {company.savings !== '-' && (
                                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                                    Save {company.savings}
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="bg-slate-50 rounded-lg p-2">
                                                <div className="font-bold text-blue-600 text-sm">{company.avgRate}</div>
                                                <span className="text-xs text-slate-500">Avg. Rate</span>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-2">
                                                <div className="font-semibold text-slate-700 text-sm">{company.minCoverage}</div>
                                                <span className="text-xs text-slate-500">Min</span>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-2">
                                                <div className="font-semibold text-slate-700 text-sm">{company.fullCoverage}</div>
                                                <span className="text-xs text-slate-500">Full</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-slate-500 text-center mt-4 sm:mt-6">
                            *Rates based on analysis of 90+ million quotes. Actual rates vary by location and driver profile.
                        </p>
                    </div>
                </div>
            </section>

            {/* Cheapest by State */}
            <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 text-center">Cheapest Car Insurance by State</h2>
                        <p className="text-sm sm:text-base text-slate-600 text-center mb-8 sm:mb-12">
                            Insurance rates vary by location. Find the cheapest options in your state.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                            {states.map(state => (
                                <Link
                                    key={state.id}
                                    href={`/car-insurance/${state.country.code}/${state.slug}`}
                                    className="p-2 sm:p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition bg-white text-center"
                                >
                                    <span className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900">{state.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips to Save */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-12 text-center">
                            How to Get Cheaper Car Insurance
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Compare Multiple Quotes', desc: 'Get quotes from at least 3-5 companies to find the best rate for your profile.' },
                                { title: 'Bundle Policies', desc: 'Combine auto and home insurance for discounts up to 25% on both policies.' },
                                { title: 'Raise Your Deductible', desc: 'A higher deductible means lower monthly premiums. Just ensure you can afford it.' },
                                { title: 'Ask About Discounts', desc: 'Safe driver, good student, and multi-car discounts can add up to big savings.' },
                                { title: 'Maintain Good Credit', desc: 'In most states, better credit means lower insurance rates.' },
                                { title: 'Drive Less', desc: 'Low-mileage discounts can save you 5-15% on premiums if you drive under 10k miles/year.' },
                            ].map((tip, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">{tip.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-600">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Find Your Cheapest Rate</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                        Compare personalized quotes from 120+ companies in minutes.
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
