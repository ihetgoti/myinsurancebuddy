import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Home, MapPin, Construction, Shield, Wallet, ClipboardList } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Average Cost of Home Insurance 2024 | InsuranceBuddies',
    description: 'Learn about average home insurance costs by state, coverage level, and home value.',
};

const stateCosts = [
    { state: 'Florida', avg: '$3,643' },
    { state: 'Louisiana', avg: '$2,886' },
    { state: 'Oklahoma', avg: '$2,547' },
    { state: 'Texas', avg: '$2,312' },
    { state: 'California', avg: '$1,429' },
    { state: 'New York', avg: '$1,356' },
    { state: 'Ohio', avg: '$1,124' },
    { state: 'Vermont', avg: '$892' },
];

const costByCoverage = [
    { coverage: '$200,000', avgCost: '$1,050/yr' },
    { coverage: '$300,000', avgCost: '$1,500/yr' },
    { coverage: '$400,000', avgCost: '$1,875/yr' },
    { coverage: '$500,000', avgCost: '$2,250/yr' },
];

export default async function HomeInsuranceCostPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Average Cost of Home Insurance
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                        The average cost of home insurance in the U.S. is about $1,500 per year, but rates vary significantly.
                    </p>
                </div>
            </section>

            {/* National Average */}
            <section className="py-12 sm:py-16 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">$1,500</div>
                            <p className="text-sm text-slate-600">National Average (Annual)</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">$125</div>
                            <p className="text-sm text-slate-600">Average Monthly Cost</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center sm:col-span-2 lg:col-span-1">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">$300K</div>
                            <p className="text-sm text-slate-600">Average Dwelling Coverage</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* By State */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Home Insurance Costs by State</h2>
                        
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-slate-900 text-sm sm:text-base">State</th>
                                            <th className="text-right py-3 sm:py-4 px-4 sm:px-6 font-semibold text-slate-900 text-sm sm:text-base">Avg. Annual Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stateCosts.map((item, index) => (
                                            <tr key={index} className="border-t border-slate-100">
                                                <td className="py-3 sm:py-4 px-4 sm:px-6 text-slate-900 text-sm sm:text-base">{item.state}</td>
                                                <td className="py-3 sm:py-4 px-4 sm:px-6 text-right font-bold text-slate-900 text-sm sm:text-base">{item.avg}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* By Coverage Level */}
            <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Cost by Coverage Level</h2>
                        
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {costByCoverage.map((item, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                                    <div className="text-sm text-slate-500 mb-2">Dwelling Coverage</div>
                                    <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{item.coverage}</div>
                                    <div className="text-lg sm:text-xl font-bold text-blue-600">{item.avgCost}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Factors */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">What Affects Your Rate</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { title: 'Home Value & Size', desc: 'Larger, more expensive homes cost more to insure.', Icon: Home },
                                { title: 'Location', desc: 'Areas prone to natural disasters have higher rates.', Icon: MapPin },
                                { title: 'Age of Home', desc: 'Older homes may have outdated systems that increase risk.', Icon: Construction },
                                { title: 'Coverage Amount', desc: 'More coverage means higher premiums.', Icon: Shield },
                                { title: 'Deductible', desc: 'Higher deductibles lower your monthly payment.', Icon: Wallet },
                                { title: 'Claims History', desc: 'Previous claims can increase your rates.', Icon: ClipboardList },
                            ].map((factor, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 group hover:shadow-lg transition">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                                        <factor.Icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">{factor.title}</h3>
                                    <p className="text-sm text-slate-600">{factor.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Get Your Personalized Quote</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">See how much you could save on home insurance.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
