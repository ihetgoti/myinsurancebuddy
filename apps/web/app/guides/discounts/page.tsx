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
    title: 'Car Insurance Discounts You May Be Missing | InsuranceBuddies',
    description: 'Discover car insurance discounts that could save you hundreds. Learn about bundling, safe driver, and other discount opportunities.',
};

const discounts = [
    { name: 'Multi-Policy Bundle', savings: '5-25%', desc: 'Combine auto and home insurance with the same company.', availability: 'Most insurers' },
    { name: 'Safe Driver', savings: '10-25%', desc: 'No accidents or violations for 3-5 years.', availability: 'All insurers' },
    { name: 'Good Student', savings: '5-15%', desc: 'Students under 25 with a B average or better.', availability: 'Most insurers' },
    { name: 'Defensive Driving Course', savings: '5-10%', desc: 'Complete an approved defensive driving course.', availability: 'Most insurers' },
    { name: 'Low Mileage', savings: '5-15%', desc: 'Drive less than 7,500-10,000 miles per year.', availability: 'Most insurers' },
    { name: 'Pay-in-Full', savings: '5-10%', desc: 'Pay your annual premium upfront instead of monthly.', availability: 'Most insurers' },
    { name: 'Automatic Payment', savings: '2-5%', desc: 'Set up automatic payments from your bank account.', availability: 'Many insurers' },
    { name: 'Paperless', savings: '2-5%', desc: 'Opt for electronic documents instead of paper.', availability: 'Many insurers' },
    { name: 'Anti-Theft Device', savings: '5-15%', desc: 'Have an alarm, GPS tracker, or VIN etching.', availability: 'Most insurers' },
    { name: 'Safety Features', savings: '5-10%', desc: 'Anti-lock brakes, airbags, and other safety features.', availability: 'Most insurers' },
    { name: 'Multi-Car', savings: '10-25%', desc: 'Insure multiple vehicles on the same policy.', availability: 'All insurers' },
    { name: 'Military/Veteran', savings: '5-15%', desc: 'Active duty, veterans, and their families.', availability: 'Select insurers' },
    { name: 'Loyalty', savings: '5-10%', desc: 'Stay with the same insurer for multiple years.', availability: 'Many insurers' },
    { name: 'Homeowner', savings: '3-5%', desc: 'Own your home (even without bundling).', availability: 'Some insurers' },
    { name: 'Occupation-Based', savings: '5-10%', desc: 'Teachers, nurses, engineers, and other professions.', availability: 'Select insurers' },
];

export default async function DiscountsPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p className="text-blue-400 font-medium mb-3 sm:mb-4 text-sm sm:text-base">SAVE MORE MONEY</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Car Insurance Discounts
                    </h1>
                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto px-2 sm:px-0">
                        Most drivers qualify for discounts they don't know about. Here's how to maximize your savings.
                    </p>
                </div>
            </section>

            {/* Summary */}
            <section className="py-10 sm:py-12 bg-slate-50 border-b">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">15+</div>
                                <p className="text-xs sm:text-sm text-slate-600">Common discounts available</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">$500+</div>
                                <p className="text-xs sm:text-sm text-slate-600">Potential annual savings</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">5-25%</div>
                                <p className="text-xs sm:text-sm text-slate-600">Per discount savings range</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Discounts Table */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">All Available Discounts</h2>

                        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                            <table className="w-full min-w-[600px] bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-slate-900 text-sm">Discount</th>
                                        <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-semibold text-slate-900 text-sm">Savings</th>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-slate-900 text-sm">Description</th>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-slate-900 text-sm">Availability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {discounts.map((discount, index) => (
                                        <tr key={index} className="border-t border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 sm:py-4 px-3 sm:px-4 font-medium text-slate-900 text-sm">{discount.name}</td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                                    {discount.savings}
                                                </span>
                                            </td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-slate-600">{discount.desc}</td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-slate-500">{discount.availability}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="py-16 sm:py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">How to Maximize Discounts</h2>

                        <div className="space-y-4 sm:space-y-6">
                            {[
                                { title: 'Ask directly', desc: 'Call your insurer and ask about all available discounts. Many aren\'t automatically applied.' },
                                { title: 'Bundle policies', desc: 'Combining auto and home insurance is often the biggest discount available.' },
                                { title: 'Take a driving course', desc: 'A few hours of online learning can save you 5-10% for years.' },
                                { title: 'Review annually', desc: 'Your eligibility for discounts can change. Review your policy every year.' },
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Find Your Discounts</h2>
                    <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto">
                        Compare quotes and see which discounts you qualify for.
                    </p>
                    <Link href="/get-quote" className="inline-block bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg text-sm sm:text-base">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
