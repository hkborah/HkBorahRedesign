import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BLOG_POSTS } from "@/lib/data";
// Import images from attached assets
import logoUrl from "@assets/hkborah-logo.png";
import bookCoverUrl from "@assets/book-cover-order-of-chaos.png";

export function IntelligenceSidebar() {
  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-12 relative border-r border-slate-900/50">
      {/* Branding Section */}
      <div className="space-y-8 z-10">
        <Link href="/">
          <img src={logoUrl} alt="HK Borah" className="h-12 object-contain opacity-90 hover:opacity-100 transition-opacity cursor-pointer" />
        </Link>
        
        <div className="mt-24 space-y-4">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-slate-100 leading-tight">
            Chaos is a <br />
            <span className="text-amber-500">Symptom.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed">
            An enduring company is not stumbled upon. It is architected.
          </p>
        </div>
      </div>

      {/* Latest Intelligence Feed */}
      <div className="mt-12 z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px w-4 bg-amber-500"></div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Latest Intelligence</span>
        </div>

        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-6">
            {BLOG_POSTS.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="group cursor-pointer"
              >
                <Link href={`/journal/${post.id}`}>
                  <div className="flex gap-4 items-start hover:bg-slate-900/40 p-2 rounded-lg transition-colors">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-slate-800">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-200 group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-light leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <Link href="/journal">
          <div className="mt-6 flex items-center gap-2 text-xs font-mono text-amber-500 hover:text-amber-400 cursor-pointer group">
            <span>VIEW FULL JOURNAL</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Manual Link */}
        <div className="mt-8 pt-8 border-t border-slate-900">
          <a href="https://notionpress.com/in/read/the-order-of-chaos" target="_blank" rel="noreferrer" className="group cursor-pointer block">
            <div className="grid grid-cols-[1fr_120px] gap-4 items-start">
              {/* Text Section */}
              <div>
                <h4 className="font-serif text-lg text-slate-300 mb-1 group-hover:text-amber-500 transition-colors">The Order of Chaos</h4>
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-3">Founder's Blueprint</span>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-500 group-hover:text-amber-400 transition-colors">
                  <span>ACQUIRE THE MANUAL</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Book Cover Thumbnail */}
              <div className="w-full h-auto">
                <img 
                  src={bookCoverUrl}
                  alt="The Order of Chaos"
                  className="w-full h-auto rounded border border-amber-500/30 shadow-lg shadow-amber-900/20 group-hover:shadow-amber-900/40 group-hover:border-amber-500/60 transition-all"
                />
              </div>
            </div>
          </a>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-slate-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-900/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
