'use client';

import { useState, useEffect } from 'react';
import { X, Building2, Upload, ShieldCheck, Save, Loader2 } from 'lucide-react';
import { DbPlace } from '@/lib/supabase';
import { updatePlace, uploadImage } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface EditPlaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    place: DbPlace;
    onSave?: () => void;
    onUpdate?: (updates: Partial<DbPlace>) => Promise<void>;
}

export function EditPlaceModal({ isOpen, onClose, place, onSave, onUpdate }: EditPlaceModalProps) {
    const [editForm, setEditForm] = useState<Partial<DbPlace>>({});
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && place) {
            setEditForm(place);
            setEditImageFile(null);
        }
    }, [isOpen, place]);

    if (!isOpen || !place) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let imageUrl = editForm.image;
            if (editImageFile) {
                imageUrl = await uploadImage(editImageFile);
            }

            const updates: Partial<DbPlace> = {
                name: editForm.name,
                cuisine: editForm.cuisine,
                city: editForm.city,
                address: editForm.address,
                halal_status: editForm.halal_status,
                halal_source: editForm.halal_source,
                serves_alcohol: editForm.serves_alcohol,
                verified: editForm.verified,
                verification_status: editForm.verification_status,
                image: imageUrl,
                lat: Number(editForm.lat),
                lng: Number(editForm.lng),
                tags: typeof editForm.tags === 'string' 
                    ? (editForm.tags as string).split(',').map(t => t.trim()).filter(t => t) 
                    : editForm.tags,
            };

            if (onUpdate) {
                await onUpdate(updates);
            } else {
                await updatePlace(place.id, updates);
            }
            
            if (onSave) onSave();
            onClose();
        } catch (error) {
            console.error('Error saving place:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Edit Restaurant</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{place.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all">
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Image */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Restaurant Photo</label>
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                {(editImageFile ? URL.createObjectURL(editImageFile) : editForm.image) ? (
                                    <img src={editImageFile ? URL.createObjectURL(editImageFile) : editForm.image} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-300"><Building2 className="h-8 w-8" /></div>
                                )}
                            </div>
                            <label className="flex-1 flex items-center justify-center h-20 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group">
                                <input type="file" accept="image/*" className="hidden" onChange={e => setEditImageFile(e.target.files?.[0] || null)} />
                                <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">{editImageFile ? editImageFile.name : 'Change Photo'}</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Restaurant Name</label>
                        <input
                            value={editForm.name || ''}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                        />
                    </div>

                    {/* Cuisine & City */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cuisine</label>
                            <input
                                value={editForm.cuisine || ''}
                                onChange={e => setEditForm({ ...editForm, cuisine: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">City</label>
                            <input
                                value={editForm.city || ''}
                                onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Address</label>
                        <input
                            value={editForm.address || ''}
                            onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                        />
                    </div>

                    {/* Lat & Lng */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={editForm.lat || 0}
                                onChange={e => setEditForm({ ...editForm, lat: parseFloat(e.target.value) })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={editForm.lng || 0}
                                onChange={e => setEditForm({ ...editForm, lng: parseFloat(e.target.value) })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tags (Comma Separated)</label>
                        <input
                            value={Array.isArray(editForm.tags) ? editForm.tags.join(', ') : (editForm.tags as any) || ''}
                            onChange={e => setEditForm({ ...editForm, tags: e.target.value as any })}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
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
                                    onClick={() => setEditForm({ ...editForm, halal_status: s })}
                                    className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                        editForm.halal_status === s
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
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Halal Source / Authority</label>
                            <input
                                value={editForm.halal_source || ''}
                                onChange={e => setEditForm({ ...editForm, halal_source: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                placeholder="e.g. HMC, MUIS"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Serves Alcohol?</label>
                            <div className="flex gap-2 h-12 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                <button type="button" onClick={() => setEditForm({ ...editForm, serves_alcohol: true })} className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${editForm.serves_alcohol ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'text-slate-400'}`}>Yes</button>
                                <button type="button" onClick={() => setEditForm({ ...editForm, serves_alcohol: false })} className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!editForm.serves_alcohol ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' : 'text-slate-400'}`}>No</button>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Verified Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Verified?</label>
                            <div className="flex gap-2 h-12 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                <button type="button" onClick={() => setEditForm({ ...editForm, verified: true })} className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${editForm.verified ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' : 'text-slate-400'}`}>Verified</button>
                                <button type="button" onClick={() => setEditForm({ ...editForm, verified: false })} className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!editForm.verified ? 'bg-slate-200 text-slate-600 border border-slate-300' : 'text-slate-400'}`}>Unverified</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Trust Level</label>
                            <select
                                value={editForm.verification_status || 'unverified'}
                                onChange={e => setEditForm({ ...editForm, verification_status: e.target.value as any })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 bg-white transition-all outline-none text-xs font-bold text-slate-900"
                            >
                                <option value="unverified">Unverified (Pending)</option>
                                <option value="community_verified">Community Verified</option>
                                <option value="owner_verified">Owner Verified (Official)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1 h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest bg-white border-2 border-slate-100 text-slate-400 hover:text-slate-900">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-[2] h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-500/20 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saving...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
