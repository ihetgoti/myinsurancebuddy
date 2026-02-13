'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Shield, Phone, CheckCircle, ArrowRight, Users, Star, 
    Clock, MapPin, TrendingUp, ChevronDown, Loader2, Mail 
} from 'lucide-react';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
}

const insuranceTypes: InsuranceType[] = [
    { id: '1', name: 'Auto Insurance', slug: 'car-insurance' },
    { id: '2', name: 'Home Insurance', slug: 'home-insurance' },
    { id: '3', name: 'Life Insurance', slug: 'life-insurance' },
    { id: '4', name: 'Health Insurance', slug: 'health-insurance' },
    { id: '5', name: 'Renters Insurance', slug: 'renters-insurance' },
    { id: '6', name: 'Pet Insurance', slug: 'pet-insurance' },
    { id: '7', name: 'Business Insurance', slug: 'business-insurance' },
    { id: '8', name: 'Motorcycle Insurance', slug: 'motorcycle-insurance' },
];

const benefits = [
    { icon: Clock, text: 'Takes less than 2 minutes' },
    { icon: Shield, text: '100% free, no obligation' },
    { icon: Users, text: 'Compare 120+ providers' },
    { icon: TrendingUp, text: 'Save up to $867/year' },
];

export default function GetQuoteForm() {
    const searchParams = useSearchParams();
    const initialZip = searchParams.get('zip') || '';
    const initialType = searchParams.get('type') || '';
    
    const [zip, setZip] = useState(initialZip);
    const [selectedType, setSelectedType] = useState(initialType);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<{ zip?: string; type?: string }>({});

    useEffect(() => {
        if (initialZip) setZip(initialZip);
        if (initialType) setSelectedType(initialType);
    }, [initialZip, initialType]);

    const validateForm = useCallback(() => {
        const newErrors: { zip?: string; type?: string } = {};
        
        if (!zip || zip.length !== 5) {
            newErrors.zip = 'Please enter a valid 5-digit ZIP code';
        }
        
        if (!selectedType) {
            newErrors.type = 'Please select an insurance type';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [zip, selectedType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            // Try to find a MarketCall offer first
            const params = new URLSearchParams();
            params.set('insuranceType', selectedType);
            params.set('zip', zip);
            if (email) params.set('email', email);
            
            const response = await fetch(`/api/redirect-offer?${params.toString()}`);
            const data = await response.json();
            
            if (data.success && data.redirectUrl) {
                // Redirect to affiliate
                window.location.href = data.redirectUrl;
                return;
            }
        } catch (error) {
            console.log('No affiliate found, showing success message');
        }
        
        // No affiliate - show success/thank you page state
        setShowSuccess(true);
        setIsLoading(false);
    };

    // Success/Thank You State
    if (showSuccess) {
        return (
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Thank You! We&apos;ve Received Your Request
                        </h1>
                        
                        <p className="text-lg text-slate-300 mb-8">
                            Our licensed agents will review your request for{' '}
                            <span className="text-white font-semibold">
                                {insuranceTypes.find(t => t.slug === selectedType)?.name || 'Insurance'}
                            </span>{' '}
                            in ZIP code <span className="text-white font-semibold">{zip}</span> and contact you within 24 hours with personalized quotes.
                        </p>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                            <h3 className="text-white font-semibold mb-4">What happens next?</h3>
                            <div className="space-y-3 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
                                    <p className="text-slate-300">Our agents analyze rates from 120+ providers in your area</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
                                    <p className="text-slate-300">You&apos;ll receive 3-5 personalized quotes via email/phone</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">3</div>
                                    <p className="text-slate-300">Compare and choose the best coverage for your needs</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:1-855-205-2412"
                                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all"
                            >
                                <Phone className="w-5 h-5" />
                                Call Now: 1-855-205-2412
                            </a>
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    setZip('');
                                    setSelectedType('');
                                    setEmail('');
                                }}
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                            >
                                <ArrowRight className="w-5 h-5" />
                                Get Another Quote
                            </button>
                        </div>
                        
                        <p className="text-slate-400 text-sm mt-6">
                            Licensed agents available Mon-Fri 8am-8pm EST, Sat 9am-5pm EST
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            Trusted by 8 Million+ Customers
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                            Get Your Free Insurance Quote
                        </h1>
                        
                        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                            Compare rates from 120+ top-rated insurers. Takes just 2 minutes!
                        </p>

                        {/* Simple Form */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-xl mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* ZIP Code Input */}
                                <div>
                                    <label className="block text-left text-sm font-semibold text-slate-700 mb-2">
                                        Enter Your ZIP Code
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={zip}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                                                setZip(value);
                                                if (errors.zip) setErrors({ ...errors, zip: undefined });
                                            }}
                                            placeholder="12345"
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 transition-colors text-lg ${
                                                errors.zip ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'
                                            }`}
                                            required
                                        />
                                    </div>
                                    {errors.zip && (
                                        <p className="text-red-500 text-sm mt-1 text-left">{errors.zip}</p>
                                    )}
                                </div>

                                {/* Insurance Type Dropdown */}
                                <div>
                                    <label className="block text-left text-sm font-semibold text-slate-700 mb-2">
                                        Select Insurance Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedType}
                                            onChange={(e) => {
                                                setSelectedType(e.target.value);
                                                if (errors.type) setErrors({ ...errors, type: undefined });
                                            }}
                                            className={`w-full pl-4 pr-12 py-4 bg-slate-50 border-2 rounded-xl text-slate-900 focus:outline-none focus:ring-0 transition-colors text-lg appearance-none cursor-pointer ${
                                                errors.type ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'
                                            } ${!selectedType ? 'text-slate-400' : ''}`}
                                            required
                                        >
                                            <option value="" disabled>Choose insurance type...</option>
                                            {insuranceTypes.map((type) => (
                                                <option key={type.id} value={type.slug}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                    </div>
                                    {errors.type && (
                                        <p className="text-red-500 text-sm mt-1 text-left">{errors.type}</p>
                                    )}
                                </div>

                                {/* Optional Email */}
                                <div>
                                    <label className="block text-left text-sm font-semibold text-slate-700 mb-2">
                                        Email <span className="text-slate-400 font-normal">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors text-lg"
                                        />
                                    </div>
                                    <p className="text-slate-400 text-xs mt-1 text-left">
                                        We&apos;ll send your quotes here. No spam, ever.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-600/25"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            Finding Best Rates...
                                        </>
                                    ) : (
                                        <>
                                            Get My Free Quotes
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-100">
                                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    No Spam
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    100% Secure
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    2 Minutes
                                </span>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mt-10">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-300">
                                    <benefit.icon className="w-5 h-5 text-green-400" />
                                    <span className="text-sm font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                            How It Works
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto">
                            Getting your insurance quote is quick and easy
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            { step: '1', title: 'Enter Your Info', desc: 'Just your ZIP code and insurance type - takes 30 seconds.' },
                            { step: '2', title: 'We Search For You', desc: 'Our agents analyze rates from 120+ top providers in your area.' },
                            { step: '3', title: 'Get Your Quotes', desc: 'Receive 3-5 personalized quotes within 24 hours.' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg shadow-blue-600/20">
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Stats */}
            <section className="py-12 bg-white border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { value: '8M+', label: 'Happy Customers', icon: Users },
                            { value: '120+', label: 'Insurance Partners', icon: Shield },
                            { value: '50', label: 'States Covered', icon: MapPin },
                            { value: '$867', label: 'Avg. Annual Savings', icon: TrendingUp },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-4">
                                <div className="flex justify-center mb-2">
                                    <stat.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Logos */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">
                        Trusted Partners
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
                        {['State Farm', 'GEICO', 'Progressive', 'Allstate', 'Liberty Mutual', 'Nationwide'].map((partner) => (
                            <span key={partner} className="text-lg font-bold text-slate-600">
                                {partner}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 lg:p-12 text-center">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                            Prefer to Talk?
                        </h3>
                        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                            Our licensed agents are standing by to help you find the perfect coverage at the best price.
                        </p>
                        <a
                            href="tel:1-855-205-2412"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all"
                        >
                            <Phone className="w-5 h-5" />
                            1-855-205-2412
                        </a>
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> No Spam</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> No Obligation</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> 100% Free</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
