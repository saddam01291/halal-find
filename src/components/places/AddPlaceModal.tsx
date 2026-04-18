'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { addPlace, submitVerificationRequest, uploadImage, checkDuplicatePlace } from '@/lib/api';
import { X, Upload, Building2, Loader2, Info, Camera, ShieldCheck, MapPin as MapPinIcon, LocateFixed, Star, MessageSquareQuote, AlertTriangle } from 'lucide-react';
import { GoogleMap } from '@/components/map/Map';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

interface AddPlaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddPlaceModal({ isOpen, onClose }: AddPlaceModalProps) {
    const { user } = useAuth();
    const [isOwner, setIsOwner] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cuisine: '',
        city: '',
        address: '',
        halal_statuses: ['Full Halal'] as string[],
        serves_alcohol: false,
        halal_source: '',
        lat: 0,
        lng: 0,
        initial_review: '',
        initial_rating: 5
    });
    
    const [duplicateFound, setDuplicateFound] = useState<boolean>(false);
    const [checkingDuplicate, setCheckingDuplicate] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [certFile, setCertFile] = useState<File | null>(null);

    const [uploadProgress, setUploadProgress] = useState<'idle' | 'photos' | 'database' | 'verification'>('idle');

    // Duplicate Check logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (formData.name.length > 2 && formData.city.length > 2) {
                setCheckingDuplicate(true);
                try {
                    const existing = await checkDuplicatePlace(formData.name, formData.city);
                    setDuplicateFound(!!existing);
                } catch (e) {
                    console.error('Duplicate check failed', e);
                } finally {
                    setCheckingDuplicate(false);
                }
            } else {
                setDuplicateFound(false);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [formData.name, formData.city]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!user) {
            alert('Please sign in to add a restaurant.');
            return;
        }

        if (duplicateFound) {
            alert('This restaurant is already listed on Find Halal. Please search for it to add a review instead.');
            return;
        }

        if (!formData.name || !formData.cuisine || !formData.city) {
            alert('Please fill in the required fields (Name, Cuisine, City).');
            return;
        }

        setIsSubmitting(true);
        setUploadProgress('photos');

        try {
            // 1. Image Uploads
            let imageUrl = '';
            let certUrl = '';

            try {
                if (imageFile) {
                    imageUrl = await uploadImage(imageFile) || '';
                }
                if (certFile) {
                    certUrl = await uploadImage(certFile) || '';
                }
            } catch (err: any) {
                console.error('Image Upload Step Detailed Failure:', err);
                throw err;
            }

            // 2. Create Restaurant
            setUploadProgress('database');
            const newPlace = await addPlace({
                name: formData.name,
                cuisine: formData.cuisine,
                address: formData.address || formData.city,
                city: formData.city,
                image: imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
                lat: formData.lat || 0,
                lng: formData.lng || 0,
                tags: ['Halal', formData.cuisine, ...formData.halal_statuses],
                is_mixed_neighborhood: false,
                halal_status: formData.halal_statuses.join(', '),
                serves_alcohol: formData.serves_alcohol,
                halal_source: formData.halal_source
            });

            // 3. Create Verification
            if (newPlace) {
                setUploadProgress('verification');
                await submitVerificationRequest({
                    restaurant_name: formData.name,
                    owner_name: user?.full_name || 'Contributor',
                    certificate_url: certUrl,
                    place_id: newPlace.id,
                    type: isOwner ? 'claim' : 'community_addition',
                    initial_review: formData.initial_review,
                    initial_rating: formData.initial_rating
                });
            }

            alert(isOwner ? 'Restaurant submitted! Admin will verify soon.' : 'Thank you! Added for community review.');
            onClose();
        } catch (error: any) {
            console.error('--- SUBMISSION CRITICAL FAILURE ---', error);
            alert(`🚨 SUBMISSION FAILED\n\nError: ${error?.message || 'Unexpected error'}`);
        } finally {
            setIsSubmitting(false);
            setUploadProgress('idle');
        }
    };

    const toggleHalalStatus = (status: string) => {
        setFormData(prev => {
            const current = prev.halal_statuses;
            if (current.includes(status)) {
                return { ...prev, halal_statuses: current.filter(s => s !== status) };
            } else {
                if (status === 'Not Halal') return { ...prev, halal_statuses: [status] };
                const filtered = current.filter(s => s !== 'Not Halal');
                return { ...prev, halal_statuses: [...filtered, status] };
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Building2 className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 leading-none">Add Restaurant</h2>
                            <p className="text-slate-400 text-sm mt-1 font-bold">Share a new halal spot with the community</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all active:scale-95 group">
                        <X className="h-7 w-7 text-slate-300 group-hover:text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="max-w-3xl mx-auto p-8 space-y-10">

                        {/* 1. PHOTO UPLOAD SECTION */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Camera className="h-5 w-5 text-emerald-600" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Photos & Proof</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Photo</label>
                                    <label className="flex flex-col items-center justify-center min-h-[160px] border-3 border-dashed border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer bg-slate-50/50 group relative overflow-hidden">
                                        <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                        {imageFile ? (
                                            <div className="text-center p-4">
                                                <Upload className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                                                <p className="text-xs font-black text-emerald-700 truncate max-w-[200px]">{imageFile.name}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-slate-300 group-hover:text-emerald-500 transition-colors mb-3" />
                                                <span className="text-xs font-black text-slate-500 group-hover:text-emerald-700 transition-colors uppercase tracking-wider">Upload Main Photo</span>
                                            </>
                                        )}
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        {isOwner ? 'Halal Certificate' : 'Menu or Proof'}
                                    </label>
                                    <label className={`flex flex-col items-center justify-center min-h-[160px] border-3 border-dashed border-slate-100 rounded-3xl transition-all cursor-pointer group relative overflow-hidden ${isOwner ? 'hover:border-amber-500 hover:bg-amber-50/30 bg-amber-50/10' : 'hover:border-slate-400 hover:bg-slate-100 bg-slate-50/50'}`}>
                                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => setCertFile(e.target.files?.[0] || null)} />
                                        {certFile ? (
                                            <div className="text-center p-4">
                                                <Upload className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                                                <p className="text-xs font-black text-slate-700 truncate max-w-[200px]">{certFile.name}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-slate-300 transition-colors mb-3" />
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                                                    {isOwner ? 'Upload Certificate' : 'Optional Proof'}
                                                </span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* 2. IDENTITY SECTION */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Your Identity</h3>
                                </div>
                                <div className="flex p-1 bg-slate-100 rounded-2xl w-64 border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setIsOwner(false)}
                                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isOwner ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Contributor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsOwner(true)}
                                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isOwner ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Owner
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 3. BASIC INFO SECTION */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Name*</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full h-14 px-6 rounded-2xl border-2 transition-all outline-none text-base font-bold text-slate-900 ${duplicateFound ? 'border-red-200 bg-red-50 focus:border-red-500' : 'border-slate-100 bg-slate-50/50 focus:border-emerald-500 focus:bg-white'}`}
                                        placeholder="Enter full restaurant name"
                                    />
                                    {checkingDuplicate && <p className="text-[10px] text-emerald-600 font-bold ml-1 animate-pulse">Checking for duplicates...</p>}
                                    {duplicateFound && (
                                        <div className="flex items-center gap-2 mt-2 p-3 bg-red-100 border border-red-200 rounded-xl text-red-700 animate-in slide-in-from-top-2 duration-300">
                                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">A restaurant with this name already exists in this city!</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cuisine Type*</label>
                                        <input
                                            required
                                            value={formData.cuisine}
                                            onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all outline-none text-base font-bold text-slate-900"
                                            placeholder="e.g. Indian, Turkish, Chinese"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">City*</label>
                                        <input
                                            required
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            className={`w-full h-14 px-6 rounded-2xl border-2 transition-all outline-none text-base font-bold text-slate-900 ${duplicateFound ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50/50 focus:border-emerald-500 focus:bg-white'}`}
                                            placeholder="City name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                                    <input
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all outline-none text-base font-bold text-slate-900"
                                        placeholder="Full detailed address for maps"
                                    />
                                </div>

                                {/* Map Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon className="h-4 w-4 text-emerald-600" />
                                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Map Position</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowMap(!showMap);
                                                if (!showMap && formData.lat === 0) setFormData({ ...formData, lat: 22.5726, lng: 88.3639 });
                                            }}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showMap ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            {showMap ? 'Close Map' : 'Set Pin Location'}
                                        </button>
                                    </div>
                                    {showMap && apiKey && (
                                        <div className="h-64 rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-inner relative animate-in fade-in duration-500">
                                            <GoogleMap
                                                apiKey={apiKey}
                                                className="w-full h-full"
                                                center={{ lat: formData.lat, lng: formData.lng }}
                                                onCenterChanged={(e) => {
                                                    const newCenter = e.detail.center;
                                                    setFormData(prev => ({ ...prev, lat: newCenter.lat, lng: newCenter.lng }));
                                                }}
                                            >
                                                <AdvancedMarker position={{ lat: formData.lat, lng: formData.lng }} draggable={true} />
                                            </GoogleMap>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (navigator.geolocation) {
                                                        navigator.geolocation.getCurrentPosition((pos) => {
                                                            setFormData(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
                                                        });
                                                    }
                                                }}
                                                className="absolute bottom-4 right-4 p-3 bg-white text-emerald-600 rounded-2xl shadow-xl border border-slate-100 hover:bg-emerald-50 transition-colors"
                                            >
                                                <LocateFixed className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* 4. YOUR REVIEW SECTION (NEW) */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <MessageSquareQuote className="h-5 w-5 text-amber-500" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Your First Impression</h3>
                            </div>
                            <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100/50 space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, initial_rating: star })}
                                                className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${formData.initial_rating >= star ? 'bg-amber-400 text-white shadow-lg shadow-amber-200' : 'bg-white text-slate-300 border border-slate-100 hover:border-amber-200'}`}
                                            >
                                                <Star className={`h-6 w-6 ${formData.initial_rating >= star ? 'fill-white' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Review / Comment</label>
                                    <textarea
                                        value={formData.initial_review}
                                        onChange={e => setFormData({ ...formData, initial_review: e.target.value })}
                                        className="w-full h-32 p-6 rounded-2xl border-2 border-slate-100 focus:border-amber-500 focus:bg-white bg-white transition-all outline-none text-base font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                                        placeholder="Tell other Muslims about your experience... (e.g. food quality, halal trust, family friendly?)"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* 5. HALAL SPECIFICS SECTION */}
                        <div className="space-y-8 bg-slate-50/80 p-8 rounded-[2rem] border border-slate-100">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">Halal Status</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {['Full Halal', 'Pork Free', 'Not Halal'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => toggleHalalStatus(s)}
                                            className={`h-14 rounded-2xl text-xs font-black uppercase tracking-widest border-3 transition-all ${formData.halal_statuses.includes(s) ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">Serves Alcohol?</label>
                                    <div className="flex gap-3 h-14 p-1.5 bg-white rounded-2xl border-2 border-slate-100">
                                        <button type="button" onClick={() => setFormData({ ...formData, serves_alcohol: true })} className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.serves_alcohol ? 'bg-red-50 text-red-600 border border-red-100' : 'text-slate-400'}`}>Yes</button>
                                        <button type="button" onClick={() => setFormData({ ...formData, serves_alcohol: false })} className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!formData.serves_alcohol ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-400'}`}>No</button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">Supply Source</label>
                                    <input
                                        value={formData.halal_source}
                                        onChange={e => setFormData({ ...formData, halal_source: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 bg-white transition-all outline-none text-base font-bold text-slate-900"
                                        placeholder="e.g. Al-Falah Butcher, MUIS"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 text-slate-400">
                        {isSubmitting && (
                            <div className="flex items-center gap-3 animate-pulse">
                                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                    {uploadProgress === 'photos' ? 'Uploading Photos...' : uploadProgress === 'database' ? 'Saving Place...' : 'Finalizing...'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <Button variant="ghost" className="h-14 px-8 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-xs" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || duplicateFound}
                            className="min-w-[200px] h-14 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.15em] text-xs rounded-2xl shadow-2xl disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : 'Submit Restaurant'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
