import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Car, Home, Heart, Stethoscope, Briefcase, Dog, Umbrella, 
  Shield, Zap, ArrowRight, CheckCircle, Star, TrendingUp,
  Users, Building2, Plane, Anchor, Tractor
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Insurance Types | Compare 50+ Insurance Categories | MyInsuranceBuddy',
  description: 'Browse all insurance types including auto, home, life, health, business, pet, and specialty coverage. Compare quotes and find the right protection for every aspect of your life.',
  keywords: 'insurance types, insurance categories, auto insurance, home insurance, life insurance, health insurance, business insurance, pet insurance, specialty insurance',
  openGraph: {
    title: 'All Insurance Types - Compare 50+ Insurance Categories',
    description: 'Browse comprehensive insurance coverage options for every aspect of your life. Compare quotes and save.',
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

const mainInsuranceTypes = [
  {
    id: 'auto',
    name: 'Auto Insurance',
    slug: 'car-insurance',
    description: 'Protect your vehicle and yourself on the road with comprehensive coverage options.',
    icon: Car,
    color: 'blue',
    features: ['Liability Coverage', 'Collision & Comprehensive', 'Uninsured Motorist', 'Roadside Assistance'],
    avgPrice: '$120-250/month',
    popular: true,
  },
  {
    id: 'home',
    name: 'Home Insurance',
    slug: 'home-insurance',
    description: 'Safeguard your most valuable asset with dwelling, property, and liability protection.',
    icon: Home,
    color: 'emerald',
    features: ['Dwelling Coverage', 'Personal Property', 'Liability Protection', 'Additional Living Expenses'],
    avgPrice: '$100-200/month',
    popular: true,
  },
  {
    id: 'life',
    name: 'Life Insurance',
    slug: 'life-insurance',
    description: 'Secure your family\'s financial future with term or permanent life coverage.',
    icon: Heart,
    color: 'violet',
    features: ['Term Life', 'Whole Life', 'Universal Life', 'Final Expense'],
    avgPrice: '$30-150/month',
    popular: true,
  },
  {
    id: 'health',
    name: 'Health Insurance',
    slug: 'health-insurance',
    description: 'Get coverage for medical expenses, prescriptions, and preventive care.',
    icon: Stethoscope,
    color: 'rose',
    features: ['Individual & Family Plans', 'ACA Marketplace', 'Short-Term Health', 'Medicare Plans'],
    avgPrice: '$400-800/month',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business Insurance',
    slug: 'business-insurance',
    description: 'Protect your company from liability, property damage, and business interruption.',
    icon: Briefcase,
    color: 'amber',
    features: ['General Liability', 'Professional Liability', 'Workers Comp', 'Commercial Property'],
    avgPrice: '$85-150/month',
    popular: true,
  },
  {
    id: 'pet',
    name: 'Pet Insurance',
    slug: 'pet-insurance',
    description: 'Cover veterinary expenses for your furry family members with comprehensive plans.',
    icon: Dog,
    color: 'orange',
    features: ['Accident Coverage', 'Illness Coverage', 'Wellness Plans', 'Hereditary Conditions'],
    avgPrice: '$30-70/month',
    popular: true,
  },
];

const specialtyInsuranceTypes = [
  {
    id: 'umbrella',
    name: 'Umbrella Insurance',
    slug: 'guides/umbrella-insurance-explained',
    description: 'Extra liability protection beyond your standard policies.',
    icon: Umbrella,
    color: 'cyan',
  },
  {
    id: 'motorcycle',
    name: 'Motorcycle Insurance',
    slug: 'motorcycle-insurance',
    description: 'Coverage for your bike including liability and comprehensive options.',
    icon: Zap,
    color: 'purple',
  },
  {
    id: 'renters',
    name: 'Renters Insurance',
    slug: 'renters-insurance',
    description: 'Protect your personal belongings and get liability coverage as a tenant.',
    icon: Building2,
    color: 'indigo',
  },
  {
    id: 'commercial-auto',
    name: 'Commercial Auto',
    slug: 'commercial-auto-insurance',
    description: 'Business vehicle coverage for company cars, trucks, and fleets.',
    icon: Car,
    color: 'teal',
  },
];

const benefitCards = [
  {
    icon: CheckCircle,
    title: 'Compare Multiple Quotes',
    desc: 'Get rates from 100+ top-rated insurance companies in one place.',
  },
  {
    icon: Star,
    title: 'Expert Guidance',
    desc: 'Unbiased advice to help you choose the right coverage for your needs.',
  },
  {
    icon: TrendingUp,
    title: 'Save Money',
    desc: 'Our users save an average of $500+ per year by comparing quotes.',
  },
  {
    icon: Users,
    title: 'Licensed Agents',
    desc: 'Connect with experienced agents who can answer all your questions.',
  },
];

export default async function InsuranceTypesPage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              50+ Insurance Categories
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              All Insurance Types
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Browse comprehensive insurance coverage options for every aspect of your life. 
              Compare quotes and find the perfect protection for you and your family.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefitCards.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{benefit.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mt-0.5">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Insurance Types */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Popular Insurance Categories
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              These are the most commonly purchased insurance types that protect what matters most.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mainInsuranceTypes.map((type) => {
              const colorClasses: Record<string, { bg: string; text: string; border: string; lightBg: string }> = {
                blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', lightBg: 'bg-blue-50' },
                emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', lightBg: 'bg-emerald-50' },
                violet: { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200', lightBg: 'bg-violet-50' },
                rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200', lightBg: 'bg-rose-50' },
                amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', lightBg: 'bg-amber-50' },
                orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', lightBg: 'bg-orange-50' },
              };
              const colors = colorClasses[type.color] || colorClasses.blue;

              return (
                <Link
                  key={type.id}
                  href={`/${type.slug}`}
                  className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <type.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                        {type.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">{type.avgPrice}</span>
                    </div>
                    {type.popular && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {type.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className={`w-3.5 h-3.5 ${colors.text}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className={`flex items-center justify-between pt-4 border-t ${colors.border}`}>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                      Learn More
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialty Insurance */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Specialty Insurance
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Additional coverage options for specific needs and situations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {specialtyInsuranceTypes.map((type) => {
              const colorClasses: Record<string, { bg: string; text: string }> = {
                cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
                purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
                indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
                teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
              };
              const colors = colorClasses[type.color] || colorClasses.cyan;

              return (
                <Link
                  key={type.id}
                  href={`/${type.slug}`}
                  className="group bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <type.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                    {type.name}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {type.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Browse Insurance by State
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Insurance requirements and rates vary by state. Find coverage options where you live.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {states.slice(0, 12).map((state) => (
              <Link
                key={state.id}
                href={`/car-insurance/${state.country.code}/${state.slug}`}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all"
              >
                {state.name}
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/states"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm"
            >
              View All 50 States
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Not Sure What You Need?
            </h2>
            <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Get personalized recommendations based on your situation. Compare quotes from top insurance companies and save.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/get-quote"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm sm:text-base"
              >
                Get Free Quotes
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center justify-center gap-2 bg-blue-500/30 text-white border border-blue-400/30 px-6 py-3 rounded-xl font-bold hover:bg-blue-500/40 transition text-sm sm:text-base"
              >
                Read Insurance Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
