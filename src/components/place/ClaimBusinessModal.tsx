'use client';

import { useState } from 'react';
import { X, Building2, Phone, Mail, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { claimBusiness, uploadImage } from '@/lib/api';

interface ClaimBusinessModalProps {
    isOpen: boolean;
    onClose: () => void;
    placeId: string;
    placeName: string;
    placeCity?: string;
    placeAddress?: string;
    placeVerificationStatus?: string;
}

type Step = 'form' | 'submitting' | 'success' | 'error';

export function ClaimBusinessModal({
    isOpen,
    onClose,
    placeId,
    placeName,
    placeCity,
    placeAddress,
    placeVerificationStatus,
}: ClaimBusinessModalProps) {
    const { user } = useAuth();

    const [step, setStep] = useState<Step>('form');
    const [errorMessage, setErrorMessage] = useState('');
    const [certificateFile, setCertificateFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        ownerName: '',
        phone: '',
        email: '',
        halalStatus: 'Full Halal',
        halalSource: '',
        message: '',
    });

    if (!isOpen) return null;

    // Guard: already owner-verified
    if (placeVerificationStatus === 'owner_verified') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                    <div className="p-10 text-center space-y-6">
                        <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck className="h-10 w-10 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Already Claimed</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                <strong>{placeName}</strong> has already been verified by its owner. If you believe this is incorrect, please{' '}
                                <a href="/contact" className="text-emerald-600 underline">contact our support team</a>.
                            </p>
                        </div>
                        <Button onClick={onClose} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black">
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setErrorMessage('Please sign in to claim your business.');
            setStep('error');
            return;
        }

        if (!formData.ownerName.trim()) {
            setErrorMessage('Please enter your full name as the business owner.');
            return;
        }

        if (!formData.phone.trim() && !formData.email.trim()) {
            setErrorMessage('Please provide at least a phone number or email address for verification.');
            return;
        }

        setStep('submitting');
        setErrorMessage('');

        try {
            // Upload halal certificate if provided
            let certificateUrl: string | undefined;
            if (certificateFile) {
                try {
                    certificateUrl = await uploadImage(certificateFile);
                } catch (uploadErr) {
                    console.warn('Certificate upload failed, continuing without it:', uploadErr);
                }
            }

            const result = await claimBusiness({
                placeId,
                placeName,
                ownerName: formData.ownerName.trim(),
                phone: formData.phone.trim() || undefined,
                email: formData.email.trim() || undefined,
                halalStatus: formData.halalStatus,
                halalSource: formData.halalSource.trim() || undefined,
                certificateUrl,
                initialReview: formData.message.trim() || undefined,
            });

            if (result.success) {
                setStep('success');
            } else {
                setErrorMessage(result.message);
                setStep('error');
            }
        } catch (err: any) {
            console.error('Claim submission error:', err);
            setErrorMessage(err?.message || 'Something went wrong. Please try again.');
            setStep('error');
        }
    };

    if (step === 'success') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white rounded-[3rem] p-12 text-center max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3">Claim Submitted!</h2>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        Your ownership claim for <strong>{placeName}</strong> is under review.
                        Our team will verify and respond within <strong>2–3 business days</strong>.
                    </p>
                    <Button
                        onClick={onClose}
                        className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black"
                    >
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-8 duration-500">

                {/* Header */}
                <div className="flex justify-between items-start px-10 pt-10 pb-6 border-b border-slate-100">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Business Claim
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">Own this Restaurant?</h2>
                        <p className="text-slate-400 text-sm font-bold mt-1 max-w-xs">
                            Claim <span className="text-slate-700">{placeName}</span> in{' '}
                            {placeCity || 'your city'} to manage your listing and get verified.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all bg-slate-50 border border-slate-100 active:scale-95 mt-1"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Current listing reference */}
                {placeAddress && (
                    <div className="mx-10 mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Listing Address</p>
                            <p className="text-sm font-bold text-slate-700">{placeAddress}</p>
                        </div>
                    </div>
                )}

                {/* Error Banner */}
                {step === 'error' && errorMessage && (
                    <div className="mx-10 mt-4 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-red-700">{errorMessage}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 py-6 space-y-5">

                    {/* Owner Name */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Your Full Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <input
                                required
                                value={formData.ownerName}
                                onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                                className="w-full h-14 pl-12 pr-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-base font-bold text-slate-900"
                                placeholder="As it appears on official documents"
                            />
                        </div>
                    </div>

                    {/* Phone + Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                <input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full h-13 pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                    placeholder="+91 98765 43210"
                                    type="tel"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Business Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                <input
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-13 pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900"
                                    placeholder="contact@restaurant.com"
                                    type="email"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Halal Status */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Halal Certification Type
                        </label>
                        <select
                            value={formData.halalStatus}
                            onChange={e => setFormData({ ...formData, halalStatus: e.target.value })}
                            className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-base font-bold text-slate-900 appearance-none"
                        >
                            <option value="Full Halal">Full Halal (All items)</option>
                            <option value="Halal Certified">Halal Certified by Authority</option>
                            <option value="Partially Halal">Partially Halal (select items)</option>
                            <option value="Muslim-Owned">Muslim-Owned (no cert)</option>
                        </select>
                    </div>

                    {/* Halal Source */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Certifying Authority / Source
                        </label>
                        <input
                            value={formData.halalSource}
                            onChange={e => setFormData({ ...formData, halalSource: e.target.value })}
                            className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-base font-bold text-slate-900"
                            placeholder="e.g. Jamiat Ulama-e-Hind, HFCI"
                        />
                    </div>

                    {/* Certificate Upload */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Halal Certificate / Trade License (Optional)
                        </label>
                        <label className={`flex items-center gap-4 h-14 px-5 rounded-2xl border-2 cursor-pointer transition-all ${certificateFile ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>
                            <Upload className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm font-bold truncate">
                                {certificateFile ? certificateFile.name : 'Upload document or photo'}
                            </span>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={e => setCertificateFile(e.target.files?.[0] || null)}
                            />
                            {certificateFile && (
                                <button
                                    type="button"
                                    onClick={e => { e.preventDefault(); setCertificateFile(null); }}
                                    className="ml-auto text-emerald-600 hover:text-red-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </label>
                        <p className="text-[10px] text-slate-400 ml-1 font-bold">
                            Accepted: Images (JPG, PNG, WebP) or PDF. Max 5 MB.
                        </p>
                    </div>

                    {/* Additional Message */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            Additional Note to Admin (Optional)
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="w-full h-24 px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                            placeholder="Any additional details that prove you own this business..."
                        />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                        <p className="text-xs text-blue-700 font-bold leading-relaxed">
                            🔒 <strong>How Claiming Works:</strong> Our team will verify your ownership
                            within 2–3 business days. Once approved, your listing will display an
                            &quot;Owner Verified&quot; badge and you can manage it directly from your dashboard.
                        </p>
                    </div>
                </form>

                {/* Submit Footer */}
                <div className="px-10 pb-10 pt-4 bg-white border-t border-slate-50">
                    <Button
                        onClick={handleSubmit}
                        disabled={step === 'submitting' || !formData.ownerName.trim()}
                        className="w-full h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-emerald-900/10 transition-all active:scale-95 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-200 disabled:text-slate-400"
                    >
                        {step === 'submitting' ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Submitting Claim...</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="h-5 w-5" />
                                <span>Submit Ownership Claim</span>
                            </>
                        )}
                    </Button>
                    <p className="text-center text-[10px] uppercase font-black tracking-widest text-slate-400 mt-3">
                        Reviewed within 2–3 business days
                    </p>
                </div>
            </div>
        </div>
    );
}
