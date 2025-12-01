import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import NotFound from "@/pages/not-found";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function JournalPost() {
  const [, params] = useRoute("/journal/:id");
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${params?.id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) {
      fetchPost();
    }
  }, [params?.id]);

  if (loading) return <MainLayout><div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-slate-400">Loading...</p></div></MainLayout>;
  if (!post) return <NotFound />;

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
            <Link href="/">
                <img src={logoUrl} alt="HK Borah" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
            </Link>
            <Link href="/journal">
                <Button variant="ghost" className="text-slate-400 hover:text-amber-500 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Journal
                </Button>
            </Link>
        </div>

        <article className="container mx-auto px-6 py-12 max-w-3xl">
            <div className="mb-8 text-center space-y-4">
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
                    <span>{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 leading-tight">{post.title}</h1>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-lg mb-12 bg-slate-900">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-invert prose-lg prose-slate max-w-none font-light">
                <p className="lead text-xl text-slate-300">{post.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose prose-invert prose-lg max-w-none" />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-900 flex justify-between items-center">
                <Link href="/journal">
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-300">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Previous Intelligence
                    </Button>
                </Link>
                <Button variant="outline" className="border-slate-800 text-slate-400 hover:text-amber-500 hover:bg-slate-900">
                    <Share2 className="h-4 w-4 mr-2" /> Share Protocol
                </Button>
            </div>
        </article>
      </div>
    </MainLayout>
  );
}
