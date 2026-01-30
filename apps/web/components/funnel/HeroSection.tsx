'use client';

import Link from 'next/link';
import { MapPin, ArrowRight, CheckCircle, TrendingDown, Shield, Star, Users } from 'lucide-react';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    insuranceType?: {
        name: string;
        icon?: string | null;
    } | null;
    location?: string;
    locationBadge?: string;
}

export default function HeroSection({
    title,
    subtitle,
    insuranceType,
    location,
    locationBadge,
}: HeroSectionProps) {
    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
                {/* Animated gradient orbs */}
                <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
                
                {/* Grid pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>
            
            <div className="container mx-auto px-4 relative z-10 pt-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="max-w-2xl">
                        {/* Location Badge */}
                        {(location || locationBadge) && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6 animate-fade-in-up">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span>{locationBadge || location}</span>
                            </div>
                        )}
                        
                        {/* Insurance Type Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6 animate-fade-in-up animation-delay-100">
                            <span className="text-lg">{insuranceType?.icon || '🛡️'}</span>
                            <span>{insuranceType?.name || 'Insurance'}</span>
                        </div>
                        
                        {/* Main Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight animate-fade-in-up animation-delay-200">
                            {title}
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed animate-fade-in-up animation-delay-300">
                            {subtitle}
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in-up animation-delay-400">
                            <Link
                                href="/get-quote"
                                className="group relative inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 overflow-hidden shine-effect"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Your Free Quote
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link
                                href="/compare"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
                            >
                                Compare Options
                            </Link>
                        </div>
                        
                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm animate-fade-in-up animation-delay-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <span>Free, No Obligation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                <span>100% Secure</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-400" />
                                <span>4.8/5 Rating</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Content - Visual Card */}
                    <div className="hidden lg:block relative animate-fade-in-up animation-delay-300">
                        <div className="relative">
                            {/* Main Card */}
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                                {/* Insurance Quote Card */}
                                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 shadow-2xl mb-6 relative overflow-hidden">
                                    {/* Card shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                                    
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <Shield className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white/70 text-sm">Coverage Type</p>
                                                <p className="text-white font-bold text-lg">{insuranceType?.name || 'Auto Insurance'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/70 text-sm">From</p>
                                            <p className="text-white font-bold text-3xl">$47<span className="text-lg">/mo</span></p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {[
                                            'Full Coverage Included',
                                            '24/7 Claims Support',
                                            'Multiple Discounts Available',
                                            '100+ Providers Compared'
                                        ].map((item, i) => (
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
                                        <p className="text-3xl font-bold text-white mb-1">100+</p>
                                        <p className="text-white/60 text-sm">Providers</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-white mb-1">8M+</p>
                                        <p className="text-white/60 text-sm">Customers</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <p className="text-3xl font-bold text-white mb-1">$867</p>
                                        <p className="text-white/60 text-sm">Avg Savings</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating badges */}
                            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-float">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Licensed</span>
                                </div>
                            </div>
                            
                            <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span>50 States</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
            
            {/* Custom styles for animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-shimmer {
                    animation: shimmer 3s infinite;
                }
                
                .animation-delay-100 {
                    animation-delay: 100ms;
                }
                
                .animation-delay-200 {
                    animation-delay: 200ms;
                }
                
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
                
                .animation-delay-400 {
                    animation-delay: 400ms;
                }
                
                .animation-delay-500 {
                    animation-delay: 500ms;
                }
                
                .shine-effect::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s;
                }
                
                .shine-effect:hover::before {
                    left: 100%;
                }
            `}</style>
        </section>
    );
}
