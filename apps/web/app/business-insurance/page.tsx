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

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-teal-400 font-medium mb-4">PROTECT YOUR BUSINESS</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Compare Business Insurance Quotes
                        </h1>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Find the right coverage to protect your business from liability, property damage, and more.
                        </p>
                        <ZipCodeForm />
                    </div>
                </div>
            </section>

            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/business-insurance/best-business-insurance" className="text-teal-600 hover:text-teal-700 font-medium">Best Companies</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/business-insurance/coverage/small-business-insurance" className="text-teal-600 hover:text-teal-700 font-medium">Small Business</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/business-insurance/coverage/business-liability-insurance" className="text-teal-600 hover:text-teal-700 font-medium">Liability Insurance</Link>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Business Insurance Coverage Types</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {coverageTypes.map((type, i) => (
                                <Link key={i} href={type.slug} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-teal-500 transition group">
                                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition">{type.title}</h3>
                                    <p className="text-sm text-slate-600 mb-4">{type.desc}</p>
                                    <span className="text-teal-600 font-semibold text-sm">Learn More →</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why Your Business Needs Insurance</h2>

                        <div className="space-y-6">
                            {[
                                { title: 'Legal Protection', desc: 'Defend against lawsuits and cover legal fees if your business is sued.' },
                                { title: 'Property Protection', desc: 'Cover damage to your building, equipment, and inventory.' },
                                { title: 'Business Continuity', desc: 'Keep your business running even after a disaster or major loss.' },
                                { title: 'Employee Protection', desc: 'Workers\' compensation and liability coverage for your team.' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-teal-600 font-bold">{i + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Protect Your Business Today</h2>
                    <p className="text-teal-100 mb-8">Compare quotes from top business insurance providers.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

