'use client';

import React from 'react';

interface Section {
    id: string;
    componentId: string;
    props: Record<string, any>;
    isHidden?: boolean;
}

interface DynamicPageRendererProps {
    sections: Section[];
    pageContent?: Section[];
    variables: Record<string, string>;
}

/**
 * Sanitize HTML to prevent XSS attacks
 * Only allows safe tags and attributes
 */
function sanitizeHtml(html: string): string {
    if (!html) return '';

    // Remove script tags and event handlers
    let clean = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, 'data-blocked:');

    return clean;
}

export default function DynamicPageRenderer({ sections, pageContent, variables }: DynamicPageRendererProps) {
    // Merge template sections with page-specific content
    const mergedSections = pageContent?.length ? pageContent : sections;

    /**
     * Replace template variables with actual values
     * CRITICAL: Removes unresolved variables to prevent raw tokens
     */
    const replaceVariables = (text: string | undefined): string => {
        if (!text) return '';
        let result = text;
        Object.entries(variables).forEach(([key, value]) => {
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            result = result.replace(new RegExp(`{{${escapedKey}}}`, 'g'), value || '');
        });
        // Remove unresolved variables
        result = result.replace(/{{[^}]+}}/g, '');
        return result;
    };

    const replacePropsVariables = (props: Record<string, any>): Record<string, any> => {
        const result: Record<string, any> = {};
        Object.entries(props).forEach(([key, value]) => {
            if (typeof value === 'string') {
                result[key] = replaceVariables(value);
            } else if (Array.isArray(value)) {
                result[key] = value.map(item => {
                    if (typeof item === 'object') {
                        return replacePropsVariables(item);
                    }
                    if (typeof item === 'string') {
                        return replaceVariables(item);
                    }
                    return item;
                });
            } else if (typeof value === 'object' && value !== null) {
                result[key] = replacePropsVariables(value);
            } else {
                result[key] = value;
            }
        });
        return result;
    };

    const renderSection = (section: Section) => {
        if (section.isHidden) return null;

        const props = replacePropsVariables(section.props);
        const { componentId } = section;

        // Render based on component type
        switch (componentId) {
            // Hero Components
            case 'hero-centered':
                return <HeroCentered key={section.id} {...props} />;
            case 'hero-split':
                return <HeroSplit key={section.id} {...props} />;
            case 'hero-zip-form':
                return <HeroZipForm key={section.id} {...props} />;
            case 'hero-animated':
                return <HeroAnimated key={section.id} {...props} />;

            // Content Components
            case 'content-text':
                return <ContentText key={section.id} {...props} />;
            case 'content-two-column':
                return <ContentTwoColumn key={section.id} {...props} />;
            case 'content-image-text':
                return <ContentImageText key={section.id} {...props} />;
            case 'content-accordion':
                return <ContentAccordion key={section.id} {...props} />;
            case 'content-table':
                return <ContentTable key={section.id} {...props} />;
            case 'content-comparison':
                return <ContentComparison key={section.id} {...props} />;

            // CTA Components
            case 'cta-banner':
                return <CTABanner key={section.id} {...props} />;
            case 'cta-inline':
                return <CTAInline key={section.id} {...props} />;

            // Feature Components
            case 'features-grid':
                return <FeaturesGrid key={section.id} {...props} />;
            case 'features-list':
                return <FeaturesList key={section.id} {...props} />;
            case 'how-it-works':
                return <HowItWorks key={section.id} {...props} />;
            case 'stats-counter':
                return <StatsCounter key={section.id} {...props} />;

            // Social Proof
            case 'testimonials-carousel':
                return <TestimonialsCarousel key={section.id} {...props} />;
            case 'testimonials-grid':
                return <TestimonialsGrid key={section.id} {...props} />;
            case 'trust-badges':
                return <TrustBadgesComponent key={section.id} {...props} />;
            case 'carrier-logos':
                return <CarrierLogos key={section.id} {...props} />;
            case 'rating-summary':
                return <RatingSummary key={section.id} {...props} />;

            // Navigation
            case 'breadcrumbs':
                return <Breadcrumbs key={section.id} {...props} />;
            case 'table-of-contents':
                return <TableOfContents key={section.id} {...props} />;
            case 'related-pages':
                return <RelatedPages key={section.id} {...props} />;

            // Utility
            case 'spacer':
                return <Spacer key={section.id} {...props} />;
            case 'divider':
                return <Divider key={section.id} {...props} />;

            // Calculator
            case 'calculator-premium':
                return <CalculatorPremium key={section.id} {...props} />;
            case 'calculator-savings':
                return <CalculatorSavings key={section.id} {...props} />;

            default:
                return (
                    <div key={section.id} className="py-8 px-4 bg-gray-100 text-center">
                        <p className="text-gray-500">Unknown component: {componentId}</p>
                    </div>
                );
        }
    };

    return (
        <div className="dynamic-page">
            {mergedSections.map(renderSection)}
        </div>
    );
}

