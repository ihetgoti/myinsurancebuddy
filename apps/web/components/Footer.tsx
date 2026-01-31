import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CheckCircle, Award, Star, Shield } from 'lucide-react';
import Logo from './Logo';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface FooterProps {
    insuranceTypes?: InsuranceType[];
}

export default function Footer({ insuranceTypes = [] }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        insurance: [
            { name: 'Car Insurance', href: '/car-insurance' },
            { name: 'Home Insurance', href: '/home-insurance' },
            { name: 'Life Insurance', href: '/life-insurance' },
            { name: 'Health Insurance', href: '/health-insurance' },
            { name: 'Business Insurance', href: '/business-insurance' },
            { name: 'Pet Insurance', href: '/pet-insurance' },
        ],
        resources: [
            { name: 'Insurance Guides', href: '/guides' },
            { name: 'Blog & News', href: '/blog' },
            { name: 'Calculators', href: '/tools' },
            { name: 'Coverage by State', href: '/states' },
            { name: 'FAQ', href: '/faq' },
            { name: 'Glossary', href: '/glossary' },
        ],
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Contact Support', href: '/contact' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'Do Not Sell', href: '/do-not-sell' },
        ]
    };

    return (
        <footer className="bg-slate-900 text-slate-400">
            {/* Trust Bar */}
            <div className="border-b border-slate-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-medium">A+ BBB Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium">Licensed in All 50 States</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-medium">4.8/5 Customer Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-medium">256-bit SSL Secure</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <div className="mb-6">
                            <Link href="/" className="inline-block">
                                <Logo size="lg" variant="full" colorScheme="dark" />
                            </Link>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-slate-400 max-w-xs">
                            We help you compare quotes from 100+ insurance companies to find the best coverage at the lowest price. Licensed in all 50 states.
                        </p>
                        
                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <a href="tel:1-855-205-2412" className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Phone className="w-4 h-4" />
                                </div>
                                1-855-205-2412
                            </a>
                            <a href="mailto:support@myinsurancebuddies.com" className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Mail className="w-4 h-4" />
                                </div>
                                support@myinsurancebuddies.com
                            </a>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                Austin, TX 78701
                            </div>
                        </div>
                        
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <SocialLink icon={<Facebook className="w-4 h-4" />} href="#" label="Facebook" />
                            <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" label="Twitter" />
                            <SocialLink icon={<Instagram className="w-4 h-4" />} href="#" label="Instagram" />
                            <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" label="LinkedIn" />
                        </div>
                    </div>

                    {/* Insurance Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Insurance</h4>
                        <ul className="space-y-3 text-sm">
                            {footerLinks.insurance.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                                        {link.name}
                                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                                        {link.name}
                                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company</h4>
                        <ul className="space-y-3 text-sm">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                                        {link.name}
                                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors inline-flex items-center gap-1 group">
                                        {link.name}
                                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 bg-slate-950">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            &copy; {currentYear} MyInsuranceBuddy. All rights reserved. Licensed insurance agency.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-600 leading-relaxed max-w-4xl">
                        Disclaimer: MyInsuranceBuddy is not an insurance company. We are a licensed insurance comparison service 
                        that connects you with insurance providers. Quotes and savings vary by state, driving record, and individual factors. 
                        Not all policies and discounts are available in all states. 
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon, href, label }: { icon: React.ReactNode, href: string, label: string }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
        >
            {icon}
        </a>
    );
}
