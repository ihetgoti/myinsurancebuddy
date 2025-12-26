interface ContentSectionProps {
    title: string;
    content?: string;
    insuranceType: string;
    location?: string;
}

export default function ContentSection({ title, content, insuranceType, location }: ContentSectionProps) {
    const defaultContent = location
        ? `Looking for ${insuranceType.toLowerCase()} in ${location}? You've come to the right place. Our comprehensive guide covers everything you need to know about insurance coverage in your area, including local regulations, average costs, and tips for finding the best policies.

Whether you're a first-time buyer or looking to switch providers, understanding your options is crucial. ${location} has specific requirements and considerations that can affect your coverage needs and premium rates.

We've analyzed data from thousands of policies to bring you accurate, up-to-date information that helps you make informed decisions. From coverage minimums to optional add-ons, we break down the complexities of ${insuranceType.toLowerCase()} so you can focus on what matters most – protecting yourself and your loved ones.`
        : `Welcome to our comprehensive guide on ${insuranceType.toLowerCase()}. Here you'll find everything you need to know about coverage options, costs, and how to choose the right policy for your needs.

Understanding your insurance options is the first step toward making smart financial decisions. We've compiled expert insights, industry data, and practical tips to help you navigate the often confusing world of insurance.

From basic coverage requirements to advanced policy features, our guides are designed to give you the knowledge you need to make confident decisions about your insurance coverage.`;

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            {title}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg prose-slate max-w-none">
                        {(content || defaultContent).split('\n\n').map((paragraph, i) => (
                            <p
                                key={i}
                                className="text-slate-600 leading-relaxed mb-6 last:mb-0"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Key Points */}
                    <div className="mt-12 grid md:grid-cols-2 gap-6">
                        {[
                            { icon: '✓', text: 'State-specific coverage requirements' },
                            { icon: '✓', text: 'Average premium comparisons' },
                            { icon: '✓', text: 'Top-rated local providers' },
                            { icon: '✓', text: 'Money-saving tips and discounts' },
                        ].map((point, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                            >
                                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                                    {point.icon}
                                </span>
                                <span className="text-slate-700 font-medium">{point.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
