import { useEffect, useState } from 'react';
import { Star, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
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
                <div key={review.id} className={`border-b border-gray-100 pb-6 last:border-0 ${review.is_non_halal_report && !review.is_dispute_resolved ? 'bg-red-50/50 -mx-4 px-4 py-4 rounded-lg border-red-100' : ''
                    }`}>
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

                    <div className="flex flex-wrap gap-2 mb-3">
                        {review.is_halal_confirmed && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 uppercase tracking-wide">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Halal Confirmed
                            </div>
                        )}

                        {review.is_non_halal_report && (
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${review.is_dispute_resolved
                                ? 'bg-gray-100 text-gray-600 border-gray-200'
                                : 'bg-red-600 text-white border-red-700'
                                }`}>
                                <AlertTriangle className="h-3.5 w-3.5" />
                                {review.is_dispute_resolved ? 'Resolved Report' : 'Non-Halal Warning'}
                            </div>
                        )}
                    </div>

                    <p className={`font-medium ${review.is_non_halal_report && !review.is_dispute_resolved ? 'text-red-700' : 'text-gray-600'}`}>
                        {review.comment}
                    </p>

                    {review.is_dispute_resolved && review.resolution_note && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <span className="font-bold text-emerald-800">Admin Resolution:</span>
                                <p className="text-emerald-700 mt-0.5">{review.resolution_note}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
