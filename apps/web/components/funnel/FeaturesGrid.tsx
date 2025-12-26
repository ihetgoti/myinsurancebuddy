interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface FeaturesGridProps {
    insuranceType: string;
    location?: string;
    customFeatures?: Feature[];
}

export default function FeaturesGrid({ insuranceType, location, customFeatures }: FeaturesGridProps) {
    const defaultFeatures: Feature[] = [
        {
            icon: '🎯',
            title: 'Tailored Coverage',
            description: `Find ${insuranceType.toLowerCase()} plans designed specifically for ${location || 'your location'}'s unique requirements.`
        },
        {
            icon: '💰',
            title: 'Compare & Save',
            description: 'Get quotes from multiple providers and save up to 40% on your premium.'
        },
        {
            icon: '📋',
            title: 'Expert Guidance',
            description: 'Our comprehensive guides help you understand exactly what coverage you need.'
        },
        {
            icon: '⚡',
            title: 'Quick Quotes',
            description: 'Get personalized quotes in minutes, not hours. No phone calls required.'
        },
        {
            icon: '🛡️',
            title: 'Trusted Providers',
            description: 'We only partner with A-rated, licensed insurance companies.'
        },
        {
            icon: '📞',
            title: '24/7 Support',
            description: 'Get help anytime with our dedicated support team and extensive resources.'
        },
    ];

    const features = customFeatures || defaultFeatures;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Everything You Need for {insuranceType}
                    </h2>
                    <p className="text-lg text-slate-600">
                        {location
                            ? `Navigate ${location}'s insurance landscape with confidence using our comprehensive tools and resources.`
                            : 'Navigate the insurance landscape with confidence using our comprehensive tools and resources.'
                        }
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">{feature.icon}</span>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover gradient */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
