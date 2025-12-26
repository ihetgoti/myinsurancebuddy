import Link from 'next/link';

interface RelatedLink {
    href: string;
    label: string;
    icon?: string;
    description?: string;
}

interface RelatedPagesGridProps {
    title?: string;
    insuranceType?: {
        name: string;
        slug: string;
    } | null;
    otherNiches?: RelatedLink[];
    nearbyCities?: RelatedLink[];
    parentLocations?: RelatedLink[];
    nearbyStates?: RelatedLink[];
}

export default function RelatedPagesGrid({
    title = "Explore More Coverage Options",
    insuranceType,
    otherNiches = [],
    nearbyCities = [],
    parentLocations = [],
    nearbyStates = [],
}: RelatedPagesGridProps) {
    const hasContent = otherNiches.length > 0 || nearbyCities.length > 0 || parentLocations.length > 0 || nearbyStates.length > 0;

    if (!hasContent) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Discover related insurance information and coverage options in nearby areas.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Other Insurance Types */}
                    {otherNiches.length > 0 && (
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                    🛡️
                                </span>
                                Other Insurance Types
                            </h3>
                            <ul className="space-y-3">
                                {otherNiches.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all"
                                        >
                                            <span className="text-lg">{link.icon || '📋'}</span>
                                            <span className="text-slate-700 group-hover:text-blue-600 font-medium transition-colors">
                                                {link.label}
                                            </span>
                                            <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-auto group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Nearby Cities */}
                    {nearbyCities.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    📍
                                </span>
                                Nearby Cities
                            </h3>
                            <ul className="space-y-3">
                                {nearbyCities.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all"
                                        >
                                            <span className="text-slate-700 group-hover:text-blue-600 font-medium transition-colors">
                                                {link.label}
                                            </span>
                                            <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-auto group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Parent Locations / Explore More */}
                    {(parentLocations.length > 0 || nearbyStates.length > 0) && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl p-6 border border-purple-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                    🗺️
                                </span>
                                Explore More
                            </h3>
                            <ul className="space-y-3">
                                {parentLocations.map((link, i) => (
                                    <li key={`parent-${i}`}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all"
                                        >
                                            <span className="text-slate-700 group-hover:text-blue-600 font-medium transition-colors">
                                                {link.label}
                                            </span>
                                            <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-auto group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                                {nearbyStates.map((link, i) => (
                                    <li key={`state-${i}`}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all"
                                        >
                                            <span className="text-slate-700 group-hover:text-blue-600 font-medium transition-colors">
                                                {link.label}
                                            </span>
                                            <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-auto group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Browse All Link */}
                <div className="mt-12 text-center">
                    <Link
                        href={`/${insuranceType?.slug || 'insurance'}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-lg"
                    >
                        Browse All {insuranceType?.name || 'Insurance'} Locations
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
