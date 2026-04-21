import { Metadata } from 'next';
import { getPlaceByIdServer } from '@/lib/api-server';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const place = await getPlaceByIdServer(resolvedParams.id);

    if (!place) {
        return {
            title: 'Place Not Found | Find Halal',
            description: 'The requested restaurant could not be found.',
        };
    }

    const title = `${place.name} | Halal Hotel, Place, Food & Restaurant Near ${place.city}`;
    const description = `Find out if ${place.name} is a verified Halal hotel, place, food or restaurant near you in ${place.city}. See community reviews, certificates, and more on Find Halal.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://findhalalonly.com/place/${place.id}`,
            siteName: 'Find Halal',
            images: [
                {
                    url: place.image || 'https://findhalalonly.com/og-default.jpg',
                    width: 1200,
                    height: 630,
                    alt: `${place.name} preview`,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [place.image || 'https://findhalalonly.com/og-default.jpg'],
        },
    };
}

export default async function PlaceLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const place = await getPlaceByIdServer(resolvedParams.id);

    if (!place) {
        return <>{children}</>;
    }

    const targetUrl = `https://findhalalonly.com/place/${place.id}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: place.name,
        image: place.image || 'https://findhalalonly.com/og-default.jpg',
        url: targetUrl,
        address: {
            '@type': 'PostalAddress',
            streetAddress: place.address || '',
            addressLocality: place.city || '',
            addressRegion: place.city || '',
            addressCountry: 'IN',
        },
        geo: (place.lat && place.lng) ? {
            '@type': 'GeoCoordinates',
            latitude: place.lat,
            longitude: place.lng,
        } : undefined,
        ...(place.phone ? { telephone: place.phone } : {}),
        ...(place.email ? { email: place.email } : {}),
        servesCuisine: ['Halal', place.cuisine || 'Halal Food'].filter(Boolean),
        priceRange: '$$',
        aggregateRating: place.rating ? {
            '@type': 'AggregateRating',
            ratingValue: place.rating,
            reviewCount: place.review_count || 1,
            bestRating: '5',
            worstRating: '1',
        } : undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
