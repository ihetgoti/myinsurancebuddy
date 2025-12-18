'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface State {
    id: string;
    name: string;
    slug: string;
    country: { code: string };
}

interface HeaderProps {
    insuranceTypes?: InsuranceType[];
    states?: State[];
}

export default function Header({ insuranceTypes = [], states = [] }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    // Popular states for quick access
    const popularStates = states.slice(0, 10);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white shadow-md'
                : 'bg-white border-b border-gray-200'
                }`}>
                {/* Top Bar - Minimalist */}
                <div className="bg-slate-900 text-white py-2">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between text-xs font-medium tracking-wide">
                            <div className="flex items-center gap-3 md:gap-6">
                                <span className="flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    1-800-INSURE
                                </span>
                                <span className="hidden md:flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Available 24/7
                                </span>
                            </div>
                            <div className="flex items-center gap-3 md:gap-6">
                                <Link href="/about" className="hover:text-gray-300 transition-colors">About Us</Link>
                                <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
                            <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                                InsuranceBuddies
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {insuranceTypes.slice(0, 5).map((type) => (
                                <div
                                    key={type.id}
                                    className="relative"
                                    onMouseEnter={() => setActiveDropdown(type.id)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={`/${type.slug}`}
                                        className={`flex items-center gap-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${activeDropdown === type.id
                                            ? 'text-slate-900 bg-slate-50'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>{type.name.replace(' Insurance', '')}</span>
                                        <svg className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === type.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Link>

                                    {/* Minimalist Mega Menu */}
                                    {activeDropdown === type.id && (
                                        <div className="absolute top-full left-0 pt-2 w-[600px]">
                                            <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-6 grid grid-cols-3 gap-8">
                                                <div className="col-span-2 grid grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Popular States</h4>
                                                        <ul className="space-y-3">
                                                            {popularStates.slice(0, 5).map(state => (
                                                                <li key={state.id}>
                                                                    <Link
                                                                        href={`/${type.slug}/${state.country.code}/${state.slug}`}
                                                                        className="text-slate-600 hover:text-slate-900 text-sm block"
                                                                    >
                                                                        {state.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Locations</h4>
                                                        <ul className="space-y-3">
                                                            {popularStates.slice(5, 10).map(state => (
                                                                <li key={state.id}>
                                                                    <Link
                                                                        href={`/${type.slug}/${state.country.code}/${state.slug}`}
                                                                        className="text-slate-600 hover:text-slate-900 text-sm block"
                                                                    >
                                                                        {state.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-5">
                                                    <h4 className="text-sm font-semibold text-slate-900 mb-2">{type.name} Coverage</h4>
                                                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                                        Find the best rates and requirements for {type.name.toLowerCase()}.
                                                    </p>
                                                    <Link
                                                        href={`/${type.slug}`}
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                    >
                                                        View All Info
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Link
                                href="/resources"
                                className="px-4 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                Resources
                            </Link>
                        </nav>

                        {/* Search & CTA */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link
                                href="/get-quote"
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                            >
                                Get a Quote
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
                        >
                            <span className="sr-only">Open menu</span>
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-[112px] left-0 right-0 bg-white border-b shadow-lg border-gray-100 p-4 h-[calc(100vh-112px)] overflow-y-auto">
                        <nav className="space-y-4 pb-20">
                            {insuranceTypes.map(type => (
                                <Link
                                    key={type.id}
                                    href={`/${type.slug}`}
                                    className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {type.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-100">
                                <Link
                                    href="/get-quote"
                                    className="block w-full text-center bg-slate-900 text-white px-4 py-3 rounded-lg font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Coverage
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Spacer for fixed header */}
            <div className="h-[112px]"></div>
        </>
    );
}
