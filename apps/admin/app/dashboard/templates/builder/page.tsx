'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

// Types for the advanced builder
interface StyleProperties {
    // Layout
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    flex?: string;
    gap?: string;

    // Spacing
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;

    // Size
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    height?: string;
    minHeight?: string;
    maxHeight?: string;

    // Position
    position?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: string;

    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;

    // Border
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderTopWidth?: string;
    borderTopStyle?: string;
    borderTopColor?: string;
    borderRadius?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;

    // Shadow
    boxShadow?: string;

    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    textDecoration?: string;
    textTransform?: string;
    color?: string;

    // Effects
    opacity?: string;
    transform?: string;
    transition?: string;
    filter?: string;

    // Overflow
    overflow?: string;
    overflowX?: string;
    overflowY?: string;
}

interface ResponsiveStyles {
    desktop: StyleProperties;
    tablet: StyleProperties;
    mobile: StyleProperties;
}

interface AnimationSettings {
    type: 'none' | 'fade' | 'slide' | 'zoom' | 'bounce' | 'rotate' | 'custom';
    direction?: 'up' | 'down' | 'left' | 'right';
    duration?: number;
    delay?: number;
    easing?: string;
    customKeyframes?: string;
}

interface ElementContent {
    type: 'text' | 'html' | 'variable' | 'image' | 'icon' | 'button' | 'form' | 'video' | 'map' | 'code' | 'divider' | 'spacer';
    value?: string;
    variable?: string;
    fallback?: string;
    settings?: Record<string, any>;
}

interface BuilderElement {
    id: string;
    type: 'section' | 'container' | 'row' | 'column' | 'element';
    name?: string;
    content?: ElementContent;
    styles: ResponsiveStyles;
    animation?: AnimationSettings;
    conditions?: {
        field: string;
        operator: 'equals' | 'not_equals' | 'contains' | 'exists' | 'not_exists';
        value?: string;
    }[];
    attributes?: Record<string, string>;
    children?: BuilderElement[];
    isLocked?: boolean;
    isHidden?: boolean;
}

interface Template {
    id: string;
    name: string;
    slug: string;
    sections: BuilderElement[];
    globalStyles?: string;
    customVariables?: any[];
    seoTitleTemplate?: string;
    seoDescTemplate?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type PanelType = 'elements' | 'style' | 'advanced' | 'responsive' | 'layers';

const DEVICE_WIDTHS = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
};

const ELEMENT_LIBRARY = [
    {
        category: 'Layout',
        items: [
            { type: 'section', name: 'Section', icon: '▭', description: 'Full-width section container' },
            { type: 'container', name: 'Container', icon: '⬜', description: 'Centered content container' },
            { type: 'row', name: 'Row', icon: '☰', description: 'Horizontal row with columns' },
            { type: 'column', name: 'Column', icon: '▯', description: 'Vertical column' },
        ],
    },
    {
        category: 'Basic',
        items: [
            { type: 'heading', name: 'Heading', icon: 'H', description: 'H1-H6 heading text' },
            { type: 'text', name: 'Text', icon: 'T', description: 'Paragraph text' },
            { type: 'image', name: 'Image', icon: '🖼', description: 'Image with options' },
            { type: 'button', name: 'Button', icon: '▢', description: 'Call-to-action button' },
            { type: 'icon', name: 'Icon', icon: '★', description: 'Icon element' },
            { type: 'divider', name: 'Divider', icon: '—', description: 'Horizontal divider' },
            { type: 'spacer', name: 'Spacer', icon: '↕', description: 'Vertical spacing' },
        ],
    },
    {
        category: 'Content',
        items: [
            { type: 'richtext', name: 'Rich Text', icon: '¶', description: 'WYSIWYG editor' },
            { type: 'list', name: 'List', icon: '≡', description: 'Bullet or numbered list' },
            { type: 'accordion', name: 'Accordion', icon: '▼', description: 'Expandable sections' },
            { type: 'tabs', name: 'Tabs', icon: '⊞', description: 'Tabbed content' },
            { type: 'table', name: 'Table', icon: '⊞', description: 'Data table' },
            { type: 'quote', name: 'Quote', icon: '"', description: 'Blockquote' },
        ],
    },
    {
        category: 'Media',
        items: [
            { type: 'video', name: 'Video', icon: '▶', description: 'Video embed' },
            { type: 'gallery', name: 'Gallery', icon: '⊞', description: 'Image gallery' },
            { type: 'carousel', name: 'Carousel', icon: '↔', description: 'Image/content slider' },
            { type: 'map', name: 'Map', icon: '📍', description: 'Google Maps embed' },
        ],
    },
    {
        category: 'Forms',
        items: [
            { type: 'form', name: 'Form', icon: '📋', description: 'Contact/lead form' },
            { type: 'input', name: 'Input', icon: '▭', description: 'Text input field' },
            { type: 'select', name: 'Select', icon: '▾', description: 'Dropdown select' },
            { type: 'checkbox', name: 'Checkbox', icon: '☑', description: 'Checkbox input' },
            { type: 'search', name: 'Search', icon: '🔍', description: 'Search box' },
        ],
    },
    {
        category: 'Dynamic',
        items: [
            { type: 'variable', name: 'Variable', icon: '{x}', description: 'Dynamic variable' },
            { type: 'loop', name: 'Loop', icon: '∞', description: 'Repeat content' },
            { type: 'conditional', name: 'Conditional', icon: '?', description: 'Show/hide logic' },
            { type: 'counter', name: 'Counter', icon: '123', description: 'Animated counter' },
        ],
    },
    {
        category: 'Insurance',
        items: [
            { type: 'quote-form', name: 'Quote Form', icon: '📝', description: 'Insurance quote form' },
            { type: 'carrier-logos', name: 'Carrier Logos', icon: '🏢', description: 'Insurance carriers' },
            { type: 'comparison-table', name: 'Comparison', icon: '⚖', description: 'Rate comparison' },
            { type: 'calculator', name: 'Calculator', icon: '🧮', description: 'Premium calculator' },
            { type: 'testimonials', name: 'Testimonials', icon: '💬', description: 'Customer reviews' },
            { type: 'faq', name: 'FAQ', icon: '❓', description: 'FAQ accordion' },
            { type: 'trust-badges', name: 'Trust Badges', icon: '🏆', description: 'Trust indicators' },
        ],
    },
];

