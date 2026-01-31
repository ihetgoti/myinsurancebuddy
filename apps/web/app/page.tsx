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
    FileText, Award, Users, Building2, TrendingUp, Search, Clock,
    Umbrella, Zap, Plane, Smartphone, Truck, Leaf, Sparkles, ArrowUpRight
} from 'lucide-react';

const getIconForType = (slug: string, className?: string) => {
    const baseClass = className || "w-7 h-7 transition-colors stroke-[1.5]";
    if (slug.includes('auto') || slug.includes('car')) return <Car className={baseClass} />;
    if (slug.includes('home')) return <Home className={baseClass} />;
    if (slug.includes('life')) return <Heart className={baseClass} />;
    if (slug.includes('health') || slug.includes('med')) return <Stethoscope className={baseClass} />;
    if (slug.includes('pet') || slug.includes('dog')) return <Dog className={baseClass} />;
    if (slug.includes('business')) return <Briefcase className={baseClass} />;
    if (slug.includes('renters')) return <Umbrella className={baseClass} />;
    if (slug.includes('motorcycle')) return <Zap className={baseClass} />;
    if (slug.includes('travel')) return <Plane className={baseClass} />;
    if (slug.includes('phone') || slug.includes('mobile')) return <Smartphone className={baseClass} />;
    if (slug.includes('commercial') || slug.includes('truck')) return <Truck className={baseClass} />;
    return <Shield className={baseClass} />;
};

