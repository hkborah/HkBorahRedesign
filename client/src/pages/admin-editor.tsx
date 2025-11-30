import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/hkborah-logo.png";
import { useToast } from "@/hooks/use-toast";
import { BLOG_POSTS } from "@/lib/data";

export default function AdminEditor() {
  const { toast } = useToast();
  const [posts, setPosts] = React.useState(BLOG_POSTS);
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Mock form state
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [content, setContent] = React.useState("");

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost = {
        id: String(posts.length + 1),
        title,
        category,
        excerpt: content.substring(0, 100) + "...",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
    };

    setPosts([newPost, ...posts]);
    setIsEditing(false);
    setTitle("");
    setCategory("");
    setContent("");

    toast({
        title: "Intelligence Published",
        description: "The report has been encrypted and stored in the vault.",
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-900">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <img src={logoUrl} alt="HK Borah" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                </Link>
                <span className="text-xs font-mono text-amber-500 uppercase border border-amber-500/30 px-2 py-1 rounded bg-amber-500/10">Editor Access</span>
            </div>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="ghost" className="text-slate-400 hover:text-amber-500 gap-2">
                        Log Out
                    </Button>
                </Link>
                <Link href="/journal">
                    <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900">
                        View Live Journal
                    </Button>
                </Link>
            </div>
        </div>

        <div className="container mx-auto px-6 py-12 max-w-6xl flex gap-8">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-slate-900 pr-8 hidden md:block">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-serif font-bold text-slate-200">Archives</h2>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="p-4 bg-slate-900/30 hover:bg-slate-900/60 rounded border border-slate-800/50 cursor-pointer transition-colors">
                            <h4 className="text-sm font-medium text-slate-300 mb-1">{post.title}</h4>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">{post.category} • {post.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1">
                <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-8">
                    <h2 className="text-2xl font-serif font-bold text-slate-100 mb-8">New Intelligence Report</h2>
                    
                    <form onSubmit={handlePublish} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-slate-400">Headline</Label>
                            <Input 
                                value={title} onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. The Chaos Theory of Scale" 
                                className="bg-slate-950 border-slate-800 text-slate-200 text-lg font-serif" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-400">Category Classification</Label>
                            <Input 
                                value={category} onChange={e => setCategory(e.target.value)}
                                placeholder="e.g. THOUGHTS, WAR STORIES, BLUEPRINT" 
                                className="bg-slate-950 border-slate-800 text-slate-200 font-mono text-sm uppercase" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-400">Report Content</Label>
                            <Textarea 
                                value={content} onChange={e => setContent(e.target.value)}
                                placeholder="Begin typing..." 
                                className="bg-slate-950 border-slate-800 text-slate-200 min-h-[300px] font-light leading-relaxed" 
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950">
                                <Save className="h-4 w-4 mr-2" /> Publish to Vault
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
