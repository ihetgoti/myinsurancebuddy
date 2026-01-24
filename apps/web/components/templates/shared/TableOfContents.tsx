'use client';

import { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

export interface TOCItem {
    id: string;
    label: string;
    level?: 2 | 3;
}

interface TableOfContentsProps {
    items: TOCItem[];
    title?: string;
    className?: string;
}

export default function TableOfContents({
    items,
    title = 'On This Page',
    className = ''
}: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0% -35% 0%', threshold: 0 }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveId(id);
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <nav
            aria-label="Table of contents"
            className={`bg-slate-50 rounded-xl p-5 border border-slate-200 ${className}`}
        >
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <List size={16} className="text-slate-600" />
                {title}
            </h2>
            <ol className="space-y-1" role="list">
                {items.map((item, index) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={`
                                flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-colors
                                ${item.level === 3 ? 'pl-6' : ''}
                                ${activeId === item.id
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }
                            `}
                        >
                            <ChevronRight size={14} className={activeId === item.id ? 'text-blue-500' : 'text-slate-400'} />
                            <span>{item.label}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
