import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ZipCodeForm from '@/components/ZipCodeForm';

export const dynamic = 'force-dynamic';



async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Compare Home Insurance Quotes | InsuranceBuddies',
    description: 'Compare home insurance quotes from top companies. Protect your home and save money.',
};

const homeInsuranceCompanies = [
    { name: 'State Farm', avgRate: '$125/mo', rating: 4.7 },
    { name: 'Allstate', avgRate: '$142/mo', rating: 4.5 },
    { name: 'USAA', avgRate: '$98/mo', rating: 4.9 },
    { name: 'Liberty Mutual', avgRate: '$156/mo', rating: 4.3 },
    { name: 'Farmers', avgRate: '$138/mo', rating: 4.4 },
];

export default async function HomeInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-teal-400 font-medium mb-4">PROTECT YOUR HOME</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Compare Home Insurance Quotes
                        </h1>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Find the best home insurance coverage at the right price. Compare quotes from top-rated insurers.
                        </p>
                        <ZipCodeForm />
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/home-insurance/best" className="text-teal-600 hover:text-teal-700 font-medium">Best Companies</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/home-insurance/cost" className="text-teal-600 hover:text-teal-700 font-medium">Average Cost</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/home-insurance/how-much" className="text-teal-600 hover:text-teal-700 font-medium">How Much Do You Need?</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/home-insurance/cheap" className="text-teal-600 hover:text-teal-700 font-medium">Cheap Home Insurance</Link>
                    </div>
                </div>
            </section>

            {/* What's Covered */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What Does Home Insurance Cover?</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'Dwelling Coverage', desc: 'Covers the structure of your home against fire, wind, hail, and other perils.', icon: '🏠' },
                                { title: 'Personal Property', desc: 'Protects your belongings like furniture, electronics, and clothing.', icon: '📦' },
                                { title: 'Liability Protection', desc: 'Covers legal costs if someone is injured on your property.', icon: '⚖️' },
                                { title: 'Additional Living Expenses', desc: 'Pays for temporary housing if your home is uninhabitable.', icon: '🏨' },
                                { title: 'Other Structures', desc: 'Covers detached garages, sheds, and fences on your property.', icon: '🏗️' },
                                { title: 'Medical Payments', desc: 'Covers minor injuries to guests regardless of fault.', icon: '🏥' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
                                    <div className="flex items-start gap-4">
                                        <span className="text-3xl">{item.icon}</span>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-sm text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Comparison */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Top Home Insurance Companies</h2>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-900">Company</th>
                                        <th className="text-center py-4 px-6 font-semibold text-slate-900">Avg. Rate</th>
                                        <th className="text-center py-4 px-6 font-semibold text-slate-900">Rating</th>
                                        <th className="text-center py-4 px-6 font-semibold text-slate-900">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {homeInsuranceCompanies.map((company, index) => (
                                        <tr key={company.name} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                            <td className="py-4 px-6 font-medium text-slate-900">{company.name}</td>
                                            <td className="py-4 px-6 text-center font-bold text-slate-900">{company.avgRate}</td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="font-medium">{company.rating}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <Link href="/get-quote" className="text-teal-600 font-semibold hover:text-teal-700">
                                                    Get Quote →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Average Cost */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Average Cost of Home Insurance</h2>
                        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
                            The average cost of home insurance in the U.S. is about $1,500 per year, but rates vary significantly by state and coverage level.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-slate-50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-teal-600 mb-2">$1,500</div>
                                <p className="text-sm text-slate-600">Average annual premium</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-teal-600 mb-2">$125</div>
                                <p className="text-sm text-slate-600">Average monthly cost</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-teal-600 mb-2">25%</div>
                                <p className="text-sm text-slate-600">Potential savings with bundling</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Home Insurance FAQ</h2>

                        <div className="space-y-4">
                            {[
                                { q: 'How much home insurance do I need?', a: 'You should have enough dwelling coverage to rebuild your home completely. This is typically based on the cost per square foot to build in your area.' },
                                { q: 'What\'s not covered by home insurance?', a: 'Standard policies typically don\'t cover floods, earthquakes, or normal wear and tear. You may need separate policies for these risks.' },
                                { q: 'How can I lower my home insurance costs?', a: 'Bundle with auto insurance, increase your deductible, improve home security, and maintain a good credit score.' },
                                { q: 'Do I need home insurance if I own my home outright?', a: 'While not legally required, home insurance protects your investment and provides liability coverage if someone is injured on your property.' },
                            ].map((faq, index) => (
                                <details key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                                    <summary className="p-6 cursor-pointer font-semibold text-slate-900 hover:bg-slate-50 transition flex items-center justify-between">
                                        {faq.q}
                                        <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-6 pb-6 text-slate-600">{faq.a}</div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Protect Your Home Today</h2>
                    <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                        Compare home insurance quotes and find the coverage you need.
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

