import { Heart, Users, ShieldCheck, MapPin, Target, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "About Us | Find Halal - Our Mission and Vision",
  description: "Learn about Find Halal, our mission to help thousands eat pure Halal food, and how we build trust in the Muslim community.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Heart className="h-4 w-4 fill-emerald-400" />
            Driven by Purpose
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Our Mission is to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Simplify Halal Living</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Find Halal started with a simple belief: finding trusted Halal food should be effortless. 
            We are building the definitive bridge between honest Halal businesses and conscious consumers.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Helping thousands to <br />
                <span className="text-emerald-600">eat Halal only</span>.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                In a world where transparency is often lacking, Find Halal provides a beacon of trust. 
                We combine owner-provided certifications with community-driven validation to create a 
                living database of authenticated dining experiences.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    icon: <Target className="h-6 w-6 text-emerald-600" />,
                    title: "Precision Content",
                    desc: "We prioritize actual proof over claims, ensuring every listing meets high transparency standards."
                  },
                  {
                    icon: <Users className="h-6 w-6 text-amber-600" />,
                    title: "Community First",
                    desc: "Your voice matters. Our platform thrives on the shared experiences of thousands of users."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-emerald-600 rounded-[3rem] p-12 text-white relative z-10 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Award className="h-32 w-32" />
                </div>
                <h3 className="text-3xl font-bold mb-6 italic">"A small step for a family, a giant leap for the Ummah."</h3>
                <p className="text-emerald-100 text-lg mb-8">
                  Our platform isn't just about discovery; it's about peace of mind. 
                  Knowing that your next meal is pure and Halal allows you to focus 
                  on what matters most—sharing moments with loved ones.
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500 border border-emerald-400 flex items-center justify-center font-bold">FH</div>
                  <div>
                    <div className="font-bold">Find Halal Core Team</div>
                    <div className="text-emerald-200 text-sm font-medium">halal.food@findhalalonly.com</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-amber-100 rounded-[3rem] -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-16 uppercase tracking-widest text-sm">Our Reach by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Verified Places", value: "5,000+" },
              { label: "Foodie Users", value: "25k+" },
              { label: "Community Reviews", value: "50k+" },
              { label: "Countries", value: "12+" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl md:text-5xl font-black text-emerald-600 tracking-tighter">{stat.value}</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <ShieldCheck className="h-16 w-16 text-emerald-600 mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-slate-900 mb-8">Join the Movement</h2>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed">
            Whether you are a diner looking for your next favorite spot or a business owner 
            who takes pride in serving Halal, you have a place here. Together, we can 
            ensure that no one has to compromise on their values when dining out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <button className="px-8 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all">
                Explore Verified Places
              </button>
            </Link>
            <Link href="/for-businesses">
              <button className="px-8 h-14 bg-white border-2 border-slate-100 hover:border-emerald-600 hover:text-emerald-600 text-slate-600 font-bold rounded-2xl transition-all">
                Add Your Restaurant
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
