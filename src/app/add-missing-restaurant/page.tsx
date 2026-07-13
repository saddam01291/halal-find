import { MapPin, Search, ShieldCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export const metadata = {
  title: "Add a Missing Restaurant | Find Halal",
  description: "Help the community by reporting a Halal restaurant that isn't on our map yet.",
};

export default function AddMissingRestaurantPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold mb-6">
            <Search className="h-4 w-4" /> Community Sourced
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Add a <span className="text-emerald-400">Missing Restaurant</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Know a great Halal place that isn't on our map? Help thousands of others find it by submitting it below.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 mb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <ShieldCheck className="h-32 w-32" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 relative z-10">What happens next?</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">We Review It</h4>
                    <p className="text-slate-500 text-sm mt-1">Our team verifies the details and location you provided.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Halal Verification</h4>
                    <p className="text-slate-500 text-sm mt-1">We reach out to the owner or check for valid certification.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Added to Map</h4>
                    <p className="text-slate-500 text-sm mt-1">The restaurant goes live for thousands of users to discover!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-600/20">
              <h3 className="font-bold mb-2">Are you the owner?</h3>
              <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                If you own this restaurant, you can claim and manage your listing directly to add menus, photos, and official certificates.
              </p>
              <Link href="/for-businesses">
                <Button className="w-full bg-white text-emerald-700 hover:bg-slate-100 font-bold rounded-xl h-12">
                  Go to Business Portal
                </Button>
              </Link>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Restaurant Details</h2>
                  <p className="text-slate-500 text-sm">Tell us everything you know about this place.</p>
                </div>
              </div>
              
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Restaurant Name <span className="text-red-500">*</span></label>
                  <Input placeholder="e.g. Al Baik, Kebabistan..." className="h-14 rounded-2xl border-slate-100 focus:border-emerald-500 bg-slate-50/50" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">City <span className="text-red-500">*</span></label>
                    <Input placeholder="e.g. London, Dubai, Mumbai" className="h-14 rounded-2xl border-slate-100 focus:border-emerald-500 bg-slate-50/50" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Neighborhood / Area</label>
                    <Input placeholder="e.g. Downtown" className="h-14 rounded-2xl border-slate-100 focus:border-emerald-500 bg-slate-50/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Address or Google Maps Link</label>
                  <Input placeholder="Paste Google Maps URL or type full address" className="h-14 rounded-2xl border-slate-100 focus:border-emerald-500 bg-slate-50/50" />
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-sm font-bold text-slate-700 ml-1">Halal Status & Additional Info</label>
                  <textarea 
                    className="w-full min-h-[120px] p-4 rounded-2xl border border-slate-100 focus:border-emerald-500 bg-slate-50/50 outline-none transition-all resize-none"
                    placeholder="Is it HMC certified? Muslim owned? Do they serve alcohol? Share any details..."
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button type="button" className="w-full md:w-auto px-10 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-emerald-200 flex items-center justify-center gap-3">
                    <Send className="h-5 w-5" />
                    Submit Restaurant
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
