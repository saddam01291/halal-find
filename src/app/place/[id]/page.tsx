'use client';

import { useEffect, useState } from 'react';
import { getPlaceById, getReviewsForPlace, deletePlace } from '@/lib/api';
import { DbPlace, DbReview } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { GoogleMap } from '@/components/map/Map';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Star, MapPin, Clock, Phone, Globe, ChevronLeft, ShieldCheck, Flag, Users, CheckCircle2, AlertTriangle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import Link from 'next/link';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { SafetyTransparency } from '@/components/ui/SafetyTransparency';

import { Pencil, Trash2, Loader2, Save } from 'lucide-react';
import { HalalTrustScore } from '@/components/ui/HalalTrustScore';
import { getValidImageUrl, calculateTrustScore } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginModal } from '@/components/auth/LoginModal';
import { EditPlaceModal } from '@/components/admin/EditPlaceModal';

export default function PlacePage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useAuth();
    const [place, setPlace] = useState<DbPlace | null>(null);
    const [loading, setLoading] = useState(true);
    const [isReviewing, setIsReviewing] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [confirmations, setConfirmations] = useState(0);
    const [isDisputed, setIsDisputed] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        params.then(async (resolvedParams) => {
            const [foundPlace, reviews] = await Promise.all([
                getPlaceById(resolvedParams.id),
                getReviewsForPlace(resolvedParams.id)
            ]);

            setPlace(foundPlace);
            const confirmedCount = reviews.filter(r => r.is_halal_confirmed).length;
            setConfirmations(confirmedCount);

            // Safety Check: Is there any unresolved non-halal report?
            const activeDispute = reviews.some(r => r.is_non_halal_report && !r.is_dispute_resolved);
            setIsDisputed(activeDispute);

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

    const handleDelete = async () => {
        if (!place) return;
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete "${place.name}"? This cannot be undone.`)) return;

        setIsDeleting(true);
        try {
            await deletePlace(place.id);
            router.push('/search');
        } catch (error) {
            console.error('Error deleting place:', error);
            alert('Failed to delete restaurant. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Tiered Verification Logic
    const isOwnerVerified = place.verified;
    const isCommunityVerified = confirmations >= 5;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": place.name,
        "image": place.image,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": place.address,
            "addressLocality": place.city,
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": place.lat,
            "longitude": place.lng
        },
        "url": `https://findhalalonly.com/place/${place.id}`,
        "servesCuisine": place.cuisine,
        "dietaryRestrictions": "Halal",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": place.rating,
            "reviewCount": place.review_count
        }
    };

    const handleShare = async () => {
        if (!place) return;
        const shareData = {
            title: `${place.name} | Find Halal`,
            text: `Check out ${place.name} on Find Halal!`,
            url: window.location.href
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* Admin Action Bar */}
            {user?.role === 'admin' && (
                <div className="bg-slate-900 border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-[100] shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Administrator Mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white/10 border-white/10 text-white hover:bg-white hover:text-slate-900 h-9 rounded-lg font-bold text-[10px] uppercase tracking-widest px-4"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Pencil className="h-3 w-3 mr-2" /> Edit Restaurant
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={isDeleting}
                            className="bg-red-600/20 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white h-9 rounded-lg font-bold text-[10px] uppercase tracking-widest px-4 disabled:opacity-50"
                            onClick={handleDelete}
                        >
                            {isDeleting ? (
                                <><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Deleting...</>
                            ) : (
                                <><Trash2 className="h-3 w-3 mr-2" /> Delete Entry</>
                            )}
                        </Button>
                    </div>
                </div>
            )}
            <div className="relative h-80 md:h-[450px] w-full">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] hover:scale-105"
                    style={{ backgroundImage: `url(${getValidImageUrl(place.image, place.id)})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
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
                                <div className="flex gap-2 mb-3 items-center">
                                    {(place.tags || []).map(tag => (
                                        <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-emerald-100 border border-emerald-500/20 backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}

                                    {isDisputed ? (
                                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white border border-red-500 shadow-lg animate-pulse">
                                            <AlertTriangle className="h-3 w-3" /> HALAL DISPUTED
                                        </span>
                                    ) : (
                                        <HalalBadge
                                            status={place.verification_status}
                                            className="bg-emerald-500 text-white border-emerald-400 py-0.5"
                                        />
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
                                {!isOwnerVerified && (
                                    <Button
                                        size="sm"
                                        className="bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-white/20"
                                        onClick={async () => {
                                            if (!user) {
                                                setIsLoginOpen(true);
                                                return;
                                            }
                                            if (user.role !== 'owner') {
                                                alert('Only restaurant owners can claim business listings. Please update your profile.');
                                                return;
                                            }

                                            try {
                                                const { submitVerificationRequest } = await import('@/lib/api');
                                                await submitVerificationRequest({
                                                    restaurant_name: place.name,
                                                    owner_name: user.full_name || 'Owner',
                                                    certificate_url: '', // Will be uploaded later
                                                    place_id: place.id,
                                                    type: 'claim'
                                                });
                                                alert('Verification claim submitted! Our team will review your request.');
                                            } catch (err) {
                                                console.error('Error claiming business:', err);
                                                alert('Failed to submit claim. Please try again.');
                                            }
                                        }}
                                    >
                                        Claim This Business
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" className="bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-emerald-500/20 hover:text-emerald-200 hover:border-emerald-500/30" title="Share" onClick={handleShare}>
                                    <Share2 className="h-4 w-4" />
                                </Button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <HalalTrustScore 
                                score={calculateTrustScore(place, confirmations)}
                                confirmations={confirmations}
                                isVerified={isOwnerVerified ?? false}
                                isDisputed={isDisputed}
                            />
                            
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
                                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    About <span className="h-px bg-slate-100 flex-1"></span>
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Experience authentic {place.cuisine} cuisine at {place.name}.
                                    Known for our delicious dishes and warm community-first atmosphere.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <SafetyTransparency place={place} />
                        </div>

                            {!isDisputed && isOwnerVerified && place.certificate_url && (
                                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-emerald-900">Owner Verified</h4>
                                        <p className="text-sm text-emerald-700 mt-1">
                                            The owner has provided a valid Halal certificate, verified by the Find Halal team. This establishment officially maintains Halal standards.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!place.verified && isCommunityVerified && (
                                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-emerald-900">Community Verified Halal</h4>
                                        <p className="text-sm text-emerald-700 mt-1">
                                            This restaurant has been confirmed as Halal by {confirmations} members of our community.
                                            Users have reported that this establishment serves Halal food.
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
            
            {place && (
                <EditPlaceModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    place={place} 
                    onSave={() => window.location.reload()} 
                />
            )}
        </div>
    );
}
