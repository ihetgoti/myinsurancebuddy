import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200">
            <div className="container mx-auto px-4 py-3">
                <ol className="flex items-center flex-wrap gap-2 text-sm">
                    <li>
                        <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors">
                            Home
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="text-slate-300">/</span>
                            {item.href && index < items.length - 1 ? (
                                <Link href={item.href} className="text-slate-500 hover:text-slate-700 transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-slate-900 font-medium">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}
