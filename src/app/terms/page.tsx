import { Metadata } from 'next';
import { Shield, Lock, FileText, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service | FindHalal',
    description: 'Read our terms of service to understand your rights and responsibilities when using FindHalal.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 sm:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Scale className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service</h1>
                    </div>

                    <div className="prose prose-slate prose-lg max-w-none space-y-8 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-emerald-500" /> 1. Acceptance of Terms
                            </h2>
                            <p>
                                By accessing and using FindHalal (findhalalonly.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-emerald-500" /> 2. Content Accuracy
                            </h2>
                            <p>
                                FindHalal provides information about the halal status of restaurants and businesses based on community reports and owner certifications. While we strive for accuracy, we do not guarantee that the information is always up-to-date or correct. Always verify the halal status with the establishment directly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Users className="h-5 w-5 text-emerald-500" /> 3. User Conduct
                            </h2>
                            <p>
                                Users are responsible for the content they post, including reviews and reports. Any fraudulent or misleading information may result in account termination. We reserve the right to remove any content that violates our community guidelines.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Lock className="h-5 w-5 text-emerald-500" /> 4. Privacy
                            </h2>
                            <p>
                                Your privacy is important to us. Please refer to our <a href="/privacy" className="text-emerald-600 hover:underline font-bold">Privacy Policy</a> to understand how we collect and use your data.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-slate-100">
                            <p className="text-sm text-slate-400 italic">
                                Last updated: May 6, 2026
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Users } from 'lucide-react';
