'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Loader2, MapPin, Shield, FileText, ArrowRight } from 'lucide-react';

interface SearchResult {
    id: string;
    title: string;
    href: string;
    description?: string;
    type: 'insurance' | 'state' | 'city' | 'page';
    breadcrumb?: string[];
}

interface SiteSearchProps {
    className?: string;
    placeholder?: string;
    maxResults?: number;
}

// Mock search function - in production, this would call an API
const mockSearch = async (query: string): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // This is a mock - in production, you'd fetch from your search index
    const mockResults: SearchResult[] = [
        {
            id: '1',
            title: 'Car Insurance in Texas',
            href: '/car-insurance/us/texas',
            description: 'Compare auto insurance rates in Texas. Find the best coverage options.',
            type: 'state',
            breadcrumb: ['Car Insurance', 'United States', 'Texas'],
        },
        {
            id: '2',
            title: 'Home Insurance in California',
            href: '/home-insurance/us/california',
            description: 'Protect your home with the best insurance in California.',
            type: 'state',
            breadcrumb: ['Home Insurance', 'United States', 'California'],
        },
        {
            id: '3',
            title: 'Auto Insurance Guide',
            href: '/guides/auto-insurance',
            description: 'Complete guide to understanding auto insurance coverage.',
            type: 'page',
            breadcrumb: ['Guides', 'Auto Insurance'],
        },
    ];
    
    return mockResults.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description?.toLowerCase().includes(query.toLowerCase())
    );
};

export default function SiteSearch({
    className = '',
    placeholder = 'Search insurance guides, locations...',
    maxResults = 8
}: SiteSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle search
    useEffect(() => {
        const search = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const searchResults = await mockSearch(query);
                setResults(searchResults.slice(0, maxResults));
                setSelectedIndex(-1);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(search, 150);
        return () => clearTimeout(debounce);
    }, [query, maxResults]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    window.location.href = results[selectedIndex].href;
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'insurance':
                return <Shield size={16} className="text-blue-500" />;
            case 'state':
            case 'city':
                return <MapPin size={16} className="text-green-500" />;
            default:
                return <FileText size={16} className="text-slate-400" />;
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                             shadow-sm"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (query.length >= 2 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                            <Loader2 size={20} className="animate-spin" />
                            <span>Searching...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="max-h-80 overflow-y-auto py-2">
                                {results.map((result, index) => (
                                    <Link
                                        key={result.id}
                                        href={result.href}
                                        className={`
                                            flex items-start gap-3 px-4 py-3 mx-2 rounded-lg transition-colors
                                            ${index === selectedIndex
                                                ? 'bg-blue-50 text-blue-900'
                                                : 'hover:bg-slate-50'
                                            }
                                        `}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="mt-0.5">{getIcon(result.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium truncate ${
                                                index === selectedIndex ? 'text-blue-900' : 'text-slate-900'
                                            }`}>
                                                {result.title}
                                            </p>
                                            {result.description && (
                                                <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                                                    {result.description}
                                                </p>
                                            )}
                                            {result.breadcrumb && (
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {result.breadcrumb.join(' > ')}
                                                </p>
                                            )}
                                        </div>
                                        <ArrowRight
                                            size={16}
                                            className={`mt-1 flex-shrink-0 ${
                                                index === selectedIndex ? 'text-blue-600' : 'text-slate-300'
                                            }`}
                                        />
                                    </Link>
                                ))}
                            </div>
                            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                                <span>Press Enter to select</span>
                                <span>{results.length} results</span>
                            </div>
                        </>
                    ) : query.length >= 2 ? (
                        <div className="text-center py-8 text-slate-500">
                            <p>No results found for &ldquo;{query}&rdquo;</p>
                            <p className="text-sm mt-1">Try different keywords</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
