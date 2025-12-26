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

export default async function HomeInsuranceCostPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Average Cost of Home Insurance
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        The average cost of home insurance in the U.S. is about $1,500 per year, but rates vary significantly.
                    </p>
                </div>
            </section>

            {/* National Average */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                            <div className="text-4xl font-bold text-teal-600 mb-2">$1,500</div>
                            <p className="text-sm text-slate-600">National Average (Annual)</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                            <div className="text-4xl font-bold text-teal-600 mb-2">$125</div>
                            <p className="text-sm text-slate-600">Average Monthly Cost</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                            <div className="text-4xl font-bold text-teal-600 mb-2">$300K</div>
                            <p className="text-sm text-slate-600">Average Dwelling Coverage</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* By State */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Home Insurance Costs by State</h2>
                        
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-900">State</th>
                                        <th className="text-right py-4 px-6 font-semibold text-slate-900">Avg. Annual Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stateCosts.map((item, index) => (
                                        <tr key={index} className="border-t border-slate-100">
                                            <td className="py-4 px-6 text-slate-900">{item.state}</td>
                                            <td className="py-4 px-6 text-right font-bold text-slate-900">{item.avg}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Factors */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Affects Your Rate</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'Home Value & Size', desc: 'Larger, more expensive homes cost more to insure.' },
                                { title: 'Location', desc: 'Areas prone to natural disasters have higher rates.' },
                                { title: 'Age of Home', desc: 'Older homes may have outdated systems that increase risk.' },
                                { title: 'Coverage Amount', desc: 'More coverage means higher premiums.' },
                                { title: 'Deductible', desc: 'Higher deductibles lower your monthly payment.' },
                                { title: 'Claims History', desc: 'Previous claims can increase your rates.' },
                            ].map((factor, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-2">{factor.title}</h3>
                                    <p className="text-sm text-slate-600">{factor.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Get Your Personalized Quote</h2>
                    <p className="text-teal-100 mb-8">See how much you could save on home insurance.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

