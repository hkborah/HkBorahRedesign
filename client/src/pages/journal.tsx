import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, Sparkles, Heart, Share2 } from "lucide-react";
import { Link } from "wouter";
import { BLOG_POSTS } from "@/lib/data";
import * as React from "react";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import blueprintImg from "@assets/generated_images/blueprint_architecture_framework_design.png";
import sixSigmaImg from "@assets/generated_images/six_sigma_manufacturing_process_flow.png";
import boardMeetingImg from "@assets/generated_images/strategic_board_meeting_collaboration.png";
import { motion } from "framer-motion";
import { ShareDropdown } from "@/components/share-dropdown";
import { LikeButton } from "@/components/like-button";

// Map @assets paths to imported images
const imageAssetMap: Record<string, string> = {
  "@assets/generated_images/blueprint_architecture_framework_design.png": blueprintImg,
  "@assets/generated_images/six_sigma_manufacturing_process_flow.png": sixSigmaImg,
  "@assets/generated_images/strategic_board_meeting_collaboration.png": boardMeetingImg,
};

// Helper to resolve image path - handles @assets paths, base64, and URLs
function resolveImagePath(imagePath: string | undefined): string {
  if (!imagePath) return "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800";
  if (imagePath.startsWith("data:")) return imagePath; // base64
  if (imagePath.startsWith("http")) return imagePath; // URL
  if (imagePath.startsWith("@assets")) {
    return imageAssetMap[imagePath] || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800";
  }
  return imagePath;
}

export default function Journal() {
  const [posts, setPosts] = React.useState<Array<typeof BLOG_POSTS[number] & { likes?: number }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const postsPerPage = 6;

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog/posts");
        if (response.ok) {
          const data = await response.json();
          // Use API posts directly - no fallback to avoid duplicates
          setPosts(data && data.length > 0 ? data : []);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredPost = posts?.[0];
  const remainingPosts = posts?.slice(1) || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage);
  const startIdx = (currentPage - 1) * postsPerPage;
  const endIdx = startIdx + postsPerPage;
  const paginatedPosts = remainingPosts.slice(startIdx, endIdx);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const getImage = (post: any) => {
    return resolveImagePath(post.image);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
          <p className="text-slate-400">Loading reports...</p>
        </div>
      </MainLayout>
    );
  }

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
                                  src={getImage(featuredPost)} 
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
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-amber-500 font-medium group-hover:translate-x-2 transition-transform">
                                      Read Full Report <ArrowRight className="h-4 w-4" />
                                  </div>
                                  <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                                      <LikeButton 
                                        postId={featuredPost.id} 
                                        initialLikes={featuredPost.likes || 0}
                                        size="sm"
                                      />
                                      <ShareDropdown 
                                        title={featuredPost.title} 
                                        excerpt={featuredPost.excerpt}
                                        url={`/journal/${featuredPost.id}`}
                                        size="sm"
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
               </Link>
            </motion.div>

            {/* Grid of Paginated Posts */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-96">
                {paginatedPosts.map((post, index) => (
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
                                        src={getImage(post)} 
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
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs group-hover:text-amber-500 transition-colors">
                                            Read Report <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                                            <LikeButton 
                                              postId={post.id} 
                                              initialLikes={post.likes || 0}
                                              size="sm"
                                              className="h-7 px-2 text-xs"
                                            />
                                            <ShareDropdown 
                                              title={post.title} 
                                              excerpt={post.excerpt}
                                              url={`/journal/${post.id}`}
                                              size="sm"
                                              className="h-7 px-2 text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-slate-800">
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-amber-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded font-mono text-sm transition-all ${
                          currentPage === page
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-amber-500 border border-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-amber-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Page Info */}
              {totalPages > 1 && (
                <div className="text-center mt-6">
                  <p className="text-slate-500 text-sm font-mono">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
