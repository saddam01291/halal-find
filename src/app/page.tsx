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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Find Halal",
    "url": "https://findhalalonly.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://findhalalonly.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Find Halal",
    "url": "https://findhalalonly.com",
    "logo": "https://findhalalonly.com/favicon.ico",
    "sameAs": [
      "https://facebook.com/findhalalonly",
      "https://instagram.com/findhalalonly",
      "https://twitter.com/findhalalonly"
    ],

  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Find Halal Platform",
    "image": "https://findhalalonly.com/favicon.ico",
    "@id": "https://findhalalonly.com",
    "url": "https://findhalalonly.com",
    "telephone": "+91-8371962838",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kolkata",
      "addressLocality": "West Bengal",
      "addressRegion": "WB",
      "postalCode": "700001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.5726,
      "longitude": 88.3639
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$"
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HomeClient 
        initialPlaces={initialPlaces} 
        initialPopularCities={initialPopularCities} 
      />
    </main>
  );
}
