'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, Store, ChefHat, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import Image from 'next/image';
import { getPlaces, searchPlaces } from '@/lib/api';
import { DbPlace } from '@/lib/supabase';
import { getDistance } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { LoginModal } from '@/components/auth/LoginModal';

export default function Home() {
  const { isLoading: authLoading } = useAuth();
  const exploreRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = async (query?: string, retryCount = 0) => {
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
      const data = query ? await searchPlaces(query) : await getPlaces();
      clearTimeout(timeoutId);
      setPlaces(data);
      setLoading(false);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (retryCount < 2) {
        setTimeout(() => fetchPlaces(query, retryCount + 1), 2000);
      } else {
        setError(err.message || 'Failed to load restaurants.');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (authLoading) return; // Wait for auth to resolve before fetching

    // Get Location
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => { /* location denied - that's fine */ },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    fetchPlaces();
  }, [authLoading]);

  // Proximity Sorting
  const sortedPlaces = [...places].sort((a, b) => {
    if (!userCoords) return 0;
    const distA = getDistance(userCoords.lat, userCoords.lng, a.lat, a.lng);
    const distB = getDistance(userCoords.lat, userCoords.lng, b.lat, b.lng);
    return distA - distB;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchTerm(searchQuery);
    fetchPlaces(searchQuery);

    // Smooth scroll to explore section
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50 relative">
      {/* Hero Section - Gold to Green Gradient */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50">

        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl mix-blend-multiply" />
        </div>

        <div className="max-w-4xl space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium shadow-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            The #1 Platform for Halal Dining
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">Exquisite</span><br />
            Halal Cuisine
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your contributions help thousands of Muslim families find trusted Halal dining.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full max-w-xl mx-auto mt-8 p-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Cuisine, Restaurant, or City..."
                className="pl-11 h-12 text-base bg-transparent border-0 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
              Search
            </Button>
          </form>


          <div className="flex items-center justify-center gap-8 pt-8 text-slate-600">
            <div className="flex items-center gap-2"><ChefHat className="h-5 w-5 text-amber-600" /> <span className="text-sm font-semibold">Curated Chefs</span></div>
            <div className="flex items-center gap-2"><Store className="h-5 w-5 text-emerald-600" /> <span className="text-sm font-semibold">Verified Places</span></div>
            <div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" /> <span className="text-sm font-semibold">Community Reviews</span></div>
          </div>
        </div>
      </section>

      {/* Featured Places */}
      <section ref={exploreRef} className="py-24 bg-white border-t border-slate-100 min-h-[600px] scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {activeSearchTerm
                  ? `Results for "${activeSearchTerm}"`
                  : userCoords
                    ? 'Restaurants Near You'
                    : 'Featured Collections'}
              </h2>
              <p className="text-slate-500">
                {activeSearchTerm
                  ? `Found ${places.length} matching places`
                  : userCoords
                    ? 'Showing the closest verified Halal spots'
                    : 'Hand-picked favorites for you'}
              </p>
            </div>
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
            <Link href="/search" className="hidden sm:flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              View on Map <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPlaces.map((place, index) => {
              const distance = userCoords
                ? getDistance(userCoords.lat, userCoords.lng, place.lat, place.lng)
                : null;

              return (
                <Link href={`/place/${place.id}`} key={place.id} className="group">
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1">
                    <div className="h-60 bg-slate-100 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                      <Image
                        src={place.image || '/images/placeholder-restaurant.jpg'}
                        alt={place.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={index < 3} // Prioritize first few images
                      />
                      {distance !== null && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-emerald-700 shadow-sm border border-emerald-100/50 uppercase tracking-wider z-10">
                          {distance < 1 ? 'Under 1 km' : `${distance.toFixed(1)} km away`}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-1">
                        <HalalBadge status={place.verification_status} />
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-100">
                          {place.rating} ★
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-2">{place.name}</h3>
                      <p className="text-slate-500 text-sm mb-5 line-clamp-2">{place.address}</p>
                      <div className="flex gap-2 flex-wrap">
                        {(place.tags || []).slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full border border-slate-100 font-medium">
                            {tag}
                          </span>
                        ))}
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
                        onClick={() => setUserCoords(null)}
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
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-amber-50 border-y border-emerald-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700 text-sm font-semibold shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Community Powered
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Your Contribution Helps <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-600">Thousands</span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Every review, rating, and restaurant you add helps Muslim families find trusted Halal options.
              Together, we're building the world's most comprehensive Halal food database—one contribution at a time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="text-3xl font-bold text-emerald-600 mb-2">5,000+</div>
                <div className="text-sm text-slate-600">Verified Restaurants</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="text-3xl font-bold text-amber-600 mb-2">50K+</div>
                <div className="text-sm text-slate-600">Community Reviews</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="text-3xl font-bold text-emerald-600 mb-2">100+</div>
                <div className="text-sm text-slate-600">Cities Worldwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Own a Halal Restaurant?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
            Join our network of over 5,000+ verified Halal businesses.
            Reach more customers and grow your presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-0"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Register Your Restaurant
            </Button>
            <Link href="/for-businesses">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
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
