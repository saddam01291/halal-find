'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GoogleMap } from '@/components/map/Map';
import { searchPlaces, getPlaces } from '@/lib/api';
import { DbPlace } from '@/lib/supabase';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [places, setPlaces] = useState<DbPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    useEffect(() => {
        setQuery(initialQuery);
        const fetchPlaces = async () => {
            console.log(`Search: Fetching places for query: "${initialQuery}"`);
            setLoading(true);
            setError(null);
            try {
                const data = initialQuery ? await searchPlaces(initialQuery) : await getPlaces();
                console.log(`Search: Received ${data?.length || 0} places`);
                setPlaces(data || []);
            } catch (err: any) {
                console.error('Search: Fetch error:', err);
                setError(err.message || 'Failed to fetch places');
            } finally {
                setLoading(false);
            }
        };
        fetchPlaces();
    }, [initialQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
            {/* List View */}
            <div className="w-full md:w-1/2 lg:w-2/5 overflow-y-auto border-r border-slate-200 bg-white">
                <div className="p-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                    <form onSubmit={handleSearch} className="relative mb-4 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search cuisine, city, or name..."
                                className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500 rounded-lg"
                            />
                        </div>
                        <Button size="icon" variant="outline" className="border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </form>
                    <div className="flex justify-between items-baseline px-1">
                        <h1 className="text-lg font-semibold text-slate-800">
                            {initialQuery ? `Results: "${initialQuery}"` : 'Explore Places'}
                        </h1>
                        {!loading && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                {places.length} found
                            </span>
                        )}
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-10 text-center text-slate-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                            Loading results...
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-500 bg-red-50 m-4 rounded-xl border border-red-100">
                            <p className="font-bold">Error loading results</p>
                            <p className="text-sm mt-1">{error}</p>
                            <Button variant="outline" size="sm" className="mt-4 border-red-200 text-red-700" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <>
                            {places.map((place) => (
                                <Link
                                    href={`/place/${place.id}`}
                                    key={place.id}
                                    className="flex gap-4 p-4 hover:bg-slate-50 transition-colors group"
                                >
                                    <div
                                        className="h-28 w-28 flex-shrink-0 rounded-xl bg-slate-100 bg-cover bg-center border border-slate-200 group-hover:border-emerald-500/30 transition-colors"
                                        style={{ backgroundImage: `url(${place.image})` }}
                                    />
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                                                {place.name}
                                            </h3>
                                            <span className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-xs border border-amber-100">
                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                <span className="text-amber-700 font-medium">{place.rating}</span>
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-500 mb-2 font-medium">{place.cuisine}</p>

                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span className="truncate">{place.address}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            {(place.tags || []).slice(0, 2).map((tag, i) => (
                                                <span key={i} className="text-[10px] uppercase tracking-wider bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {places.length === 0 && (
                                <div className="p-16 text-center">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4 ring-1 ring-slate-100">
                                        <Search className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900">No places found</h3>
                                    <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
                                        We couldn&apos;t find anything matching &quot;{initialQuery}&quot;. Try searching for a different city or cuisine.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-6 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                        onClick={() => {
                                            setQuery('');
                                            router.push('/search');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Map View */}
            <div className="hidden md:block flex-1 bg-slate-100 relative">
                {apiKey ? (
                    <GoogleMap
                        apiKey={apiKey}
                        className="w-full h-full"
                        defaultCenter={
                            (places[0]?.lat && places[0]?.lng)
                                ? { lat: places[0].lat, lng: places[0].lng }
                                : { lat: 40.7128, lng: -74.0060 }
                        }
                    >
                        {places.map((place) => (
                            <AdvancedMarker
                                key={place.id}
                                position={{ lat: place.lat, lng: place.lng }}
                                title={place.name}
                            />
                        ))}
                    </GoogleMap>
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500 p-4 text-center bg-slate-50">
                        <div className="max-w-md p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <MapPin className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                            <p className="mb-2 font-semibold text-slate-700">Interactive Map</p>
                            <p className="text-sm">Please add <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-600">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to .env.local to view the map.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500 bg-white min-h-screen">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
