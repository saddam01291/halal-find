import { NextResponse } from 'next/server';
import { getAllPlaceIdsForSitemap, getAllCitySlugsForSitemap } from '@/lib/api-server';
import { BLOG_POSTS } from '@/lib/blog';

const baseUrl = 'https://findhalalonly.com';

export async function GET() {
    try {
        const [places, citySlugs] = await Promise.all([
            getAllPlaceIdsForSitemap(),
            getAllCitySlugsForSitemap(),
        ]);

        const today = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/search</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`;

        // Add Cities
        citySlugs
            .filter(city => city.city_slug && city.city_slug.length > 0)
            .forEach(city => {
                xml += `
    <url>
        <loc>${baseUrl}/halal-restaurants-${encodeURIComponent(city.city_slug)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
            });

        // Add Blog Posts
        BLOG_POSTS.forEach(post => {
            xml += `
    <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${post.date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
        });

        // Add Restaurants
        places.forEach(place => {
            const slugBase = `${place.name || 'restaurant'} ${place.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const slug = `${slugBase}-${place.id}`;
            xml += `
    <url>
        <loc>${baseUrl}/restaurant/${slug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
        });

        xml += '</urlset>';

        return new NextResponse(xml.trim(), {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return new NextResponse('Error generating sitemap', { status: 500 });
    }
}
