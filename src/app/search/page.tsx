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
import { getValidImageUrl, getDistance, getAreaFromAddress, calculateRelevance } from '@/lib/utils';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { useLocation } from '@/context/LocationContext';

function SearchContent() {
    const { userCoords, locationStatus, requestLocation, cityName } = useLocation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [activeSearchTerm, setActiveSearchTerm] = useState(initialQuery);
    const [places, setPlaces] = useState<DbPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    useEffect(() => {
        setQuery(initialQuery);
        setActiveSearchTerm(initialQuery);
        const fetchPlaces = async (retryCount = 0) => {
            console.log(`Search: Fetching places for query: "${initialQuery}" (retry: ${retryCount})`);
            setLoading(true);
            setError(null);

            // If coordinates just shifted, clear old results to prevent "ghost" data
            if (userCoords) {
                setPlaces([]);
            }

            // Timeout to prevent stuck loading
            const timeoutId = setTimeout(() => {
                setLoading((prevLoading) => {
                    if (prevLoading) {
                        console.warn('Search: Fetch timed out');
                        setError('Connection is taking too long. Please try again.');
                        return false;
                    }
                    return prevLoading;
                });
            }, 15000);

            try {
                // If location is granted but we don't have coords yet, wait for them
                // to avoid fetching global results that will be replaced in 1 second.
                if (locationStatus === 'granted' && !userCoords) {
                    setLoading(true);
                    return;
                }

                const data = initialQuery 
                    ? await searchPlaces(initialQuery, userCoords || undefined) 
                    : await getPlaces(userCoords || undefined);
                clearTimeout(timeoutId);
                setPlaces(data || []);
                setLoading(false);
            } catch (err: any) {
                clearTimeout(timeoutId);
                console.error('Search: Fetch error:', err);

                if (retryCount < 2) {
                    console.log(`Search: Retrying (${retryCount + 1})...`);
                    setTimeout(() => fetchPlaces(retryCount + 1), 2000);
                } else {
                    setError(err.message || 'Failed to fetch places');
                    setLoading(false);
                }
            }
        };
        fetchPlaces();
    }, [initialQuery, userCoords, locationStatus]);

    // EXACT TRANSPLANT FROM PAGE.TSX
    const getSortedPlaces = () => {
        let filtered = [...places];

        const scoredPlaces = filtered.map(p => {
            const { score, distance } = calculateRelevance(
                p as any, 
                userCoords || null
            );

            // Safety check for distance calculation
            const rawDistance = distance ?? (p.lat && p.lng && userCoords ? getDistance(userCoords.lat, userCoords.lng, p.lat, p.lng) : null);

            return {
                ...p,
                distance: rawDistance,
                relevance: score
            };
        });

        return scoredPlaces.sort((a, b) => {
            // Level 1: Relevance Score (Proximity + Base Quality)
            if (b.relevance !== a.relevance) return b.relevance - a.relevance;
            
            // Level 2: Verified First
            if (b.verified !== a.verified) return b.verified ? 1 : -1;
            
            // Level 3: Rating
            if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
            
            // Level 4: Review Count
            if ((b.review_count || 0) !== (a.review_count || 0)) return (b.review_count || 0) - (a.review_count || 0);

            // Level 5: Name Tie-breaker (matches DB sort order)
            return (a.name || '').localeCompare(b.name || '');
        });
    };

    const sortedPlaces = getSortedPlaces();

    const getNearbyAreas = () => {
        const areas = new Set<string>();
        places.forEach(p => {
            const area = getAreaFromAddress(p.address, p.city);
            if (area && area !== p.city) areas.add(area);
        });
        return Array.from(areas).slice(0, 8);
    };

    const nearbyAreas = getNearbyAreas();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedQuery = query.trim();
        setActiveSearchTerm(cleanedQuery);
        router.push(`/search?q=${encodeURIComponent(cleanedQuery)}`);
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
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                    {sortedPlaces.length} found
                                </span>
                                {locationStatus === 'granted' && userCoords && (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-medium text-emerald-600">
                                        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                        Browsing {cityName || 'Near You'}
                                    </span>
                                )}
                                {locationStatus === 'loading' && (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-medium text-amber-600">
                                        <div className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                                        Locating...
                                    </span>
                                )}
                            </div>
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
                        <div className="flex flex-col">
                            {/* Neighborhood Chips */}
                            {locationStatus === 'granted' && nearbyAreas.length > 0 && (
                                <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">Nearby Neighborhoods</p>
                                    <div className="flex flex-wrap gap-2">
                                        {nearbyAreas.map(area => (
                                            <button
                                                key={area}
                                                onClick={() => {
                                                    setQuery(area);
                                                    router.push(`/search?q=${encodeURIComponent(area)}`);
                                                }}
                                                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
                                            >
                                                {area}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {locationStatus === 'granted' && (
                                <div className="p-5 border-b border-slate-50 bg-emerald-50/20">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Browsing Results Near {userCoords ? 'You' : 'Selected Area'}
                                    </p>
                                </div>
                            )}

                            {sortedPlaces.length > 0 && locationStatus !== 'granted' && (
                                <div className="p-5 border-b border-slate-50 bg-amber-50/20">
                                    <button 
                                        onClick={requestLocation}
                                        className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] hover:text-amber-700 transition-colors"
                                    >
                                        Tip: Turn on location to see restaurants near you first →
                                    </button>
                                </div>
                            )}

                            {sortedPlaces.slice(0, 100).map((place, index) => (
                                <Link
                                    href={`/place/${place.id}`}
                                    key={`${place.id}-${index}`}
                                    className="flex gap-5 p-5 hover:bg-slate-50 transition-all group border-b border-slate-50 last:border-0"
                                >
                                    <div
                                        className="h-32 w-32 flex-shrink-0 rounded-[1.5rem] bg-slate-100 bg-cover bg-center border border-slate-100 group-hover:border-emerald-500/30 transition-all duration-500 group-hover:scale-105 shadow-sm"
                                        style={{ backgroundImage: `url(${getValidImageUrl(place.image, place.id)})` }}
                                    />
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors tracking-tight">
                                                {place.name || 'Unnamed Place'}
                                            </h3>
                                            <span className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full text-[10px] font-black border border-amber-500/20 text-amber-700">
                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                {place.rating || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">{place.cuisine || 'Halal Food'}</p>
                                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                                            <HalalBadge status={place.verification_status} className="scale-75 origin-left" />
                                        </div>

                                        <div className="flex flex-col gap-0.5 mb-3">
                                            <p className="text-sm font-bold text-slate-700 truncate">
                                                {getAreaFromAddress(place.address, place.city)}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate uppercase tracking-wider font-medium">{place.city || 'Location Pending'}</span>
                                                </div>
                                                
                                                {/* DISTANCE INDICATOR */}
                                                {(place as any).distance !== undefined && (place as any).distance !== null && !isNaN((place as any).distance) && (
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                                                        (place as any).distance > 50 
                                                            ? 'bg-slate-50 text-slate-300' 
                                                            : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {(place as any).distance > 50 
                                                            ? 'Global Discovery' 
                                                            : `${(place as any).distance < 1 ? '< 1' : (place as any).distance.toFixed(1)} km`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {Array.isArray(place.tags) ? place.tags.slice(0, 2).filter(Boolean).map((tag, i) => (
                                                <span key={`${tag}-${i}`} className="text-[10px] uppercase tracking-wider bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                                                    {tag}
                                                </span>
                                            )) : null}
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
                        </div>
                    )}
                </div>
            </div>

            {/* Map View */}
            <div className="hidden md:block flex-1 bg-slate-100 relative">
                {apiKey ? (
                        <GoogleMap 
                            apiKey={apiKey}
                            className="w-full h-full"
                            center={userCoords || (sortedPlaces[0]?.lat ? { lat: sortedPlaces[0].lat, lng: sortedPlaces[0].lng } : { lat: 40.7128, lng: -74.0060 })}
                            zoom={locationStatus === 'granted' ? 14 : 12}
                        >
                            {sortedPlaces.slice(0, 100).filter(place => typeof place.lat === 'number' && isFinite(place.lat) && typeof place.lng === 'number' && isFinite(place.lng)).map((place, index) => (
                                <AdvancedMarker
                                    key={`marker-${place.id}-${index}`}
                                    position={{ lat: place.lat!, lng: place.lng! }}
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
