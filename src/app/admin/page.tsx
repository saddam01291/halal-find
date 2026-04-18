'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, ShieldCheck, Activity, Check, X, Search, Filter, MoreVertical, ExternalLink, Trash2, CheckCircle, AlertTriangle, RefreshCw, Database, MessageSquare, LogOut, Pencil, Plus, Upload, Loader2, Save } from 'lucide-react';
import { getPendingVerifications, updateVerificationStatus, getProfiles, getPlaces, getAllPlacesAdmin, getSystemStats, getAdminSettings, updateAdminSettings, getDisputedReviews, resolveDispute, updatePlace, deletePlace, addPlaceAsAdmin, uploadImage, updateVerificationRequest, updateUserRole, deleteReview } from '@/lib/api';
import { EditPlaceModal } from '@/components/admin/EditPlaceModal';
import { supabase, DbVerificationRequest, DbProfile, DbPlace, DbReview } from '@/lib/supabase';
import { formatDistanceToNow } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type TabType = 'overview' | 'restaurants' | 'users' | 'verifications' | 'disputes' | 'settings';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function AdminDashboardContent() {
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

    // Restaurant management state
    const [restaurantSearch, setRestaurantSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [disputeSearch, setDisputeSearch] = useState('');
    const [editingPlace, setEditingPlace] = useState<DbPlace | null>(null);
    const [editingRequest, setEditingRequest] = useState<DbVerificationRequest | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSavingPlace, setIsSavingPlace] = useState(false);
    const [deletingPlaceId, setDeletingPlaceId] = useState<string | null>(null);
    const [addForm, setAddForm] = useState({
        name: '', cuisine: '', city: '', address: '',
        halal_status: 'Full Halal', serves_alcohol: false,
        halal_source: '', image: '',
        lat: 22.5726, lng: 88.3639, // Default to Kolkata as a placeholder
        tags: '',
    });
    const [addImageFile, setAddImageFile] = useState<File | null>(null);

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
                getAllPlacesAdmin(),
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
            // Refresh all stats so "Total Restaurants" and other counts are accurate
            loadData();
        } catch (error: any) {
            console.error('Error updating verification:', error);
            alert(`Failed: ${error.message || JSON.stringify(error)}\nPlease let the assistant know you saw this error.`);
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

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) return;
        
        try {
            await deleteReview(id);
            setDisputes(prev => prev.filter(r => r.id !== id));
            alert('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review');
        }
    };

    // --- User Handlers ---
    const handleUpdateRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

        try {
            await updateUserRole(userId, newRole);
            setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update user role');
        }
    };

    // --- Restaurant CRUD Handlers ---
    const openEditModal = (place: DbPlace) => {
        setEditingRequest(null);
        setEditingPlace(place);
        setIsEditModalOpen(true);
    };

    const openEditRequestModal = (req: DbVerificationRequest) => {
        // Mock a place object for the modal using all request fields
        const mockPlace: DbPlace = {
            id: req.place_id || req.id,
            name: req.restaurant_name,
            cuisine: req.cuisine || '',
            address: req.address || '',
            city: req.city || '',
            rating: 0,
            review_count: 0,
            image: req.certificate_url || '',
            lat: req.lat || 22.5726,
            lng: req.lng || 88.3639,
            tags: req.tags || [],
            verified: false,
            verification_status: 'unverified',
            halal_status: req.halal_status || 'Full Halal',
            serves_alcohol: req.serves_alcohol || false,
            halal_source: req.halal_source || '',
            created_at: req.created_at
        };

        // If it's a claim, try to find the actual place
        if (req.place_id) {
            const actualPlace = places.find(p => p.id === req.place_id);
            if (actualPlace) {
                setEditingPlace(actualPlace);
            } else {
                setEditingPlace(mockPlace);
            }
        } else {
            setEditingPlace(mockPlace);
        }

        setEditingRequest(req);
        setIsEditModalOpen(true);
    };

    const handleDeletePlace = async (id: string) => {
        setDeletingPlaceId(id);
    };

    const confirmDeletePlace = async () => {
        if (!deletingPlaceId) return;
        try {
            await deletePlace(deletingPlaceId);
            setPlaces(prev => prev.filter(p => p.id !== deletingPlaceId));
            setStats(prev => ({ ...prev, places: Math.max(0, prev.places - 1) }));
            setDeletingPlaceId(null);
        } catch (error: any) {
            console.error('Error deleting place:', error);
            alert(`Delete failed: ${error.message || JSON.stringify(error)}`);
        }
    };

    const handleAdminAddPlace = async () => {
        if (!addForm.name || !addForm.cuisine || !addForm.city) {
            alert('Please fill Name, Cuisine, and City.');
            return;
        }
        setIsSavingPlace(true);
        try {
            let imageUrl = addForm.image;
            if (addImageFile) {
                imageUrl = await uploadImage(addImageFile);
            }
            await addPlaceAsAdmin({
                name: addForm.name,
                cuisine: addForm.cuisine,
                city: addForm.city,
                address: addForm.address || addForm.city,
                image: imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
                lat: Number(addForm.lat),
                lng: Number(addForm.lng),
                tags: addForm.tags.split(',').map(t => t.trim()).filter(t => t),
                verified: true,
                verification_status: 'owner_verified',
                halal_status: addForm.halal_status,
                serves_alcohol: addForm.serves_alcohol,
                halal_source: addForm.halal_source,
            });
            setIsAddModalOpen(false);
            setAddForm({
                name: '', cuisine: '', city: '', address: '',
                halal_status: 'Full Halal', serves_alcohol: false,
                halal_source: '', image: '',
                lat: 22.5726, lng: 88.3639,
                tags: ''
            });
            setAddImageFile(null);
            loadData();
        } catch (error: any) {
            console.error('Error adding place:', error);
            alert(`Failed to add: ${error.message || JSON.stringify(error)}`);
        } finally {
            setIsSavingPlace(false);
        }
    };

    const filteredPlaces = places.filter(p => {
        if (!restaurantSearch) return true;
        const q = restaurantSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q) || p.cuisine?.toLowerCase().includes(q);
    });

    const VerificationCard = ({ req, onApprove, onReject, onDelete, onEdit }: {
        req: DbVerificationRequest,
        onApprove: (id: string, status: 'approved') => void,
        onReject: (id: string, status: 'rejected') => void,
        onDelete: (id: string) => void,
        onEdit: (req: DbVerificationRequest) => void
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
                    <Button size="sm" variant="ghost" onClick={() => onEdit(req)} className="h-8 w-8 p-0 text-slate-300 hover:text-blue-500 rounded-lg" title="Edit Data"><Pencil className="h-3.5 w-3.5" /></Button>
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
                <Button size="sm" variant="outline" className="text-slate-500 border-slate-200 hover:bg-slate-50 font-black uppercase text-[10px] tracking-widest h-9 rounded-lg" onClick={() => onEdit(req)}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
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
                                        <div className="flex gap-1.5">
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-300 hover:text-blue-500 rounded-lg" onClick={() => openEditRequestModal(req)} title="Edit Request"><Pencil className="h-3 w-3" /></Button>
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
                                        <div className="flex gap-1.5">
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-300 hover:text-blue-500 rounded-lg" onClick={() => openEditRequestModal(req)} title="Edit Request"><Pencil className="h-3 w-3" /></Button>
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

    const filteredDisputes = disputes.filter(r => 
        r.user_name?.toLowerCase().includes(disputeSearch.toLowerCase()) || 
        r.comment?.toLowerCase().includes(disputeSearch.toLowerCase())
    );

    const renderDisputes = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mx-auto max-w-5xl">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <div>
                    <h2 className="font-black text-xl text-slate-900 uppercase">Community Disputes</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Handle {filteredDisputes.length} reports of non-halal data</p>
                </div>
                <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search disputes..." 
                        value={disputeSearch}
                        onChange={(e) => setDisputeSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none w-64" 
                    />
                </div>
            </div>
            <div className="divide-y divide-slate-100">
                {filteredDisputes.length === 0 ? (
                    <div className="py-20 text-center">
                        <MessageSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No active disputes</p>
                    </div>
                ) : (
                    filteredDisputes.map((dispute) => (
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
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest h-10" onClick={() => handleDeleteReview(dispute.id)}>Delete Review</Button>
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
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all w-64" 
                        />
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
                        {profiles.filter(u => u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || u.id.includes(userSearch)).length === 0 ? (
                            <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No users found.</td></tr>
                        ) : (
                            profiles.filter(u => u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || u.id.includes(userSearch)).map((user) => (
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
                                        <button 
                                            onClick={() => handleUpdateRole(user.id, user.role)}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer hover:scale-105 transition-transform ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}
                                        >
                                            {user.role}
                                        </button>
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
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className={`h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-purple-600 hover:bg-purple-50' : 'text-blue-600 hover:bg-blue-50'}`}
                                                onClick={() => handleUpdateRole(user.id, user.role)}
                                            >
                                                {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                            </Button>
                                        </div>
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
        <>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mx-auto max-w-7xl">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
                <div>
                    <h2 className="font-black text-xl text-slate-900">Total Restaurants</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Manage {filteredPlaces.length} of {places.length} global entries</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={restaurantSearch}
                            onChange={e => setRestaurantSearch(e.target.value)}
                            placeholder="Search name, city, cuisine..."
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all w-full md:w-64"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setAddForm({
                                name: '', cuisine: '', city: '', address: '',
                                halal_status: 'Full Halal', serves_alcohol: false,
                                halal_source: '', image: '',
                                lat: 22.5726, lng: 88.3639,
                                tags: ''
                            });
                            setAddImageFile(null);
                            setIsAddModalOpen(true);
                        }}
                        size="sm"
                        className="gap-2 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest px-4 shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="h-4 w-4" /> Add Place
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Brand &amp; Cuisine</th>
                            <th className="px-6 py-4">Geography</th>
                            <th className="px-6 py-4">Halal Status</th>
                            <th className="px-6 py-4">Trust Status</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPlaces.length === 0 ? (
                            <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-bold">No restaurants found.</td></tr>
                        ) : (
                            filteredPlaces.map((place) => (
                                <tr key={place.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm relative">
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
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                            place.halal_status === 'Not Halal'
                                                ? 'bg-red-50 text-red-700 border-red-100'
                                                : place.halal_status === 'Pork Free'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        }`}>
                                            {place.halal_status || 'Unknown'}
                                        </span>
                                        {place.serves_alcohol && (
                                            <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[9px] font-black uppercase border border-red-100">Alcohol</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {place.verified ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                                <Check className="h-3 w-3" /> Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                                                Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm">
                                            <span className="text-amber-500 text-lg leading-none">★</span> {place.rating?.toFixed(1) ?? '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => openEditModal(place)} 
                                                className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all bg-white"
                                            >
                                                <Pencil className="h-3 w-3 mr-1.5" /> Edit
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleDeletePlace(place.id)} 
                                                className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Link href={`/place/${place.id}`} target="_blank" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 inline-flex items-center justify-center">
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* ===== DELETE CONFIRMATION DIALOG ===== */}
        {deletingPlaceId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-300">
                    <div className="h-16 w-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Trash2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Delete Restaurant?</h3>
                    <p className="text-sm text-slate-500 mt-2 mb-8">This will permanently remove this restaurant and all associated verification requests. This cannot be undone.</p>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest" onClick={() => setDeletingPlaceId(null)}>Cancel</Button>
                        <Button className="flex-1 h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20" onClick={confirmDeletePlace}>Delete Forever</Button>
                    </div>
                </div>
            </div>
        )}

        {/* Edit Restaurant Modal */}
        {editingPlace && (
            <EditPlaceModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingPlace(null);
                    setEditingRequest(null);
                }}
                place={editingPlace}
                onSave={async () => {
                    // Logic handled by onUpdate if provided, or just reload data
                    loadData();
                }}
                onUpdate={editingRequest ? async (updates: Partial<DbPlace>) => {
                    try {
                        // 1. Update the request itself with ALL edited fields
                        await updateVerificationRequest(editingRequest.id, {
                            restaurant_name: updates.name,
                            cuisine: updates.cuisine,
                            address: updates.address,
                            city: updates.city,
                            lat: updates.lat,
                            lng: updates.lng,
                            tags: updates.tags,
                            halal_status: updates.halal_status,
                            serves_alcohol: updates.serves_alcohol,
                            halal_source: updates.halal_source,
                            certificate_url: updates.image || editingRequest.certificate_url
                        });
                        
                        // 2. If it's a claim, update the linked place too
                        if (editingRequest.place_id) {
                            await updatePlace(editingRequest.place_id, updates);
                        }
                        
                        loadData();
                    } catch (error) {
                        console.error('Error updating request:', error);
                        throw error; // Re-throw to be caught by modal's handler
                    }
                } : undefined}
            />
        )}

        {/* ===== ADD MODAL ===== */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
                    {/* Add Modal Header */}
                    <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                <Plus className="text-white h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Admin Add Restaurant</h2>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Auto-verified • Instant Publish</p>
                            </div>
                        </div>
                        <button onClick={() => setIsAddModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all">
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Add Modal Body */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Restaurant Photo</label>
                            <label className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group">
                                <input type="file" accept="image/*" className="hidden" onChange={e => setAddImageFile(e.target.files?.[0] || null)} />
                                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
                                    {addImageFile ? (
                                        <><Upload className="h-6 w-6" /><span className="text-xs font-black uppercase tracking-widest">{addImageFile.name}</span></>
                                    ) : (
                                        <><Upload className="h-6 w-6" /><span className="text-xs font-black uppercase tracking-widest">Upload Photo</span><span className="text-[10px] font-bold">(Optional)</span></>
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Restaurant Name *</label>
                            <input
                                value={addForm.name}
                                onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                placeholder="Full restaurant name"
                            />
                        </div>

                        {/* Cuisine & City */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cuisine *</label>
                                <input
                                    value={addForm.cuisine}
                                    onChange={e => setAddForm({ ...addForm, cuisine: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                    placeholder="e.g. Indian, Turkish"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">City *</label>
                                <input
                                    value={addForm.city}
                                    onChange={e => setAddForm({ ...addForm, city: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                    placeholder="City name"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Address</label>
                            <input
                                value={addForm.address}
                                onChange={e => setAddForm({ ...addForm, address: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                placeholder="Full address for maps"
                            />
                        </div>

                        {/* Lat & Lng */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Latitude *</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={addForm.lat}
                                    onChange={e => setAddForm({ ...addForm, lat: parseFloat(e.target.value) })}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Longitude *</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={addForm.lng}
                                    onChange={e => setAddForm({ ...addForm, lng: parseFloat(e.target.value) })}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tags (Comma Separated)</label>
                            <input
                                value={addForm.tags}
                                onChange={e => setAddForm({ ...addForm, tags: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                placeholder="e.g. Halal, Indian, Family Friendly"
                            />
                        </div>

                        <hr className="border-slate-100" />

                        {/* Halal Status */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Halal Classification
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Full Halal', 'Pork Free', 'Not Halal'].map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setAddForm({ ...addForm, halal_status: s })}
                                        className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                            addForm.halal_status === s
                                                ? s === 'Not Halal'
                                                    ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/20'
                                                    : 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Halal Source & Alcohol */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Halal Source</label>
                                <input
                                    value={addForm.halal_source}
                                    onChange={e => setAddForm({ ...addForm, halal_source: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                    placeholder="e.g. HMC, MUIS"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Serves Alcohol?</label>
                                <div className="flex gap-2 h-12 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                    <button type="button" onClick={() => setAddForm({ ...addForm, serves_alcohol: true })} className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${addForm.serves_alcohol ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'text-slate-400'}`}>Yes</button>
                                    <button type="button" onClick={() => setAddForm({ ...addForm, serves_alcohol: false })} className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!addForm.serves_alcohol ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' : 'text-slate-400'}`}>No</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add Modal Footer */}
                    <div className="px-8 py-6 border-t border-slate-100 bg-white rounded-b-[2rem] flex justify-between items-center">
                        <Button variant="ghost" className="h-12 px-6 rounded-xl text-slate-400 font-black uppercase text-[10px] tracking-widest" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleAdminAddPlace}
                            disabled={isSavingPlace}
                            className="h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSavingPlace ? <><Loader2 className="h-4 w-4 animate-spin" /> Adding...</> : <><Plus className="h-4 w-4" /> Add &amp; Publish</>}
                        </Button>
                    </div>
                </div>
            </div>
        )}
        </>
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
                                                    <VerificationCard key={req.id} req={req} onApprove={handleVerification} onReject={handleVerification} onDelete={handleDeleteVerification} onEdit={openEditRequestModal} />
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
                                                    <VerificationCard key={req.id} req={req} onApprove={handleVerification} onReject={handleVerification} onDelete={handleDeleteVerification} onEdit={openEditRequestModal} />
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

import { Suspense } from 'react';

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-slate-50 min-h-screen">
                <div className="h-16 w-16 border-[6px] border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-slate-900 font-black uppercase tracking-widest text-sm animate-pulse">Syncing Command Center...</p>
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
