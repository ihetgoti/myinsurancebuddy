'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface SmartPaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    queryParams?: Record<string, string>;
    maxVisible?: number;
}

export default function SmartPagination({
    currentPage,
    totalPages,
    baseUrl,
    queryParams = {},
    maxVisible = 5
}: SmartPaginationProps) {
    if (totalPages <= 1) return null;

    const buildUrl = (page: number) => {
        const params = new URLSearchParams(queryParams);
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisible + 2) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Show truncated view
            const halfVisible = Math.floor(maxVisible / 2);
            let start = Math.max(2, currentPage - halfVisible);
            let end = Math.min(totalPages - 1, currentPage + halfVisible);

            // Adjust if near start or end
            if (currentPage <= halfVisible + 1) {
                end = maxVisible;
            } else if (currentPage >= totalPages - halfVisible) {
                start = totalPages - maxVisible + 1;
            }

            pages.push(1); // Always show first page

            if (start > 2) pages.push('...');

            for (let i = start; i <= end; i++) pages.push(i);

            if (end < totalPages - 1) pages.push('...');

            pages.push(totalPages); // Always show last page
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1 sm:gap-2">
            {/* Previous */}
            {currentPage > 1 ? (
                <Link
                    href={buildUrl(currentPage - 1)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                </Link>
            ) : (
                <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 py-2 text-slate-400"
                            >
                                <MoreHorizontal size={16} />
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <Link
                            key={page}
                            href={buildUrl(page as number)}
                            className={`
                                min-w-[40px] h-10 flex items-center justify-center px-3 text-sm font-medium rounded-lg transition-colors
                                ${isActive
                                    ? 'bg-blue-600 text-white border border-blue-600'
                                    : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                }
                            `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next */}
            {currentPage < totalPages ? (
                <Link
                    href={buildUrl(currentPage + 1)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                </Link>
            ) : (
                <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                </span>
            )}
        </nav>
    );
}
