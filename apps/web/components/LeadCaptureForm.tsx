'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Mail, ArrowRight, Loader2, Shield, Clock, CheckCircle } from 'lucide-react';
import { trackFormSubmit, trackCTAClick } from './GTMDataLayer';

interface LeadCaptureFormProps {
    variant?: 'inline' | 'stacked' | 'compact';
    insuranceType?: string;
    source?: string;
    redirectUrl?: string;
    showEmail?: boolean;
    showTrustBadges?: boolean;
    buttonText?: string;
    accentColor?: 'blue' | 'emerald' | 'orange' | 'purple';
    className?: string;
}

const colorSchemes = {
    blue: {
        button: 'bg-blue-600 hover:bg-blue-700',
        focus: 'focus:ring-blue-500',
        icon: 'text-blue-500'
    },
    emerald: {
        button: 'bg-emerald-600 hover:bg-emerald-700',
        focus: 'focus:ring-emerald-500',
        icon: 'text-emerald-500'
    },
    orange: {
        button: 'bg-orange-600 hover:bg-orange-700',
        focus: 'focus:ring-orange-500',
        icon: 'text-orange-500'
    },
    purple: {
        button: 'bg-purple-600 hover:bg-purple-700',
        focus: 'focus:ring-purple-500',
        icon: 'text-purple-500'
    }
};

export default function LeadCaptureForm({
    variant = 'inline',
    insuranceType,
    source = 'page',
    redirectUrl = '/get-quote',
    showEmail = true,
    showTrustBadges = true,
    buttonText = 'Get My Free Quotes',
    accentColor = 'blue',
    className = ''
}: LeadCaptureFormProps) {
    const [zipCode, setZipCode] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ zip?: string; email?: string }>({});
    const router = useRouter();

    const colors = colorSchemes[accentColor];

    const validateZip = (zip: string) => {
        if (zip.length !== 5) return 'Enter a valid 5-digit ZIP code';
        return undefined;
    };

    const validateEmail = (email: string) => {
        if (!email) return undefined; // Email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Enter a valid email address';
        return undefined;
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const zipError = validateZip(zipCode);
        const emailError = showEmail ? validateEmail(email) : undefined;

        if (zipError || emailError) {
            setErrors({ zip: zipError, email: emailError });
            return;
        }

        setErrors({});
        setIsLoading(true);

        // Track form submission
        trackFormSubmit('lead_capture_form', {
            zip_code: zipCode,
            has_email: !!email,
            insurance_type: insuranceType,
            source: source
        });

        trackCTAClick(buttonText, redirectUrl, source);

        // Build redirect URL with params
        const params = new URLSearchParams();
        params.set('zip', zipCode);
        if (email) params.set('email', encodeURIComponent(email));
        if (insuranceType) params.set('type', insuranceType);
        params.set('src', source);

        // Optional: Send to backend API for lead capture
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zipCode,
                    email: email || null,
                    insuranceType,
                    source
                })
            }).catch(() => { }); // Fire and forget, don't block redirect
        } catch { }

        // Redirect
        router.push(`${redirectUrl}?${params.toString()}`);
    }, [zipCode, email, insuranceType, source, redirectUrl, buttonText, router, showEmail]);

    if (variant === 'compact') {
        return (
            <form onSubmit={handleSubmit} className={`${className}`}>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="ZIP Code"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${colors.focus} ${errors.zip ? 'border-red-500' : 'border-slate-200'}`}
                            maxLength={5}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`${colors.button} text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                    </button>
                </div>
            </form>
        );
    }

    if (variant === 'stacked') {
        return (
            <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
                {/* ZIP Code */}
                <div>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Enter your ZIP code"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                            className={`w-full pl-12 pr-4 py-4 border rounded-xl text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${colors.focus} ${errors.zip ? 'border-red-500' : 'border-slate-200'}`}
                            maxLength={5}
                        />
                    </div>
                    {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                </div>

                {/* Email (optional) */}
                {showEmail && (
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                placeholder="Email (optional - for quote delivery)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-12 pr-4 py-4 border rounded-xl text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${colors.focus} ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full ${colors.button} text-white font-bold text-lg px-8 py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={22} />
                            <span>Finding quotes...</span>
                        </>
                    ) : (
                        <>
                            <span>{buttonText}</span>
                            <ArrowRight size={22} />
                        </>
                    )}
                </button>

                {/* Trust Badges */}
                {showTrustBadges && (
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 pt-2">
                        <div className="flex items-center gap-1.5">
                            <Shield size={14} className={colors.icon} />
                            <span>100% Free</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className={colors.icon} />
                            <span>2-Min Process</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle size={14} className={colors.icon} />
                            <span>No Obligation</span>
                        </div>
                    </div>
                )}
            </form>
        );
    }

    // Default: inline variant
    return (
        <form onSubmit={handleSubmit} className={`${className}`}>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-white rounded-2xl p-2 shadow-2xl shadow-black/10">
                {/* ZIP Code Input */}
                <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="ZIP Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        className={`w-full pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none text-lg rounded-xl ${errors.zip ? 'bg-red-50' : 'bg-slate-50'}`}
                        maxLength={5}
                    />
                </div>

                {/* Email Input (optional) */}
                {showEmail && (
                    <div className="flex-1 relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none text-lg rounded-xl ${errors.email ? 'bg-red-50' : 'bg-slate-50'}`}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={zipCode.length !== 5 || isLoading}
                    className={`${colors.button} disabled:bg-slate-300 text-white font-semibold px-8 py-3.5 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Loading</span>
                        </>
                    ) : (
                        <>
                            <span>{buttonText}</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </div>

            {/* Error messages */}
            {(errors.zip || errors.email) && (
                <div className="mt-2 text-sm text-red-500 text-center">
                    {errors.zip || errors.email}
                </div>
            )}

            {/* Trust Badges */}
            {showTrustBadges && (
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <Shield size={14} className={colors.icon} />
                        <span>100% Free</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className={colors.icon} />
                        <span>2-Min Process</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle size={14} className={colors.icon} />
                        <span>No Obligation</span>
                    </div>
                </div>
            )}
        </form>
    );
}
