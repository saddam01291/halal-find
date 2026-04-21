'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { addPlace, submitVerificationRequest, uploadImage, checkDuplicatePlace } from '@/lib/api';
import { X, Upload, Building2, Loader2, Info, Camera, ShieldCheck, MapPin as MapPinIcon, LocateFixed, Star, MessageSquareQuote, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleMap } from '@/components/map/Map';
import { CitySelect } from '@/components/ui/CitySelect';

interface AddPlaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddPlaceModal({ isOpen, onClose }: AddPlaceModalProps) {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        cuisine: '',
        halal_statuses: ['Full Halal'] as string[],
        serves_alcohol: false,
        halal_source: '',
        lat: undefined as number | undefined,
        lng: undefined as number | undefined,
        initial_review: '',
        initial_rating: 5
    });
    
    const [duplicateFound, setDuplicateFound] = useState<boolean>(false);
    const [checkingDuplicate, setCheckingDuplicate] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);


    // Real-time Duplicate Check — only fires when name + location are meaningfully filled
    useEffect(() => {
        const timer = setTimeout(async () => {
            const nameReady = formData.name.trim().length >= 4;
            const cityReady = formData.city.trim().length >= 3;
            const addressReady = formData.address.trim().length >= 8;

            if (nameReady && (cityReady || addressReady)) {
                setCheckingDuplicate(true);
                try {
                    const existing = await checkDuplicatePlace(formData.name, formData.city, formData.address);
                    setDuplicateFound(!!existing);
                } catch (e) {
                    console.error('Duplicate check failed', e);
                    setDuplicateFound(false); // never block on error
                } finally {
                    setCheckingDuplicate(false);
                }
            } else {
                setDuplicateFound(false); // reset when fields are incomplete
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [formData.name, formData.city, formData.address]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!user) {
            alert('Please sign in to add a restaurant.');
            return;
        }

        if (duplicateFound) return;

        if (!formData.name || !formData.address) {
            alert('Please enter at least the Restaurant Name and Address.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Optional Image Upload
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImage(imageFile) || '';
            }

            // 2. Submit for Review (DO NOT create place yet — wait for admin approval)
            await submitVerificationRequest({
                restaurant_name: formData.name,
                owner_name: user?.full_name || 'Contributor',
                certificate_url: imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
                type: 'community_addition',
                cuisine: formData.cuisine || 'Global Halal',
                address: formData.address,
                city: formData.city || 'Unknown', 
                lat: formData.lat, 
                lng: formData.lng,
                phone: formData.phone || undefined,
                email: formData.email || undefined,
                tags: ['Halal', formData.cuisine || 'Fast Food', formData.city].filter(Boolean) as string[],
                halal_status: formData.halal_statuses.join(', '),
                serves_alcohol: formData.serves_alcohol,
                halal_source: formData.halal_source,
                initial_review: formData.initial_review,
                initial_rating: formData.initial_rating
            });

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
            }, 2000);
        } catch (error: any) {
            console.error('Submission failed:', error);
            if (error?.message?.includes('unique_place_identity')) {
                setDuplicateFound(true);
            } else {
                alert(`Error: ${error?.message || 'Something went wrong. Please try again.'}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white rounded-[3rem] p-12 text-center max-w-sm shadow-2xl">
                    <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 scale-in-center">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Thank You!</h2>
                    <p className="text-slate-500 font-bold">Your submission was successful. We will list it soon!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-8 duration-500">
                
                {/* Minimal Header */}
                <div className="flex justify-between items-center px-10 pt-10 pb-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 leading-tight">Add Restaurant</h2>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Share a new halal spot with the community</p>
                    </div>
                    <button onClick={onClose} className="h-14 w-14 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all bg-slate-50 border border-slate-100 active:scale-95">
                        <X className="h-6 w-6 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pb-10 space-y-8">
                    
                    {/* PRIMARY FIELDS (Priority 1) */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Name*</label>
                            <div className="relative">
                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full h-16 pl-14 pr-6 rounded-3xl border-3 transition-all outline-none text-lg font-bold ${duplicateFound ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white text-slate-900'}`}
                                    placeholder="e.g. Aryan Food Corner"
                                />
                                {checkingDuplicate && (
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                                    </div>
                                )}
                            </div>
                            {duplicateFound && (
                                <div className="flex items-center gap-3 p-4 bg-amber-100 border-2 border-amber-200 rounded-2xl text-amber-900 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <p className="text-sm font-bold">🚫 Restaurant is already added, please add a different restaurant.</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">City*</label>
                            <CitySelect 
                                value={formData.city} 
                                onChange={(city) => setFormData({ ...formData, city })} 
                                placeholder="Select Location (City/District)"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address*</label>
                            <div className="relative">
                                <MapPinIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                <input
                                    required
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full h-16 pl-14 pr-6 rounded-3xl border-3 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-lg font-bold text-slate-900"
                                    placeholder="Street, Landmark"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                                <input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                    placeholder="e.g. +91 98765 43210"
                                    type="tel"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address (Optional)</label>
                                <input
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                    placeholder="e.g. contact@restaurant.com"
                                    type="email"
                                />
                            </div>
                        </div>
                    </div>

                    {/* OPTIONAL EXTRAS (Priority 2) */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={async () => {
                                if (!showMap) {
                                    setShowMap(true);
                                    // Try to auto-locate when opening map
                                    if (typeof navigator !== 'undefined' && navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition((pos) => {
                                            setFormData(prev => ({ 
                                                ...prev, 
                                                lat: pos.coords.latitude, 
                                                lng: pos.coords.longitude 
                                            }));
                                        });
                                    }
                                } else {
                                    setShowMap(false);
                                }
                            }}
                            className={`h-16 rounded-3xl border-2 font-black uppercase tracking-widest text-[10px] gap-2 ${showMap ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                        >
                            <LocateFixed className="h-4 w-4" />
                            {showMap ? 'Pin Set' : 'Set Pin on Map (Recommended)'}
                        </Button>
                        <label className={`h-16 rounded-3xl border-2 flex items-center justify-center font-black uppercase tracking-widest text-[10px] gap-2 cursor-pointer transition-all ${imageFile ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                            <Camera className="h-4 w-4" />
                            <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                            {imageFile ? 'Photo Loaded' : 'Add Photo (Optional)'}
                        </label>
                    </div>

                    {showMap && (
                        <div className="h-64 rounded-[2.5rem] overflow-hidden border-3 border-emerald-100 shadow-xl relative animate-in zoom-in-95 duration-300">
                             <GoogleMap
                                className="w-full h-full"
                                center={{ lat: formData.lat || 22.5726, lng: formData.lng || 88.3639 }}
                                onLocationSelect={(lat, lng) => setFormData({ ...formData, lat, lng })}
                            />
                            <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-[9px] font-black uppercase text-center text-slate-500 shadow-sm">Drag marker to set exact location</div>
                        </div>
                    )}

                    <hr className="border-slate-100" />

                    {/* EXPERIENCE / REVIEW (Identity) */}
                    <div className="space-y-6 py-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">How was your visit?</h3>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, initial_rating: star })}
                                        className={`p-1.5 transition-all active:scale-90 ${formData.initial_rating >= star ? 'text-amber-400' : 'text-slate-200 hover:text-slate-300'}`}
                                    >
                                        <Star className={`h-6 w-6 ${formData.initial_rating >= star ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={formData.initial_review}
                            onChange={e => setFormData({ ...formData, initial_review: e.target.value })}
                            className="w-full h-24 p-6 rounded-[2rem] border-3 border-slate-100 focus:border-emerald-500 bg-slate-50/50 transition-all outline-none text-base font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                            placeholder="Add a quick note about the food or halal status..."
                        />
                    </div>

                    {/* MORE BUTTON (ADVANCED) */}
                    <button 
                        type="button" 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline mx-auto block"
                    >
                        {showAdvanced ? 'Hide advanced details' : 'Add Cuisine & Halal details? (Optional)'}
                    </button>

                    {showAdvanced && (
                        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cuisine Type</label>
                                <input
                                    value={formData.cuisine}
                                    onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-slate-50/50 outline-none font-bold"
                                    placeholder="e.g. Indian, Chinese"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Halal Source</label>
                                <input
                                    value={formData.halal_source}
                                    onChange={e => setFormData({ ...formData, halal_source: e.target.value })}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-slate-50/50 outline-none font-bold"
                                    placeholder="e.g. Local Certification"
                                />
                            </div>
                        </div>
                    )}

                </form>

                {/* Simple Submit Footer */}
                <div className="px-10 pb-10 pt-4 bg-white">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || duplicateFound}
                        className={`w-full h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${duplicateFound ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 hover:bg-black text-white'}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            'Submit Restaurant'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
