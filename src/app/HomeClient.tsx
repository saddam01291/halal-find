'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, Store, ChefHat, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import Image from 'next/image';
import { getPlaces, searchPlaces, getPopularCities } from '@/lib/api';
import { DbPlace } from '@/lib/supabase';
import { getDistance, getValidImageUrl, getAreaFromAddress, calculateRelevance } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { LoginModal } from '@/components/auth/LoginModal';

interface HomeClientProps {
  initialPlaces: DbPlace[];
  initialPopularCities: { city_name: string, city_slug: string, restaurant_count: number }[];
}

export function HomeClient({ initialPlaces, initialPopularCities }: HomeClientProps) {
  const { isLoading: authLoading } = useAuth();
  const { userCoords, locationStatus, requestLocation, clearLocation } = useLocation();
  const exploreRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [places, setPlaces] = useState<DbPlace[]>(initialPlaces);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Initial load is done on server
  const [error, setError] = useState<string | null>(null);
  const [popularCities, setPopularCities] = useState(initialPopularCities);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const fetchPlaces = async (query?: string, coords?: { lat: number; lng: number }, retryCount = 0) => {
    setLoading(true);
    setError(null);

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
    // Only re-fetch if location is granted, otherwise use server-fetched initialPlaces
    if (locationStatus === 'granted' && userCoords) {
      fetchPlaces(undefined, userCoords);
    }
  }, [locationStatus, userCoords]);

  const getSortedPlaces = () => {
    let filtered = [...places];

    if (selectedArea) {
      filtered = filtered.filter(p => getAreaFromAddress(p.address, p.city) === selectedArea);
    }

    const scoredPlaces = filtered.map(p => {
      const { score, distance } = calculateRelevance(
        p as any,
        userCoords || null
      );

      const rawDistance = distance ?? (p.lat && p.lng && userCoords ? getDistance(userCoords.lat, userCoords.lng, p.lat, p.lng) : null);

      return {
        ...p,
        distance: rawDistance,
        relevance: score
      };
    });

    return scoredPlaces.sort((a, b) => {
      if (b.relevance !== a.relevance) return b.relevance - a.relevance;
      if (b.verified !== a.verified) return b.verified ? 1 : -1;
      if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
      if ((b.review_count || 0) !== (a.review_count || 0)) return (b.review_count || 0) - (a.review_count || 0);
      return (a.name || '').localeCompare(b.name || '');
    });
  };

  const sortedPlaces = getSortedPlaces();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedQuery = searchQuery.trim().replace(/\s+/g, ' ');

    if (!cleanedQuery) {
      setActiveSearchTerm('');
      setSearchQuery('');
      fetchPlaces(undefined, userCoords || undefined);
      return;
    }

    setActiveSearchTerm(cleanedQuery);
    setSearchQuery(cleanedQuery);
    fetchPlaces(cleanedQuery, userCoords || undefined);
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50 relative">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-28 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl w-full space-y-6 sm:space-y-8 relative z-10">
          <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm leading-[1.1] sm:leading-[1.15] mb-4">
            Searching for <br />
            <span className="text-emerald-600">Halal Food</span> <br />
            near by
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-2 font-medium">
            Discover verified halal restaurants with trusted reviews. Find halal food easily and eat with confidence.
          </p>

          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6 sm:mt-10 w-full">
            {locationStatus === 'prompt' && (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-2 sm:px-0">
                <Button 
                  onClick={requestLocation}
                  size="lg" 
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 text-base font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <MapPin className="h-5 w-5" />
                  Find Near Me
                </Button>
                <Link href="/search" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 text-base font-semibold transition-all"
                  >
                    Explore Cities →
                  </Button>
                </Link>
              </div>
            )}

            <div className="w-full px-2 sm:px-0 flex justify-center">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full max-w-xl p-2 bg-white border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40">
                <div className="relative flex-1 w-full">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Area, City, or Category..."
                    className="pl-12 h-12 sm:h-14 w-full text-base bg-transparent border-0 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 sm:h-14 w-full sm:w-auto px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md text-base font-semibold transition-all">
                  Search
                </Button>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-6 text-sm font-semibold text-slate-500 w-full max-w-2xl mx-auto px-2">
              <span className="uppercase tracking-wider text-xs text-slate-400 whitespace-nowrap hidden sm:inline-block">Trending:</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 w-full justify-start sm:justify-center">
                {[
                  { name: 'Dubai', slug: 'dubai' },
                  { name: 'London', slug: 'london' },
                  { name: 'Delhi', slug: 'delhi' },
                  { name: 'Hyderabad', slug: 'hyderabad' },
                  { name: 'Mumbai', slug: 'mumbai' }
                ].map(city => (
                  <Link 
                    key={city.slug} 
                    href={`/halal-restaurants-${city.slug}`}
                    className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-all shadow-sm whitespace-nowrap text-sm"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-8 pt-8 sm:pt-10 text-slate-600 flex-wrap px-2">
            <div className="flex items-center gap-2"><ChefHat className="h-5 w-5 text-amber-500" /> <span className="text-sm font-semibold">Gourmet Spots</span></div>
            <div className="flex items-center gap-2"><Store className="h-5 w-5 text-emerald-500" /> <span className="text-sm font-semibold">Verified Places</span></div>
            <div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-500" /> <span className="text-sm font-semibold">Community Verified</span></div>
          </div>
        </div>

        {locationStatus === 'denied' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-in zoom-in-95 duration-300">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-6">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-black text-center text-slate-900 mb-2">
                Location Required
              </h3>
              <div className="text-center text-slate-600 mb-8">
                <p>
                  To show the best halal restaurants near you, please turn on your location. Alternatively, you can search manually by city name.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={requestLocation}
                  className="w-full h-12 sm:h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-500/20"
                >
                  Turn on Location
                </Button>
                <Button 
                  onClick={() => {
                    const el = document.querySelector('input[type="text"]');
                    (el as HTMLElement)?.focus();
                    clearLocation(); // Resets state to prompt so the modal closes
                  }}
                  variant="outline" 
                  className="w-full h-12 sm:h-14 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-base"
                >
                  Search Manually by Name
                </Button>
              </div>
              <button 
                onClick={clearLocation}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
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
                    : 'Top-rated halal spots this week'}
              </h2>
              <p className="text-sm sm:text-base text-slate-500">
                {activeSearchTerm
                  ? `Found ${places.length} matching places`
                  : userCoords
                    ? 'Showing the closest verified Halal spots'
                    : 'Top-rated halal spots this week'}
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

          {availableAreas.length > 0 && (
            <div className="mb-12">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Nearby Neighborhoods</p>
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
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
              const slugBase = `${place.name || 'restaurant'} ${place.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              const slug = `${slugBase}-${place.id}`;

              return (
                <Link href={`/restaurant/${slug}`} key={`${place.id}-${index}`} className="group">
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
            </div>
          )}
        </div>
      </section>

      {/* Popular Cities Section */}
      {popularCities.length > 0 && (
        <section className="py-12 sm:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div className="max-w-2xl px-2">
                <div className="text-emerald-600 font-bold text-xs sm:text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Discover Your Local Halal Hub
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Explore Halal Food by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-600">Popular Cities</span>
                </h2>
                <p className="text-slate-500 mt-4 text-sm sm:text-lg leading-relaxed">
                  Join thousands of diners in exploring verified Halal destinations across global culinary hubs.
                </p>
              </div>
              <Link href="/search" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all duration-300 group">
                World Map View <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {popularCities.map((city) => (
                <Link
                  key={city.city_slug}
                  href={`/halal-restaurants-${city.city_slug}`}
                  className="group relative h-32 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-emerald-50" />
                  <div className="relative h-full p-4 sm:p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Store className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                      </div>
                      <div className="bg-emerald-600/10 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {city.restaurant_count}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors truncate">
                        {city.city_name}
                      </h3>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 group-hover:text-emerald-600/60 transition-colors uppercase tracking-widest mt-1">
                        Verified Spots
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">How FindHalal Works</h2>
            <p className="text-slate-500">Your simple path to verified dining experiences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: '01', 
                title: 'Search', 
                desc: 'Find restaurants by city, cuisine, or specific neighborhood.',
                icon: <MapPin className="h-6 w-6 text-emerald-600" />
              },
              { 
                step: '02', 
                title: 'Verify', 
                desc: 'Check the real-time trust score and verification status.',
                icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />
              },
              { 
                step: '03', 
                title: 'Dine', 
                desc: 'Eat with confidence knowing the status is community-vetted.',
                icon: <ChefHat className="h-6 w-6 text-emerald-600" />
              },
              { 
                step: '04', 
                title: 'Report', 
                desc: 'Help others by sharing photos and confirming the halal status.',
                icon: <Users className="h-6 w-6 text-emerald-600" />
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="mb-6 h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div className="absolute top-0 right-0 text-6xl font-black text-slate-50 -z-10 group-hover:text-emerald-50 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-12 sm:py-24 bg-gradient-to-br from-emerald-50 to-amber-50 border-y border-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 mb-6 px-2 leading-tight">
              Building the World's Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-600">Trusted</span> Halal Database
            </h2>
            <p className="text-sm sm:text-xl text-slate-600 leading-relaxed px-2">
              Every listing is either owner-certified or confirmed by 5+ community members. No guessing. No compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-emerald-500/5 text-center">
              <div className="h-16 w-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-600/20">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Owner Certified</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Direct verification from restaurant owners providing active Halal certification documents.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-emerald-500/5 text-center">
              <div className="h-16 w-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Vouched</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Verified by at least 5 independent community members through on-site visits and reports.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-emerald-500/5 text-center">
              <div className="h-16 w-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20">
                <Store className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">5,000+ Listings</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Growing daily with verified halal hotels, places, food, and restaurants across the globe.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/how-we-verify-halal" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline transition-all">
                Learn more about our verification process <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-12 sm:py-20 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Not sure if a place is halal?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-6">Search it. Report it. Help the community.</p>
        <p className="mt-4"><Link href="/add-missing-restaurant"><span className="text-emerald-600 underline">Add a missing restaurant</span></Link></p>
      </section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
