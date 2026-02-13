import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Star, CheckCircle, ArrowRight, Award, Shield, TrendingDown, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Best Homeowners Insurance Companies 2024 | Top Rated Providers',
  description: 'Compare the best homeowners insurance companies for 2024. See ratings, reviews, and average rates from top providers like State Farm, Allstate, USAA, and more.',
  keywords: 'best homeowners insurance, top home insurance companies, best home insurance 2024, homeowners insurance ratings, home insurance reviews',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

const topCompanies = [
  {
    name: 'USAA',
    rating: 4.9,
    avgRate: '$98/mo',
    bestFor: 'Military Families',
    pros: ['Excellent customer service', 'Competitive rates', 'Military-specific benefits', 'Easy claims process'],
    cons: ['Military affiliation required'],
    link: '/get-quote',
    featured: true,
  },
  {
    name: 'State Farm',
    rating: 4.7,
    avgRate: '$125/mo',
    bestFor: 'Overall Value',
    pros: ['Largest provider network', 'Local agents everywhere', 'Excellent financial strength', 'Bundle discounts'],
    cons: ['Rates can be higher in some areas'],
    link: '/get-quote',
    featured: true,
  },
  {
    name: 'Allstate',
    rating: 4.5,
    avgRate: '$142/mo',
    bestFor: 'Customizable Coverage',
    pros: ['Wide range of add-ons', 'Claim forgiveness', 'Digital tools', 'Local agent support'],
    cons: ['Higher base rates', 'Mixed claims reviews'],
    link: '/get-quote',
    featured: false,
  },
  {
    name: 'Liberty Mutual',
    rating: 4.3,
    avgRate: '$156/mo',
    bestFor: 'Discounts',
    pros: ['Numerous discount options', 'Online quote process', 'Flexible coverage', '24/7 claims'],
    cons: ['Customer service varies', 'Rate increases'],
    link: '/get-quote',
    featured: false,
  },
  {
    name: 'Farmers',
    rating: 4.4,
    avgRate: '$138/mo',
    bestFor: 'Personalized Service',
    pros: ['Knowledgeable agents', 'Replacement cost coverage', 'Claims-free discount', 'Smart home discounts'],
    cons: ['Limited availability', 'Higher premiums'],
    link: '/get-quote',
    featured: false,
  },
  {
    name: 'Travelers',
    rating: 4.6,
    avgRate: '$132/mo',
    bestFor: 'Green Home Coverage',
    pros: ['Green home discounts', 'Flexible policies', 'Strong financial rating', 'Multiple bundling options'],
    cons: ['Limited local agents', 'Online experience needs work'],
    link: '/get-quote',
    featured: false,
  },
];

const comparisonFeatures = [
  'Dwelling Coverage',
  'Personal Property',
  'Liability Protection',
  'Additional Living Expenses',
  'Medical Payments',
  '24/7 Claims Support',
  'Online Account Management',
  'Mobile App',
];

export default async function BestHomeownersInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B1B34] via-[#0F2847] to-[#1A3A5C] py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              2024 Rankings
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Best Homeowners Insurance Companies
            </h1>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Compare top-rated home insurance providers. See customer ratings, average rates, and find the best coverage for your home.
            </p>
            <Link
              href="/get-quote"
              className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
            >
              Compare Quotes Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-12 sm:py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Top Rated Providers</h2>
            <p className="text-slate-600 mt-2">Based on customer satisfaction, financial strength, and coverage options</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {topCompanies.filter(c => c.featured).map((company) => (
              <div key={company.name} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  Editor&apos;s Choice
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{company.name}</h3>
                    <p className="text-sm text-slate-500">Best for: {company.bestFor}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-slate-900">{company.rating}</span>
                    </div>
                    <p className="text-xs text-slate-500">/5 rating</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-blue-600">{company.avgRate}</span>
                  <span className="text-slate-500">average</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {company.pros.slice(0, 3).map((pro) => (
                    <li key={pro} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {pro}
                    </li>
                  ))}
                </ul>
                <Link
                  href={company.link}
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Get Quote from {company.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Companies Comparison */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8">Compare All Top Providers</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-4 sm:px-6 font-semibold text-slate-900">Company</th>
                  <th className="text-center py-4 px-4 sm:px-6 font-semibold text-slate-900">Rating</th>
                  <th className="text-center py-4 px-4 sm:px-6 font-semibold text-slate-900">Avg. Rate</th>
                  <th className="text-center py-4 px-4 sm:px-6 font-semibold text-slate-900">Best For</th>
                  <th className="text-center py-4 px-4 sm:px-6 font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {topCompanies.map((company, index) => (
                  <tr key={company.name} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 border-t border-slate-100'}>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900">{company.name}</div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{company.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center font-bold text-slate-900">{company.avgRate}</td>
                    <td className="py-4 px-4 sm:px-6 text-center text-sm text-slate-600">{company.bestFor}</td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <Link href={company.link} className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
                        Get Quote →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8">How to Choose the Best Home Insurance</h2>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Compare Coverage Options',
                  desc: 'Look beyond price. Make sure the policy covers your specific needs, including dwelling, personal property, liability, and additional living expenses.',
                },
                {
                  title: 'Check Financial Strength',
                  desc: 'Choose a company with strong financial ratings (A.M. Best, Moody\'s) to ensure they can pay claims when needed.',
                },
                {
                  title: 'Read Customer Reviews',
                  desc: 'Look at claims satisfaction ratings and read reviews about the company\'s customer service and claims handling.',
                },
                {
                  title: 'Ask About Discounts',
                  desc: 'Bundle with auto insurance, install security systems, or maintain a claims-free history to save up to 25%.',
                },
              ].map((tip, i) => (
                <div key={tip.title} className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{tip.title}</h3>
                    <p className="text-slate-600 text-sm">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Find Your Best Rate?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Compare quotes from all top providers and save up to 25% on your homeowners insurance.
          </p>
          <Link
            href="/get-quote"
            className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
          >
            Compare All Companies
          </Link>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
