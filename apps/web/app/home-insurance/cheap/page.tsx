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
    title: 'Cheap Home Insurance: How to Save | InsuranceBuddies',
    description: 'Learn how to find cheap home insurance without sacrificing coverage. Tips and strategies to lower your premiums.',
};

const savingsTips = [
    { title: 'Bundle with Auto Insurance', savings: '5-25%', desc: 'Combining home and auto policies with the same insurer is the easiest way to save.' },
    { title: 'Increase Your Deductible', savings: '10-25%', desc: 'Raising your deductible from $500 to $1,000 can significantly lower your premium.' },
    { title: 'Improve Home Security', savings: '5-15%', desc: 'Install smoke detectors, burglar alarms, and deadbolts for discounts.' },
    { title: 'Maintain Good Credit', savings: '10-20%', desc: 'In most states, a better credit score means lower insurance rates.' },
    { title: 'Stay Claims-Free', savings: '5-10%', desc: 'Avoid filing small claims to maintain a clean history and lower rates.' },
    { title: 'Update Your Home', savings: '5-15%', desc: 'Updating electrical, plumbing, and roofing can reduce risk and premiums.' },
    { title: 'Shop Around Annually', savings: 'Varies', desc: 'Rates change frequently. Compare quotes every year to ensure you have the best deal.' },
    { title: 'Ask About Discounts', savings: '5-10%', desc: 'Many insurers offer discounts for retirees, non-smokers, and loyal customers.' },
];

export default async function CheapHomeInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Cheap Home Insurance
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Learn how to find affordable home insurance without sacrificing the coverage you need.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Ways to Save on Home Insurance</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {savingsTips.map((tip, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-bold text-slate-900">{tip.title}</h3>
                                        <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-sm font-semibold">
                                            {tip.savings}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">{tip.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 bg-teal-50 border border-teal-200 rounded-xl p-6">
                            <h3 className="font-bold text-teal-800 mb-2">💡 Pro Tip</h3>
                            <p className="text-teal-700">
                                The best way to find cheap home insurance is to compare quotes from multiple companies. Rates can vary by hundreds of dollars for the same coverage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Find Cheap Home Insurance</h2>
                    <p className="text-teal-100 mb-8">Compare quotes and start saving today.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

