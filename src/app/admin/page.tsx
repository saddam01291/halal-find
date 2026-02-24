'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, ShieldCheck, Activity, Check, X, Search, Filter, MoreVertical, ExternalLink, Trash2, CheckCircle, AlertTriangle, RefreshCw, Database, MessageSquare, LogOut } from 'lucide-react';
import { getPendingVerifications, updateVerificationStatus, getProfiles, getPlaces, getSystemStats, getAdminSettings, updateAdminSettings, getDisputedReviews, resolveDispute } from '@/lib/api';
import { supabase, DbVerificationRequest, DbProfile, DbPlace, DbReview } from '@/lib/supabase';
import { formatDistanceToNow } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type TabType = 'overview' | 'restaurants' | 'users' | 'verifications' | 'disputes' | 'settings';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = (searchParams.get('tab') || 'overview') as TabType;

    const [verifications, setVerifications] = useState<DbVerificationRequest[]>([]);
    const [profiles, setProfiles] = useState<DbProfile[]>([]);
    const [places, setPlaces] = useState<DbPlace[]>([]);
    const [disputes, setDisputes] = useState<DbReview[]>([]);
    const [stats, setStats] = useState({ places: 0, users: 0, verifications: 0, traffic: 'Real-time' });
    const [loading, setLoading] = useState(true);

    // Settings state
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [autoApprove, setAutoApprove] = useState(true);
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [indexRebuilding, setIndexRebuilding] = useState(false);
    const [cacheClearing, setCacheClearing] = useState(false);

    const setActiveTab = (tab: TabType) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.push(`/admin?${params.toString()}`);
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [vData, pData, plData, sData, settingsData, dData] = await Promise.all([
                getPendingVerifications(),
                getProfiles(),
                getPlaces(),
                getSystemStats(),
                getAdminSettings(),
                getDisputedReviews()
            ]);
            setVerifications(vData);
            setProfiles(pData);
            setPlaces(plData);
            setStats(sData);
            setDisputes(dData);

            if (settingsData.maintenance_mode !== undefined) setMaintenanceMode(settingsData.maintenance_mode);
            if (settingsData.auto_approve !== undefined) setAutoApprove(settingsData.auto_approve);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (id: string, status: 'approved' | 'rejected') => {
        // Optimistic update: remove from list immediately
        setVerifications(prev => prev.filter(v => v.id !== id));
        setStats(prev => ({ ...prev, verifications: Math.max(0, prev.verifications - 1) }));
        try {
            await updateVerificationStatus(id, status);
        } catch (error) {
            console.error('Error updating verification:', error);
            // Revert on error
            loadData();
        }
    };

    const handleDeleteVerification = async (id: string) => {
        if (!confirm('Permanently delete this verification request?')) return;
        try {
            const { error } = await supabase
                .from('verification_requests')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setVerifications(prev => prev.filter(v => v.id !== id));
            setStats(prev => ({ ...prev, verifications: prev.verifications - 1 }));
        } catch (error) {
            console.error('Error deleting verification:', error);
            alert('Could not delete this request. Check your Supabase RLS policies.');
        }
    };

    const handleSaveSettings = async () => {
        try {
            await updateAdminSettings({
                maintenance_mode: maintenanceMode,
                auto_approve: autoApprove
            });
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        }
    };

    const handleRebuildIndex = async () => {
        setIndexRebuilding(true);
        await new Promise(r => setTimeout(r, 1800));
        setIndexRebuilding(false);
    };

    const handleClearCache = async () => {
        setCacheClearing(true);
        await new Promise(r => setTimeout(r, 1500));
        setCacheClearing(false);
    };

    const handleResolveDispute = async (id: string, note: string) => {
        try {
            await resolveDispute(id, note);
            setDisputes(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Error resolving dispute:', error);
            alert('Failed to resolve dispute');
        }
    };

    const VerificationCard = ({ req, onApprove, onReject, onDelete }: {
        req: DbVerificationRequest,
        onApprove: (id: string, status: 'approved') => void,
        onReject: (id: string, status: 'rejected') => void,
        onDelete: (id: string) => void
    }) => (
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 font-bold border border-slate-100">
                        {req.restaurant_name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{req.restaurant_name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">By {req.owner_name}</p>
                    </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" onClick={() => onDelete(req.id)} className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
                {req.type === 'claim' ? (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">Owner Claim</span>
                ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">Community</span>
                )}
                {req.certificate_url && (
                    <a href={req.certificate_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest bg-blue-50/50 px-2 py-1 rounded">
                        <ExternalLink className="h-2.5 w-2.5" /> {req.type === 'claim' ? 'Certificate' : 'Photo'}
                    </a>
                )}
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-auto self-center">
                    {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest h-9 rounded-lg shadow-sm" onClick={() => onApprove(req.id, 'approved')}>
                    <Check className="h-3 w-3 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-100 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest h-9 rounded-lg" onClick={() => onReject(req.id, 'rejected')}>
                    <X className="h-3 w-3 mr-1" /> Reject
                </Button>
            </div>
        </div>
    );

    const renderOverview = () => (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    onClick={() => setActiveTab('restaurants')}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-emerald-500 hover:shadow-lg transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Manage All</span>
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Restaurants</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.places}</p>
                </div>

                <div
                    onClick={() => setActiveTab('verifications')}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-amber-500 hover:shadow-lg transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        {stats.verifications > 0 && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full animate-pulse">{stats.verifications} Pending</span>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Verifications</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.verifications}</p>
                </div>

                <div
                    onClick={() => setActiveTab('users')}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">User Directory</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats.users}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                            <Activity className="h-6 w-6" />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            Live
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Sync Status</p>
                    <p className="text-xl font-black text-slate-900 mt-1">{stats.traffic}</p>
                </div>
            </div>

            {/* Verification Requests Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-slate-900">Recent Verification Requests</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Dual-lane triage: Ownership vs Community</p>
                    </div>
                    <Button variant="ghost" size="sm" className="font-bold text-emerald-600 hover:text-emerald-700" onClick={() => setActiveTab('verifications')}>View All Command Center</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-100">
                    {/* Claims Preview */}
                    <div className="p-0">
                        <div className="bg-slate-50/50 px-6 py-2 border-b border-slate-100">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ownership Claims</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {verifications.filter(v => v.type === 'claim').length === 0 ? (
                                <div className="p-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">No claims</div>
                            ) : (
                                verifications.filter(v => v.type === 'claim').slice(0, 3).map((req) => (
                                    <div key={req.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">{req.restaurant_name.charAt(0)}</div>
                                            <span className="text-xs font-bold text-slate-800">{req.restaurant_name}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="sm" className="h-7 px-2 text-[9px] bg-emerald-600 font-black uppercase" onClick={() => handleVerification(req.id, 'approved')}>Ok</Button>
                                            <Button size="sm" variant="outline" className="h-7 px-2 text-[9px] text-red-500 border-red-100 font-black uppercase" onClick={() => handleVerification(req.id, 'rejected')}>X</Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Community Preview */}
                    <div className="p-0">
                        <div className="bg-slate-50/50 px-6 py-2 border-b border-slate-100">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Community Additions</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {verifications.filter(v => v.type !== 'claim').length === 0 ? (
                                <div className="p-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">No additions</div>
                            ) : (
                                verifications.filter(v => v.type !== 'claim').slice(0, 3).map((req) => (
                                    <div key={req.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-amber-100 flex items-center justify-center text-amber-600 text-[10px] font-bold">{req.restaurant_name.charAt(0)}</div>
                                            <span className="text-xs font-bold text-slate-800">{req.restaurant_name}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="sm" className="h-7 px-2 text-[9px] bg-emerald-600 font-black uppercase" onClick={() => handleVerification(req.id, 'approved')}>Ok</Button>
                                            <Button size="sm" variant="outline" className="h-7 px-2 text-[9px] text-red-500 border-red-100 font-black uppercase" onClick={() => handleVerification(req.id, 'rejected')}>X</Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Direct Access Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all" onClick={() => setActiveTab('users')}>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Manage Users</p>
                            <p className="text-xs text-slate-500">Access all {stats.users} user profiles</p>
                        </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 flex items-center justify-between group cursor-pointer hover:border-emerald-500 transition-all" onClick={() => setActiveTab('restaurants')}>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Audit Restaurants</p>
                            <p className="text-xs text-slate-500">View all {stats.places} global entries</p>
                        </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
            </div>
        </div>
    );

    const renderDisputes = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mx-auto max-w-5xl">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30">
                <h2 className="font-black text-xl text-slate-900 uppercase">Community Disputes</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Handle {disputes.length} reports of non-halal data</p>
            </div>
            <div className="divide-y divide-slate-100">
                {disputes.length === 0 ? (
                    <div className="py-20 text-center">
                        <MessageSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No active disputes</p>
                    </div>
                ) : (
                    disputes.map((dispute) => (
                        <div key={dispute.id} className="p-6 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{dispute.user_name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Reported on {new Date(dispute.created_at).toLocaleDateString()}</p>
                                        <div className="mt-3 p-3 bg-white border border-slate-100 rounded-xl text-sm italic text-slate-600">
                                            "{dispute.comment}"
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 min-w-[120px]">
                                    <Button size="sm" className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest h-10" onClick={() => handleResolveDispute(dispute.id, 'Acknowledged and verified.')}>Resolve</Button>
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest h-10">Delete Review</Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mx-auto max-w-7xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div>
                    <h2 className="font-black text-xl text-slate-900">User Directory</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Displaying {profiles.length} total users</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search by name or email..." className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all w-64" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">User Details</th>
                            <th className="px-6 py-4">Security Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Registration Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {profiles.length === 0 ? (
                            <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No users found.</td></tr>
                        ) : (
                            profiles.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold uppercase text-xs">
                                                        {user.full_name?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-none">{user.full_name || 'Anonymous User'}</p>
                                                <p className="text-[10px] text-slate-400 font-mono mt-1">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Now
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                        {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-200 transition-colors"><MoreVertical className="h-4 w-4" /></Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderRestaurants = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mx-auto max-w-7xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div>
                    <h2 className="font-black text-xl text-slate-900">Total Restaurants</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Audit and manage {places.length} global entries</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 h-10 border-slate-200 rounded-xl font-bold px-4 hover:bg-slate-50 transition-all"><Filter className="h-4 w-4" /> Advanced Filter</Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Brand &amp; Cuisine</th>
                            <th className="px-6 py-4">Geography</th>
                            <th className="px-6 py-4">Trust Status</th>
                            <th className="px-6 py-4">Community Rating</th>
                            <th className="px-6 py-4 text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {places.length === 0 ? (
                            <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No restaurants in database.</td></tr>
                        ) : (
                            places.map((place) => (
                                <tr key={place.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm relative group">
                                                {place.image ? (
                                                    <img src={place.image} alt={place.name} className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-400"><Building2 className="h-5 w-5" /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{place.name}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{place.cuisine}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-800 font-bold">{place.city}</span>
                                            <span className="text-[10px] text-slate-400 truncate max-w-[180px] font-medium">{place.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {place.verified ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                                <Check className="h-3 w-3" /> Certified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                                                Community
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm">
                                            <span className="text-amber-500 text-lg leading-none">★</span> {place.rating?.toFixed(1) ?? '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/place/${place.id}`} target="_blank" className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-emerald-600 font-black uppercase tracking-widest transition-colors">
                                            Preview Item <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Maintenance Mode Warning Banner */}
            {maintenanceMode && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <div>
                        <p className="font-black text-sm uppercase tracking-wider">Maintenance Mode Is Active</p>
                        <p className="text-xs font-medium mt-0.5">The site is currently restricted to admins only. Turn this off when ready.</p>
                    </div>
                </div>
            )}

            {/* Auto-Approve Warning */}
            {!autoApprove && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700">
                    <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                    <div>
                        <p className="font-black text-sm uppercase tracking-wider">Manual Review Mode Active</p>
                        <p className="text-xs font-medium mt-0.5">All new restaurant submissions require admin approval before going live.</p>
                    </div>
                </div>
            )}

            {/* Saved confirmation */}
            {settingsSaved && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 animate-in fade-in duration-300">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="font-black text-sm uppercase tracking-wider">Configuration saved successfully!</p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30">
                    <h2 className="font-black text-xl text-slate-900">Platform Settings</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Global configuration and feature flags</p>
                </div>
                <div className="p-8 space-y-8">
                    {/* General Settings */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">General Settings</h3>
                        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${maintenanceMode ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                            <div>
                                <p className={`text-sm font-bold ${maintenanceMode ? 'text-red-700' : 'text-slate-900'}`}>Maintenance Mode</p>
                                <p className={`text-xs ${maintenanceMode ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                                    {maintenanceMode ? '⚠️ ACTIVE — Site is restricted to admins only' : 'Restrict site access for system updates'}
                                </p>
                            </div>
                            <button
                                onClick={() => setMaintenanceMode(!maintenanceMode)}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${maintenanceMode ? 'bg-red-500' : 'bg-slate-200'}`}
                                aria-label="Toggle maintenance mode"
                            >
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-all duration-300 ${maintenanceMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Security & Verification */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Security &amp; Verification</h3>
                        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${!autoApprove ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                            <div>
                                <p className={`text-sm font-bold ${!autoApprove ? 'text-amber-700' : 'text-slate-900'}`}>Auto-Approve Community Submissions</p>
                                <p className={`text-xs ${!autoApprove ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                                    {!autoApprove ? '🔒 MANUAL REVIEW — All submissions need admin approval' : 'Allow users to add places without admin review'}
                                </p>
                            </div>
                            <button
                                onClick={() => setAutoApprove(!autoApprove)}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${autoApprove ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                aria-label="Toggle auto-approve"
                            >
                                <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-all duration-300 ${autoApprove ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* System Management */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">System Management</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleRebuildIndex}
                                disabled={indexRebuilding}
                                className="h-14 font-black uppercase text-[10px] tracking-widest border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {indexRebuilding ? (
                                    <><RefreshCw className="h-4 w-4 animate-spin" /> Rebuilding...</>
                                ) : (
                                    <><Database className="h-4 w-4" /> Rebuild Search Index</>
                                )}
                            </button>
                            <button
                                onClick={handleClearCache}
                                disabled={cacheClearing}
                                className="h-14 font-black uppercase text-[10px] tracking-widest border-2 border-slate-200 hover:border-red-500 hover:text-red-600 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {cacheClearing ? (
                                    <><RefreshCw className="h-4 w-4 animate-spin" /> Clearing...</>
                                ) : (
                                    <><X className="h-4 w-4" /> Clear Core Cache</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            className="bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all"
                            onClick={handleSaveSettings}
                        >
                            Save Platform Configuration
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 p-2 bg-white/40 rounded-3xl border border-white/60 backdrop-blur-sm">
                <div className="p-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Admin Console</h1>
                    <p className="inline-block bg-red-600 text-white px-3 py-1 rounded-full mt-2 font-bold text-[9px] uppercase tracking-widest animate-pulse">VER 2.0: NEW INTERFACE LOADED ✅</p>
                </div>
                <div className="p-4 flex gap-2 w-full sm:w-auto">
                    <Button
                        onClick={() => router.push('/')}
                        variant="ghost"
                        size="sm"
                        className="h-12 w-full sm:w-auto text-slate-400 hover:text-slate-900 font-bold uppercase text-[10px] tracking-widest px-6 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <LogOut className="h-4 w-4" /> Back to Site
                    </Button>
                    <Button
                        onClick={loadData}
                        variant="outline"
                        size="sm"
                        className="h-12 w-full sm:w-auto border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all font-black uppercase text-[10px] tracking-widest px-6 rounded-xl"
                    >
                        Force Cloud Sync
                    </Button>
                </div>
            </div>


            {/* Content Rendering */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <div className="h-16 w-16 border-[6px] border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                    <p className="text-slate-900 font-black uppercase tracking-widest text-sm animate-pulse">Syncing Planetary Database...</p>
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'restaurants' && renderRestaurants()}
                    {activeTab === 'verifications' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                <div>
                                    <h2 className="font-black text-xl text-slate-900 uppercase tracking-tight">Verification Command Center</h2>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Dual-lane processing for Claims and Submissions</p>
                                </div>
                                {verifications.length > 0 && (
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full animate-pulse">
                                        {verifications.length} Tasks
                                    </span>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {/* Column 1: Ownership Claims */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Business Ownership Claims</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {verifications.filter(v => v.type === 'claim').length === 0 ? (
                                                <p className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No pending claims</p>
                                            ) : (
                                                verifications.filter(v => v.type === 'claim').map((req) => (
                                                    <VerificationCard key={req.id} req={req} onApprove={handleVerification} onReject={handleVerification} onDelete={handleDeleteVerification} />
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 2: New Submissions */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">New Place Additions</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {verifications.filter(v => v.type !== 'claim').length === 0 ? (
                                                <p className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No new additions</p>
                                            ) : (
                                                verifications.filter(v => v.type !== 'claim').map((req) => (
                                                    <VerificationCard key={req.id} req={req} onApprove={handleVerification} onReject={handleVerification} onDelete={handleDeleteVerification} />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'disputes' && renderDisputes()}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            )}
        </div>
    );
}
