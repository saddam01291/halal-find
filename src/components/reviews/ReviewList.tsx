import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { getReviewsForPlace } from '@/lib/api';
import { DbReview } from '@/lib/supabase';
import { formatDistanceToNow } from '@/lib/utils';

export function ReviewList({ placeId }: { placeId: string }) {
    const [reviews, setReviews] = useState<DbReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getReviewsForPlace(placeId);
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [placeId]);

    if (loading) return <div className="text-center text-gray-500">Loading reviews...</div>;

    if (reviews.length === 0) return <div className="text-center text-gray-500">No reviews yet. Be the first!</div>;

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {review.user_avatar ? (
                                <img src={review.user_avatar} alt={review.user_name} className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                    {review.user_name?.charAt(0) || 'U'}
                                </div>
                            )}
                            <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                        </div>
                        <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}
