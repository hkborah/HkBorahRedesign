import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { BLOG_POSTS } from "@/lib/data";
import logoUrl from "@assets/hkborah-logo.png";
import blueprintImg from "@assets/generated_images/blueprint_architecture_framework_design.png";
import sixSigmaImg from "@assets/generated_images/six_sigma_manufacturing_process_flow.png";
import boardMeetingImg from "@assets/generated_images/strategic_board_meeting_collaboration.png";
import { motion } from "framer-motion";

const imageMap: { [key: string]: string } = {
  "1": blueprintImg,
  "2": sixSigmaImg,
  "3": boardMeetingImg,
};

export default function Journal() {
  const featuredPost = BLOG_POSTS?.[0];
  const remainingPosts = BLOG_POSTS?.slice(1) || [];
  
  const getImage = (postId: string) => {
    return imageMap[postId] || "";
  };

  if (!featuredPost) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
          <p className="text-slate-400">No blog posts available</p>
        </div>
      </MainLayout>
    );
  }

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

        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
                <span className="text-amber-500 font-mono text-sm uppercase tracking-widest mb-2 block">The Journal</span>
                <h1 className="text-5xl font-serif font-bold text-slate-100 mb-4">Intelligence Reports</h1>
                <p className="text-slate-400 max-w-2xl mx-auto font-light">
                    Thoughts, strategies, and war stories from the front lines of business architecture.
                </p>
            </motion.div>

            {/* Featured Post */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-16"
            >
               <Link href={`/journal/${featuredPost.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-amber-500/50 transition-all duration-500 cursor-pointer">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="h-64 lg:h-auto overflow-hidden relative">
                              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors z-10"></div>
                              <img 
                                  src={getImage(featuredPost.id)} 
                                  alt={featuredPost.title} 
                                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                              />
                          </div>
                          <div className="p-8 lg:p-12 flex flex-col justify-center">
                              <div className="flex items-center gap-3 mb-4">
                                  <span className="bg-amber-500/10 text-amber-500 text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border border-amber-500/20">
                                      Featured Intelligence
                                  </span>
                                  <span className="text-slate-500 text-xs font-mono uppercase">{featuredPost.date}</span>
                              </div>
                              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-4 group-hover:text-amber-500 transition-colors">
                                  {featuredPost.title}
                              </h2>
                              <p className="text-slate-400 text-lg font-light mb-6 line-clamp-3">
                                  {featuredPost.excerpt}
                              </p>
                              <div className="flex items-center gap-2 text-amber-500 font-medium group-hover:translate-x-2 transition-transform">
                                  Read Full Report <ArrowRight className="h-4 w-4" />
                              </div>
                          </div>
                      </div>
                  </div>
               </Link>
            </motion.div>

            {/* Grid of Remaining Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                    >
                        <Link href={`/journal/${post.id}`}>
                            <div className="group cursor-pointer h-full flex flex-col bg-slate-900/20 border border-slate-800/50 rounded-xl overflow-hidden hover:border-slate-700 hover:bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/5">
                                <div className="aspect-video overflow-hidden relative bg-slate-900">
                                    <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={getImage(post.id)} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                                        <span>{post.date}</span>
                                    </div>
                                    <h2 className="text-xl font-serif font-bold text-slate-200 group-hover:text-amber-500 transition-colors mb-3 leading-snug">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm font-light line-clamp-3 mb-4 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-500 text-xs group-hover:text-amber-500 transition-colors mt-auto pt-4 border-t border-slate-800/50">
                                        Read Report <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
