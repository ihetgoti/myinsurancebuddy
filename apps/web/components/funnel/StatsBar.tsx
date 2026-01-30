'use client';

import { useEffect, useState, useRef } from 'react';
import { Shield, Users, Award, Clock, TrendingDown, Star } from 'lucide-react';

interface StatItem {
    icon: React.ReactNode;
    value: string;
    label: string;
    suffix?: string;
    prefix?: string;
}

const stats: StatItem[] = [
    {
        icon: <Shield className="w-6 h-6" />,
        value: '100',
        suffix: '+',
        label: 'Insurance Partners',
    },
    {
        icon: <Users className="w-6 h-6" />,
        value: '8',
        suffix: 'M+',
        label: 'Happy Customers',
    },
    {
        icon: <Award className="w-6 h-6" />,
        value: '50',
        suffix: '',
        label: 'States Licensed',
    },
    {
        icon: <TrendingDown className="w-6 h-6" />,
        value: '867',
        prefix: '$',
        label: 'Average Savings',
    },
    {
        icon: <Clock className="w-6 h-6" />,
        value: '2',
        suffix: ' min',
        label: 'To Get Quotes',
    },
    {
        icon: <Star className="w-6 h-6" />,
        value: '4.8',
        suffix: '/5',
        label: 'Customer Rating',
    },
];

function AnimatedCounter({ 
    value, 
    prefix = '', 
    suffix = '', 
    inView 
}: { 
    value: string; 
    prefix?: string; 
    suffix?: string;
    inView: boolean;
}) {
    const [count, setCount] = useState(0);
    const numericValue = parseFloat(value);
    const isDecimal = value.includes('.');
    
    useEffect(() => {
        if (!inView) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = numericValue / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                setCount(numericValue);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, duration / steps);
        
        return () => clearInterval(timer);
    }, [inView, numericValue]);
    
    const displayValue = isDecimal 
        ? count.toFixed(1) 
        : Math.floor(count).toString();
    
    return (
        <span>
            {prefix}{displayValue}{suffix}
        </span>
    );
}

export default function StatsBar() {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        
        if (ref.current) {
            observer.observe(ref.current);
        }
        
        return () => observer.disconnect();
    }, []);
    
    return (
        <section 
            ref={ref}
            className="py-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="text-center group"
                            style={{ 
                                animationDelay: `${index * 100}ms`,
                                opacity: inView ? 1 : 0,
                                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                                transition: `all 0.6s ease-out ${index * 100}ms`
                            }}
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-blue-300 mb-3 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                {stat.icon}
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                                <AnimatedCounter 
                                    value={stat.value} 
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                    inView={inView}
                                />
                            </div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
