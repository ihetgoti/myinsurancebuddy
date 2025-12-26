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
    title: 'The 7 Best Car Insurance Comparison Sites | InsuranceBuddies',
    description: 'Discover which insurance comparison sites have transparent pricing and unbiased recommendations. Compare and purchase your ideal policy.',
};

const comparisonSites = [
    {
        rank: 1,
        name: 'InsuranceBuddies',
        rating: 4.9,
        pros: ['120+ insurance partners', 'No spam calls', 'Side-by-side comparisons', 'Licensed in all 50 states'],
        cons: ['Newer platform'],
        bestFor: 'Overall best experience',
        link: '/get-quote',
    },
    {
        rank: 2,
        name: 'The Zebra',
        rating: 4.7,
        pros: ['User-friendly interface', 'Quick quotes', 'Good mobile experience'],
        cons: ['Limited customization', 'Some ads'],
        bestFor: 'Quick comparisons',
        link: '#',
    },
    {
        rank: 3,
        name: 'Insurify',
        rating: 4.6,
        pros: ['AI-powered recommendations', 'Many carriers', 'Easy process'],
        cons: ['May share data', 'Follow-up calls'],
        bestFor: 'Tech-savvy users',
        link: '#',
    },
    {
        rank: 4,
        name: 'Policygenius',
        rating: 4.5,
        pros: ['Expert advisors', 'Life insurance focus', 'Educational content'],
        cons: ['Slower process', 'Limited auto options'],
        bestFor: 'Life insurance shoppers',
        link: '#',
    },
    {
        rank: 5,
        name: 'Gabi',
        rating: 4.4,
        pros: ['Automatic policy scanning', 'Renewal reminders', 'Easy switching'],
        cons: ['Requires account linking', 'Limited carriers'],
        bestFor: 'Existing policyholders',
        link: '#',
    },
    {
        rank: 6,
        name: 'QuoteWizard',
        rating: 4.2,
        pros: ['Many carriers', 'Fast quotes', 'Local agents'],
        cons: ['More sales calls', 'Data sharing'],
        bestFor: 'Those wanting agent help',
        link: '#',
    },
    {
        rank: 7,
        name: 'EverQuote',
        rating: 4.0,
        pros: ['Wide coverage', 'Multiple quote types', 'Free service'],
        cons: ['Heavy marketing', 'Many follow-ups'],
        bestFor: 'Multiple insurance needs',
        link: '#',
    },
];

export default async function ComparePage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-teal-400 font-medium mb-4">UPDATED DECEMBER 2024</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        The 7 Best Car Insurance Comparison Sites
                    </h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Discover which insurance comparison sites have transparent pricing and unbiased recommendations. Compare and purchase your ideal policy.
                    </p>
                </div>
            </section>

            {/* Quick Summary */}
            <section className="py-12 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Summary</h2>
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <p className="text-slate-600 leading-relaxed mb-4">
                                We tested all the leading car insurance comparison sites and found that <strong>InsuranceBuddies</strong> is the best choice for most drivers. It offers quotes from 120+ carriers, doesn't sell your data, and provides true side-by-side comparisons.
                            </p>
                            <Link href="/get-quote" className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
                                Compare Quotes Now
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                            Best Insurance Comparison Sites Ranked
                        </h2>

                        <div className="space-y-6">
                            {comparisonSites.map((site) => (
                                <div key={site.rank} className={`bg-white rounded-xl border ${site.rank === 1 ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200'} overflow-hidden`}>
                                    {site.rank === 1 && (
                                        <div className="bg-teal-600 text-white text-center py-2 text-sm font-semibold">
                                            🏆 EDITOR'S CHOICE
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-400">
                                                    {site.rank}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900">{site.name}</h3>
                                                    <p className="text-sm text-slate-500">Best for: {site.bestFor}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`w-5 h-5 ${star <= Math.floor(site.rating) ? 'text-yellow-400' : 'text-slate-200'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                    <span className="ml-2 font-bold text-slate-900">{site.rating}</span>
                                                </div>
                                                <Link
                                                    href={site.link}
                                                    className={`px-6 py-2 rounded-lg font-semibold transition ${site.rank === 1 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                                >
                                                    {site.rank === 1 ? 'Get Quotes' : 'Visit Site'}
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-semibold text-green-600 mb-2">✓ Pros</h4>
                                                <ul className="space-y-1">
                                                    {site.pros.map((pro, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <span className="text-green-500 mt-1">•</span>
                                                            {pro}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-red-600 mb-2">✗ Cons</h4>
                                                <ul className="space-y-1">
                                                    {site.cons.map((con, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <span className="text-red-500 mt-1">•</span>
                                                            {con}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How We Evaluated */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How We Evaluated</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'Number of Carriers', desc: 'More carriers means more options and better chances of finding low rates.' },
                                { title: 'User Experience', desc: 'We tested the quote process for speed, clarity, and ease of use.' },
                                { title: 'Privacy Practices', desc: 'We reviewed data sharing policies and marketing practices.' },
                                { title: 'Quote Accuracy', desc: 'We compared quoted rates to actual policy prices.' },
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

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Compare Quotes?</h2>
                    <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                        Join millions of drivers who saved money by comparing rates with InsuranceBuddies.
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
