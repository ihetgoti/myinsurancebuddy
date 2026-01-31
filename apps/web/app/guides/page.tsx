import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  BookOpen, Clock, ArrowRight, Shield, Car, Home, Heart, 
  Briefcase, Umbrella, FileText, CheckCircle, Star, TrendingUp,
  Users, AlertCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Insurance Guides & Resources | MyInsuranceBuddy',
  description: 'Comprehensive insurance guides to help you understand coverage options, save money, and make informed decisions. Expert advice for auto, home, health, life & more.',
  keywords: 'insurance guides, insurance tips, how to buy insurance, insurance explained, coverage guide',
  openGraph: {
    title: 'Insurance Guides & Resources - MyInsuranceBuddy',
    description: 'Expert guides to help you navigate insurance and find the best coverage.',
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

const guides = [
  {
    category: 'Auto Insurance',
    icon: Car,
    color: 'blue',
    description: 'Everything you need to know about car insurance coverage',
    articles: [
      { title: 'Auto Insurance Basics: A Complete Guide for Beginners', slug: 'auto-insurance-basics', readTime: 8, level: 'Beginner' },
      { title: 'Understanding Liability vs Full Coverage', slug: 'liability-vs-full-coverage', readTime: 6, level: 'Beginner' },
      { title: 'How to Get the Cheapest Car Insurance Rates', slug: 'cheapest-car-insurance', readTime: 10, level: 'Intermediate' },
      { title: 'What Affects Your Auto Insurance Premium?', slug: 'factors-affecting-premium', readTime: 7, level: 'Beginner' },
      { title: 'Teen Driver Insurance: What Parents Need to Know', slug: 'teen-driver-insurance', readTime: 9, level: 'Intermediate' },
      { title: 'SR-22 Insurance: Requirements by State', slug: 'sr22-insurance', readTime: 5, level: 'Advanced' },
    ]
  },
  {
    category: 'Home Insurance',
    icon: Home,
    color: 'emerald',
    description: 'Protect your most valuable asset with the right coverage',
    articles: [
      { title: 'Homeowners Insurance Explained: Coverage Types', slug: 'homeowners-insurance-types', readTime: 12, level: 'Beginner' },
      { title: 'How Much Home Insurance Do You Need?', slug: 'how-much-home-insurance', readTime: 8, level: 'Intermediate' },
      { title: 'Renters Insurance: Is It Worth It?', slug: 'renters-insurance-worth', readTime: 6, level: 'Beginner' },
      { title: 'Flood Insurance: What Homeowners Should Know', slug: 'flood-insurance-guide', readTime: 7, level: 'Intermediate' },
      { title: 'Home Insurance Claims: Step-by-Step Process', slug: 'home-insurance-claims', readTime: 10, level: 'Intermediate' },
      { title: 'Lowering Your Home Insurance Premium', slug: 'lower-home-premium', readTime: 6, level: 'Beginner' },
    ]
  },
  {
    category: 'Health Insurance',
    icon: Heart,
    color: 'rose',
    description: 'Navigate health coverage options with confidence',
    articles: [
      { title: 'Health Insurance 101: Understanding Your Options', slug: 'health-insurance-basics', readTime: 15, level: 'Beginner' },
      { title: 'HMO vs PPO: Which is Right for You?', slug: 'hmo-vs-ppo', readTime: 8, level: 'Beginner' },
      { title: 'Medicare vs Medicaid: Key Differences', slug: 'medicare-vs-medicaid', readTime: 10, level: 'Intermediate' },
      { title: 'ACA Marketplace: How to Enroll', slug: 'aca-marketplace-enrollment', readTime: 12, level: 'Intermediate' },
      { title: 'Health Insurance Tax Deductions Guide', slug: 'health-insurance-tax', readTime: 7, level: 'Advanced' },
      { title: 'Short-Term Health Insurance Pros & Cons', slug: 'short-term-health-insurance', readTime: 6, level: 'Beginner' },
    ]
  },
  {
    category: 'Life Insurance',
    icon: Shield,
    color: 'violet',
    description: 'Secure your family\'s financial future',
    articles: [
      { title: 'Term vs Whole Life Insurance: Which to Choose?', slug: 'term-vs-whole-life', readTime: 10, level: 'Beginner' },
      { title: 'How Much Life Insurance Do You Need?', slug: 'life-insurance-coverage', readTime: 8, level: 'Beginner' },
      { title: 'Life Insurance for Parents: A Complete Guide', slug: 'life-insurance-parents', readTime: 9, level: 'Intermediate' },
      { title: 'Understanding Life Insurance Riders', slug: 'life-insurance-riders', readTime: 7, level: 'Advanced' },
      { title: 'No-Exam Life Insurance: What You Need to Know', slug: 'no-exam-life-insurance', readTime: 6, level: 'Intermediate' },
      { title: 'Life Insurance for Seniors: Best Options', slug: 'life-insurance-seniors', readTime: 8, level: 'Beginner' },
    ]
  },
  {
    category: 'Business Insurance',
    icon: Briefcase,
    color: 'amber',
    description: 'Protect your business from unexpected risks',
    articles: [
      { title: 'Business Insurance Types Every Owner Needs', slug: 'business-insurance-types', readTime: 12, level: 'Beginner' },
      { title: 'General Liability Insurance Explained', slug: 'general-liability-explained', readTime: 8, level: 'Beginner' },
      { title: 'Workers Compensation: State Requirements', slug: 'workers-comp-requirements', readTime: 10, level: 'Intermediate' },
      { title: 'Professional Liability vs General Liability', slug: 'professional-vs-general-liability', readTime: 7, level: 'Intermediate' },
      { title: 'Small Business Insurance Cost Guide', slug: 'small-business-insurance-cost', readTime: 9, level: 'Beginner' },
      { title: 'Cyber Liability Insurance for Businesses', slug: 'cyber-liability-insurance', readTime: 8, level: 'Advanced' },
    ]
  },
  {
    category: 'Umbrella Insurance',
    icon: Umbrella,
    color: 'cyan',
    description: 'Extra liability protection for peace of mind',
    articles: [
      { title: 'What is Umbrella Insurance & Do You Need It?', slug: 'umbrella-insurance-explained', readTime: 7, level: 'Beginner' },
      { title: 'How Much Umbrella Coverage to Buy', slug: 'umbrella-coverage-amount', readTime: 6, level: 'Intermediate' },
      { title: 'When Umbrella Insurance Pays Off', slug: 'umbrella-insurance-claims', readTime: 8, level: 'Intermediate' },
    ]
  },
];

const featuredTips = [
  {
    icon: TrendingUp,
    title: 'Shop Around Annually',
    desc: 'Insurance rates change frequently. Comparing quotes yearly can save you hundreds.',
  },
  {
    icon: CheckCircle,
    title: 'Bundle Your Policies',
    desc: 'Combine auto and home insurance for discounts up to 25% from most carriers.',
  },
  {
    icon: Star,
    title: 'Maintain Good Credit',
    desc: 'In most states, your credit score affects insurance rates. Better credit = lower premiums.',
  },
  {
    icon: AlertCircle,
    title: 'Review Coverage Limits',
    desc: 'Make sure your coverage keeps up with inflation and lifestyle changes.',
  },
];

export default async function GuidesPage() {
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
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              50+ Expert Articles
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              Insurance Guides & Resources
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Expert advice to help you understand insurance, make informed decisions, 
              and find the best coverage for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tips */}
      <section className="py-10 sm:py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredTips.map((tip) => (
              <div key={tip.title} className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{tip.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides by Category */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 sm:space-y-16">
            {guides.map((category) => (
              <div key={category.category}>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${
                    category.color === 'blue' ? 'bg-blue-100' :
                    category.color === 'emerald' ? 'bg-emerald-100' :
                    category.color === 'rose' ? 'bg-rose-100' :
                    category.color === 'violet' ? 'bg-violet-100' :
                    category.color === 'amber' ? 'bg-amber-100' :
                    'bg-cyan-100'
                  } rounded-xl flex items-center justify-center`}>
                    <category.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      category.color === 'blue' ? 'text-blue-600' :
                      category.color === 'emerald' ? 'text-emerald-600' :
                      category.color === 'rose' ? 'text-rose-600' :
                      category.color === 'violet' ? 'text-violet-600' :
                      category.color === 'amber' ? 'text-amber-600' :
                      'text-cyan-600'
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{category.category}</h2>
                    <p className="text-slate-600 text-xs sm:text-sm">{category.description}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {category.articles.map((article) => (
                    <Link 
                      key={article.slug}
                      href={`/guides/${article.slug}`}
                      className="group bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition line-clamp-2">
                          {article.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime} min read
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          article.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          article.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {article.level}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-10 sm:py-12 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <Link 
              href="/glossary"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition"
            >
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Insurance Glossary</h3>
                <p className="text-slate-600 text-xs">Key terms explained</p>
              </div>
            </Link>
            <Link 
              href="/faq"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition"
            >
              <Shield className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">FAQs</h3>
                <p className="text-slate-600 text-xs">Common questions answered</p>
              </div>
            </Link>
            <Link 
              href="/tools"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition"
            >
              <TrendingUp className="w-6 h-6 text-violet-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Insurance Tools</h3>
                <p className="text-slate-600 text-xs">Calculators & resources</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Put Knowledge into Action?</h2>
          <p className="text-blue-100 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
            Now that you're informed, compare quotes from top-rated insurance providers in your area.
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
