// src/app/restaurant/[slug]/page.tsx
// Permanent 301 redirect: /restaurant/{name-city-id} -> /{city}/{name-id}
import { redirect } from 'next/navigation';
import { getPlaceByIdServer } from '@/lib/api-server';
import { buildRestaurantUrl } from '@/lib/utils';

function extractIdFromSlug(slug: string): string | null {
    const match = slug.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/i);
    return match ? match[1] : slug;
}

export default async function OldRestaurantRedirect({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const id = extractIdFromSlug(slug);

    if (id) {
        const place = await getPlaceByIdServer(id);
        if (place) {
            redirect(buildRestaurantUrl(place.city, place.slug));
        }
    }

    redirect('/search');
}