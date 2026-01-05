import React from 'react';

interface AdUnitProps {
    slot: string;
    className?: string;
    format?: 'horizontal' | 'rectangle' | 'vertical' | 'responsive';
}

export default function AdUnit({ slot, className = '', format = 'horizontal' }: AdUnitProps) {
    // This is where you'd conditionally render AdSense invalidation logic or just a slot div
    // For now, we render a visible placeholder in dev.

    return (
        <div className={`ad-unit group relative overflow-hidden bg-gray-50 border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs text-center p-4 ${className}`}>
            <div className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] px-1">AD</div>
            <span className="font-semibold mb-1 opacity-50">Advertisement Space</span>
            <span className="opacity-50 font-mono text-[10px]">{slot}</span>

            {/* Simulation of ad size - purely visual */}
            <div className="mt-2 opacity-20 bg-current">
                {format === 'horizontal' && <div className="w-[320px] sm:w-[728px] h-[50px] sm:h-[90px]" />}
                {format === 'rectangle' && <div className="w-[300px] h-[250px]" />}
                {format === 'vertical' && <div className="w-[160px] h-[600px]" />}
                {format === 'responsive' && <div className="w-full h-32" />}
            </div>
        </div>
    );
}