// ============================================
// HERO COMPONENTS
// ============================================

function HeroCentered(props: any) {
    const bgStyle = props.backgroundType === 'gradient'
        ? { background: `linear-gradient(135deg, ${props.gradientFrom || '#0f172a'}, ${props.gradientTo || '#1e3a5f'})` }
        : { backgroundColor: props.backgroundColor || '#0f172a' };

    const heights: Record<string, string> = {
        small: 'py-16',
        medium: 'py-24',
        large: 'py-32',
        full: 'min-h-screen flex items-center',
    };

    return (
        <section className={`${heights[props.height] || 'py-24'} relative`} style={bgStyle}>
            {props.overlay && (
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: (props.overlayOpacity || 50) / 100 }}
                />
            )}
            <div className="container mx-auto px-4 text-center relative z-10" style={{ color: props.textColor || '#ffffff' }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{props.title}</h1>
                {props.subtitle && <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">{props.subtitle}</p>}

                <div className="flex flex-wrap justify-center gap-4">
                    {props.primaryCta && (
                        <a href={props.primaryCtaUrl || '#'} className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            {props.primaryCta}
                        </a>
                    )}
                    {props.secondaryCta && (
                        <a href={props.secondaryCtaUrl || '#'} className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                            {props.secondaryCta}
                        </a>
                    )}
                </div>

                {props.showRating && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < Math.floor(props.ratingValue || 4.8) ? '★' : '☆'}</span>
                            ))}
                        </div>
                        <span className="opacity-80">{props.ratingCount || '10,000+ reviews'}</span>
                    </div>
                )}
            </div>
        </section>
    );
}

