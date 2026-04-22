'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function PlaceReviews({ placeId }: { placeId: string }) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const { user } = useAuth();

    return (
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Community Reviews</h2>
                <Button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className={cn(
                        "rounded-xl font-bold transition-all",
                        showReviewForm ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                    )}
                >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </Button>
            </div>

            {showReviewForm && (
                <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 animate-in fade-in slide-in-from-top-4">
                    {user ? (
                        <ReviewForm 
                            placeId={placeId} 
                            onCancel={() => setShowReviewForm(false)} 
                            onSubmit={() => {
                                setShowReviewForm(false);
                                window.location.reload(); 
                            }}
                        />
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-slate-500 font-bold mb-4">Please sign in to share your experience with the community.</p>
                            <Link href="/auth">
                                <Button className="bg-slate-900 text-white px-8 rounded-xl h-11">Sign In</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <ReviewList placeId={placeId} />
        </div>
    );
}
