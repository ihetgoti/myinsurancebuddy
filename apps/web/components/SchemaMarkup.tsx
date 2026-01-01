interface SchemaMarkupProps {
    type: 'Organization' | 'Website' | 'FAQPage' | 'Article' | 'BreadcrumbList' | 'InsuranceAgency';
    data: Record<string, any>;
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Pre-built schema generators
export function OrganizationSchema() {
    return (
        <SchemaMarkup
            type="Organization"
            data={{
                name: 'MyInsuranceBuddies',
                url: 'https://myinsurancebuddies.com',
                logo: 'https://myinsurancebuddies.com/logo.png',
                description: 'Expert insurance and financial planning guidance. Compare coverage, learn about policies, and make informed decisions.',
                sameAs: [
                    // Add social links when available
                ],
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    availableLanguage: 'English'
                }
            }}
        />
    );
}

export function WebsiteSchema() {
    return (
        <SchemaMarkup
            type="Website"
            data={{
                name: 'MyInsuranceBuddies',
                url: 'https://myinsurancebuddies.com',
                potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://myinsurancebuddies.com/search?q={search_term_string}',
                    'query-input': 'required name=search_term_string'
                }
            }}
        />
    );
}

interface FAQItem {
    question: string;
    answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
    return (
        <SchemaMarkup
            type="FAQPage"
            data={{
                mainEntity: faqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.answer
                    }
                }))
            }}
        />
    );
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
    return (
        <SchemaMarkup
            type="BreadcrumbList"
            data={{
                itemListElement: items.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: item.url
                }))
            }}
        />
    );
}

interface ArticleSchemaProps {
    headline: string;
    description: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    image?: string;
}

export function ArticleSchema({ headline, description, datePublished, dateModified, author, image }: ArticleSchemaProps) {
    return (
        <SchemaMarkup
            type="Article"
            data={{
                headline,
                description,
                datePublished: datePublished || new Date().toISOString(),
                dateModified: dateModified || new Date().toISOString(),
                author: {
                    '@type': 'Organization',
                    name: author || 'MyInsuranceBuddies'
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'MyInsuranceBuddies',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://myinsurancebuddies.com/logo.png'
                    }
                },
                image: image || 'https://myinsurancebuddies.com/og-image.jpg'
            }}
        />
    );
}
