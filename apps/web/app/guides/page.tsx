import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, Car, Home, Heart, Briefcase, PiggyBank, Shield, TrendingUp, Clock, ChevronRight, Star, Users, FileText, Lightbulb } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
    ]);
    return { insuranceTypes, states };
}

export const metadata = {
    title: 'Insurance Guides & Resources | MyInsuranceBuddies',
    description: 'Expert insurance guides to help you understand coverage options, compare rates, save money, and make informed decisions about your insurance needs.',
};

const featuredGuides = [
    {
        title: 'Complete Guide to Car Insurance',
        description: 'Everything you need to know about auto insurance coverage, from liability to comprehensive.',
        icon: <Car className="w-6 h-6" />,
        href: '/car-insurance',
        readTime: '15 min',
        category: 'Auto',
        color: 'blue',
    },
    {
        title: 'Home Insurance 101',
        description: 'Protect your most valuable asset with the right homeowners insurance coverage.',
        icon: <Home className="w-6 h-6" />,
        href: '/home-insurance',
        readTime: '12 min',
        category: 'Home',
        color: 'green',
    },
    {
        title: 'Understanding Life Insurance',
        description: 'Term vs. whole life, how much you need, and finding the best rates for your situation.',
        icon: <Heart className="w-6 h-6" />,
        href: '/life-insurance',
        readTime: '10 min',
        category: 'Life',
        color: 'red',
    },
];

const guideCategories = [
    {
        name: 'Auto Insurance',
        icon: <Car className="w-5 h-5" />,
        color: 'blue',
        guides: [
            { title: 'How to Shop for Car Insurance', slug: '/car-insurance', readTime: '8 min', popular: true },
            { title: 'Car Insurance Discounts You May Be Missing', slug: '/guides/discounts', readTime: '6 min', popular: true },
            { title: 'Understanding Coverage Types', slug: '/guides/coverage-types', readTime: '7 min', popular: false },
            { title: 'Car Insurance by State', slug: '/states', readTime: '5 min', popular: false },
            { title: 'Best Car Insurance Companies', slug: '/guides/best-car-insurance', readTime: '12 min', popular: true },
            { title: 'Teen Driver Insurance Guide', slug: '/guides/teen-drivers', readTime: '6 min', popular: false },
            { title: 'SR-22 Insurance Explained', slug: '/guides/sr22-insurance', readTime: '5 min', popular: false },
        ],
    },
    {
        name: 'Home Insurance',
        icon: <Home className="w-5 h-5" />,
        color: 'green',
        guides: [
            { title: 'How Much Home Insurance Do You Need?', slug: '/home-insurance', readTime: '6 min', popular: true },
            { title: 'Average Cost of Home Insurance', slug: '/guides/home-insurance-cost', readTime: '5 min', popular: false },
            { title: 'Best Home Insurance Companies', slug: '/guides/best-home-insurance', readTime: '10 min', popular: true },
            { title: 'Renters Insurance Guide', slug: '/renters-insurance', readTime: '7 min', popular: false },
            { title: 'Flood Insurance Explained', slug: '/guides/flood-insurance', readTime: '6 min', popular: false },
            { title: 'Home Insurance Claims Process', slug: '/guides/home-claims', readTime: '8 min', popular: false },
        ],
    },
    {
        name: 'Life Insurance',
        icon: <Heart className="w-5 h-5" />,
        color: 'red',
        guides: [
            { title: 'Term vs Whole Life Insurance', slug: '/guides/term-vs-whole', readTime: '8 min', popular: true },
            { title: 'How Much Life Insurance Do I Need?', slug: '/guides/life-insurance-calculator', readTime: '6 min', popular: true },
            { title: 'Best Life Insurance Companies', slug: '/guides/best-life-insurance', readTime: '10 min', popular: false },
            { title: 'Life Insurance for Seniors', slug: '/guides/senior-life-insurance', readTime: '7 min', popular: false },
            { title: 'No Exam Life Insurance', slug: '/guides/no-exam-life', readTime: '5 min', popular: false },
        ],
    },
    {
        name: 'Health Insurance',
        icon: <Shield className="w-5 h-5" />,
        color: 'purple',
        guides: [
            { title: 'Understanding Health Insurance Plans', slug: '/health-insurance', readTime: '10 min', popular: true },
            { title: 'HMO vs PPO: Which is Right for You?', slug: '/guides/hmo-vs-ppo', readTime: '6 min', popular: true },
            { title: 'Open Enrollment Guide', slug: '/guides/open-enrollment', readTime: '7 min', popular: false },
            { title: 'Health Insurance for Self-Employed', slug: '/guides/self-employed-health', readTime: '8 min', popular: false },
            { title: 'Medicare Explained', slug: '/guides/medicare', readTime: '12 min', popular: false },
        ],
    },
    {
        name: 'Money-Saving Tips',
        icon: <PiggyBank className="w-5 h-5" />,
        color: 'amber',
        guides: [
            { title: 'How to Bundle Insurance and Save', slug: '/guides/bundling', readTime: '5 min', popular: true },
            { title: 'When to Raise Your Deductible', slug: '/guides/deductibles', readTime: '4 min', popular: false },
            { title: 'Credit Score and Insurance Rates', slug: '/guides/credit-score', readTime: '6 min', popular: true },
            { title: 'Insurance Discount Checklist', slug: '/guides/discount-checklist', readTime: '5 min', popular: true },
            { title: 'When to Switch Insurance Companies', slug: '/guides/when-to-switch', readTime: '6 min', popular: false },
            { title: 'Avoiding Common Insurance Mistakes', slug: '/guides/common-mistakes', readTime: '7 min', popular: false },
        ],
    },
    {
        name: 'Business Insurance',
        icon: <Briefcase className="w-5 h-5" />,
        color: 'slate',
        guides: [
            { title: 'Small Business Insurance Guide', slug: '/business-insurance', readTime: '10 min', popular: true },
            { title: 'General Liability Insurance Explained', slug: '/guides/general-liability', readTime: '6 min', popular: false },
            { title: 'Professional Liability Insurance', slug: '/guides/professional-liability', readTime: '7 min', popular: false },
            { title: 'Workers Compensation Guide', slug: '/guides/workers-comp', readTime: '8 min', popular: false },
            { title: 'Commercial Auto Insurance', slug: '/commercial-auto-insurance', readTime: '6 min', popular: false },
        ],
    },
];

