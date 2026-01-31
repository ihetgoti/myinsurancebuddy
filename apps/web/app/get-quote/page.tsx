import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Shield, Phone, CheckCircle, ArrowRight, Users, Star, Clock, MapPin, TrendingUp } from 'lucide-react';

export const metadata = {
    title: 'Get Your Free Insurance Quote | Compare 120+ Providers - MyInsuranceBuddy',
    description: 'Compare insurance quotes from 120+ top-rated providers. Free, fast, and no obligation. Save up to $867/year on auto, home, life, and health insurance.',
    keywords: 'insurance quotes, free insurance quote, compare insurance, insurance rates, auto insurance quote, home insurance quote',
    openGraph: {
        title: 'Get Your Free Insurance Quote - MyInsuranceBuddy',
        description: 'Compare rates from top-rated insurers and save up to $867/year.',
    },
};

export const dynamic = 'force-dynamic';

async function getHeaderData() {
    const [insuranceTypes, states] = await Promise.all([
        prisma.insuranceType.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            take: 10,
        }),
        prisma.state.findMany({
            where: { isActive: true },
            include: { country: true },
            take: 10,
        }),
    ]);
    return { insuranceTypes, states };
}

// Check for MarketCall offer and redirect if found
async function checkMarketCallOffer(searchParams: { [key: string]: string | string[] | undefined }) {
    const zip = searchParams.zip as string;
    const type = searchParams.type as string;
    const email = searchParams.email as string;
    
    if (!zip) return null;

    try {
        // Find insurance type
        let insuranceType = null;
        if (type) {
            insuranceType = await prisma.insuranceType.findFirst({
                where: { slug: type, isActive: true },
                select: { id: true, name: true, slug: true }
            });
        }

        // Build where clause
        const whereClause: any = {
            isActive: true,
            formRedirectUrl: { not: null },
        };

        // Add insurance type filter
        if (insuranceType?.id) {
            whereClause.insuranceTypeId = insuranceType.id;
        } else {
            whereClause.insuranceTypeId = null;
        }

        // Find best matching offer
        const offer = await prisma.callOffer.findFirst({
            where: whereClause,
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        if (offer?.formRedirectUrl) {
            // Build redirect URL
            let redirectUrl = offer.formRedirectUrl;
            const trackingParams = new URLSearchParams();
            if (zip) trackingParams.set('zip', zip);
            if (email) trackingParams.set('email', email);
            if (offer.subId) trackingParams.set('subid', offer.subId);
            if (offer.campaignId) trackingParams.set('campaign', offer.campaignId);
            if (type) trackingParams.set('type', type);
            
            const separator = redirectUrl.includes('?') ? '&' : '?';
            return `${redirectUrl}${separator}${trackingParams.toString()}`;
        }
    } catch (error) {
        console.error('Error checking MarketCall offer:', error);
    }
    
    return null;
}

export default async function GetQuotePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { insuranceTypes, states } = await getHeaderData();
    const zip = searchParams.zip as string;
    const type = searchParams.type as string;
    const email = searchParams.email as string;

    // Check for MarketCall offer and redirect if found
    const marketCallUrl = await checkMarketCallOffer(searchParams);
    if (marketCallUrl) {
        redirect(marketCallUrl);
    }

    const benefits = [
        { icon: Clock, text: 'Takes less than 5 minutes' },
        { icon: Shield, text: '100% free, no obligation' },
        { icon: Users, text: 'Compare 120+ providers' },
        { icon: TrendingUp, text: 'Save up to $867/year' },
    ];

    const popularTypes = insuranceTypes.slice(0, 6);

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero Section - Mobile Optimized */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500 rounded-full blur-3xl"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600/20 rounded-full text-blue-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                            Trusted by 8 Million+ Customers
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                            Get Your Free<br className="sm:hidden" /> Insurance Quote
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
                            Compare rates from top-rated insurers and find the coverage that fits your budget.
                        </p>

                        {/* ZIP Form */}
                        {zip && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 max-w-md mx-auto mb-6 sm:mb-8">
                                <p className="text-slate-300 mb-3 sm:mb-4 text-sm sm:text-base">
                                    You entered ZIP code: <span className="text-white font-bold">{zip}</span>
                                </p>
                                <form action="/get-quote" method="GET" className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <div className="flex-1 relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                                        <input
                                            type="text"
                                            name="zip"
                                            defaultValue={zip}
                                            placeholder="ZIP Code"
                                            pattern="[0-9]{5}"
                                            maxLength={5}
                                            className="w-full pl-9 sm:pl-10 pr-4 py-3 bg-white rounded-lg text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white font-semibold px-5 sm:px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors text-sm sm:text-base"
                                    >
                                        Update
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Benefits - Scrollable on Mobile */}
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                                    <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                                    <span className="text-xs sm:text-sm font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Insurance Types Selection */}
            <section className="py-10 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                            What type of insurance are you looking for?
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
                            Select the insurance type that matches your needs. We&apos;ll connect you with the best providers in your area.
                        </p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
                        {popularTypes.map((insuranceType) => {
                            const offerUrl = `/get-quote?zip=${zip || ''}&type=${insuranceType.slug}&email=${email || ''}`;
                            return (
                                <Link
                                    key={insuranceType.id}
                                    href={offerUrl}
                                    className="group flex items-center justify-between p-4 sm:p-5 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                                            {insuranceType.name}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                    
                    {insuranceTypes.length > 6 && (
                        <div className="text-center mt-6 sm:mt-8">
                            <Link
                                href="/insurance-types"
                                className="text-blue-600 font-semibold hover:underline text-sm sm:text-base inline-flex items-center gap-1"
                            >
                                View all insurance types
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-10 sm:py-12 lg:py-16 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                            How It Works
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
                            Getting your insurance quote is quick and easy
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                        {[
                            { step: '1', title: 'Select Your Coverage', desc: 'Choose the type of insurance you need from our comprehensive options.' },
                            { step: '2', title: 'Enter Your ZIP Code', desc: 'We use your location to find the best rates and providers in your area.' },
                            { step: '3', title: 'Get Connected', desc: 'We&apos;ll redirect you to a trusted partner to complete your quote.' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3 sm:mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h3>
                                <p className="text-slate-500 text-xs sm:text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Stats */}
            <section className="py-10 sm:py-12 bg-white border-y border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        {[
                            { value: '8M+', label: 'Happy Customers', icon: Users },
                            { value: '120+', label: 'Insurance Partners', icon: Shield },
                            { value: '50', label: 'States Covered', icon: MapPin },
                            { value: '$867', label: 'Avg. Annual Savings', icon: TrendingUp },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-3 sm:p-4">
                                <div className="flex justify-center mb-2">
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 sm:p-10 lg:p-12 text-center">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                            Ready to Start Saving?
                        </h3>
                        <p className="text-slate-300 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
                            Our licensed agents are standing by to help you find the perfect coverage at the best price.
                        </p>
                        <a
                            href="tel:1-855-205-2412"
                            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 rounded-xl font-bold text-base sm:text-lg hover:bg-slate-100 transition-all"
                        >
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            1-855-205-2412
                        </a>
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-slate-400">
                            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" /> No Spam</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" /> No Obligation</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" /> 100% Free</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