const DEFAULT_STYLES: ResponsiveStyles = {
    desktop: {},
    tablet: {},
    mobile: {},
};

const THEME_PRESETS = {
    minimal: {
        name: 'Minimal (Light)',
        styles: {
            section: { backgroundColor: '#ffffff', color: '#111827' },
            heading: { color: '#000000', fontFamily: 'Inter, sans-serif' },
            text: { color: '#374151', fontFamily: 'Inter, sans-serif' },
            button: { backgroundColor: '#000000', color: '#ffffff', borderRadius: '0px' },
            container: { maxWidth: '1200px' }
        }
    },
    modern: {
        name: 'Modern (Blue)',
        styles: {
            section: { backgroundColor: '#f3f4f6', color: '#1f2937' },
            heading: { color: '#1e3a8a', fontFamily: 'Plus Jakarta Sans, sans-serif' },
            text: { color: '#4b5563', fontFamily: 'Plus Jakarta Sans, sans-serif' },
            button: { backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)' },
            container: { maxWidth: '1280px' }
        }
    },
    dark: {
        name: 'Dark Mode',
        styles: {
            section: { backgroundColor: '#111827', color: '#f3f4f6' },
            heading: { color: '#ffffff', fontFamily: 'Inter, sans-serif' },
            text: { color: '#d1d5db', fontFamily: 'Inter, sans-serif' },
            button: { backgroundColor: '#6366f1', color: '#ffffff', borderRadius: '8px' },
            container: { maxWidth: '1200px' }
        }
    }
};

function AdvancedTemplateBuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const templateId = searchParams.get('id');

    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [hoveredElement, setHoveredElement] = useState<string | null>(null);
    const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
    const [activePanel, setActivePanel] = useState<PanelType>('elements');
    const [zoom, setZoom] = useState(100);
    const [showGrid, setShowGrid] = useState(false);
    const [showOutlines, setShowOutlines] = useState(true);
    const [history, setHistory] = useState<BuilderElement[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [draggedElement, setDraggedElement] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<{ id: string; position: 'before' | 'after' | 'inside' } | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    const canvasRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Sample variables for preview
    const sampleVariables: Record<string, string> = {
        page_title: 'Car Insurance in Los Angeles, California',
        page_subtitle: 'Compare the best car insurance rates and save up to $500/year',
        insurance_type: 'Car Insurance',
        insurance_type_slug: 'car-insurance',
        country: 'United States',
        country_code: 'US',
        state: 'California',
        state_code: 'CA',
        state_slug: 'california',
        city: 'Los Angeles',
        city_slug: 'los-angeles',
        location: 'Los Angeles',
        avg_premium: '$150',
        avg_savings: '$500',
        population: '3,900,000',
        current_year: new Date().getFullYear().toString(),
        current_month: new Date().toLocaleString('default', { month: 'long' }),
        site_name: 'MyInsuranceBuddies',
        site_url: 'https://myinsurancebuddies.com',
    };

    useEffect(() => {
        if (templateId) {
            fetchTemplate();
        } else {
            // New template
            setTemplate({
                id: '',
                name: 'New Template',
                slug: 'new-template',
                sections: [],
                globalStyles: '',
                customVariables: [],
            });
            setLoading(false);
        }
    }, [templateId]);

    /**
     * Normalize element styles to ensure responsive structure exists
     * CRITICAL: Prevents undefined errors when accessing device-specific styles
     */
    const normalizeElement = (element: any): BuilderElement => {
        const normalized: BuilderElement = {
            ...element,
            styles: {
                desktop: element.styles?.desktop || {},
                tablet: element.styles?.tablet || {},
                mobile: element.styles?.mobile || {},
            },
            children: element.children?.map(normalizeElement) || [],
        };
        return normalized;
    };

    const fetchTemplate = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/templates/${templateId}`));
            if (!res.ok) throw new Error('Template not found');
            const data = await res.json();

            // Normalize sections to ensure styles structure exists
            const normalizedSections = (data.sections || []).map(normalizeElement);
            const normalizedData = { ...data, sections: normalizedSections };

            setTemplate(normalizedData);
            if (normalizedSections.length > 0) {
                setHistory([normalizedSections]);
                setHistoryIndex(0);
            }
        } catch (error) {
            console.error('Failed to fetch template:', error);
            router.push('/dashboard/templates');
        } finally {
            setLoading(false);
        }
    };

    const saveToHistory = useCallback((sections: BuilderElement[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(sections)));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setTemplate(prev => prev ? { ...prev, sections: history[historyIndex - 1] } : null);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setTemplate(prev => prev ? { ...prev, sections: history[historyIndex + 1] } : null);
        }
    }, [history, historyIndex]);

    const generateId = () => `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const createElement = (type: string): BuilderElement => {
        const baseElement: BuilderElement = {
            id: generateId(),
            type: type === 'section' || type === 'container' || type === 'row' || type === 'column' ? type : 'element',
            name: type.charAt(0).toUpperCase() + type.slice(1),
            styles: JSON.parse(JSON.stringify(DEFAULT_STYLES)),
            children: [],
        };

        // Set default styles based on type
        switch (type) {
            case 'section':
                baseElement.styles.desktop = {
                    width: '100%',
                    paddingTop: '60px',
                    paddingBottom: '60px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                };
                break;
            case 'container':
                baseElement.styles.desktop = {
                    maxWidth: '1200px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                };
                break;
            case 'row':
                baseElement.styles.desktop = {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                };
                break;
            case 'column':
                baseElement.styles.desktop = {
                    flex: '1',
                    minWidth: '0',
                };
                break;
            case 'heading':
                baseElement.content = { type: 'text', value: 'Heading Text' };
                baseElement.styles.desktop = {
                    fontSize: '36px',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    marginBottom: '20px',
                };
                break;
            case 'text':
                baseElement.content = { type: 'text', value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' };
                baseElement.styles.desktop = {
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                };
                break;
            case 'button':
                baseElement.content = {
                    type: 'button',
                    value: 'Click Here',
                    settings: { url: '#', target: '_self' }
                };
                baseElement.styles.desktop = {
                    display: 'inline-block',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: '600',
                    textAlign: 'center',
                };
                break;
            case 'image':
                baseElement.content = {
                    type: 'image',
                    value: '/placeholder.jpg',
                    settings: { alt: '', width: '100%', height: 'auto' }
                };
                baseElement.styles.desktop = {
                    maxWidth: '100%',
                    height: 'auto',
                };
                break;
            case 'divider':
                baseElement.content = { type: 'divider' };
                baseElement.styles.desktop = {
                    borderTopWidth: '1px',
                    borderTopStyle: 'solid',
                    borderTopColor: '#e5e7eb',
                    marginTop: '20px',
                    marginBottom: '20px',
                };
                break;
            case 'spacer':
                baseElement.content = { type: 'spacer' };
                baseElement.styles.desktop = {
                    height: '40px',
                };
                break;
            case 'variable':
                baseElement.content = {
                    type: 'variable',
                    variable: 'page_title',
                    fallback: 'Default Value'
                };
                break;
        }

        return baseElement;
    };

    const addElement = (type: string, parentId?: string, position?: number) => {
        if (!template) return;

        const newElement = createElement(type);
        let newSections = JSON.parse(JSON.stringify(template.sections));

        if (!parentId) {
            // Add to root
            if (position !== undefined) {
                newSections.splice(position, 0, newElement);
            } else {
                newSections.push(newElement);
            }
        } else {
            // Add to parent
            const addToParent = (elements: BuilderElement[]): boolean => {
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].id === parentId) {
                        if (!elements[i].children) elements[i].children = [];
                        if (position !== undefined) {
                            elements[i].children!.splice(position, 0, newElement);
                        } else {
                            elements[i].children!.push(newElement);
                        }
                        return true;
                    }
                    if (elements[i].children && addToParent(elements[i].children!)) {
                        return true;
                    }
                }
                return false;
            };
            addToParent(newSections);
        }

        setTemplate({ ...template, sections: newSections });
        saveToHistory(newSections);
        setSelectedElement(newElement.id);
    };

    const updateElement = (elementId: string, updates: Partial<BuilderElement>) => {
        if (!template) return;

        const newSections = JSON.parse(JSON.stringify(template.sections));

        const update = (elements: BuilderElement[]): boolean => {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].id === elementId) {
                    elements[i] = { ...elements[i], ...updates };
                    return true;
                }
                if (elements[i].children && update(elements[i].children!)) {
                    return true;
                }
            }
            return false;
        };

        update(newSections);
        setTemplate({ ...template, sections: newSections });
    };

    const updateElementStyle = (elementId: string, device: DeviceType, styleUpdates: Partial<StyleProperties>) => {
        if (!template) return;

        const newSections = JSON.parse(JSON.stringify(template.sections));

        const update = (elements: BuilderElement[]): boolean => {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].id === elementId) {
                    elements[i].styles[device] = { ...elements[i].styles[device], ...styleUpdates };
                    return true;
                }
                if (elements[i].children && update(elements[i].children!)) {
                    return true;
                }
            }
            return false;
        };

        update(newSections);
        setTemplate({ ...template, sections: newSections });
    };

    const deleteElement = (elementId: string) => {
        if (!template) return;

        const newSections = JSON.parse(JSON.stringify(template.sections));

        const remove = (elements: BuilderElement[]): boolean => {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].id === elementId) {
                    elements.splice(i, 1);
                    return true;
                }
                if (elements[i].children && remove(elements[i].children!)) {
                    return true;
                }
            }
            return false;
        };

        remove(newSections);
        setTemplate({ ...template, sections: newSections });
        saveToHistory(newSections);
        if (selectedElement === elementId) setSelectedElement(null);
    };

    const duplicateElement = (elementId: string) => {
        if (!template) return;

        const newSections = JSON.parse(JSON.stringify(template.sections));

        const duplicateWithNewIds = (element: BuilderElement): BuilderElement => {
            const newEl = { ...element, id: generateId() };
            if (newEl.children) {
                newEl.children = newEl.children.map(duplicateWithNewIds);
            }
            return newEl;
        };

        const duplicate = (elements: BuilderElement[]): boolean => {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].id === elementId) {
                    const duplicated = duplicateWithNewIds(elements[i]);
                    elements.splice(i + 1, 0, duplicated);
                    return true;
                }
                if (elements[i].children && duplicate(elements[i].children!)) {
                    return true;
                }
            }
            return false;
        };

        duplicate(newSections);
        setTemplate({ ...template, sections: newSections });
        saveToHistory(newSections);
    };

    const moveElement = (elementId: string, direction: 'up' | 'down') => {
        if (!template) return;

        const newSections = JSON.parse(JSON.stringify(template.sections));

        const move = (elements: BuilderElement[]): boolean => {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].id === elementId) {
                    const newIndex = direction === 'up' ? i - 1 : i + 1;
                    if (newIndex >= 0 && newIndex < elements.length) {
                        [elements[i], elements[newIndex]] = [elements[newIndex], elements[i]];
                        return true;
                    }
                    return false;
                }
                if (elements[i].children && move(elements[i].children!)) {
                    return true;
                }
            }
            return false;
        };

        move(newSections);
        setTemplate({ ...template, sections: newSections });
        saveToHistory(newSections);
    };

    const findElement = (elementId: string, elements: BuilderElement[] = template?.sections || []): BuilderElement | null => {
        for (const el of elements) {
            if (el.id === elementId) return el;
            if (el.children) {
                const found = findElement(elementId, el.children);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedElementData = selectedElement ? findElement(selectedElement) : null;

    const applyTheme = (themeKey: keyof typeof THEME_PRESETS) => {
        if (!template) return;
        const theme = THEME_PRESETS[themeKey].styles;

        const newSections = JSON.parse(JSON.stringify(template.sections));

        const updateRecursive = (elements: BuilderElement[]) => {
            elements.forEach(el => {
                // Initialize desktop styles if missing
                if (!el.styles.desktop) el.styles.desktop = {};

                if (el.type === 'section') {
                    Object.assign(el.styles.desktop, theme.section);
                } else if (el.name === 'Heading') {
                    Object.assign(el.styles.desktop, theme.heading);
                } else if (el.name === 'Text' || el.name === 'Rich Text') {
                    Object.assign(el.styles.desktop, theme.text);
                } else if (el.name === 'Button') {
                    Object.assign(el.styles.desktop, theme.button);
                } else if (el.type === 'container') {
                    if (theme.container.maxWidth) {
                        el.styles.desktop.maxWidth = theme.container.maxWidth;
                    }
                }

                if (el.children) updateRecursive(el.children);
            });
        };

        updateRecursive(newSections);
        setTemplate({ ...template, sections: newSections });
        saveToHistory(newSections);
    };

    const handleSave = async () => {
        if (!template) return;
        setSaving(true);

        try {
            const url = template.id
                ? getApiUrl(`/api/templates/${template.id}`)
                : getApiUrl('/api/templates');

            const res = await fetch(url, {
                method: template.id ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...template,
                    sections: template.sections,
                }),
            });

            if (!res.ok) throw new Error('Failed to save');

            const saved = await res.json();
            if (!template.id) {
                router.push(`/dashboard/templates/builder?id=${saved.id}`);
            }
            setTemplate(saved);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            if (e.key === 'Delete' && selectedElement) {
                deleteElement(selectedElement);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedElement) {
                e.preventDefault();
                duplicateElement(selectedElement);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement, undo, redo, handleSave]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!template) return null;

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
            {/* Top Toolbar */}
            <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard/templates')}
                        className="text-gray-400 hover:text-white"
                    >
                        ← Back
                    </button>
                    <div className="h-6 w-px bg-gray-700" />
                    <input
                        type="text"
                        value={template.name}
                        onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                        className="bg-transparent border-none text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Undo/Redo */}
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-2 rounded hover:bg-gray-700 disabled:opacity-30"
                        title="Undo (Cmd+Z)"
                    >
                        ↶
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 rounded hover:bg-gray-700 disabled:opacity-30"
                        title="Redo (Cmd+Shift+Z)"
                    >
                        ↷
                    </button>

                    <div className="h-6 w-px bg-gray-700 mx-2" />

                    {/* Device Switcher */}
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((device) => (
                            <button
                                key={device}
                                onClick={() => setActiveDevice(device)}
                                className={`px-3 py-1 rounded text-sm ${activeDevice === device ? 'bg-blue-600' : 'hover:bg-gray-600'
                                    }`}
                            >
                                {device === 'desktop' ? '🖥' : device === 'tablet' ? '📱' : '📱'}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-gray-700 mx-2" />

                    {/* Zoom */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1 hover:bg-gray-700 rounded">−</button>
                        <span className="text-sm w-12 text-center">{zoom}%</span>
                        <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1 hover:bg-gray-700 rounded">+</button>
                    </div>

                    <div className="h-6 w-px bg-gray-700 mx-2" />

                    {/* View Options */}
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`p-2 rounded ${showGrid ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                        title="Toggle Grid"
                    >
                        ⊞
                    </button>
                    <button
                        onClick={() => setShowOutlines(!showOutlines)}
                        className={`p-2 rounded ${showOutlines ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                        title="Toggle Outlines"
                    >
                        ▢
                    </button>

                    <div className="h-6 w-px bg-gray-700 mx-2" />

                    <div className="relative group">
                        <button className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm">
                            🎨 Theme
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-48 z-50 hidden group-hover:block">
                            {Object.entries(THEME_PRESETS).map(([key, theme]) => (
                                <button
                                    key={key}
                                    onClick={() => applyTheme(key as any)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                                >
                                    {theme.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-6 w-px bg-gray-700 mx-2" />

                    {/* Preview & Save */}
                    <button
                        onClick={() => setShowPreview(true)}
                        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                        Preview
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Elements */}
                <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
                    <div className="p-3 border-b border-gray-700">
                        <div className="flex bg-gray-700 rounded-lg p-1">
                            {[
                                { id: 'elements', label: 'Elements', icon: '+' },
                                { id: 'layers', label: 'Layers', icon: '≡' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActivePanel(tab.id as any)}
                                    className={`flex-1 py-1.5 rounded text-sm ${activePanel === tab.id ? 'bg-gray-600' : ''
                                        }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3">
                        {activePanel === 'elements' && (
                            <div className="space-y-4">
                                {ELEMENT_LIBRARY.map((category) => (
                                    <div key={category.category}>
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                            {category.category}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {category.items.map((item) => (
                                                <button
                                                    key={item.type}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('elementType', item.type);
                                                        setDraggedElement(item.type);
                                                    }}
                                                    onDragEnd={() => setDraggedElement(null)}
                                                    onClick={() => addElement(item.type)}
                                                    className="flex flex-col items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-move transition"
                                                    title={item.description}
                                                >
                                                    <span className="text-xl mb-1">{item.icon}</span>
                                                    <span className="text-xs text-gray-300">{item.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activePanel === 'layers' && (
                            <LayersPanel
                                sections={template.sections}
                                selectedElement={selectedElement}
                                onSelect={setSelectedElement}
                                onDelete={deleteElement}
                                onDuplicate={duplicateElement}
                                onMove={moveElement}
                                onToggleVisibility={(id) => {
                                    const el = findElement(id);
                                    if (el) updateElement(id, { isHidden: !el.isHidden });
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-gray-900 overflow-auto p-8">
                    <div
                        ref={canvasRef}
                        className="mx-auto bg-white rounded-lg shadow-2xl overflow-hidden transition-all"
                        style={{
                            width: DEVICE_WIDTHS[activeDevice],
                            maxWidth: '100%',
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: 'top center',
                        }}
                    >
                        {showGrid && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                }}
                            />
                        )}

                        {template.sections.length === 0 ? (
                            <div
                                className="min-h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 m-4 rounded-lg"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                                    const type = e.dataTransfer.getData('elementType');
                                    if (type) addElement(type);
                                }}
                            >
                                <div className="text-5xl mb-4">+</div>
                                <p className="text-lg mb-2">Drag elements here</p>
                                <p className="text-sm">or click an element to add it</p>
                            </div>
                        ) : (
                            <CanvasRenderer
                                elements={template.sections}
                                selectedElement={selectedElement}
                                hoveredElement={hoveredElement}
                                showOutlines={showOutlines}
                                activeDevice={activeDevice}
                                onSelect={setSelectedElement}
                                onHover={setHoveredElement}
                                onDrop={(type, parentId, position) => addElement(type, parentId, position)}
                                onDelete={deleteElement}
                                onDuplicate={duplicateElement}
                                onMove={moveElement}
                            />
                        )}
                    </div>
                </div>

                {/* Right Panel - Properties */}
                <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                    {selectedElementData ? (
                        <>
                            <div className="p-3 border-b border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">{selectedElementData.name || selectedElementData.type}</span>
                                    <button
                                        onClick={() => setSelectedElement(null)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex bg-gray-700 rounded-lg p-1">
                                    {[
                                        { id: 'style', label: 'Style' },
                                        { id: 'advanced', label: 'Advanced' },
                                        { id: 'responsive', label: 'Responsive' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActivePanel(tab.id as any)}
                                            className={`flex-1 py-1 rounded text-xs ${activePanel === tab.id ? 'bg-gray-600' : ''
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3">
                                {activePanel === 'style' && (
                                    <StylePanel
                                        element={selectedElementData}
                                        device={activeDevice}
                                        onUpdate={(updates) => updateElementStyle(selectedElementData.id, activeDevice, updates)}
                                        onContentUpdate={(content) => updateElement(selectedElementData.id, { content })}
                                    />
                                )}

                                {activePanel === 'advanced' && (
                                    <AdvancedPanel
                                        element={selectedElementData}
                                        onUpdate={(updates) => updateElement(selectedElementData.id, updates)}
                                    />
                                )}

                                {activePanel === 'responsive' && (
                                    <ResponsivePanel
                                        element={selectedElementData}
                                        onUpdate={(device, updates) => updateElementStyle(selectedElementData.id, device, updates)}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <div className="text-4xl mb-4">👈</div>
                                <p>Select an element to edit</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <PreviewModal
                    template={template}
                    variables={sampleVariables}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}

// Default export wrapped in Suspense for useSearchParams
export default function AdvancedTemplateBuilder() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
            <AdvancedTemplateBuilderContent />
        </Suspense>
    );
}

/**
 * Preview Modal Component
 * Shows a full-page preview of the template with sample data
 */
function PreviewModal({
    template,
    variables,
    onClose
}: {
    template: Template;
    variables: Record<string, string>;
    onClose: () => void;
}) {
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    };

    const replaceVars = (text: string): string => {
        if (!text) return '';
        let result = text;
        Object.entries(variables).forEach(([key, value]) => {
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
        });
        return result.replace(/{{[^}]+}}/g, '');
    };

    const renderPreviewElement = (element: BuilderElement): React.ReactNode => {
        if (element.isHidden) return null;

        const styles = {
            ...element.styles?.desktop,
            ...(previewDevice === 'tablet' ? element.styles?.tablet : {}),
            ...(previewDevice === 'mobile' ? { ...element.styles?.tablet, ...element.styles?.mobile } : {}),
        };

        const content = element.content?.value ? replaceVars(element.content.value) : null;

        return (
            <div key={element.id} style={styles as React.CSSProperties}>
                {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
                {element.children?.map(renderPreviewElement)}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
            {/* Preview Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <h2 className="text-white font-semibold">Preview: {template.name}</h2>
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                            <button
                                key={device}
                                onClick={() => setPreviewDevice(device)}
                                className={`px-3 py-1 rounded text-sm text-white ${previewDevice === device ? 'bg-blue-600' : 'hover:bg-gray-600'
                                    }`}
                            >
                                {device === 'desktop' ? '🖥 Desktop' : device === 'tablet' ? '📱 Tablet' : '📱 Mobile'}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-2xl"
                >
                    ✕
                </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-gray-900 p-8">
                <div
                    className="mx-auto bg-white min-h-full rounded-lg shadow-2xl overflow-hidden transition-all"
                    style={{ width: deviceWidths[previewDevice], maxWidth: '100%' }}
                >
                    {/* SEO Preview */}
                    <div className="bg-gray-100 p-4 border-b">
                        <p className="text-xs text-gray-500 mb-1">SEO Preview (Google Search Result)</p>
                        <div className="bg-white p-3 rounded border">
                            <p className="text-blue-700 text-lg hover:underline cursor-pointer">
                                {replaceVars(template.seoTitleTemplate || variables.page_title)}
                            </p>
                            <p className="text-green-700 text-sm">
                                myinsurancebuddies.com › {variables.insurance_type_slug}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {replaceVars(template.seoDescTemplate || variables.page_subtitle)}
                            </p>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="min-h-[600px]">
                        {template.sections.length === 0 ? (
                            <div className="flex items-center justify-center h-96 text-gray-400">
                                <div className="text-center">
                                    <p className="text-xl mb-2">No sections added</p>
                                    <p className="text-sm">Add sections to see the preview</p>
                                </div>
                            </div>
                        ) : (
                            template.sections.map(renderPreviewElement)
                        )}
                    </div>
                </div>
            </div>

            {/* Variables Panel */}
            <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                    <span className="font-semibold">Sample Variables:</span>{' '}
                    {Object.entries(variables).slice(0, 5).map(([k, v]) => `{{${k}}} = "${v}"`).join(' | ')}...
                </p>
            </div>
        </div>
    );
}

// Layers Panel Component
function LayersPanel({
    sections,
    selectedElement,
    onSelect,
    onDelete,
    onDuplicate,
    onMove,
    onToggleVisibility,
    depth = 0
}: {
    sections: BuilderElement[];
    selectedElement: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onMove: (id: string, direction: 'up' | 'down') => void;
    onToggleVisibility: (id: string) => void;
    depth?: number;
}) {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    return (
        <div className="space-y-1">
            {sections.map((element, index) => (
                <div key={element.id}>
                    <div
                        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer group ${selectedElement === element.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                            }`}
                        style={{ paddingLeft: `${depth * 16 + 8}px` }}
                        onClick={() => onSelect(element.id)}
                    >
                        {element.children && element.children.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCollapsed({ ...collapsed, [element.id]: !collapsed[element.id] });
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                {collapsed[element.id] ? '▶' : '▼'}
                            </button>
                        )}
                        <span className={`flex-1 text-sm truncate ${element.isHidden ? 'opacity-50' : ''}`}>
                            {element.name || element.type}
                        </span>
                        <div className="hidden group-hover:flex items-center gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleVisibility(element.id); }}
                                className="p-1 hover:bg-gray-600 rounded text-xs"
                            >
                                {element.isHidden ? '👁' : '🙈'}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDuplicate(element.id); }}
                                className="p-1 hover:bg-gray-600 rounded text-xs"
                            >
                                📋
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(element.id); }}
                                className="p-1 hover:bg-red-600 rounded text-xs"
                            >
                                🗑
                            </button>
                        </div>
                    </div>
                    {element.children && element.children.length > 0 && !collapsed[element.id] && (
                        <LayersPanel
                            sections={element.children}
                            selectedElement={selectedElement}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            onDuplicate={onDuplicate}
                            onMove={onMove}
                            onToggleVisibility={onToggleVisibility}
                            depth={depth + 1}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// Canvas Renderer Component
function CanvasRenderer({
    elements,
    selectedElement,
    hoveredElement,
    showOutlines,
    activeDevice,
    onSelect,
    onHover,
    onDrop,
    onDelete,
    onDuplicate,
    onMove,
}: {
    elements: BuilderElement[];
    selectedElement: string | null;
    hoveredElement: string | null;
    showOutlines: boolean;
    activeDevice: DeviceType;
    onSelect: (id: string) => void;
    onHover: (id: string | null) => void;
    onDrop: (type: string, parentId?: string, position?: number) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onMove: (id: string, direction: 'up' | 'down') => void;
}) {
    const getComputedStyles = (element: BuilderElement): React.CSSProperties => {
        const elementStyles = element.styles || { desktop: {}, tablet: {}, mobile: {} };
        const styles = { ...(elementStyles.desktop || {}) };
        if (activeDevice === 'tablet') {
            Object.assign(styles, elementStyles.tablet || {});
        } else if (activeDevice === 'mobile') {
            Object.assign(styles, elementStyles.tablet || {}, elementStyles.mobile || {});
        }
        return styles as React.CSSProperties;
    };

    const renderElement = (element: BuilderElement, index: number): React.ReactNode => {
        if (element.isHidden) return null;

        const isSelected = selectedElement === element.id;
        const isHovered = hoveredElement === element.id;
        const styles = getComputedStyles(element);

        const outlineClass = showOutlines
            ? isSelected
                ? 'outline outline-2 outline-blue-500 outline-offset-2'
                : isHovered
                    ? 'outline outline-1 outline-blue-300 outline-offset-1'
                    : 'outline outline-1 outline-transparent hover:outline-gray-300'
            : '';

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            onSelect(element.id);
        };

        const handleDragOver = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const type = e.dataTransfer.getData('elementType');
            if (type) {
                if (element.type === 'section' || element.type === 'container' || element.type === 'row' || element.type === 'column') {
                    onDrop(type, element.id);
                }
            }
        };

        // Render content based on type
        const renderContent = () => {
            if (!element.content) {
                if (element.children && element.children.length > 0) {
                    return element.children.map((child, i) => renderElement(child, i));
                }
                return null;
            }

            switch (element.content.type) {
                case 'text':
                    return <span>{element.content.value}</span>;
                case 'image':
                    return (
                        <img
                            src={element.content.value || '/placeholder.jpg'}
                            alt={element.content.settings?.alt || ''}
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    );
                case 'button':
                    return (
                        <a href={element.content.settings?.url || '#'}>
                            {element.content.value}
                        </a>
                    );
                case 'variable':
                    return (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">
                            {`{{${element.content.variable}}}`}
                        </span>
                    );
                case 'divider':
                    return <hr style={styles} />;
                case 'spacer':
                    return <div style={{ height: styles.height || '40px' }} />;
                default:
                    return element.content.value;
            }
        };

        return (
            <div
                key={element.id}
                className={`relative group ${outlineClass} transition-all`}
                style={styles}
                onClick={handleClick}
                onMouseEnter={() => onHover(element.id)}
                onMouseLeave={() => onHover(null)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {/* Element Controls */}
                {isSelected && (
                    <div className="absolute -top-8 left-0 flex items-center gap-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-t z-50">
                        <span>{element.name || element.type}</span>
                        <button onClick={(e) => { e.stopPropagation(); onMove(element.id, 'up'); }} className="p-0.5 hover:bg-blue-700 rounded">↑</button>
                        <button onClick={(e) => { e.stopPropagation(); onMove(element.id, 'down'); }} className="p-0.5 hover:bg-blue-700 rounded">↓</button>
                        <button onClick={(e) => { e.stopPropagation(); onDuplicate(element.id); }} className="p-0.5 hover:bg-blue-700 rounded">📋</button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(element.id); }} className="p-0.5 hover:bg-red-600 rounded">🗑</button>
                    </div>
                )}

                {renderContent()}

                {/* Drop zones for children */}
                {(element.type === 'section' || element.type === 'container' || element.type === 'row' || element.type === 'column') &&
                    (!element.children || element.children.length === 0) && (
                        <div className="min-h-[60px] border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                            Drop elements here
                        </div>
                    )}
            </div>
        );
    };

    return (
        <div className="min-h-[400px]">
            {elements.map((el, i) => renderElement(el, i))}
        </div>
    );
}

// Style Panel Component
function StylePanel({
    element,
    device,
    onUpdate,
    onContentUpdate,
}: {
    element: BuilderElement;
    device: DeviceType;
    onUpdate: (updates: Partial<StyleProperties>) => void;
    onContentUpdate: (content: ElementContent) => void;
}) {
    const styles = element.styles?.[device] || {};

    const StyleInput = ({ label, prop, type = 'text', options }: { label: string; prop: keyof StyleProperties; type?: string; options?: string[] }) => (
        <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            {type === 'select' ? (
                <select
                    value={(styles[prop] as string) || ''}
                    onChange={(e) => onUpdate({ [prop]: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
                >
                    <option value="">Default</option>
                    {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : type === 'color' ? (
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={(styles[prop] as string) || '#000000'}
                        onChange={(e) => onUpdate({ [prop]: e.target.value })}
                        className="w-10 h-8 rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={(styles[prop] as string) || ''}
                        onChange={(e) => onUpdate({ [prop]: e.target.value })}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
                    />
                </div>
            ) : (
                <input
                    type={type}
                    value={(styles[prop] as string) || ''}
                    onChange={(e) => onUpdate({ [prop]: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
                />
            )}
        </div>
    );

    const SpacingControl = ({ label, props }: { label: string; props: (keyof StyleProperties)[] }) => (
        <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">{label}</label>
            <div className="grid grid-cols-4 gap-2">
                {props.map((prop, i) => (
                    <input
                        key={prop}
                        type="text"
                        value={(styles[prop] as string) || ''}
                        onChange={(e) => onUpdate({ [prop]: e.target.value })}
                        placeholder={['T', 'R', 'B', 'L'][i]}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-center"
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Content */}
            {element.content && (
                <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Content</h4>
                    {element.content.type === 'text' && (
                        <textarea
                            value={element.content.value || ''}
                            onChange={(e) => onContentUpdate({ ...element.content!, value: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                            rows={4}
                        />
                    )}
                    {element.content.type === 'variable' && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={element.content.variable || ''}
                                onChange={(e) => onContentUpdate({ ...element.content!, variable: e.target.value })}
                                placeholder="Variable name"
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                            />
                            <input
                                type="text"
                                value={element.content.fallback || ''}
                                onChange={(e) => onContentUpdate({ ...element.content!, fallback: e.target.value })}
                                placeholder="Fallback value"
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    )}
                    {element.content.type === 'image' && (
                        <input
                            type="text"
                            value={element.content.value || ''}
                            onChange={(e) => onContentUpdate({ ...element.content!, value: e.target.value })}
                            placeholder="Image URL"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                        />
                    )}
                    {element.content.type === 'button' && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={element.content.value || ''}
                                onChange={(e) => onContentUpdate({ ...element.content!, value: e.target.value })}
                                placeholder="Button text"
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                            />
                            <input
                                type="text"
                                value={element.content.settings?.url || ''}
                                onChange={(e) => onContentUpdate({
                                    ...element.content!,
                                    settings: { ...element.content!.settings, url: e.target.value }
                                })}
                                placeholder="Link URL"
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Typography */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Typography</h4>
                <StyleInput label="Font Family" prop="fontFamily" />
                <div className="grid grid-cols-2 gap-2">
                    <StyleInput label="Font Size" prop="fontSize" />
                    <StyleInput label="Font Weight" prop="fontWeight" type="select" options={['300', '400', '500', '600', '700', '800']} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <StyleInput label="Line Height" prop="lineHeight" />
                    <StyleInput label="Letter Spacing" prop="letterSpacing" />
                </div>
                <StyleInput label="Text Color" prop="color" type="color" />
                <StyleInput label="Text Align" prop="textAlign" type="select" options={['left', 'center', 'right', 'justify']} />
            </div>

            {/* Spacing */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Spacing</h4>
                <SpacingControl label="Margin" props={['marginTop', 'marginRight', 'marginBottom', 'marginLeft']} />
                <SpacingControl label="Padding" props={['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']} />
            </div>

            {/* Size */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Size</h4>
                <div className="grid grid-cols-2 gap-2">
                    <StyleInput label="Width" prop="width" />
                    <StyleInput label="Height" prop="height" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <StyleInput label="Min Width" prop="minWidth" />
                    <StyleInput label="Max Width" prop="maxWidth" />
                </div>
            </div>

            {/* Background */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Background</h4>
                <StyleInput label="Background Color" prop="backgroundColor" type="color" />
                <StyleInput label="Background Image" prop="backgroundImage" />
                <StyleInput label="Background Size" prop="backgroundSize" type="select" options={['auto', 'cover', 'contain']} />
                <StyleInput label="Background Position" prop="backgroundPosition" type="select" options={['center', 'top', 'bottom', 'left', 'right']} />
            </div>

            {/* Border */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Border</h4>
                <div className="grid grid-cols-3 gap-2">
                    <StyleInput label="Width" prop="borderWidth" />
                    <StyleInput label="Style" prop="borderStyle" type="select" options={['solid', 'dashed', 'dotted', 'none']} />
                    <StyleInput label="Color" prop="borderColor" type="color" />
                </div>
                <StyleInput label="Border Radius" prop="borderRadius" />
            </div>

            {/* Shadow */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shadow</h4>
                <StyleInput label="Box Shadow" prop="boxShadow" />
            </div>
        </div>
    );
}

// Advanced Panel Component
function AdvancedPanel({
    element,
    onUpdate,
}: {
    element: BuilderElement;
    onUpdate: (updates: Partial<BuilderElement>) => void;
}) {
    return (
        <div className="space-y-6">
            {/* Element Settings */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Element</h4>
                <div className="mb-3">
                    <label className="block text-xs text-gray-400 mb-1">Name</label>
                    <input
                        type="text"
                        value={element.name || ''}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Animation */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Animation</h4>
                <div className="mb-3">
                    <label className="block text-xs text-gray-400 mb-1">Type</label>
                    <select
                        value={element.animation?.type || 'none'}
                        onChange={(e) => onUpdate({ animation: { ...element.animation, type: e.target.value as any } })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    >
                        <option value="none">None</option>
                        <option value="fade">Fade In</option>
                        <option value="slide">Slide</option>
                        <option value="zoom">Zoom</option>
                        <option value="bounce">Bounce</option>
                        <option value="rotate">Rotate</option>
                    </select>
                </div>
                {element.animation?.type && element.animation.type !== 'none' && (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Duration (ms)</label>
                                <input
                                    type="number"
                                    value={element.animation?.duration || 500}
                                    onChange={(e) => onUpdate({ animation: { ...element.animation!, duration: parseInt(e.target.value) } })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Delay (ms)</label>
                                <input
                                    type="number"
                                    value={element.animation?.delay || 0}
                                    onChange={(e) => onUpdate({ animation: { ...element.animation!, delay: parseInt(e.target.value) } })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Conditions */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Display Conditions</h4>
                <button
                    onClick={() => {
                        const conditions = element.conditions || [];
                        conditions.push({ field: '', operator: 'exists' });
                        onUpdate({ conditions });
                    }}
                    className="w-full py-2 border border-dashed border-gray-600 rounded text-gray-400 hover:border-gray-500 text-sm"
                >
                    + Add Condition
                </button>
                {element.conditions?.map((condition, i) => (
                    <div key={i} className="mt-2 p-2 bg-gray-700 rounded">
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                value={condition.field}
                                onChange={(e) => {
                                    const conditions = [...(element.conditions || [])];
                                    conditions[i].field = e.target.value;
                                    onUpdate({ conditions });
                                }}
                                placeholder="Field"
                                className="bg-gray-600 rounded px-2 py-1 text-sm"
                            />
                            <select
                                value={condition.operator}
                                onChange={(e) => {
                                    const conditions = [...(element.conditions || [])];
                                    conditions[i].operator = e.target.value as any;
                                    onUpdate({ conditions });
                                }}
                                className="bg-gray-600 rounded px-2 py-1 text-sm"
                            >
                                <option value="exists">Exists</option>
                                <option value="not_exists">Not Exists</option>
                                <option value="equals">Equals</option>
                                <option value="not_equals">Not Equals</option>
                                <option value="contains">Contains</option>
                            </select>
                            <button
                                onClick={() => {
                                    const conditions = element.conditions?.filter((_, j) => j !== i);
                                    onUpdate({ conditions });
                                }}
                                className="text-red-400 hover:text-red-300"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Attributes */}
            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Custom Attributes</h4>
                <div className="mb-3">
                    <label className="block text-xs text-gray-400 mb-1">CSS ID</label>
                    <input
                        type="text"
                        value={element.attributes?.id || ''}
                        onChange={(e) => onUpdate({ attributes: { ...element.attributes, id: e.target.value } })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-xs text-gray-400 mb-1">CSS Classes</label>
                    <input
                        type="text"
                        value={element.attributes?.class || ''}
                        onChange={(e) => onUpdate({ attributes: { ...element.attributes, class: e.target.value } })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    />
                </div>
            </div>
        </div>
    );
}

// Responsive Panel Component
function ResponsivePanel({
    element,
    onUpdate,
}: {
    element: BuilderElement;
    onUpdate: (device: DeviceType, updates: Partial<StyleProperties>) => void;
}) {
    const devices: { id: DeviceType; label: string; icon: string }[] = [
        { id: 'desktop', label: 'Desktop (1200px+)', icon: '🖥' },
        { id: 'tablet', label: 'Tablet (768px - 1199px)', icon: '📱' },
        { id: 'mobile', label: 'Mobile (< 768px)', icon: '📱' },
    ];

    return (
        <div className="space-y-6">
            {devices.map((device) => (
                <div key={device.id}>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {device.icon} {device.label}
                    </h4>
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Display</label>
                            <select
                                value={element.styles?.[device.id]?.display || ''}
                                onChange={(e) => onUpdate(device.id, { display: e.target.value })}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
                            >
                                <option value="">Inherit</option>
                                <option value="block">Block</option>
                                <option value="flex">Flex</option>
                                <option value="grid">Grid</option>
                                <option value="none">Hidden</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Width</label>
                                <input
                                    type="text"
                                    value={element.styles?.[device.id]?.width || ''}
                                    onChange={(e) => onUpdate(device.id, { width: e.target.value })}
                                    placeholder="auto"
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                                <input
                                    type="text"
                                    value={element.styles?.[device.id]?.fontSize || ''}
                                    onChange={(e) => onUpdate(device.id, { fontSize: e.target.value })}
                                    placeholder="inherit"
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Padding</label>
                                <input
                                    type="text"
                                    value={element.styles?.[device.id]?.paddingTop || ''}
                                    onChange={(e) => onUpdate(device.id, {
                                        paddingTop: e.target.value,
                                        paddingRight: e.target.value,
                                        paddingBottom: e.target.value,
                                        paddingLeft: e.target.value,
                                    })}
                                    placeholder="inherit"
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Text Align</label>
                                <select
                                    value={element.styles?.[device.id]?.textAlign || ''}
                                    onChange={(e) => onUpdate(device.id, { textAlign: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm"
                                >
                                    <option value="">Inherit</option>
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

