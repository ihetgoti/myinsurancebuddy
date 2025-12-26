import Link from 'next/link';

interface CTABannerProps {
    title?: string;
    subtitle?: string;
    primaryCTA?: {
        text: string;
        href: string;
    };
    secondaryCTA?: {
        text: string;
        href: string;
    };
}

export default function CTABanner({
    title = "Ready to Find Your Perfect Coverage?",
    subtitle = "Get personalized quotes from top-rated insurers in minutes. No spam, no obligations.",
    primaryCTA = { text: "Get Your Free Quote", href: "/get-quote" },
    secondaryCTA = { text: "Compare Options", href: "/compare" },
}: CTABannerProps) {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                    {/* Content */}
                    <div className="relative px-8 py-12 md:px-12 md:py-16 text-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                            {title}
                        </h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            {subtitle}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={primaryCTA.href}
                                className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                {primaryCTA.text}
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href={secondaryCTA.href}
                                className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30"
                            >
                                {secondaryCTA.text}
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 flex items-center justify-center gap-6 text-blue-100 text-sm">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Free & Fast
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                100% Secure
                            </span>
                            <span className="hidden md:flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                4.9/5 Rating
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
