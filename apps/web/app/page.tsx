import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserLocationBanner from '@/components/UserLocationBanner';
import { FAQSchema } from '@/components/SchemaMarkup';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import StatsBar from '@/components/funnel/StatsBar';
import TrustBadges from '@/components/funnel/TrustBadges';
import { 
    BadgeCheck, MapPin, Shield, ArrowRight, Car, Home, Heart, 
    Stethoscope, Dog, Briefcase, CheckCircle, Star, TrendingDown,
    FileText, Sparkles, Award, Clock, Users
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
        const [insuranceTypes, states, recentPages, totalPages, totalStates, totalCities, affiliates, allStates, blogPosts] = await Promise.all([
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
            prisma.page.count({ where: { isPublished: true } }).catch(() => 0),
            prisma.state.count({ where: { isActive: true } }).catch(() => 0),
            prisma.city.count({ where: { isActive: true } }).catch(() => 0),
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

        return { insuranceTypes, states, recentPages, totalPages, totalStates, totalCities, affiliates, allStates, blogPosts };
    } catch (error) {
        console.error('Error fetching home data:', error);
        return {
            insuranceTypes: [],
            states: [],
            recentPages: [],
            totalPages: 0,
            totalStates: 0,
            totalCities: 0,
            affiliates: [],
            allStates: [],
            blogPosts: []
        };
    }
}

export default async function HomePage() {
    const { insuranceTypes, states, recentPages, totalPages, totalStates, totalCities, affiliates, allStates, blogPosts } = await getHomeData();

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
                    <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
                    <div 
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="max-w-2xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6">
                                <BadgeCheck className="w-4 h-4" />
                                <span>Your Trusted Insurance Resource</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Compare Insurance &<br />
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Save Up To $867/Year</span>
                            </h1>

                            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                                Get free quotes from 100+ top-rated insurance companies. 
                                We help you find the best coverage at the lowest price in just 2 minutes.
                            </p>

                            {/* Lead Form */}
                            <LeadCaptureForm 
                                variant="hero"
                                source="homepage_hero"
                                accentColor="gradient"
                                buttonText="Get Free Quotes"
                            />

                            {/* Trust indicators */}
                            <div className="flex flex-wrap items-center gap-6 mt-8 text-slate-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    <span>100% Free - No Obligation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                    <span>Licensed in All 50 States</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Visual */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                {/* Main Card */}
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                                    {/* Quote Card */}
                                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 shadow-2xl mb-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <Car className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-white/70 text-sm">Auto Insurance</p>
                                                    <p className="text-white font-bold text-lg">Full Coverage</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white/70 text-sm">From</p>
                                                <p className="text-white font-bold text-3xl">$47<span className="text-lg">/mo</span></p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {['100+ Providers Compared', 'Multiple Discounts Available', '24/7 Claims Support'].map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 text-white/90">
                                                    <CheckCircle className="w-5 h-5 text-emerald-300" />
                                                    <span className="text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white/10 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-white mb-1">100+</p>
                                            <p className="text-white/60 text-sm">Providers</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-white mb-1">8M+</p>
                                            <p className="text-white/60 text-sm">Customers</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-white mb-1">$867</p>
                                            <p className="text-white/60 text-sm">Avg Savings</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badge */}
                                <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Licensed & Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Stats Bar */}
            <StatsBar />

            {/* Trust Badges */}
            <TrustBadges />

            {/* Insurance Types Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
                            <Sparkles className="w-4 h-4" />
                            Browse by Category
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Find the Right Insurance for You
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Compare rates from top providers across all major insurance categories
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {insuranceTypes.map((type, index) => (
                            <Link
                                key={type.id}
                                href={`/${type.slug}`}
                                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
                                style={{ 
                                    animationDelay: `${index * 50}ms`,
                                }}
                            >
                                {/* Hover gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-cyan-50/50 transition-all duration-300" />
                                
                                <div className="relative flex items-start gap-4">
                                    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        {getIconForType(type.slug, "w-7 h-7 text-slate-400 group-hover:text-blue-600 transition-colors")}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                            {type.name}
                                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1">Compare rates & coverage</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-4">
                            <Clock className="w-4 h-4" />
                            Simple & Fast
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Get Insured in 3 Easy Steps
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Our streamlined process gets you quotes in under 2 minutes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                step: '01',
                                icon: <MapPin className="w-6 h-6" />,
                                title: 'Enter Your ZIP Code',
                                description: 'Tell us where you live so we can find local rates and discounts available in your area.',
                                color: 'blue'
                            },
                            {
                                step: '02',
                                icon: <Sparkles className="w-6 h-6" />,
                                title: 'Compare Quotes',
                                description: 'Review personalized quotes from 100+ top-rated insurance providers side by side.',
                                color: 'emerald'
                            },
                            {
                                step: '03',
                                icon: <Award className="w-6 h-6" />,
                                title: 'Save Money',
                                description: 'Choose the best policy and start saving. Our customers save an average of $867/year.',
                                color: 'amber'
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all h-full">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-${item.color}-100 text-${item.color}-600 mb-6`}>
                                        {item.icon}
                                    </div>
                                    <div className={`text-5xl font-bold text-${item.color}-100 mb-4`}>{item.step}</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                        <ArrowRight className="w-8 h-8 text-slate-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular States */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold mb-4">
                                <MapPin className="w-4 h-4" />
                                Local Rates
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                Insurance Rates by State
                            </h2>
                            <p className="text-slate-600 max-w-xl">
                                Insurance regulations and rates vary by state. Find your state to see local requirements and average costs.
                            </p>
                        </div>
                        <Link href="/states" className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
                            View All States
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {states.map(state => (
                            <Link
                                key={state.id}
                                href={`/states/${state.country.code}/${state.slug}`}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all bg-white"
                            >
                                <span className="font-medium text-slate-700 group-hover:text-blue-700 text-sm">{state.name}</span>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </Link>
                        ))}
                        <Link href="/states" className="flex items-center justify-center p-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                            <span className="font-semibold text-slate-600 group-hover:text-blue-700 text-sm">View All 50 States</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            {affiliates.length > 0 && (
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4">
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
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold mb-4">
                                    <FileText className="w-4 h-4" />
                                    Expert Guides
                                </span>
                                <h2 className="text-3xl font-bold text-slate-900">
                                    Latest Insurance Guides
                                </h2>
                            </div>
                            <Link href="/guides" className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
                                View All Guides
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentPages.map(page => (
                                <article key={page.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all group flex flex-col">
                                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-b border-slate-100">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                            {getIconForType(page.insuranceType?.slug || '', "w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors")}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                {page.insuranceType?.name || 'Insurance'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                                            <Link href={page.slug ? `/${page.slug}` : `/${page.insuranceType?.slug || 'insurance'}${page.country ? `/${page.country.code}` : ''}${page.state ? `/${page.state.slug}` : ''}${page.city ? `/${page.city.slug}` : ''}`}>
                                                {page.title || `${page.insuranceType?.name || 'Insurance'} in ${page.city?.name || page.state?.name || 'Your Area'}`}
                                            </Link>
                                        </h3>
                                        <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-blue-600">
                                            Read Guide <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-700 text-sm font-semibold mb-4">
                                    <FileText className="w-4 h-4" />
                                    From Our Blog
                                </span>
                                <h2 className="text-3xl font-bold text-slate-900">
                                    Latest Insights
                                </h2>
                            </div>
                            <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
                                View All Posts
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {blogPosts.map((post: any) => (
                                <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                                    <Link href={`/blog/${post.slug}`}>
                                        <div className="aspect-video rounded-t-2xl overflow-hidden bg-slate-100">
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
                                        <div className="p-6">
                                            {post.category && (
                                                <span
                                                    className="text-xs font-bold uppercase tracking-wider mb-3 inline-block"
                                                    style={{ color: post.category.color || '#3b82f6' }}
                                                >
                                                    {post.category.name}
                                                </span>
                                            )}
                                            <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
                                            )}
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-4">
                            <TrendingDown className="w-4 h-4" />
                            Common Questions
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Quick answers to help you make informed insurance decisions
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            { 
                                q: 'Why is it important to compare car insurance?', 
                                a: 'Insurance companies calculate your rates based on factors like your driving history, location, age, and gender. Every insurer values each factor differently, so any two companies may give you widely different quotes. Comparing ensures you get the best rate.' 
                            },
                            { 
                                q: 'How often should you compare car insurance quotes?', 
                                a: 'We recommend comparing quotes every six or 12 months, or whenever your policy is coming up for renewal. Life changes like moving, getting married, or buying a new car are also great times to shop around.' 
                            },
                            { 
                                q: 'What\'s the easiest way to compare car insurance?', 
                                a: 'By far the easiest way to compare car insurance is with an insurance-comparison site like ours. You only have to enter your information once to get quotes from multiple companies, saving you time and money.' 
                            },
                            { 
                                q: 'Which company has the cheapest car insurance?', 
                                a: 'The cheapest company varies by driver profile and location. That\'s why comparing personalized quotes is so important. What\'s cheapest for your neighbor might not be cheapest for you.' 
                            },
                        ].map((faq, index) => (
                            <details key={index} className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                                <summary className="p-6 cursor-pointer font-semibold text-slate-900 hover:bg-white transition-colors flex items-center justify-between">
                                    {faq.q}
                                    <TrendingDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
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

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                </div>
                
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Saving?
                    </h2>
                    <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join 8 million+ Americans who found better insurance rates. 
                        Get your free quotes in just 2 minutes.
                    </p>
                    
                    <div className="max-w-md mx-auto">
                        <LeadCaptureForm 
                            variant="hero"
                            source="homepage_cta"
                            accentColor="gradient"
                            buttonText="Get Free Quotes Now"
                        />
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/80 text-sm">
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            No commitment required
                        </span>
                        <span className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Your info is secure
                        </span>
                        <span className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Licensed agents available
                        </span>
                    </div>
                </div>
            </section>

            {/* National Coverage Directory (SEO) */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4">
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
