import { Lightbulb, ExternalLink } from 'lucide-react';

interface QuickAnswerBoxProps {
    question: string;
    answer: string;
    source?: string;
    sourceUrl?: string;
    className?: string;
}

export default function QuickAnswerBox({
    question,
    answer,
    source,
    sourceUrl,
    className = ''
}: QuickAnswerBoxProps) {
    return (
        <div
            className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 ${className}`}
            itemScope
            itemType="https://schema.org/Question"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={20} className="text-white" />
                </div>
                <div className="flex-1">
                    <h3
                        className="font-bold text-slate-900 text-lg mb-2"
                        itemProp="name"
                    >
                        {question}
                    </h3>
                    <div
                        itemScope
                        itemType="https://schema.org/Answer"
                        itemProp="acceptedAnswer"
                    >
                        <p
                            className="text-slate-700 leading-relaxed"
                            itemProp="text"
                        >
                            {answer}
                        </p>
                    </div>
                    {source && (
                        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                            Source:
                            {sourceUrl ? (
                                <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                    {source}
                                    <ExternalLink size={10} />
                                </a>
                            ) : (
                                <span className="text-slate-600">{source}</span>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
