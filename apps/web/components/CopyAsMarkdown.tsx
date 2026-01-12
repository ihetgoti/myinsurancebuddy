'use client';

import { useState } from 'react';
import { Copy, Check, MessageSquare } from 'lucide-react';

interface CopyAsMarkdownProps {
    title: string;
    keyTakeaways: string[];
    content: string;
    source: string;
}

export default function CopyAsMarkdown({ title, keyTakeaways, content, source }: CopyAsMarkdownProps) {
    const [copied, setCopied] = useState(false);

    const generateMarkdown = () => {
        const md = `# ${title}

## Key Takeaways
${keyTakeaways.map(t => `- ${t}`).join('\n')}

${content}

---
Source: ${source}
`;
        return md;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generateMarkdown());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600 
                     bg-slate-100 hover:bg-blue-50 rounded-lg transition-all"
            title="Copy page content as Markdown"
        >
            {copied ? (
                <>
                    <Check size={16} className="text-green-600" />
                    <span className="text-green-600">Copied!</span>
                </>
            ) : (
                <>
                    <Copy size={16} />
                    <span>Copy as MD</span>
                </>
            )}
        </button>
    );
}
