import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PrismaClient } from '@myinsurancebuddy/db';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'About Us | MyInsuranceBuddies',
    description: 'Learn about MyInsuranceBuddies - your trusted source for insurance information and guidance.',
};

export default async function AboutPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">About Us</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Helping Americans make informed insurance decisions since 2020.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-lg prose-slate mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Mission</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            At MyInsuranceBuddies, we believe everyone deserves access to clear, unbiased insurance information.
                            Our team of experts works tirelessly to provide comprehensive guides, state-specific regulations,
                            and transparent coverage comparisons to help you make the best decisions for your family.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">What We Offer</h2>
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <h3 className="font-bold text-slate-900 mb-2">Expert Guides</h3>
                                <p className="text-slate-600 text-sm">In-depth articles written by licensed insurance professionals.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <h3 className="font-bold text-slate-900 mb-2">State-Specific Info</h3>
                                <p className="text-slate-600 text-sm">Detailed coverage requirements for all 50 states.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <h3 className="font-bold text-slate-900 mb-2">Comparison Tools</h3>
                                <p className="text-slate-600 text-sm">Side-by-side comparisons of top insurance providers.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <h3 className="font-bold text-slate-900 mb-2">Unbiased Reviews</h3>
                                <p className="text-slate-600 text-sm">Honest assessments without advertiser influence.</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/contact"
                                className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
