'use client';

import { useState } from 'react';
import { Bot, ExternalLink } from 'lucide-react';

interface AskAIButtonsProps {
    pageContent: string;
    pageTitle: string;
    pageUrl: string;
}

export default function AskAIButtons({ pageContent, pageTitle, pageUrl }: AskAIButtonsProps) {
    const [copied, setCopied] = useState<string | null>(null);

    const prompt = `I'm researching ${pageTitle}. Here's what I found:

${pageContent}

Source: ${pageUrl}

Can you help me understand this better?`;

    const copyAndOpen = async (service: 'chatgpt' | 'gemini' | 'claude') => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(service);

            const urls = {
                chatgpt: 'https://chat.openai.com/',
                gemini: 'https://gemini.google.com/',
                claude: 'https://claude.ai/',
            };

            window.open(urls[service], '_blank');

            setTimeout(() => setCopied(null), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500 flex items-center gap-1">
                <Bot size={16} />
                Ask AI:
            </span>

            <button
                onClick={() => copyAndOpen('chatgpt')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                         bg-[#10a37f] hover:bg-[#0d8c6d] text-white rounded-lg transition-all"
            >
                ChatGPT
                <ExternalLink size={12} />
                {copied === 'chatgpt' && <span className="ml-1">✓</span>}
            </button>

            <button
                onClick={() => copyAndOpen('gemini')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                         bg-[#4285f4] hover:bg-[#3b78e7] text-white rounded-lg transition-all"
            >
                Gemini
                <ExternalLink size={12} />
                {copied === 'gemini' && <span className="ml-1">✓</span>}
            </button>

            <button
                onClick={() => copyAndOpen('claude')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                         bg-[#d97706] hover:bg-[#b45309] text-white rounded-lg transition-all"
            >
                Claude
                <ExternalLink size={12} />
                {copied === 'claude' && <span className="ml-1">✓</span>}
            </button>
        </div>
    );
}
