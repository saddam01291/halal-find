import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://findhalalonly.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/debug/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
