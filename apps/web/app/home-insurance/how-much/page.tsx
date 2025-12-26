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
    title: 'How Much Home Insurance Do You Need? | InsuranceBuddies',
    description: 'Learn how to determine the right amount of home insurance coverage for your property.',
};

export default async function HowMuchHomeInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        How Much Home Insurance Do You Need?
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Get the right amount of coverage to protect your home and belongings.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Dwelling Coverage</h2>
                        <p className="text-slate-600 mb-6">
                            Your dwelling coverage should equal the cost to rebuild your home completely—not its market value. This is called the "replacement cost" and is typically calculated based on:
                        </p>
                        <ul className="space-y-3 mb-12">
                            <li className="flex items-start gap-3 text-slate-600">
                                <span className="text-teal-500 mt-1">✓</span>
                                <span>Square footage of your home</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <span className="text-teal-500 mt-1">✓</span>
                                <span>Local construction costs per square foot</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <span className="text-teal-500 mt-1">✓</span>
                                <span>Quality of materials and finishes</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-600">
                                <span className="text-teal-500 mt-1">✓</span>
                                <span>Special features (custom kitchen, hardwood floors, etc.)</span>
                            </li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Property Coverage</h2>
                        <p className="text-slate-600 mb-6">
                            Most policies cover personal property at 50-70% of your dwelling coverage. Consider creating a home inventory to ensure you have enough coverage for your belongings.
                        </p>

                        <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-12">
                            <h4 className="font-bold text-teal-800 mb-2">💡 Quick Tip</h4>
                            <p className="text-teal-700">
                                Take photos or videos of your valuables and store them in the cloud. This makes filing claims much easier.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Liability Coverage</h2>
                        <p className="text-slate-600 mb-6">
                            Standard policies include $100,000 in liability coverage, but experts recommend at least $300,000-$500,000. If you have significant assets, consider an umbrella policy for additional protection.
                        </p>

                        <div className="bg-slate-50 rounded-xl p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Recommended Minimums</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Dwelling Coverage</span>
                                    <span className="font-semibold text-slate-900">100% of rebuild cost</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Personal Property</span>
                                    <span className="font-semibold text-slate-900">50-70% of dwelling</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Liability</span>
                                    <span className="font-semibold text-slate-900">$300,000+</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Medical Payments</span>
                                    <span className="font-semibold text-slate-900">$5,000+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Get the Right Coverage</h2>
                    <p className="text-teal-100 mb-8">Compare quotes and find the perfect policy for your home.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

