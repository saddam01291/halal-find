import { getPlacesServer, getPopularCitiesServer } from '@/lib/api-server';
import { HomeClient } from './HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Halal Restaurants Near You — Verified by the Community',
  description: 'Discover the best Halal hotels, places, food, and restaurants near you. Instant lookup of location, reviews, and Halal status.',
};

export default async function Home() {
  // Fetch data on the server for SEO
  const [initialPlaces, initialPopularCities] = await Promise.all([
    getPlacesServer(),
    getPopularCitiesServer()
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Find Halal',
    url: 'https://findhalalonly.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://findhalalonly.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Find Halal',
    url: 'https://findhalalonly.com',
    logo: 'https://findhalalonly.com/favicon.ico',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8371962838',
      contactType: 'customer service'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HomeClient 
        initialPlaces={initialPlaces} 
        initialPopularCities={initialPopularCities} 
      />
    </>
  );
}
