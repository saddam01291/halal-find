import { Metadata, ResolvingMetadata } from 'next';
import { getPlaceByIdServer, getReviewsForPlaceServer } from '@/lib/api-server';
import { Star, MapPin, Phone, Clock, ChevronRight, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { getValidImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { HalalTrustScore } from '@/components/ui/HalalTrustScore';
import { SafetyTransparency } from '@/components/ui/SafetyTransparency';
import { PlaceActions } from '@/components/place/PlaceActions';
import { PlaceReviews } from '@/components/place/PlaceReviews';
import { GoogleMap } from '@/components/map/Map';
import { notFound } from 'next/navigation';

function extractIdFromSlug(slug: string): string | null {
    const match = slug.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/i);
    return match ? match[1] : slug;
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const id = extractIdFromSlug(slug);
    
    if (!id) {
        return { title: 'Place Not Found | FindHalal' };
    }

    const place = await getPlaceByIdServer(id);
    
    if (!place) {
        return { title: 'Place Not Found | FindHalal' };
    }
    
    const name = place.name || 'Unnamed Place';
    const city = place.city || 'Location Pending';
    const title = `${name} | Halal Hotel, Place, Food & Restaurant Near ${city}`;
    const description = `Find verified information, community reviews, and halal status for ${name} in ${city}.`;
    
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://findhalalonly.com/restaurant/${slug}`,
            siteName: 'Find Halal',
            images: [
                {
                    url: getValidImageUrl(place.image, place.id, name, place.cuisine || 'Halal Food'),
                    width: 1200,
                    height: 630,
                    alt: `${name} preview`,
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [getValidImageUrl(place.image, place.id, name, place.cuisine || 'Halal Food')],
        }
    };
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const id = extractIdFromSlug(slug);

    if (!id) {
        return notFound();
    }

    const [place, reviews] = await Promise.all([
        getPlaceByIdServer(id),
        getReviewsForPlaceServer(id)
    ]);

    if (!place) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-md">
                    <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
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

    const name = place.name || 'Unnamed Place';
    const city = place.city || 'Location Pending';
    const cuisine = place.cuisine || 'Halal Food';

    // JSON-LD Schema
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: name,
        image: getValidImageUrl(place.image, place.id, name, cuisine),
        url: `https://findhalalonly.com/restaurant/${slug}`,
        servesCuisine: ['Halal', cuisine].filter(Boolean),
        address: {
            '@type': 'PostalAddress',
            streetAddress: place.address || '',
            addressLocality: place.city || '',
            addressRegion: place.city || '',
            addressCountry: 'IN'
        },
        geo: (place.lat && place.lng) ? {
            '@type': 'GeoCoordinates',
            latitude: place.lat,
            longitude: place.lng,
        } : undefined,
        ...(place.phone ? { telephone: place.phone } : {}),
        ...(place.email ? { email: place.email } : {}),
        priceRange: '$$',
        ...(place.rating > 0 && place.review_count > 0 ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: place.rating,
                reviewCount: place.review_count,
                bestRating: '5',
                worstRating: '1',
            }
        } : {})
    };

    const displayCoords = (place.lat && place.lng) ? { lat: place.lat, lng: place.lng } : null;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

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
                                <PlaceActions placeId={place.id} placeName={place.name} />
                            </div>
                            
                            <div className="pt-8 border-t border-slate-50">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Business Details</h4>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <div className="h-10 w-10 flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <span className="font-bold block">Halal Verification</span>
                                                <span className="text-xs text-slate-400">Regularly audited by FindHalal community</span>
                                            </div>
                                        </div>
                                        
                                        {place.phone && (
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <div className="h-10 w-10 flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center">
                                                    <Phone className="h-4 w-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <span className="font-bold block">Phone</span>
                                                    <a href={`tel:${place.phone}`} className="text-xs text-emerald-600 hover:underline font-medium">{place.phone}</a>
                                                </div>
                                            </div>
                                        )}

                                        {place.email && (
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <div className="h-10 w-10 flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center">
                                                    <Mail className="h-4 w-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <span className="font-bold block">Email</span>
                                                    <a href={`mailto:${place.email}`} className="text-xs text-emerald-600 hover:underline font-medium">{place.email}</a>
                                                </div>
                                            </div>
                                        )}
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
                        <SafetyTransparency place={place as any} />

                        {/* Reviews Section isolated as Client Component */}
                        <PlaceReviews placeId={place.id} />
                        
                    </div>

                    {/* RIGHT COLUMN: Map & Action */}
                    <div className="space-y-5 sm:space-y-8">
                        <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden lg:sticky lg:top-24">
                            <div className="p-4 sm:p-6 border-b border-slate-50 bg-white">
                                <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">Locate on Map</h3>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">{place.address}</p>
                            </div>
                            
                            <div className="h-52 sm:h-80 w-full relative bg-slate-100">
                                {displayCoords ? (
                                        <GoogleMap 
                                            center={displayCoords}
                                            zoom={place.lat ? 16 : 12} 
                                            className="h-full w-full"
                                            isStatic={true} 
                                        />
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
                                        <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 italic font-bold text-emerald-600">?</div>
                                        <div>
                                            <p className="font-bold text-slate-700">Location Pending</p>
                                            <p className="text-xs text-slate-400 mt-1 px-4 leading-relaxed">
                                                Exact coordinates for this restaurant are being verified.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 sm:p-8 space-y-4">
                                <a 
                                    className="w-full bg-slate-900 hover:bg-black text-white px-6 sm:px-8 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all active:scale-95 text-sm sm:text-base"
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                        [place.name, place.address, place.city]
                                            .filter(Boolean)
                                            .join(', ')
                                    ) || (place.lat && place.lng ? `${place.lat},${place.lng}` : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Get Directions
                                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <p className="text-center text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-slate-400">
                                    Recommended by FindHalal Community
                                </p>
                                {place.city && place.city !== 'Unknown' && (
                                    <Link
                                        href={`/halal-restaurants-${place.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs border border-emerald-100"
                                    >
                                        More Halal in {place.city} <ChevronRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
