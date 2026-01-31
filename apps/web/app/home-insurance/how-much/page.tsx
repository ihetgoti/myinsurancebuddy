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

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        How Much Home Insurance Do You Need?
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                        Get the right amount of coverage to protect your home and belongings.
                    </p>
                </div>
            </section>

            {/* Coverage Calculator */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-8 sm:mb-12">
                            <h3 className="font-bold text-blue-800 mb-3 sm:mb-4 text-lg sm:text-xl">Quick Coverage Calculator</h3>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg">
                                    <span className="text-slate-700 font-medium text-sm sm:text-base">Dwelling Coverage</span>
                                    <span className="text-blue-600 font-bold text-sm sm:text-base">100% of rebuild cost</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg">
                                    <span className="text-slate-700 font-medium text-sm sm:text-base">Personal Property</span>
                                    <span className="text-blue-600 font-bold text-sm sm:text-base">50-70% of dwelling</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg">
                                    <span className="text-slate-700 font-medium text-sm sm:text-base">Liability Protection</span>
                                    <span className="text-blue-600 font-bold text-sm sm:text-base">$300,000 - $500,000</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg">
                                    <span className="text-slate-700 font-medium text-sm sm:text-base">Medical Payments</span>
                                    <span className="text-blue-600 font-bold text-sm sm:text-base">$5,000 - $10,000</span>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Dwelling Coverage</h2>
                        <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                            Your dwelling coverage should equal the cost to rebuild your home completely—not its market value. This is called the "replacement cost" and is typically calculated based on:
                        </p>
                        <ul className="space-y-3 mb-8 sm:mb-12">
                            {[
                                'Square footage of your home',
                                'Local construction costs per square foot',
                                'Quality of materials and finishes',
                                'Special features (custom kitchen, hardwood floors, etc.)',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-600 text-sm sm:text-base">
                                    <span className="text-blue-500 mt-1 flex-shrink-0">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Personal Property Coverage</h2>
                        <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                            Most policies cover personal property at 50-70% of your dwelling coverage. Consider creating a home inventory to ensure you have enough coverage for your belongings.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-8 sm:mb-12">
                            <h4 className="font-bold text-blue-800 mb-2 text-sm sm:text-base">💡 Quick Tip</h4>
                            <p className="text-blue-700 text-sm sm:text-base">
                                Take photos or videos of your valuables and store them in the cloud. This makes filing claims much easier.
                            </p>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Liability Coverage</h2>
                        <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">
                            Standard policies include $100,000 in liability coverage, but experts recommend at least $300,000-$500,000. If you have significant assets, consider an umbrella policy for additional protection.
                        </p>

                        <div className="bg-slate-50 rounded-xl p-4 sm:p-6">
                            <h3 className="font-bold text-slate-900 mb-4 text-base sm:text-lg">Recommended Minimums</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Dwelling Coverage', value: '100% of rebuild cost' },
                                    { label: 'Personal Property', value: '50-70% of dwelling' },
                                    { label: 'Liability', value: '$300,000+' },
                                    { label: 'Medical Payments', value: '$5,000+' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-b border-slate-200 last:border-0">
                                        <span className="text-slate-600 text-sm sm:text-base">{item.label}</span>
                                        <span className="font-semibold text-slate-900 text-sm sm:text-base">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Coverages */}
            <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Additional Coverage Options</h2>
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Flood Insurance', desc: 'Standard policies don\'t cover flood damage. Required in flood zones.', icon: '🌊' },
                                { title: 'Earthquake Insurance', desc: 'Essential in earthquake-prone areas like California.', icon: '🌋' },
                                { title: 'Sewer Backup', desc: 'Covers damage from backed-up drains and sewers.', icon: '🚰' },
                                { title: 'Valuable Items', desc: 'Extra coverage for jewelry, art, and collectibles.', icon: '💎' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
                                    <span className="text-2xl mb-2 sm:mb-3 block">{item.icon}</span>
                                    <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h3>
                                    <p className="text-sm text-slate-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Get the Right Coverage</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">Compare quotes and find the perfect policy for your home.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
