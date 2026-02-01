import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Shield, Heart, Users, TrendingUp, CheckCircle, ArrowRight,
  Clock, Star, Award, Calculator, FileText, Phone, DollarSign
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Life Insurance Quotes | Compare Top Providers | MyInsuranceBuddy',
  description: 'Compare life insurance quotes from 100+ top-rated companies. Term life, whole life, and universal life coverage options. Find affordable protection for your family starting at $15/month.',
  keywords: 'life insurance quotes, term life insurance, whole life insurance, cheap life insurance, life insurance comparison, family protection',
  openGraph: {
    title: 'Compare Life Insurance Quotes - Save Up to 40%',
    description: 'Find affordable life insurance from top providers. Get personalized quotes in minutes.',
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

const coverageTypes = [
  {
    name: 'Term Life Insurance',
    description: 'Affordable coverage for a specific period (10-30 years). Best for most families.',
    price: 'From $15/month',
    features: ['Most affordable option', 'Fixed premiums', 'Convertible to permanent', 'Simple application'],
    bestFor: 'Young families, mortgage protection',
    icon: Clock,
    color: 'blue',
  },
  {
    name: 'Whole Life Insurance',
    description: 'Lifetime coverage with cash value accumulation. Premiums never increase.',
    price: 'From $85/month',
    features: ['Lifetime coverage', 'Cash value growth', 'Fixed premiums', 'Tax advantages'],
    bestFor: 'Estate planning, final expenses',
    icon: Shield,
    color: 'emerald',
  },
  {
    name: 'Universal Life Insurance',
    description: 'Flexible premiums and adjustable coverage with investment component.',
    price: 'From $65/month',
    features: ['Flexible premiums', 'Adjustable coverage', 'Cash value potential', 'Tax-deferred growth'],
    bestFor: 'Flexible planning, supplemental income',
    icon: TrendingUp,
    color: 'violet',
  },
];

const topProviders = [
  { name: 'Northwestern Mutual', rating: 4.9, specialty: 'Whole Life', amBest: 'A++' },
  { name: 'State Farm', rating: 4.8, specialty: 'Term Life', amBest: 'A++' },
  { name: 'New York Life', rating: 4.8, specialty: 'Universal', amBest: 'A++' },
  { name: 'Prudential', rating: 4.7, specialty: 'High Coverage', amBest: 'A+' },
  { name: 'Haven Life', rating: 4.7, specialty: 'Online Term', amBest: 'A++' },
  { name: 'Banner Life', rating: 4.6, specialty: 'Affordable Term', amBest: 'A+' },
];

const faqs = [
  {
    question: 'How much life insurance do I need?',
    answer: 'A common rule of thumb is 10-12 times your annual income. However, your specific needs depend on factors like debts, mortgage, children\'s education costs, and your spouse\'s financial needs. Use our calculator to get a personalized recommendation.',
  },
  {
    question: 'What is the difference between term and whole life insurance?',
    answer: 'Term life provides coverage for a specific period (10-30 years) at lower premiums. Whole life provides lifetime coverage, builds cash value, and has higher premiums. Term is best for most families; whole life is better for estate planning.',
  },
  {
    question: 'Can I get life insurance without a medical exam?',
    answer: 'Yes, many insurers offer no-exam policies. These are typically available for coverage amounts up to $500,000-$1,000,000. While convenient, they may cost slightly more than policies requiring a medical exam.',
  },
  {
    question: 'At what age should I buy life insurance?',
    answer: 'The younger you are when you buy, the lower your premiums will be. However, life insurance becomes essential when others depend on your income—typically when you get married, have children, or take on significant debt like a mortgage.',
  },
];

export default async function LifeInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-violet-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                Protect What Matters Most
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                Life Insurance That Fits Your Family's Needs
              </h1>
              <p className="text-base sm:text-lg text-slate-300 mb-6 leading-relaxed">
                Compare quotes from 100+ top-rated life insurance companies. Find affordable coverage to protect your loved ones' financial future.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {['No obligation quotes', 'Compare in 2 minutes', 'Licensed agents'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    {item}
                  </span>
                ))}
              </div>
              <Link 
                href="/get-quote?type=life" 
                className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition"
              >
                Get Free Quotes
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">$500K+</div>
                    <div className="text-white/70 text-sm">Coverage Available</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">From $15</div>
                    <div className="text-white/70 text-sm">Per Month</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">100+</div>
                    <div className="text-white/70 text-sm">Top Providers</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">A+</div>
                    <div className="text-white/70 text-sm">Rated Companies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Choose Your Coverage Type</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Compare the three main types of life insurance to find what works best for your situation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {coverageTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition flex flex-col">
                <div className={`w-12 h-12 ${type.color === 'blue' ? 'bg-blue-100' : type.color === 'emerald' ? 'bg-emerald-100' : 'bg-violet-100'} rounded-xl flex items-center justify-center mb-4`}>
                  <type.icon className={`w-6 h-6 ${type.color === 'blue' ? 'text-blue-600' : type.color === 'emerald' ? 'text-emerald-600' : 'text-violet-600'}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{type.name}</h3>
                <p className="text-slate-600 text-sm mb-4 flex-grow">{type.description}</p>
                <div className={`text-lg font-bold ${type.color === 'blue' ? 'text-blue-600' : type.color === 'emerald' ? 'text-emerald-600' : 'text-violet-600'} mb-3`}>{type.price}</div>
                <ul className="space-y-2 mb-4">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-slate-500 bg-slate-100 rounded-lg p-2 mb-4">
                  <span className="font-semibold">Best for:</span> {type.bestFor}
                </div>
                <Link 
                  href={`/get-quote?type=life&coverage=${type.name.toLowerCase().replace(' ', '-')}`}
                  className={`block text-center py-2.5 rounded-lg font-semibold transition ${type.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' : type.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'}`}
                >
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Providers */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Top-Rated Life Insurance Companies</h2>
            <p className="text-slate-600">Compare quotes from these trusted providers</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {topProviders.map((provider) => (
              <div key={provider.name} className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-violet-300 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-slate-400 border border-slate-200">
                    {provider.name[0]}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-amber-600 fill-current" />
                    <span className="text-xs font-semibold text-amber-700">{provider.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{provider.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                  <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded">{provider.specialty}</span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    A.M. Best: {provider.amBest}
                  </span>
                </div>
                <Link 
                  href={`/get-quote?type=life&provider=${encodeURIComponent(provider.name)}`}
                  className="block text-center text-sm text-violet-600 font-semibold hover:text-violet-700"
                >
                  Get Quote →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600">Get covered in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '1', icon: Calculator, title: 'Compare Quotes', desc: 'Answer a few questions and see personalized quotes from top providers.' },
              { step: '2', icon: FileText, title: 'Choose Your Policy', desc: 'Review coverage options, compare prices, and select the best policy for you.' },
              { step: '3', icon: Shield, title: 'Get Covered', desc: 'Complete your application and get approved—some policies activate same day.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-violet-600" />
                </div>
                <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3 -mt-12 ml-auto mr-8 border-4 border-slate-50">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
              <p className="text-slate-600">Everything you need to know about life insurance</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-100 transition">
                    <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-violet-600 to-purple-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Protect Your Family Today</h2>
          <p className="text-violet-100 mb-6 sm:mb-8 max-w-xl mx-auto">
            Get free life insurance quotes from top providers. Takes just 2 minutes, no obligation required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/get-quote?type=life" 
              className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
            >
              Compare Quotes Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="tel:1-855-205-2412" 
              className="inline-flex items-center justify-center gap-2 bg-violet-500/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-violet-500/40 transition"
            >
              <Phone className="w-4 h-4" />
              Call 1-855-205-2412
            </a>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
