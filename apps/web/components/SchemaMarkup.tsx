interface SchemaMarkupProps {
    type: 'Organization' | 'Website' | 'FAQPage' | 'Article' | 'BreadcrumbList' | 'InsuranceAgency' | 'LocalBusiness' | 'Service' | 'AggregateRating';
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

// LocalBusiness Schema for geo-targeted pages
interface LocalBusinessSchemaProps {
    name: string;
    description: string;
    insuranceType?: string | null;
    stateName?: string | null;
    stateCode?: string | null;
    cityName?: string | null;
    phoneNumber?: string | null;
    url: string;
    priceRange?: string;
    rating?: number;
    reviewCount?: number;
}

export function LocalBusinessSchema({
    name,
    description,
    insuranceType,
    stateName,
    stateCode,
    cityName,
    phoneNumber,
    url,
    priceRange = '$$',
    rating,
    reviewCount
}: LocalBusinessSchemaProps) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myinsurancebuddies.com';

    // Build address object
    const address: Record<string, any> = {
        '@type': 'PostalAddress',
        addressCountry: 'US'
    };

    if (stateName) address.addressRegion = stateName;
    if (stateCode) address.addressRegion = stateCode;
    if (cityName) address.addressLocality = cityName;

    // Build the schema
    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'InsuranceAgency',
        name,
        description,
        url,
        telephone: phoneNumber || '1-855-205-2412',
        priceRange,
        address,
        areaServed: {
            '@type': 'State',
            name: stateName || 'United States'
        },
        image: `${baseUrl}/logo.png`,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
            // Social profiles
        ],
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '20:00'
        }
    };

    // Add service types based on insurance type
    if (insuranceType) {
        schema.makesOffer = {
            '@type': 'Offer',
            itemOffered: {
                '@type': 'Service',
                name: `${insuranceType} Insurance`,
                description: `Compare ${insuranceType.toLowerCase()} insurance rates and find the best coverage.`,
                provider: {
                    '@type': 'InsuranceAgency',
                    name: 'MyInsuranceBuddies'
                }
            }
        };
    }

    // Add aggregate rating if available
    if (rating && reviewCount) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: rating,
            bestRating: 5,
            worstRating: 1,
            reviewCount: reviewCount,
            ratingCount: reviewCount
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Service Area Schema for broader geographic targeting
interface ServiceAreaSchemaProps {
    serviceName: string;
    description: string;
    areaServed: string[]; // Array of state names or codes
    url: string;
}

export function ServiceAreaSchema({
    serviceName,
    description,
    areaServed,
    url
}: ServiceAreaSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: serviceName,
        description,
        url,
        provider: {
            '@type': 'InsuranceAgency',
            name: 'MyInsuranceBuddies',
            url: 'https://myinsurancebuddies.com'
        },
        areaServed: areaServed.map(area => ({
            '@type': 'State',
            name: area
        })),
        serviceType: 'Insurance Comparison'
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Review Schema for testimonials
interface ReviewSchemaProps {
    reviewBody: string;
    author: string;
    rating: number;
    datePublished?: string;
    itemReviewed?: string;
}

export function ReviewSchema({
    reviewBody,
    author,
    rating,
    datePublished,
    itemReviewed = 'MyInsuranceBuddies Insurance Services'
}: ReviewSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Review',
        reviewBody,
        author: {
            '@type': 'Person',
            name: author
        },
        reviewRating: {
            '@type': 'Rating',
            ratingValue: rating,
            bestRating: 5,
            worstRating: 1
        },
        datePublished: datePublished || new Date().toISOString(),
        itemReviewed: {
            '@type': 'InsuranceAgency',
            name: itemReviewed
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
