import Link from 'next/link';
import { MapPin, PlusCircle, Mail } from 'lucide-react';

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
                            <li><Link href="/search" className="hover:text-emerald-400 transition-colors">Explore Places</Link></li>
                            <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">FindHalal Blog</Link></li>
                            <li><Link href="/how-we-verify-halal" className="hover:text-emerald-400 transition-colors">How We Verify</Link></li>
                            <li><Link href="/halal-certification-guide" className="hover:text-emerald-400 transition-colors">Halal Guide</Link></li>
                            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
                            <li><Link href="/sitemap.xml" className="hover:text-amber-400 transition-colors font-bold">XML Sitemap</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">For Business</h4>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-6 sm:mb-8">
                            <li><Link href="#" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"><PlusCircle className="h-4 w-4" /> List your restaurant (Free)</Link></li>
                        </ul>
                        
                        <h4 className="text-white font-semibold mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Stay Updated</h4>
                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">Get notified when new verified halal spots open near you.</p>
                        <form className="flex" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
                            <input type="email" placeholder="Email address" className="bg-slate-800 border border-slate-700 text-white text-xs rounded-l-lg px-3 py-2 w-full focus:outline-none focus:border-emerald-500" required />
                            <button type="submit" className="bg-emerald-600 text-white px-3 py-2 rounded-r-lg text-xs font-bold hover:bg-emerald-500 transition-colors">Subscribe</button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-6 sm:mt-10 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-xs">
                    <p>&copy; {new Date().getFullYear()} FindHalal. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
