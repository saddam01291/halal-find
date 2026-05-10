import { getCityPageBySlug, getPlacesByCity, getAllCitySlugsForSitemap } from '@/lib/api-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, ChevronRight, ChevronDown, ShieldCheck, Utensils, Users, ArrowRight, Home } from 'lucide-react';
import { getValidImageUrl } from '@/lib/utils';
import { Metadata, ResolvingMetadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate every 24 hours

export async function generateMetadata(
    { params }: { params: Promise<{ citySlug: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { citySlug } = await params;
    const slug = citySlug.replace('halal-restaurants-', '');
    const cityPage = await getCityPageBySlug(slug);

    if (!cityPage) {
        return { title: 'City Not Found | FindHalal' };
    }

    const title = `${cityPage.city_name} Halal Restaurants – Verified & Trusted | FindHalal`;
    const description = `Find ${cityPage.restaurant_count} verified halal restaurants in ${cityPage.city_name}. Community reviewed, owner certified. Browse the best halal spots near you.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://findhalalonly.com/halal-restaurants-${slug}`,
            siteName: 'Find Halal',
            type: 'website',
        },
        alternates: {
            canonical: `https://findhalalonly.com/halal-restaurants-${slug}`,
        }
    };
}

export async function generateStaticParams() {
    const citySlugs = await getAllCitySlugsForSitemap();
    return citySlugs
        .filter(city => city.city_slug && city.city_slug.length > 0 && city.city_slug !== '-')
        .map((city) => ({
            citySlug: `halal-restaurants-${city.city_slug}`,
        }));
}

export default async function CityPage({ params }: { params: Promise<{ citySlug: string }> }) {
    const { citySlug } = await params;

    // Only handle slugs that start with 'halal-restaurants-'
    if (!citySlug.startsWith('halal-restaurants-')) {
        notFound();
    }

    const slug = citySlug.replace('halal-restaurants-', '');
    const cityPage = await getCityPageBySlug(slug);

    if (!cityPage) {
        notFound();
    }

    const restaurants = await getPlacesByCity(cityPage.city_name);

    // LocalBusiness Schema (List)
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Halal Restaurants in ${cityPage.city_name}`,
        description: `Top-rated and verified halal restaurants in ${cityPage.city_name}`,
        itemListElement: restaurants.slice(0, 10).map((place, index) => {
            const slugBase = `${place.name || 'restaurant'} ${place.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const slug = `${slugBase}-${place.id}`;
            return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Restaurant',
                name: place.name,
                url: `https://findhalalonly.com/restaurant/${slug}`,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: place.address || '',
                    addressLocality: cityPage.city_name,
                    addressCountry: 'IN'
                }
            }
        };
        })
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
                item: 'https://findhalalonly.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: `Halal Restaurants in ${cityPage.city_name}`,
                item: `https://findhalalonly.com/halal-restaurants-${slug}`
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-white font-bold">Halal Restaurants in {cityPage.city_name}</span>
                    </nav>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                                {cityPage.restaurant_count} Verified Restaurants
                            </span>
                            {cityPage.state && (
                                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 px-3 py-1.5 rounded-full text-xs font-bold">
                                    {cityPage.state}, {cityPage.country}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
                            Best Halal Restaurants in{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-300">
                                {cityPage.city_name}
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
                            Discover {cityPage.restaurant_count} community-verified Halal restaurants in {cityPage.city_name}. Rated {cityPage.avg_rating}/5 average. Find trusted Halal food near you.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                            <div className="text-2xl font-bold text-emerald-300">{cityPage.restaurant_count}</div>
                            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">Restaurants</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                            <div className="text-2xl font-bold text-amber-300">{cityPage.avg_rating}</div>
                            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">Avg Rating</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                            <div className="text-2xl font-bold text-white">{cityPage.top_cuisines?.length || 0}</div>
                            <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">Cuisines</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cuisine Tags */}
            {cityPage.top_cuisines && cityPage.top_cuisines.length > 0 && (
                <section className="bg-white border-b border-slate-100 py-6">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5">
                                <Utensils className="h-3 w-3" /> Popular Cuisines
                            </span>
                            {cityPage.top_cuisines.map((cuisine: string) => (
                                <span key={cuisine} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 whitespace-nowrap">
                                    {cuisine}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="container mx-auto px-4 py-12 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* AI Intro Section */}
                        {cityPage.ai_intro ? (
                            <article className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    Community Insights: Halal Dining in {cityPage.city_name}
                                </h2>
                                <div className="prose prose-slate prose-lg max-w-none leading-relaxed">
                                    {cityPage.ai_intro.split('\n').filter(Boolean).map((paragraph: string, i: number) => (
                                        <p key={i} className="text-slate-600 leading-[1.8]"
                                           dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>') }}
                                        />
                                    ))}
                                </div>
                            </article>
                        ) : (
                            <article className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    Finding Halal Food in {cityPage.city_name}
                                </h2>
                                <div className="prose prose-slate prose-lg max-w-none leading-relaxed space-y-4">
                                    <p className="text-slate-600 leading-[1.8]">
                                        Discovering verified <strong>halal restaurants in {cityPage.city_name}</strong> has never been easier. 
                                        As the community grows, we are seeing a significant increase in the number of dining spots catering to halal dietary requirements. 
                                        From traditional cuisines to modern fusion, the <strong>{cityPage.city_name}</strong> food scene offers a diverse range of options for local residents and visitors alike.
                                    </p>
                                    <p className="text-slate-600 leading-[1.8]">
                                        At FindHalal, we prioritize transparency. Every listing in our <strong>{cityPage.city_name} halal directory</strong> is subject to community verification. 
                                        Whether you're looking for a quick bite or a fine dining experience, you can trust our platform to provide up-to-date information on halal status, 
                                        community ratings, and detailed reviews from fellow diners who share your values.
                                    </p>
                                    <p className="text-slate-600 leading-[1.8]">
                                        Explore our curated list of <strong>{cityPage.restaurant_count} verified spots</strong> below to find your next meal with confidence. 
                                        Don't forget to contribute back to the community by sharing your own experiences and photos!
                                    </p>
                                </div>
                            </article>
                        )}

                        {/* Restaurant Grid */}
                        <div>
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Top Rated Halal Restaurants</h2>
                                    <p className="text-sm text-slate-500 mt-1">Sorted by community rating and verification status</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-600">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span className="text-xs font-bold">Community Verified</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {restaurants.map((place, index) => {
                                    const slugBase = `${place.name || 'restaurant'} ${place.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                                    const slug = `${slugBase}-${place.id}`;
                                    return (
                                    <Link href={`/restaurant/${slug}`} key={place.id} className="group">
                                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1">
                                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                                <Image
                                                    src={getValidImageUrl(place.image, place.id, place.name, place.cuisine)}
                                                    alt={`${place.name} - Halal Restaurant in ${cityPage.city_name}`}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 50vw"
                                                    className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                                                    priority={index < 4}
                                                />
                                                {place.verified && (
                                                    <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                                        <ShieldCheck className="h-3 w-3" /> Verified
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{place.name}</h3>
                                                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-100">
                                                        {place.rating || 0} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400 mb-3">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="text-xs font-bold truncate">{place.address || cityPage.city_name}</span>
                                                </div>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-lg border border-emerald-100 font-bold uppercase tracking-wider">
                                                        {place.cuisine || 'Halal'}
                                                    </span>
                                                    {place.halal_status && (
                                                        <span className="text-[9px] bg-slate-50 text-slate-500 px-2.5 py-1.5 rounded-lg border border-slate-100 font-bold uppercase tracking-wider">
                                                            {place.halal_status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    );
                                })}
                            </div>

                            {restaurants.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                    <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-bold">No restaurants listed yet in {cityPage.city_name}</p>
                                    <p className="text-xs text-slate-400 mt-1">Be the first to add one!</p>
                                </div>
                            )}
                        </div>

                        {/* FAQ Section */}
                        {(() => {
                            const faqs = (cityPage.ai_faq && cityPage.ai_faq.length > 0) ? cityPage.ai_faq : [
                                {
                                    q: `Are there many halal restaurants in ${cityPage.city_name}?`,
                                    a: `Yes, ${cityPage.city_name} has a growing number of halal options. Currently, we have ${cityPage.restaurant_count} verified halal restaurants listed in our directory, covering various cuisines and price ranges.`
                                },
                                {
                                    q: `How do you verify the halal status of restaurants in ${cityPage.city_name}?`,
                                    a: `We use a community-driven verification process. Users can report halal status, upload photos of certifications, and provide detailed reviews. Our "Halal Trust Score" helps you understand the reliability of each listing.`
                                },
                                {
                                    q: `What are the most popular halal cuisines in ${cityPage.city_name}?`,
                                    a: `Based on our data, ${cityPage.top_cuisines?.slice(0, 3).join(', ') || 'various cuisines'} are highly popular among the halal dining community in ${cityPage.city_name}.`
                                }
                            ];

                            return (
                                <section className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-8">
                                        Frequently Asked Questions about Halal Food in {cityPage.city_name}
                                    </h2>
                                    <div className="space-y-6">
                                        {faqs.map((faq: { q: string; a: string }, i: number) => (
                                            <details key={i} className="group border border-slate-100 rounded-2xl overflow-hidden" open={i === 0}>
                                                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                                                    <h3 className="font-bold text-slate-900 pr-4">{faq.q}</h3>
                                                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                                                </summary>
                                                <div className="px-5 pb-5">
                                                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </section>
                            );
                        })()}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Map Preview */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-slate-50">
                                <h3 className="font-bold text-slate-900">Halal Restaurants in {cityPage.city_name}</h3>
                                <p className="text-xs text-slate-400 mt-1">{cityPage.restaurant_count} verified spots</p>
                            </div>
                            <div className="h-56 bg-slate-100 relative">
                                {restaurants[0]?.lat && restaurants[0]?.lng ? (
                                    <iframe
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${(restaurants[0].lng - 0.05).toFixed(4)}%2C${(restaurants[0].lat - 0.03).toFixed(4)}%2C${(restaurants[0].lng + 0.05).toFixed(4)}%2C${(restaurants[0].lat + 0.03).toFixed(4)}&layer=mapnik&marker=${restaurants[0].lat}%2C${restaurants[0].lng}`}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                        title={`Map of Halal restaurants in ${cityPage.city_name}`}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400">
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <Link
                                    href="/search"
                                    className="w-full bg-slate-900 hover:bg-black text-white px-6 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
                                >
                                    Explore Full Map <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Nearby Cities */}
                        {cityPage.nearby_cities && cityPage.nearby_cities.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Also Explore</h3>
                                <div className="space-y-3">
                                    {cityPage.nearby_cities.map((nc: { name: string; slug: string; count: number }) => {
                                        const cityLink = `/halal-restaurants-${nc.slug}`;
                                        return (
                                            <Link
                                                key={nc.slug}
                                                href={cityLink}
                                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                    <span className="font-bold text-slate-700 text-sm group-hover:text-emerald-600 transition-colors">{nc.name}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{nc.count}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
                            <h3 className="font-bold mb-2">Know a Halal spot in {cityPage.city_name}?</h3>
                            <p className="text-sm text-emerald-100 mb-4 leading-relaxed">Help the community by adding restaurants you trust.</p>
                            <Link
                                href="/"
                                className="w-full bg-white text-emerald-700 px-6 h-10 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-emerald-50 transition-colors"
                            >
                                Add a Restaurant
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
