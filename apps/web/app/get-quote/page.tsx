import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Shield, Phone, CheckCircle, ArrowRight, Users, Star, Clock, MapPin } from 'lucide-react';

export const metadata = {
    title: 'Get Your Free Insurance Quote',
    description: 'Compare insurance quotes from top providers. Free, fast, and no obligation.',
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
        const insuranceType = type 
            ? await prisma.insuranceType.findFirst({
                  where: { slug: type, isActive: true },
                  select: { id: true, name: true, slug: true }
              })
            : null;

        // Find best matching offer - include general offers (no insurance type specified)
        const offer = await prisma.callOffer.findFirst({
            where: {
                isActive: true,
                formRedirectUrl: { not: null },
                // Match insurance type if provided, or get general offers
                ...(insuranceType?.id
                    ? { insuranceTypeId: insuranceType.id }
                    : { insuranceTypeId: null } // General offers
                ),
            },
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
        { icon: <Clock className="w-5 h-5" />, text: 'Takes less than 5 minutes' },
        { icon: <Shield className="w-5 h-5" />, text: '100% free, no obligation' },
        { icon: <Users className="w-5 h-5" />, text: 'Compare multiple providers' },
        { icon: <Star className="w-5 h-5" />, text: 'Save up to 40%' },
    ];

    const popularTypes = insuranceTypes.slice(0, 6);

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={states} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            Trusted by 500,000+ customers
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Get Your Free Insurance Quote
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Compare rates from top-rated insurers and find the coverage that fits your budget.
                        </p>

                        {/* ZIP Form */}
                        {zip && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto mb-8">
                                <p className="text-slate-300 mb-4">You entered ZIP code: <span className="text-white font-bold">{zip}</span></p>
                                <form action="/get-quote" method="GET" className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="zip"
                                            defaultValue={zip}
                                            placeholder="ZIP Code"
                                            pattern="[0-9]{5}"
                                            maxLength={5}
                                            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg text-slate-900 placeholder-slate-400"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors"
                                    >
                                        Update
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Benefits */}
                        <div className="flex flex-wrap justify-center gap-6 mb-8">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-300">
                                    <span className="text-green-400">{benefit.icon}</span>
                                    <span className="text-sm font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Insurance Types Selection */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
                        What type of insurance are you looking for?
                    </h2>
                    <p className="text-slate-600 text-center mb-10 max-w-xl mx-auto">
                        Select the insurance type that matches your needs. We'll connect you with the best providers in your area.
                    </p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {popularTypes.map((insuranceType) => {
                            const offerUrl = `/get-quote?zip=${zip || ''}&type=${insuranceType.slug}&email=${email || ''}`;
                            return (
                                <Link
                                    key={insuranceType.id}
                                    href={offerUrl}
                                    className="group flex items-center justify-between p-5 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {insuranceType.name}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                    
                    {insuranceTypes.length > 6 && (
                        <div className="text-center mt-8">
                            <Link
                                href="/insurance-types"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                View all insurance types →
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            { step: '1', title: 'Select Your Coverage', desc: 'Choose the type of insurance you need from our comprehensive options.' },
                            { step: '2', title: 'Enter Your ZIP Code', desc: 'We use your location to find the best rates and providers in your area.' },
                            { step: '3', title: 'Get Connected', desc: 'We'll redirect you to a trusted partner to complete your quote.' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Ready to Start Saving?
                        </h3>
                        <p className="text-slate-300 mb-8">
                            Our licensed agents are standing by to help you find the perfect coverage at the best price.
                        </p>
                        <a
                            href="tel:1-855-205-2412"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all"
                        >
                            <Phone className="w-5 h-5" />
                            1-855-205-2412
                        </a>
                        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> No Spam</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> No Obligation</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> 100% Free</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
