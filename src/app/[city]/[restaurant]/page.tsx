import { Metadata, ResolvingMetadata } from 'next';
import { getPlaceByCityAndSlugServer, getReviewsForPlaceServer } from '@/lib/api-server';
import { Star, MapPin, Phone, Clock, ChevronRight, AlertCircle, Mail, ShieldCheck, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { HalalBadge } from '@/components/ui/HalalBadge';
import { getValidImageUrl, buildRestaurantUrl } from '@/lib/utils';
import Link from 'next/link';
import { HalalTrustScore } from '@/components/ui/HalalTrustScore';
import { SafetyTransparency } from '@/components/ui/SafetyTransparency';
import { PlaceActions } from '@/components/place/PlaceActions';
import { PlaceReviews } from '@/components/place/PlaceReviews';
import { GoogleMap } from '@/components/map/Map';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';

export async function generateMetadata(
    { params }: { params: Promise<{ city: string; restaurant: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { city, restaurant } = await params;

    if (!restaurant || !city) return { title: 'Place Not Found | FindHalal' };

    const place = await getPlaceByCityAndSlugServer(city, restaurant);
    if (!place) return { title: 'Place Not Found | FindHalal' };

    const name = place.name || 'Unnamed Place';
    const placeCity = place.city || 'India';
    const title = `${name} — Halal Restaurant in ${placeCity} | FindHalal`;
    const description = `Is ${name} halal? ${place.verification_status || 'Unverified'}. Located at ${place.address || 'Location pending'}, ${placeCity}. Read community reviews and check halal status.`;
    const canonicalPath = buildRestaurantUrl(place.city, place.slug || restaurant);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: canonicalPath,
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
        },
        alternates: {
            canonical: canonicalPath,
        }
    };
}

export default async function RestaurantPage({
    params,
    searchParams,
}: {
    params: Promise<{ city: string; restaurant: string }>;
    searchParams: Promise<{ claim?: string }>;
}) {
    const { city, restaurant } = await params;
    const { claim } = await searchParams;

    if (!restaurant || !city) return notFound();

    const place = await getPlaceByCityAndSlugServer(city, restaurant);
    const reviews = place ? await getReviewsForPlaceServer(place.id) : [];

    if (!place) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center max-w-md">
                    <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
                    <p className="text-slate-500 mb-8">We couldn&apos;t find the restaurant you&apos;re looking for. It might have been moved or removed.</p>
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
    const placeCity = place.city || 'India';
    const cuisine = place.cuisine || 'Halal Food';
    const canonicalPath = buildRestaurantUrl(place.city, place.slug || restaurant);

    // Redirect non-canonical URLs to the canonical path (e.g. old slugs, wrong city prefix)
    // Only redirect when we have a real slug to avoid redirect loops
    const currentPath = `/${city}/${restaurant}`;
    if (place.slug && currentPath !== canonicalPath) {
        redirect(canonicalPath);
    }


    const isClaimed = place.verification_status === 'owner_verified';
    const autoOpenClaim = claim === 'true' && !isClaimed;
    const citySlugForUrl = placeCity.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // JSON-LD Restaurant Schema
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name,
        image: getValidImageUrl(place.image, place.id, name, cuisine),
        url: `https://www.findhalalonly.com${canonicalPath}`,
        servesCuisine: ['Halal', cuisine].filter(Boolean),
        address: {
            '@type': 'PostalAddress',
            streetAddress: place.address || 'Address Pending',
            addressLocality: placeCity,
            addressRegion: placeCity,
            addressCountry: 'IN'
        },
        geo: (place.lat && place.lng) ? {
            '@type': 'GeoCoordinates',
            latitude: place.lat,
            longitude: place.lng,
        } : undefined,
        telephone: place.phone || undefined,
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

    // Breadcrumb Schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.findhalalonly.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: placeCity,
                item: `https://www.findhalalonly.com/halal-restaurants-${citySlugForUrl}`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name,
                item: `https://www.findhalalonly.com${canonicalPath}`
            }
        ]
    };

    const displayCoords = (place.lat && place.lng) ? { lat: place.lat, lng: place.lng } : null;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Hero Image Section */}
            <div className="relative h-[35vh] sm:h-[45vh] md:h-[60vh] w-full overflow-hidden bg-slate-900">
                <Image
                    src={getValidImageUrl(place.image, place.id, name, cuisine)}
                    alt={`Halal restaurant ${name} in ${placeCity} - Interior/Food`}
                    fill
                    priority
                    className="object-cover transition-transform duration-1000 hover:scale-105 opacity-80"
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
                                    reviewCount={place.review_count}
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
                                <span className="font-bold text-sm sm:text-base">{placeCity}</span>
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
                            <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 bg-slate-50 px-4 py-2 rounded-xl w-fit">
                                <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                                <ChevronRight className="h-3 w-3" />
                                {place.city && (
                                    <>
                                        <Link href={`/halal-restaurants-${citySlugForUrl}`} className="hover:text-emerald-600 transition-colors">{placeCity}</Link>
                                        <ChevronRight className="h-3 w-3" />
                                    </>
                                )}
                                <span className="text-slate-900 truncate max-w-[100px] sm:max-w-none">{name}</span>
                            </nav>

                            {/* CAUTION BANNER for 0 reviews / unverified */}
                            {(place.verification_status === 'unverified' || place.verification_status === 'osm_import') && place.review_count === 0 && (
                                <div className="mb-8 p-5 sm:p-6 bg-orange-50 border-2 border-orange-200 rounded-2xl flex flex-col items-start gap-3">
                                    <div className="flex items-center gap-2 text-orange-700 font-black uppercase tracking-widest text-sm">
                                        <AlertOctagon className="h-5 w-5 animate-pulse" />
                                        Caution: Imported Listing
                                    </div>
                                    <p className="text-slate-700 text-sm leading-relaxed">
                                        This place was automatically imported from a general directory. We currently have <strong>no community confirmations</strong> regarding its Halal status. Please verify directly with the owner before visiting.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
                                <div className="flex-1">
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2">About {name} — Halal Dining in {placeCity}</h2>
                                    <p className="text-slate-500 leading-relaxed text-sm sm:text-lg italic">
                                        Helping you find verified Halal dining experiences through transparent community feedback.
                                    </p>
                                    <div className="text-slate-600 leading-relaxed text-sm sm:text-base mt-4 sm:mt-6 space-y-4">
                                        <p>
                                            Our community of halal diners has highlighted <strong>{name}</strong> as a key destination for anyone exploring the <strong>{placeCity}</strong> food scene.
                                            Located at {place.address}, this spot specializes in {cuisine} dishes that have been vetted for quality and authenticity.
                                        </p>
                                        <p>
                                            What sets <strong>{name}</strong> apart is the consistent feedback from local visitors who appreciate its commitment to halal standards.
                                            With a solid {place.rating || 0}-star rating from {place.review_count || 0} community members, it has become a reliable choice for families and food enthusiasts alike seeking a genuine <strong>halal restaurant in {placeCity}</strong>.
                                        </p>
                                        <p>
                                            At FindHalal, we don&apos;t just list places; we verify them. <strong>{name}</strong> is part of our transparent directory where safety and dietary values come first.
                                            Browse the latest community photos and trust scores below to plan your visit with confidence.
                                        </p>
                                    </div>
                                </div>

                                <PlaceActions
                                    placeId={place.id}
                                    placeName={place.name}
                                    placeCity={place.city}
                                    placeAddress={place.address}
                                    verificationStatus={place.verification_status}
                                    autoOpenClaim={autoOpenClaim}
                                />
                            </div>

                            {/* Claim Banner */}
                            {!isClaimed && (
                                <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm">Is this your restaurant?</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                Claim this listing to get verified, update details, and manage your business profile.
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="?claim=true"
                                        className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Claim Business
                                    </Link>
                                </div>
                            )}

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

                        <HalalTrustScore
                            status={place.verification_status}
                            halalVotes={reviews.filter(r => r.is_halal_confirmed).length}
                            reportCount={reviews.filter(r => r.is_non_halal_report && !r.is_dispute_resolved).length}
                            isDisputed={reviews.some(r => r.is_non_halal_report && r.is_dispute_resolved)}
                        />

                        <SafetyTransparency place={place as any} />

                        <PlaceReviews placeId={place.id} initialReviews={reviews} />
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
                                        [place.name, place.address, place.city].filter(Boolean).join(', ')
                                    )}`}
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
                                        href={`/halal-restaurants-${citySlugForUrl}`}
                                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs border border-emerald-100"
                                    >
                                        More Halal in {placeCity} <ChevronRight className="h-4 w-4" />
                                    </Link>
                                )}
                                {!isClaimed && (
                                    <Link
                                        href="?claim=true"
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 h-11 rounded-xl font-black flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest active:scale-95"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Own This? Claim It
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
