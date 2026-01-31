'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Phone, PhoneCall, ArrowRight, FileText, Loader2 } from 'lucide-react';

interface MarketCallScriptProps {
    scriptUrl?: string;           // Marketcall script URL
    scriptCode?: string;          // Inline script code
    campaignId?: string;          // Campaign ID
    fallbackPhone?: string;       // Fallback if script fails
    formUrl?: string;             // Form URL (optional)
    variant?: 'phone' | 'form' | 'both';
    className?: string;
}

/**
 * MarketCall Script Component
 * Loads Marketcall JavaScript that dynamically inserts phone numbers
 * 
 * How it works:
 * 1. Loads the Marketcall script
 * 2. Script fetches the correct phone number for this page
 * 3. Number is displayed automatically
 * 4. If script fails, shows fallback number
 */
export default function MarketCallScript({
    scriptUrl,
    scriptCode,
    campaignId,
    fallbackPhone,
    formUrl,
    variant = 'both',
    className = ''
}: MarketCallScriptProps) {
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState(false);

    useEffect(() => {
        // Wait for script to load and set phone number
        const checkForPhoneNumber = () => {
            // Marketcall typically sets a global variable or modifies the DOM
            // Check various possible locations
            const mc = (window as any).marketcall;
            const mcPhone = (window as any).marketcallPhone;
            const mcNumber = (window as any).marketcall_number;
            
            // Try to get number from Marketcall's global object
            const number = mc?.phone || mc?.number || mcPhone || mcNumber;
            
            if (number) {
                setPhoneNumber(number);
            }
        };

        // Check immediately and after delay
        checkForPhoneNumber();
        const interval = setInterval(checkForPhoneNumber, 500);
        
        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(interval), 5000);

        return () => clearInterval(interval);
    }, [scriptLoaded]);

    const displayPhone = phoneNumber || fallbackPhone;
    const hasPhone = variant === 'phone' || variant === 'both';
    const hasForm = (variant === 'form' || variant === 'both') && formUrl;

    const handlePhoneClick = () => {
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: 'phone_click',
                phone_number: displayPhone,
                campaign_id: campaignId,
            });
        }
    };

    const handleFormClick = () => {
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: 'form_redirect_click',
                form_url: formUrl,
                campaign_id: campaignId,
            });
        }
    };

    return (
        <>
            {/* Load Marketcall Script */}
            {scriptUrl && (
                <Script
                    src={scriptUrl}
                    strategy="afterInteractive"
                    onLoad={() => setScriptLoaded(true)}
                    onError={() => setScriptError(true)}
                />
            )}
            
            {/* Inline Script */}
            {scriptCode && (
                <Script
                    id="marketcall-inline"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{ __html: scriptCode }}
                    onLoad={() => setScriptLoaded(true)}
                    onError={() => setScriptError(true)}
                />
            )}

            <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg ${className}`}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <PhoneCall size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-blue-100">Get Your Free Quote</p>
                        <p className="text-lg font-bold">Speak with a Licensed Agent</p>
                    </div>
                </div>

                {/* Phone Number */}
                {hasPhone && displayPhone && (
                    <a
                        href={`tel:${displayPhone.replace(/[^0-9]/g, '')}`}
                        className="block w-full bg-white text-blue-600 font-bold text-center text-2xl py-4 px-6 rounded-lg
                                 hover:bg-blue-50 transition-colors mb-3 shadow-md"
                        data-campaign-id={campaignId}
                        onClick={handlePhoneClick}
                    >
                        <Phone className="inline mr-2 mb-1" size={28} />
                        {displayPhone}
                    </a>
                )}

                {/* Loading State */}
                {hasPhone && !displayPhone && !scriptError && (
                    <div className="block w-full bg-white/20 text-white font-bold text-center text-xl py-4 px-6 rounded-lg mb-3">
                        <Loader2 className="inline mr-2 animate-spin" size={24} />
                        Loading number...
                    </div>
                )}

                {/* Error State - No fallback */}
                {hasPhone && !displayPhone && scriptError && (
                    <div className="block w-full bg-red-500/20 text-white font-bold text-center text-lg py-4 px-6 rounded-lg mb-3">
                        <Phone className="inline mr-2" size={24} />
                        Call Now
                    </div>
                )}

                {/* Form Redirect Button */}
                {hasForm && (
                    <a
                        href={formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-white text-blue-600 font-semibold text-center py-3 px-6 rounded-lg
                                 hover:bg-blue-50 transition-colors shadow-md"
                        onClick={handleFormClick}
                    >
                        <FileText className="inline mr-2 mb-1" size={20} />
                        Complete Online Form
                        <ArrowRight className="inline ml-2 mb-1" size={16} />
                    </a>
                )}

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>100% Free</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>2-Min Process</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>No Obligation</span>
                    </div>
                </div>
            </div>
        </>
    );
}
