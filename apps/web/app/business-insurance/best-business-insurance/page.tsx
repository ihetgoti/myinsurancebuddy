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
    title: 'Best Business Insurance Companies 2024 | InsuranceBuddies',
    description: 'Compare the best business insurance companies for small businesses and enterprises.',
};

const companies = [
    { rank: 1, name: 'The Hartford', rating: 4.8, bestFor: 'Small businesses' },
    { rank: 2, name: 'Hiscox', rating: 4.7, bestFor: 'Online businesses' },
    { rank: 3, name: 'State Farm', rating: 4.6, bestFor: 'Local businesses' },
    { rank: 4, name: 'Nationwide', rating: 4.5, bestFor: 'Growing businesses' },
    { rank: 5, name: 'Progressive Commercial', rating: 4.4, bestFor: 'Quick quotes' },
];

export default async function BestBusinessInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-teal-400 font-medium mb-4">UPDATED DECEMBER 2024</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Best Business Insurance Companies
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Find the best business insurance to protect your company.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {companies.map((company) => (
                            <div key={company.rank} className={`bg-white rounded-xl border ${company.rank === 1 ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200'} p-6`}>
                                {company.rank === 1 && (
                                    <div className="text-teal-600 text-sm font-semibold mb-3">🏆 BEST OVERALL</div>
                                )}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl font-bold text-slate-400">
                                            {company.rank}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{company.name}</h3>
                                            <p className="text-sm text-slate-500">Best for: {company.bestFor}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="font-bold">{company.rating}</span>
                                        </div>
                                        <Link href="/get-quote" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition">
                                            Get Quote
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Protect Your Business Today</h2>
                    <p className="text-teal-100 mb-8">Compare business insurance quotes.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

