import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
    title: 'Insurance Guides | MyInsuranceBuddies',
    description: 'Comprehensive insurance buying guides to help you make informed decisions.',
};

const guides = [
    { title: 'How to Choose Car Insurance', slug: 'car-insurance', description: 'Complete guide to understanding auto insurance coverage types and finding the best rates.', readTime: '8 min read' },
    { title: 'Health Insurance Explained', slug: 'health-insurance', description: 'Navigate the complexities of health insurance plans, deductibles, and networks.', readTime: '12 min read' },
    { title: 'Homeowners Insurance 101', slug: 'homeowners-insurance', description: 'Everything you need to know about protecting your home and belongings.', readTime: '10 min read' },
    { title: 'Life Insurance Basics', slug: 'life-insurance', description: 'Term vs whole life, how much coverage you need, and when to buy.', readTime: '7 min read' },
    { title: 'Understanding Renters Insurance', slug: 'renters-insurance', description: 'Why renters insurance matters and what it covers.', readTime: '5 min read' },
    { title: 'Small Business Insurance Guide', slug: 'business-insurance', description: 'Essential coverage types for protecting your business.', readTime: '9 min read' },
];

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={[]} states={[]} />

            <section className="bg-slate-900 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Insurance Guides</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Expert guides to help you understand and choose the right coverage.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {guides.map((guide) => (
                            <Link
                                key={guide.slug}
                                href={`/${guide.slug}`}
                                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100"
                            >
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                    <span className="bg-slate-100 px-2 py-1 rounded">Guide</span>
                                    <span>{guide.readTime}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{guide.title}</h3>
                                <p className="text-slate-500 text-sm mb-4">{guide.description}</p>
                                <span className="text-blue-600 font-semibold text-sm">Read Guide →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer insuranceTypes={[]} />
        </div>
    );
}
