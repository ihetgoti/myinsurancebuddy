import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Home, ArrowRight, CheckCircle, Shield, AlertTriangle,
  DollarSign, FileText, Clock, Droplets, Building2,
  Waves, HelpCircle, MapPin, TrendingUp, Scale, Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Flood Insurance Guide 2024 | What Homeowners Need to Know | MyInsuranceBuddy',
  description: 'Complete guide to flood insurance: what it covers, who needs it, FEMA vs private options, exclusions, cost factors, and how to protect your home from flood damage.',
  keywords: 'flood insurance guide, what does flood insurance cover, FEMA flood insurance, private flood insurance, do I need flood insurance, flood insurance cost',
};

async function getData() {
  const [insuranceTypes, states] = await Promise.all([
    prisma.insuranceType.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.state.findMany({ where: { isActive: true }, include: { country: true }, take: 12 }),
  ]);
  return { insuranceTypes, states };
}

export default async function FloodInsuranceGuidePage() {
  const { insuranceTypes, states } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <Header insuranceTypes={insuranceTypes} states={states} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Droplets className="w-4 h-4" />
              Home Insurance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Flood Insurance: The Complete Guide
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Everything homeowners need to know about protecting their property from flood damage, 
              including coverage options, costs, and whether you really need it.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-blue-200 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min read</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Intermediate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Warning */}
      <section className="py-6 bg-red-50 border-b border-red-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 font-semibold">Critical Fact</p>
              <p className="text-red-800 text-sm">
                Standard homeowners insurance does NOT cover flood damage. Just one inch of water 
                can cause $25,000+ in damage. If you don't have flood insurance, you're paying out of pocket.
              </p>
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
                Floods are the most common and costly natural disasters in the United States. 
                Yet many homeowners remain unprotected because they don't realize their standard 
                insurance policy excludes flood damage. This guide covers everything you need to 
                know about flood insurance—from what it covers to how to get it.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Is Flood Insurance?</h2>

              <p className="text-slate-600 mb-6">
                Flood insurance is a specialized policy that covers physical damage to your property 
                and belongings caused by flooding. Unlike standard homeowners insurance, it's specifically 
                designed to protect against water damage from natural flooding events.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  What Counts as a "Flood"?
                </h3>
                <p className="text-slate-700 mb-3">
                  For insurance purposes, a flood is defined as:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Waves className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                    <span>Water covering normally dry land affecting two or more acres <strong>OR</strong> two or more properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Waves className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                    <span>Overflow of inland or tidal waters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Waves className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                    <span>Unusual and rapid accumulation of surface waters from any source</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Waves className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                    <span>Mudflows caused by flooding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Waves className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                    <span>Collapse of land along a body of water from erosion</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Does Flood Insurance Cover?</h2>

              <p className="text-slate-600 mb-6">
                Flood insurance through the National Flood Insurance Program (NFIP) has two components: 
                building coverage and contents coverage. You can purchase one or both.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-bold text-slate-900">Building Coverage</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Protects the physical structure and foundation:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Foundation, walls, and staircases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Electrical and plumbing systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>HVAC equipment and water heaters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Built-in appliances (dishwashers, stoves)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Permanently installed carpeting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Detached garages (limited)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Permanently installed cabinets and bookcases</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <span className="text-sm font-semibold text-emerald-800">Maximum Coverage:</span>
                    <span className="text-sm text-emerald-700 ml-2">$250,000 (residential)</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="w-6 h-6 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Contents Coverage</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Protects your personal belongings:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Clothing, furniture, and electronics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Portable appliances (washers, dryers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Freezers and food inside them</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Certain valuable items (up to limits)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Window AC units</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Carpets not covered by building coverage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Clothing and personal items</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <span className="text-sm font-semibold text-blue-800">Maximum Coverage:</span>
                    <span className="text-sm text-blue-700 ml-2">$100,000</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Flood Insurance Does NOT Cover</h2>

              <p className="text-slate-600 mb-6">
                Understanding exclusions is just as important as knowing what's covered. Here are the key gaps:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { item: 'Moisture/Mold/Mildew', desc: 'Damage that could have been avoided by the homeowner' },
                  { item: 'Currency and Valuable Papers', desc: 'Money, stock certificates, bonds' },
                  { item: 'Outdoor Property', desc: 'Trees, plants, decks, patios, fences, pools' },
                  { item: 'Living Expenses', desc: 'Temporary housing costs while home is repaired' },
                  { item: 'Vehicles', desc: 'Cars, motorcycles, ATVs (covered by auto insurance)' },
                  { item: 'Basements (Limited)', desc: 'Personal belongings in basements have limited coverage' },
                  { item: 'Business Property', desc: 'Home business equipment and inventory' },
                  { item: 'Earth Movement', desc: 'Even if caused by flooding' },
                ].map((item) => (
                  <div key={item.item} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 text-sm">{item.item}</span>
                      <p className="text-slate-600 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-8">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Basement Coverage Special Rules</h4>
                    <p className="text-slate-600 text-sm">
                      Basements have unique limitations. While building coverage applies to foundation, 
                      electrical, and HVAC in basements, contents coverage is extremely limited. Personal 
                      belongings stored in basements are generally not covered. Consider this when storing 
                      valuable items.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Needs Flood Insurance?</h2>

              <p className="text-slate-600 mb-6">
                The short answer: Everyone should consider it. Here's why:
              </p>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  The Flood Risk Reality
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-700 mb-1">25%</div>
                    <p className="text-slate-600">of flood claims come from <strong>low to moderate risk</strong> areas</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-700 mb-1">$25,000</div>
                    <p className="text-slate-600">average damage from just <strong>one inch</strong> of water</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Required Flood Insurance</h3>
              <p className="text-slate-600 mb-4">
                You're typically required to have flood insurance if:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li>Your home is in a high-risk flood zone (A or V zones) and you have a government-backed mortgage</li>
                <li>Your lender requires it as a condition of your conventional loan</li>
                <li>You received federal disaster assistance and want to remain eligible for future assistance</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Strongly Recommended For</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Properties near bodies of water (rivers, lakes, coasts)',
                  'Homes in areas with heavy rainfall or snowmelt',
                  'Properties with drainage issues or poor grading',
                  'Homes in wildfire burn scar areas (mudflow risk)',
                  'Properties downstream from dams or levees',
                  'Anyone who cannot afford a major unexpected expense',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">How to Check Your Flood Risk</h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">FEMA Flood Map Service Center</h4>
                    <p className="text-slate-600 text-sm mb-3">
                      Visit <strong>fema.gov/flood-maps</strong> to check your property's flood zone designation. 
                      But remember: flood maps don't show all risks and haven't been updated for climate change impacts.
                    </p>
                    <div className="text-sm text-slate-500">
                      Flood zones explained:
                      <ul className="mt-2 space-y-1">
                        <li><strong>Zone X (shaded):</strong> 0.2% annual chance (500-year floodplain)</li>
                        <li><strong>Zone X (unshaded):</strong> Minimal flood hazard</li>
                        <li><strong>Zones A, AE, AH, AO:</strong> 1% annual chance (100-year floodplain)</li>
                        <li><strong>Zones V, VE:</strong> Coastal high hazard areas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">FEMA vs. Private Flood Insurance</h2>

              <p className="text-slate-600 mb-6">
                You have two main options for flood insurance: the government-backed NFIP or private insurers. 
                Each has advantages.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="font-bold text-slate-900">FEMA / NFIP</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Available in all participating communities</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Backed by federal government</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Standardized rates in same zone</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Coverage capped at $250K/$100K</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">30-day waiting period</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">No loss of use coverage</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-6 h-6 text-violet-600" />
                    <h3 className="font-bold text-slate-900">Private Insurance</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Higher coverage limits available</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Often includes loss of use coverage</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">May have shorter waiting periods</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Often lower premiums for low-risk homes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Not available in all areas</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">Rates can increase at renewal</span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Much Does Flood Insurance Cost?</h2>

              <p className="text-slate-600 mb-6">
                Flood insurance costs vary widely based on your location, home characteristics, and coverage amounts. 
                FEMA's Risk Rating 2.0 now considers individual property risk factors rather than just flood zones.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 rounded-xl p-6 text-center border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-700 mb-1">$800</div>
                  <div className="text-sm text-slate-600">National Average</div>
                  <div className="text-xs text-slate-500 mt-1">per year</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700 mb-1">$400-600</div>
                  <div className="text-sm text-slate-600">Low-Risk Areas</div>
                  <div className="text-xs text-slate-500 mt-1">per year</div>
                </div>
                <div className="bg-red-50 rounded-xl p-6 text-center border border-red-200">
                  <div className="text-2xl font-bold text-red-700 mb-1">$1,200+</div>
                  <div className="text-sm text-slate-600">High-Risk Areas</div>
                  <div className="text-xs text-slate-500 mt-1">per year</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Factors That Affect Your Premium</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { factor: 'Flood Zone', impact: 'Higher risk zones = higher premiums' },
                  { factor: 'Elevation', impact: 'Homes above base flood elevation pay less' },
                  { factor: 'Home Construction', impact: 'Foundation type, number of floors matter' },
                  { factor: 'Coverage Amount', impact: 'Higher limits = higher premiums' },
                  { factor: 'Deductible', impact: 'Higher deductible = lower premium' },
                  { factor: 'Prior Claims', impact: 'Previous flood claims increase rates' },
                  { factor: 'Distance to Water', impact: 'Closer to flooding sources = higher risk' },
                  { factor: 'Mitigation Measures', impact: 'Flood vents, barriers can reduce costs' },
                ].map((item) => (
                  <div key={item.factor} className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-900 text-sm">{item.factor}</span>
                    <p className="text-slate-600 text-xs">{item.impact}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Important Considerations</h2>

              <div className="space-y-6 mb-8">
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The 30-Day Waiting Period</h4>
                      <p className="text-slate-600 text-sm">
                        Most flood insurance policies have a 30-day waiting period before coverage takes effect. 
                        Don't wait until a storm is approaching to buy coverage—it will be too late. The only 
                        exceptions are when purchasing for a new mortgage or after a flood map change.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Risk Rating 2.0</h4>
                      <p className="text-slate-600 text-sm">
                        FEMA's new pricing methodology considers individual property characteristics rather 
                        than just flood zones. This means some previously high-cost policies may now be cheaper, 
                        while others may see increases. Get a current quote to see your rate.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Federal Disaster Aid vs. Insurance</h4>
                      <p className="text-slate-600 text-sm">
                        Federal disaster assistance is NOT a substitute for flood insurance. Most disaster 
                        aid comes in the form of loans that must be repaid with interest. Grants are rare 
                        and typically average $5,000 or less—nowhere near enough to recover from major flooding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Steps to Get Flood Insurance</h2>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 mb-8">
                <ol className="space-y-4">
                  {[
                    'Assess your flood risk using FEMA maps and local knowledge',
                    'Determine how much coverage you need (up to $250K building, $100K contents for NFIP)',
                    'Contact your current insurance agent—they can usually write NFIP policies',
                    'Compare with private flood insurance options',
                    'Consider flood mitigation measures to reduce premiums',
                    'Purchase coverage (remember the 30-day waiting period!)',
                    'Review and update your policy annually',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-3">Protect Your Home From Flooding</h3>
              <p className="text-blue-100 mb-6">
                Don't wait for the next storm. Get flood insurance quotes and protect your biggest investment.
              </p>
              <Link 
                href="/get-quote?type=home"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
              >
                Get Insurance Quotes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Related Guides */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Related Guides</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  href="/guides/how-much-home-insurance"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Home className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-700">How Much Home Insurance Do You Need?</span>
                </Link>
                <Link 
                  href="/guides/renters-insurance-worth"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-700">Is Renters Insurance Worth It?</span>
                </Link>
                <Link 
                  href="/guides/home-insurance-claims"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <FileText className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-slate-700">Filing Home Insurance Claims</span>
                </Link>
                <Link 
                  href="/guides/lower-home-premium"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition"
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
