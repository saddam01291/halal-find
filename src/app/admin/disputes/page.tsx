'use client';

import { useEffect, useState } from 'react';
import { getDisputedReviews, resolveDispute } from '@/lib/api';
import { DbReview } from '@/lib/supabase';
import { AlertTriangle, CheckCircle, MessageSquare, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDistanceToNow } from '@/lib/utils';

export default function DisputesPage() {
    const [disputes, setDisputes] = useState<DbReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [resNote, setResNote] = useState('');

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        setLoading(true);
        const data = await getDisputedReviews();
        setDisputes(data);
        setLoading(false);
    };

    const handleResolve = async (id: string) => {
        if (!resNote.trim()) {
            alert('Please provide a resolution note (e.g., "Owner provided new certificate")');
            return;
        }

        try {
            await resolveDispute(id, resNote);
            setResNote('');
            setResolvingId(null);
            fetchDisputes();
        } catch (error) {
            console.error(error);
            alert('Failed to resolve dispute');
        }
    };

    if (loading) return <div className="text-slate-500">Loading active disputes...</div>;

    return (
        <div className="max-w-4xl">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="text-red-600" />
                    Halal Status Disputes
                </h1>
                <p className="text-slate-500 mt-1">Review and manage reports regarding restaurants that have stopped serving Halal food.</p>
            </header>

            {disputes.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No active disputes</h3>
                    <p className="text-slate-500 mt-2">All safety reports have been reviewed and resolved. Great job!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {disputes.map((dispute) => (
                        <div key={dispute.id} className="bg-white border border-red-100 rounded-xl shadow-sm overflow-hidden border-l-4 border-l-red-600">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">Reported Place ID: {dispute.place_id}</h3>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> By {dispute.user_name}</span>
                                                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDistanceToNow(new Date(dispute.created_at), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">High Priority</span>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg flex gap-3 mb-6">
                                    <MessageSquare className="h-5 w-5 text-slate-400 mt-1 flex-shrink-0" />
                                    <p className="text-slate-700 font-medium italic">"{dispute.comment}"</p>
                                </div>

                                {resolvingId === dispute.id ? (
                                    <div className="space-y-4 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Resolution Note (Publicly visible)</label>
                                            <textarea
                                                className="w-full rounded-md border border-slate-200 p-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                                rows={3}
                                                placeholder="e.g., We verified with the owner, they shared a new certificate valid until 2026."
                                                value={resNote}
                                                onChange={(e) => setResNote(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="ghost" size="sm" onClick={() => setResolvingId(null)}>Cancel</Button>
                                            <Button size="sm" onClick={() => handleResolve(dispute.id)}>Confirm Resolution</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end border-t border-slate-100 pt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                            onClick={() => setResolvingId(dispute.id)}
                                        >
                                            Resolve this dispute
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
