import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Map, Car, Home, Heart, Shield, Briefcase, Umbrella,
  FileText, HelpCircle, BookOpen, Users, Mail, Phone
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sitemap | MyInsuranceBuddy',
  description: 'Find your way around MyInsuranceBuddy. Browse our complete directory of insurance guides, tools, and resources.',
  keywords: 'sitemap, site map, insurance resources, directory',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true } }),
  ]);
  return { insuranceTypes, states };
}

const sitemapSections = [
  {
    title: 'Insurance Types',
    icon: Shield,
    links: [
      { name: 'Car Insurance', href: '/car-insurance' },
      { name: 'Home Insurance', href: '/home-insurance' },
      { name: 'Life Insurance', href: '/life-insurance' },
      { name: 'Health Insurance', href: '/health-insurance' },
      { name: 'Business Insurance', href: '/business-insurance' },
      { name: 'Pet Insurance', href: '/pet-insurance' },
      { name: 'Motorcycle Insurance', href: '/motorcycle-insurance' },
      { name: 'Renters Insurance', href: '/renters-insurance' },
    ],
  },
  {
    title: 'Resources & Guides',
    icon: BookOpen,
    links: [
      { name: 'Insurance Guides', href: '/guides' },
      { name: 'Auto Insurance Basics', href: '/guides/auto-insurance-basics' },
      { name: 'Term vs Whole Life Insurance', href: '/guides/term-vs-whole-life' },
      { name: 'Home Insurance Guide', href: '/guides/homeowners-insurance-types' },
      { name: 'Health Insurance 101', href: '/guides/health-insurance-basics' },
      { name: 'Business Insurance Types', href: '/guides/business-insurance-types' },
      { name: 'Umbrella Insurance Explained', href: '/guides/umbrella-insurance-explained' },
      { name: 'Insurance FAQ', href: '/faq' },
      { name: 'Insurance Glossary', href: '/glossary' },
    ],
  },
  {
    title: 'Tools & Calculators',
    icon: FileText,
    links: [
      { name: 'Insurance Calculators', href: '/tools' },
      { name: 'Car Insurance Calculator', href: '/car-insurance/calculator' },
      { name: 'Compare Quotes', href: '/compare' },
      { name: 'Get a Quote', href: '/get-quote' },
    ],
  },
  {
    title: 'Coverage by Location',
    icon: Map,
    links: [
      { name: 'Coverage by State', href: '/states' },
      { name: 'Major Cities', href: '/cities' },
      { name: 'Directory', href: '/directory' },
    ],
  },
  {
    title: 'Company',
    icon: Users,
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press & Media', href: '/press' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Legal',
    icon: FileText,
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Do Not Sell My Info', href: '/do-not-sell' },
    ],
  },
];

export default async function SitemapPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Map className="w-4 h-4" />
              Site Directory
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Sitemap
            </h1>
            <p className="text-lg text-slate-300">
              Find your way around MyInsuranceBuddy
            </p>
          </div>
        </div>
      </section>

      {/* Sitemap Grid */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sitemapSections.map((section) => (
              <div key={section.title} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="font-bold text-slate-900">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-600 hover:text-blue-600 transition text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* States */}
          <div className="max-w-6xl mx-auto mt-12">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5" />
                Coverage by State
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {states.filter(s => s.code && s.country?.code).slice(0, 24).map((state) => (
                  <Link
                    key={state.id}
                    href={`/states/${state.country.code.toLowerCase()}/${state.code!.toLowerCase()}`}
                    className="text-sm text-slate-600 hover:text-blue-600 transition py-1"
                  >
                    {state.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/states"
                  className="text-blue-600 font-semibold hover:underline text-sm"
                >
                  View All States →
                </Link>
              </div>
            </div>
          </div>

          {/* XML Sitemaps */}
          <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h2 className="font-bold text-slate-900 mb-4">XML Sitemaps</h2>
              <p className="text-slate-600 text-sm mb-4">
                For search engines and crawlers, we provide XML sitemaps:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/sitemap-index.xml"
                  className="px-4 py-2 bg-white rounded-lg text-sm text-blue-600 font-medium border border-blue-200 hover:border-blue-400 transition"
                >
                  Sitemap Index
                </a>
                <a
                  href="/sitemap-main.xml"
                  className="px-4 py-2 bg-white rounded-lg text-sm text-blue-600 font-medium border border-blue-200 hover:border-blue-400 transition"
                >
                  Main Pages
                </a>
                <a
                  href="/sitemap-pages.xml"
                  className="px-4 py-2 bg-white rounded-lg text-sm text-blue-600 font-medium border border-blue-200 hover:border-blue-400 transition"
                >
                  All Pages
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Our support team is here to help you navigate our site and find the information you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
            <a
              href="tel:1-855-205-2412"
              className="inline-flex items-center justify-center gap-2 bg-blue-500/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500/40 transition"
            >
              <Phone className="w-4 h-4" />
              1-855-205-2412
            </a>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
