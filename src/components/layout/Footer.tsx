import Link from 'next/link';
import { MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-8 sm:py-12 mt-12 sm:mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
                            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-emerald-600">
                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                            </div>
                            <span className="text-base sm:text-lg font-bold text-white">Find<span className="text-emerald-400">Halal</span></span>
                        </Link>
                        <p className="text-xs sm:text-sm leading-relaxed max-w-sm">
                            Discover the best Halal restaurants and food near you. Verified by owners, trusted by community.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                            <li><Link href="/search" className="hover:text-emerald-400 transition-colors flex items-center gap-1">Explore Places</Link></li>
                            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Get in Touch</h4>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                            <li>
                                <p className="text-[9px] sm:text-[10px] uppercase font-black text-slate-500 mb-0.5 sm:mb-1">WhatsApp / Call</p>
                                <a href="tel:8371962838" className="text-white font-bold hover:text-emerald-400 transition-colors">8371962838</a>
                            </li>
                            <li>
                                <p className="text-[9px] sm:text-[10px] uppercase font-black text-slate-500 mb-0.5 sm:mb-1">Email</p>
                                <div className="flex flex-col gap-0.5 sm:gap-1">
                                    <a href="mailto:halal.food@findhalalonly.com" className="hover:text-amber-400 transition-colors truncate text-[11px] sm:text-sm">halal.food@findhalalonly.com</a>
                                    <a href="mailto:saddam.entr.91@gmail.com" className="hover:text-amber-400 transition-colors truncate text-[11px] sm:text-sm">saddam.entr.91@gmail.com</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-6 sm:mt-10 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-xs">
                    <p>&copy; {new Date().getFullYear()} FindHalal. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
