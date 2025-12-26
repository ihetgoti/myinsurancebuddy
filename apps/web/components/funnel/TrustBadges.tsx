export default function TrustBadges() {
    const features = [
        { icon: '🏆', label: 'Top Rated' },
        { icon: '🔒', label: 'SSL Secured' },
        { icon: '⚡', label: 'Fast Quotes' },
        { icon: '💯', label: 'No Spam' },
    ];

    return (
        <section className="py-8 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Features */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 text-slate-600"
                            >
                                <span className="text-xl">{feature.icon}</span>
                                <span className="text-sm font-medium">{feature.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Featured In */}
                    <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Featured in</span>
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-bold text-slate-700">Forbes</span>
                            <span className="text-sm font-bold text-slate-700">Bloomberg</span>
                            <span className="text-sm font-bold text-slate-700 hidden sm:block">WSJ</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
