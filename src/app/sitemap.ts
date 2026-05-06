import { MetadataRoute } from 'next';
import { getAllPlaceIdsForSitemap, getAllCitySlugsForSitemap } from '@/lib/api-server';
import { BLOG_POSTS } from '../lib/blog';

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
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/how-we-verify-halal`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/halal-certification-guide`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/for-businesses`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    // City landing pages (HIGH priority for SEO)
    const cityUrls: MetadataRoute.Sitemap = citySlugs
        .filter(city => city.city_slug && city.city_slug.length > 0 && city.city_slug !== '-')
        .map((city) => ({
            url: `${baseUrl}/halal-restaurants-${encodeURIComponent(city.city_slug!)}`,
            lastModified: city.generated_at ? new Date(city.generated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        }));

    // Individual restaurant pages
    const placeUrls: MetadataRoute.Sitemap = places.map((place) => {
        const slugBase = `${place.name || 'restaurant'} ${place.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const slug = `${slugBase}-${place.id}`;

        return {
            url: `${baseUrl}/restaurant/${slug}`,
            lastModified: place.created_at ? new Date(place.created_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        };
    });

    // Blog Post pages
    const blogUrls: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticPages, ...cityUrls, ...placeUrls, ...blogUrls];
}
