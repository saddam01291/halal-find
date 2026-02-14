'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { X, Upload, Building2 } from 'lucide-react';

interface AddPlaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddPlaceModal({ isOpen, onClose }: AddPlaceModalProps) {
    const { user } = useAuth();
    const [isOwner, setIsOwner] = useState(user?.role === 'owner');
    const [formData, setFormData] = useState({
        name: '',
        cuisine: '',
        address: '',
        image: null
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            onClose();
            alert(isOwner ? 'Restaurant submitted for verification!' : 'Thank you for your contribution!');
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Add a Halal Place</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="flex gap-4 mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="ownership"
                                checked={!isOwner}
                                onChange={() => setIsOwner(false)}
                                className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Generic User</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="ownership"
                                checked={isOwner}
                                onChange={() => setIsOwner(true)}
                                className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-slate-700">I am the Owner</span>
                        </label>
                    </div>

                    {isOwner && (
                        <div className="bg-amber-50 border border-amber-100 text-amber-800 px-4 py-3 rounded-md text-sm mb-4 flex items-start gap-2">
                            <Building2 className="h-5 w-5 flex-shrink-0" />
                            <p>Owners must provide a valid Halal certificate for verification. Your listing will be marked as <strong>Owner Verified</strong>.</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Restaurant Name</label>
                        <input
                            type="text"
                            required
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. Sultan's Dine"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cuisine</label>
                            <input
                                type="text"
                                required
                                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="e.g. Turkish"
                                value={formData.cuisine}
                                onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                            <input
                                type="text"
                                required
                                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="e.g. New York"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    {isOwner && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Certificate</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer transition-colors block w-full">
                                <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                                <span className="text-sm text-slate-500">Certificate PDF/Image</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {isOwner ? 'Submit for Verification' : 'Add to Community'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
