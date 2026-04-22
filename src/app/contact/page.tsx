import { Mail, MessageSquare, MapPin, Send, Globe, Github, Twitter, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const metadata = {
  title: "Contact Us | Find Halal - Get in Touch",
  description: "Have questions or feedback? Contact the Find Halal team. We're here to help you find the best Halal food.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Get in <span className="text-emerald-400">Touch</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Have a question, feedback, or want to partner with us? Our team is ready to hear from you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 mb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-500 text-sm mb-4">For general inquiries and support.</p>
              <div className="flex flex-col gap-1">
                <a href="mailto:halal.food@findhalalonly.com" className="text-emerald-600 font-bold hover:underline">halal.food@findhalalonly.com</a>
                <a href="mailto:saddam.entr.91@gmail.com" className="text-emerald-600 font-bold hover:underline">saddam.entr.91@gmail.com</a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Call/WhatsApp</h3>
              <p className="text-slate-500 text-sm mb-4">Available for urgent verification support.</p>
              <a href="tel:+918371962838" className="text-amber-600 font-bold hover:underline">+91 8371962838</a>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Social Hub</h3>
              <p className="text-slate-500 text-sm mb-6">Follow our journey on social media.</p>
              <div className="flex gap-4">
                <button className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                  <Github className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <Input placeholder="John Doe" className="h-14 rounded-2xl border-slate-100 focus:border-emerald-500 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <Input type="email" placeholder="john@example.com" className="h-14 rounded-2xl border-slate-100 focus:border-emerald-500 bg-slate-50/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                  <Input placeholder="How can we help?" className="h-14 rounded-2xl border-slate-100 focus:border-emerald-500 bg-slate-50/50" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                  <textarea 
                    className="w-full min-h-[200px] p-4 rounded-2xl border border-slate-100 focus:border-emerald-500 bg-slate-50/50 outline-none transition-all resize-none"
                    placeholder="Tell us more about what's on your mind..."
                  />
                </div>

                <Button className="w-full md:w-auto px-12 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-emerald-200 flex items-center gap-3">
                  <Send className="h-5 w-5" />
                  Send Message
                </Button>
                
                <p className="text-center text-xs text-slate-400 pt-4">
                  By clicking send, you agree to our <button className="underline">Terms of Service</button> and <button className="underline">Privacy Policy</button>.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>


    </div>
  );
}
