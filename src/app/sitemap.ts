import { MetadataRoute } from 'next';
import { getAllPlaceIdsForSitemap, getAllCitySlugsForSitemap } from '@/lib/api-server';
import { BLOG_POSTS } from '../lib/blog';

const baseUrl = 'https://www.findhalalonly.com';

// This allows us to split the sitemap into chunks
export async function generateSitemaps() {
    // 0: static + cities + blog, 1: restaurants
    return [{ id: 0 }, { id: 1 }];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const today = new Date().toISOString().split('T')[0];

    // SITEMAP 0: Static, Cities, Blog
    if (id === 0) {
        const citySlugs = await getAllCitySlugsForSitemap();
        
        const staticPages: MetadataRoute.Sitemap = [
            { url: baseUrl, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
            { url: `${baseUrl}/search`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
            { url: `${baseUrl}/blog`, lastModified: today, changeFrequency: 'daily', priority: 0.8 },
            { url: `${baseUrl}/about`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
            { url: `${baseUrl}/contact`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
            { url: `${baseUrl}/how-we-verify-halal`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
            { url: `${baseUrl}/halal-certification-guide`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
            { url: `${baseUrl}/terms`, lastModified: today, changeFrequency: 'monthly', priority: 0.3 },
        ];

        const cityUrls: MetadataRoute.Sitemap = citySlugs
            .filter(city => city.city_slug && city.city_slug.length > 0 && city.city_slug !== '-')
            .map((city) => ({
                url: `${baseUrl}/halal-restaurants-${encodeURIComponent(city.city_slug!)}`,
                lastModified: today,
            }));

        const blogUrls: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.date,
        }));

        return [...staticPages, ...cityUrls, ...blogUrls];
    }

    // SITEMAP 1: Restaurants
    if (id === 1) {
        const places = await getAllPlaceIdsForSitemap();
        
        return places.map((place) => {
            const slugBase = `${place.name || 'restaurant'} ${place.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const slug = `${slugBase}-${place.id}`;

            return {
                url: `${baseUrl}/restaurant/${slug}`,
                lastModified: today,
            };
        });
    }

    return [];
}
