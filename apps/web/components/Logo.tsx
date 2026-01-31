'use client';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'full' | 'icon' | 'wordmark';
    colorScheme?: 'light' | 'dark' | 'auto';
}

const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 44, text: 'text-2xl' },
    xl: { icon: 52, text: 'text-3xl' },
};

export default function Logo({ 
    className = '', 
    size = 'md', 
    variant = 'full',
    colorScheme = 'light'
}: LogoProps) {
    const { icon: iconSize, text: textSize } = sizes[size];
    
    const gradientId = `logoGrad-${Math.random().toString(36).substr(2, 9)}`;
    
    const IconSvg = () => (
        <svg 
            width={iconSize} 
            height={iconSize} 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id={`${gradientId}-buddy`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
            </defs>
            
            {/* Main Shield - Insurance */}
            <path 
                d="M20 6L6 11V20C6 29.5 12 38 20 42C28 38 34 29.5 34 20V11L20 6Z" 
                fill={`url(#${gradientId})`}
            />
            
            {/* Buddy Shield - smaller, companion */}
            <path 
                d="M38 14L28 17.5V24C28 31 33 37 38 40C43 37 48 31 48 24V17.5L38 14Z" 
                fill={`url(#${gradientId}-buddy)`}
                opacity="0.9"
            />
            
            {/* Checkmark on main shield */}
            <path 
                d="M14 20L18 24L26 16" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none"
            />
            
            {/* Smaller checkmark on buddy shield */}
            <path 
                d="M34 22L36.5 24.5L41 20" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );

    if (variant === 'icon') {
        return <IconSvg />;
    }

    const isDark = colorScheme === 'dark';
    const textColor = isDark ? 'text-white' : 'text-slate-800';
    
    const showIcon = variant === 'full';
    const showText = variant === 'full' || variant === 'wordmark';

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            {showIcon && <IconSvg />}
            
            {showText && (
                <div className="flex flex-col leading-none">
                    <span className={`font-extrabold ${textSize} tracking-tight ${textColor}`}>
                        MyInsurance<span className="text-blue-500">Buddies</span>
                    </span>
                    {size !== 'sm' && (
                        <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'} tracking-wider uppercase mt-0.5`}>
                            Your Insurance Buddy
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// Favicon - simplified single shield
export function Favicon({ size = 32 }: { size?: number }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
            </defs>
            <path 
                d="M24 4L6 11V22C6 34.15 13.8 44.6 24 48C34.2 44.6 42 34.15 42 22V11L24 4Z" 
                fill="url(#favGrad)"
            />
            <path 
                d="M17 24L22 29L31 19" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );
}
