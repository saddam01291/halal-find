import { Metadata } from 'next';
import { BookOpen, CheckCircle, Globe, Award, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Halal Certification Guide | FindHalal Education',
    description: 'A comprehensive guide to understanding halal certification, logos, and global standards.',
};

export default function HalalGuidePage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 sm:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Understanding Halal Certification</h1>
                    </div>

                    <div className="prose prose-slate prose-lg max-w-none space-y-12 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">What is Halal?</h2>
                            <p>
                                "Halal" is an Arabic word meaning "permissible." In the context of food, it refers to items that are prepared and consumed according to Islamic dietary laws as defined in the Quran.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-12">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <CheckCircle className="h-6 w-6 text-emerald-500 mb-4" />
                                <h3 className="font-bold text-slate-900 mb-2">Permissible (Halal)</h3>
                                <ul className="text-sm space-y-2">
                                    <li>Vegetables and fruits</li>
                                    <li>Grains and nuts</li>
                                    <li>Meat slaughtered according to Zabiha</li>
                                    <li>Most seafood</li>
                                </ul>
                            </div>
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                <HelpCircle className="h-6 w-6 text-red-500 mb-4" />
                                <h3 className="font-bold text-slate-900 mb-2">Prohibited (Haram)</h3>
                                <ul className="text-sm space-y-2">
                                    <li>Pork and its by-products</li>
                                    <li>Alcohol and intoxicants</li>
                                    <li>Blood and carnivorous animals</li>
                                    <li>Non-Zabiha meat</li>
                                </ul>
                            </div>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Award className="h-6 w-6 text-amber-500" /> Why Certification Matters
                            </h2>
                            <p>
                                In a globalized food supply chain, it is increasingly difficult for consumers to track the source of every ingredient. Halal certification provides a third-party guarantee that the entire supply chain—from slaughter to processing—adheres to strict standards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Globe className="h-6 w-6 text-emerald-500" /> Global Standards
                            </h2>
                            <p>
                                While the core principles of Halal are universal, certification bodies can vary by region. Common organizations include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>HMC (Halal Monitoring Committee)</strong> - Highly regarded for strict on-site monitoring in the UK.</li>
                                <li><strong>JAKIM</strong> - The official Malaysian government body, recognized globally for its high standards.</li>
                                <li><strong>HFCE (Halal Food Council of Europe)</strong> - A leading certifier across European nations.</li>
                                <li><strong>IFANCA</strong> - One of the oldest and most trusted certifiers in North America.</li>
                            </ul>
                        </section>

                        <div className="bg-emerald-900 text-white p-8 rounded-3xl mt-12">
                            <h3 className="text-xl font-bold mb-4">Our Commitment</h3>
                            <p className="text-emerald-100/80">
                                At FindHalal, we prioritize listings with clear, verifiable certification from these bodies. We encourage all users to upload photos of certifications when visiting restaurants to help keep our database accurate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
