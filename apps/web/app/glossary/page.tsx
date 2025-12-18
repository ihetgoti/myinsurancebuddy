import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Insurance Glossary | MyInsuranceBuddies',
    description: 'Definitions of common insurance terms to help you understand your coverage.',
};

const glossaryTerms = [
    { term: 'Deductible', definition: 'The amount you pay out of pocket before your insurance coverage kicks in.' },
    { term: 'Premium', definition: 'The amount you pay for your insurance policy, typically on a monthly or annual basis.' },
    { term: 'Copay', definition: 'A fixed amount you pay for a covered health service, usually at the time of service.' },
    { term: 'Coinsurance', definition: 'Your share of the costs of a covered service, calculated as a percentage of the allowed amount.' },
    { term: 'Liability Coverage', definition: 'Insurance that pays for damage or injuries you cause to others.' },
    { term: 'Collision Coverage', definition: 'Insurance that pays for damage to your vehicle from a collision, regardless of fault.' },
    { term: 'Comprehensive Coverage', definition: 'Insurance that covers damage to your vehicle from non-collision events like theft, fire, or weather.' },
    { term: 'Policy Limit', definition: 'The maximum amount your insurance company will pay for a covered claim.' },
    { term: 'Exclusion', definition: 'Specific conditions or circumstances that are not covered by your insurance policy.' },
    { term: 'Claim', definition: 'A formal request to your insurance company for coverage or compensation for a covered loss.' },
    { term: 'Underwriting', definition: 'The process insurers use to evaluate risk and determine your premium.' },
    { term: 'Rider', definition: 'An add-on to your insurance policy that provides additional coverage or benefits.' },
];

export default function GlossaryPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Insurance Glossary</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Understand common insurance terminology.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid gap-6">
                        {glossaryTerms.map((item) => (
                            <div key={item.term} className="bg-white p-6 rounded-lg border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.term}</h3>
                                <p className="text-slate-600">{item.definition}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 mb-4">Can't find a term?</p>
                        <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
                            Contact us and we'll help explain it →
                        </Link>
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
