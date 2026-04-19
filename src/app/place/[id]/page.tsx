'use client';

import { Suspense, useEffect, useState, use } from 'react';
import { getPlaceById } from '@/lib/api';
import { DbPlace } from '@/lib/supabase';
import { GoogleMap } from '@/components/map/Map';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Star, MapPin, Phone, Globe, Clock, ChevronRight, Share2, Heart, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { getValidImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { ReviewList } from '@/components/reviews/ReviewList';
import { getReviewsForPlace } from '@/lib/api';
import { DbReview } from '@/lib/supabase';
import { HalalTrustScore } from '@/components/ui/HalalTrustScore';
import { SafetyTransparency } from '@/components/ui/SafetyTransparency';

function PlaceContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [place, setPlace] = useState<DbPlace | null>(null);
    const [reviews, setReviews] = useState<DbReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        const fetchPlaceAndReviews = async () => {
            try {
                const [placeData, reviewsData] = await Promise.all([
                    getPlaceById(id),
                    getReviewsForPlace(id)
                ]);
                if (!placeData) {
                    setError('Restaurant not found');
                } else {
                    setPlace(placeData);
                    setReviews(reviewsData);
                }
            } catch (err: any) {
                console.error('Error fetching place:', err);
                setError(err.message || 'Failed to load restaurant details');
            } finally {
                setLoading(false);
            }
        };
        fetchPlaceAndReviews();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading restaurant data...</p>
                </div>
            </div>
        );
    }

    if (error || !place) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-md">
                    <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{error || 'Something went wrong'}</h1>
                    <p className="text-slate-500 mb-8">We couldn't find the restaurant you're looking for. It might have been moved or removed.</p>
                    <Link href="/search">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-xl h-12 font-bold shadow-lg shadow-emerald-200">
                            Back to Discovery
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    const name = place.name || 'Unnamed Place';
    const city = place.city || 'Location Pending';
    const cuisine = place.cuisine || 'Halal Food';
    
    // Total Stability Guard: Check coordinates
    const hasValidCoords = typeof place.lat === 'number' && typeof place.lng === 'number' && isFinite(place.lat) && isFinite(place.lng);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* SEO & Title Protection */}
            <title>{`${name} | Halal Restaurant in ${city}`}</title>

            {/* Hero Image Section */}
            <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden bg-slate-900">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105 opacity-80"
                    style={{ backgroundImage: `url(${getValidImageUrl(place.image, place.id)})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                <div className="container mx-auto px-4 h-full relative">
                    <div className="absolute bottom-12 left-4 right-4 md:left-8 md:right-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {cuisine}
                            </span>
                            <HalalBadge 
                                status={place.verification_status} 
                                hasActiveReports={reviews.some(r => r.is_non_halal_report && !r.is_dispute_resolved)}
                            />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
                            {name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-lg">{place.rating || 0}</span>
                                <span className="text-sm opacity-60">({place.review_count || 0} Reviews)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-5 w-5 text-emerald-400" />
                                <span className="font-bold">{city}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Transparency & Safety</h2>
                                    <p className="text-slate-500 leading-relaxed text-lg italic">
                                        Helping you find trusted Halal dining in diverse and mixed-stay neighborhoods.
                                    </p>
                                    <p className="text-slate-500 leading-relaxed text-md mt-4">
                                        {city && city !== 'Unknown' ? `Located in ${city}, ` : ''}{name} offers an authentic {cuisine || 'Halal'} experience. 
                                        Verified by our community to ensure safety and peace of mind when dining in mixed environments.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="pt-8 border-t border-slate-50">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Business Details</h4>
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="h-10 w-10 flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <span className="font-bold block">Halal Verification</span>
                                            <span className="text-xs text-slate-400">Regularly audited by FindHalal community</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Info */}
                        <HalalTrustScore 
                            status={place.verification_status}
                            halalVotes={reviews.filter(r => r.is_halal_confirmed).length}
                            reportCount={reviews.filter(r => r.is_non_halal_report && !r.is_dispute_resolved).length}
                            isDisputed={reviews.some(r => r.is_non_halal_report && r.is_dispute_resolved)}
                        />

                        {/* Transparency Details */}
                        <SafetyTransparency place={place} />

                        {/* Reviews Section */}
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Community Reviews</h2>
                            <ReviewList placeId={place.id} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Map & Action */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-slate-50 bg-white">
                                <h3 className="font-bold text-slate-900 mb-1">Locate on Map</h3>
                                <p className="text-sm text-slate-500 font-medium truncate">{place.address}</p>
                            </div>
                            
                            <div className="h-80 w-full relative bg-slate-100">
                                {apiKey && hasValidCoords ? (
                                    <GoogleMap 
                                        apiKey={apiKey}
                                        center={{ lat: place.lat!, lng: place.lng! }}
                                        zoom={15}
                                        className="h-full w-full"
                                    >
                                        <AdvancedMarker 
                                            position={{ lat: place.lat!, lng: place.lng! }}
                                            title={name}
                                        />
                                    </GoogleMap>
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
                                        <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 italic font-bold text-emerald-600">?</div>
                                        <div>
                                            <p className="font-bold text-slate-700">Location Pending</p>
                                            <p className="text-xs text-slate-400 mt-1 px-4 leading-relaxed">
                                                {!apiKey 
                                                    ? "Google Maps configuration is pending." 
                                                    : "Exact coordinates for this restaurant are being verified."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 space-y-4">
                                <Button className="w-full bg-slate-900 hover:bg-black text-white px-8 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all active:scale-95">
                                    Get Directions
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <p className="text-center text-[10px] uppercase font-black tracking-widest text-slate-400">
                                    Recommended by FindHalal Community
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function PlacePage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="h-8 w-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <PlaceContent params={params} />
        </Suspense>
    );
}
