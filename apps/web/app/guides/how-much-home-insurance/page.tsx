import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Home, ArrowRight, CheckCircle, Shield, AlertTriangle,
  DollarSign, FileText, Clock, Calculator, TrendingUp,
  Scale, Package, Building2, HelpCircle, BarChart3
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'How Much Home Insurance Do You Need? | Complete Coverage Guide | MyInsuranceBuddy',
  description: 'Learn how to calculate your home insurance needs. Understand replacement cost vs market value, coverage limits, personal property coverage, and get the right protection.',
  keywords: 'how much home insurance do I need, home insurance coverage calculator, replacement cost vs market value, dwelling coverage, personal property insurance',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function HowMuchHomeInsurancePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4" />
              Home Insurance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              How Much Home Insurance Do You Need?
            </h1>
            <p className="text-emerald-100 text-lg mb-6">
              A complete guide to calculating the right coverage for your home, belongings, and financial protection.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-emerald-200 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 min read</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Intermediate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Buying home insurance isn't just about meeting your mortgage lender's requirements—it's about protecting 
                your most valuable asset and your family's financial security. But how do you know if you have enough coverage? 
                This comprehensive guide will help you calculate exactly how much home insurance you need.
              </p>

              {/* Quick Answer Box */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  Quick Answer: The 80% Rule
                </h3>
                <p className="text-slate-700 mb-4">
                  Most insurance experts recommend carrying dwelling coverage equal to at least <strong>80% of your home's replacement cost</strong>. 
                  However, for full protection without coinsurance penalties, 100% replacement cost coverage is ideal.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4">
                    <span className="font-semibold text-slate-900">Minimum Recommended:</span>
                    <p className="text-slate-600">80% of replacement cost</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <span className="font-semibold text-slate-900">Ideal Coverage:</span>
                    <p className="text-slate-600">100% of replacement cost + 20-30% extended replacement cost</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Understanding Replacement Cost vs. Market Value</h2>
              
              <p className="text-slate-600 mb-6">
                One of the biggest mistakes homeowners make is confusing their home's market value with its replacement cost. 
                These are fundamentally different numbers, and understanding the distinction is crucial.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900">Replacement Cost</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    The cost to rebuild your home from scratch using similar materials and quality, 
                    at current construction prices.
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Includes labor and materials</li>
                    <li>• Based on current building costs</li>
                    <li>• Excludes land value</li>
                    <li>• Affected by construction inflation</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Market Value</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    What your home would sell for on the real estate market, including the land it sits on.
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Includes land value</li>
                    <li>• Based on buyer demand</li>
                    <li>• Affected by location desirability</li>
                    <li>• Includes emotional/market factors</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Why This Matters</h4>
                    <p className="text-slate-600 text-sm">
                      In many areas, market value is significantly higher than replacement cost due to land values. 
                      However, in some markets, replacement cost can exceed market value, especially for older homes 
                      or in areas with high construction costs. Your insurance should cover the cost to rebuild, not buy.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Calculate Your Dwelling Coverage</h2>

              <p className="text-slate-600 mb-6">
                Dwelling coverage (Coverage A) is the foundation of your home insurance policy. It covers the physical 
                structure of your home—walls, roof, floors, built-in appliances, and attached structures.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Method 1: Online Replacement Cost Calculator</h3>
              <p className="text-slate-600 mb-4">
                Many insurers and independent websites offer calculators that estimate replacement cost based on:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li>Square footage of your home</li>
                <li>Number of stories</li>
                <li>Construction type (frame, brick, etc.)</li>
                <li>Roof type and age</li>
                <li>Number of rooms, bathrooms, and special features</li>
                <li>Garage type and size</li>
                <li>Local construction costs per square foot</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Method 2: Professional Appraisal</h3>
              <p className="text-slate-600 mb-4">
                For the most accurate estimate, hire a professional appraiser or contractor who specializes in 
                reconstruction costs. They'll consider:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li>Detailed construction specifications</li>
                <li>Foundation type and condition</li>
                <li>Custom features and high-end finishes</li>
                <li>Local building codes and requirements</li>
                <li>Accessibility challenges for rebuilding</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Method 3: Insurance Company Evaluation</h3>
              <p className="text-slate-600 mb-6">
                Most insurers use their own valuation tools and may send an inspector to verify your home's features. 
                This is often the most practical approach since they're the ones providing the coverage.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Average Rebuilding Costs (Per Square Foot)
                </h4>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="font-bold text-slate-900">$100 - $150</div>
                    <div className="text-slate-600">Basic/Mid-Range</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="font-bold text-slate-900">$150 - $250</div>
                    <div className="text-slate-600">Quality/Custom</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="font-bold text-slate-900">$250 - $400+</div>
                    <div className="text-slate-600">Luxury/High-End</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">*Costs vary significantly by location and current market conditions</p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Coverage Limits: Breaking Down Your Policy</h2>

              <p className="text-slate-600 mb-6">
                A standard homeowners policy includes several types of coverage, each with its own limit. 
                Understanding these helps ensure complete protection.
              </p>

              <div className="space-y-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Home className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900">Coverage A: Dwelling</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Covers your home's physical structure. Recommended: 100% of replacement cost.
                  </p>
                  <div className="text-sm text-slate-500">
                    <strong>Typical Range:</strong> $200,000 - $1,000,000+
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900">Coverage B: Other Structures</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Detached garages, fences, sheds, gazebos. Usually 10% of dwelling coverage.
                  </p>
                  <div className="text-sm text-slate-500">
                    <strong>Adjust if:</strong> You have expensive outbuildings, pool houses, or extensive landscaping
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-slate-900">Coverage C: Personal Property</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Your belongings—furniture, clothing, electronics, appliances. Usually 50-70% of dwelling coverage.
                  </p>
                  <div className="text-sm text-slate-500">
                    <strong>Consider:</strong> Higher limits if you have valuable collections, jewelry, or art
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                    <h4 className="font-bold text-slate-900">Coverage D: Loss of Use</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Additional living expenses if your home is uninhabitable. Usually 20-30% of dwelling coverage.
                  </p>
                  <div className="text-sm text-slate-500">
                    <strong>Covers:</strong> Hotel stays, restaurant meals, temporary housing, storage
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-rose-600" />
                    <h4 className="font-bold text-slate-900">Coverage E: Personal Liability</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Legal protection if someone is injured on your property or you damage others' property.
                  </p>
                  <div className="text-sm text-slate-500">
                    <strong>Recommended:</strong> At least $300,000 - $500,000; consider umbrella policy for more
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-cyan-600" />
                    <h4 className="font-bold text-slate-900">Coverage F: Medical Payments</h4>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Covers minor medical expenses for guests injured on your property, regardless of fault.
                  </p>
                  <div className="text-sm text-slate-500">
                    <strong>Typical:</strong> $1,000 - $5,000; higher limits available
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Personal Property Coverage: How Much Do You Really Have?</h2>

              <p className="text-slate-600 mb-6">
                Most people underestimate the value of their belongings. A typical household contains $50,000 to $150,000 
                worth of personal property. Here's how to ensure you have enough coverage:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Step 1: Create a Home Inventory</h3>
              <p className="text-slate-600 mb-4">
                Document everything you own. This seems daunting, but break it down room by room:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li><strong>Photograph or video</strong> each room, opening closets and drawers</li>
                <li><strong>List major items</strong> with purchase dates and approximate values</li>
                <li><strong>Keep receipts</strong> for expensive purchases</li>
                <li><strong>Store inventory</strong> in the cloud or safe deposit box</li>
                <li><strong>Update annually</strong> or after major purchases</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Step 2: Understand Replacement Cost vs. Actual Cash Value</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Replacement Cost</h4>
                  <p className="text-sm text-slate-600">
                    Pays to replace items with new ones of similar quality. <strong>Recommended.</strong>
                  </p>
                  <p className="text-sm text-emerald-700 mt-2">
                    Your 5-year-old TV is replaced with a new comparable model.
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Actual Cash Value (ACV)</h4>
                  <p className="text-sm text-slate-600">
                    Pays depreciated value. Cheaper premiums but less payout.
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    Your 5-year-old TV is valued at its current depreciated worth.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Step 3: Special Limits for Valuable Items</h3>
              <p className="text-slate-600 mb-4">
                Standard policies have sub-limits for certain categories. Consider additional coverage for:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { item: 'Jewelry', limit: '$1,500 - $2,500' },
                  { item: 'Electronics/Computers', limit: '$2,500 - $5,000' },
                  { item: 'Firearms', limit: '$2,500 - $5,000' },
                  { item: 'Artwork/Antiques', limit: '$2,500 - $5,000' },
                  { item: 'Musical Instruments', limit: '$2,500' },
                  { item: 'Silverware/Gold', limit: '$2,500' },
                ].map((item) => (
                  <div key={item.item} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">{item.item}</span>
                    <span className="text-slate-500 text-sm">{item.limit}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Additional Coverage Options to Consider</h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Extended/Guaranteed Replacement Cost</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Provides 20-50% above your dwelling limit (extended) or unlimited coverage (guaranteed) 
                      if rebuilding costs exceed expectations due to inflation or disasters.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Inflation Guard</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Automatically increases your coverage limits annually to keep pace with construction cost inflation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Water/Sewer Backup</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Covers damage from backed-up drains or sump pump failures. Not included in standard policies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Earthquake/Flood Insurance</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Separate policies required for these perils. Consider based on your location's risk profile.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Warning Signs You're Underinsured</h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'You haven't reviewed your coverage in 3+ years',
                  'You've made significant home improvements without updating your policy',
                  'Construction costs in your area have risen significantly',
                  'Your dwelling coverage is less than 80% of replacement cost',
                  'You don't have extended replacement cost coverage',
                  'Your personal property limit seems low compared to your inventory',
                  'You have valuable items without scheduled coverage',
                ].map((sign, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{sign}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Final Recommendations</h2>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Your Home Insurance Checklist
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Dwelling coverage at 100% of replacement cost minimum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Extended replacement cost (125-150%) for inflation protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Replacement cost coverage for personal property</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Liability coverage of at least $300,000-$500,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Scheduled coverage for high-value items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Annual policy review and updates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Get the Right Coverage for Your Home</h3>
              <p className="text-emerald-100 mb-6">
                Compare home insurance quotes and find the perfect coverage for your needs.
              </p>
              <Link 
                href="/get-quote?type=home"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
              >
                Get Free Home Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/renters-insurance-worth"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Is Renters Insurance Worth It?</span>
                </Link>
                <Link 
                  href="/guides/flood-insurance-guide"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Flood Insurance Guide</span>
                </Link>
                <Link 
                  href="/guides/home-insurance-claims"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <FileText className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Filing Home Insurance Claims</span>
                </Link>
                <Link 
                  href="/guides/lower-home-premium"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-emerald-50 transition"
                >
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-slate-700">Lower Your Home Insurance Premium</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer insuranceTypes={insuranceTypes} />
    </div>
  );
}
