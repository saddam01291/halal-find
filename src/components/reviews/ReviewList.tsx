'use client';

import { useEffect, useState } from 'react';
import { Star, ShieldCheck, AlertTriangle, CheckCircle, Pencil, Trash2, X, Save } from 'lucide-react';
import { getReviewsForPlace, updateReview, deleteReview } from '@/lib/api';
import { DbReview } from '@/lib/supabase';
import { formatDistanceToNow } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function ReviewList({ placeId }: { placeId: string }) {
    const [reviews, setReviews] = useState<DbReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');
    const [editHoverRating, setEditHoverRating] = useState(0);
    const [editHalalConfirmed, setEditHalalConfirmed] = useState(false);
    const [editNonHalalReport, setEditNonHalalReport] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { user } = useAuth();

    const isAdmin = user?.role === 'admin';

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

    const startEdit = (review: DbReview) => {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment || '');
        setEditHalalConfirmed(review.is_halal_confirmed || false);
        setEditNonHalalReport(review.is_non_halal_report || false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRating(0);
        setEditComment('');
        setEditHalalConfirmed(false);
        setEditNonHalalReport(false);
    };

    const handleSaveEdit = async (reviewId: string) => {
        setSaving(true);
        try {
            const updated = await updateReview(reviewId, {
                rating: editRating,
                comment: editComment,
                is_halal_confirmed: editHalalConfirmed,
                is_non_halal_report: editNonHalalReport
            });
            setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ...updated } : r));
            cancelEdit();
        } catch (error) {
            console.error('Error updating review:', error);
            alert('Failed to update review. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review? This cannot be undone.')) return;
        
        setDeletingId(reviewId);
        try {
            await deleteReview(reviewId);
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const canEditReview = (review: DbReview) => {
        if (!user) return false;
        return user.id === review.user_id || isAdmin;
    };

    const canDeleteReview = (review: DbReview) => {
        if (!user) return false;
        return user.id === review.user_id || isAdmin;
    };

    if (loading) return <div className="text-center text-gray-500 py-4">Loading reviews...</div>;

    if (reviews.length === 0) return <div className="text-center text-gray-500 py-4">No reviews yet. Be the first!</div>;

    return (
        <div className="space-y-4 sm:space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className={`border-b border-gray-100 pb-4 sm:pb-6 last:border-0 ${review.is_non_halal_report && !review.is_dispute_resolved ? 'bg-red-50/50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-3 sm:py-4 rounded-lg border-red-100' : ''
                    }`}>

                    {/* === EDIT MODE === */}
                    {editingId === review.id ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Edit Review</h4>
                                <button onClick={cancelEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Rating Edit */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="focus:outline-none transition-transform hover:scale-110"
                                            onMouseEnter={() => setEditHoverRating(star)}
                                            onMouseLeave={() => setEditHoverRating(0)}
                                            onClick={() => setEditRating(star)}
                                        >
                                            <Star
                                                className={`h-6 w-6 ${star <= (editHoverRating || editRating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Halal Checkboxes */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${editHalalConfirmed ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                                    <input type="checkbox" checked={editHalalConfirmed} onChange={(e) => { setEditHalalConfirmed(e.target.checked); if (e.target.checked) setEditNonHalalReport(false); }} className="rounded border-slate-300 text-emerald-600" />
                                    Halal Confirmed ✅
                                </label>
                                <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${editNonHalalReport ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                                    <input type="checkbox" checked={editNonHalalReport} onChange={(e) => { setEditNonHalalReport(e.target.checked); if (e.target.checked) setEditHalalConfirmed(false); }} className="rounded border-slate-300 text-amber-600" />
                                    Non-Halal Report ⚠️
                                </label>
                            </div>

                            {/* Comment Edit */}
                            <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 resize-none bg-white"
                                placeholder="Update your review..."
                            />

                            {/* Save / Cancel */}
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="ghost" size="sm" onClick={cancelEdit} className="text-slate-500">
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={saving || editRating === 0}
                                    onClick={() => handleSaveEdit(review.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* === VIEW MODE === */
                        <>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {review.user_avatar ? (
                                        <img src={review.user_avatar} alt={review.user_name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
                                    ) : (
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                                            {review.user_name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{review.user_name}</h4>
                                        <span className="text-[10px] sm:text-xs text-gray-400">
                                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {canEditReview(review) && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => startEdit(review)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"
                                            title="Edit review"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        {canDeleteReview(review) && (
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                disabled={deletingId === review.id}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                title="Delete review"
                                            >
                                                <Trash2 className={`h-3.5 w-3.5 ${deletingId === review.id ? 'animate-spin' : ''}`} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                {review.is_halal_confirmed && (
                                    <div className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] sm:text-[10px] font-bold border border-emerald-100 uppercase tracking-wide">
                                        <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        Halal Confirmed
                                    </div>
                                )}

                                {review.is_non_halal_report && (
                                    <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border uppercase tracking-wide ${review.is_dispute_resolved
                                        ? 'bg-gray-100 text-gray-600 border-gray-200'
                                        : 'bg-red-600 text-white border-red-700'
                                        }`}>
                                        <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        {review.is_dispute_resolved ? 'Resolved Report' : 'Non-Halal Warning'}
                                    </div>
                                )}
                            </div>

                            <p className={`text-sm sm:text-base font-medium ${review.is_non_halal_report && !review.is_dispute_resolved ? 'text-red-700' : 'text-gray-600'}`}>
                                {review.comment}
                            </p>

                            {review.is_dispute_resolved && review.resolution_note && (
                                <div className="mt-3 p-2.5 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-xs">
                                        <span className="font-bold text-emerald-800">Admin Resolution:</span>
                                        <p className="text-emerald-700 mt-0.5">{review.resolution_note}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
