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
    title: 'Compare Motorcycle Insurance Quotes | InsuranceBuddies',
    description: 'Compare motorcycle insurance quotes from top companies. Find affordable coverage for your bike.',
};

const companies = [
    { name: 'Progressive', avgRate: '$75/mo', rating: 4.6, bestFor: 'Most riders' },
    { name: 'GEICO', avgRate: '$68/mo', rating: 4.5, bestFor: 'Online shoppers' },
    { name: 'Harley-Davidson Insurance', avgRate: '$85/mo', rating: 4.4, bestFor: 'Harley owners' },
    { name: 'Allstate', avgRate: '$92/mo', rating: 4.3, bestFor: 'Bundle discounts' },
    { name: 'Nationwide', avgRate: '$78/mo', rating: 4.4, bestFor: 'Vanishing deductible' },
];

export default async function MotorcycleInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-teal-400 font-medium mb-4">RIDE WITH CONFIDENCE</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Compare Motorcycle Insurance Quotes
                        </h1>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Find affordable motorcycle insurance that protects you and your bike on every ride.
                        </p>
                        <ZipCodeForm />
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Motorcycle Insurance Coverage Types</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'Liability Coverage', desc: 'Covers damage and injuries you cause to others. Required in most states.' },
                                { title: 'Collision Coverage', desc: 'Pays to repair your motorcycle after an accident, regardless of fault.' },
                                { title: 'Comprehensive Coverage', desc: 'Covers theft, vandalism, weather damage, and other non-collision events.' },
                                { title: 'Uninsured Motorist', desc: 'Protects you if hit by a driver without insurance.' },
                                { title: 'Medical Payments', desc: 'Covers medical expenses for you and passengers after an accident.' },
                                { title: 'Accessory Coverage', desc: 'Covers custom parts and accessories added to your bike.' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Top Motorcycle Insurance Companies</h2>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-900">Company</th>
                                        <th className="text-center py-4 px-6 font-semibold text-slate-900">Avg. Rate</th>
                                        <th className="text-center py-4 px-6 font-semibold text-slate-900">Rating</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-900">Best For</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map((company, index) => (
                                        <tr key={index} className="border-t border-slate-100">
                                            <td className="py-4 px-6 font-medium text-slate-900">{company.name}</td>
                                            <td className="py-4 px-6 text-center font-bold text-slate-900">{company.avgRate}</td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span>{company.rating}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-500">{company.bestFor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Get Motorcycle Insurance Quotes</h2>
                    <p className="text-teal-100 mb-8">Compare rates and find the best coverage for your ride.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

