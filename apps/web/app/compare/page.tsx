'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Scale, CheckCircle, XCircle, ArrowRight, Shield, Car, Home, Heart,
  Briefcase, Info, Star, TrendingUp, Clock, DollarSign, Award,
  Building2, Users, ChevronDown, ChevronUp
} from 'lucide-react';

export default function ComparePage() {
  const [activeCategory, setActiveCategory] = useState('auto');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const categories = [
    { id: 'auto', name: 'Auto Insurance', icon: Car },
    { id: 'home', name: 'Home Insurance', icon: Home },
    { id: 'health', name: 'Health Insurance', icon: Heart },
    { id: 'life', name: 'Life Insurance', icon: Shield },
    { id: 'business', name: 'Business Insurance', icon: Briefcase },
  ];

  const comparisonData: Record<string, any> = {
    auto: {
      factors: [
        { name: 'Price Competitiveness', weight: 'High' },
        { name: 'Customer Service', weight: 'High' },
        { name: 'Claims Process', weight: 'High' },
        { name: 'Coverage Options', weight: 'Medium' },
        { name: 'Digital Experience', weight: 'Medium' },
        { name: 'Discount Availability', weight: 'Medium' },
      ],
      companies: [
        { name: 'State Farm', rating: 4.5, price: '$$', bestFor: 'Bundling & Service', pros: ['Excellent customer service', 'Local agents nationwide', 'Great bundling discounts'], cons: ['Higher rates for some drivers', 'Limited online tools'] },
        { name: 'Geico', rating: 4.3, price: '$', bestFor: 'Affordable Rates', pros: ['Competitive pricing', 'Easy online experience', '24/7 claims service'], cons: ['Limited local agents', 'Fewer coverage options'] },
        { name: 'Progressive', rating: 4.4, price: '$$', bestFor: 'High-Risk Drivers', pros: ['Name Your Price tool', 'Snapshot program', 'Accepts most drivers'], cons: ['Mixed customer service reviews', 'Rates can increase'] },
        { name: 'Allstate', rating: 4.2, price: '$$$', bestFor: 'Claims Satisfaction', pros: ['Claim satisfaction guarantee', 'Strong financial ratings', 'Safe driving bonus'], cons: ['Higher premiums', 'Mixed claim experiences'] },
      ]
    },
    home: {
      factors: [
        { name: 'Coverage Quality', weight: 'High' },
        { name: 'Claims Service', weight: 'High' },
        { name: 'Price', weight: 'High' },
        { name: 'Financial Strength', weight: 'High' },
        { name: 'Policy Options', weight: 'Medium' },
        { name: 'Discounts', weight: 'Medium' },
      ],
      companies: [
        { name: 'State Farm', rating: 4.6, price: '$$', bestFor: 'Overall Value', pros: ['Strong claim service', 'Local agent support', 'Multiple discounts'], cons: ['Premiums vary by location'] },
        { name: 'Allstate', rating: 4.3, price: '$$$', bestFor: 'Customization', pros: ['Many coverage options', 'Claim rateGuard', 'Digital tools'], cons: ['Higher base premiums'] },
        { name: 'Liberty Mutual', rating: 4.2, price: '$$', bestFor: 'Replacement Cost', pros: ['Guaranteed replacement cost', 'Inflation protection', '24/7 claims'], cons: ['Mixed customer satisfaction'] },
        { name: 'USAA', rating: 4.9, price: '$', bestFor: 'Military Families', pros: ['Excellent rates', 'Outstanding service', 'Military benefits'], cons: ['Military-only eligibility'] },
      ]
    },
    health: {
      factors: [
        { name: 'Network Size', weight: 'High' },
        { name: 'Monthly Premium', weight: 'High' },
        { name: 'Out-of-Pocket Costs', weight: 'High' },
        { name: 'Prescription Coverage', weight: 'Medium' },
        { name: 'Customer Service', weight: 'Medium' },
        { name: 'Preventive Care', weight: 'Medium' },
      ],
      companies: [
        { name: 'Kaiser Permanente', rating: 4.7, price: '$$', bestFor: 'Integrated Care', pros: ['Top-rated care', 'Integrated system', 'Preventive focus'], cons: ['Limited service areas', 'No out-of-network'] },
        { name: 'Blue Cross Blue Shield', rating: 4.4, price: '$$$', bestFor: 'Network Size', pros: ['Largest network', 'Nationwide coverage', 'Many plan options'], cons: ['Cost varies widely', 'Complex plans'] },
        { name: 'UnitedHealthcare', rating: 4.2, price: '$$', bestFor: 'Technology', pros: ['Great online tools', 'Wellness programs', 'Wide network'], cons: ['Mixed service reviews', 'Prior auth delays'] },
        { name: 'Aetna', rating: 4.3, price: '$$', bestFor: 'Employer Plans', pros: ['Good employer options', 'Strong digital tools', 'Telehealth included'], cons: ['Network limitations'] },
      ]
    },
    life: {
      factors: [
        { name: 'Financial Strength', weight: 'High' },
        { name: 'Policy Options', weight: 'High' },
        { name: 'Premium Rates', weight: 'High' },
        { name: 'Rider Availability', weight: 'Medium' },
        { name: 'Application Process', weight: 'Medium' },
        { name: 'Customer Service', weight: 'Medium' },
      ],
      companies: [
        { name: 'Northwestern Mutual', rating: 4.8, price: '$$$', bestFor: 'Whole Life', pros: ['Top financial ratings', 'Dividend payments', 'Customizable policies'], cons: ['Higher premiums', 'Requires agent'] },
        { name: 'Haven Life', rating: 4.5, price: '$', bestFor: 'Term Life Online', pros: ['Fast online approval', 'No medical exam option', 'Competitive rates'], cons: ['Term only', 'Age limits'] },
        { name: 'New York Life', rating: 4.7, price: '$$$', bestFor: 'Dividend History', pros: ['160+ year history', 'Strong dividends', 'Many policy types'], cons: ['Higher cost', 'Agent-driven'] },
        { name: 'Policygenius', rating: 4.4, price: '$', bestFor: 'Comparison Shopping', pros: ['Multiple carriers', 'Easy comparison', 'Expert guidance'], cons: ['Not an insurer', 'Varies by partner'] },
      ]
    },
    business: {
      factors: [
        { name: 'Industry Expertise', weight: 'High' },
        { name: 'Coverage Flexibility', weight: 'High' },
        { name: 'Claims Service', weight: 'High' },
        { name: 'Price', weight: 'Medium' },
        { name: 'Bundle Options', weight: 'Medium' },
        { name: 'Risk Management', weight: 'Medium' },
      ],
      companies: [
        { name: 'The Hartford', rating: 4.6, price: '$$', bestFor: 'Small Business', pros: ['Small biz expertise', 'Bundled packages', 'Great claims'], cons: ['Not for large enterprises'] },
        { name: 'Travelers', rating: 4.5, price: '$$$', bestFor: 'Industry Coverage', pros: ['Industry-specific', 'Risk management', 'Strong financials'], cons: ['Higher premiums'] },
        { name: 'Next Insurance', rating: 4.3, price: '$', bestFor: 'Digital Experience', pros: ['Instant quotes', 'Online management', 'Affordable'], cons: ['Limited customization', 'Newer company'] },
        { name: 'Chubb', rating: 4.7, price: '$$$$', bestFor: 'High-Value Businesses', pros: ['Premium coverage', 'Global reach', 'White-glove service'], cons: ['Expensive', 'Larger businesses only'] },
      ]
    },
  };

  const faqs = [
    { q: 'How do I choose the right insurance company?', a: 'Compare companies based on: financial strength ratings (A.M. Best), customer satisfaction scores (J.D. Power), coverage options that match your needs, competitive pricing, and quality of claims service. Consider both large national carriers and regional insurers.' },
    { q: 'Is the cheapest insurance always the best?', a: 'Not necessarily. While price is important, the cheapest policy may lack adequate coverage or have poor claims service. Balance cost with coverage quality, company reputation, and your specific needs.' },
    { q: 'How often should I compare insurance quotes?', a: 'We recommend comparing quotes annually before your policy renews, and also after major life events like moving, buying a new car, getting married, or adding a teen driver to your policy.' },
    { q: 'What factors affect insurance rates the most?', a: 'For auto: driving record, age, location, vehicle type, and credit score. For home: location, home value, construction type, claims history, and credit score. Each insurer weighs these factors differently.' },
  ];

  const currentData = comparisonData[activeCategory];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header insuranceTypes={[]} states={[]} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4">
              <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
              Side-by-Side Comparison
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Compare Insurance Companies
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Unbiased comparisons of top insurance providers. Find the best coverage, 
              rates, and service for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition text-sm sm:text-base ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.name}</span>
                <span className="sm:hidden">{cat.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Factors */}
      <section className="py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">What We Compare</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentData.factors.map((factor: any) => (
                  <div key={factor.name} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-slate-900 text-sm">{factor.name}</span>
                      <span className="text-xs text-slate-500 ml-1">({factor.weight})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Cards */}
      <section className="pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {currentData.companies.map((company: any) => (
                <div key={company.name} className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">{company.name}</h3>
                      <p className="text-blue-600 text-sm font-medium">{company.bestFor}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 fill-green-600" />
                        <span className="font-bold text-green-700 text-sm">{company.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500">Price: {company.price}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Pros
                      </h4>
                      <ul className="space-y-1">
                        {company.pros.map((pro: string, i: number) => (
                          <li key={i} className="text-slate-600 text-sm pl-5 relative">
                            <span className="absolute left-0 text-green-500">+</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Cons
                      </h4>
                      <ul className="space-y-1">
                        {company.cons.map((con: string, i: number) => (
                          <li key={i} className="text-slate-600 text-sm pl-5 relative">
                            <span className="absolute left-0 text-red-500">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link 
                    href="/get-quote"
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                  >
                    Get a Quote
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="py-10 sm:py-12 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">How to Choose the Right Insurer</h2>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: Award, title: 'Check Ratings', desc: 'Look for A.M. Best A- or better, and high J.D. Power scores' },
                { icon: DollarSign, title: 'Compare Quotes', desc: 'Get at least 3-5 quotes to find the best rate for your situation' },
                { icon: Clock, title: 'Read Reviews', desc: 'Check recent customer reviews, especially about claims handling' },
              ].map((step, i) => (
                <div key={step.title} className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-blue-600 font-bold text-sm mb-2">Step {i + 1}</div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{step.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === `faq-${i}` ? null : `faq-${i}`)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4">{faq.q}</span>
                    {expandedFaq === `faq-${i}` ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === `faq-${i}` && (
                    <div className="px-5 pb-4 border-t border-slate-100">
                      <p className="text-slate-600 text-sm pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Compare Real Quotes?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Get personalized quotes from the companies compared above and see actual rates for your situation.
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

      <Footer insuranceTypes={[]} />
    </div>
  );
}
