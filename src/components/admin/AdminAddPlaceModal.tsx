'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Loader2, MapPin, ShieldCheck, Search, Info } from 'lucide-react';
import { GoogleMap } from '@/components/map/Map';
import { Button } from '@/components/ui/Button';
import { CitySelect } from '@/components/ui/CitySelect';
import { addPlaceAsAdmin, checkDuplicatePlace, uploadImage } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AdminAddPlaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function AdminAddPlaceModal({ isOpen, onClose, onSave }: AdminAddPlaceModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [duplicatePlace, setDuplicatePlace] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [mapCenter, setMapCenter] = useState({ lat: 22.5726, lng: 88.3639 }); // Default Kolkata for map view
    const [manualPin, setManualPin] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        cuisine: '',
        city: '',
        address: '',
        lat: null as number | null,
        lng: null as number | null,
        halal_status: 'Full Halal',
        serves_alcohol: false,
        halal_source: '',
        phone: '',
        email: '',
        tags: '',
        image: ''
    });

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '', cuisine: '', city: '', address: '',
                lat: null, lng: null,
                halal_status: 'Full Halal', serves_alcohol: false,
                halal_source: '', phone: '', email: '', tags: '', image: ''
            });
            setImageFile(null);
            setDuplicatePlace(null);
            setManualPin(false);
        }
    }, [isOpen]);

    // Geocode or move map when city changes
    useEffect(() => {
        if (formData.city && !manualPin) {
             const fetchCityCoords = async () => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.city)}&limit=1`);
                    const data = await res.json();
                    if (data && data[0]) {
                        const newLat = parseFloat(data[0].lat);
                        const newLng = parseFloat(data[0].lon);
                        setMapCenter({ lat: newLat, lng: newLng });
                        setFormData(prev => ({ ...prev, lat: newLat, lng: newLng }));
                    }
                } catch (e) {
                    console.error("Geocoding failed", e);
                }
            };
            fetchCityCoords();
        }
    }, [formData.city, manualPin]);

    const handleDuplicateCheck = async (name: string) => {
        if (name.length > 3) {
            const dup = await checkDuplicatePlace(name, formData.city);
            setDuplicatePlace(dup);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.city) {
            alert('Name and City are required.');
            return;
        }

        setIsSaving(true);
        try {
            let finalImageUrl = formData.image;
            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            }

            await addPlaceAsAdmin({
                name: formData.name,
                cuisine: formData.cuisine || 'Global Halal',
                city: formData.city,
                address: formData.address || formData.city,
                lat: formData.lat,
                lng: formData.lng,
                image: finalImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
                halal_status: formData.halal_status,
                serves_alcohol: formData.serves_alcohol,
                halal_source: formData.halal_source,
                phone: formData.phone || undefined,
                email: formData.email || undefined,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                verified: true,
                verification_status: 'owner_verified'
            } as any);

            onSave();
            onClose();
        } catch (error: any) {
            console.error('Error saving place:', error);
            alert(`Save failed: ${error.message || JSON.stringify(error)}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-white/20">
                
                {/* Header */}
                <div className="flex justify-between items-center px-10 py-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 ring-4 ring-emerald-50">
                            <Plus className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Admin: Add New Restaurant</h2>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">Instant Direct Publish • Verified Status</p>
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
                            {/* Duplicate Alert */}
                            {duplicatePlace && (
                                <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                                    <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Potential Duplicate Found</p>
                                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed mt-1">
                                            "{duplicatePlace.name}" already exists in {duplicatePlace.city}. Check before adding to avoid clutter.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Name*</label>
                                    <input
                                        autoFocus
                                        value={formData.name}
                                        onChange={e => {
                                            setFormData({ ...formData, name: e.target.value });
                                            handleDuplicateCheck(e.target.value);
                                        }}
                                        className="w-full h-14 px-6 rounded-2xl border-3 border-slate-100 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all outline-none font-bold text-slate-900"
                                        placeholder="e.g. Al-Baik Express"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / District*</label>
                                    <CitySelect 
                                        value={formData.city} 
                                        onChange={(city) => setFormData({ ...formData, city })} 
                                        className="h-14"
                                        placeholder="Select District"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cuisine</label>
                                        <input
                                            value={formData.cuisine}
                                            onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none font-bold text-slate-900 text-sm"
                                            placeholder="e.g. Mughal, Arabic"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Street Address</label>
                                        <input
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none font-bold text-slate-900 text-sm"
                                            placeholder="Full address for map accuracy"
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
                                            onClick={() => setFormData({ ...formData, halal_status: s })}
                                            className={cn(
                                                "h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-3 transition-all",
                                                formData.halal_status === s
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
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sourcing</label>
                                        <input
                                            value={formData.halal_source}
                                            onChange={e => setFormData({ ...formData, halal_source: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 bg-white outline-none text-xs font-bold"
                                            placeholder="e.g. Certified by HMC"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Alcohol?</label>
                                        <div className="flex h-12 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                            <button type="button" onClick={() => setFormData({ ...formData, serves_alcohol: true })} className={cn("flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", formData.serves_alcohol ? "bg-white text-red-600 shadow-sm" : "text-slate-400")}>Yes</button>
                                            <button type="button" onClick={() => setFormData({ ...formData, serves_alcohol: false })} className={cn("flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", !formData.serves_alcohol ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>No</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                                    <input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none font-bold text-slate-900 text-sm"
                                        placeholder="e.g. +91 98765 43210"
                                        type="tel"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Optional)</label>
                                    <input
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none font-bold text-slate-900 text-sm"
                                        placeholder="e.g. contact@restaurant.com"
                                        type="email"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Map & Image */}
                        <div className="space-y-8">
                            {/* Map Box */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                                    Set Pin on Map*
                                    {formData.lat && <span className="text-emerald-500 font-bold lowercase">pinned: {formData.lat.toFixed(4)}, {formData.lng?.toFixed(4)}</span>}
                                </label>
                                <div className="h-64 w-full rounded-3xl border-3 border-slate-100 overflow-hidden relative group">
                                    <GoogleMap
                                        className="w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all"
                                        center={mapCenter}
                                        zoom={14}
                                        onLocationSelect={(lat, lng) => {
                                            setFormData({ ...formData, lat, lng });
                                            setManualPin(true);
                                        }}
                                    />
                                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg text-[9px] font-bold text-slate-500 flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-emerald-500" />
                                        Click or Drag to set the exact restaurant location.
                                    </div>
                                </div>
                            </div>

                            {/* Image Box */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Photo</label>
                                <label className={cn(
                                    "flex flex-col items-center justify-center h-48 border-3 border-dashed rounded-3xl transition-all cursor-pointer group",
                                    imageFile ? "border-emerald-500 bg-emerald-50/20" : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300"
                                )}>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                    {imageFile ? (
                                        <div className="text-center p-4">
                                            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <Upload className="h-6 w-6" />
                                            </div>
                                            <p className="text-xs font-black text-slate-900 uppercase truncate max-w-[200px]">{imageFile.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1">Click to change photo</p>
                                        </div>
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload Brand Image</p>
                                            <p className="text-[9px] text-slate-300 font-bold uppercase mt-1 tracking-wider">JPG or PNG • Max 5MB</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Extra padding to help dropdowns have room to breathe */}
                    <div className="h-60" />
                </div>

                {/* Footer */}
                <div className="px-10 py-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <Button variant="ghost" className="h-14 px-8 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 hover:bg-white transition-all" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !formData.name || !formData.city}
                        className="h-14 px-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Plus className="h-4 w-4 mr-2" /> Add &amp; Publish</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}
