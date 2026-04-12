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

    const title = `${place.name} | Halal Restaurant in ${place.city}`;
    const description = `Find out if ${place.name} in ${place.city} is Halal. See community reviews, certificates, and more on Find Halal.`;

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

export default function PlaceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
