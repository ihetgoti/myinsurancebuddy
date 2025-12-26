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
    title: 'Compare Renters Insurance Quotes | InsuranceBuddies',
    description: 'Compare renters insurance quotes from top companies. Protect your belongings for as little as $15/month.',
};

const companies = [
    { name: 'Lemonade', avgRate: '$12/mo', rating: 4.8, bestFor: 'Tech-savvy renters' },
    { name: 'State Farm', avgRate: '$18/mo', rating: 4.7, bestFor: 'Agent support' },
    { name: 'USAA', avgRate: '$10/mo', rating: 4.9, bestFor: 'Military families' },
    { name: 'Allstate', avgRate: '$20/mo', rating: 4.5, bestFor: 'Bundle discounts' },
    { name: 'Progressive', avgRate: '$15/mo', rating: 4.4, bestFor: 'Online shoppers' },
];

export default async function RentersInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-teal-400 font-medium mb-4">PROTECT YOUR BELONGINGS</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Compare Renters Insurance Quotes
                        </h1>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Renters insurance protects your belongings and provides liability coverage for as little as $15/month.
                        </p>
                        <ZipCodeForm />
                    </div>
                </div>
            </section>

            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/renters-insurance/best-renters-insurance-companies" className="text-teal-600 hover:text-teal-700 font-medium">Best Companies</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/renters-insurance/cheap-renters-insurance" className="text-teal-600 hover:text-teal-700 font-medium">Cheap Renters Insurance</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/renters-insurance/coverage/apartment-insurance" className="text-teal-600 hover:text-teal-700 font-medium">Apartment Insurance</Link>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What Does Renters Insurance Cover?</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: 'Personal Property', desc: 'Covers your belongings like furniture, electronics, and clothing against theft, fire, and other perils.', icon: '📦' },
                                { title: 'Liability Coverage', desc: 'Protects you if someone is injured in your apartment or you accidentally damage someone else\'s property.', icon: '⚖️' },
                                { title: 'Additional Living Expenses', desc: 'Pays for temporary housing if your rental becomes uninhabitable due to a covered event.', icon: '🏨' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                                    <span className="text-4xl mb-4 block">{item.icon}</span>
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
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Top Renters Insurance Companies</h2>

                        <div className="space-y-4">
                            {companies.map((company, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{company.name}</h3>
                                        <p className="text-sm text-slate-500">Best for: {company.bestFor}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="font-bold text-slate-900">{company.avgRate}</div>
                                            <span className="text-xs text-slate-500">Avg. Rate</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="font-bold">{company.rating}</span>
                                            </div>
                                            <span className="text-xs text-slate-500">Rating</span>
                                        </div>
                                        <Link href="/get-quote" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition">
                                            Get Quote
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Protect Your Belongings Today</h2>
                    <p className="text-teal-100 mb-8">Renters insurance starts at just $12/month.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

