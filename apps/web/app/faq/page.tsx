'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { HelpCircle, Search, ChevronDown, Phone, Mail, MessageSquare, Shield, DollarSign, FileText, Clock, X } from 'lucide-react';

const faqCategories = [
  {
    name: 'Getting Started',
    icon: Shield,
    color: 'blue',
    faqs: [
      {
        question: 'What types of insurance do you cover?',
        answer: 'We provide comprehensive information and quote comparisons for all major insurance types including auto, home, health, life, renters, business, motorcycle, pet, and more. Our platform covers state-specific requirements and regulations for all 50 US states.'
      },
      {
        question: 'How does MyInsuranceBuddy work?',
        answer: 'We connect you with licensed insurance agents and top-rated carriers. Simply enter your information, compare personalized quotes from multiple providers, and choose the coverage that fits your needs and budget. Our service is 100% free to use.'
      },
      {
        question: 'Do I need to create an account to get quotes?',
        answer: 'No account is required to browse our resources or use our comparison tools. However, creating a free account allows you to save quotes, track your policies, and receive personalized recommendations based on your coverage needs.'
      },
      {
        question: 'Is MyInsuranceBuddy available in my state?',
        answer: 'Yes! We operate in all 50 states and Washington D.C. Our platform includes state-specific information about minimum coverage requirements, local regulations, and carrier availability for each location.'
      },
    ]
  },
  {
    name: 'Quotes & Pricing',
    icon: DollarSign,
    color: 'emerald',
    faqs: [
      {
        question: 'Are the quotes really free?',
        answer: 'Absolutely. All quote requests through our platform are completely free with no obligation. We connect you with licensed insurance agents who provide personalized quotes at no cost to you. You only pay when you decide to purchase a policy.'
      },
      {
        question: 'How accurate are your rate comparisons?',
        answer: 'Our rate comparisons are based on real-time data from insurance carriers, publicly available information, and user-reported rates. While actual premiums depend on your individual circumstances (driving record, credit score, claims history, etc.), our estimates provide a reliable starting point for comparison shopping.'
      },
      {
        question: 'Why do rates vary so much between companies?',
        answer: 'Each insurance company uses different underwriting criteria and weighs risk factors differently. Factors like your age, location, driving history, credit score, and coverage needs all impact pricing. That\'s why comparing multiple quotes is essential - you could save hundreds of dollars by switching carriers.'
      },
      {
        question: 'How do you make money if quotes are free?',
        answer: 'We may receive a referral fee when you purchase a policy through one of our partner providers. This arrangement allows us to offer our comparison service for free while maintaining editorial independence. The referral fee does not affect the price you pay for insurance.'
      },
      {
        question: 'Can I get a discount for bundling policies?',
        answer: 'Yes! Most insurance companies offer multi-policy discounts of 10-25% when you bundle auto, home, and other policies together. Our platform makes it easy to compare bundled rates from multiple carriers to maximize your savings.'
      },
    ]
  },
  {
    name: 'Coverage & Policies',
    icon: FileText,
    color: 'violet',
    faqs: [
      {
        question: 'What\'s the difference between liability and full coverage?',
        answer: 'Liability insurance covers damage and injuries you cause to others in an accident. Full coverage typically includes liability plus comprehensive and collision coverage, which pay for damage to your own vehicle regardless of fault. Full coverage is often required if you have a car loan or lease.'
      },
      {
        question: 'How much coverage do I actually need?',
        answer: 'Coverage needs vary based on your assets, risk tolerance, and state requirements. At minimum, you need your state\'s required liability limits. However, we recommend coverage that protects your assets - if you have significant savings or property, higher limits and umbrella coverage may be wise.'
      },
      {
        question: 'What factors affect my insurance premium?',
        answer: 'Common factors include: your age and driving experience, driving record and claims history, credit score (in most states), vehicle type and safety features, annual mileage, coverage limits and deductibles, location, and marital status. Each factor\'s impact varies by carrier.'
      },
      {
        question: 'Can I purchase insurance directly through your site?',
        answer: 'We do not sell insurance directly. We connect you with licensed agents and insurance providers who can help you purchase the coverage you need. This ensures you receive personalized guidance and can ask questions before making a decision.'
      },
      {
        question: 'How do deductibles work?',
        answer: 'A deductible is the amount you pay out of pocket before your insurance coverage kicks in. For example, with a $500 deductible, you\'d pay the first $500 of a claim. Higher deductibles typically mean lower premiums, but you\'ll pay more when filing a claim.'
      },
    ]
  },
  {
    name: 'Account & Security',
    icon: Clock,
    color: 'amber',
    faqs: [
      {
        question: 'Is my personal information secure?',
        answer: 'Absolutely. We use industry-standard 256-bit SSL encryption to protect your personal information. We never sell your data to third parties without your explicit consent, and we comply with all applicable privacy laws including CCPA and GDPR.'
      },
      {
        question: 'How often is your information updated?',
        answer: 'Our team updates insurance information regularly to reflect changes in state laws, carrier rates, and provider offerings. State requirement pages are reviewed and updated at least quarterly, while rate information is refreshed as carriers provide updates.'
      },
      {
        question: 'Can I opt out of marketing communications?',
        answer: 'Yes, you can unsubscribe from marketing emails at any time by clicking the unsubscribe link in any email or updating your preferences in your account settings. Note that you may still receive transactional emails related to your quote requests.'
      },
      {
        question: 'What happens to my data if I delete my account?',
        answer: 'If you request account deletion, we remove your personal information from our active systems within 30 days. Some data may be retained for legal compliance purposes as required by law, but it will not be used for marketing or shared with third parties.'
      },
    ]
  },
  {
    name: 'Support & Issues',
    icon: MessageSquare,
    color: 'rose',
    faqs: [
      {
        question: 'What if I have a complaint about an insurance provider?',
        answer: 'For issues with insurance providers, we recommend contacting your state\'s Department of Insurance, which regulates insurance companies and handles consumer complaints. We can help you find the appropriate contact information for your state\'s insurance commissioner.'
      },
      {
        question: 'I found an error on your site. How do I report it?',
        answer: 'We appreciate your help in keeping our information accurate! Please use our contact form or email us at support@myinsurancebuddies.com with details about the error. Include the page URL and a description of the issue, and we\'ll investigate promptly.'
      },
      {
        question: 'How can I contact customer support?',
        answer: 'You can reach our support team by phone at 1-855-205-2412 (Mon-Fri 8am-8pm ET), by email at support@myinsurancebuddies.com, or through our online contact form. We typically respond to emails within 24 business hours.'
      },
      {
        question: 'Do you have licensed insurance agents on staff?',
        answer: 'While our content team includes licensed insurance professionals who review our educational materials, we connect you with licensed agents at our partner insurance carriers and agencies when you request quotes. All agents are licensed in their respective states.'
      },
    ]
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allFaqs = faqCategories.flatMap((cat, catIndex) =>
    cat.faqs.map((faq, faqIndex) => ({
      ...faq,
      category: cat.name,
      id: `${catIndex}-${faqIndex}`
    }))
  );

  const filteredFaqs = searchTerm
    ? allFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header insuranceTypes={[]} states={[]} />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              Help Center
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10">
              Find answers to common questions about insurance, our services, and how to get the best coverage for your needs.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 sm:py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {filteredFaqs && (
        <section className="py-8 sm:py-12 bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for &ldquo;{searchTerm}&rdquo;
            </h2>
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10 sm:py-12">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-sm sm:text-base">No matching questions found. Try different keywords or browse categories below.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleItem(`search-${faq.id}`)}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-start justify-between gap-4 hover:bg-slate-100 transition"
                    >
                      <div>
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{faq.category}</span>
                        <h3 className="font-bold text-slate-900 mt-1 text-sm sm:text-base">{faq.question}</h3>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 mt-1 ${openItems[`search-${faq.id}`] ? 'rotate-180' : ''}`} />
                    </button>
                    {openItems[`search-${faq.id}`] && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                        <p className="text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 sm:mt-6 text-indigo-600 font-semibold hover:underline text-sm sm:text-base"
            >
              Clear search and browse all categories
            </button>
          </div>
        </section>
      )}

      {/* FAQ Categories */}
      {!filteredFaqs && (
        <section className="py-10 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {faqCategories.map((category, catIndex) => {
              const Icon = category.icon;
              return (
                <div key={category.name} className="mb-8 sm:mb-12">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                      category.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      category.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                      category.color === 'violet' ? 'bg-violet-100 text-violet-600' :
                      category.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                      'bg-rose-100 text-rose-600'
                    }`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900">{category.name}</h2>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {category.faqs.map((faq, faqIndex) => {
                      const itemId = `${catIndex}-${faqIndex}`;
                      return (
                        <div key={itemId} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
                          <button
                            onClick={() => toggleItem(itemId)}
                            className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                          >
                            <span className="font-semibold text-slate-900 text-sm sm:text-base pr-2">{faq.question}</span>
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${openItems[itemId] ? 'rotate-180' : ''}`} />
                          </button>
                          {openItems[itemId] && (
                            <div className="px-4 sm:px-6 pb-4 sm:pb-5 border-t border-slate-100 bg-slate-50">
                              <p className="text-slate-600 leading-relaxed pt-3 sm:pt-4 text-sm">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-10 sm:py-12 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Still Have Questions?</h2>
            <p className="text-slate-600 text-base sm:text-lg">Our team of insurance experts is here to help you find the answers you need.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <a href="tel:1-855-205-2412" className="group bg-slate-50 rounded-2xl p-5 sm:p-6 text-center hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">Call Us</h3>
              <p className="text-slate-500 text-xs mb-2">Mon-Fri, 8am-8pm ET</p>
              <span className="text-blue-600 font-bold text-sm sm:text-base">1-855-205-2412</span>
            </a>
            <a href="mailto:support@myinsurancebuddies.com" className="group bg-slate-50 rounded-2xl p-5 sm:p-6 text-center hover:bg-emerald-50 hover:border-emerald-200 border-2 border-transparent transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">Email Us</h3>
              <p className="text-slate-500 text-xs mb-2">Response within 24 hours</p>
              <span className="text-emerald-600 font-bold text-xs sm:text-sm">support@myinsurancebuddies.com</span>
            </a>
            <Link href="/contact" className="group bg-slate-50 rounded-2xl p-5 sm:p-6 text-center hover:bg-violet-50 hover:border-violet-200 border-2 border-transparent transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base">Contact Form</h3>
              <p className="text-slate-500 text-xs mb-2">Send us a message</p>
              <span className="text-violet-600 font-bold text-sm sm:text-base">Get in Touch</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={[]} />
    </div>
  );
}
