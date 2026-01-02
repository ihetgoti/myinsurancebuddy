// Component Definitions for Drag-and-Drop Page Builder
// 50+ components organized by category

export interface ComponentProp {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'richtext' | 'number' | 'boolean' | 'select' | 'color' | 'image' | 'url' | 'icon' | 'json' | 'array' | 'spacing' | 'alignment';
    required?: boolean;
    defaultValue?: any;
    options?: { label: string; value: string }[];
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    group?: string;
    description?: string;
    showIf?: { field: string; value: any };
    arrayItemSchema?: ComponentProp[];
}

export interface ComponentDefinition {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    icon: string;
    thumbnail?: string;
    props: ComponentProp[];
    defaultProps: Record<string, any>;
    supportedVariables?: string[];
    allowChildren?: boolean;
    maxChildren?: number;
}

// ============================================
// HERO SECTIONS (10 variants)
// ============================================

export const heroComponents: ComponentDefinition[] = [
    {
        id: 'hero-centered',
        name: 'Hero - Centered',
        slug: 'hero-centered',
        category: 'hero',
        description: 'Centered hero with title, subtitle, and CTA buttons',
        icon: '🎯',
        props: [
            { name: 'title', label: 'Title', type: 'text', required: true, defaultValue: '{{page_title}}', group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', defaultValue: '{{page_subtitle}}', group: 'Content' },
            { name: 'primaryCta', label: 'Primary CTA Text', type: 'text', defaultValue: 'Get Free Quote', group: 'CTA' },
            { name: 'primaryCtaUrl', label: 'Primary CTA URL', type: 'url', defaultValue: '/get-quote', group: 'CTA' },
            { name: 'secondaryCta', label: 'Secondary CTA Text', type: 'text', group: 'CTA' },
            { name: 'secondaryCtaUrl', label: 'Secondary CTA URL', type: 'url', group: 'CTA' },
            {
                name: 'backgroundType', label: 'Background Type', type: 'select', options: [
                    { label: 'Solid Color', value: 'solid' },
                    { label: 'Gradient', value: 'gradient' },
                    { label: 'Image', value: 'image' },
                    { label: 'Video', value: 'video' },
                ], defaultValue: 'gradient', group: 'Background'
            },
            { name: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#0f172a', group: 'Background', showIf: { field: 'backgroundType', value: 'solid' } },
            { name: 'gradientFrom', label: 'Gradient From', type: 'color', defaultValue: '#0f172a', group: 'Background', showIf: { field: 'backgroundType', value: 'gradient' } },
            { name: 'gradientTo', label: 'Gradient To', type: 'color', defaultValue: '#1e3a5f', group: 'Background', showIf: { field: 'backgroundType', value: 'gradient' } },
            { name: 'backgroundImage', label: 'Background Image', type: 'image', group: 'Background', showIf: { field: 'backgroundType', value: 'image' } },
            { name: 'backgroundVideo', label: 'Background Video URL', type: 'url', group: 'Background', showIf: { field: 'backgroundType', value: 'video' } },
            { name: 'overlay', label: 'Show Overlay', type: 'boolean', defaultValue: true, group: 'Background' },
            { name: 'overlayOpacity', label: 'Overlay Opacity', type: 'number', min: 0, max: 100, step: 5, defaultValue: 50, group: 'Background', showIf: { field: 'overlay', value: true } },
            { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff', group: 'Style' },
            {
                name: 'height', label: 'Height', type: 'select', options: [
                    { label: 'Small (300px)', value: 'small' },
                    { label: 'Medium (450px)', value: 'medium' },
                    { label: 'Large (600px)', value: 'large' },
                    { label: 'Full Screen', value: 'full' },
                ], defaultValue: 'medium', group: 'Style'
            },
            { name: 'showTrustBadges', label: 'Show Trust Badges', type: 'boolean', defaultValue: true, group: 'Extras' },
            { name: 'showRating', label: 'Show Rating', type: 'boolean', defaultValue: true, group: 'Extras' },
            { name: 'ratingValue', label: 'Rating Value', type: 'number', min: 1, max: 5, step: 0.1, defaultValue: 4.8, group: 'Extras', showIf: { field: 'showRating', value: true } },
            { name: 'ratingCount', label: 'Rating Count', type: 'text', defaultValue: '10,000+ reviews', group: 'Extras', showIf: { field: 'showRating', value: true } },
        ],
        defaultProps: {
            title: '{{page_title}}',
            subtitle: '{{page_subtitle}}',
            primaryCta: 'Get Free Quote',
            primaryCtaUrl: '/get-quote',
            backgroundType: 'gradient',
            gradientFrom: '#0f172a',
            gradientTo: '#1e3a5f',
            overlay: true,
            overlayOpacity: 50,
            textColor: '#ffffff',
            height: 'medium',
            showTrustBadges: true,
            showRating: true,
            ratingValue: 4.8,
            ratingCount: '10,000+ reviews',
        },
        supportedVariables: ['page_title', 'page_subtitle', 'insurance_type', 'location', 'state', 'city'],
    },
    {
        id: 'hero-split',
        name: 'Hero - Split Image',
        slug: 'hero-split',
        category: 'hero',
        description: 'Hero with content on one side and image on the other',
        icon: '↔️',
        props: [
            { name: 'title', label: 'Title', type: 'text', required: true, group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', group: 'Content' },
            { name: 'content', label: 'Content', type: 'richtext', group: 'Content' },
            { name: 'image', label: 'Image', type: 'image', required: true, group: 'Media' },
            { name: 'imageAlt', label: 'Image Alt Text', type: 'text', group: 'Media' },
            {
                name: 'imagePosition', label: 'Image Position', type: 'select', options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                ], defaultValue: 'right', group: 'Layout'
            },
            { name: 'primaryCta', label: 'Primary CTA', type: 'text', group: 'CTA' },
            { name: 'primaryCtaUrl', label: 'Primary CTA URL', type: 'url', group: 'CTA' },
            { name: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#ffffff', group: 'Style' },
        ],
        defaultProps: {
            imagePosition: 'right',
            backgroundColor: '#ffffff',
        },
        supportedVariables: ['page_title', 'page_subtitle', 'insurance_type'],
    },
    {
        id: 'hero-zip-form',
        name: 'Hero - ZIP Code Form',
        slug: 'hero-zip-form',
        category: 'hero',
        description: 'Hero with prominent ZIP code input form',
        icon: '📍',
        props: [
            { name: 'title', label: 'Title', type: 'text', required: true, group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', group: 'Content' },
            { name: 'formPlaceholder', label: 'Form Placeholder', type: 'text', defaultValue: 'Enter your ZIP code', group: 'Form' },
            { name: 'formButtonText', label: 'Button Text', type: 'text', defaultValue: 'Get Quotes', group: 'Form' },
            { name: 'formAction', label: 'Form Action URL', type: 'url', defaultValue: '/get-quote', group: 'Form' },
            { name: 'showCarrierLogos', label: 'Show Carrier Logos', type: 'boolean', defaultValue: true, group: 'Extras' },
            {
                name: 'carrierLogos', label: 'Carrier Logos', type: 'array', arrayItemSchema: [
                    { name: 'name', label: 'Name', type: 'text' },
                    { name: 'logo', label: 'Logo', type: 'image' },
                ], group: 'Extras', showIf: { field: 'showCarrierLogos', value: true }
            },
            {
                name: 'backgroundType', label: 'Background', type: 'select', options: [
                    { label: 'Dark', value: 'dark' },
                    { label: 'Light', value: 'light' },
                    { label: 'Gradient', value: 'gradient' },
                ], defaultValue: 'dark', group: 'Style'
            },
        ],
        defaultProps: {
            formPlaceholder: 'Enter your ZIP code',
            formButtonText: 'Get Quotes',
            formAction: '/get-quote',
            showCarrierLogos: true,
            backgroundType: 'dark',
        },
        supportedVariables: ['page_title', 'insurance_type', 'state'],
    },
    {
        id: 'hero-video',
        name: 'Hero - Video Background',
        slug: 'hero-video',
        category: 'hero',
        description: 'Hero with video background',
        icon: '🎬',
        props: [
            { name: 'title', label: 'Title', type: 'text', required: true, group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', group: 'Content' },
            { name: 'videoUrl', label: 'Video URL', type: 'url', required: true, group: 'Media' },
            { name: 'posterImage', label: 'Poster Image', type: 'image', group: 'Media' },
            { name: 'autoplay', label: 'Autoplay', type: 'boolean', defaultValue: true, group: 'Media' },
            { name: 'loop', label: 'Loop', type: 'boolean', defaultValue: true, group: 'Media' },
            { name: 'muted', label: 'Muted', type: 'boolean', defaultValue: true, group: 'Media' },
            { name: 'overlayColor', label: 'Overlay Color', type: 'color', defaultValue: '#000000', group: 'Style' },
            { name: 'overlayOpacity', label: 'Overlay Opacity', type: 'number', min: 0, max: 100, defaultValue: 50, group: 'Style' },
        ],
        defaultProps: {
            autoplay: true,
            loop: true,
            muted: true,
            overlayColor: '#000000',
            overlayOpacity: 50,
        },
        supportedVariables: ['page_title', 'page_subtitle'],
    },
    {
        id: 'hero-animated',
        name: 'Hero - Animated Stats',
        slug: 'hero-animated',
        category: 'hero',
        description: 'Hero with animated counter statistics',
        icon: '📊',
        props: [
            { name: 'title', label: 'Title', type: 'text', required: true, group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', group: 'Content' },
            {
                name: 'stats', label: 'Statistics', type: 'array', arrayItemSchema: [
                    { name: 'value', label: 'Value', type: 'text' },
                    { name: 'label', label: 'Label', type: 'text' },
                    { name: 'prefix', label: 'Prefix', type: 'text' },
                    { name: 'suffix', label: 'Suffix', type: 'text' },
                ], group: 'Stats'
            },
            { name: 'animationDuration', label: 'Animation Duration (ms)', type: 'number', defaultValue: 2000, group: 'Animation' },
        ],
        defaultProps: {
            stats: [
                { value: '500', label: 'Average Savings', prefix: '$', suffix: '/year' },
                { value: '50', label: 'Insurance Partners', suffix: '+' },
                { value: '1000000', label: 'Quotes Generated', suffix: '+' },
            ],
            animationDuration: 2000,
        },
        supportedVariables: ['page_title', 'avg_savings', 'total_providers'],
    },
];

// ============================================
// CONTENT SECTIONS (15 variants)
// ============================================

export const contentComponents: ComponentDefinition[] = [
    {
        id: 'content-text',
        name: 'Text Block',
        slug: 'content-text',
        category: 'content',
        description: 'Rich text content block',
        icon: '📝',
        props: [
            { name: 'content', label: 'Content', type: 'richtext', required: true, group: 'Content' },
            { name: 'alignment', label: 'Text Alignment', type: 'alignment', defaultValue: 'left', group: 'Style' },
            {
                name: 'maxWidth', label: 'Max Width', type: 'select', options: [
                    { label: 'Small (600px)', value: 'sm' },
                    { label: 'Medium (800px)', value: 'md' },
                    { label: 'Large (1000px)', value: 'lg' },
                    { label: 'Full', value: 'full' },
                ], defaultValue: 'lg', group: 'Style'
            },
            { name: 'padding', label: 'Padding', type: 'spacing', defaultValue: { top: 16, bottom: 16, left: 0, right: 0 }, group: 'Style' },
        ],
        defaultProps: {
            alignment: 'left',
            maxWidth: 'lg',
        },
        supportedVariables: ['page_title', 'insurance_type', 'state', 'city', 'avg_premium'],
    },
    {
        id: 'content-two-column',
        name: 'Two Column Layout',
        slug: 'content-two-column',
        category: 'content',
        description: 'Two column content layout',
        icon: '▥',
        props: [
            { name: 'leftContent', label: 'Left Content', type: 'richtext', group: 'Content' },
            { name: 'rightContent', label: 'Right Content', type: 'richtext', group: 'Content' },
            {
                name: 'leftWidth', label: 'Left Column Width', type: 'select', options: [
                    { label: '1/3', value: '33' },
                    { label: '1/2', value: '50' },
                    { label: '2/3', value: '66' },
                ], defaultValue: '50', group: 'Layout'
            },
            { name: 'gap', label: 'Gap', type: 'number', defaultValue: 32, group: 'Layout' },
            { name: 'stackOnMobile', label: 'Stack on Mobile', type: 'boolean', defaultValue: true, group: 'Responsive' },
        ],
        defaultProps: {
            leftWidth: '50',
            gap: 32,
            stackOnMobile: true,
        },
        supportedVariables: ['page_title', 'insurance_type'],
    },
    {
        id: 'content-image-text',
        name: 'Image + Text',
        slug: 'content-image-text',
        category: 'content',
        description: 'Image with text content side by side',
        icon: '🖼️',
        props: [
            { name: 'image', label: 'Image', type: 'image', required: true, group: 'Media' },
            { name: 'imageAlt', label: 'Image Alt', type: 'text', group: 'Media' },
            {
                name: 'imagePosition', label: 'Image Position', type: 'select', options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                ], defaultValue: 'left', group: 'Layout'
            },
            { name: 'title', label: 'Title', type: 'text', group: 'Content' },
            { name: 'content', label: 'Content', type: 'richtext', group: 'Content' },
            { name: 'ctaText', label: 'CTA Text', type: 'text', group: 'CTA' },
            { name: 'ctaUrl', label: 'CTA URL', type: 'url', group: 'CTA' },
        ],
        defaultProps: {
            imagePosition: 'left',
        },
        supportedVariables: ['page_title', 'insurance_type'],
    },
    {
        id: 'content-accordion',
        name: 'Accordion / FAQ',
        slug: 'content-accordion',
        category: 'content',
        description: 'Expandable accordion sections',
        icon: '📋',
        props: [
            { name: 'title', label: 'Section Title', type: 'text', group: 'Content' },
            { name: 'subtitle', label: 'Section Subtitle', type: 'textarea', group: 'Content' },
            {
                name: 'items', label: 'Accordion Items', type: 'array', arrayItemSchema: [
                    { name: 'question', label: 'Question/Title', type: 'text', required: true },
                    { name: 'answer', label: 'Answer/Content', type: 'richtext', required: true },
                ], group: 'Items'
            },
            { name: 'allowMultiple', label: 'Allow Multiple Open', type: 'boolean', defaultValue: false, group: 'Behavior' },
            { name: 'defaultOpen', label: 'First Item Open', type: 'boolean', defaultValue: true, group: 'Behavior' },
            { name: 'includeSchema', label: 'Include FAQ Schema', type: 'boolean', defaultValue: true, group: 'SEO' },
            {
                name: 'style', label: 'Style', type: 'select', options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Bordered', value: 'bordered' },
                    { label: 'Separated', value: 'separated' },
                ], defaultValue: 'default', group: 'Style'
            },
        ],
        defaultProps: {
            allowMultiple: false,
            defaultOpen: true,
            includeSchema: true,
            style: 'default',
        },
        supportedVariables: ['insurance_type', 'state', 'city'],
    },
    {
        id: 'content-tabs',
        name: 'Tabs',
        slug: 'content-tabs',
        category: 'content',
        description: 'Tabbed content sections',
        icon: '📑',
        props: [
            {
                name: 'tabs', label: 'Tabs', type: 'array', arrayItemSchema: [
                    { name: 'label', label: 'Tab Label', type: 'text', required: true },
                    { name: 'icon', label: 'Tab Icon', type: 'icon' },
                    { name: 'content', label: 'Tab Content', type: 'richtext', required: true },
                ], group: 'Tabs'
            },
            { name: 'defaultTab', label: 'Default Tab Index', type: 'number', defaultValue: 0, group: 'Behavior' },
            {
                name: 'tabStyle', label: 'Tab Style', type: 'select', options: [
                    { label: 'Underline', value: 'underline' },
                    { label: 'Pills', value: 'pills' },
                    { label: 'Boxed', value: 'boxed' },
                ], defaultValue: 'underline', group: 'Style'
            },
        ],
        defaultProps: {
            defaultTab: 0,
            tabStyle: 'underline',
        },
        supportedVariables: ['insurance_type'],
    },
    {
        id: 'content-table',
        name: 'Data Table',
        slug: 'content-table',
        category: 'content',
        description: 'Responsive data table',
        icon: '📊',
        props: [
            { name: 'title', label: 'Table Title', type: 'text', group: 'Content' },
            {
                name: 'headers', label: 'Headers', type: 'array', arrayItemSchema: [
                    { name: 'label', label: 'Header', type: 'text', required: true },
                    { name: 'key', label: 'Key', type: 'text', required: true },
                    {
                        name: 'align', label: 'Alignment', type: 'select', options: [
                            { label: 'Left', value: 'left' },
                            { label: 'Center', value: 'center' },
                            { label: 'Right', value: 'right' },
                        ]
                    },
                ], group: 'Structure'
            },
            { name: 'rows', label: 'Rows', type: 'json', group: 'Data' },
            { name: 'striped', label: 'Striped Rows', type: 'boolean', defaultValue: true, group: 'Style' },
            { name: 'hoverable', label: 'Hover Effect', type: 'boolean', defaultValue: true, group: 'Style' },
            { name: 'bordered', label: 'Bordered', type: 'boolean', defaultValue: false, group: 'Style' },
            { name: 'sortable', label: 'Sortable', type: 'boolean', defaultValue: false, group: 'Behavior' },
            { name: 'searchable', label: 'Searchable', type: 'boolean', defaultValue: false, group: 'Behavior' },
        ],
        defaultProps: {
            striped: true,
            hoverable: true,
            bordered: false,
            sortable: false,
            searchable: false,
        },
        supportedVariables: ['insurance_type', 'state'],
    },
    {
        id: 'content-comparison',
        name: 'Comparison Table',
        slug: 'content-comparison',
        category: 'content',
        description: 'Side-by-side comparison table',
        icon: '⚖️',
        props: [
            { name: 'title', label: 'Title', type: 'text', group: 'Content' },
            {
                name: 'items', label: 'Items to Compare', type: 'array', arrayItemSchema: [
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'logo', label: 'Logo', type: 'image' },
                    { name: 'rating', label: 'Rating', type: 'number' },
                    { name: 'price', label: 'Price', type: 'text' },
                    { name: 'features', label: 'Features', type: 'json' },
                    { name: 'ctaText', label: 'CTA Text', type: 'text' },
                    { name: 'ctaUrl', label: 'CTA URL', type: 'url' },
                ], group: 'Items'
            },
            {
                name: 'features', label: 'Features to Compare', type: 'array', arrayItemSchema: [
                    { name: 'name', label: 'Feature Name', type: 'text', required: true },
                    { name: 'key', label: 'Feature Key', type: 'text', required: true },
                ], group: 'Features'
            },
            { name: 'highlightBest', label: 'Highlight Best', type: 'boolean', defaultValue: true, group: 'Style' },
        ],
        defaultProps: {
            highlightBest: true,
        },
        supportedVariables: ['insurance_type'],
    },
];

// ============================================
// CTA SECTIONS (8 variants)
// ============================================

export const ctaComponents: ComponentDefinition[] = [
    {
        id: 'cta-banner',
        name: 'CTA Banner',
        slug: 'cta-banner',
        category: 'cta',
        description: 'Full-width call to action banner',
        icon: '📢',
        props: [
            { name: 'title', label: 'Title', type: 'text', required: true, group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', group: 'Content' },
            { name: 'primaryCta', label: 'Primary CTA', type: 'text', defaultValue: 'Get Started', group: 'CTA' },
            { name: 'primaryCtaUrl', label: 'Primary CTA URL', type: 'url', group: 'CTA' },
            { name: 'secondaryCta', label: 'Secondary CTA', type: 'text', group: 'CTA' },
            { name: 'secondaryCtaUrl', label: 'Secondary CTA URL', type: 'url', group: 'CTA' },
            { name: 'backgroundColor', label: 'Background', type: 'color', defaultValue: '#0f172a', group: 'Style' },
            { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff', group: 'Style' },
            {
                name: 'pattern', label: 'Background Pattern', type: 'select', options: [
                    { label: 'None', value: 'none' },
                    { label: 'Dots', value: 'dots' },
                    { label: 'Grid', value: 'grid' },
                    { label: 'Waves', value: 'waves' },
                ], defaultValue: 'none', group: 'Style'
            },
        ],
        defaultProps: {
            primaryCta: 'Get Started',
            backgroundColor: '#0f172a',
            textColor: '#ffffff',
            pattern: 'none',
        },
        supportedVariables: ['insurance_type', 'state', 'city'],
    },
    {
        id: 'cta-inline',
        name: 'Inline CTA',
        slug: 'cta-inline',
        category: 'cta',
        description: 'Inline call to action within content',
        icon: '👆',
        props: [
            { name: 'text', label: 'Text', type: 'text', required: true, group: 'Content' },
            { name: 'ctaText', label: 'CTA Text', type: 'text', required: true, group: 'CTA' },
            { name: 'ctaUrl', label: 'CTA URL', type: 'url', required: true, group: 'CTA' },
            {
                name: 'style', label: 'Style', type: 'select', options: [
                    { label: 'Minimal', value: 'minimal' },
                    { label: 'Card', value: 'card' },
                    { label: 'Highlight', value: 'highlight' },
                ], defaultValue: 'card', group: 'Style'
            },
        ],
        defaultProps: {
            style: 'card',
        },
        supportedVariables: ['insurance_type'],
    },
    {
        id: 'cta-sticky',
        name: 'Sticky CTA Bar',
        slug: 'cta-sticky',
        category: 'cta',
        description: 'Sticky CTA bar at top or bottom',
        icon: '📌',
        props: [
            { name: 'text', label: 'Text', type: 'text', group: 'Content' },
            { name: 'ctaText', label: 'CTA Text', type: 'text', required: true, group: 'CTA' },
            { name: 'ctaUrl', label: 'CTA URL', type: 'url', required: true, group: 'CTA' },
            {
                name: 'position', label: 'Position', type: 'select', options: [
                    { label: 'Top', value: 'top' },
                    { label: 'Bottom', value: 'bottom' },
                ], defaultValue: 'bottom', group: 'Layout'
            },
            { name: 'showOnScroll', label: 'Show on Scroll', type: 'boolean', defaultValue: true, group: 'Behavior' },
            { name: 'scrollThreshold', label: 'Scroll Threshold (px)', type: 'number', defaultValue: 300, group: 'Behavior', showIf: { field: 'showOnScroll', value: true } },
        ],
        defaultProps: {
            position: 'bottom',
            showOnScroll: true,
            scrollThreshold: 300,
        },
        supportedVariables: ['insurance_type'],
    },
];

// ============================================
// FORM COMPONENTS (6 variants)
// ============================================

export const formComponents: ComponentDefinition[] = [
    {
        id: 'form-quote',
        name: 'Quote Form',
        slug: 'form-quote',
        category: 'form',
        description: 'Multi-step quote request form',
        icon: '📋',
        props: [
            { name: 'title', label: 'Form Title', type: 'text', group: 'Content' },
            { name: 'subtitle', label: 'Form Subtitle', type: 'textarea', group: 'Content' },
            {
                name: 'steps', label: 'Form Steps', type: 'array', arrayItemSchema: [
                    { name: 'title', label: 'Step Title', type: 'text' },
                    { name: 'fields', label: 'Fields', type: 'json' },
                ], group: 'Form'
            },
            { name: 'submitText', label: 'Submit Button Text', type: 'text', defaultValue: 'Get My Quote', group: 'Form' },
            { name: 'submitAction', label: 'Submit Action URL', type: 'url', group: 'Form' },
            { name: 'successMessage', label: 'Success Message', type: 'textarea', group: 'Form' },
            { name: 'showProgress', label: 'Show Progress', type: 'boolean', defaultValue: true, group: 'Style' },
        ],
        defaultProps: {
            submitText: 'Get My Quote',
            showProgress: true,
        },
        supportedVariables: ['insurance_type', 'state'],
    },
    {
        id: 'form-contact',
        name: 'Contact Form',
        slug: 'form-contact',
        category: 'form',
        description: 'Simple contact form',
        icon: '✉️',
        props: [
            { name: 'title', label: 'Title', type: 'text', group: 'Content' },
            {
                name: 'fields', label: 'Fields', type: 'array', arrayItemSchema: [
                    { name: 'name', label: 'Field Name', type: 'text', required: true },
                    { name: 'label', label: 'Label', type: 'text', required: true },
                    {
                        name: 'type', label: 'Type', type: 'select', options: [
                            { label: 'Text', value: 'text' },
                            { label: 'Email', value: 'email' },
                            { label: 'Phone', value: 'tel' },
                            { label: 'Textarea', value: 'textarea' },
                            { label: 'Select', value: 'select' },
                        ]
                    },
                    { name: 'required', label: 'Required', type: 'boolean' },
                    { name: 'placeholder', label: 'Placeholder', type: 'text' },
                ], group: 'Form'
            },
            { name: 'submitText', label: 'Submit Text', type: 'text', defaultValue: 'Send Message', group: 'Form' },
        ],
        defaultProps: {
            submitText: 'Send Message',
            fields: [
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'message', label: 'Message', type: 'textarea', required: true },
            ],
        },
        supportedVariables: [],
    },
    {
        id: 'form-newsletter',
        name: 'Newsletter Signup',
        slug: 'form-newsletter',
        category: 'form',
        description: 'Email newsletter signup form',
        icon: '📧',
        props: [
            { name: 'title', label: 'Title', type: 'text', defaultValue: 'Stay Updated', group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', group: 'Content' },
            { name: 'placeholder', label: 'Email Placeholder', type: 'text', defaultValue: 'Enter your email', group: 'Form' },
            { name: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Subscribe', group: 'Form' },
            {
                name: 'layout', label: 'Layout', type: 'select', options: [
                    { label: 'Inline', value: 'inline' },
                    { label: 'Stacked', value: 'stacked' },
                ], defaultValue: 'inline', group: 'Style'
            },
        ],
        defaultProps: {
            title: 'Stay Updated',
            placeholder: 'Enter your email',
            buttonText: 'Subscribe',
            layout: 'inline',
        },
        supportedVariables: [],
    },
];

// ============================================
// SOCIAL PROOF (8 variants)
// ============================================

export const socialProofComponents: ComponentDefinition[] = [
    {
        id: 'testimonials-carousel',
        name: 'Testimonials Carousel',
        slug: 'testimonials-carousel',
        category: 'social',
        description: 'Rotating testimonials carousel',
        icon: '💬',
        props: [
            { name: 'title', label: 'Section Title', type: 'text', group: 'Content' },
            {
                name: 'testimonials', label: 'Testimonials', type: 'array', arrayItemSchema: [
                    { name: 'quote', label: 'Quote', type: 'textarea', required: true },
                    { name: 'author', label: 'Author Name', type: 'text', required: true },
                    { name: 'role', label: 'Role/Title', type: 'text' },
                    { name: 'avatar', label: 'Avatar', type: 'image' },
                    { name: 'rating', label: 'Rating', type: 'number', min: 1, max: 5 },
                    { name: 'location', label: 'Location', type: 'text' },
                ], group: 'Testimonials'
            },
            { name: 'autoplay', label: 'Autoplay', type: 'boolean', defaultValue: true, group: 'Behavior' },
            { name: 'interval', label: 'Interval (ms)', type: 'number', defaultValue: 5000, group: 'Behavior', showIf: { field: 'autoplay', value: true } },
            { name: 'showDots', label: 'Show Dots', type: 'boolean', defaultValue: true, group: 'Style' },
            { name: 'showArrows', label: 'Show Arrows', type: 'boolean', defaultValue: true, group: 'Style' },
        ],
        defaultProps: {
            autoplay: true,
            interval: 5000,
            showDots: true,
            showArrows: true,
        },
        supportedVariables: ['state', 'city'],
    },
    {
        id: 'testimonials-grid',
        name: 'Testimonials Grid',
        slug: 'testimonials-grid',
        category: 'social',
        description: 'Grid layout of testimonials',
        icon: '⭐',
        props: [
            { name: 'title', label: 'Section Title', type: 'text', group: 'Content' },
            {
                name: 'testimonials', label: 'Testimonials', type: 'array', arrayItemSchema: [
                    { name: 'quote', label: 'Quote', type: 'textarea', required: true },
                    { name: 'author', label: 'Author', type: 'text', required: true },
                    { name: 'rating', label: 'Rating', type: 'number', min: 1, max: 5 },
                ], group: 'Testimonials'
            },
            {
                name: 'columns', label: 'Columns', type: 'select', options: [
                    { label: '2 Columns', value: '2' },
                    { label: '3 Columns', value: '3' },
                    { label: '4 Columns', value: '4' },
                ], defaultValue: '3', group: 'Layout'
            },
        ],
        defaultProps: {
            columns: '3',
        },
        supportedVariables: [],
    },
    {
        id: 'trust-badges',
        name: 'Trust Badges',
        slug: 'trust-badges',
        category: 'social',
        description: 'Row of trust badges and certifications',
        icon: '🏆',
        props: [
            { name: 'title', label: 'Title', type: 'text', group: 'Content' },
            {
                name: 'badges', label: 'Badges', type: 'array', arrayItemSchema: [
                    { name: 'image', label: 'Badge Image', type: 'image', required: true },
                    { name: 'alt', label: 'Alt Text', type: 'text' },
                    { name: 'url', label: 'Link URL', type: 'url' },
                ], group: 'Badges'
            },
            {
                name: 'style', label: 'Style', type: 'select', options: [
                    { label: 'Grayscale', value: 'grayscale' },
                    { label: 'Color', value: 'color' },
                    { label: 'Color on Hover', value: 'grayscale-hover' },
                ], defaultValue: 'grayscale-hover', group: 'Style'
            },
        ],
        defaultProps: {
            style: 'grayscale-hover',
        },
        supportedVariables: [],
    },
    {
        id: 'carrier-logos',
        name: 'Carrier Logos',
        slug: 'carrier-logos',
        category: 'social',
        description: 'Insurance carrier logo showcase',
        icon: '🏢',
        props: [
            { name: 'title', label: 'Title', type: 'text', defaultValue: 'Compare Top Carriers', group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', group: 'Content' },
            {
                name: 'logos', label: 'Logos', type: 'array', arrayItemSchema: [
                    { name: 'name', label: 'Carrier Name', type: 'text', required: true },
                    { name: 'logo', label: 'Logo', type: 'image', required: true },
                    { name: 'url', label: 'Link URL', type: 'url' },
                ], group: 'Logos'
            },
            {
                name: 'layout', label: 'Layout', type: 'select', options: [
                    { label: 'Grid', value: 'grid' },
                    { label: 'Scroll', value: 'scroll' },
                    { label: 'Marquee', value: 'marquee' },
                ], defaultValue: 'grid', group: 'Style'
            },
            { name: 'grayscale', label: 'Grayscale', type: 'boolean', defaultValue: true, group: 'Style' },
        ],
        defaultProps: {
            title: 'Compare Top Carriers',
            layout: 'grid',
            grayscale: true,
        },
        supportedVariables: [],
    },
    {
        id: 'rating-summary',
        name: 'Rating Summary',
        slug: 'rating-summary',
        category: 'social',
        description: 'Overall rating summary with breakdown',
        icon: '⭐',
        props: [
            { name: 'averageRating', label: 'Average Rating', type: 'number', min: 1, max: 5, step: 0.1, defaultValue: 4.8, group: 'Data' },
            { name: 'totalReviews', label: 'Total Reviews', type: 'number', defaultValue: 10000, group: 'Data' },
            { name: 'breakdown', label: 'Rating Breakdown', type: 'json', group: 'Data' },
            { name: 'source', label: 'Source', type: 'text', defaultValue: 'Trustpilot', group: 'Data' },
            { name: 'sourceUrl', label: 'Source URL', type: 'url', group: 'Data' },
            { name: 'showBreakdown', label: 'Show Breakdown', type: 'boolean', defaultValue: true, group: 'Display' },
        ],
        defaultProps: {
            averageRating: 4.8,
            totalReviews: 10000,
            source: 'Trustpilot',
            showBreakdown: true,
            breakdown: { 5: 80, 4: 12, 3: 5, 2: 2, 1: 1 },
        },
        supportedVariables: ['avg_rating', 'total_reviews'],
    },
];

// ============================================
// FEATURES & BENEFITS (6 variants)
// ============================================

export const featureComponents: ComponentDefinition[] = [
    {
        id: 'features-grid',
        name: 'Features Grid',
        slug: 'features-grid',
        category: 'features',
        description: 'Grid of feature cards',
        icon: '🎁',
        props: [
            { name: 'title', label: 'Section Title', type: 'text', group: 'Content' },
            { name: 'subtitle', label: 'Section Subtitle', type: 'textarea', group: 'Content' },
            {
                name: 'features', label: 'Features', type: 'array', arrayItemSchema: [
                    { name: 'icon', label: 'Icon', type: 'icon' },
                    { name: 'title', label: 'Title', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'link', label: 'Link', type: 'url' },
                ], group: 'Features'
            },
            {
                name: 'columns', label: 'Columns', type: 'select', options: [
                    { label: '2 Columns', value: '2' },
                    { label: '3 Columns', value: '3' },
                    { label: '4 Columns', value: '4' },
                ], defaultValue: '3', group: 'Layout'
            },
            {
                name: 'cardStyle', label: 'Card Style', type: 'select', options: [
                    { label: 'Flat', value: 'flat' },
                    { label: 'Elevated', value: 'elevated' },
                    { label: 'Bordered', value: 'bordered' },
                    { label: 'Gradient', value: 'gradient' },
                ], defaultValue: 'elevated', group: 'Style'
            },
        ],
        defaultProps: {
            columns: '3',
            cardStyle: 'elevated',
        },
        supportedVariables: ['insurance_type'],
    },
    {
        id: 'features-list',
        name: 'Features List',
        slug: 'features-list',
        category: 'features',
        description: 'Vertical list of features with icons',
        icon: '✅',
        props: [
            { name: 'title', label: 'Title', type: 'text', group: 'Content' },
            {
                name: 'features', label: 'Features', type: 'array', arrayItemSchema: [
                    { name: 'text', label: 'Text', type: 'text', required: true },
                    { name: 'icon', label: 'Icon', type: 'icon' },
                ], group: 'Features'
            },
            { name: 'iconColor', label: 'Icon Color', type: 'color', defaultValue: '#10b981', group: 'Style' },
            {
                name: 'columns', label: 'Columns', type: 'select', options: [
                    { label: '1 Column', value: '1' },
                    { label: '2 Columns', value: '2' },
                ], defaultValue: '1', group: 'Layout'
            },
        ],
        defaultProps: {
            iconColor: '#10b981',
            columns: '1',
        },
        supportedVariables: [],
    },
    {
        id: 'how-it-works',
        name: 'How It Works',
        slug: 'how-it-works',
        category: 'features',
        description: 'Step-by-step process explanation',
        icon: '🔢',
        props: [
            { name: 'title', label: 'Section Title', type: 'text', defaultValue: 'How It Works', group: 'Content' },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea', group: 'Content' },
            {
                name: 'steps', label: 'Steps', type: 'array', arrayItemSchema: [
                    { name: 'number', label: 'Step Number', type: 'text' },
                    { name: 'title', label: 'Title', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'icon', label: 'Icon', type: 'icon' },
                    { name: 'image', label: 'Image', type: 'image' },
                ], group: 'Steps'
            },
            {
                name: 'layout', label: 'Layout', type: 'select', options: [
                    { label: 'Horizontal', value: 'horizontal' },
                    { label: 'Vertical', value: 'vertical' },
                    { label: 'Alternating', value: 'alternating' },
                ], defaultValue: 'horizontal', group: 'Layout'
            },
            { name: 'showConnectors', label: 'Show Connectors', type: 'boolean', defaultValue: true, group: 'Style' },
        ],
        defaultProps: {
            title: 'How It Works',
            layout: 'horizontal',
            showConnectors: true,
            steps: [
                { number: '1', title: 'Enter Your Info', description: 'Tell us about yourself and your coverage needs' },
                { number: '2', title: 'Compare Quotes', description: 'See rates from multiple top carriers' },
                { number: '3', title: 'Choose & Save', description: 'Pick the best coverage at the lowest price' },
            ],
        },
        supportedVariables: [],
    },
    {
        id: 'stats-counter',
        name: 'Stats Counter',
        slug: 'stats-counter',
        category: 'features',
        description: 'Animated statistics counters',
        icon: '📈',
        props: [
            {
                name: 'stats', label: 'Statistics', type: 'array', arrayItemSchema: [
                    { name: 'value', label: 'Value', type: 'text', required: true },
                    { name: 'label', label: 'Label', type: 'text', required: true },
                    { name: 'prefix', label: 'Prefix', type: 'text' },
                    { name: 'suffix', label: 'Suffix', type: 'text' },
                    { name: 'icon', label: 'Icon', type: 'icon' },
                ], group: 'Stats'
            },
            { name: 'animate', label: 'Animate', type: 'boolean', defaultValue: true, group: 'Animation' },
            { name: 'duration', label: 'Duration (ms)', type: 'number', defaultValue: 2000, group: 'Animation', showIf: { field: 'animate', value: true } },
            { name: 'backgroundColor', label: 'Background', type: 'color', group: 'Style' },
            {
                name: 'layout', label: 'Layout', type: 'select', options: [
                    { label: 'Row', value: 'row' },
                    { label: 'Grid', value: 'grid' },
                ], defaultValue: 'row', group: 'Layout'
            },
        ],
        defaultProps: {
            animate: true,
            duration: 2000,
            layout: 'row',
            stats: [
                { value: '500', label: 'Average Savings', prefix: '$', suffix: '/year' },
                { value: '50', label: 'Insurance Partners', suffix: '+' },
                { value: '1000000', label: 'Quotes Generated', suffix: '+' },
                { value: '98', label: 'Customer Satisfaction', suffix: '%' },
            ],
        },
        supportedVariables: ['avg_savings', 'total_providers', 'total_quotes'],
    },
];

// ============================================
// NAVIGATION & STRUCTURE (5 variants)
// ============================================

export const navigationComponents: ComponentDefinition[] = [
    {
        id: 'breadcrumbs',
        name: 'Breadcrumbs',
        slug: 'breadcrumbs',
        category: 'navigation',
        description: 'Page breadcrumb navigation',
        icon: '🔗',
        props: [
            {
                name: 'items', label: 'Breadcrumb Items', type: 'array', arrayItemSchema: [
                    { name: 'label', label: 'Label', type: 'text', required: true },
                    { name: 'url', label: 'URL', type: 'url' },
                ], group: 'Items'
            },
            {
                name: 'separator', label: 'Separator', type: 'select', options: [
                    { label: 'Slash (/)', value: 'slash' },
                    { label: 'Arrow (>)', value: 'arrow' },
                    { label: 'Chevron (›)', value: 'chevron' },
                ], defaultValue: 'chevron', group: 'Style'
            },
            { name: 'includeSchema', label: 'Include Schema', type: 'boolean', defaultValue: true, group: 'SEO' },
        ],
        defaultProps: {
            separator: 'chevron',
            includeSchema: true,
        },
        supportedVariables: ['page_title', 'insurance_type', 'state', 'city'],
    },
    {
        id: 'table-of-contents',
        name: 'Table of Contents',
        slug: 'table-of-contents',
        category: 'navigation',
        description: 'Auto-generated table of contents',
        icon: '📑',
        props: [
            { name: 'title', label: 'Title', type: 'text', defaultValue: 'Table of Contents', group: 'Content' },
            { name: 'maxDepth', label: 'Max Depth', type: 'number', min: 1, max: 6, defaultValue: 3, group: 'Behavior' },
            { name: 'numbered', label: 'Numbered', type: 'boolean', defaultValue: true, group: 'Style' },
            { name: 'sticky', label: 'Sticky', type: 'boolean', defaultValue: false, group: 'Behavior' },
            { name: 'collapsible', label: 'Collapsible', type: 'boolean', defaultValue: true, group: 'Behavior' },
        ],
        defaultProps: {
            title: 'Table of Contents',
            maxDepth: 3,
            numbered: true,
            sticky: false,
            collapsible: true,
        },
        supportedVariables: [],
    },
    {
        id: 'related-pages',
        name: 'Related Pages',
        slug: 'related-pages',
        category: 'navigation',
        description: 'Grid of related pages',
        icon: '🔀',
        props: [
            { name: 'title', label: 'Section Title', type: 'text', defaultValue: 'Related Pages', group: 'Content' },
            {
                name: 'pages', label: 'Pages', type: 'array', arrayItemSchema: [
                    { name: 'title', label: 'Title', type: 'text', required: true },
                    { name: 'url', label: 'URL', type: 'url', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'image', label: 'Image', type: 'image' },
                ], group: 'Pages'
            },
            { name: 'autoGenerate', label: 'Auto Generate', type: 'boolean', defaultValue: true, group: 'Behavior', description: 'Automatically fetch related pages' },
            { name: 'maxItems', label: 'Max Items', type: 'number', defaultValue: 6, group: 'Behavior' },
            {
                name: 'columns', label: 'Columns', type: 'select', options: [
                    { label: '2 Columns', value: '2' },
                    { label: '3 Columns', value: '3' },
                    { label: '4 Columns', value: '4' },
                ], defaultValue: '3', group: 'Layout'
            },
        ],
        defaultProps: {
            title: 'Related Pages',
            autoGenerate: true,
            maxItems: 6,
            columns: '3',
        },
        supportedVariables: ['insurance_type', 'state'],
    },
];

// ============================================
// SEO & SCHEMA (4 variants)
// ============================================

export const seoComponents: ComponentDefinition[] = [
    {
        id: 'schema-faq',
        name: 'FAQ Schema',
        slug: 'schema-faq',
        category: 'seo',
        description: 'FAQ Schema.org markup (invisible)',
        icon: '🔍',
        props: [
            {
                name: 'faqs', label: 'FAQs', type: 'array', arrayItemSchema: [
                    { name: 'question', label: 'Question', type: 'text', required: true },
                    { name: 'answer', label: 'Answer', type: 'textarea', required: true },
                ], group: 'Data'
            },
        ],
        defaultProps: {
            faqs: [],
        },
        supportedVariables: ['insurance_type', 'state', 'city'],
    },
    {
        id: 'schema-local-business',
        name: 'Local Business Schema',
        slug: 'schema-local-business',
        category: 'seo',
        description: 'Local business Schema.org markup',
        icon: '🏪',
        props: [
            { name: 'name', label: 'Business Name', type: 'text', group: 'Data' },
            { name: 'address', label: 'Address', type: 'json', group: 'Data' },
            { name: 'phone', label: 'Phone', type: 'text', group: 'Data' },
            { name: 'openingHours', label: 'Opening Hours', type: 'json', group: 'Data' },
            { name: 'priceRange', label: 'Price Range', type: 'text', group: 'Data' },
        ],
        defaultProps: {},
        supportedVariables: ['city', 'state'],
    },
    {
        id: 'schema-product',
        name: 'Product Schema',
        slug: 'schema-product',
        category: 'seo',
        description: 'Product/Service Schema.org markup',
        icon: '📦',
        props: [
            { name: 'name', label: 'Product Name', type: 'text', group: 'Data' },
            { name: 'description', label: 'Description', type: 'textarea', group: 'Data' },
            { name: 'brand', label: 'Brand', type: 'text', group: 'Data' },
            { name: 'rating', label: 'Rating', type: 'number', min: 1, max: 5, step: 0.1, group: 'Data' },
            { name: 'reviewCount', label: 'Review Count', type: 'number', group: 'Data' },
            { name: 'price', label: 'Price', type: 'text', group: 'Data' },
        ],
        defaultProps: {},
        supportedVariables: ['insurance_type', 'avg_premium'],
    },
];

// ============================================
// UTILITY COMPONENTS (5 variants)
// ============================================

export const utilityComponents: ComponentDefinition[] = [
    {
        id: 'spacer',
        name: 'Spacer',
        slug: 'spacer',
        category: 'utility',
        description: 'Vertical spacing between sections',
        icon: '↕️',
        props: [
            {
                name: 'height', label: 'Height', type: 'select', options: [
                    { label: 'Extra Small (8px)', value: 'xs' },
                    { label: 'Small (16px)', value: 'sm' },
                    { label: 'Medium (32px)', value: 'md' },
                    { label: 'Large (48px)', value: 'lg' },
                    { label: 'Extra Large (64px)', value: 'xl' },
                    { label: 'Custom', value: 'custom' },
                ], defaultValue: 'md', group: 'Size'
            },
            { name: 'customHeight', label: 'Custom Height (px)', type: 'number', group: 'Size', showIf: { field: 'height', value: 'custom' } },
            { name: 'showDivider', label: 'Show Divider', type: 'boolean', defaultValue: false, group: 'Style' },
            { name: 'dividerColor', label: 'Divider Color', type: 'color', defaultValue: '#e5e7eb', group: 'Style', showIf: { field: 'showDivider', value: true } },
        ],
        defaultProps: {
            height: 'md',
            showDivider: false,
            dividerColor: '#e5e7eb',
        },
        supportedVariables: [],
    },
    {
        id: 'divider',
        name: 'Divider',
        slug: 'divider',
        category: 'utility',
        description: 'Horizontal divider line',
        icon: '➖',
        props: [
            {
                name: 'style', label: 'Style', type: 'select', options: [
                    { label: 'Solid', value: 'solid' },
                    { label: 'Dashed', value: 'dashed' },
                    { label: 'Dotted', value: 'dotted' },
                ], defaultValue: 'solid', group: 'Style'
            },
            { name: 'color', label: 'Color', type: 'color', defaultValue: '#e5e7eb', group: 'Style' },
            {
                name: 'width', label: 'Width', type: 'select', options: [
                    { label: 'Full', value: 'full' },
                    { label: '75%', value: '75' },
                    { label: '50%', value: '50' },
                    { label: '25%', value: '25' },
                ], defaultValue: 'full', group: 'Style'
            },
            { name: 'thickness', label: 'Thickness (px)', type: 'number', defaultValue: 1, group: 'Style' },
        ],
        defaultProps: {
            style: 'solid',
            color: '#e5e7eb',
            width: 'full',
            thickness: 1,
        },
        supportedVariables: [],
    },
    {
        id: 'html-embed',
        name: 'HTML Embed',
        slug: 'html-embed',
        category: 'utility',
        description: 'Custom HTML/CSS/JS embed',
        icon: '🧩',
        props: [
            { name: 'html', label: 'HTML', type: 'textarea', group: 'Code' },
            { name: 'css', label: 'CSS', type: 'textarea', group: 'Code' },
            { name: 'js', label: 'JavaScript', type: 'textarea', group: 'Code' },
            { name: 'sandboxed', label: 'Sandboxed', type: 'boolean', defaultValue: true, group: 'Security' },
        ],
        defaultProps: {
            sandboxed: true,
        },
        supportedVariables: [],
    },
    {
        id: 'conditional',
        name: 'Conditional Block',
        slug: 'conditional',
        category: 'utility',
        description: 'Show/hide based on conditions',
        icon: '❓',
        props: [
            {
                name: 'condition', label: 'Condition', type: 'select', options: [
                    { label: 'Variable Exists', value: 'exists' },
                    { label: 'Variable Equals', value: 'equals' },
                    { label: 'Variable Contains', value: 'contains' },
                    { label: 'Device Type', value: 'device' },
                    { label: 'Time Based', value: 'time' },
                ], group: 'Condition'
            },
            { name: 'variable', label: 'Variable', type: 'text', group: 'Condition' },
            { name: 'value', label: 'Value', type: 'text', group: 'Condition' },
            { name: 'content', label: 'Content', type: 'richtext', group: 'Content' },
            { name: 'fallbackContent', label: 'Fallback Content', type: 'richtext', group: 'Content' },
        ],
        defaultProps: {
            condition: 'exists',
        },
        supportedVariables: ['*'],
        allowChildren: true,
    },
];

// ============================================
// CALCULATOR COMPONENTS (3 variants)
// ============================================

export const calculatorComponents: ComponentDefinition[] = [
    {
        id: 'calculator-premium',
        name: 'Premium Calculator',
        slug: 'calculator-premium',
        category: 'calculator',
        description: 'Interactive insurance premium calculator',
        icon: '🧮',
        props: [
            { name: 'title', label: 'Title', type: 'text', defaultValue: 'Estimate Your Premium', group: 'Content' },
            {
                name: 'insuranceType', label: 'Insurance Type', type: 'select', options: [
                    { label: 'Auto', value: 'auto' },
                    { label: 'Home', value: 'home' },
                    { label: 'Life', value: 'life' },
                    { label: 'Health', value: 'health' },
                ], group: 'Settings'
            },
            { name: 'fields', label: 'Calculator Fields', type: 'json', group: 'Form' },
            { name: 'formula', label: 'Calculation Formula', type: 'textarea', group: 'Logic' },
            { name: 'resultFormat', label: 'Result Format', type: 'text', defaultValue: '${{result}}/month', group: 'Display' },
            { name: 'showComparison', label: 'Show Comparison', type: 'boolean', defaultValue: true, group: 'Display' },
        ],
        defaultProps: {
            title: 'Estimate Your Premium',
            resultFormat: '${{result}}/month',
            showComparison: true,
        },
        supportedVariables: ['insurance_type', 'state'],
    },
    {
        id: 'calculator-savings',
        name: 'Savings Calculator',
        slug: 'calculator-savings',
        category: 'calculator',
        description: 'Calculate potential savings',
        icon: '💰',
        props: [
            { name: 'title', label: 'Title', type: 'text', defaultValue: 'Calculate Your Savings', group: 'Content' },
            { name: 'currentPremiumLabel', label: 'Current Premium Label', type: 'text', defaultValue: 'Your Current Monthly Premium', group: 'Form' },
            { name: 'savingsPercentage', label: 'Avg Savings %', type: 'number', defaultValue: 25, group: 'Logic' },
            { name: 'ctaText', label: 'CTA Text', type: 'text', defaultValue: 'Get Your Free Quote', group: 'CTA' },
            { name: 'ctaUrl', label: 'CTA URL', type: 'url', group: 'CTA' },
        ],
        defaultProps: {
            title: 'Calculate Your Savings',
            currentPremiumLabel: 'Your Current Monthly Premium',
            savingsPercentage: 25,
            ctaText: 'Get Your Free Quote',
        },
        supportedVariables: ['avg_savings'],
    },
];

// ============================================
// EXPORT ALL COMPONENTS
// ============================================

export const allComponents: ComponentDefinition[] = [
    ...heroComponents,
    ...contentComponents,
    ...ctaComponents,
    ...formComponents,
    ...socialProofComponents,
    ...featureComponents,
    ...navigationComponents,
    ...seoComponents,
    ...utilityComponents,
    ...calculatorComponents,
];

export const componentCategories = [
    { id: 'hero', name: 'Hero Sections', icon: '🎯', description: 'Page header and hero sections' },
    { id: 'content', name: 'Content', icon: '📝', description: 'Text, tables, and content blocks' },
    { id: 'cta', name: 'Call to Action', icon: '📢', description: 'Buttons and conversion elements' },
    { id: 'form', name: 'Forms', icon: '📋', description: 'Input forms and lead capture' },
    { id: 'social', name: 'Social Proof', icon: '⭐', description: 'Testimonials, reviews, and trust' },
    { id: 'features', name: 'Features', icon: '🎁', description: 'Feature grids and benefits' },
    { id: 'navigation', name: 'Navigation', icon: '🔗', description: 'Breadcrumbs, TOC, and links' },
    { id: 'seo', name: 'SEO & Schema', icon: '🔍', description: 'Schema markup and SEO elements' },
    { id: 'utility', name: 'Utility', icon: '🔧', description: 'Spacers, dividers, and helpers' },
    { id: 'calculator', name: 'Calculators', icon: '🧮', description: 'Interactive calculators' },
];

export function getComponentById(id: string): ComponentDefinition | undefined {
    return allComponents.find(c => c.id === id);
}

export function getComponentsByCategory(category: string): ComponentDefinition[] {
    return allComponents.filter(c => c.category === category);
}

// System variables available in all templates
export const systemVariables = [
    { name: 'page_title', label: 'Page Title', description: 'The main title of the page' },
    { name: 'page_subtitle', label: 'Page Subtitle', description: 'Secondary title or tagline' },
    { name: 'insurance_type', label: 'Insurance Type', description: 'Type of insurance (e.g., Car Insurance)' },
    { name: 'insurance_type_slug', label: 'Insurance Type Slug', description: 'URL-friendly insurance type' },
    { name: 'country', label: 'Country', description: 'Country name' },
    { name: 'country_code', label: 'Country Code', description: 'Country code (e.g., US)' },
    { name: 'state', label: 'State', description: 'State name' },
    { name: 'state_code', label: 'State Code', description: 'State code (e.g., CA)' },
    { name: 'state_slug', label: 'State Slug', description: 'URL-friendly state name' },
    { name: 'city', label: 'City', description: 'City name' },
    { name: 'city_slug', label: 'City Slug', description: 'URL-friendly city name' },
    { name: 'slug', label: 'Slug', description: 'Page slug' },
    { name: 'location', label: 'Location', description: 'Full location string' },
    { name: 'avg_premium', label: 'Average Premium', description: 'Average insurance premium' },
    { name: 'avg_savings', label: 'Average Savings', description: 'Average savings amount' },
    { name: 'min_coverage', label: 'Minimum Coverage', description: 'State minimum coverage requirements' },
    { name: 'population', label: 'Population', description: 'City/State population' },
    { name: 'current_year', label: 'Current Year', description: 'Current year (e.g., 2025)' },
    { name: 'current_month', label: 'Current Month', description: 'Current month name' },
    { name: 'site_name', label: 'Site Name', description: 'Website name' },
    { name: 'site_url', label: 'Site URL', description: 'Website URL' },
];

