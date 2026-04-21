'use client';

import { useState, useEffect } from 'react';
import { X, Building2, Upload, ShieldCheck, Save, Loader2, MapPin, Search } from 'lucide-react';
import { DbPlace } from '@/lib/supabase';
import { updatePlace, uploadImage } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { GoogleMap } from '@/components/map/Map';
import { CitySelect } from '@/components/ui/CitySelect';
import { cn } from '@/lib/utils';

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
    const [mapCenter, setMapCenter] = useState({ lat: 23.8103, lng: 90.4125 }); // Default to approximate region
    const [manualPin, setManualPin] = useState(false);

    useEffect(() => {
        if (isOpen && place) {
            setEditForm(place);
            setEditImageFile(null);
            setManualPin(false);
            if (place.lat && place.lng) {
                setMapCenter({ lat: place.lat, lng: place.lng });
            }
        }
    }, [isOpen, place]);

    // Geocode or move map when city changes (if NOT manually pinned)
    useEffect(() => {
        if (editForm.city && !manualPin && isOpen) {
             const fetchCityCoords = async () => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(editForm.city || '')}&limit=1`);
                    const data = await res.json();
                    if (data && data[0]) {
                        const newLat = parseFloat(data[0].lat);
                        const newLng = parseFloat(data[0].lon);
                        setMapCenter({ lat: newLat, lng: newLng });
                    }
                } catch (e) {
                    console.error("Geocoding failed", e);
                }
            };
            fetchCityCoords();
        }
    }, [editForm.city, manualPin, isOpen]);

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
                lat: editForm.lat ? Number(editForm.lat) : undefined,
                lng: editForm.lng ? Number(editForm.lng) : undefined,
                phone: editForm.phone || undefined,
                email: editForm.email || undefined,
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-white/20">
                
                {/* Header */}
                <div className="flex justify-between items-center px-10 py-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 ring-4 ring-emerald-50">
                            <Building2 className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Admin: Edit Restaurant</h2>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">Live Update • {place.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-slate-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Left Side: Form Fields */}
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Name</label>
                                    <input
                                        value={editForm.name || ''}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl border-3 border-slate-100 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all outline-none font-bold text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / District</label>
                                    <CitySelect 
                                        value={editForm.city || ''} 
                                        onChange={(city) => setEditForm({ ...editForm, city })} 
                                        className="h-14"
                                        placeholder="Select District"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cuisine</label>
                                        <input
                                            value={editForm.cuisine || ''}
                                            onChange={e => setEditForm({ ...editForm, cuisine: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none font-bold text-slate-900 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Street Address</label>
                                        <input
                                            value={editForm.address || ''}
                                            onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none font-bold text-slate-900 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                                        <input
                                            value={editForm.phone || ''}
                                            onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none font-bold text-slate-900 text-sm"
                                            placeholder="e.g. +91 98765 43210"
                                            type="tel"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Optional)</label>
                                        <input
                                            value={editForm.email || ''}
                                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none font-bold text-slate-900 text-sm"
                                            placeholder="e.g. contact@restaurant.com"
                                            type="email"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Halal Status */}
                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Halal Classification
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Full Halal', 'Pork Free', 'Not Halal'].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setEditForm({ ...editForm, halal_status: s })}
                                            className={cn(
                                                "h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-3 transition-all",
                                                editForm.halal_status === s
                                                    ? s === 'Not Halal'
                                                        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200"
                                                        : "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                    : "bg-white border-slate-50 text-slate-400 hover:border-slate-200"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Trust Level</label>
                                        <select
                                            value={editForm.verification_status || 'unverified'}
                                            onChange={e => setEditForm({ ...editForm, verification_status: e.target.value as any })}
                                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white outline-none text-xs font-bold"
                                        >
                                            <option value="unverified">Unverified (Pending)</option>
                                            <option value="community_verified">Community Verified</option>
                                            <option value="owner_verified">Owner Verified (Official)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Alcohol?</label>
                                        <div className="flex h-12 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                            <button type="button" onClick={() => setEditForm({ ...editForm, serves_alcohol: true })} className={cn("flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", editForm.serves_alcohol ? "bg-white text-red-600 shadow-sm" : "text-slate-400")}>Yes</button>
                                            <button type="button" onClick={() => setEditForm({ ...editForm, serves_alcohol: false })} className={cn("flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", !editForm.serves_alcohol ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>No</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Map & Image */}
                        <div className="space-y-8">
                            {/* Map Box */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                                    Adjust Pin on Map
                                    {editForm.lat && <span className="text-emerald-500 font-bold lowercase">pos: {editForm.lat.toFixed(4)}, {editForm.lng?.toFixed(4)}</span>}
                                </label>
                                <div className="h-64 w-full rounded-3xl border-3 border-slate-100 overflow-hidden relative group">
                                    <GoogleMap
                                        className="w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all"
                                        center={mapCenter}
                                        zoom={15}
                                        onLocationSelect={(lat, lng) => {
                                            setEditForm({ ...editForm, lat, lng });
                                            setManualPin(true);
                                        }}
                                    />
                                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg text-[9px] font-bold text-slate-500 flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-emerald-500" />
                                        Drag the pin to adjust restaurant location globally.
                                    </div>
                                </div>
                            </div>

                            {/* Image Box */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Photo</label>
                                <div className="flex gap-4">
                                    <div className="h-48 w-48 rounded-3xl bg-slate-100 overflow-hidden border-2 border-slate-50 flex-shrink-0 relative">
                                        {(editImageFile || editForm.image) ? (
                                            <img 
                                                src={editImageFile ? URL.createObjectURL(editImageFile) : editForm.image} 
                                                alt="" 
                                                className="h-full w-full object-cover" 
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-200"><Building2 className="h-12 w-12" /></div>
                                        )}
                                    </div>
                                    <label className={cn(
                                        "flex-1 flex flex-col items-center justify-center h-48 border-3 border-dashed rounded-3xl transition-all cursor-pointer group",
                                        editImageFile ? "border-emerald-500 bg-emerald-50/20" : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300"
                                    )}>
                                        <input type="file" accept="image/*" className="hidden" onChange={e => setEditImageFile(e.target.files?.[0] || null)} />
                                        <Upload className={cn("h-6 w-6 mb-2", editImageFile ? "text-emerald-600" : "text-slate-300")} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Photo</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Extra buffer for dropdowns */}
                    <div className="h-60" />
                </div>

                {/* Footer */}
                <div className="px-10 py-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <Button variant="ghost" className="h-14 px-8 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 hover:bg-white transition-all" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-14 px-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}
