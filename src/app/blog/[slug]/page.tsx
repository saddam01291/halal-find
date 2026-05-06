import { getBlogPost, BLOG_POSTS } from '../../../lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPost(slug);

    if (!post) {
        return { title: 'Post Not Found | FindHalal' };
    }

    return {
        title: `${post.title} | FindHalal Blog`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: [{ url: post.image }],
            type: 'article',
        },
    };
}

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPost(slug);

    if (!post) {
        return notFound();
    }

    // Article Schema
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: post.image,
        datePublished: post.date,
        author: {
            '@type': 'Organization',
            name: 'FindHalal'
        },
        publisher: {
            '@type': 'Organization',
            name: 'FindHalal',
            logo: {
                '@type': 'ImageObject',
                url: 'https://findhalalonly.com/favicon.ico'
            }
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            {/* Breadcrumbs */}
            <div className="bg-slate-50 border-b border-slate-100 py-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-slate-900 truncate max-w-[150px] sm:max-w-none">{post.title}</span>
                    </nav>
                </div>
            </div>

            <article className="py-12 sm:py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Meta Header */}
                    <div className="text-center mb-12 sm:mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            {post.category}
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-tight px-2">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-emerald-500" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-emerald-500" /> {post.author}
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative h-[30vh] sm:h-[50vh] md:h-[60vh] w-full rounded-[2.5rem] overflow-hidden mb-12 sm:mb-20 shadow-2xl">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div 
                        className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:font-bold hover:prose-a:text-emerald-700 prose-strong:text-slate-900"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Footer Actions */}
                    <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
                        <Link href="/blog" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Share this guide</span>
                            {/* Simple placeholder for share icons if needed */}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
