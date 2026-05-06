import { BLOG_POSTS } from '../../lib/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ChevronRight, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FindHalal Blog | Halal Food Guides, Travel Tips & News',
    description: 'Explore our latest articles on finding halal food, travel guides, and community news from the world of halal dining.',
};

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 sm:py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold mb-6">
                        <BookOpen className="h-4 w-4" />
                        Our Latest Insights
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">FindHalal</span> Blog
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Expert guides, travel tips, and community stories to help you navigate the world of Halal dining with confidence.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {BLOG_POSTS.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
                            <article className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500 flex flex-col h-full">
                                <div className="h-64 relative overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3 w-3" /> {post.author}
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                        {post.description}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Read More</span>
                                        <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
