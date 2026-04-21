import { Metadata } from 'next';
import { getCityPageBySlug, getPlacesByCity } from '@/lib/api-server';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const cityPage = await getCityPageBySlug(slug);

    if (!cityPage) {
        return { title: 'City Not Found | FindHalalOnly' };
    }

    return {
        title: cityPage.meta_title || `Halal Restaurants in ${cityPage.city_name} | FindHalalOnly`,
        description: cityPage.meta_description || `Find verified Halal restaurants in ${cityPage.city_name}. Community-rated and owner-verified.`,
        openGraph: {
            title: cityPage.meta_title || `Halal Restaurants in ${cityPage.city_name}`,
            description: cityPage.meta_description || '',
            url: `https://findhalalonly.com/halal-restaurants-${slug}`,
            siteName: 'FindHalalOnly',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: cityPage.meta_title || '',
            description: cityPage.meta_description || '',
        },
        alternates: {
            canonical: `https://findhalalonly.com/halal-restaurants-${slug}`,
        },
    };
}

export default async function CityLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const cityPage = await getCityPageBySlug(slug);

    if (!cityPage) {
        return <>{children}</>;
    }

    // JSON-LD: ItemList schema for city page
    const restaurants = await getPlacesByCity(cityPage.city_name);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Halal Restaurants in ${cityPage.city_name}`,
        description: cityPage.meta_description || `Verified Halal restaurants in ${cityPage.city_name}`,
        url: `https://findhalalonly.com/halal-restaurants-${slug}`,
        numberOfItems: restaurants.length,
        itemListElement: restaurants.slice(0, 30).map((place, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Restaurant',
                name: place.name,
                url: `https://findhalalonly.com/place/${place.id}`,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: place.address || '',
                    addressLocality: place.city || cityPage.city_name,
                    addressRegion: cityPage.state || '',
                    addressCountry: cityPage.country || '',
                },
                servesCuisine: ['Halal', place.cuisine || 'Halal Food'],
                ...(place.lat && place.lng ? {
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: place.lat,
                        longitude: place.lng,
                    }
                } : {}),
                ...(place.rating ? {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: place.rating,
                        reviewCount: place.review_count || 1,
                        bestRating: '5',
                        worstRating: '1',
                    }
                } : {}),
            }
        })),
    };

    // FAQPage schema
    const faqSchema = cityPage.ai_faq && cityPage.ai_faq.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: cityPage.ai_faq.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            }
        }))
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            {children}
        </>
    );
}
