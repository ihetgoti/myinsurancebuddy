import { Calendar, RefreshCw } from 'lucide-react';

interface LastUpdatedProps {
    date: string;
    showIcon?: boolean;
    variant?: 'inline' | 'badge';
    className?: string;
}

export default function LastUpdated({
    date,
    showIcon = true,
    variant = 'inline',
    className = ''
}: LastUpdatedProps) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const isoDate = new Date(date).toISOString();

    if (variant === 'badge') {
        return (
            <div
                className={`inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-medium ${className}`}
            >
                {showIcon && <RefreshCw size={12} />}
                <span>Updated</span>
                <time dateTime={isoDate} itemProp="dateModified" className="font-semibold">
                    {formattedDate}
                </time>
            </div>
        );
    }

    return (
        <p className={`text-sm text-slate-500 flex items-center gap-1.5 ${className}`}>
            {showIcon && <Calendar size={14} className="text-slate-400" />}
            <span>Last updated:</span>
            <time dateTime={isoDate} itemProp="dateModified" className="font-medium text-slate-600">
                {formattedDate}
            </time>
        </p>
    );
}
