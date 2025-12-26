
import { PrismaClient } from '@myinsurancebuddy/db';
import { slugify } from './auto-mapper';

/**
 * Advanced Template Definitions
 * 
 * 1. Single Image (Minimalist/Hero)
 * 2. Double Image (Split/Comparison)
 * 3. Gallery (Carousel/Grid)
 * 4. Video Landing
 */

const THEMES = {
    minimal: {
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#ffffff',
        color: '#111827',
        primaryColor: '#000000',
        borderRadius: '0px',
        boxShadow: 'none',
    },
    modern: {
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        backgroundColor: '#f9fafb',
        color: '#1f2937',
        primaryColor: '#3b82f6',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }
};

const COMMON_STYLES = {
    sectionPadding: { desktop: { paddingTop: '80px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px' } },
    container: { desktop: { maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', width: '100%' } },
    heroTitle: { desktop: { fontSize: '48px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' } },
    heroSubtitle: { desktop: { fontSize: '20px', lineHeight: '1.6', color: '#4b5563', marginBottom: '32px' } },
    button: (theme: 'minimal' | 'modern') => ({
        desktop: {
            display: 'inline-block',
            padding: '16px 32px',
            backgroundColor: theme === 'minimal' ? '#000000' : '#3b82f6',
            color: '#ffffff',
            borderRadius: theme === 'minimal' ? '0px' : '8px',
            fontWeight: '600',
            fontSize: '16px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
        }
    })
};

export const ADVANCED_TEMPLATES = [
    {
        name: 'Minimal Hero (Single Image)',
        slug: 'minimal-hero',
        description: 'Clean, text-focused layout with a single high-impact hero image.',
        type: 'LANDING',
        sections: [
            // Hero Section
            {
                id: 'hero',
                type: 'section',
                name: 'Hero Section',
                styles: { desktop: { backgroundColor: '#ffffff', ...COMMON_STYLES.sectionPadding.desktop } },
                children: [
                    {
                        id: 'hero-container',
                        type: 'container',
                        name: 'Container',
                        styles: COMMON_STYLES.container,
                        children: [
                            {
                                id: 'hero-row',
                                type: 'row',
                                name: 'Row',
                                styles: { desktop: { display: 'flex', alignItems: 'center', gap: '60px' } },
                                children: [
                                    {
                                        id: 'hero-text-col',
                                        type: 'column',
                                        name: 'Text Column',
                                        styles: { desktop: { flex: '1' } },
                                        children: [
                                            {
                                                id: 'hero-title',
                                                type: 'heading',
                                                name: 'Hero Title',
                                                content: { type: 'text', value: '{{page_title}}' },
                                                styles: COMMON_STYLES.heroTitle
                                            },
                                            {
                                                id: 'hero-subtitle',
                                                type: 'text',
                                                name: 'Hero Subtitle',
                                                content: { type: 'text', value: '{{page_subtitle}}' },
                                                styles: COMMON_STYLES.heroSubtitle
                                            },
                                            {
                                                id: 'hero-cta',
                                                type: 'button',
                                                name: 'CTA Button',
                                                content: { type: 'button', value: 'Get Started', settings: { url: '#' } },
                                                styles: COMMON_STYLES.button('minimal')
                                            }
                                        ]
                                    },
                                    {
                                        id: 'hero-image-col',
                                        type: 'column',
                                        name: 'Image Column',
                                        styles: { desktop: { flex: '1' } },
                                        children: [
                                            {
                                                id: 'hero-image',
                                                type: 'image',
                                                name: 'Hero Image',
                                                content: { type: 'image', value: 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Hero+Image' },
                                                styles: { desktop: { width: '100%', height: 'auto', borderRadius: '0px' } }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            // Content Section
            {
                id: 'content',
                type: 'section',
                name: 'Content Section',
                styles: { desktop: { backgroundColor: '#f9fafb', ...COMMON_STYLES.sectionPadding.desktop } },
                children: [
                    {
                        id: 'content-container',
                        type: 'container',
                        styles: COMMON_STYLES.container,
                        children: [
                            {
                                id: 'content-text',
                                type: 'text',
                                content: { type: 'variable', variable: 'content', fallback: 'Lorem ipsum dolor sit amet...' },
                                styles: { desktop: { maxWidth: '800px', margin: '0 auto', fontSize: '18px', lineHeight: '1.8' } }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'Split Comparison (Double Image)',
        slug: 'split-comparison',
        description: 'Modern split layout perfect for comparisons or showing before/after.',
        type: 'LANDING',
        sections: [
            {
                id: 'split-hero',
                type: 'section',
                name: 'Split Hero',
                styles: { desktop: { position: 'relative', height: '100vh', display: 'flex' } },
                children: [
                    {
                        id: 'col-left',
                        type: 'column',
                        styles: { desktop: { flex: '1', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' } },
                        children: [
                            {
                                id: 'image-1',
                                type: 'image',
                                content: { type: 'image', value: 'https://placehold.co/600x800/e5e7eb/9ca3af?text=Image+1' },
                                styles: { desktop: { maxWidth: '100%', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' } }
                            }
                        ]
                    },
                    {
                        id: 'col-right',
                        type: 'column',
                        styles: { desktop: { flex: '1', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' } },
                        children: [
                            {
                                id: 'text-wrapper',
                                type: 'container', // Using container as a wrapper div
                                styles: { desktop: { maxWidth: '500px' } },
                                children: [
                                    {
                                        id: 'title',
                                        type: 'heading',
                                        content: { type: 'text', value: 'Why Choose Us?' },
                                        styles: { ...COMMON_STYLES.heroTitle.desktop, fontSize: '42px' }
                                    },
                                    {
                                        id: 'text',
                                        type: 'text',
                                        content: { type: 'text', value: 'Compare our rates with the competition. We leverage advanced technology to find you the best deals.' },
                                        styles: { ...COMMON_STYLES.heroSubtitle.desktop, fontSize: '18px' }
                                    },
                                    {
                                        id: 'image-2',
                                        type: 'image',
                                        content: { type: 'image', value: 'https://placehold.co/600x400/blue/white?text=Feature+Image' },
                                        styles: { desktop: { width: '100%', marginTop: '30px', borderRadius: '8px' } }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'Gallery Showcase (Carousel)',
        slug: 'gallery-showcase',
        description: 'Image-heavy layout with scrolling carousel for visual impact.',
        type: 'LANDING',
        sections: [
            {
                id: 'gallery-hero',
                type: 'section',
                styles: { desktop: { backgroundColor: '#111827', color: '#ffffff', ...COMMON_STYLES.sectionPadding.desktop } },
                children: [
                    {
                        id: 'hero-content',
                        type: 'container',
                        styles: { ...COMMON_STYLES.container.desktop, textAlign: 'center' },
                        children: [
                            {
                                id: 'hero-title-dark',
                                type: 'heading',
                                content: { type: 'text', value: '{{page_title}}' },
                                styles: { ...COMMON_STYLES.heroTitle.desktop, color: '#ffffff' }
                            },
                            {
                                id: 'gallery-carousel',
                                type: 'carousel', // Assuming we add this type or use a row with overflow
                                name: 'Image Carousel',
                                content: {
                                    type: 'gallery',
                                    value: '',
                                    settings: {
                                        images: [
                                            'https://placehold.co/800x600/1f2937/white?text=Slide+1',
                                            'https://placehold.co/800x600/374151/white?text=Slide+2',
                                            'https://placehold.co/800x600/4b5563/white?text=Slide+3'
                                        ],
                                        autoplay: true
                                    }
                                },
                                styles: { desktop: { width: '100%', marginTop: '40px', overflowX: 'auto', display: 'flex', gap: '20px', paddingBottom: '20px' } }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'Video Landing',
        slug: 'video-landing',
        description: 'Video-first layout for high engagement.',
        type: 'LANDING',
        sections: [
            {
                id: 'video-hero',
                type: 'section',
                styles: { desktop: { backgroundColor: '#000000', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' } },
                children: [
                    {
                        id: 'bg-video',
                        type: 'video',
                        content: { type: 'video', value: 'https://www.w3schools.com/html/mov_bbb.mp4', settings: { autoplay: true, loop: true, muted: true, controls: false } },
                        styles: { desktop: { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' } }
                    },
                    {
                        id: 'video-content-overlay',
                        type: 'container',
                        styles: { desktop: { position: 'relative', zIndex: '10', textAlign: 'center', maxWidth: '800px' } },
                        children: [
                            {
                                id: 'video-title',
                                type: 'heading',
                                content: { type: 'text', value: '{{page_title}}' },
                                styles: { desktop: { fontSize: '56px', fontWeight: '900', color: '#ffffff', marginBottom: '20px' } }
                            },
                            {
                                id: 'video-play-btn',
                                type: 'button',
                                content: { type: 'button', value: '▶ Watch Full Video', settings: { url: '#' } },
                                styles: { desktop: { backgroundColor: 'transparent', border: '2px solid #ffffff', color: '#ffffff', padding: '15px 40px', borderRadius: '50px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' } }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

export async function seedAdvancedTemplates(prisma: PrismaClient) {
    console.log('Seeding advanced templates...');

    for (const t of ADVANCED_TEMPLATES) {
        const exists = await prisma.template.findUnique({ where: { slug: t.slug } });
        if (!exists) {
            await prisma.template.create({
                data: {
                    name: t.name,
                    slug: t.slug,
                    description: t.description,
                    type: t.type as any,
                    sections: t.sections,
                    variables: ['page_title', 'page_subtitle', 'content'],
                }
            });
            console.log(`Created template: ${t.name}`);
        } else {
            console.log(`Template ${t.name} already exists`);
        }
    }
}
