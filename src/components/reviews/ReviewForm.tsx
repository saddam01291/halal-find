'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';
import { createReview } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { DbReview } from '@/lib/supabase';

export function ReviewForm({ placeId, onCancel, onSubmit }: { placeId: string; onCancel: () => void; onSubmit?: () => void }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();

    const [isHalalConfirmed, setIsHalalConfirmed] = useState(false);
    const [isNonHalalReport, setIsNonHalalReport] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please sign in to write a review');
            return;
        }

        setSubmitting(true);
        try {
            await createReview({
                place_id: placeId,
                rating,
                comment: review,
                user_id: user.id,
                is_halal_confirmed: isHalalConfirmed,
                is_non_halal_report: isNonHalalReport
            } as Omit<DbReview, 'id' | 'created_at' | 'user_name' | 'user_avatar'>);

            setReview('');
            setRating(0);
            setIsHalalConfirmed(false);
            setIsNonHalalReport(false);
            if (onSubmit) onSubmit();
        } catch (error) {
            console.error(error);
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`h-6 w-6 ${star <= (hoverRating || rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${isHalalConfirmed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 opacity-60 grayscale cursor-not-allowed'
                    } ${!isNonHalalReport ? 'opacity-100 grayscale-0 cursor-default' : ''}`}>
                    <input
                        type="checkbox"
                        id="confirm-halal"
                        disabled={isNonHalalReport}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                        checked={isHalalConfirmed}
                        onChange={(e) => setIsHalalConfirmed(e.target.checked)}
                    />
                    <label htmlFor="confirm-halal" className="text-sm font-medium text-gray-700 cursor-pointer">
                        I confirm this restaurant serves <span className="text-emerald-600 font-bold">100% Halal</span> food
                    </label>
                </div>

                <div className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${isNonHalalReport ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                    }`}>
                    <input
                        type="checkbox"
                        id="report-non-halal"
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        checked={isNonHalalReport}
                        onChange={(e) => {
                            setIsNonHalalReport(e.target.checked);
                            if (e.target.checked) setIsHalalConfirmed(false);
                        }}
                    />
                    <label htmlFor="report-non-halal" className="text-sm font-medium text-red-700 cursor-pointer">
                        <span className="font-bold underline">Report Warning:</span> This restaurant has <span className="font-bold">stopped</span> serving Halal meat
                    </label>
                </div>
            </div>

            <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                </label>
                <textarea
                    id="review"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder={isNonHalalReport ? "PLEASE PROVIDE DETAILS: Why are you reporting this as non-Halal?" : "Tell us about your experience..."}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                />
            </div>

            <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={submitting || rating === 0}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </div>
        </form>
    );
}
