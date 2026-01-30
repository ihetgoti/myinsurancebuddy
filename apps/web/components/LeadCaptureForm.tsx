'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Mail, ArrowRight, Loader2, Shield, Clock, CheckCircle, Phone } from 'lucide-react';
import { trackFormSubmit, trackCTAClick } from './GTMDataLayer';

interface LeadCaptureFormProps {
    variant?: 'inline' | 'stacked' | 'compact' | 'hero' | 'sidebar';
    insuranceType?: string;
    state?: string;
    source?: string;
    redirectUrl?: string;
    showEmail?: boolean;
    showPhone?: boolean;
    showTrustBadges?: boolean;
    buttonText?: string;
    accentColor?: 'blue' | 'emerald' | 'orange' | 'purple';
    className?: string;
    title?: string;
    subtitle?: string;
}

const colorSchemes = {
    blue: {
        button: 'bg-blue-600 hover:bg-blue-700',
        focus: 'focus:ring-blue-500',
        icon: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600'
    },
    emerald: {
        button: 'bg-emerald-600 hover:bg-emerald-700',
        focus: 'focus:ring-emerald-500',
        icon: 'text-emerald-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-600'
    },
    orange: {
        button: 'bg-orange-600 hover:bg-orange-700',
        focus: 'focus:ring-orange-500',
        icon: 'text-orange-500',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-600'
    },
    purple: {
        button: 'bg-purple-600 hover:bg-purple-700',
        focus: 'focus:ring-purple-500',
        icon: 'text-purple-500',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600'
    }
};

export default function LeadCaptureForm({
    variant = 'inline',
    insuranceType,
    state,
    source = 'page',
    redirectUrl = '/get-quote',
    showEmail = true,
    showPhone = false,
    showTrustBadges = true,
    buttonText = 'Get Free Quotes',
    accentColor = 'blue',
    className = '',
    title,
    subtitle
}: LeadCaptureFormProps) {
    const [zipCode, setZipCode] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ zip?: string; email?: string; phone?: string }>({});
    const router = useRouter();

    const colors = colorSchemes[accentColor];

    const validateZip = (zip: string) => {
        if (zip.length !== 5) return 'Enter a valid 5-digit ZIP code';
        return undefined;
    };

    const validateEmail = (email: string) => {
        if (!email) return undefined;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Enter a valid email address';
        return undefined;
    };

    const validatePhone = (phone: string) => {
        if (!phone) return undefined;
        const phoneRegex = /^\d{10}$/;
        const digitsOnly = phone.replace(/\D/g, '');
        if (!phoneRegex.test(digitsOnly)) return 'Enter a valid 10-digit phone number';
        return undefined;
    };

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        const zipError = validateZip(zipCode);
        const emailError = showEmail ? validateEmail(email) : undefined;
        const phoneError = showPhone ? validatePhone(phone) : undefined;

        if (zipError || emailError || phoneError) {
            setErrors({ zip: zipError, email: emailError, phone: phoneError });
            return;
        }

        setErrors({});
        setIsLoading(true);

        // Track the click
        trackCTAClick(buttonText, 'marketcall_redirect', source);

        try {
            // Try to get MarketCall offer first
            const params = new URLSearchParams();
            if (insuranceType) params.set('insuranceType', insuranceType);
            if (state) params.set('state', state);
            params.set('zip', zipCode);
            if (email) params.set('email', email);

            const response = await fetch(`/api/redirect-offer?${params.toString()}`);
            const data = await response.json();

            if (data.success && data.redirectUrl) {
                // Track successful redirect
                trackFormSubmit('lead_capture_form', {
                    zip_code: zipCode,
                    has_email: !!email,
                    insurance_type: insuranceType,
                    source: source,
                    redirect_to: 'marketcall',
                    offer_name: data.offer?.name
                });

                // Redirect to MarketCall offer
                window.location.href = data.redirectUrl;
                return;
            }
        } catch (error) {
            console.log('No MarketCall offer found, falling back to local redirect');
        }

        // Fallback: redirect to local get-quote page
        const fallbackParams = new URLSearchParams();
        fallbackParams.set('zip', zipCode);
        if (email) fallbackParams.set('email', encodeURIComponent(email));
        if (phone) fallbackParams.set('phone', encodeURIComponent(phone.replace(/\D/g, '')));
        if (insuranceType) fallbackParams.set('type', insuranceType);
        fallbackParams.set('src', source);

        // Track fallback
        trackFormSubmit('lead_capture_form', {
            zip_code: zipCode,
            has_email: !!email,
            insurance_type: insuranceType,
            source: source,
            redirect_to: 'local'
        });

        router.push(`${redirectUrl}?${fallbackParams.toString()}`);
    }, [zipCode, email, phone, insuranceType, state, source, redirectUrl, buttonText, router, showEmail, showPhone]);

    // Sidebar variant
    if (variant === 'sidebar') {
        return (
            <div className={`bg-white rounded-xl p-6 shadow-lg border border-slate-200 ${className}`}>
                {title && (
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP Code</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="12345"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${colors.focus} focus:border-transparent ${errors.zip ? 'border-red-500' : 'border-slate-200'}`}
                                maxLength={5}
                            />
                        </div>
                        {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                    </div>

                    {showEmail && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email (optional)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${colors.focus} focus:border-transparent ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    )}

                    {showPhone && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone (optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    placeholder="(555) 123-4567"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${colors.focus} focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${colors.button} text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Finding best offer...</span>
                            </>
                        ) : (
                            <>
                                <span>{buttonText}</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {showTrustBadges && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <Shield size={12} className={colors.icon} /> Free
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} className={colors.icon} /> 2-Min
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle size={12} className={colors.icon} /> No Spam
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Hero variant - clean, professional form
    if (variant === 'hero') {
        return (
            <div className={`bg-white rounded-xl p-2 shadow-lg border border-slate-200 ${className}`}>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="ZIP Code"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${colors.focus} focus:bg-white ${errors.zip ? 'border-red-500' : 'border-slate-200'}`}
                            maxLength={5}
                        />
                    </div>

                    {showEmail && (
                        <div className="flex-1 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                placeholder="Email (optional)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${colors.focus} focus:bg-white ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || zipCode.length !== 5}
                        className={`${colors.button} disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap`}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {buttonText}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {(errors.zip || errors.email || errors.phone) && (
                    <div className="mt-2 px-2">
                        {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>
                )}
            </div>
        );
    }

    // Stacked variant
    if (variant === 'stacked') {
        return (
            <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full ${colors.button} text-white font-bold text-lg px-8 py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
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

    // Compact variant
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

    // Default: inline variant
    return (
        <form onSubmit={handleSubmit} className={`${className}`}>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-white rounded-xl p-2 shadow-lg border border-slate-200">
                <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="ZIP Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        className={`w-full pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none text-lg rounded-lg ${errors.zip ? 'bg-red-50' : 'bg-slate-50'}`}
                        maxLength={5}
                    />
                </div>

                {showEmail && (
                    <div className="flex-1 relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none text-lg rounded-lg ${errors.email ? 'bg-red-50' : 'bg-slate-50'}`}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={zipCode.length !== 5 || isLoading}
                    className={`${colors.button} disabled:bg-slate-300 text-white font-semibold px-8 py-3.5 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap`}
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

            {(errors.zip || errors.email || errors.phone) && (
                <div className="mt-2 text-sm text-red-500 text-center">
                    {errors.zip || errors.email || errors.phone}
                </div>
            )}

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
