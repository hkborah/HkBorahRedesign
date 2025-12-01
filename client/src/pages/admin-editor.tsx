import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, Upload, Bold, Italic, Underline, Heading1, Heading2, Heading3, List, Trash2, Eye, Edit, Indent, Outdent } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoUrl from "@assets/hkborah-logo.png";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

export default function AdminEditor() {
  const { toast } = useToast();
  const { isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login/editor");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  const [posts, setPosts] = React.useState<any[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch posts from database on component load
  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog/posts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data && data.length > 0 ? data : []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);
  
  // Form state
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [content, setContent] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.width === 1920 && img.height === 1080) {
            resolve(true);
          } else {
            toast({
              title: "Invalid Image Dimensions",
              description: `Image must be 1920x1080. Current: ${img.width}x${img.height}`,
              variant: "destructive"
            });
            resolve(false);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = await validateImageDimensions(file);
      if (isValid) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const applyFormatting = (command: string, value?: string) => {
    // Save the current selection before anything happens
    const selection = window.getSelection();
    let savedRange: Range | null = null;
    
    if (selection && selection.rangeCount > 0) {
      savedRange = selection.getRangeAt(0).cloneRange();
    }
    
    // Focus the editor
    contentRef.current?.focus();
    
    // Restore the selection
    if (savedRange && selection) {
      try {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      } catch (e) {
        console.error('Failed to restore selection:', e);
      }
    }
    
    // Now apply the command with the selection in place
    try {
      document.execCommand(command, false, value);
    } catch (e) {
      console.error('Format command failed:', e);
    }
    
    // Update content state
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  // Only sync innerHTML when loading a post for editing
  React.useEffect(() => {
    if (editingPostId && contentRef.current && content) {
      contentRef.current.innerHTML = content;
    } else if (!editingPostId && contentRef.current) {
      contentRef.current.innerHTML = '';
    }
  }, [editingPostId]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Always use plain text to avoid all the HTML/CSS mess from web sources
    const plainText = e.clipboardData.getData('text/plain');
    
    if (!plainText) return;
    
    // Split by double newlines or multiple line breaks to create paragraphs
    const lines = plainText.split(/\n\n+/);
    const htmlContent = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => `<p>${line.replace(/\n/g, '<br>')}</p>`)
      .join('');
    
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    
    while (temp.firstChild) {
      range.insertNode(temp.firstChild);
    }
    
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast({
      title: "Report Deleted",
      description: "The intelligence report has been removed from the vault.",
    });
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Extract plain text for excerpt
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    const newPost = {
        title,
        category,
        excerpt: plainText.substring(0, 100).trim() + (plainText.length > 100 ? "..." : ""),
        content,
        date: editingPostId ? posts.find(p => p.id === editingPostId)?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: imagePreview || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
        slug: title.toLowerCase().replace(/\s+/g, '-')
    };

    try {
      if (editingPostId) {
        const response = await fetch(`/api/blog/posts/${editingPostId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
        });
        if (response.ok) {
          const updated = await response.json();
          setPosts(posts.map(p => p.id === editingPostId ? updated : p));
          toast({
            title: "✓ Report Updated",
            description: `"${title}" has been updated in your Archives.`,
          });
          resetForm();
        }
      } else {
        const response = await fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
        });
        if (response.ok) {
          const created = await response.json();
          setPosts([created, ...posts]);
          toast({
            title: "✓ Report Published",
            description: `"${title}" is now visible in your Archives and on the Journal.`,
          });
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      toast({
        title: "Error",
        description: "Failed to publish report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingPostId(null);
    setShowPreview(false);
    setTitle("");
    setCategory("");
    setContent("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadPostForEdit = (post: any) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setCategory(post.category || "");
    setContent(post.content);
    setImagePreview(post.image);
    setIsEditing(true);
    setShowPreview(false);
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
                <Button 
                  variant="ghost" 
                  className="text-slate-400 hover:text-amber-500 gap-2"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                    Log Out
                </Button>
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
                        <div key={post.id} className="p-4 bg-slate-900/30 hover:bg-slate-900/60 rounded border border-slate-800/50 group transition-colors cursor-pointer" onClick={() => loadPostForEdit(post)}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-slate-300 mb-1">{post.title}</h4>
                                <span className="text-[10px] font-mono text-slate-500 uppercase">{post.date}</span>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); loadPostForEdit(post); }} className="text-amber-500 hover:text-amber-400"><Edit className="h-4 w-4" /></button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }} className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1">
                <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-8">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-serif font-bold text-slate-100">{editingPostId ? "Edit Intelligence Report" : "New Intelligence Report"}</h2>
                      {isEditing && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowPreview(!showPreview)}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2"
                        >
                          <Eye className="h-4 w-4" /> {showPreview ? "Edit" : "Preview"}
                        </Button>
                      )}
                    </div>
                    
                    {showPreview ? (
                      <div className="prose prose-invert max-w-none bg-slate-950 border border-slate-800 rounded p-6 text-slate-300">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                      </div>
                    ) : (
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
                            <Label className="text-slate-400">Featured Image</Label>
                            <div className="relative">
                              {imagePreview ? (
                                <div className="relative h-48 w-full rounded-lg overflow-hidden border-2 border-amber-500/30 bg-slate-900">
                                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setImagePreview(null);
                                      if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                    className="absolute top-2 right-2 bg-slate-950/90 hover:bg-slate-950 text-amber-500 px-3 py-1 rounded text-sm"
                                  >
                                    Change
                                  </button>
                                </div>
                              ) : (
                                <label 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-900/30 cursor-pointer transition-colors"
                                >
                                  <Upload className="h-8 w-8 text-slate-500 mb-2" />
                                  <span className="text-slate-400 text-sm">Click to upload image</span>
                                  <span className="text-slate-600 text-xs">or drag and drop</span>
                                </label>
                              )}
                              <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                className="hidden" 
                              />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-slate-400">Report Content</Label>
                              <div className="flex flex-wrap gap-1 bg-slate-900/50 p-2 rounded border border-slate-800">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('bold'); }}
                                  title="Bold"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Bold className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('italic'); }}
                                  title="Italic"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Italic className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('underline'); }}
                                  title="Underline"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Underline className="h-4 w-4" />
                                </Button>
                                <div className="w-px bg-slate-700"></div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('formatBlock', 'h1'); }}
                                  title="Heading 1"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Heading1 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('formatBlock', 'h2'); }}
                                  title="Heading 2"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Heading2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('formatBlock', 'h3'); }}
                                  title="Heading 3"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Heading3 className="h-4 w-4" />
                                </Button>
                                <div className="w-px bg-slate-700"></div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('insertUnorderedList'); }}
                                  title="Bullet List"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <List className="h-4 w-4" />
                                </Button>
                                <div className="w-px bg-slate-700"></div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('indent'); }}
                                  title="Indent"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Indent className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('outdent'); }}
                                  title="Outdent"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Outdent className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="relative">
                              <div 
                                  ref={contentRef}
                                  contentEditable
                                  onInput={handleContentChange}
                                  onPaste={handlePaste}
                                  suppressContentEditableWarning
                                  className="bg-slate-950 border border-slate-800 text-slate-200 min-h-[300px] font-light leading-relaxed p-4 rounded overflow-auto focus:outline-none focus:border-amber-500/30 w-full"
                                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%', whiteSpace: 'pre-wrap' }}
                              />
                              {content === '' && (
                                <div className="absolute top-4 left-4 text-slate-500 text-sm pointer-events-none">Begin typing...</div>
                              )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button type="button" onClick={resetForm} variant="ghost" className="text-slate-400 hover:text-slate-300" disabled={isLoading}>
                                Clear Form
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !title || !content}>
                                <Save className="h-4 w-4 mr-2" /> {isLoading ? "Processing..." : (editingPostId ? "Update Report" : "Publish to Vault")}
                            </Button>
                        </div>
                    </form>
                    )}
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
