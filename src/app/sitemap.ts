import { MetadataRoute } from 'next';
import { getAllPlaceIdsForSitemap, getAllCitySlugsForSitemap } from '@/lib/api-server';

const baseUrl = 'https://findhalalonly.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [places, citySlugs] = await Promise.all([
        getAllPlaceIdsForSitemap(),
        getAllCitySlugsForSitemap(),
    ]);

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
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
    ];

    // City landing pages (HIGH priority for SEO)
    const cityUrls: MetadataRoute.Sitemap = citySlugs.map((city) => ({
        url: `${baseUrl}/halal-restaurants-${city.city_slug}`,
        lastModified: city.generated_at ? new Date(city.generated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // Individual restaurant pages
    const placeUrls: MetadataRoute.Sitemap = places.map((place) => ({
        url: `${baseUrl}/place/${place.id}`,
        lastModified: place.created_at ? new Date(place.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...staticPages, ...cityUrls, ...placeUrls];
}