const colorClasses: Record<string, { bg: string; text: string; light: string; border: string }> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
    green: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-200' },
    red: { bg: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-200' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
    amber: { bg: 'bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
    slate: { bg: 'bg-slate-600', text: 'text-slate-600', light: 'bg-slate-50', border: 'border-slate-200' },
};

export default async function GuidesPage() {
    const { insuranceTypes, states } = await getData();

    return (
        <div className="min-h-screen bg-slate-50">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Insurance Guides & Resources
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        Expert guides to help you understand coverage options, save money, and make confident insurance decisions.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span>40+ Guides</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-400" />
                            <span>Expert Written</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            <span>Updated Regularly</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Guides */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Featured Guides</h2>
                                <p className="text-slate-600">Start with our most popular comprehensive guides</p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-sm">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="text-slate-600">Editor's Picks</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            {featuredGuides.map((guide) => {
                                const colors = colorClasses[guide.color];
                                return (
                                    <Link
                                        key={guide.title}
                                        href={guide.href}
                                        className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <div className={colors.text}>{guide.icon}</div>
                                            </div>
                                            <span className={`px-2 py-1 ${colors.light} ${colors.text} text-xs font-semibold rounded-full`}>
                                                {guide.category}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {guide.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-4">{guide.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                {guide.readTime} read
                                            </span>
                                            <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Read Guide <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* All Guides by Category */}
            <section className="py-16 bg-white border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Topic</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Explore our comprehensive library of insurance guides organized by category.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {guideCategories.map((category) => {
                                const colors = colorClasses[category.color];
                                return (
                                    <div key={category.name} className="bg-slate-50 rounded-2xl p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className={`w-10 h-10 ${colors.light} rounded-xl flex items-center justify-center`}>
                                                <div className={colors.text}>{category.icon}</div>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
                                            <span className="text-sm text-slate-400">({category.guides.length} guides)</span>
                                        </div>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {category.guides.map((guide) => (
                                                <Link
                                                    key={guide.title}
                                                    href={guide.slug}
                                                    className="group flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md border border-slate-100 hover:border-slate-200 transition-all"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="flex-shrink-0">
                                                            {guide.popular && (
                                                                <Star className="w-4 h-4 text-amber-500" />
                                                            )}
                                                            {!guide.popular && (
                                                                <FileText className="w-4 h-4 text-slate-300" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                                                            {guide.title}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{guide.readTime}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-4">
                                <Lightbulb className="w-6 h-6 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Insurance Tips</h2>
                            <p className="text-slate-600">Fast facts to help you save money and avoid common pitfalls.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { tip: 'Bundle home and auto insurance to save 10-25% on premiums', icon: '1' },
                                { tip: 'Review your coverage annually - your needs change over time', icon: '2' },
                                { tip: 'Raise your deductible to lower monthly premiums', icon: '3' },
                                { tip: 'Ask about discounts - most people qualify for 3-5 they don\'t know about', icon: '4' },
                                { tip: 'Compare quotes from at least 3 companies before buying', icon: '5' },
                                { tip: 'Good credit can significantly lower your insurance rates', icon: '6' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 bg-white p-5 rounded-xl border border-slate-200">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm">{item.icon}</span>
                                    </div>
                                    <p className="text-slate-700">{item.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 bg-slate-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Insurance Tips in Your Inbox</h2>
                        <p className="text-slate-600 mb-8">
                            Subscribe to our newsletter for money-saving tips, coverage advice, and the latest insurance news.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className="text-xs text-slate-500 mt-4">No spam. Unsubscribe anytime.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Put Your Knowledge to Work?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Now that you understand your options, compare real quotes from top insurance companies and start saving.
                    </p>
                    <Link
                        href="/get-quote"
                        className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
                    >
                        Compare Quotes Now
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
