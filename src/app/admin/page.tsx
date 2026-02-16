'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, ShieldCheck, Activity, Check, X, Search, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { getPendingVerifications, updateVerificationStatus, getProfiles, getPlaces, getSystemStats } from '@/lib/api';
import { DbVerificationRequest, DbProfile, DbPlace } from '@/lib/supabase';
import { formatDistanceToNow } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type TabType = 'overview' | 'restaurants' | 'users' | 'verifications';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [verifications, setVerifications] = useState<DbVerificationRequest[]>([]);
    const [profiles, setProfiles] = useState<DbProfile[]>([]);
    const [places, setPlaces] = useState<DbPlace[]>([]);
    const [stats, setStats] = useState({ places: 0, users: 0, verifications: 0, traffic: '45k' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();

        // Expose tab control to window for sidebar interaction
        (window as any)._setActiveTab = (tab: TabType) => setActiveTab(tab);
        return () => { delete (window as any)._setActiveTab; };
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [vData, pData, plData, sData] = await Promise.all([
                getPendingVerifications(),
                getProfiles(),
                getPlaces(),
                getSystemStats()
            ]);
            setVerifications(vData);
            setProfiles(pData);
            setPlaces(plData);
            setStats(sData);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await updateVerificationStatus(id, status);
            loadData();
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Failed to update verification status');
        }
    };

    const renderOverview = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Places</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.places}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        {stats.verifications > 0 && (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{stats.verifications} Pending</span>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Verification Req.</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.verifications}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.users}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Monthly High</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.traffic}</p>
                </div>
            </div>

            {/* Verification Requests Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-slate-900">Recent Verification Requests</h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('verifications')}>View All</Button>
                </div>
                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-6 text-center text-slate-500">Loading requests...</div>
                    ) : verifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">No pending verification requests.</div>
                    ) : (
                        verifications.slice(0, 5).map((req) => (
                            <div key={req.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{req.restaurant_name}</p>
                                    <p className="text-xs text-slate-500">
                                        by {req.owner_name} • {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="bg-emerald-600 text-white h-8" onClick={() => handleVerification(req.id, 'approved')}>Approve</Button>
                                    <Button size="sm" variant="outline" className="text-red-600 h-8" onClick={() => handleVerification(req.id, 'rejected')}>Reject</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );

    const renderUsers = () => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mx-auto max-w-7xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-bold text-slate-900">Registered Users ({profiles.length})</h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {profiles.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold uppercase text-xs">
                                                    {user.full_name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{user.full_name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{user.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderRestaurants = () => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mx-auto max-w-7xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-bold text-slate-900">Total Restaurants ({places.length})</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 h-9 border-slate-200"><Filter className="h-4 w-4" /> Filter</Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Restaurant</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4 text-right">Preview</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {places.map((place) => (
                            <tr key={place.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm">
                                            {place.image ? (
                                                <img src={place.image} alt={place.name} className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-400"><Building2 className="h-5 w-5" /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{place.name}</p>
                                            <p className="text-xs text-slate-500">{place.cuisine}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-700 font-medium">{place.city}</span>
                                        <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{place.address}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {place.verified ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase">
                                            <Check className="h-2.5 w-2.5" /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold uppercase">
                                            Unverified
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
                                        <span className="text-amber-500">★</span> {place.rating.toFixed(1)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/place/${place.id}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                                        View Site <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Welcome back, manager. Here&apos;s your platform overview.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={loadData} variant="outline" size="sm" className="h-10 border-slate-200 hover:border-slate-300">Refresh Data</Button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 gap-8 bg-white/50 px-6 -mx-8 sticky top-0 backdrop-blur-md z-10 pt-4">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'overview' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Overview
                    {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('restaurants')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'restaurants' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Restaurants
                    {activeTab === 'restaurants' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'users' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Users
                    {activeTab === 'users' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('verifications')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'verifications' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Verifications
                    {activeTab === 'verifications' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
                </button>
            </div>

            {/* Content Rendering */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse">Syncing Database...</p>
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-2 duration-300">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'restaurants' && renderRestaurants()}
                    {activeTab === 'verifications' && (
                        /* Reuse the verifications UI but in a full container */
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="font-bold text-slate-900">All Verification Requests</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {verifications.length === 0 ? (
                                    <div className="p-6 text-center text-slate-500">No pending verification requests.</div>
                                ) : (
                                    verifications.map((req) => (
                                        <div key={req.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                                                <ShieldCheck className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-900">Request for: {req.restaurant_name}</p>
                                                <p className="text-xs text-slate-500">
                                                    Submitted {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })} by {req.user_id}
                                                </p>
                                                <div className="mt-1">
                                                    <a href={req.certificate_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                                        View Certificate
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="bg-emerald-600 text-white h-8 px-3" onClick={() => handleVerification(req.id, 'approved')}>Approve</Button>
                                                <Button size="sm" variant="outline" className="text-red-600 h-8 px-3" onClick={() => handleVerification(req.id, 'rejected')}>Reject</Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

import Link from 'next/link';
