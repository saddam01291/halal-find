'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, Store, ChefHat, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import Image from 'next/image';
import { getPlaces, searchPlaces } from '@/lib/api';
import { DbPlace } from '@/lib/supabase';
import { getDistance, getValidImageUrl, getAreaFromAddress, calculateRelevance } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { LoginModal } from '@/components/auth/LoginModal';

export default function Home() {
  const { isLoading: authLoading } = useAuth();
  const { userCoords, locationStatus, requestLocation, clearLocation } = useLocation();
  const exploreRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const fetchPlaces = async (query?: string, coords?: { lat: number; lng: number }, retryCount = 0) => {
    setLoading(true);
    setError(null);
    if (!coords && !query) {
      // If we don't have location yet, still try to fetch the initial batch 
      // but we will prioritize them by rating in the render logic.
    }

    const timeoutId = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          setError('Slow connection detected. Please check your internet and try again.');
          return false;
        }
        return prev;
      });
    }, 12000);

    try {
      const data = query ? await searchPlaces(query) : await getPlaces(coords);
      clearTimeout(timeoutId);
      setPlaces(data);
      setLoading(false);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (retryCount < 2) {
        setTimeout(() => fetchPlaces(query, coords, retryCount + 1), 2000);
      } else {
        setError(err.message || 'Failed to load restaurants.');
        setLoading(false);
      }
    }
  };

  const availableAreas = Array.from(new Set(
    places.map(p => getAreaFromAddress(p.address, p.city))
  )).filter(Boolean).slice(0, 8);

  useEffect(() => {
    if (authLoading) return;
    fetchPlaces(searchQuery, userCoords || undefined);
  }, [authLoading, userCoords]);

  // Proximity Filter & Smart Radius Sorting
  // Proximity Filter & Smart Radius Sorting
    const getSortedPlaces = () => {
        let filtered = [...places];

        // Area Filtering
        if (selectedArea) {
            filtered = filtered.filter(p => getAreaFromAddress(p.address, p.city) === selectedArea);
        }

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up user mistakes like extra spaces
    const cleanedQuery = searchQuery.trim().replace(/\s+/g, ' ');

    if (!cleanedQuery) {
      setActiveSearchTerm('');
      setSearchQuery('');
      fetchPlaces(undefined, userCoords || undefined);
      return;
    }

    setActiveSearchTerm(cleanedQuery);
    setSearchQuery(cleanedQuery); // Update visual input to the cleaned format
    fetchPlaces(cleanedQuery, userCoords || undefined);

    // Smooth scroll to explore section
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50 relative">
      {/* Hero Section - Gold to Green Gradient */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-14 sm:py-24 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50">

        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-amber-200/20 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute top-1/2 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-200/20 rounded-full blur-3xl mix-blend-multiply" />
        </div>

        <div className="max-w-4xl space-y-5 sm:space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm font-medium shadow-sm mb-2 sm:mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            The #1 Platform for Halal Dining
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 drop-shadow-sm leading-[1.1]">
            {locationStatus === 'prompt' ? (
              <>Halal Discovery from your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">Current Device</span></>
            ) : (
              <>Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">Exquisite</span><br className="hidden sm:block" /> Halal Cuisine</>
            )}
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            {locationStatus === 'prompt' 
              ? 'Turn on your device location to see Halal restaurants near you.'
              : 'Your contributions help thousands of Muslim families find trusted Halal dining.'}
          </p>

          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-4 sm:mt-8">
            {locationStatus === 'prompt' && (
              <Button 
                onClick={requestLocation}
                size="lg" 
                className="h-12 sm:h-16 px-6 sm:px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-200 text-sm sm:text-lg font-bold flex items-center gap-2 sm:gap-3 animate-in zoom-in duration-500"
              >
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                Turn On Location
              </Button>
            )}

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full max-w-xl p-1.5 sm:p-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 sm:left-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <Input
                  placeholder="Area, City, or Category..."
                  className="pl-9 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base bg-transparent border-0 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg text-sm sm:text-base">
                Search
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-8 pt-4 sm:pt-8 text-slate-600 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2"><ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" /> <span className="text-xs sm:text-sm font-semibold">Gourmet Spots</span></div>
            <div className="flex items-center gap-1.5 sm:gap-2"><Store className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" /> <span className="text-xs sm:text-sm font-semibold">Verified Places</span></div>
            <div className="flex items-center gap-1.5 sm:gap-2"><Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" /> <span className="text-xs sm:text-sm font-semibold">Community Verified</span></div>
          </div>
        </div>

        {locationStatus === 'denied' && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-bold">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/80 backdrop-blur-md border border-amber-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-amber-700">
                <div className="p-2 bg-amber-100 rounded-full">
                  <MapPin className="h-5 w-5" />
                </div>
                <p className="text-sm">Location is disabled. Search by City above to explore manually.</p>
              </div>
              <Button 
                onClick={requestLocation}
                variant="outline" 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700 text-white border-0 rounded-xl"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Featured Places */}
      <section ref={exploreRef} className="py-12 sm:py-24 bg-white border-t border-slate-100 min-h-[400px] sm:min-h-[600px] scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                {activeSearchTerm
                  ? `Results for "${activeSearchTerm}"`
                  : userCoords
                    ? 'Restaurants Near You'
                    : 'Featured Collections'}
              </h2>
              <p className="text-sm sm:text-base text-slate-500">
                {activeSearchTerm
                  ? `Found ${places.length} matching places`
                  : userCoords
                    ? 'Showing the closest verified Halal spots'
                    : 'Hand-picked favorites for you'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {(activeSearchTerm || userCoords) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-emerald-600"
                  onClick={() => {
                    setActiveSearchTerm('');
                    setSearchQuery('');
                    fetchPlaces();
                  }}
                >
                  Reset
                </Button>
              )}
              <Link 
                href={activeSearchTerm ? `/search?q=${encodeURIComponent(activeSearchTerm)}` : "/search"} 
                className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors text-sm sm:text-base"
              >
                View on Map <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Smart Area Chips */}
          {availableAreas.length > 0 && (
            <div className="mb-12">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Nearby Neighborhoods</p>
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                  onClick={() => setSelectedArea(null)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all ${
                    !selectedArea 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  All Areas
                </button>
                {availableAreas.map(area => (
                  <button
                    key={area}
                    onClick={() => {
                        setSelectedArea(area);
                        exploreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all ${
                      selectedArea === area
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {sortedPlaces.slice(0, 30).map((place, index) => {
              const distance = place.distance;

              return (
                <Link href={`/place/${place.id}`} key={`${place.id}-${index}`} className="group">
                  <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-100 overflow-hidden hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 sm:hover:-translate-y-2 active:scale-[0.98] sm:active:scale-100">
                    <div className="h-44 sm:h-64 bg-slate-100 relative overflow-hidden">
                      <Image
                        src={getValidImageUrl(place.image, place.id, place.name, place.cuisine)}
                        alt={place.name || "Restaurant"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                        priority={index < 3}
                      />
                      {distance !== null && !isNaN(distance as number) && (
                        <div className={`absolute top-3 right-3 sm:top-5 sm:right-5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black shadow-xl border uppercase tracking-widest z-10 transition-transform group-hover:scale-110 ${
                            (distance as number) > 50 
                                ? 'bg-slate-900/60 backdrop-blur-xl text-slate-300 border-white/10' 
                                : 'bg-emerald-600 backdrop-blur-xl text-white border-emerald-400/50 shadow-emerald-500/20'
                        }`}>
                          {(distance as number) > 50 ? 'Global' : (distance as number) < 1 ? 'Under 1 km' : `${(distance as number).toFixed(1)} km`}
                        </div>
                      )}
                      
                      {/* Premium Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-5 sm:p-8">
                      <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <HalalBadge status={place.verification_status} className="text-[9px] sm:text-[11px] px-2.5 sm:px-4 py-1 sm:py-1.5" />
                        <span className="flex items-center gap-1 sm:gap-1.5 bg-amber-500/10 text-amber-700 text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-500/20 uppercase tracking-wider">
                          {place.rating || 0} ★
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1.5 sm:mb-2 tracking-tight">{place.name || 'Unnamed Place'}</h3>
                      <div className="flex flex-col gap-0.5 sm:gap-1 mb-4 sm:mb-6 min-h-[32px] sm:min-h-[40px]">
                        <p className="text-slate-800 text-xs sm:text-sm font-bold truncate">
                          {getAreaFromAddress(place.address, place.city)}
                        </p>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-400">
                          <MapPin className="h-3 w-3" />
                          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">{place.city || 'Location Pending'}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                        {Array.isArray(place.tags) ? place.tags.slice(0, 3).filter(Boolean).map((tag, tagIndex) => (
                          <span key={`${tag}-${tagIndex}`} className="text-[9px] sm:text-[10px] bg-slate-50 text-slate-500 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-100 font-bold uppercase tracking-widest">
                            {tag}
                          </span>
                        )) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
              <p className="animate-pulse">Loading amazing restaurants...</p>
            </div>
          )}

          {!loading && error && (
            <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
              <div className="text-red-600 font-bold mb-2">Oops! Something went wrong</div>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && places.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Store className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No restaurants found</h3>
              <p className="text-slate-500 mt-1">We couldn't find any restaurants at the moment.</p>
              <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200 inline-block text-left text-xs text-slate-400 max-w-sm">
                <p className="font-bold mb-1 text-slate-500 uppercase tracking-wider">Diagnostic Info (Dev Mode)</p>
                <ul className="space-y-1">
                  <li>• API URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing'}</li>
                  <li>• API Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'}</li>
                  <li>• Environment: {process.env.NODE_ENV}</li>
                  {userCoords && (
                    <li className="text-emerald-600 font-medium mt-2">
                      • Detected Location: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
                      <button
                        onClick={clearLocation}
                        className="ml-2 underline text-slate-400 hover:text-slate-600"
                      >
                        (Clear)
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-emerald-50 to-amber-50 border-y border-emerald-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold shadow-sm mb-4 sm:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Community Powered
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-2">
              Building the World's Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-600">Trusted</span> Halal Database
            </h2>

            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8 px-2">
              Every review and restaurant you add helps Muslim families find authentic Halal options.
              Together, we're building a community-driven platform based on transparency and verified trust.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-10">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
                <div className="text-xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">Verified</div>
                <div className="text-[10px] sm:text-sm text-slate-600">Owner Documentation</div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
                <div className="text-xl sm:text-3xl font-bold text-amber-600 mb-1 sm:mb-2">Caution</div>
                <div className="text-[10px] sm:text-sm text-slate-600">Community Evidence</div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
                <div className="text-xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">Global</div>
                <div className="text-[10px] sm:text-sm text-slate-600">Growing Neighborhoods</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-12 sm:py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Own a Halal Restaurant?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-10 text-sm sm:text-lg px-2">
            Join our network of over 5,000+ verified Halal businesses.
            Reach more customers and grow your presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 h-12 sm:h-auto text-sm sm:text-base"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Register Your Restaurant
            </Button>
            <Link href="/for-businesses">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 sm:h-auto text-sm sm:text-base w-full">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
