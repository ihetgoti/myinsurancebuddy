import Link from 'next/link';
import { Shield, ArrowRight, Car, Home, Heart, Stethoscope, Dog, Briefcase } from 'lucide-react';

interface InsuranceType {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
}

interface RelatedInsuranceTypesProps {
    insuranceTypes: InsuranceType[];
    currentTypeId?: string;
    locationPath?: string; // e.g., "/us/texas" or "/us/texas/austin"
    title?: string;
}

const getIcon = (slug: string) => {
    const iconClass = "w-5 h-5";
    if (slug.includes('auto') || slug.includes('car')) return <Car className={iconClass} />;
    if (slug.includes('home')) return <Home className={iconClass} />;
    if (slug.includes('life')) return <Heart className={iconClass} />;
    if (slug.includes('health')) return <Stethoscope className={iconClass} />;
    if (slug.includes('pet')) return <Dog className={iconClass} />;
    if (slug.includes('business')) return <Briefcase className={iconClass} />;
    return <Shield className={iconClass} />;
};

export default function RelatedInsuranceTypes({
    insuranceTypes,
    currentTypeId,
    locationPath = '',
    title = "Other Insurance Types"
}: RelatedInsuranceTypesProps) {
    const displayTypes = insuranceTypes.filter(type => type.id !== currentTypeId);

    if (displayTypes.length === 0) return null;

    return (
        <section className="py-12 bg-white border-t border-slate-200">
            <div className="container mx-auto px-4">
                <h3 className="text-lg font-bold text-slate-900 mb-6">{title}</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayTypes.map(type => (
                        <Link
                            key={type.id}
                            href={`/${type.slug}${locationPath}`}
                            className="group flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                {getIcon(type.slug)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="font-medium text-slate-900 group-hover:text-blue-700 block truncate">
                                    {type.name}
                                </span>
                                <span className="text-xs text-slate-400">Compare rates</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
