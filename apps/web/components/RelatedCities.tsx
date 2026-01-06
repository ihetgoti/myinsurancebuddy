import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

interface City {
    id: string;
    name: string;
    slug: string;
}

interface State {
    slug: string;
    name: string;
    country: { code: string };
}

interface RelatedCitiesProps {
    cities: City[];
    currentCityId?: string;
    state: State;
    insuranceTypeSlug?: string; // e.g., "car-insurance"
    title?: string;
    maxDisplay?: number;
}

export default function RelatedCities({
    cities,
    currentCityId,
    state,
    insuranceTypeSlug,
    title = "Explore Nearby Cities",
    maxDisplay = 12
}: RelatedCitiesProps) {
    // Filter out current city and limit display
    const displayCities = cities
        .filter(city => city.id !== currentCityId)
        .slice(0, maxDisplay);

    if (displayCities.length === 0) return null;

    // Build URL based on whether we have insurance type or using fallback
    const buildCityUrl = (citySlug: string) => {
        if (insuranceTypeSlug) {
            return `/${insuranceTypeSlug}/${state.country.code.toLowerCase()}/${state.slug}/${citySlug}`;
        }
        // Fallback for non-insurance pages
        return `/states/${state.country.code.toLowerCase()}/${state.slug}/${citySlug}`;
    };

    const buildStateUrl = () => {
        if (insuranceTypeSlug) {
            return `/${insuranceTypeSlug}/${state.country.code.toLowerCase()}/${state.slug}`;
        }
        return `/states/${state.country.code.toLowerCase()}/${state.slug}`;
    };

    return (
        <section className="py-12 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {displayCities.map(city => (
                        <Link
                            key={city.id}
                            href={buildCityUrl(city.slug)}
                            className="group flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all"
                        >
                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 truncate">
                                {city.name}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0" />
                        </Link>
                    ))}
                </div>

                {cities.length > maxDisplay && (
                    <div className="mt-4 text-center">
                        <Link
                            href={buildStateUrl()}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            View all cities in {state.name} →
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

