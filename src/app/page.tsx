'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Store, ChefHat, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { getPlaces } from '@/lib/api';
import { DbPlace } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<DbPlace[]>([]);

  useEffect(() => {
    getPlaces().then(setPlaces);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50">
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
            Connecting food lovers with certified Halal restaurants. <br className="hidden sm:block" />
            Explore thousands of curated dining experiences.
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

          <div className="flex items-center justify-center gap-8 pt-8 text-slate-400 grayscale opacity-60">
            <div className="flex items-center gap-2"><ChefHat className="h-5 w-5" /> <span className="text-sm font-semibold">Curated Chefs</span></div>
            <div className="flex items-center gap-2"><Store className="h-5 w-5" /> <span className="text-sm font-semibold">Verified Places</span></div>
            <div className="flex items-center gap-2"><Users className="h-5 w-5" /> <span className="text-sm font-semibold">Community Reviews</span></div>
          </div>
        </div>
      </section>

      {/* Featured Places */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Collections</h2>
              <p className="text-slate-500">Hand-picked favorites for you</p>
            </div>
            <Link href="/search" className="hidden sm:flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              View all places <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.slice(0, 3).map((place) => (
              <Link href={`/place/${place.id}`} key={place.id} className="group">
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="h-60 bg-slate-100 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${place.image})` }}
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{place.name}</h3>
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-100">
                        {place.rating} ★
                      </span>
                    </div>
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
            ))}
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
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">
              Register Your Restaurant
            </Button>
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
