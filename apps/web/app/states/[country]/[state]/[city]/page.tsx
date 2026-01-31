import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Shield, ArrowRight, MapPin, FileText, Car, Home, Heart, Stethoscope, Dog, Briefcase, Bike, Plane, Ship, Umbrella, Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

const getIconForType = (slug: string, className?: string) => {
    const c = className || "w-5 h-5 sm:w-6 sm:h-6";
    switch (slug) {
        case 'car-insurance': return <Car className={c} />;
        case 'home-insurance': return <Home className={c} />;
        case 'life-insurance': return <Heart className={c} />;
        case 'health-insurance': return <Stethoscope className={c} />;
        case 'pet-insurance': return <Dog className={c} />;
        case 'business-insurance': return <Briefcase className={c} />;
        case 'motorcycle-insurance': return <Bike className={c} />;
        case 'travel-insurance': return <Plane className={c} />;
        case 'boat-insurance': return <Ship className={c} />;
        case 'umbrella-insurance': return <Umbrella className={c} />;
        default: return <Shield className={c} />;
    }
};

interface PageProps {
    params: { country: string; state: string; city: string };
}

async function getCityData(countryCode: string, stateSlug: string, citySlug: string) {
    const insuranceTypes = await prisma.insuranceType.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
    });

    const country = await prisma.country.findUnique({
        where: { code: countryCode.toLowerCase() },
    });

    if (!country) return null;

    const state = await prisma.state.findFirst({
        where: {
            slug: stateSlug.toLowerCase(),
            countryId: country.id,
            isActive: true,
        },
        include: { country: true },
    });

    if (!state) return null;

    const city = await prisma.city.findFirst({
        where: {
            slug: citySlug.toLowerCase(),
            stateId: state.id,
            isActive: true,
        },
    });

    if (!city) return null;

    const availablePages = await prisma.page.findMany({
        where: {
            cityId: city.id,
            isPublished: true,
        },
        include: {
            insuranceType: true,
        },
        distinct: ['insuranceTypeId'],
    });

    const availableInsuranceTypes = availablePages
        .map(p => p.insuranceType)
        .filter((v, i, a) => v && a.findIndex(t => t?.id === v?.id) === i)
        .filter(Boolean);

    const nearbyCities = await prisma.city.findMany({
        where: {
            stateId: state.id,
            isActive: true,
            id: { not: city.id },
            pages: {
                some: { isPublished: true }
            }
        },
        orderBy: { name: 'asc' },
        take: 10,
    });

    const nearbyStates = await prisma.state.findMany({
        where: { countryId: country.id, isActive: true },
        include: { country: true },
        take: 12,
        orderBy: { name: 'asc' },
    });

    return {
        city,
        state,
        country,
        insuranceTypes,
        availableInsuranceTypes,
        nearbyCities,
        nearbyStates,
        totalPages: availablePages.length,
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const data = await getCityData(params.country, params.state, params.city);

    if (!data) {
        return { title: 'City Not Found' };
    }

    return {
        title: `${data.city.name}, ${data.state.name} Insurance | MyInsuranceBuddies`,
        description: `Find the best insurance rates in ${data.city.name}, ${data.state.name}. Compare ${data.availableInsuranceTypes.length} types of insurance coverage.`,
    };
}

export default async function CityLandingPage({ params }: PageProps) {
    const data = await getCityData(params.country, params.state, params.city);

    if (!data) {
        notFound();
    }

    const { city, state, country, insuranceTypes, availableInsuranceTypes, nearbyCities, nearbyStates, totalPages } = data;

    return (
        <div className="min-h-screen bg-white">
            <Header insuranceTypes={insuranceTypes} states={nearbyStates} />

            {/* Hero Section */}
            <section className="bg-slate-900 py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-blue-400 mb-4 sm:mb-6">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">
                            <Link href={`/states/${country.code}/${state.slug}`} className="hover:text-blue-300 transition-colors">
                                {state.name}
                            </Link>
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                        Insurance in {city.name}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl">
                        {availableInsuranceTypes.length > 0
                            ? `Explore ${availableInsuranceTypes.length} insurance categories and ${totalPages} guides for ${city.name}, ${state.name}.`
                            : `Browse insurance options for ${city.name}, ${state.name}.`
                        }
                    </p>
                </div>
            </section>

            {/* Available Insurance Types */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
                        {availableInsuranceTypes.length > 0
                            ? 'Choose Your Insurance Type'
                            : 'Available Insurance Types'
                        }
                    </h2>

                    {availableInsuranceTypes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
                            {availableInsuranceTypes.map((type: any) => (
                                <Link
                                    key={type.id}
                                    href={`/${type.slug}/${country.code}/${state.slug}/${city.slug}`}
                                    className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all"
                                >
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                                        {getIconForType(type.slug, "w-6 h-6 sm:w-7 sm:h-7 text-blue-600")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base truncate">
                                            {type.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500">in {city.name}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 sm:py-12 bg-slate-50 rounded-lg sm:rounded-xl mb-8 sm:mb-12">
                            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3 sm:mb-4" />
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Content Coming Soon</h3>
                            <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6 px-4">We're building guides for {city.name}. Check out {state.name} in the meantime.</p>
                            <Link href={`/states/${country.code}/${state.slug}`} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm sm:text-base">
                                View {state.name} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Link>
                        </div>
                    )}

                    {/* All Insurance Types for Browsing */}
                    <div className="border-t pt-8 sm:pt-12">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6">Browse All Insurance Types</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                            {insuranceTypes.map((type: any) => {
                                const hasPages = availableInsuranceTypes.some((t: any) => t.id === type.id);
                                return (
                                    <Link
                                        key={type.id}
                                        href={`/${type.slug}/${country.code}/${state.slug}/${city.slug}`}
                                        className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-lg border transition-all ${hasPages
                                                ? 'border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50'
                                                : 'border-dashed border-slate-200 bg-slate-50 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        {getIconForType(type.slug, "w-4 h-4 sm:w-5 sm:h-5 text-slate-500")}
                                        <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">{type.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Nearby Cities */}
            {nearbyCities.length > 0 && (
                <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
                            Other Cities in {state.name}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                            {nearbyCities.map((c: any) => (
                                <Link
                                    key={c.id}
                                    href={`/states/${country.code}/${state.slug}/${c.slug}`}
                                    className="p-2.5 sm:p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all text-slate-700 font-medium text-xs sm:text-sm truncate"
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer insuranceTypes={insuranceTypes} />
        </div>
    );
}
