import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { Link } from "wouter";
import { BLOG_POSTS } from "@/lib/data";
import logoUrl from "@assets/hkborah-logo.png";

export default function Journal() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
            <Link href="/">
                <img src={logoUrl} alt="HK Borah" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
            </Link>
            <Link href="/">
                <Button variant="ghost" className="text-slate-400 hover:text-amber-500 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Interface
                </Button>
            </Link>
        </div>

        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <div className="mb-16 text-center">
                <span className="text-amber-500 font-mono text-sm uppercase tracking-widest mb-2 block">The Journal</span>
                <h1 className="text-5xl font-serif font-bold text-slate-100 mb-4">Intelligence Reports</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Thoughts, strategies, and war stories from the front lines of business architecture.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {BLOG_POSTS.map((post) => (
                    <Link key={post.id} href={`/journal/${post.id}`}>
                        <div className="group cursor-pointer space-y-4">
                            <div className="aspect-video overflow-hidden rounded-lg bg-slate-900 relative">
                                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors z-10"></div>
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
                                    <span>{post.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {post.date}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-slate-200 group-hover:text-amber-500 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-400 line-clamp-2 font-light">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-amber-500 text-sm pt-2">
                                    Read Report <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
