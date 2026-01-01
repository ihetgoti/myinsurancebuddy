import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Shield, Phone, CheckCircle, ArrowRight, Users, Star, Clock } from 'lucide-react';

export const metadata = {
    title: 'Get Your Free Insurance Quote',
    description: 'Compare insurance quotes from top providers. Free, fast, and no obligation.',
};

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

export default async function GetQuotePage() {
    const { insuranceTypes, states } = await getHeaderData();

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
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            Trusted by 500,000+ customers
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                            Get Your Free Insurance Quote
                        </h1>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                            Compare rates from top-rated insurers and find the coverage that fits your budget.
                            No spam, no hassle.
                        </p>

                        {/* Benefits */}
                        <div className="flex flex-wrap justify-center gap-6 mb-12">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-300">
                                    <span className="text-green-400">{benefit.icon}</span>
                                    <span className="text-sm font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:1-855-205-2412"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
                            >
                                <Phone className="w-5 h-5" />
                                Call Now: 1-855-205-2412
                            </a>
                        </div>

                        <p className="text-sm text-slate-400 mt-4">
                            Licensed agents available Mon-Fri 8am-8pm ET
                        </p>
                    </div>
                </div>
            </section>

            {/* Insurance Types Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
                        What type of insurance are you looking for?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {popularTypes.map((type) => (
                            <Link
                                key={type.id}
                                href={`/${type.slug}`}
                                className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {type.name}
                                    </span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </Link>
                        ))}
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
                            { step: '1', title: 'Tell Us What You Need', desc: 'Answer a few quick questions about your coverage needs.' },
                            { step: '2', title: 'Compare Quotes', desc: 'We\'ll show you rates from multiple top-rated insurers.' },
                            { step: '3', title: 'Save Money', desc: 'Choose the best option and start saving today.' },
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
