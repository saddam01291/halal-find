'use client';

import { Suspense, useEffect, useState, use } from 'react';
import { getPlaceById } from '@/lib/api';
import { DbPlace } from '@/lib/supabase';
import { GoogleMap } from '@/components/map/Map';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Star, MapPin, Phone, Globe, Clock, ChevronRight, Share2, Heart, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { getValidImageUrl, cn } from '@/lib/utils';
import Link from 'next/link';
import { ReviewList } from '@/components/reviews/ReviewList';
import { getReviewsForPlace } from '@/lib/api';
import { DbReview } from '@/lib/supabase';
import { HalalTrustScore } from '@/components/ui/HalalTrustScore';
import { SafetyTransparency } from '@/components/ui/SafetyTransparency';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { useAuth } from '@/context/AuthContext';

function PlaceContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [place, setPlace] = useState<DbPlace | null>(null);
    const [reviews, setReviews] = useState<DbReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showContact, setShowContact] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { user } = useAuth();

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
            <div className="relative h-[35vh] sm:h-[45vh] md:h-[60vh] w-full overflow-hidden bg-slate-900">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105 opacity-80"
                    style={{ backgroundImage: `url(${getValidImageUrl(place.image, place.id, name, cuisine)})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                <div className="container mx-auto px-4 h-full relative">
                    <div className="absolute bottom-6 sm:bottom-12 left-4 right-4 md:left-8 md:right-8">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <span className="bg-emerald-600 text-white px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {cuisine}
                            </span>
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Verification Status</span>
                                <HalalBadge 
                                    status={place.verification_status} 
                                    hasActiveReports={reviews.some(r => r.is_non_halal_report && !r.is_dispute_resolved)}
                                    className="sm:scale-110 origin-left"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-2 sm:mb-4 tracking-tight drop-shadow-2xl line-clamp-2">
                            {name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/90">
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/20">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-sm sm:text-lg">{place.rating || 0}</span>
                                <span className="text-xs sm:text-sm opacity-60">({place.review_count || 0})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                                <span className="font-bold text-sm sm:text-base">{city}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 -mt-4 sm:-mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    
                    {/* LEFT COLUMN: Main Details */}
                    <div className="lg:col-span-2 space-y-5 sm:space-y-8">
                        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">Transparency & Community Trust</h2>
                                    <p className="text-slate-500 leading-relaxed text-sm sm:text-lg italic">
                                        Helping you find verified Halal dining experiences through transparent community feedback.
                                    </p>
                                    <p className="text-slate-500 leading-relaxed text-xs sm:text-md mt-3 sm:mt-4">
                                        {city && city !== 'Unknown' ? `Located in ${city}, ` : ''}{name} offers an authentic {cuisine || 'Halal'} experience. 
                                        Verified by our community to ensure quality and trust. Always confirm with the owner to be sure of the current Halal status.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 sm:h-11 sm:w-11 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 sm:h-11 sm:w-11 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                        <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
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
                        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-slate-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Community Reviews</h2>
                                <Button 
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className={cn(
                                        "rounded-xl font-bold transition-all",
                                        showReviewForm ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                                    )}
                                >
                                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                                </Button>
                            </div>

                            {showReviewForm && (
                                <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 animate-in fade-in slide-in-from-top-4">
                                    {user ? (
                                        <ReviewForm 
                                            placeId={place.id} 
                                            onCancel={() => setShowReviewForm(false)} 
                                            onSubmit={() => {
                                                setShowReviewForm(false);
                                                window.location.reload(); 
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-slate-500 font-bold mb-4">Please sign in to share your experience with the community.</p>
                                            <Link href="/auth">
                                                <Button className="bg-slate-900 text-white px-8 rounded-xl h-11">Sign In</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            <ReviewList placeId={place.id} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Map & Action */}
                    <div className="space-y-5 sm:space-y-8">
                        <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden lg:sticky lg:top-24">
                            <div className="p-4 sm:p-6 border-b border-slate-50 bg-white">
                                <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">Locate on Map</h3>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">{place.address}</p>
                            </div>
                            
                            <div className="h-52 sm:h-80 w-full relative bg-slate-100">
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

                            <div className="p-5 sm:p-8 space-y-4">
                                <Button className="w-full bg-slate-900 hover:bg-black text-white px-6 sm:px-8 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all active:scale-95 text-sm sm:text-base">
                                    Get Directions
                                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <p className="text-center text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-slate-400">
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
