import { Shield, CheckCircle, Clock, Lock, Award, Users, Star, Phone } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TrustBadge {
    icon: 'shield' | 'check' | 'clock' | 'lock' | 'award' | 'users' | 'star' | 'phone';
    text: string;
}

interface TrustStat {
    value: string;
    label: string;
}

interface TrustSignalsProps {
    badges?: TrustBadge[];
    stats?: TrustStat[];
    variant?: 'horizontal' | 'vertical' | 'compact';
    accentColor?: 'blue' | 'emerald' | 'orange' | 'slate';
    className?: string;
}

const iconMap: Record<string, LucideIcon> = {
    shield: Shield,
    check: CheckCircle,
    clock: Clock,
    lock: Lock,
    award: Award,
    users: Users,
    star: Star,
    phone: Phone
};

const colorMap = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    orange: 'text-orange-600',
    slate: 'text-slate-600'
};

const defaultBadges: TrustBadge[] = [
    { icon: 'shield', text: 'Compare 100+ Companies' },
    { icon: 'check', text: 'Free Quotes' },
    { icon: 'clock', text: '5-Minute Process' },
    { icon: 'lock', text: 'Secure & Private' }
];

const defaultStats: TrustStat[] = [
    { value: '1M+', label: 'Quotes Generated' },
    { value: '4.9', label: 'Customer Rating' },
    { value: '50+', label: 'Insurance Partners' }
];

export default function TrustSignals({
    badges = defaultBadges,
    stats,
    variant = 'horizontal',
    accentColor = 'blue',
    className = ''
}: TrustSignalsProps) {
    const iconColor = colorMap[accentColor];

    if (variant === 'compact') {
        return (
            <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
                {badges.map((badge, index) => {
                    const Icon = iconMap[badge.icon];
                    return (
                        <div key={index} className="flex items-center gap-1.5 text-slate-600">
                            <Icon size={16} className={iconColor} />
                            <span>{badge.text}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (variant === 'vertical') {
        return (
            <div className={`space-y-6 ${className}`}>
                <div className="grid grid-cols-2 gap-4">
                    {badges.map((badge, index) => {
                        const Icon = iconMap[badge.icon];
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                            >
                                <div className={`${iconColor}`}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">{badge.text}</span>
                            </div>
                        );
                    })}
                </div>

                {stats && stats.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Default horizontal variant
    return (
        <div className={`${className}`}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {badges.map((badge, index) => {
                    const Icon = iconMap[badge.icon];
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-slate-600"
                        >
                            <Icon size={18} className={iconColor} />
                            <span className="text-sm font-medium">{badge.text}</span>
                        </div>
                    );
                })}
            </div>

            {stats && stats.length > 0 && (
                <div className="flex flex-wrap justify-center gap-8 mt-6 pt-6 border-t border-slate-200">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
