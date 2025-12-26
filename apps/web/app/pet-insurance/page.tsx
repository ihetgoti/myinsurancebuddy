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
    title: 'Compare Pet Insurance Quotes | InsuranceBuddies',
    description: 'Compare pet insurance quotes for dogs and cats. Protect your furry family member with affordable coverage.',
};

const companies = [
    { name: 'Lemonade', avgRate: '$25/mo', rating: 4.7, bestFor: 'Quick claims' },
    { name: 'Healthy Paws', avgRate: '$35/mo', rating: 4.8, bestFor: 'Unlimited coverage' },
    { name: 'Embrace', avgRate: '$32/mo', rating: 4.6, bestFor: 'Wellness rewards' },
    { name: 'Petplan', avgRate: '$40/mo', rating: 4.5, bestFor: 'Comprehensive coverage' },
    { name: 'Nationwide', avgRate: '$38/mo', rating: 4.4, bestFor: 'Exotic pets' },
];

export default async function PetInsurancePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-teal-400 font-medium mb-4">PROTECT YOUR PET</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Compare Pet Insurance Quotes
                        </h1>
                        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                            Give your furry friend the care they deserve. Compare pet insurance plans and save on vet bills.
                        </p>
                        <ZipCodeForm />
                    </div>
                </div>
            </section>

            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/pet-insurance/dogs" className="text-teal-600 hover:text-teal-700 font-medium">Pet Insurance for Dogs</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/pet-insurance/cats" className="text-teal-600 hover:text-teal-700 font-medium">Pet Insurance for Cats</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/pet-insurance/no-waiting-period" className="text-teal-600 hover:text-teal-700 font-medium">No Waiting Period</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/pet-insurance/pre-existing-conditions" className="text-teal-600 hover:text-teal-700 font-medium">Pre-Existing Conditions</Link>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How Pet Insurance Works</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🏥</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">1. Visit Any Vet</h3>
                                <p className="text-sm text-slate-600">Take your pet to any licensed veterinarian, specialist, or emergency clinic.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📋</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">2. Submit a Claim</h3>
                                <p className="text-sm text-slate-600">Pay your vet bill and submit the invoice to your pet insurance provider.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">💰</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">3. Get Reimbursed</h3>
                                <p className="text-sm text-slate-600">Receive reimbursement for covered expenses, typically 70-90% of the bill.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Top Pet Insurance Companies</h2>

                        <div className="space-y-4">
                            {companies.map((company, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{company.name}</h3>
                                        <p className="text-sm text-slate-500">Best for: {company.bestFor}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="font-bold text-slate-900">{company.avgRate}</div>
                                            <span className="text-xs text-slate-500">Avg. Rate</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="font-bold">{company.rating}</span>
                                            </div>
                                            <span className="text-xs text-slate-500">Rating</span>
                                        </div>
                                        <Link href="/get-quote" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition">
                                            Get Quote
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Pet Insurance FAQ</h2>

                        <div className="space-y-4">
                            {[
                                { q: 'What does pet insurance cover?', a: 'Most pet insurance covers accidents, illnesses, surgeries, medications, and emergency care. Some plans also cover wellness visits and preventive care.' },
                                { q: 'How much does pet insurance cost?', a: 'Pet insurance typically costs $25-$50/month for dogs and $15-$30/month for cats, depending on breed, age, and coverage level.' },
                                { q: 'Are pre-existing conditions covered?', a: 'Most pet insurance policies don\'t cover pre-existing conditions. That\'s why it\'s best to get coverage while your pet is young and healthy.' },
                                { q: 'Is pet insurance worth it?', a: 'Pet insurance can save you thousands in unexpected vet bills. A single emergency surgery can cost $3,000-$5,000 or more.' },
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

            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Protect Your Pet Today</h2>
                    <p className="text-teal-100 mb-8">Compare pet insurance quotes and find the best coverage.</p>
                    <Link href="/get-quote" className="inline-block bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg">
                        Get Your Free Quotes
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}

