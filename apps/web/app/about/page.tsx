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
    title: 'About Us | InsuranceBuddies',
    description: 'Learn about InsuranceBuddies - your trusted source for insurance comparison and savings.',
};

const teamMembers = [
    {
        name: 'Sarah Mitchell',
        role: 'Senior Managing Editor',
        bio: 'Sarah leads our editorial department with over 15 years of experience in insurance journalism. Her work has been featured in Forbes, Bloomberg, and The Wall Street Journal.',
        image: '👩‍💼',
    },
    {
        name: 'Michael Chen',
        role: 'Senior Editor',
        bio: 'Michael brings 10+ years of experience in personal finance writing. He specializes in making complex insurance topics accessible to everyday consumers.',
        image: '👨‍💼',
    },
    {
        name: 'Jessica Rodriguez',
        role: 'Insurance Analyst',
        bio: 'Jessica is a licensed insurance agent with expertise in auto and home insurance. She ensures all our rate data and comparisons are accurate.',
        image: '👩‍💻',
    },
    {
        name: 'David Park',
        role: 'Editor',
        bio: 'David focuses on SEO and user experience, ensuring our content reaches those who need it most. He has a background in digital marketing and journalism.',
        image: '👨‍💻',
    },
];

export default async function AboutPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">About InsuranceBuddies</h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        We're on a mission to help Americans save money and find the best insurance coverage.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20" id="how-it-works">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">How InsuranceBuddies Works</h2>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    InsuranceBuddies delivers on its promise to help customers save money and find the best insurance. As a licensed insurance agent in all 50 states, InsuranceBuddies exists to empower customers with bite-sized tips to ease those big decisions.
                                </p>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    No spam, no fees, no catch. We partner with over 120 insurance companies to bring you real, accurate quotes. Unlike some other sites, we'll never sell your information to make a buck.
                                </p>
                                <Link href="/get-quote" className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
                                    Get Started
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-teal-600 font-bold">1</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Enter Your Info</h3>
                                            <p className="text-sm text-slate-600">Answer a few quick questions about yourself and your vehicle.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-teal-600 font-bold">2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Compare Quotes</h3>
                                            <p className="text-sm text-slate-600">See personalized rates from 120+ top insurance companies.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-teal-600 font-bold">3</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Save Money</h3>
                                            <p className="text-sm text-slate-600">Choose the best policy and start saving up to $867/year.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
                        <div>
                            <div className="text-4xl font-bold text-teal-600 mb-2">12+</div>
                            <div className="text-sm text-slate-600">Years in Business</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-600 mb-2">50</div>
                            <div className="text-sm text-slate-600">States Licensed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-600 mb-2">120+</div>
                            <div className="text-sm text-slate-600">Insurance Partners</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-600 mb-2">8M+</div>
                            <div className="text-sm text-slate-600">Happy Customers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20" id="team">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Meet Our Experienced Editorial Team</h2>
                        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
                            Our experienced team of editors has more than 70 years of combined writing and editing experience, including well over 50 years in the insurance industry alone.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            {teamMembers.map((member) => (
                                <div key={member.name} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
                                            {member.image}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{member.name}</h3>
                                            <p className="text-sm text-teal-600 font-medium mb-2">{member.role}</p>
                                            <p className="text-sm text-slate-600 leading-relaxed">{member.bio}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial Standards */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Editorial Standards</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 border border-slate-200">
                                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Accuracy</h3>
                                <p className="text-sm text-slate-600">Every article is reviewed by a licensed insurance agent to ensure accuracy.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-slate-200">
                                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Independence</h3>
                                <p className="text-sm text-slate-600">Our editorial content is independent from our business partnerships.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-slate-200">
                                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Transparency</h3>
                                <p className="text-sm text-slate-600">We clearly disclose how we make money and our review methodology.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Saving?</h2>
                    <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                        Join millions of Americans who found better insurance rates with InsuranceBuddies.
                    </p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Compare Quotes Now
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
