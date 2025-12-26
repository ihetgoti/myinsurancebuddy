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

    const popularStates = states.slice(0, 10);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white shadow-lg'
                : 'bg-white'
                }`}>
                {/* Top Contact Bar - Compare.com Style */}
                <div className="bg-[#0B1B34] text-white py-2">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-6">
                                <a href="tel:1-855-205-2412" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-medium">Call us 1-855-205-2412</span>
                                </a>
                                <a href="sms:1-855-627-3925" className="hidden md:flex items-center gap-2 hover:text-teal-400 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>Text us 1-855-627-3925</span>
                                </a>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="hover:text-teal-400 transition-colors font-medium">
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="container mx-auto px-4 border-b border-slate-100">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center rounded-xl shadow-lg shadow-teal-500/20">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                InsuranceBuddies
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {/* Auto Insurance Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('auto')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeDropdown === 'auto'
                                    ? 'text-teal-600 bg-teal-50'
                                    : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                                    }`}>
                                    Auto Insurance
                                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'auto' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {activeDropdown === 'auto' && (
                                    <div className="absolute top-full left-0 pt-2 w-[700px]">
                                        <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-6 grid grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Compare Quotes</h4>
                                                <ul className="space-y-3">
                                                    <li><Link href="/car-insurance" className="text-slate-700 hover:text-teal-600 font-medium block">Compare Car Insurance Rates</Link></li>
                                                    <li><Link href="/car-insurance/calculator" className="text-slate-700 hover:text-teal-600 font-medium block">Car Insurance Calculator</Link></li>
                                                    <li><Link href="/car-insurance/cheapest" className="text-slate-700 hover:text-teal-600 font-medium block">Cheapest Car Insurance Companies</Link></li>
                                                    <li><Link href="/compare" className="text-slate-700 hover:text-teal-600 font-medium block">Best Car Insurance Comparison Sites</Link></li>
                                                    <li><Link href="/car-insurance/best" className="text-slate-700 hover:text-teal-600 font-medium block">Best Car Insurance Companies</Link></li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Car Insurance Guides</h4>
                                                <ul className="space-y-3">
                                                    <li><Link href="/states" className="text-slate-700 hover:text-teal-600 font-medium block">Car Insurance Rates by State</Link></li>
                                                    <li><Link href="/guides/how-to-shop" className="text-slate-700 hover:text-teal-600 font-medium block">How to Shop for Car Insurance</Link></li>
                                                    <li><Link href="/guides/reviews" className="text-slate-700 hover:text-teal-600 font-medium block">Car Insurance Company Reviews</Link></li>
                                                    <li><Link href="/guides/discounts" className="text-slate-700 hover:text-teal-600 font-medium block">Car Insurance Discounts</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Home Insurance Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('home')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeDropdown === 'home'
                                    ? 'text-teal-600 bg-teal-50'
                                    : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                                    }`}>
                                    Home Insurance
                                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'home' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {activeDropdown === 'home' && (
                                    <div className="absolute top-full left-0 pt-2 w-[350px]">
                                        <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-6">
                                            <ul className="space-y-3">
                                                <li><Link href="/home-insurance" className="text-slate-700 hover:text-teal-600 font-medium block">Compare Home Insurance Quotes</Link></li>
                                                <li><Link href="/home-insurance/best" className="text-slate-700 hover:text-teal-600 font-medium block">Best Home Insurance Companies</Link></li>
                                                <li><Link href="/home-insurance/cost" className="text-slate-700 hover:text-teal-600 font-medium block">Average Cost of Home Insurance</Link></li>
                                                <li><Link href="/home-insurance/how-much" className="text-slate-700 hover:text-teal-600 font-medium block">How Much Home Insurance Do You Need?</Link></li>
                                                <li><Link href="/home-insurance/cheap" className="text-slate-700 hover:text-teal-600 font-medium block">Cheap Home Insurance</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Other Insurance Types */}
                            {insuranceTypes.filter(t => !['car-insurance', 'home-insurance'].includes(t.slug)).slice(0, 3).map((type) => (
                                <Link
                                    key={type.id}
                                    href={`/${type.slug}`}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all"
                                >
                                    {type.name.replace(' Insurance', '')}
                                </Link>
                            ))}

                            {/* About Us Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('about')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeDropdown === 'about'
                                    ? 'text-teal-600 bg-teal-50'
                                    : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                                    }`}>
                                    About Us
                                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {activeDropdown === 'about' && (
                                    <div className="absolute top-full right-0 pt-2 w-[250px]">
                                        <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-6">
                                            <ul className="space-y-3">
                                                <li><Link href="/about" className="text-slate-700 hover:text-teal-600 font-medium block">About Us</Link></li>
                                                <li><Link href="/about#team" className="text-slate-700 hover:text-teal-600 font-medium block">Our Team</Link></li>
                                                <li><Link href="/about#how-it-works" className="text-slate-700 hover:text-teal-600 font-medium block">How It Works</Link></li>
                                                <li><Link href="/contact" className="text-slate-700 hover:text-teal-600 font-medium block">Contact Us</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* CTA Button */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link
                                href="/get-quote"
                                className="bg-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                            >
                                Get Quotes
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
                        >
                            <span className="sr-only">Open menu</span>
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-xl p-4 max-h-[80vh] overflow-y-auto">
                        <nav className="space-y-2">
                            <Link href="/car-insurance" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Auto Insurance
                            </Link>
                            <Link href="/home-insurance" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Home Insurance
                            </Link>
                            {insuranceTypes.slice(0, 4).map(type => (
                                <Link
                                    key={type.id}
                                    href={`/${type.slug}`}
                                    className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {type.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <Link href="/about" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                                    About Us
                                </Link>
                                <Link href="/contact" className="block p-3 rounded-lg hover:bg-slate-50 text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                                    Contact
                                </Link>
                            </div>
                            <div className="pt-4">
                                <Link
                                    href="/get-quote"
                                    className="block w-full text-center bg-teal-600 text-white px-4 py-3 rounded-full font-semibold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Quotes
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Spacer for fixed header */}
            <div className="h-[104px]"></div>
        </>
    );
}
