import { User, BadgeCheck } from 'lucide-react';

interface AuthorBylineProps {
    authorName?: string;
    authorTitle?: string;
    authorImage?: string;
    reviewerName?: string;
    reviewerTitle?: string;
    className?: string;
}

export default function AuthorByline({
    authorName = 'Insurance Editorial Team',
    authorTitle = 'Licensed Insurance Experts',
    authorImage,
    reviewerName,
    reviewerTitle = 'Senior Insurance Analyst',
    className = ''
}: AuthorBylineProps) {
    return (
        <div
            className={`flex flex-wrap items-center gap-4 py-4 border-y border-slate-200 ${className}`}
            itemScope
            itemType="https://schema.org/Person"
            itemProp="author"
        >
            <div className="flex items-center gap-3">
                {authorImage ? (
                    <img
                        src={authorImage}
                        alt={authorName}
                        className="w-12 h-12 rounded-full object-cover"
                        itemProp="image"
                    />
                ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User size={24} className="text-white" />
                    </div>
                )}
                <div>
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5" itemProp="name">
                        {authorName}
                        <BadgeCheck size={16} className="text-blue-600" />
                    </p>
                    <p className="text-sm text-slate-500" itemProp="jobTitle">{authorTitle}</p>
                </div>
            </div>

            {reviewerName && (
                <>
                    <div className="hidden sm:block w-px h-10 bg-slate-200" />
                    <div
                        className="flex items-center gap-3"
                        itemScope
                        itemType="https://schema.org/Person"
                    >
                        <div className="text-xs text-slate-400 uppercase tracking-wide">Reviewed by</div>
                        <div>
                            <p className="font-medium text-slate-700 text-sm" itemProp="name">{reviewerName}</p>
                            <p className="text-xs text-slate-500" itemProp="jobTitle">{reviewerTitle}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
