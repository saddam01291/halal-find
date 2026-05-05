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

  return (
    <HomeClient 
      initialPlaces={initialPlaces} 
      initialPopularCities={initialPopularCities} 
    />
  );
}