const getIconStyle = (slug: string) => {
    if (slug.includes('auto') || slug.includes('car')) return {
        bg: 'bg-blue-100 group-hover:bg-blue-600',
        icon: 'text-blue-600 group-hover:text-white',
        accent: 'bg-blue-600',
        text: 'text-blue-600'
    };
    if (slug.includes('home') || slug.includes('renters')) return {
        bg: 'bg-emerald-100 group-hover:bg-emerald-600',
        icon: 'text-emerald-600 group-hover:text-white',
        accent: 'bg-emerald-600',
        text: 'text-emerald-600'
    };
    if (slug.includes('life')) return {
        bg: 'bg-rose-100 group-hover:bg-rose-600',
        icon: 'text-rose-600 group-hover:text-white',
        accent: 'bg-rose-600',
        text: 'text-rose-600'
    };
    if (slug.includes('health')) return {
        bg: 'bg-cyan-100 group-hover:bg-cyan-600',
        icon: 'text-cyan-600 group-hover:text-white',
        accent: 'bg-cyan-600',
        text: 'text-cyan-600'
    };
    if (slug.includes('pet')) return {
        bg: 'bg-amber-100 group-hover:bg-amber-600',
        icon: 'text-amber-600 group-hover:text-white',
        accent: 'bg-amber-600',
        text: 'text-amber-600'
    };
    if (slug.includes('business') || slug.includes('commercial')) return {
        bg: 'bg-violet-100 group-hover:bg-violet-600',
        icon: 'text-violet-600 group-hover:text-white',
        accent: 'bg-violet-600',
        text: 'text-violet-600'
    };
    if (slug.includes('motorcycle')) return {
        bg: 'bg-orange-100 group-hover:bg-orange-600',
        icon: 'text-orange-600 group-hover:text-white',
        accent: 'bg-orange-600',
        text: 'text-orange-600'
    };
    return {
        bg: 'bg-slate-100 group-hover:bg-slate-600',
        icon: 'text-slate-600 group-hover:text-white',
        accent: 'bg-slate-600',
        text: 'text-slate-600'
    };
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
                orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
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

            {/* Insurance Categories - Professional & Refined */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div>
                            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3 block">
                                Insurance Types
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Browse by Category</h2>
                        </div>
                        <p className="text-slate-500 max-w-md">
                            Research coverage options and find the best policies for your specific needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {insuranceTypes.map((type, index) => (
                            <Link
                                key={type.id}
                                href={`/${type.slug}`}
                                className="group relative bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
                            >
                                {/* Subtle hover indicator line */}
                                <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-600 rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                                
                                <div className="flex items-start gap-4">
                                    {/* Icon - Monochromatic slate, turns blue on hover */}
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-blue-50">
                                        <div className="text-slate-500 group-hover:text-blue-600 transition-colors duration-300">
                                            {getIconForType(type.slug, "w-6 h-6")}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                            {type.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                            Compare rates & coverage options
                                        </p>
                                        
                                        {/* Learn more link appears on hover */}
                                        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            Explore
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
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

            {/* Learn & Make Smarter Decisions - Editorial Style */}
            {recentPages.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Editorial Header */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 pb-8 border-b border-slate-200">
                            <div className="max-w-xl">
                                <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3 block">
                                    Knowledge Center
                                </span>
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                                    Learn & Make<br />
                                    <span className="text-slate-400">Smarter Decisions</span>
                                </h2>
                            </div>
                            <p className="text-slate-500 max-w-md text-lg leading-relaxed md:text-right">
                                Expert guides and actionable insights on insurance, financial planning, and protecting what matters.
                            </p>
                        </div>

                        {/* Editorial Grid - Balanced 3-Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentPages.slice(0, 6).map((page, index) => {
                                const style = getIconStyle(page.insuranceType?.slug || '');
                                
                                return (
                                    <article 
                                        key={page.id} 
                                        className="group"
                                    >
                                        <Link 
                                            href={page.slug ? `/${page.slug}` : `/${page.insuranceType?.slug || 'insurance'}${page.country ? `/${page.country.code}` : ''}${page.state ? `/${page.state.slug}` : ''}${page.city ? `/${page.city.slug}` : ''}`}
                                            className="block h-full"
                                        >
                                            <div className="relative h-full bg-slate-50 rounded-lg overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:shadow-slate-200/50 min-h-[320px]">
                                                {/* Content Container */}
                                                <div className="absolute inset-0 flex flex-col">
                                                    {/* Top Bar with Number & Category */}
                                                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60">
                                                        <span className="text-4xl font-bold text-slate-200 group-hover:text-slate-300 transition-colors">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${style.text}`}>
                                                            {getIconForType(page.insuranceType?.slug || '', "w-4 h-4")}
                                                            {page.insuranceType?.name || 'Guide'}
                                                        </span>
                                                    </div>

                                                    {/* Main Content */}
                                                    <div className="flex-1 p-6 flex flex-col">
                                                        {/* Title */}
                                                        <h3 className="font-bold text-slate-900 mb-3 leading-tight text-xl group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                                                            {page.title || `${page.insuranceType?.name || 'Insurance'} in ${page.city?.name || page.state?.name || 'Your Area'}`}
                                                        </h3>

                                                        {/* Description */}
                                                        {page.metaDescription && (
                                                            <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                                                                {page.metaDescription}
                                                            </p>
                                                        )}

                                                        {/* Bottom Meta */}
                                                        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-200/60">
                                                            <div className="flex items-center gap-4">
                                                                {/* Read Time */}
                                                                <span className="text-xs text-slate-400 font-medium">
                                                                    5 min read
                                                                </span>
                                                                
                                                                {/* Expert Badge */}
                                                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                                                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                                                                        {['J', 'M', 'S', 'A'][index % 4]}
                                                                    </div>
                                                                    Expert
                                                                </span>
                                                            </div>

                                                            {/* Arrow Link */}
                                                            <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300">
                                                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Accent Line - animates on hover */}
                                                    <div className={`absolute bottom-0 left-0 h-1 ${style.accent} w-0 group-hover:w-full transition-all duration-500 ease-out`}></div>
                                                </div>

                                                {/* Subtle Grid Pattern Overlay */}
                                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                                                    backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                                                    backgroundSize: '20px 20px'
                                                }}></div>
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>

                        {/* View All - Minimal */}
                        <div className="mt-16 flex items-center justify-between border-t border-slate-200 pt-8">
                            <p className="text-slate-500 text-sm">
                                Browse our complete library of {recentPages.length}+ expert guides
                            </p>
                            <Link 
                                href="/resources" 
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors group"
                            >
                                View All Resources
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
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
