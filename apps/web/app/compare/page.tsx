import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PrismaClient } from '@myinsurancebuddy/db';

const prisma = new PrismaClient();

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Compare Insurance Rates | MyInsuranceBuddies',
    description: 'Compare insurance rates from top providers. Find the best coverage at the lowest price.',
};

export default async function ComparePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Compare Insurance Rates</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Side-by-side comparisons from trusted providers.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Insurance Type to Compare</h2>
                        <p className="text-slate-600">Select a category below to view detailed rate comparisons.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {insuranceTypes.map((type) => (
                            <Link
                                key={type.id}
                                href={`/${type.slug}`}
                                className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100"
                            >
                                <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors">
                                    <span className="text-2xl group-hover:grayscale group-hover:brightness-200">{type.icon || '✦'}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{type.name}</h3>
                                <p className="text-slate-500 text-sm mb-4">Compare top {type.name.toLowerCase()} providers and find the best rates.</p>
                                <span className="text-blue-600 font-semibold text-sm group-hover:underline">Compare Rates →</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-20 max-w-3xl mx-auto bg-slate-50 rounded-xl p-8 text-center">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Need Personalized Recommendations?</h3>
                        <p className="text-slate-600 mb-6">Get a free quote tailored to your specific needs and location.</p>
                        <Link href="/get-quote" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition">
                            Get Your Free Quote
                        </Link>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
