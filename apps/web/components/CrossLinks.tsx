import Link from 'next/link';

interface CrossLink {
    label: string;
    href: string;
}

interface CrossLinksProps {
    title: string;
    links: CrossLink[];
    variant?: 'default' | 'compact';
}

export default function CrossLinks({ title, links, variant = 'default' }: CrossLinksProps) {
    if (links.length === 0) return null;

    if (variant === 'compact') {
        return (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">{title}</h4>
                <div className="flex flex-wrap gap-2">
                    {links.slice(0, 8).map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="py-12 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4">
                <h3 className="text-xl font-bold text-slate-900 mb-6">{title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {links.slice(0, 12).map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            className="p-3 bg-white rounded-lg border border-slate-200 text-sm text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all text-center"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                {links.length > 12 && (
                    <div className="text-center mt-6">
                        <span className="text-sm text-slate-500">
                            and {links.length - 12} more...
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}

// Helper functions to generate cross-link data
export function generateOtherInsuranceLinks(city: string, state: string, stateSlug: string, countryCode: string, insuranceTypes: Array<{ slug: string; name: string }>) {
    return insuranceTypes.map(type => ({
        label: type.name,
        href: `/${type.slug}/${countryCode}/${stateSlug}`,
    }));
}

export function generateNearbyCitiesLinks(cities: Array<{ name: string; slug: string }>, stateSlug: string, countryCode: string, insuranceSlug: string) {
    return cities.map(city => ({
        label: city.name,
        href: `/${insuranceSlug}/${countryCode}/${stateSlug}/${city.slug}`,
    }));
}

export function generateOtherStatesLinks(states: Array<{ name: string; slug: string; country: { code: string } }>, insuranceSlug: string) {
    return states.map(state => ({
        label: state.name,
        href: `/${insuranceSlug}/${state.country.code}/${state.slug}`,
    }));
}
