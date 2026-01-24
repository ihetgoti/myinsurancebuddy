import { Shield, Car, Home, Heart, Umbrella, AlertTriangle, DollarSign, Users, Briefcase } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CoverageCardProps {
    title: string;
    description: string;
    icon?: 'shield' | 'car' | 'home' | 'heart' | 'umbrella' | 'alert' | 'dollar' | 'users' | 'briefcase';
    isRequired?: boolean;
    limit?: string;
    deductible?: string;
    accentColor?: 'blue' | 'emerald' | 'orange' | 'purple' | 'red' | 'slate';
    variant?: 'default' | 'compact' | 'detailed';
    className?: string;
}

const iconMap: Record<string, LucideIcon> = {
    shield: Shield,
    car: Car,
    home: Home,
    heart: Heart,
    umbrella: Umbrella,
    alert: AlertTriangle,
    dollar: DollarSign,
    users: Users,
    briefcase: Briefcase
};

const colorSchemes = {
    blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100'
    },
    emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        iconBg: 'bg-emerald-100'
    },
    orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        iconBg: 'bg-orange-100'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100'
    },
    red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        iconBg: 'bg-red-100'
    },
    slate: {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        icon: 'text-slate-600',
        iconBg: 'bg-slate-100'
    }
};

export default function CoverageCard({
    title,
    description,
    icon = 'shield',
    isRequired = false,
    limit,
    deductible,
    accentColor = 'blue',
    variant = 'default',
    className = ''
}: CoverageCardProps) {
    const Icon = iconMap[icon];
    const colors = colorSchemes[accentColor];

    if (variant === 'compact') {
        return (
            <div className={`flex items-start gap-3 p-4 ${colors.bg} rounded-lg ${className}`}>
                <div className={`${colors.iconBg} p-2 rounded-lg ${colors.icon}`}>
                    <Icon size={18} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{title}</h4>
                        {isRequired && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium uppercase">
                                Required
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-600">{description}</p>
                </div>
            </div>
        );
    }

    if (variant === 'detailed') {
        return (
            <div className={`border ${colors.border} rounded-xl overflow-hidden ${className}`}>
                <div className={`${colors.bg} px-5 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className={`${colors.iconBg} p-2.5 rounded-lg ${colors.icon}`}>
                            <Icon size={22} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{title}</h4>
                            {isRequired && (
                                <span className="text-xs text-red-600 font-medium">State Required</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="px-5 py-4 bg-white">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{description}</p>
                    {(limit || deductible) && (
                        <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100">
                            {limit && (
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">Coverage Limit</p>
                                    <p className="font-semibold text-slate-900">{limit}</p>
                                </div>
                            )}
                            {deductible && (
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">Deductible</p>
                                    <p className="font-semibold text-slate-900">{deductible}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default variant
    return (
        <div className={`${colors.bg} rounded-xl p-5 border ${colors.border} ${className}`}>
            <div className="flex items-start gap-4">
                <div className={`${colors.iconBg} p-3 rounded-xl ${colors.icon} flex-shrink-0`}>
                    <Icon size={24} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-slate-900">{title}</h4>
                        {isRequired && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                Required
                            </span>
                        )}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
                    {(limit || deductible) && (
                        <div className="flex gap-4 mt-3 pt-3 border-t border-slate-200/50">
                            {limit && (
                                <div className="text-sm">
                                    <span className="text-slate-500">Limit: </span>
                                    <span className="font-semibold text-slate-800">{limit}</span>
                                </div>
                            )}
                            {deductible && (
                                <div className="text-sm">
                                    <span className="text-slate-500">Deductible: </span>
                                    <span className="font-semibold text-slate-800">{deductible}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
