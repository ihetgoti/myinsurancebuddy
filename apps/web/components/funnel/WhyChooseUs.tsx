interface WhyChooseUsProps {
    insuranceType: string;
    location?: string;
}

export default function WhyChooseUs({ insuranceType, location }: WhyChooseUsProps) {
    const reasons = [
        {
            icon: '🎓',
            title: 'Expert Knowledge',
            description: `Our team of licensed insurance professionals has deep expertise in ${insuranceType.toLowerCase()}${location ? ` and ${location}'s specific requirements` : ''}.`,
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: '🔍',
            title: 'Unbiased Comparisons',
            description: 'We don\'t favor any provider. Our comparisons are based on coverage quality, customer ratings, and value.',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: '📊',
            title: 'Data-Driven Insights',
            description: 'Our recommendations are backed by analysis of thousands of policies and customer experiences.',
            gradient: 'from-orange-500 to-red-500',
        },
        {
            icon: '🤝',
            title: 'Customer First',
            description: 'We exist to help you find the right coverage, not to push products. Your protection is our priority.',
            gradient: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <section className="py-20 bg-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-4 border border-blue-500/30">
                        The InsuranceBuddies Difference
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Why Thousands Trust Us for {insuranceType}
                    </h2>
                    <p className="text-lg text-slate-400">
                        {location
                            ? `We've helped residents of ${location} save millions on their insurance while getting better coverage.`
                            : 'We\'ve helped millions of Americans save on their insurance while getting better coverage.'
                        }
                    </p>
                </div>

                {/* Reasons Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {reasons.map((reason, i) => (
                        <div
                            key={i}
                            className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Icon with gradient background */}
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                <span className="text-3xl">{reason.icon}</span>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-3">
                                {reason.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {reason.description}
                            </p>

                            {/* Hover glow effect */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
