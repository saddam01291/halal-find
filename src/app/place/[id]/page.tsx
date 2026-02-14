'use client';

import { useEffect, useState } from 'react';
import { getPlaceById } from '@/lib/api';
import { DbPlace } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { GoogleMap } from '@/components/map/Map';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Star, MapPin, Clock, Phone, Globe, ChevronLeft, ShieldCheck, Flag, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';

export default function PlacePage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useAuth();
    const [place, setPlace] = useState<DbPlace | null>(null);
    const [loading, setLoading] = useState(true);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    useEffect(() => {
        params.then(async (resolvedParams) => {
            const foundPlace = await getPlaceById(resolvedParams.id);
            setPlace(foundPlace);
            setLoading(false);
        });
    }, [params]);

    const handleWriteReview = () => {
        if (!user) {
            setIsLoginOpen(true);
        } else {
            setIsReviewing(true);
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-500 bg-white min-h-screen">Loading place details...</div>;
    if (!place) return notFound();

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    // Mock Verification Status (Random for demo if not set)
    // const isVerified = place.id === '1' || place.id === '3';
    // Use real verified status
    const isVerified = place.verified;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Image / Banner */}
            <div className="relative h-80 md:h-96 w-full">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${place.image})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                </div>
                <div className="absolute top-6 left-4 md:left-8 z-10">
                    <Link href="/search">
                        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur border-white/20 text-slate-800 hover:bg-white hover:text-emerald-600">
                            <ChevronLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                    </Link>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <div className="flex gap-2 mb-3">
                                    {(place.tags || []).map(tag => (
                                        <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-100 border border-emerald-500/20 backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}

                                    {isVerified ? (
                                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/90 text-white border border-amber-400/50 backdrop-blur-sm shadow-sm">
                                            <ShieldCheck className="h-3 w-3" /> Owner Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/50 text-slate-200 border border-slate-400/30 backdrop-blur-sm">
                                            <Users className="h-3 w-3" /> Community Report
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{place.name}</h1>
                                <div className="flex items-center gap-4 text-slate-200 text-sm md:text-base">
                                    <span className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-md backdrop-blur-md border border-white/10">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <span className="font-bold text-white">{place.rating}</span>
                                        <span className="text-slate-200">({place.review_count})</span>
                                    </span>
                                    <span>•</span>
                                    <span className="font-medium text-emerald-300">{place.cuisine}</span>
                                    <span>•</span>
                                    <span>$$</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {!isVerified && (
                                    <Button size="sm" className="bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-white/20">
                                        Claim This Business
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" className="bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-red-500/20 hover:text-red-200 hover:border-red-500/30" title="Report Issue">
                                    <Flag className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                About <span className="h-px bg-slate-100 flex-1"></span>
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Experience authentic {place.cuisine} cuisine at {place.name}.
                                Known for our delicious dishes and warm atmosphere.
                                All our meat is 100% Halal certified.
                            </p>

                            {isVerified && (
                                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-emerald-900">Halal Certified</h4>
                                        <p className="text-sm text-emerald-700 mt-1">
                                            The owner has uploaded a valid Halal certificate. Verified by Find Halal team.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
                                {!isReviewing && (
                                    <Button
                                        onClick={handleWriteReview}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/10"
                                    >
                                        Write a Review
                                    </Button>
                                )}
                            </div>

                            {isReviewing ? (
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <ReviewForm
                                        placeId={place.id}
                                        onCancel={() => setIsReviewing(false)}
                                        onSubmit={() => setIsReviewing(false)} // Pass logic to update list here ideally
                                    />
                                </div>
                            ) : (
                                <ReviewList placeId={place.id} />
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Location & Info</h2>
                            <div className="space-y-5">
                                <div className="flex gap-4 group">
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                        <MapPin className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Address</p>
                                        <p className="text-slate-700">{place.address}</p>
                                        <p className="text-slate-500 text-sm">{place.city}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                        <Clock className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Hours</p>
                                        <p className="text-emerald-600 font-medium">Open Now</p>
                                        <p className="text-slate-500 text-sm">11:00 AM - 10:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                        <Phone className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Contact</p>
                                        <p className="text-slate-700 hover:text-emerald-600 cursor-pointer">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                        <Globe className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Website</p>
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Visit Website</a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 h-48 rounded-xl overflow-hidden relative bg-slate-100 border border-slate-200 group">
                                {apiKey ? (
                                    <GoogleMap
                                        apiKey={apiKey}
                                        className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                                        defaultCenter={{ lat: place.lat, lng: place.lng }}
                                        defaultZoom={15}
                                    >
                                        <AdvancedMarker position={{ lat: place.lat, lng: place.lng }} />
                                    </GoogleMap>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 text-center p-2">
                                        Map Unavailable
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    );
}
