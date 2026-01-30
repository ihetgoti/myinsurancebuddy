import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserLocationBanner from '@/components/UserLocationBanner';
import { FAQSchema } from '@/components/SchemaMarkup';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { 
    BadgeCheck, MapPin, Shield, ArrowRight, Car, Home, Heart, 
    Stethoscope, Dog, Briefcase, CheckCircle, Star, TrendingDown,
    FileText, Award, Users, Building2, TrendingUp, Search, Clock
} from 'lucide-react';

const getIconForType = (slug: string, className?: string) => {
    const baseClass = className || "w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors stroke-[1.5]";
    if (slug.includes('auto') || slug.includes('car')) return <Car className={baseClass} />;
    if (slug.includes('home')) return <Home className={baseClass} />;
    if (slug.includes('life')) return <Heart className={baseClass} />;
    if (slug.includes('health') || slug.includes('med')) return <Stethoscope className={baseClass} />;
    if (slug.includes('pet') || slug.includes('dog')) return <Dog className={baseClass} />;
    if (slug.includes('business')) return <Briefcase className={baseClass} />;
    return <Shield className={baseClass} />;
};

export const dynamic = 'force-dynamic';

async function getHomeData() {
    try {
        const [insuranceTypes, states, recentPages, affiliates, allStates, blogPosts] = await Promise.all([
            prisma.insuranceType.findMany({
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
            }).catch(() => []),
            prisma.state.findMany({
                where: { isActive: true },
                include: { country: true },
                orderBy: { name: 'asc' },
                take: 12,
            }).catch(() => []),
            prisma.page.findMany({
                where: { isPublished: true },
                include: {
                    insuranceType: true,
                    country: true,
                    state: true,
                    city: true,
                },
                orderBy: { publishedAt: 'desc' },
                take: 6,
            }).catch(() => []),
            prisma.affiliatePartner.findMany({
                where: { isActive: true },
                orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
                take: 6,
            }).catch(() => []),
            prisma.state.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true, country: { select: { code: true } } },
                orderBy: { name: 'asc' },
            }).catch(() => []),
            prisma.blogPost.findMany({
                where: { isPublished: true },
                orderBy: { publishedAt: 'desc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    featuredImage: true,
                    publishedAt: true,
                    category: { select: { name: true, color: true } },
                },
            }).catch(() => []),
        ]);

        return { insuranceTypes, states, recentPages, affiliates, allStates, blogPosts };
    } catch (error) {
        console.error('Error fetching home data:', error);
        return {
            insuranceTypes: [],
            states: [],
            recentPages: [],
            affiliates: [],
            allStates: [],
            blogPosts: []
        };
    }
}

