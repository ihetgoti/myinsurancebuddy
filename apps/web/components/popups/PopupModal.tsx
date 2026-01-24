'use client';

import { useEffect, useCallback } from 'react';
import { X, Phone, ArrowRight, Gift, Shield, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PopupConfig {
    id: string;
    type: 'scroll' | 'exit_intent' | 'timed' | 'click';
    title: string;
    subtitle?: string;
    description?: string;
    ctaText: string;
    ctaUrl: string;
    secondaryCtaText?: string;
    secondaryCtaUrl?: string;
    phoneNumber?: string;
    imageUrl?: string;
    badgeText?: string;
    accentColor?: 'blue' | 'emerald' | 'orange' | 'purple' | 'red';
    showTrustBadges?: boolean;
    // Trigger settings
    scrollPercentage?: number; // 0-100
    delaySeconds?: number;
    // Display settings
    position?: 'center' | 'bottom-right' | 'bottom-left';
    size?: 'sm' | 'md' | 'lg';
    // Cookie/session settings
    showOncePerSession?: boolean;
    showOncePerDay?: boolean;
    cookieKey?: string;
}

interface PopupModalProps {
    config: PopupConfig;
    isOpen: boolean;
    onClose: () => void;
    onCtaClick?: (popupId: string) => void;
}

const colorSchemes = {
    blue: {
        gradient: 'from-blue-600 to-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        accent: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
        ring: 'ring-blue-500'
    },
    emerald: {
        gradient: 'from-emerald-600 to-emerald-700',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        accent: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
        ring: 'ring-emerald-500'
    },
    orange: {
        gradient: 'from-orange-600 to-orange-700',
        button: 'bg-orange-600 hover:bg-orange-700 text-white',
        accent: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700',
        ring: 'ring-orange-500'
    },
    purple: {
        gradient: 'from-purple-600 to-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        accent: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700',
        ring: 'ring-purple-500'
    },
    red: {
        gradient: 'from-red-600 to-red-700',
        button: 'bg-red-600 hover:bg-red-700 text-white',
        accent: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
        ring: 'ring-red-500'
    }
};

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
};

const positionClasses = {
    center: 'items-center justify-center',
    'bottom-right': 'items-end justify-end p-4 md:p-8',
    'bottom-left': 'items-end justify-start p-4 md:p-8'
};

export default function PopupModal({
    config,
    isOpen,
    onClose,
    onCtaClick
}: PopupModalProps) {
    const colors = colorSchemes[config.accentColor || 'blue'];
    const size = sizeClasses[config.size || 'md'];
    const position = positionClasses[config.position || 'center'];

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleCtaClick = useCallback(() => {
        // Track click event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'popup_cta_click', {
                popup_id: config.id,
                popup_type: config.type,
                cta_url: config.ctaUrl
            });
        }

        // Track with dataLayer for GTM
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: 'popup_cta_click',
                popupId: config.id,
                popupType: config.type,
                ctaUrl: config.ctaUrl
            });
        }

        onCtaClick?.(config.id);

        // Navigate to CTA URL
        if (config.ctaUrl) {
            if (config.ctaUrl.startsWith('tel:')) {
                window.location.href = config.ctaUrl;
            } else {
                window.open(config.ctaUrl, '_blank', 'noopener,noreferrer');
            }
        }

        onClose();
    }, [config, onCtaClick, onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`fixed inset-0 z-50 flex ${position} bg-black/60 backdrop-blur-sm`}
                    onClick={handleBackdropClick}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="popup-title"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`${size} w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative`}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-700 transition-colors shadow-sm"
                            aria-label="Close popup"
                        >
                            <X size={20} />
                        </button>

                        {/* Image header (optional) */}
                        {config.imageUrl && (
                            <div className={`h-32 bg-gradient-to-r ${colors.gradient} relative overflow-hidden`}>
                                <img
                                    src={config.imageUrl}
                                    alt=""
                                    className="w-full h-full object-cover opacity-30"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Shield className="text-white/30" size={64} />
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 md:p-8">
                            {/* Badge */}
                            {config.badgeText && (
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${colors.badge}`}>
                                    <Gift size={14} />
                                    {config.badgeText}
                                </div>
                            )}

                            {/* Title */}
                            <h2
                                id="popup-title"
                                className="text-2xl md:text-3xl font-bold text-slate-900 mb-2"
                            >
                                {config.title}
                            </h2>

                            {/* Subtitle */}
                            {config.subtitle && (
                                <p className={`text-lg font-semibold ${colors.accent} mb-2`}>
                                    {config.subtitle}
                                </p>
                            )}

                            {/* Description */}
                            {config.description && (
                                <p className="text-slate-600 mb-6">
                                    {config.description}
                                </p>
                            )}

                            {/* Phone number display */}
                            {config.phoneNumber && (
                                <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-slate-50 rounded-xl">
                                    <Phone className={colors.accent} size={24} />
                                    <span className="text-2xl font-bold text-slate-900">
                                        {config.phoneNumber}
                                    </span>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleCtaClick}
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${colors.button}`}
                                >
                                    {config.phoneNumber ? <Phone size={20} /> : <ArrowRight size={20} />}
                                    {config.ctaText}
                                </button>

                                {config.secondaryCtaText && config.secondaryCtaUrl && (
                                    <a
                                        href={config.secondaryCtaUrl}
                                        className="block w-full text-center px-6 py-3 rounded-xl font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                    >
                                        {config.secondaryCtaText}
                                    </a>
                                )}
                            </div>

                            {/* Trust badges */}
                            {config.showTrustBadges && (
                                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-200 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Shield size={14} className={colors.accent} />
                                        <span>100% Free</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className={colors.accent} />
                                        <span>No Obligation</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