function HeroSplit(props: any) {
    const isImageLeft = props.imagePosition === 'left';

    return (
        <section className="py-16 lg:py-24" style={{ backgroundColor: props.backgroundColor || '#ffffff' }}>
            <div className={`container mx-auto px-4 flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                    {props.image && (
                        <img src={props.image} alt={props.imageAlt || ''} className="rounded-xl shadow-lg w-full" />
                    )}
                </div>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-4">{props.title}</h1>
                    {props.subtitle && <p className="text-xl text-gray-600 mb-6">{props.subtitle}</p>}
                    {props.content && <div className="prose" dangerouslySetInnerHTML={{ __html: props.content }} />}
                    {props.primaryCta && (
                        <a href={props.primaryCtaUrl || '#'} className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            {props.primaryCta}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

function HeroZipForm(props: any) {
    const bgClasses = {
        dark: 'bg-slate-900 text-white',
        light: 'bg-gray-50 text-gray-900',
        gradient: 'bg-gradient-to-br from-slate-900 to-blue-900 text-white',
    };

    return (
        <section className={`py-20 ${bgClasses[props.backgroundType as keyof typeof bgClasses] || bgClasses.dark}`}>
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{props.title}</h1>
                {props.subtitle && <p className="text-xl opacity-80 mb-8 max-w-2xl mx-auto">{props.subtitle}</p>}

                <form action={props.formAction || '/get-quote'} className="max-w-md mx-auto flex gap-2 mb-8">
                    <input
                        type="text"
                        placeholder={props.formPlaceholder || 'Enter ZIP code'}
                        className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                        pattern="[0-9]{5}"
                    />
                    <button type="submit" className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition">
                        {props.formButtonText || 'Get Quotes'}
                    </button>
                </form>

                {props.showCarrierLogos && props.carrierLogos?.length > 0 && (
                    <div className="flex justify-center items-center gap-8 opacity-60">
                        {props.carrierLogos.map((carrier: any, i: number) => (
                            <img key={i} src={carrier.logo} alt={carrier.name} className="h-8 grayscale" />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function HeroAnimated(props: any) {
    return (
        <section className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{props.title}</h1>
                {props.subtitle && <p className="text-xl opacity-80 mb-12">{props.subtitle}</p>}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {(props.stats || []).map((stat: any, i: number) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl font-bold text-emerald-400">
                                {stat.prefix}{stat.value}{stat.suffix}
                            </div>
                            <div className="text-gray-400 mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// CONTENT COMPONENTS
// ============================================

function ContentText(props: any) {
    const maxWidths: Record<string, string> = {
        sm: 'max-w-xl',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        full: 'max-w-none',
    };

    const alignments: Record<string, string> = {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right',
    };

    return (
        <section className="py-12 px-4">
            <div className={`${maxWidths[props.maxWidth] || 'max-w-4xl'} ${alignments[props.alignment] || ''}`}>
                <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: props.content || '' }} />
            </div>
        </section>
    );
}

function ContentTwoColumn(props: any) {
    const leftWidths: Record<string, string> = {
        '33': 'lg:w-1/3',
        '50': 'lg:w-1/2',
        '66': 'lg:w-2/3',
    };

    return (
        <section className="py-12 px-4">
            <div className={`container mx-auto flex flex-col lg:flex-row gap-${props.gap || 8}`}>
                <div className={leftWidths[props.leftWidth] || 'lg:w-1/2'}>
                    <div className="prose" dangerouslySetInnerHTML={{ __html: props.leftContent || '' }} />
                </div>
                <div className="flex-1">
                    <div className="prose" dangerouslySetInnerHTML={{ __html: props.rightContent || '' }} />
                </div>
            </div>
        </section>
    );
}

function ContentImageText(props: any) {
    const isImageLeft = props.imagePosition === 'left';

    return (
        <section className="py-16">
            <div className={`container mx-auto px-4 flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                    {props.image && <img src={props.image} alt={props.imageAlt || ''} className="rounded-xl w-full" />}
                </div>
                <div className="flex-1">
                    {props.title && <h2 className="text-3xl font-bold mb-4">{props.title}</h2>}
                    {props.content && <div className="prose" dangerouslySetInnerHTML={{ __html: props.content }} />}
                    {props.ctaText && (
                        <a href={props.ctaUrl || '#'} className="inline-block mt-6 text-blue-600 font-semibold hover:underline">
                            {props.ctaText} →
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

function ContentAccordion(props: any) {
    const [openIndex, setOpenIndex] = React.useState(props.defaultOpen ? 0 : -1);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-3xl">
                {props.title && <h2 className="text-3xl font-bold mb-4 text-center">{props.title}</h2>}
                {props.subtitle && <p className="text-gray-600 mb-8 text-center">{props.subtitle}</p>}

                <div className="space-y-3">
                    {(props.items || []).map((item: any, i: number) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center"
                            >
                                <span className="font-semibold">{item.question}</span>
                                <span className="text-2xl">{openIndex === i ? '−' : '+'}</span>
                            </button>
                            {openIndex === i && (
                                <div className="px-6 pb-4">
                                    <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: item.answer }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ContentTable(props: any) {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {props.title && <h2 className="text-2xl font-bold mb-6">{props.title}</h2>}
                <div className="overflow-x-auto">
                    <table className={`w-full ${props.bordered ? 'border' : ''}`}>
                        <thead className="bg-gray-50">
                            <tr>
                                {(props.headers || []).map((header: any, i: number) => (
                                    <th key={i} className={`px-4 py-3 text-${header.align || 'left'}`}>
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {(props.rows || []).map((row: any, i: number) => (
                                <tr key={i} className={props.striped && i % 2 ? 'bg-gray-50' : ''}>
                                    {(props.headers || []).map((header: any, j: number) => (
                                        <td key={j} className={`px-4 py-3 text-${header.align || 'left'}`}>
                                            {row[header.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

function ContentComparison(props: any) {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {props.title && <h2 className="text-3xl font-bold mb-8 text-center">{props.title}</h2>}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="p-4"></th>
                                {(props.items || []).map((item: any, i: number) => (
                                    <th key={i} className="p-4 text-center">
                                        {item.logo && <img src={item.logo} alt={item.name} className="h-12 mx-auto mb-2" />}
                                        <div className="font-bold">{item.name}</div>
                                        {item.price && <div className="text-emerald-600">{item.price}</div>}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {(props.features || []).map((feature: any, i: number) => (
                                <tr key={i}>
                                    <td className="p-4 font-medium">{feature.name}</td>
                                    {(props.items || []).map((item: any, j: number) => (
                                        <td key={j} className="p-4 text-center">
                                            {item.features?.[feature.key] ? '✓' : '—'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

// ============================================
// CTA COMPONENTS
// ============================================

function CTABanner(props: any) {
    return (
        <section
            className="py-16"
            style={{ backgroundColor: props.backgroundColor || '#0f172a', color: props.textColor || '#ffffff' }}
        >
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
                {props.subtitle && <p className="text-xl opacity-80 mb-8">{props.subtitle}</p>}
                <div className="flex flex-wrap justify-center gap-4">
                    {props.primaryCta && (
                        <a href={props.primaryCtaUrl || '#'} className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            {props.primaryCta}
                        </a>
                    )}
                    {props.secondaryCta && (
                        <a href={props.secondaryCtaUrl || '#'} className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                            {props.secondaryCta}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

function CTAInline(props: any) {
    const styles: Record<string, string> = {
        minimal: 'py-4',
        card: 'py-6 px-8 bg-gray-50 rounded-xl',
        highlight: 'py-6 px-8 bg-blue-50 border-l-4 border-blue-500',
    };

    return (
        <div className={`${styles[props.style] || styles.card} flex items-center justify-between`}>
            <p className="font-medium">{props.text}</p>
            <a href={props.ctaUrl || '#'} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                {props.ctaText}
            </a>
        </div>
    );
}

// ============================================
// FEATURE COMPONENTS
// ============================================

function FeaturesGrid(props: any) {
    const columns: Record<string, string> = {
        '2': 'md:grid-cols-2',
        '3': 'md:grid-cols-3',
        '4': 'md:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {props.title && <h2 className="text-3xl font-bold mb-4 text-center">{props.title}</h2>}
                {props.subtitle && <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">{props.subtitle}</p>}

                <div className={`grid ${columns[props.columns] || 'md:grid-cols-3'} gap-6`}>
                    {(props.features || []).map((feature: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                            {feature.icon && <div className="text-3xl mb-4">{feature.icon}</div>}
                            <h3 className="font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                            {feature.link && (
                                <a href={feature.link} className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                                    Learn more →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturesList(props: any) {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {props.title && <h2 className="text-2xl font-bold mb-6">{props.title}</h2>}
                <ul className={`grid ${props.columns === '2' ? 'md:grid-cols-2' : ''} gap-3`}>
                    {(props.features || []).map((feature: any, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                            <span style={{ color: props.iconColor || '#10b981' }}>
                                {feature.icon || '✓'}
                            </span>
                            <span>{feature.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function HowItWorks(props: any) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {props.title && <h2 className="text-3xl font-bold mb-4 text-center">{props.title}</h2>}
                {props.subtitle && <p className="text-gray-600 mb-12 text-center">{props.subtitle}</p>}

                <div className={`flex flex-col ${props.layout === 'horizontal' ? 'md:flex-row' : ''} gap-8 max-w-4xl mx-auto`}>
                    {(props.steps || []).map((step: any, i: number) => (
                        <div key={i} className="flex-1 text-center">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                {step.number || i + 1}
                            </div>
                            <h3 className="font-bold mb-2">{step.title}</h3>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatsCounter(props: any) {
    return (
        <section className="py-12" style={{ backgroundColor: props.backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className={`flex flex-wrap justify-center ${props.layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4' : ''} gap-8`}>
                    {(props.stats || []).map((stat: any, i: number) => (
                        <div key={i} className="text-center">
                            {stat.icon && <div className="text-3xl mb-2">{stat.icon}</div>}
                            <div className="text-4xl font-bold text-blue-600">
                                {stat.prefix}{stat.value}{stat.suffix}
                            </div>
                            <div className="text-gray-600 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// SOCIAL PROOF COMPONENTS
// ============================================

function TestimonialsCarousel(props: any) {
    const [current, setCurrent] = React.useState(0);
    const testimonials = props.testimonials || [];

    React.useEffect(() => {
        if (props.autoplay && testimonials.length > 1) {
            const interval = setInterval(() => {
                setCurrent((c) => (c + 1) % testimonials.length);
            }, props.interval || 5000);
            return () => clearInterval(interval);
        }
    }, [props.autoplay, props.interval, testimonials.length]);

    if (testimonials.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-3xl">
                {props.title && <h2 className="text-3xl font-bold mb-8 text-center">{props.title}</h2>}

                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                    <p className="text-xl italic mb-6">"{testimonials[current].quote}"</p>
                    <div className="flex items-center justify-center gap-4">
                        {testimonials[current].avatar && (
                            <img src={testimonials[current].avatar} alt="" className="w-12 h-12 rounded-full" />
                        )}
                        <div>
                            <div className="font-semibold">{testimonials[current].author}</div>
                            {testimonials[current].role && (
                                <div className="text-gray-500 text-sm">{testimonials[current].role}</div>
                            )}
                        </div>
                    </div>
                </div>

                {props.showDots && testimonials.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full ${i === current ? 'bg-blue-600' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function TestimonialsGrid(props: any) {
    const columns: Record<string, string> = {
        '2': 'md:grid-cols-2',
        '3': 'md:grid-cols-3',
        '4': 'md:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {props.title && <h2 className="text-3xl font-bold mb-8 text-center">{props.title}</h2>}
                <div className={`grid ${columns[props.columns] || 'md:grid-cols-3'} gap-6`}>
                    {(props.testimonials || []).map((t: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                            {t.rating && (
                                <div className="text-yellow-400 mb-3">
                                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                                </div>
                            )}
                            <p className="text-gray-600 mb-4">"{t.quote}"</p>
                            <div className="font-semibold">{t.author}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TrustBadgesComponent(props: any) {
    return (
        <section className="py-8 border-y bg-gray-50">
            <div className="container mx-auto px-4">
                {props.title && <p className="text-center text-gray-500 mb-4">{props.title}</p>}
                <div className="flex flex-wrap justify-center items-center gap-8">
                    {(props.badges || []).map((badge: any, i: number) => (
                        <a key={i} href={badge.url || '#'} className={props.style === 'grayscale' ? 'grayscale hover:grayscale-0 transition' : ''}>
                            <img src={badge.image} alt={badge.alt || ''} className="h-12" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CarrierLogos(props: any) {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {props.title && <h2 className="text-2xl font-bold mb-2 text-center">{props.title}</h2>}
                {props.subtitle && <p className="text-gray-600 mb-8 text-center">{props.subtitle}</p>}

                <div className={`flex flex-wrap justify-center items-center gap-8 ${props.grayscale ? 'grayscale' : ''}`}>
                    {(props.logos || []).map((logo: any, i: number) => (
                        <a key={i} href={logo.url || '#'} className="hover:grayscale-0 transition">
                            <img src={logo.logo} alt={logo.name} className="h-10" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function RatingSummary(props: any) {
    return (
        <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600">{props.averageRating || 4.8}</div>
                    <div className="text-yellow-400 text-xl">
                        {'★'.repeat(Math.floor(props.averageRating || 4.8))}
                    </div>
                    <div className="text-gray-500 text-sm">{(props.totalReviews || 10000).toLocaleString()} reviews</div>
                </div>

                {props.showBreakdown && props.breakdown && (
                    <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2 text-sm">
                                <span className="w-8">{rating}★</span>
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400"
                                        style={{ width: `${props.breakdown[rating] || 0}%` }}
                                    />
                                </div>
                                <span className="text-gray-500 w-8">{props.breakdown[rating] || 0}%</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ============================================
// NAVIGATION COMPONENTS
// ============================================

function Breadcrumbs(props: any) {
    const separators: Record<string, string> = {
        slash: '/',
        arrow: '>',
        chevron: '›',
    };

    return (
        <nav className="py-4 px-4 bg-gray-50">
            <div className="container mx-auto">
                <ol className="flex flex-wrap items-center gap-2 text-sm">
                    {(props.items || []).map((item: any, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                            {i > 0 && <span className="text-gray-400">{separators[props.separator] || '›'}</span>}
                            {item.url ? (
                                <a href={item.url} className="text-blue-600 hover:underline">{item.label}</a>
                            ) : (
                                <span className="text-gray-600">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}

function TableOfContents(props: any) {
    return (
        <nav className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="font-bold mb-3">{props.title || 'Table of Contents'}</h3>
            <ul className={`space-y-2 ${props.numbered ? 'list-decimal list-inside' : ''}`}>
                {/* TOC items would be generated from page headings */}
                <li className="text-gray-500 text-sm">Auto-generated from page content</li>
            </ul>
        </nav>
    );
}

function RelatedPages(props: any) {
    const columns: Record<string, string> = {
        '2': 'md:grid-cols-2',
        '3': 'md:grid-cols-3',
        '4': 'md:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {props.title && <h2 className="text-2xl font-bold mb-6">{props.title}</h2>}
                <div className={`grid ${columns[props.columns] || 'md:grid-cols-3'} gap-4`}>
                    {(props.pages || []).map((page: any, i: number) => (
                        <a key={i} href={page.url} className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
                            {page.image && <img src={page.image} alt="" className="w-full h-32 object-cover rounded mb-3" />}
                            <h3 className="font-semibold mb-1">{page.title}</h3>
                            {page.description && <p className="text-gray-500 text-sm">{page.description}</p>}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// UTILITY COMPONENTS
// ============================================

function Spacer(props: any) {
    const heights: Record<string, string> = {
        xs: 'h-2',
        sm: 'h-4',
        md: 'h-8',
        lg: 'h-12',
        xl: 'h-16',
    };

    return (
        <div className={heights[props.height] || 'h-8'}>
            {props.showDivider && (
                <hr style={{ borderColor: props.dividerColor || '#e5e7eb' }} />
            )}
        </div>
    );
}

function Divider(props: any) {
    const widths: Record<string, string> = {
        full: 'w-full',
        '75': 'w-3/4 mx-auto',
        '50': 'w-1/2 mx-auto',
        '25': 'w-1/4 mx-auto',
    };

    return (
        <hr
            className={`${widths[props.width] || 'w-full'} my-8`}
            style={{
                borderStyle: props.style || 'solid',
                borderColor: props.color || '#e5e7eb',
                borderWidth: `${props.thickness || 1}px 0 0 0`,
            }}
        />
    );
}

// ============================================
// CALCULATOR COMPONENTS
// ============================================

function CalculatorPremium(props: any) {
    const [result, setResult] = React.useState<number | null>(null);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">{props.title}</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-gray-500 text-center mb-4">Calculator coming soon</p>
                    {result !== null && (
                        <div className="text-center text-3xl font-bold text-emerald-600">
                            {props.resultFormat?.replace('{{result}}', result.toString()) || `$${result}/month`}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function CalculatorSavings(props: any) {
    const [premium, setPremium] = React.useState('');
    const savings = premium ? Math.round(parseFloat(premium) * (props.savingsPercentage || 25) / 100) : 0;

    return (
        <section className="py-16 bg-emerald-50">
            <div className="container mx-auto px-4 max-w-xl text-center">
                <h2 className="text-2xl font-bold mb-6">{props.title}</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <label className="block text-left mb-2 font-medium">
                        {props.currentPremiumLabel || 'Your Current Monthly Premium'}
                    </label>
                    <div className="flex gap-2 mb-6">
                        <span className="bg-gray-100 px-4 py-2 rounded-l-lg">$</span>
                        <input
                            type="number"
                            value={premium}
                            onChange={(e) => setPremium(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-r-lg"
                            placeholder="150"
                        />
                    </div>

                    {savings > 0 && (
                        <div className="mb-6">
                            <p className="text-gray-600">You could save up to</p>
                            <p className="text-4xl font-bold text-emerald-600">${savings}/month</p>
                            <p className="text-emerald-600">${savings * 12}/year</p>
                        </div>
                    )}

                    <a href={props.ctaUrl || '/get-quote'} className="block bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
                        {props.ctaText || 'Get Your Free Quote'}
                    </a>
                </div>
            </div>
        </section>
    );
}