export default async function HomePage() {
    const { insuranceTypes, states, recentPages, affiliates, allStates, blogPosts } = await getHomeData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero Section - Clean & Professional */}
            <section className="relative bg-[#0F172A] pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-800 mb-8">
                            <BadgeCheck className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Your Trusted Insurance Resource</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Smart Insurance &<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Financial Planning</span>
                        </h1>

                        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                            Expert guidance on insurance coverage and financial planning. Learn, compare, and make confident decisions for your future.
                        </p>

                        {/* Clean CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/states"
                                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg"
                            >
                                <MapPin className="w-5 h-5" />
                                Browse by State
                            </Link>
                            <Link
                                href="/guides"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-500 transition-all border border-blue-500"
                            >
                                <Search className="w-5 h-5" />
                                Explore Guides
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
                            <Shield className="w-4 h-4" />
                            <span>Trusted by thousands of users nationwide</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar - Professional */}
            <section className="py-12 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">12+</div>
                            <div className="text-sm text-slate-500">Years in Business</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">50</div>
                            <div className="text-sm text-slate-500">States Licensed</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">100+</div>
                            <div className="text-sm text-slate-500">Insurance Partners</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">8M+</div>
                            <div className="text-sm text-slate-500">Happy Customers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insurance Categories - Minimalist */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-xl mx-auto text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Browse by Category</h2>
                        <p className="text-slate-500 font-light leading-relaxed">
                            Research coverage options and find the best policies for your needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {insuranceTypes.map((type) => (
                            <Link
                                key={type.id}
                                href={`/${type.slug}`}
                                className="group flex items-center p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mr-5 group-hover:bg-blue-50 transition-colors">
                                    {getIconForType(type.slug)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                        {type.name}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-600" />
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1">Compare rates & coverage</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Get Quote Section - Clean & Professional */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Compare Insurance Quotes</h2>
                    <p className="text-slate-600 mb-8">Enter your ZIP code to get personalized quotes from top providers.</p>
                    
                    <div className="max-w-md mx-auto">
                        <LeadCaptureForm 
                            variant="minimal"
                            source="homepage_cta"
                            accentColor="blue"
                            buttonText="Get Free Quotes"
                            showTrustBadges={true}
                        />
                    </div>
                    
                    <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            Free & Secure
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            No Obligation
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            Takes 2 Minutes
                        </span>
                    </div>
                </div>
            </section>

            {/* Why Choose Us - Trust Building */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Why Choose MyInsuranceBuddy</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">We help you navigate the complex world of insurance with expert guidance and unbiased comparisons.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Building2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Licensed in All 50 States</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Fully licensed insurance agency with regulatory compliance nationwide. Your protection is our priority.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <TrendingUp className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Unbiased Comparisons</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">We compare rates from 100+ top-rated insurers to find you the best coverage at competitive prices.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Expert Support</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Our licensed agents are available to answer your questions and guide you through the process.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular States */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Insurance Rates by State</h2>
                            <p className="text-slate-600">Local regulations and rates vary significantly. Find your state.</p>
                        </div>
                        <Link href="/states" className="hidden md:inline-flex items-center font-semibold text-blue-600 hover:text-blue-700">
                            View All States →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {states.map(state => (
                            <Link
                                key={state.id}
                                href={`/states/${state.country.code}/${state.slug}`}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all bg-white"
                            >
                                <span className="font-medium text-slate-700 group-hover:text-slate-900 text-sm">{state.name}</span>
                                <span className="text-slate-300 group-hover:text-blue-500 transition-colors">→</span>
                            </Link>
                        ))}
                        <Link href="/states" className="flex items-center justify-center p-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                            <span className="font-semibold text-slate-600 group-hover:text-blue-700 text-sm">View All 50 States</span>
                            <ArrowRight className="w-4 h-4 ml-2 text-slate-400 group-hover:text-blue-700" />
                        </Link>
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/states" className="font-semibold text-blue-600">View All States →</Link>
                    </div>
                </div>
            </section>

            {/* Insurance Partners */}
            {affiliates.length > 0 && (
                <section className="py-16 bg-white border-y border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">Compare Top Insurance Providers</h2>
                            <p className="text-slate-500">Get quotes from trusted insurance carriers</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {affiliates.map((partner: any) => (
                                <a
                                    key={partner.id}
                                    href={partner.affiliateUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group flex items-center gap-4 p-5 bg-white rounded-xl border hover:shadow-lg transition-all ${partner.affiliateUrl
                                        ? 'border-slate-200 hover:border-blue-500'
                                        : 'border-dashed border-slate-300 opacity-60'
                                        }`}
                                >
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {partner.logo ? (
                                            <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <span className="text-xl font-bold text-slate-400">{partner.name[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                            {partner.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 truncate">
                                            {partner.insuranceTypes?.join(', ') || 'Multiple coverage types'}
                                        </p>
                                    </div>
                                    <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 ${partner.affiliateUrl
                                        ? 'bg-blue-600 text-white group-hover:bg-blue-700'
                                        : 'bg-slate-200 text-slate-500'
                                        }`}>
                                        {partner.ctaText || 'Get Quote'}
                                    </span>
                                </a>
                            ))}
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-6">
                            Clicking these links may take you to partner websites. We may earn a commission at no extra cost to you.
                        </p>
                    </div>
                </section>
            )}

            {/* Recent Articles */}
            {recentPages.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center tracking-tight">
                            Learn & Make Smarter Decisions
                        </h2>
                        <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
                            Expert guides on insurance, financial planning, and protecting what matters most.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentPages.map(page => (
                                <article key={page.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col">
                                    <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-50">
                                        {getIconForType(page.insuranceType?.slug || '', "w-12 h-12 text-slate-300 group-hover:text-blue-500 transition-colors")}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{page.insuranceType?.name || 'Insurance'}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                                            <Link href={page.slug ? `/${page.slug}` : `/${page.insuranceType?.slug || 'insurance'}${page.country ? `/${page.country.code}` : ''}${page.state ? `/${page.state.slug}` : ''}${page.city ? `/${page.city.slug}` : ''}`}>
                                                {page.title || `${page.insuranceType?.name || 'Insurance'} in ${page.city?.name || page.state?.name || 'Your Area'}`}
                                            </Link>
                                        </h3>
                                        <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                                            Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Posts */}
            {blogPosts && blogPosts.length > 0 && (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                From Our Blog
                            </h2>
                            <Link href="/blog" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {blogPosts.map((post: any) => (
                                <article key={post.id} className="group">
                                    <Link href={`/blog/${post.slug}`}>
                                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4">
                                            {post.featuredImage ? (
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FileText className="w-12 h-12 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        {post.category && (
                                            <span
                                                className="text-xs font-bold uppercase tracking-wider mb-2 inline-block"
                                                style={{ color: post.category.color || '#3b82f6' }}
                                            >
                                                {post.category.name}
                                            </span>
                                        )}
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        {post.excerpt && (
                                            <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
                                        )}
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-12 tracking-tight">
                        Common Questions
                    </h2>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            { q: 'Why is it important to compare car insurance?', a: 'Insurance companies calculate your rates based on factors like your driving history, location, age, and gender. Every insurer values each factor differently, so any two companies may give you widely different quotes.' },
                            { q: 'How often should you compare car insurance quotes?', a: 'We recommend comparing quotes every six or 12 months, or whenever your policy is coming up for renewal.' },
                            { q: 'What\'s the easiest way to compare car insurance?', a: 'By far the easiest way to compare car insurance is with an insurance-comparison site. You only have to enter your information once to get quotes from multiple companies.' },
                            { q: 'Which company has the cheapest car insurance?', a: 'The cheapest company varies by driver profile and location. That\'s why comparing personalized quotes is so important.' },
                        ].map((faq, index) => (
                            <details key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                                <summary className="p-6 cursor-pointer font-medium text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    {faq.q}
                                    <TrendingDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
                <FAQSchema faqs={[
                    { question: 'Why is it important to compare car insurance?', answer: 'Insurance companies calculate your rates based on factors like your driving history, location, age, and gender. Every insurer values each factor differently, so any two companies may give you widely different quotes.' },
                    { question: 'How often should you compare car insurance quotes?', answer: 'We recommend comparing quotes every six or 12 months, or whenever your policy is coming up for renewal.' },
                    { question: 'What is the easiest way to compare car insurance?', answer: 'By far the easiest way to compare car insurance is with an insurance-comparison site. You only have to enter your information once to get quotes from multiple companies.' },
                    { question: 'Which company has the cheapest car insurance?', answer: 'The cheapest company varies by driver profile and location. That is why comparing personalized quotes is so important.' },
                ]} />
            </section>

            {/* Final CTA - Clean */}
            <section className="bg-slate-900 border-t border-slate-800 py-20 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Financial Journey</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg font-light">
                        Access comprehensive guides, compare options, and take control of your insurance and financial future.
                    </p>
                    <Link
                        href="/get-quote"
                        className="inline-block bg-white text-slate-900 px-10 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg"
                    >
                        Get Your Free Quote
                    </Link>
                </div>
            </section>

            {/* National Coverage Directory (SEO) */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">National Coverage</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-2 gap-x-4">
                        {allStates && allStates.map(state => (
                            <Link
                                key={state.id}
                                href={`/states/${state.country.code}/${state.slug}`}
                                className="text-sm text-slate-500 hover:text-blue-600 hover:underline transition-colors"
                            >
                                {state.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
            <UserLocationBanner />
        </div>
    );
}
