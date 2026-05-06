import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.findhalalonly.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/debug'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
