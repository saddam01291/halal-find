'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { addPlace, submitVerificationRequest, uploadImage } from '@/lib/api';
import { X, Upload, Building2, Loader2, Info } from 'lucide-react';

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
        halal_status: 'Full Halal',
        serves_alcohol: false,
        halal_source: ''
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [certFile, setCertFile] = useState<File | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // 1. Image Uploads
            let imageUrl = '';
            let certUrl = '';

            if (imageFile) {
                imageUrl = await uploadImage(imageFile) || '';
            }
            if (certFile) {
                certUrl = await uploadImage(certFile) || '';
            }

            // 2. Create Restaurant
            const newPlace = await addPlace({
                name: formData.name,
                cuisine: formData.cuisine,
                address: formData.address || formData.city,
                city: formData.city,
                image: imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
                lat: 0,
                lng: 0,
                tags: ['Halal', formData.cuisine, formData.halal_status],
                is_mixed_neighborhood: false,
                halal_status: formData.halal_status as any,
                serves_alcohol: formData.serves_alcohol,
                halal_source: formData.halal_source
            });

            // 3. Create Verification
            if (newPlace) {
                await submitVerificationRequest({
                    restaurant_name: formData.name,
                    owner_name: user?.full_name || 'Contributor',
                    certificate_url: certUrl,
                    place_id: newPlace.id,
                    type: isOwner ? 'claim' : 'community_addition'
                });
            }

            alert(isOwner ? 'Restaurant submitted! Admin will verify soon.' : 'Thank you! Added for community review.');
            onClose();
        } catch (error) {
            console.error('Submission error:', error);
            alert('Could not submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-none">Add a Halal Place</h2>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
                        <X className="h-6 w-6 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* User Type */}
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsOwner(false)}
                            className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isOwner ? 'bg-white text-slate-900 shadow-sm shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Generic User
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOwner(true)}
                            className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isOwner ? 'bg-white text-emerald-600 shadow-sm shadow-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            I am Owner
                        </button>
                    </div>

                    {isOwner && (
                        <div className="flex gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 items-start">
                            <Building2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <p className="text-xs font-bold leading-relaxed">Owner listings are prioritized. Please provide your business details and any proof of Halal certification.</p>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all outline-none text-sm font-bold"
                                placeholder="e.g. Sultan's Dine"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cuisine Type</label>
                                <input
                                    required
                                    value={formData.cuisine}
                                    onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all outline-none text-sm font-bold"
                                    placeholder="e.g. Turkish"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                <input
                                    required
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all outline-none text-sm font-bold"
                                    placeholder="e.g. London"
                                />
                            </div>
                        </div>

                        {/* Halal Status - CRITICAL FIELD */}
                        <div className="space-y-3 pt-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                Halal Classification <Info className="h-3 w-3 text-slate-300" />
                            </label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {['Full Halal', 'Halal Menu', 'Pork Free', 'Not Halal'].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, halal_status: s })}
                                        className={`py-2.5 px-1 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.halal_status === s
                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alcohol Serve?</label>
                                <div className="flex gap-2 h-12 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                    <button type="button" onClick={() => setFormData({ ...formData, serves_alcohol: true })} className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${formData.serves_alcohol ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>Yes</button>
                                    <button type="button" onClick={() => setFormData({ ...formData, serves_alcohol: false })} className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${!formData.serves_alcohol ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>No</button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Halal Proof</label>
                                <input
                                    value={formData.halal_source}
                                    onChange={e => setFormData({ ...formData, halal_source: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white bg-slate-50/50 transition-all outline-none text-sm font-bold"
                                    placeholder="e.g. Muslim Hand"
                                />
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Restaurant Photo</label>
                                <label className="flex flex-col items-center justify-center min-h-[100px] border-2 border-dashed border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-all cursor-pointer bg-white group shadow-sm">
                                    <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors mb-2">
                                        <Upload className={`h-5 w-5 ${imageFile ? 'text-emerald-600' : 'text-emerald-400'}`} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                        {imageFile ? imageFile.name.substring(0, 20) : 'Add Restaurant Photo'}
                                    </span>
                                    <span className="text-[8px] text-slate-400 mt-1 font-bold uppercase">(Optional but recommended)</span>
                                </label>
                            </div>
                            {isOwner && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Hallal Certificate</label>
                                    <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-amber-200 rounded-2xl hover:bg-amber-50 transition-colors cursor-pointer bg-amber-50/20 group">
                                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => setCertFile(e.target.files?.[0] || null)} />
                                        <Upload className={`h-5 w-5 ${certFile ? 'text-amber-500' : 'text-amber-300'} group-hover:scale-110 transition-transform`} />
                                        <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.2em] mt-1">
                                            {certFile ? certFile.name.substring(0, 15) : 'Upload Official'}
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                    <Button variant="ghost" className="flex-1 h-12 rounded-xl text-slate-500 font-bold" onClick={onClose}>Discard</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-[2] h-12 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Submission'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
