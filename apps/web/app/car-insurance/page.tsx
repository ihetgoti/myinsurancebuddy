import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ZipCodeForm from '@/components/ZipCodeForm';

export const dynamic = 'force-dynamic';



async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, orderBy: { name: 'asc' } }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Compare Car Insurance Quotes Online | InsuranceBuddies',
    description: 'Compare car insurance quotes from 120+ top companies. Save up to $867/year on auto insurance. Free, fast, and easy.',
};

const popularCompanies = [
    { name: 'Progressive', avgRate: '$134/mo', rating: 4.5 },
    { name: 'USAA', avgRate: '$76/mo', rating: 4.8 },
    { name: 'State Farm', avgRate: '$89/mo', rating: 4.6 },
    { name: 'GEICO', avgRate: '$86/mo', rating: 4.5 },
    { name: 'Allstate', avgRate: '$107/mo', rating: 4.3 },
    { name: 'Liberty Mutual', avgRate: '$182/mo', rating: 4.2 },
];

export default async function CarInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-teal-400 font-medium mb-4">COMPARE 120+ COMPANIES</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Compare Car Insurance Quotes Online
                        </h1>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Think you're paying too much for auto insurance? Compare quotes from top companies and save up to $867 per year.
                        </p>
                        <ZipCodeForm />
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/car-insurance/cheapest" className="text-teal-600 hover:text-teal-700 font-medium">Cheapest Companies</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/car-insurance/best" className="text-teal-600 hover:text-teal-700 font-medium">Best Companies</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/car-insurance/calculator" className="text-teal-600 hover:text-teal-700 font-medium">Rate Calculator</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/states" className="text-teal-600 hover:text-teal-700 font-medium">Rates by State</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/guides/discounts" className="text-teal-600 hover:text-teal-700 font-medium">Discounts</Link>
                    </div>
                </div>
            </section>

            {/* Why Compare */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Compare Car Insurance Quotes?</h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Car insurance rates vary significantly between companies—sometimes by hundreds of dollars for the same coverage. Each insurer uses different factors to calculate your premium, which means the cheapest option for your neighbor might not be the cheapest for you.
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                By comparing quotes from multiple insurers, you can find the best rate for your specific situation. Our customers save an average of <strong>$867 per year</strong> by switching to a cheaper policy.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            <div className="bg-slate-50 rounded-xl p-6">
                                <div className="text-3xl font-bold text-teal-600 mb-2">$867</div>
                                <p className="text-sm text-slate-600">Average annual savings</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-6">
                                <div className="text-3xl font-bold text-teal-600 mb-2">120+</div>
                                <p className="text-sm text-slate-600">Insurance companies compared</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-6">
                                <div className="text-3xl font-bold text-teal-600 mb-2">3 min</div>
                                <p className="text-sm text-slate-600">Average time to get quotes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Comparison */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Compare Top Car Insurance Companies</h2>
                        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
                            See how rates vary among popular insurers. Prices shown are averages—your rate may be higher or lower.
                        </p>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-900">Company</th>
                                        <th className="text-center py-4 px-6 font-semibold text-slate-900">Avg. Rate</th>
                                        <th className="text-center py-4 px-6 font-semibold text-slate-900">Rating</th>
                                        <th className="text-center py-4 px-6 font-semibold text-slate-900">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {popularCompanies.map((company, index) => (
                                        <tr key={company.name} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                            <td className="py-4 px-6">
                                                <span className="font-medium text-slate-900">{company.name}</span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="font-bold text-slate-900">{company.avgRate}</span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="font-medium">{company.rating}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <Link href="/get-quote" className="text-teal-600 font-semibold hover:text-teal-700">
                                                    Get Quote →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="text-xs text-slate-500 text-center mt-4">
                            *Rates are estimated averages and may vary based on location, driving history, and other factors.
                        </p>
                    </div>
                </div>
            </section>

            {/* States Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Car Insurance Rates by State</h2>
                        <p className="text-slate-600 text-center mb-12">
                            Insurance rates vary significantly by state. Find rates and requirements for your location.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {states.slice(0, 24).map(state => (
                                <Link
                                    key={state.id}
                                    href={`/car-insurance/${state.country.code}/${state.slug}`}
                                    className="p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:shadow-md transition bg-white text-center"
                                >
                                    <span className="text-sm font-medium text-slate-700 hover:text-slate-900">{state.name}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link href="/states" className="text-teal-600 font-semibold hover:text-teal-700">
                                View All States →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Compare */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How to Compare Car Insurance Quotes</h2>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Gather Your Information</h3>
                                    <p className="text-slate-600">You'll need your driver's license, vehicle information (VIN), current insurance details, and information about anyone else who will be driving the car.</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Consider Your Coverage Needs</h3>
                                    <p className="text-slate-600">Think about how much coverage you need. Every state has minimum requirements, but you may want more protection. Consider your budget and what you can afford to pay out-of-pocket if you cause an accident.</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Compare Your Quotes</h3>
                                    <p className="text-slate-600">Get quotes from at least three different companies. Make sure you're comparing the same coverage levels. Consider discounts, driver programs, company ratings, and customer reviews.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            {[
                                { q: 'How often should you compare car insurance quotes?', a: 'We recommend comparing quotes every 6-12 months, or whenever your policy is up for renewal. Rates change frequently, and you might find a better deal.' },
                                { q: 'What\'s the easiest way to compare car insurance?', a: 'Using an insurance comparison site like InsuranceBuddies is the easiest way. You enter your information once and get quotes from multiple companies.' },
                                { q: 'Will comparing quotes affect my credit score?', a: 'No. Insurance quotes are considered "soft inquiries" and don\'t affect your credit score.' },
                                { q: 'How much can I save by comparing quotes?', a: 'Our customers save an average of $867 per year by comparing quotes and switching to a cheaper policy.' },
                            ].map((faq, index) => (
                                <details key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                                    <summary className="p-6 cursor-pointer font-semibold text-slate-900 hover:bg-slate-50 transition flex items-center justify-between">
                                        {faq.q}
                                        <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-6 pb-6 text-slate-600">{faq.a}</div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Save on Car Insurance?</h2>
                    <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                        Compare quotes from 120+ companies and find the best rate for you.
                    </p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

