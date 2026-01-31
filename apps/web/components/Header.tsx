'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Phone, Car, Home, Heart, Stethoscope, Briefcase, Dog, Shield, Globe } from 'lucide-react';
import Logo from './Logo';

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

    const insuranceCategories = [
        { name: 'Auto Insurance', href: '/car-insurance', icon: <Car className="w-5 h-5" />, desc: 'Compare rates & save' },
        { name: 'Home Insurance', href: '/home-insurance', icon: <Home className="w-5 h-5" />, desc: 'Protect your property' },
        { name: 'Life Insurance', href: '/life-insurance', icon: <Heart className="w-5 h-5" />, desc: 'Secure your family' },
        { name: 'Health Insurance', href: '/health-insurance', icon: <Stethoscope className="w-5 h-5" />, desc: 'Medical coverage' },
        { name: 'Business', href: '/business-insurance', icon: <Briefcase className="w-5 h-5" />, desc: 'Liability & assets' },
        { name: 'Pet Insurance', href: '/pet-insurance', icon: <Dog className="w-5 h-5" />, desc: 'For furry friends' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${scrolled
                        ? 'h-16 border-b border-slate-200 shadow-sm'
                        : 'h-20 border-b border-transparent'
                    }`}
            >
                <div className="container mx-auto px-4 h-full max-w-7xl flex items-center justify-between">

                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-3 group mr-8">
                        <Logo size="md" variant="full" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 flex-1">
                        {/* Insurance Products Dropdown */}
                        <div className="relative group" onMouseEnter={() => setActiveDropdown('insurance')} onMouseLeave={() => setActiveDropdown(null)}>
                            <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-colors ${activeDropdown === 'insurance' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}>
                                Insurance Products
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'insurance' ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Mega Menu */}
                            <div className={`absolute top-full left-0 pt-3 w-[650px] transition-all duration-200 ${activeDropdown === 'insurance' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200/50 p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {insuranceCategories.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                                            >
                                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors text-sm">{item.name}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                                        <div className="text-xs font-semibold text-slate-500 px-2">
                                            Don&apos;t see what you need?
                                        </div>
                                        <Link href="/insurance-types" className="text-xs font-bold text-blue-600 hover:underline px-2">
                                            View all 50+ categories →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resources Dropdown */}
                        <div className="relative group" onMouseEnter={() => setActiveDropdown('resources')} onMouseLeave={() => setActiveDropdown(null)}>
                            <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-colors ${activeDropdown === 'resources' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}>
                                Resources
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`absolute top-full left-0 pt-3 w-[260px] transition-all duration-200 ${activeDropdown === 'resources' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                <div className="bg-white rounded-xl shadow-xl ring-1 ring-slate-200/50 p-3 flex flex-col gap-1">
                                    <Link href="/tools" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                        Calculators & Tools
                                    </Link>
                                    <Link href="/guides" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                        Insurance Guides
                                    </Link>
                                    <Link href="/directory" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                        Site Directory
                                    </Link>
                                    <Link href="/faq" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                                        FAQ
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/about" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors">
                            About Us
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <a href="tel:1-855-205-2412" className="text-sm font-bold text-slate-900 hover:text-blue-600 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-600" /> 1-855-205-2412
                            </a>
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>

                        <Link
                            href="/get-quote"
                            className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        >
                            Get Quotes
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 -mr-2 text-slate-900"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 bg-white pt-24 px-6 overflow-y-auto">
                        <nav className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Insurance</h3>
                                {insuranceCategories.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div className="text-blue-600">{item.icon}</div>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Resources</h3>
                                <Link
                                    href="/tools"
                                    className="block p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Tools & Calculators
                                </Link>
                                <Link
                                    href="/guides"
                                    className="block p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Guides
                                </Link>
                                <Link
                                    href="/directory"
                                    className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Globe className="w-4 h-4 text-blue-600" />
                                    Site Directory
                                </Link>
                                <Link
                                    href="/about"
                                    className="block p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About Us
                                </Link>
                            </div>

                            <div className="pb-8 pt-4">
                                <Link
                                    href="/get-quote"
                                    className="block w-full py-4 bg-blue-600 text-white text-center font-bold rounded-xl shadow-lg shadow-blue-900/10"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Start My Quote
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Spacer for fixed header */}
            <div className={`transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`} />
        </>
    );
}
