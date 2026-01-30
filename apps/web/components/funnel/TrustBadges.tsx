'use client';

import { Shield, Lock, Zap, Ban, CheckCircle, Star, Award, Clock } from 'lucide-react';

interface TrustFeature {
    icon: React.ReactNode;
    label: string;
    description: string;
    color: string;
}

const features: TrustFeature[] = [
    { 
        icon: <Award className="w-5 h-5" />, 
        label: 'Top Rated',
        description: 'A+ BBB Rating',
        color: 'text-amber-500 bg-amber-50 border-amber-200'
    },
    { 
        icon: <Lock className="w-5 h-5" />, 
        label: 'SSL Secured',
        description: '256-bit Encryption',
        color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
    },
    { 
        icon: <Zap className="w-5 h-5" />, 
        label: 'Fast Quotes',
        description: 'Results in 2 minutes',
        color: 'text-blue-500 bg-blue-50 border-blue-200'
    },
    { 
        icon: <Ban className="w-5 h-5" />, 
        label: 'No Spam',
        description: 'We respect your privacy',
        color: 'text-rose-500 bg-rose-50 border-rose-200'
    },
];

const publications = [
    { name: 'Forbes', logo: 'F' },
    { name: 'Bloomberg', logo: 'B' },
    { name: 'WSJ', logo: 'W' },
    { name: 'CNBC', logo: 'C' },
];

export default function TrustBadges() {
    return (
        <section className="py-10 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Trust Features */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        {features.map((feature, i) => (
                            <div 
                                key={i}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">{feature.label}</p>
                                    <p className="text-xs text-slate-500">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* As Featured In */}
                    <div className="flex items-center gap-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured In</span>
                        <div className="flex items-center gap-4">
                            {publications.map((pub, i) => (
                                <div 
                                    key={i}
                                    className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                                    title={pub.name}
                                >
                                    {pub.logo}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Additional Trust Signals */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Licensed in all 50 states</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span>100+ verified insurance partners</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span>4.8/5 customer satisfaction</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>24/7 support available</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
