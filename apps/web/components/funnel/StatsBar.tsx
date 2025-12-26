'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
    value: string;
    label: string;
    suffix?: string;
}

interface StatsBarProps {
    customStats?: Stat[];
}

export default function StatsBar({ customStats }: StatsBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const defaultStats: Stat[] = [
        { value: '500K', label: 'Customers Helped', suffix: '+' },
        { value: '$847', label: 'Avg. Annual Savings' },
        { value: '4.9', label: 'Customer Rating', suffix: '/5' },
        { value: '50', label: 'States Covered', suffix: '+' },
    ];

    const stats = customStats || defaultStats;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-16 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {/* Animated pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`text-center transform transition-all duration-700 ${isVisible
                                    ? 'translate-y-0 opacity-100'
                                    : 'translate-y-8 opacity-0'
                                }`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                {stat.value}
                                {stat.suffix && (
                                    <span className="text-blue-200">{stat.suffix}</span>
                                )}
                            </div>
                            <div className="text-blue-100 text-sm md:text-base font-medium uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
