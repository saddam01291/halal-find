'use client';

import { CheckCircle2, TrendingUp, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { LoginModal } from '@/components/auth/LoginModal';

export default function ForBusinesses() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-500 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Grow Your <span className="text-emerald-400">Halal Business</span> with Us
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join the world's most trusted Halal dining platform. Help thousands of families eat Halal only by providing verified dining experiences.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-lg rounded-xl shadow-xl shadow-emerald-500/20"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            Get Started Now
                        </Button>
                        <Link href="#how-it-works">
                            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 h-14 px-8 text-lg rounded-xl">
                                See How It Works
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Partner with Find Halal?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We bridge the gap between Halal restaurants and food-conscious consumers worldwide.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users className="h-8 w-8 text-emerald-600" />,
                                title: "Reach 50,000+ Foodies",
                                desc: "Get visible to a massive community of Halal food enthusiasts actively looking for their next meal."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8 text-amber-600" />,
                                title: "Build Unmatched Trust",
                                desc: "Our 'Verified' badge tells customers your Halal status is 100% authentic and owner-confirmed."
                            },
                            {
                                icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
                                title: "Boost Your Revenue",
                                desc: "Restaurants on our platform see a significant increase in foot traffic and online discovery."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-6 p-3 bg-slate-50 inline-block rounded-xl">{item.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                                Simple 3-Step Process<br />
                                to Get <span className="text-emerald-600">Verified</span>
                            </h2>

                            <div className="space-y-8">
                                {[
                                    { step: "01", title: "Create Your Profile", desc: "Sign up and add your restaurant details, cuisine, and beautiful photos." },
                                    { step: "02", title: "Upload Certificate", desc: "Provide your Halal certification for our admin team to review and verify." },
                                    { step: "03", title: "Go Live & Thrive", desc: "Once verified, your restaurant appears with a blue checkmark, attracting more customers." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="text-4xl font-black text-slate-100 select-none">{item.step}</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                                            <p className="text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Owner Verified Badge
                                </div>
                                <h3 className="text-3xl font-bold mb-6">Join a mission that matters.</h3>
                                <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                                    "Helping thousands to eat Halal food only. Your listing ensures families can dine out with confidence and spiritual peace."
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-emerald-400">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Increased Community Trust</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-emerald-400">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Higher Quality Reviews</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-emerald-400">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span>Direct Business Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-emerald-600">
                <div className="container mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to serve the community?</h2>
                    <Button
                        size="lg"
                        className="bg-white text-emerald-700 hover:bg-slate-100 hover:text-emerald-800 px-10 h-16 text-xl rounded-2xl shadow-2xl"
                        onClick={() => setIsLoginOpen(true)}
                    >
                        Register Your Restaurant <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                    <p className="mt-8 text-emerald-100 font-medium italic">
                        "Your contribution helps thousands of Muslim families eat Halal and pure food."
                    </p>
                </div>
            </section>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    );
}
