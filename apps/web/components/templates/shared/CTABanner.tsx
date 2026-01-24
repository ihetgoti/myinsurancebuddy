import Link from 'next/link';
import { Phone, ArrowRight, Shield, Clock, Star } from 'lucide-react';

interface CTABannerProps {
    title?: string;
    subtitle?: string;
    phoneNumber?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    accentColor?: 'blue' | 'emerald' | 'orange' | 'purple';
    showTrustBadges?: boolean;
    urgencyText?: string;
    className?: string;
}

const colorSchemes = {
    blue: {
        gradient: 'from-blue-600 to-blue-700',
        button: 'bg-white text-blue-600 hover:bg-blue-50',
        secondary: 'border-white/30 text-white hover:bg-white/10'
    },
    emerald: {
        gradient: 'from-emerald-600 to-emerald-700',
        button: 'bg-white text-emerald-600 hover:bg-emerald-50',
        secondary: 'border-white/30 text-white hover:bg-white/10'
    },
    orange: {
        gradient: 'from-orange-600 to-orange-700',
        button: 'bg-white text-orange-600 hover:bg-orange-50',
        secondary: 'border-white/30 text-white hover:bg-white/10'
    },
    purple: {
        gradient: 'from-purple-600 to-purple-700',
        button: 'bg-white text-purple-600 hover:bg-purple-50',
        secondary: 'border-white/30 text-white hover:bg-white/10'
    }
};

export default function CTABanner({
    title = 'Ready to Save on Insurance?',
    subtitle = 'Speak with a licensed agent and get a free quote in minutes.',
    phoneNumber = '1-855-205-2412',
    primaryButtonText = 'Call Now',
    primaryButtonHref,
    secondaryButtonText = 'Compare Quotes',
    secondaryButtonHref = '/get-quote',
    accentColor = 'blue',
    showTrustBadges = true,
    urgencyText,
    className = ''
}: CTABannerProps) {
    const colors = colorSchemes[accentColor];
    const phoneLink = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;

    return (
        <section className={`py-12 ${className}`}>
            <div className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-8 md:p-12 text-white`}>
                <div className="max-w-4xl mx-auto text-center">
                    {urgencyText && (
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                            <Clock size={14} />
                            {urgencyText}
                        </div>
                    )}

                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
                    <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">{subtitle}</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <a
                            href={primaryButtonHref || phoneLink}
                            className={`
                                inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg
                                transition-all duration-200 shadow-lg hover:shadow-xl
                                ${colors.button}
                            `}
                        >
                            <Phone size={20} />
                            {primaryButtonText}
                            {!primaryButtonHref && (
                                <span className="text-sm font-normal opacity-80">({phoneNumber})</span>
                            )}
                        </a>

                        {secondaryButtonHref && (
                            <Link
                                href={secondaryButtonHref}
                                className={`
                                    inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                                    border-2 transition-all duration-200
                                    ${colors.secondary}
                                `}
                            >
                                {secondaryButtonText}
                                <ArrowRight size={18} />
                            </Link>
                        )}
                    </div>

                    {showTrustBadges && (
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                            <div className="flex items-center gap-1.5">
                                <Shield size={16} />
                                <span>100% Free</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={16} />
                                <span>5-Min Process</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star size={16} />
                                <span>4.9/5 Rating</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
