import { Metadata } from 'next';
import { searchPlacesServer } from '@/lib/api-server';
import { SearchClient } from './SearchClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Explore Halal Restaurants | FindHalal',
    description: 'Discover and search for verified halal places, restaurants, and food near you.',
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const qParam = params.q;
    const initialQuery = Array.isArray(qParam) ? qParam[0] : (qParam || '');
    
    // Fetch initial places on the server
    const initialPlaces = await searchPlacesServer(initialQuery);

    return (
        <SearchClient initialPlaces={initialPlaces} initialQuery={initialQuery} />
    );
}
