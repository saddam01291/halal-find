import { MetadataRoute } from 'next';
import { getAllPlaceIdsForSitemap, getAllCitySlugsForSitemap } from '@/lib/api-server';
import { BLOG_POSTS } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.findhalalonly.com';
    
    const [places, citySlugs] = await Promise.all([
        getAllPlaceIdsForSitemap(),
        getAllCitySlugsForSitemap(),
    ]).catch(e => {
        console.error("Error fetching data for sitemap:", e);
        return [[], []] as const;
    });

    const sitemap: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    citySlugs
        .filter(city => city.city_slug && city.city_slug.length > 0)
        .forEach(city => {
            sitemap.push({
                url: `${baseUrl}/halal-restaurants-${city.city_slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        });

    BLOG_POSTS.forEach(post => {
        sitemap.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    places.forEach(place => {
        const slugBase = `${place.name || 'restaurant'} ${place.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const slug = `${slugBase}-${place.id}`;
        sitemap.push({
            url: `${baseUrl}/restaurant/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    });

    return sitemap;
}
