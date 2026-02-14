'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, ShieldCheck, Activity, Check, X } from 'lucide-react';
import { getPendingVerifications, updateVerificationStatus } from '@/lib/api';
import { DbVerificationRequest } from '@/lib/supabase';
import { formatDistanceToNow } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
    const [verifications, setVerifications] = useState<DbVerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        try {
            const data = await getPendingVerifications();
            setVerifications(data);
        } catch (error) {
            console.error('Error fetching verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await updateVerificationStatus(id, status);
            // Refresh list
            fetchVerifications();
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Failed to update verification status');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Places</p>
                    <p className="text-3xl font-bold text-slate-900">1,248</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Action Req.</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Pending Verifications</p>
                    <p className="text-3xl font-bold text-slate-900">{verifications.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+5%</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Active Users</p>
                    <p className="text-3xl font-bold text-slate-900">8,502</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <Activity className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">+24%</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Platform Traffic</p>
                    <p className="text-3xl font-bold text-slate-900">45k</p>
                </div>
            </div>

            {/* Verification Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">Pending Verification Requests</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-6 text-center text-slate-500">Loading requests...</div>
                    ) : verifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">No pending verification requests.</div>
                    ) : (
                        verifications.map((req) => (
                            <div key={req.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">Request for Place ID: {req.place_id}</p>
                                    <p className="text-xs text-slate-500">
                                        Submitted {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })} by {req.user_id}
                                    </p>
                                    <div className="mt-1">
                                        <a href={req.document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                            View Document
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 px-3"
                                        onClick={() => handleVerification(req.id, 'approved')}
                                    >
                                        <Check className="h-3 w-3 mr-1" /> Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-3"
                                        onClick={() => handleVerification(req.id, 'rejected')}
                                    >
                                        <X className="h-3 w-3 mr-1" /> Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Recent Activity (Mock for now or could be real log) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">Recent Activity</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                                SYS
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">System check completed</p>
                                <p className="text-xs text-slate-500">1 hour ago</p>
                            </div>
                            <span className="text-xs text-slate-400">View</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
