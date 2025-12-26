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
    title: 'Compare Commercial Auto Insurance Quotes | InsuranceBuddies',
    description: 'Compare commercial auto insurance quotes for your business vehicles. Protect your fleet and employees.',
};

const coverageTypes = [
    { title: 'Semi-Truck Insurance', slug: '/commercial-auto-insurance/coverage/semi-truck-insurance', desc: 'Coverage for long-haul trucking operations' },
    { title: 'Dump Truck Insurance', slug: '/commercial-auto-insurance/coverage/dump-truck-insurance', desc: 'Protection for construction and hauling businesses' },
    { title: 'Box Truck Insurance', slug: '/commercial-auto-insurance/coverage/box-truck', desc: 'Coverage for delivery and moving companies' },
    { title: 'Tow Truck Insurance', slug: '/commercial-auto-insurance/coverage/tow-truck-insurance', desc: 'Specialized coverage for towing operations' },
    { title: 'Food Truck Insurance', slug: '/commercial-auto-insurance/coverage/food-truck', desc: 'Coverage for mobile food businesses' },
    { title: 'Commercial Truck Insurance', slug: '/commercial-auto-insurance/coverage/commercial-truck', desc: 'General commercial vehicle coverage' },
];

export default async function CommercialAutoInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-teal-400 font-medium mb-4">PROTECT YOUR BUSINESS</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Compare Commercial Auto Insurance
                        </h1>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Get quotes for commercial vehicles, trucks, and fleets. Protect your business on the road.
                        </p>
                        <ZipCodeForm />
                    </div>
                </div>
            </section>

            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/commercial-auto-insurance/best-commercial-auto-insurance" className="text-teal-600 hover:text-teal-700 font-medium">Best Companies</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/commercial-auto-insurance/cheap-commercial-auto-insurance" className="text-teal-600 hover:text-teal-700 font-medium">Cheap Commercial Auto</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/commercial-auto-insurance/coverage/semi-truck-insurance" className="text-teal-600 hover:text-teal-700 font-medium">Semi-Truck</Link>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Commercial Vehicle Coverage Types</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Commercial Auto Insurance Covers</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'Liability Coverage', desc: 'Covers bodily injury and property damage you cause to others while operating business vehicles.' },
                                { title: 'Physical Damage', desc: 'Collision and comprehensive coverage for your commercial vehicles.' },
                                { title: 'Cargo Coverage', desc: 'Protects goods and materials you transport for your business.' },
                                { title: 'Hired & Non-Owned Auto', desc: 'Coverage for vehicles you rent or employees\' personal vehicles used for business.' },
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

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Get Commercial Auto Insurance Quotes</h2>
                    <p className="text-teal-100 mb-8">Compare rates from top commercial insurers.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

