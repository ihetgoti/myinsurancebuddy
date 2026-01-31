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
    title: 'Compare Business Insurance Quotes | InsuranceBuddies',
    description: 'Compare business insurance quotes. Protect your company with liability, property, and workers comp coverage.',
};

const coverageTypes = [
    { title: 'General Liability Insurance', slug: '/business-insurance/coverage/business-liability-insurance', desc: 'Protects against claims of bodily injury, property damage, and advertising injury.' },
    { title: 'Business Income Insurance', slug: '/business-insurance/coverage/business-income-insurance', desc: 'Covers lost income when your business can\'t operate due to a covered event.' },
    { title: 'Business Interruption Insurance', slug: '/business-insurance/coverage/business-interruption-insurance', desc: 'Helps cover ongoing expenses during temporary closure.' },
    { title: 'Small Business Insurance', slug: '/business-insurance/coverage/small-business-insurance', desc: 'Bundled coverage packages designed for small businesses.' },
];

export default async function BusinessInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-blue-400 font-medium mb-4 text-sm sm:text-base">PROTECT YOUR BUSINESS</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                            Compare Business Insurance Quotes
                        </h1>
                        <p className="text-lg sm:text-xl text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto">
                            Find the right coverage to protect your business from liability, property damage, and more.
                        </p>
                        <ZipCodeForm />
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-6 sm:py-8 bg-blue-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <Link href="/business-insurance/best-business-insurance" className="text-blue-600 hover:text-blue-700 font-medium">Best Companies</Link>
                        <span className="text-slate-300 hidden sm:inline">|</span>
                        <Link href="/business-insurance/coverage/small-business-insurance" className="text-blue-600 hover:text-blue-700 font-medium">Small Business</Link>
                        <span className="text-slate-300 hidden sm:inline">|</span>
                        <Link href="/business-insurance/coverage/business-liability-insurance" className="text-blue-600 hover:text-blue-700 font-medium">Liability Insurance</Link>
                    </div>
                </div>
            </section>

            {/* Coverage Types */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-8 sm:mb-12 text-center">Business Insurance Coverage Types</h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {coverageTypes.map((type, i) => (
                                <Link key={i} href={type.slug} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 hover:shadow-lg hover:border-blue-500 transition group">
                                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition text-base sm:text-lg">{type.title}</h3>
                                    <p className="text-sm sm:text-base text-slate-600 mb-4">{type.desc}</p>
                                    <span className="text-blue-600 font-semibold text-sm">Learn More →</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Business Needs Insurance */}
            <section className="py-16 sm:py-20 lg:py-24 bg-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Why Your Business Needs Insurance</h2>

                        <div className="space-y-4 sm:space-y-6">
                            {[
                                { title: 'Legal Protection', desc: 'Defend against lawsuits and cover legal fees if your business is sued.' },
                                { title: 'Property Protection', desc: 'Cover damage to your building, equipment, and inventory.' },
                                { title: 'Business Continuity', desc: 'Keep your business running even after a disaster or major loss.' },
                                { title: 'Employee Protection', desc: 'Workers\' compensation and liability coverage for your team.' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 font-bold text-sm sm:text-base">{i + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{item.title}</h3>
                                        <p className="text-xs sm:text-sm text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Protect Your Business Today</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">Compare quotes from top business insurance providers.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
