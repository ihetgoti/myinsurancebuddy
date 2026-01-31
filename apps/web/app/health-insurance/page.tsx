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
    title: 'Health Insurance Guide | InsuranceBuddies',
    description: 'Learn about health insurance options, costs, and coverage. Find the right health plan for you and your family.',
};

const costGuides = [
    { title: 'How Much Does an Ultrasound Cost?', slug: '/health-insurance/how-much-does-an-ultrasound-cost' },
    { title: 'How Much Does an MRI Cost?', slug: '/health-insurance/how-much-does-an-mri-cost' },
    { title: 'How Much Does a CT Scan Cost?', slug: '/health-insurance/how-much-does-a-ct-scan-cost' },
    { title: 'How Much Does a Doctor Visit Cost?', slug: '/health-insurance/doctor-visit-cost' },
    { title: 'How Much Does a Checkup Cost?', slug: '/health-insurance/how-much-does-a-checkup-cost' },
    { title: 'How Much Does an ER Visit Cost?', slug: '/health-insurance/how-much-does-an-er-visit-cost' },
    { title: 'Urgent Care Visit Cost', slug: '/health-insurance/urgent-care-visit-cost' },
    { title: 'Cost of Diabetes', slug: '/health-insurance/cost-of-diabetes' },
    { title: 'Hip Replacement Cost', slug: '/health-insurance/hip-replacement-cost' },
];

export default async function HealthInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-blue-400 font-medium mb-4 text-sm sm:text-base">HEALTHCARE COSTS</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Health Insurance Guide
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                        Understand healthcare costs and find the right coverage for you and your family.
                    </p>
                </div>
            </section>

            {/* Cost Guides */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Healthcare Cost Guides</h2>
                        <p className="text-slate-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
                            Understanding healthcare costs can help you make informed decisions about your coverage and care.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {costGuides.map((guide, i) => (
                                <Link key={i} href={guide.slug} className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:shadow-lg hover:border-blue-500 transition group">
                                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition text-sm sm:text-base">{guide.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Types of Health Insurance */}
            <section className="py-16 sm:py-20 lg:py-24 bg-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Types of Health Insurance</h2>

                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                { title: 'Employer-Sponsored', desc: 'Health insurance provided through your workplace, often with shared premium costs.' },
                                { title: 'Individual/Family Plans', desc: 'Plans purchased directly from insurers or through the ACA marketplace.' },
                                { title: 'Medicare', desc: 'Federal health insurance for people 65+ and those with certain disabilities.' },
                                { title: 'Medicaid', desc: 'State and federal program providing coverage for low-income individuals.' },
                            ].map((type, i) => (
                                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-2 text-base sm:text-lg">{type.title}</h3>
                                    <p className="text-sm sm:text-base text-slate-600">{type.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternatives Section */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">Alternatives to Health Insurance</h2>
                        <Link href="/health-insurance/alternatives-to-health-insurance" className="block bg-white rounded-xl p-4 sm:p-6 border border-slate-200 hover:shadow-lg transition">
                            <h3 className="font-bold text-slate-900 mb-2 text-base sm:text-lg">Explore Health Insurance Alternatives</h3>
                            <p className="text-slate-600 mb-4 text-sm sm:text-base">Learn about health sharing ministries, short-term plans, and other options if traditional health insurance isn&apos;t right for you.</p>
                            <span className="text-blue-600 font-semibold">Read Guide →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Need Help Finding Coverage?</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">Compare insurance options and find the right plan for your needs.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Get Started
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
