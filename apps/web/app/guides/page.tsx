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
    title: 'Insurance Guides & Resources | InsuranceBuddies',
    description: 'Expert insurance guides to help you understand coverage options, save money, and make informed decisions.',
};

const guides = [
    {
        category: 'Car Insurance',
        articles: [
            { title: 'How to Shop for Car Insurance', slug: '/guides/how-to-shop', readTime: '8 min' },
            { title: 'Car Insurance Discounts You May Be Missing', slug: '/guides/discounts', readTime: '6 min' },
            { title: 'Car Insurance Company Reviews', slug: '/guides/reviews', readTime: '12 min' },
            { title: 'Car Insurance by Vehicle Type', slug: '/guides/by-vehicle', readTime: '10 min' },
            { title: 'Understanding Coverage Types', slug: '/guides/coverage-types', readTime: '7 min' },
        ],
    },
    {
        category: 'Home Insurance',
        articles: [
            { title: 'How Much Home Insurance Do You Need?', slug: '/home-insurance/how-much', readTime: '6 min' },
            { title: 'Average Cost of Home Insurance', slug: '/home-insurance/cost', readTime: '5 min' },
            { title: 'Best Home Insurance Companies', slug: '/home-insurance/best', readTime: '10 min' },
            { title: 'Cheap Home Insurance Tips', slug: '/home-insurance/cheap', readTime: '7 min' },
        ],
    },
    {
        category: 'Money-Saving Tips',
        articles: [
            { title: 'How to Bundle Insurance and Save', slug: '/guides/bundling', readTime: '5 min' },
            { title: 'When to Raise Your Deductible', slug: '/guides/deductibles', readTime: '4 min' },
            { title: 'Credit Score and Insurance Rates', slug: '/guides/credit-score', readTime: '6 min' },
        ],
    },
];

export default async function GuidesPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Insurance Guides & Resources
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Expert guides to help you understand insurance, save money, and make informed decisions.
                    </p>
                </div>
            </section>

            {/* Featured Guides */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Featured Guides</h2>

                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            {[
                                { title: 'How to Shop for Car Insurance', desc: 'Learn the best strategies for finding affordable coverage.', slug: '/guides/how-to-shop', icon: '🚗' },
                                { title: 'Car Insurance Discounts', desc: 'Discover discounts you may be missing out on.', slug: '/guides/discounts', icon: '💰' },
                                { title: 'Insurance Company Reviews', desc: 'Honest reviews of top insurance providers.', slug: '/guides/reviews', icon: '⭐' },
                            ].map((guide, i) => (
                                <Link key={i} href={guide.slug} className="group bg-white rounded-xl p-6 border border-slate-200 hover:shadow-xl transition">
                                    <span className="text-4xl mb-4 block">{guide.icon}</span>
                                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition">{guide.title}</h3>
                                    <p className="text-sm text-slate-600 mb-4">{guide.desc}</p>
                                    <span className="text-teal-600 font-semibold text-sm">Read Guide →</span>
                                </Link>
                            ))}
                        </div>

                        {/* All Guides by Category */}
                        {guides.map((category, i) => (
                            <div key={i} className="mb-12">
                                <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
                                    {category.category}
                                </h2>
                                <div className="space-y-4">
                                    {category.articles.map((article, j) => (
                                        <Link
                                            key={j}
                                            href={article.slug}
                                            className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition group"
                                        >
                                            <span className="font-medium text-slate-700 group-hover:text-teal-600 transition">
                                                {article.title}
                                            </span>
                                            <span className="text-sm text-slate-400">{article.readTime} read</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Insurance Tips in Your Inbox</h2>
                        <p className="text-slate-600 mb-8">
                            Subscribe to our newsletter for money-saving tips and insurance updates.
                        </p>
                        <form className="flex gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button
                                type="submit"
                                className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Save on Insurance?</h2>
                    <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
                        Put your knowledge to work. Compare quotes and start saving today.
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
