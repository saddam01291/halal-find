import { MetadataRoute } from 'next';
import { getPlacesServer } from '@/lib/api-server';

const baseUrl = 'https://findhalalonly.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const places = await getPlacesServer();

    const placeUrls: MetadataRoute.Sitemap = places.map((place) => ({
        url: `${baseUrl}/place/${place.id}`,
        lastModified: place.created_at ? new Date(place.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/for-businesses`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...placeUrls,
    ];
}
