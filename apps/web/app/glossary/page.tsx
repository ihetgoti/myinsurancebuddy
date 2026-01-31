import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  BookOpen, ArrowRight, Search, Filter, Shield, Car, Home, Heart,
  Briefcase, Umbrella, FileText, Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Insurance Glossary | MyInsuranceBuddy - Learn Insurance Terms',
  description: 'Comprehensive insurance glossary explaining key terms and definitions. Understand deductibles, premiums, liability, coverage types, and more.',
  keywords: 'insurance glossary, insurance terms, insurance definitions, what is deductible, premium definition, liability insurance meaning',
  openGraph: {
    title: 'Insurance Glossary - Key Terms Explained',
    description: 'Understand insurance jargon with our comprehensive glossary.',
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

const glossaryTerms = [
  // A
  {
    letter: 'A',
    terms: [
      { term: 'Actual Cash Value (ACV)', definition: 'The value of property at the time of loss, calculated as replacement cost minus depreciation.', category: 'General' },
      { term: 'Actuary', definition: 'A professional who analyzes financial risk using mathematics, statistics, and financial theory.', category: 'General' },
      { term: 'Additional Insured', definition: 'A person or organization added to an insurance policy who receives coverage under the policy.', category: 'General' },
      { term: 'Adjuster', definition: 'A professional who investigates insurance claims to determine the extent of liability.', category: 'General' },
      { term: 'Adverse Selection', definition: 'When high-risk individuals are more likely to purchase insurance than low-risk individuals.', category: 'General' },
      { term: 'Agent', definition: 'A licensed professional who represents an insurance company and sells its products.', category: 'General' },
      { term: 'Aggregate Limit', definition: 'The maximum amount an insurer will pay for all covered losses during a policy period.', category: 'General' },
      { term: 'All-Risk Coverage', definition: 'Insurance that covers all risks except those specifically excluded in the policy.', category: 'Property' },
      { term: 'Annual Policy', definition: 'An insurance policy that provides coverage for one year.', category: 'General' },
      { term: 'Appraisal', definition: 'An evaluation of property to determine its value for insurance purposes.', category: 'General' },
      { term: 'Assigned Risk', definition: 'A high-risk driver who cannot obtain insurance through normal channels and is assigned to an insurer by the state.', category: 'Auto' },
      { term: 'Auto Insurance', definition: 'Insurance that provides financial protection against physical damage and bodily injury from traffic collisions.', category: 'Auto' },
    ]
  },
  // B
  {
    letter: 'B',
    terms: [
      { term: 'Beneficiary', definition: 'A person or entity designated to receive benefits from an insurance policy.', category: 'Life' },
      { term: 'Binder', definition: 'A temporary insurance contract that provides coverage until a permanent policy is issued.', category: 'General' },
      { term: 'Bodily Injury Liability', definition: 'Coverage that pays for injuries to others when you are at fault in an accident.', category: 'Auto' },
      { term: 'Broker', definition: 'An independent insurance professional who represents clients and shops multiple insurers for the best rates.', category: 'General' },
      { term: 'Bundling', definition: 'Purchasing multiple insurance policies from the same company to receive a discount.', category: 'General' },
      { term: 'Business Interruption Insurance', definition: 'Coverage that compensates for lost income when business operations are suspended.', category: 'Business' },
    ]
  },
  // C
  {
    letter: 'C',
    terms: [
      { term: 'Claim', definition: 'A formal request to an insurance company for payment or compensation for a covered loss.', category: 'General' },
      { term: 'Collision Coverage', definition: 'Auto insurance that pays for damage to your vehicle from collisions with other vehicles or objects.', category: 'Auto' },
      { term: 'Comprehensive Coverage', definition: 'Auto insurance that covers damage to your vehicle from non-collision events like theft, vandalism, or natural disasters.', category: 'Auto' },
      { term: 'Coinsurance', definition: 'A provision requiring the insured to share costs with the insurer after the deductible is met.', category: 'Health' },
      { term: 'Conditions', definition: 'The portion of an insurance policy that specifies the obligations of both the insurer and insured.', category: 'General' },
      { term: 'Copayment (Copay)', definition: 'A fixed amount paid by the insured for covered services, typically at the time of service.', category: 'Health' },
      { term: 'Coverage', definition: 'The scope of protection provided under an insurance policy.', category: 'General' },
      { term: 'Coverage Limit', definition: 'The maximum amount an insurance company will pay for a covered loss.', category: 'General' },
    ]
  },
  // D
  {
    letter: 'D',
    terms: [
      { term: 'Deductible', definition: 'The amount you must pay out-of-pocket before your insurance coverage kicks in.', category: 'General' },
      { term: 'Declarations Page', definition: 'A summary page of your insurance policy containing key information about coverage, limits, and premiums.', category: 'General' },
      { term: 'Defensive Driving', definition: 'A driving technique that reduces risk by anticipating dangerous situations and making safe decisions.', category: 'Auto' },
      { term: 'Depreciation', definition: 'The decrease in value of property over time due to wear, age, or obsolescence.', category: 'General' },
      { term: 'Disability Insurance', definition: 'Coverage that provides income replacement if you cannot work due to illness or injury.', category: 'Health' },
      { term: 'Dwelling Coverage', definition: 'Insurance that covers the physical structure of your home.', category: 'Home' },
    ]
  },
  // E
  {
    letter: 'E',
    terms: [
      { term: 'Endorsement', definition: 'A written amendment to an insurance policy that changes the coverage or terms.', category: 'General' },
      { term: 'Exclusion', definition: 'Specific conditions or circumstances listed in a policy that are not covered.', category: 'General' },
      { term: 'Experience Modification Factor', definition: 'A multiplier used to calculate workers compensation premiums based on claims history.', category: 'Business' },
      { term: 'Exposure', definition: 'The possibility of loss or damage.', category: 'General' },
      { term: 'Extended Coverage', definition: 'Additional protection beyond standard policy limits.', category: 'General' },
    ]
  },
  // F
  {
    letter: 'F',
    terms: [
      { term: 'Face Value', definition: 'The amount of money payable to beneficiaries upon the death of the insured in a life insurance policy.', category: 'Life' },
      { term: 'FAIR Plan', definition: 'A state-run insurance pool providing coverage for high-risk properties.', category: 'Property' },
      { term: 'Floater', definition: 'Additional coverage for movable property regardless of location.', category: 'Property' },
      { term: 'Flood Insurance', definition: 'Coverage for damage caused by flooding, typically not covered by standard homeowners policies.', category: 'Home' },
      { term: 'Full Coverage', definition: 'Auto insurance that includes liability, collision, and comprehensive coverage.', category: 'Auto' },
    ]
  },
  // G
  {
    letter: 'G',
    terms: [
      { term: 'GAP Insurance', definition: 'Coverage that pays the difference between what you owe on a vehicle and its actual cash value if totaled.', category: 'Auto' },
      { term: 'General Liability Insurance', definition: 'Business insurance that covers bodily injury, property damage, and personal injury claims.', category: 'Business' },
      { term: 'Grace Period', definition: 'The time after a premium due date during which coverage continues without penalty.', category: 'General' },
      { term: 'Guaranteed Replacement Cost', definition: 'Coverage that pays to rebuild your home regardless of policy limits.', category: 'Home' },
    ]
  },
  // H
  {
    letter: 'H',
    terms: [
      { term: 'Hazard', definition: 'A condition that increases the likelihood or severity of a loss.', category: 'General' },
      { term: 'Health Insurance', definition: 'Coverage that pays for medical and surgical expenses.', category: 'Health' },
      { term: 'High-Risk Driver', definition: 'A driver with a history of accidents, violations, or other factors indicating higher probability of future claims.', category: 'Auto' },
      { term: 'HMO (Health Maintenance Organization)', definition: 'A health insurance plan that requires members to use a network of providers.', category: 'Health' },
      { term: 'Homeowners Insurance', definition: 'Coverage that protects your home and belongings against various perils.', category: 'Home' },
      { term: 'Hurricane Deductible', definition: 'A separate, typically higher deductible that applies specifically to hurricane damage.', category: 'Home' },
    ]
  },
  // I
  {
    letter: 'I',
    terms: [
      { term: 'Indemnity', definition: 'Compensation for damages or loss.', category: 'General' },
      { term: 'Independent Agent', definition: 'An insurance agent who represents multiple insurance companies.', category: 'General' },
      { term: 'Inflation Guard', definition: 'An endorsement that automatically increases coverage limits to keep pace with inflation.', category: 'General' },
      { term: 'Insurable Interest', definition: 'The financial stake a person has in property or life being insured.', category: 'General' },
      { term: 'Insurance Score', definition: 'A numerical rating based on credit information used to predict insurance risk.', category: 'General' },
      { term: 'Insured', definition: 'The person or entity covered by an insurance policy.', category: 'General' },
      { term: 'Insurer', definition: 'The company that provides insurance coverage and pays claims.', category: 'General' },
    ]
  },
  // L
  {
    letter: 'L',
    terms: [
      { term: 'Lapse', definition: 'The termination of an insurance policy due to non-payment of premiums.', category: 'General' },
      { term: 'Liability Coverage', definition: 'Insurance that pays for bodily injury or property damage you cause to others.', category: 'General' },
      { term: 'Libel', definition: 'Written defamation that damages a person\'s reputation.', category: 'General' },
      { term: 'Life Insurance', definition: 'Coverage that pays a benefit to beneficiaries upon the death of the insured.', category: 'Life' },
      { term: 'Limit of Liability', definition: 'The maximum amount an insurer will pay for a covered claim.', category: 'General' },
      { term: 'Loss', definition: 'Physical damage to property or bodily injury that triggers insurance coverage.', category: 'General' },
      { term: 'Loss of Use', definition: 'Coverage that pays additional living expenses when your home is uninhabitable due to a covered loss.', category: 'Home' },
    ]
  },
  // M
  {
    letter: 'M',
    terms: [
      { term: 'Medical Payments Coverage', definition: 'Auto insurance that pays medical expenses for you and passengers regardless of fault.', category: 'Auto' },
      { term: 'Medicare', definition: 'Federal health insurance program for people aged 65+ and certain younger people with disabilities.', category: 'Health' },
      { term: 'Medicaid', definition: 'State and federal program providing health coverage for low-income individuals.', category: 'Health' },
      { term: 'Mitigation', definition: 'Actions taken to reduce the severity of a loss.', category: 'General' },
      { term: 'Mortgage Insurance', definition: 'Coverage that pays the lender if the borrower defaults on a mortgage.', category: 'Home' },
    ]
  },
  // N
  {
    letter: 'N',
    terms: [
      { term: 'Named Peril', definition: 'A specific risk or cause of loss listed in an insurance policy that is covered.', category: 'General' },
      { term: 'Negligence', definition: 'Failure to exercise reasonable care, resulting in damage or injury.', category: 'General' },
      { term: 'No-Fault Insurance', definition: 'Auto insurance that pays for your injuries regardless of who caused the accident.', category: 'Auto' },
      { term: 'Non-Renewal', definition: 'When an insurer chooses not to renew a policy at the end of its term.', category: 'General' },
    ]
  },
  // P
  {
    letter: 'P',
    terms: [
      { term: 'Peril', definition: 'A specific cause of loss covered by an insurance policy.', category: 'General' },
      { term: 'Personal Articles Floater', definition: 'Additional coverage for valuable personal property.', category: 'Property' },
      { term: 'Personal Injury Protection (PIP)', definition: 'Auto insurance that covers medical expenses and lost wages regardless of fault.', category: 'Auto' },
      { term: 'Personal Liability', definition: 'Coverage that protects you against claims for bodily injury or property damage you cause.', category: 'General' },
      { term: 'Policy', definition: 'A written contract between an insurer and insured detailing coverage terms.', category: 'General' },
      { term: 'Policyholder', definition: 'The person or entity who owns an insurance policy.', category: 'General' },
      { term: 'Premium', definition: 'The amount paid for an insurance policy, typically monthly, quarterly, or annually.', category: 'General' },
      { term: 'Proof of Loss', definition: 'A formal statement provided by the insured to the insurer detailing a claim.', category: 'General' },
      { term: 'Property Damage Liability', definition: 'Auto insurance that pays for damage you cause to others\' property.', category: 'Auto' },
      { term: 'PPO (Preferred Provider Organization)', definition: 'A health plan that offers more flexibility in choosing healthcare providers.', category: 'Health' },
    ]
  },
  // R
  {
    letter: 'R',
    terms: [
      { term: 'Rate', definition: 'The cost of insurance per unit of coverage.', category: 'General' },
      { term: 'Rated Policy', definition: 'An insurance policy issued with higher premiums due to increased risk.', category: 'General' },
      { term: 'Reinstatement', definition: 'Restoring a lapsed insurance policy to active status.', category: 'General' },
      { term: 'Renewal', definition: 'Continuing an insurance policy for another term.', category: 'General' },
      { term: 'Renters Insurance', definition: 'Coverage that protects a tenant\'s personal property and provides liability protection.', category: 'Home' },
      { term: 'Replacement Cost', definition: 'The cost to replace damaged property with new property of similar kind and quality.', category: 'General' },
      { term: 'Rider', definition: 'An addition to an insurance policy that modifies coverage or terms.', category: 'General' },
      { term: 'Risk', definition: 'The chance of loss or damage.', category: 'General' },
    ]
  },
  // S
  {
    letter: 'S',
    terms: [
      { term: 'SR-22', definition: 'A certificate of financial responsibility required for high-risk drivers.', category: 'Auto' },
      { term: 'Schedule', definition: 'A list of items covered under a policy, often with specific values.', category: 'General' },
      { term: 'Slander', definition: 'Spoken defamation that damages a person\'s reputation.', category: 'General' },
      { term: 'Subrogation', definition: 'The insurer\'s right to pursue a third party that caused an insurance loss.', category: 'General' },
      { term: 'Supplemental Coverage', definition: 'Additional insurance beyond primary coverage.', category: 'General' },
      { term: 'Surety Bond', definition: 'A guarantee that specific obligations will be fulfilled.', category: 'Business' },
    ]
  },
  // T
  {
    letter: 'T',
    terms: [
      { term: 'Term Life Insurance', definition: 'Life insurance that provides coverage for a specific period of time.', category: 'Life' },
      { term: 'Total Loss', definition: 'When damage to property exceeds its value, or repair is not feasible.', category: 'General' },
      { term: 'Towing and Labor Coverage', definition: 'Auto insurance that pays for towing and minor roadside repairs.', category: 'Auto' },
      { term: 'Umbrella Insurance', definition: 'Extra liability coverage that goes beyond the limits of other policies.', category: 'General' },
      { term: 'Underinsured Motorist Coverage', definition: 'Auto insurance that pays when the at-fault driver has insufficient coverage.', category: 'Auto' },
      { term: 'Underwriting', definition: 'The process of evaluating risk and determining whether to provide insurance.', category: 'General' },
      { term: 'Uninsured Motorist Coverage', definition: 'Auto insurance that pays for injuries caused by a driver with no insurance.', category: 'Auto' },
    ]
  },
  // W
  {
    letter: 'W',
    terms: [
      { term: 'Waiting Period', definition: 'The time that must pass before certain coverage becomes effective.', category: 'General' },
      { term: 'Waiver', definition: 'A voluntary relinquishment of a known right.', category: 'General' },
      { term: 'Whole Life Insurance', definition: 'Permanent life insurance that provides coverage for life and builds cash value.', category: 'Life' },
      { term: 'Workers Compensation', definition: 'Insurance that provides benefits to employees injured on the job.', category: 'Business' },
    ]
  },
];

const categoryColors: Record<string, string> = {
  'General': 'bg-slate-100 text-slate-700',
  'Auto': 'bg-blue-100 text-blue-700',
  'Home': 'bg-emerald-100 text-emerald-700',
  'Health': 'bg-rose-100 text-rose-700',
  'Life': 'bg-violet-100 text-violet-700',
  'Business': 'bg-amber-100 text-amber-700',
  'Property': 'bg-cyan-100 text-cyan-700',
};

export default async function GlossaryPage() {
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
              100+ Terms Defined
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Insurance Glossary
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Understand insurance terminology with our comprehensive glossary. 
              Clear definitions for complex insurance terms.
            </p>
          </div>
        </div>
      </section>

      {/* Alphabet Navigation */}
      <section className="sticky top-0 z-40 bg-white border-y border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-slate-500 font-medium mr-2 flex-shrink-0">Jump to:</span>
            {glossaryTerms.map(({ letter }) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition flex-shrink-0"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Glossary Content */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            {glossaryTerms.map(({ letter, terms }) => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{letter}</span>
                  </div>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {terms.map(({ term, definition, category }) => (
                    <div 
                      key={term}
                      className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{term}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${categoryColors[category] || 'bg-slate-100 text-slate-700'}`}>
                          {category}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-10 sm:py-12 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">Explore More Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <Link 
              href="/guides"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition"
            >
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Insurance Guides</h3>
                <p className="text-slate-600 text-xs">In-depth articles & tips</p>
              </div>
            </Link>
            <Link 
              href="/faq"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition"
            >
              <Shield className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">FAQs</h3>
                <p className="text-slate-600 text-xs">Common questions</p>
              </div>
            </Link>
            <Link 
              href="/tools"
              className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition"
            >
              <Info className="w-6 h-6 text-violet-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Tools</h3>
                <p className="text-slate-600 text-xs">Calculators & resources</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Find the Right Coverage?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Now that you understand the terminology, compare quotes from top-rated providers.
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
