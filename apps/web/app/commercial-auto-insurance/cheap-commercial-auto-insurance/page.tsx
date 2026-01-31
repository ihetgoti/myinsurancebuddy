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
    title: 'Cheap Commercial Auto Insurance | InsuranceBuddies',
    description: 'Find affordable commercial auto insurance for your business. Learn how to save on fleet coverage.',
};

export default async function CheapCommercialAutoPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Cheap Commercial Auto Insurance
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto px-2 sm:px-0">
                        Find affordable coverage for your business vehicles without sacrificing protection.
                    </p>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Ways to Save on Commercial Auto Insurance</h2>

                        <div className="space-y-4 sm:space-y-6">
                            {[
                                { title: 'Compare Multiple Quotes', desc: 'Rates vary significantly between insurers. Always get at least 3-5 quotes.' },
                                { title: 'Bundle Policies', desc: 'Combine commercial auto with general liability or property insurance for discounts.' },
                                { title: 'Hire Safe Drivers', desc: 'Drivers with clean records mean lower premiums for your business.' },
                                { title: 'Choose Higher Deductibles', desc: 'Increasing your deductible can significantly lower your monthly costs.' },
                                { title: 'Install Safety Features', desc: 'GPS tracking, dash cams, and safety devices can qualify you for discounts.' },
                                { title: 'Pay Annually', desc: 'Many insurers offer discounts for paying your premium in full.' },
                            ].map((tip, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-base sm:text-lg">{tip.title}</h3>
                                    <p className="text-slate-600 text-sm sm:text-base">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Find Affordable Commercial Auto Insurance</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">Compare quotes and start saving today.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
