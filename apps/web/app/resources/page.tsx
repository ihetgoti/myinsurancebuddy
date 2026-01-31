import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  BookOpen, ArrowRight, Shield, Car, Home, Heart, Users,
  Briefcase, FileText, Star, TrendingUp, CheckCircle,
  Building2, MapPin, Phone, Globe, Clock, Award
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Insurance Resources | MyInsuranceBuddy - Tools, Reviews & More',
  description: 'Access insurance resources including company reviews, state requirements, coverage checklists, and money-saving tips. Everything you need to make informed decisions.',
  keywords: 'insurance resources, insurance reviews, insurance companies, insurance tips, insurance checklist, compare insurance',
  openGraph: {
    title: 'Insurance Resources & Tools - MyInsuranceBuddy',
    description: 'Reviews, requirements, and resources to help you choose the best insurance.',
  },
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ 
      where: { isActive: true }, 
      orderBy: { sortOrder: 'asc' } 
    }),
    prisma.state.findMany({ 
      where: { isActive: true }, 
      include: { country: true }, 
      take: 12 
    }),
  ]);
  return { insuranceTypes, states };
}

const featuredCompanies = [
  { name: 'State Farm', rating: 4.5, reviews: '15,000+', specialties: ['Auto', 'Home', 'Life'], founded: 1922 },
  { name: 'Geico', rating: 4.3, reviews: '12,000+', specialties: ['Auto', 'Motorcycle'], founded: 1936 },
  { name: 'Progressive', rating: 4.4, reviews: '18,000+', specialties: ['Auto', 'Home', 'RV'], founded: 1937 },
  { name: 'Allstate', rating: 4.2, reviews: '10,000+', specialties: ['Auto', 'Home', 'Renters'], founded: 1931 },
  { name: 'USAA', rating: 4.8, reviews: '25,000+', specialties: ['Military', 'Auto', 'Home'], founded: 1922 },
  { name: 'Liberty Mutual', rating: 4.1, reviews: '8,000+', specialties: ['Auto', 'Home', 'Business'], founded: 1912 },
];

const resources = [
  {
    title: 'Coverage Checklists',
    icon: CheckCircle,
    color: 'emerald',
    items: [
      { title: 'Auto Insurance Checklist', desc: 'Essential coverages every driver needs', link: '/guides/auto-insurance-basics' },
      { title: 'Home Insurance Checklist', desc: 'Protect your biggest investment', link: '/guides/homeowners-insurance-types' },
      { title: 'Life Insurance Checklist', desc: 'Ensure your family is protected', link: '/guides/life-insurance-coverage' },
      { title: 'Business Insurance Checklist', desc: 'Required coverages for businesses', link: '/guides/business-insurance-types' },
    ]
  },
  {
    title: 'State Resources',
    icon: MapPin,
    color: 'blue',
    items: [
      { title: 'State Insurance Requirements', desc: 'Minimum coverage by state', link: '/states' },
      { title: 'DMV Information', desc: 'Registration and licensing info', link: '/guides' },
      { title: 'Insurance Departments', desc: 'Contact your state regulator', link: '/guides' },
      { title: 'Local Agents', desc: 'Find agents in your area', link: '/get-quote' },
    ]
  },
  {
    title: 'Money-Saving Tips',
    icon: TrendingUp,
    color: 'amber',
    items: [
      { title: 'Bundling Discounts', desc: 'Save up to 25% on premiums', link: '/guides/cheapest-car-insurance' },
      { title: 'Safe Driver Discounts', desc: 'Rewards for good driving', link: '/guides/factors-affecting-premium' },
      { title: 'Home Safety Discounts', desc: 'Lower rates with security systems', link: '/guides/lower-home-premium' },
      { title: 'Payment Options', desc: 'Pay annually to save more', link: '/guides' },
    ]
  },
  {
    title: 'Claims Resources',
    icon: FileText,
    color: 'rose',
    items: [
      { title: 'Filing a Claim', desc: 'Step-by-step guide to claims', link: '/guides/home-insurance-claims' },
      { title: 'Claims Timeline', desc: 'What to expect during claims', link: '/faq' },
      { title: 'Documentation Tips', desc: 'What to document for claims', link: '/guides' },
      { title: 'Dispute Resolution', desc: 'When you disagree with settlement', link: '/faq' },
    ]
  },
];

const quickStats = [
  { value: '120+', label: 'Insurance Partners', icon: Building2 },
  { value: '$867', label: 'Avg. Annual Savings', icon: TrendingUp },
  { value: '50', label: 'States Covered', icon: MapPin },
  { value: '24/7', label: 'Support Available', icon: Clock },
];

export default async function ResourcesPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              Everything You Need
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Insurance Resources
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Reviews, checklists, state requirements, and expert resources to help you 
              make informed insurance decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 sm:py-10 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {quickStats.map((stat) => (
              <div key={stat.label} className="text-center p-3 sm:p-4">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {resources.map((category) => (
              <div key={category.title} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className={`p-4 sm:p-5 ${
                  category.color === 'emerald' ? 'bg-emerald-50' :
                  category.color === 'blue' ? 'bg-blue-50' :
                  category.color === 'amber' ? 'bg-amber-50' :
                  'bg-rose-50'
                }`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${
                    category.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                    category.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    category.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                    'bg-rose-100 text-rose-600'
                  } rounded-xl flex items-center justify-center mb-3`}>
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">{category.title}</h2>
                </div>
                <div className="p-4 space-y-2">
                  {category.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.link}
                      className="block p-2.5 sm:p-3 rounded-lg hover:bg-slate-50 transition"
                    >
                      <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{item.title}</h3>
                      <p className="text-slate-600 text-xs">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Top-Rated Insurance Companies</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
              Compare customer ratings and reviews from leading insurance providers
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {featuredCompanies.map((company) => (
              <div key={company.name} className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{company.name}</h3>
                    <p className="text-slate-500 text-xs">Founded {company.founded}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 fill-green-600" />
                    <span className="font-bold text-green-700 text-sm">{company.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {company.specialties.map((spec) => (
                    <span key={spec} className="px-2 py-0.5 bg-white text-slate-600 text-xs rounded border border-slate-200">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {company.reviews} reviews
                  </span>
                  <Link 
                    href={`/get-quote`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">Browse by Insurance Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {[
              { icon: Car, label: 'Auto Insurance', link: '/car-insurance' },
              { icon: Home, label: 'Home Insurance', link: '/home-insurance' },
              { icon: Heart, label: 'Health Insurance', link: '/health-insurance' },
              { icon: Shield, label: 'Life Insurance', link: '/life-insurance' },
              { icon: Briefcase, label: 'Business Insurance', link: '/business-insurance' },
              { icon: FileText, label: 'Renters Insurance', link: '/renters-insurance' },
            ].map((type) => (
              <Link
                key={type.label}
                href={type.link}
                className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition"
              >
                <type.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <span className="text-slate-900 font-medium text-xs sm:text-sm text-center">{type.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-10 sm:py-12 bg-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Need Help Finding the Right Coverage?</h2>
                  <p className="text-slate-600 text-sm sm:text-base mb-4">
                    Our licensed insurance experts are available to answer your questions and help you compare options.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a 
                      href="tel:1-855-205-2412"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                    >
                      <Phone className="w-4 h-4" />
                      1-855-205-2412
                    </a>
                    <Link 
                      href="/contact"
                      className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm sm:text-base"
                    >
                      Contact Us
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Compare Quotes?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
            Compare rates from 120+ top-rated insurance providers and save up to $867/year.
          </p>
          <Link 
            href="/get-quote" 
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm sm:text-base"
          >
            Get Free Quotes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
