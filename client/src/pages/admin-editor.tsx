import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Plus, Upload, Bold, Italic, Underline, Heading1, Heading2, Heading3, List, Trash2, Eye, Edit, Indent, Outdent, Download, Calendar, FileText, MessageSquare, Settings, Lock, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatSession {
  id: string;
  transcript: string;
  createdAt: string;
}

export default function AdminEditor() {
  const { toast } = useToast();
  const { isAuthenticated, logout, getAuthHeader } = useAuth();
  const [, navigate] = useLocation();

  // All hooks must be declared before any conditional returns
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Transcript state
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [transcriptsLoading, setTranscriptsLoading] = React.useState(false);
  const [transcriptsFetched, setTranscriptsFetched] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState<ChatSession | null>(null);
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState("blog");
  const [pageSize, setPageSize] = React.useState<number>(50);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedSessionIds, setSelectedSessionIds] = React.useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState<"selected" | "all">("selected");
  const [deleting, setDeleting] = React.useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordChanging, setPasswordChanging] = React.useState(false);

  // Form state
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [content, setContent] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const savedSelectionRef = React.useRef<Range | null>(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login/editor");
    }
  }, [isAuthenticated, navigate]);

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

  // Filter sessions by date range
  const filteredSessions = React.useMemo(() => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.createdAt);
      if (fromDate && new Date(fromDate) > sessionDate) return false;
      if (toDate && new Date(toDate + "T23:59:59") < sessionDate) return false;
      return true;
    });
  }, [sessions, fromDate, toDate]);

  // Paginate filtered sessions
  const paginatedSessions = React.useMemo(() => {
    if (pageSize === 0) return filteredSessions; // Show all
    const start = (currentPage - 1) * pageSize;
    return filteredSessions.slice(start, start + pageSize);
  }, [filteredSessions, currentPage, pageSize]);

  const totalPages = React.useMemo(() => {
    if (pageSize === 0) return 1;
    return Math.ceil(filteredSessions.length / pageSize);
  }, [filteredSessions.length, pageSize]);

  // Reset to page 1 when filters or page size change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [fromDate, toDate, pageSize]);

  // Only sync innerHTML when loading a post for editing
  React.useEffect(() => {
    if (editingPostId && contentRef.current && content) {
      contentRef.current.innerHTML = content;
    } else if (!editingPostId && contentRef.current) {
      contentRef.current.innerHTML = '';
    }
  }, [editingPostId]);

  // Fetch transcripts when switching to transcripts tab
  React.useEffect(() => {
    if (activeTab === 'transcripts' && !transcriptsFetched && !transcriptsLoading) {
      const doFetch = async () => {
        setTranscriptsLoading(true);
        try {
          const response = await fetch("/api/chat/sessions", {
            headers: { ...getAuthHeader() }
          });
          if (response.ok) {
            const data = await response.json();
            setSessions(data);
            setTranscriptsFetched(true);
          }
        } catch (error) {
          console.error("Error fetching transcripts:", error);
        } finally {
          setTranscriptsLoading(false);
        }
      };
      doFetch();
    }
  }, [activeTab, transcriptsFetched, transcriptsLoading]);

  // Early return after all hooks are declared
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  // Format date for display - compact timestamp
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Download single transcript
  const downloadTranscript = (session: ChatSession) => {
    const blob = new Blob([session.transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date(session.createdAt).toISOString().slice(0, 10);
    a.href = url;
    a.download = `HK_Borah_Idea_Clinic_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Bulk download filtered transcripts
  const bulkDownloadTranscripts = () => {
    if (filteredSessions.length === 0) {
      toast({
        title: "No Transcripts",
        description: "No transcripts match your date filter.",
        variant: "destructive"
      });
      return;
    }

    const combined = filteredSessions.map(session => {
      const date = formatDate(session.createdAt);
      return `========================================\nSession: ${date}\n========================================\n\n${session.transcript}`;
    }).join('\n\n\n');

    const blob = new Blob([combined], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateRange = fromDate && toDate 
      ? `${fromDate}_to_${toDate}` 
      : fromDate 
        ? `from_${fromDate}` 
        : toDate 
          ? `until_${toDate}` 
          : 'all';
    a.href = url;
    a.download = `HK_Borah_Transcripts_${dateRange}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Downloading ${filteredSessions.length} transcript(s).`,
    });
  };

  // Toggle single session selection
  const toggleSessionSelect = (id: string) => {
    const newSelected = new Set(selectedSessionIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSessionIds(newSelected);
  };

  // Check if all visible sessions are selected
  const currentPageSessionIds = paginatedSessions.map(s => s.id);
  const allPageSelected = currentPageSessionIds.length > 0 && currentPageSessionIds.every(id => selectedSessionIds.has(id));

  // Toggle select all on current page
  const toggleSelectPage = () => {
    const newSelected = new Set(selectedSessionIds);
    if (allPageSelected) {
      currentPageSessionIds.forEach(id => newSelected.delete(id));
    } else {
      currentPageSessionIds.forEach(id => newSelected.add(id));
    }
    setSelectedSessionIds(newSelected);
  };

  // Refetch sessions from database
  const refetchSessions = async () => {
    try {
      const response = await fetch("/api/chat/sessions", {
        headers: { ...getAuthHeader() }
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  // Delete selected sessions
  const handleDeleteSelected = async () => {
    if (selectedSessionIds.size === 0) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/chat/sessions/delete-multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ ids: Array.from(selectedSessionIds) })
      });
      if (response.ok) {
        toast({
          title: "Deleted",
          description: `${selectedSessionIds.size} transcript(s) permanently deleted.`,
        });
        setSelectedSessionIds(new Set());
        setSelectedSession(null);
        await refetchSessions();
      } else if (response.status === 401) {
        navigate("/login/editor");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete transcripts. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting sessions:", error);
      toast({
        title: "Error",
        description: "Failed to delete transcripts.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Delete all sessions
  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const response = await fetch("/api/chat/sessions", {
        method: "DELETE",
        headers: getAuthHeader()
      });
      if (response.ok) {
        toast({
          title: "Deleted",
          description: "All transcripts permanently deleted.",
        });
        setSelectedSessionIds(new Set());
        setSelectedSession(null);
        await refetchSessions();
      } else if (response.status === 401) {
        navigate("/login/editor");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete transcripts. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting all sessions:", error);
      toast({
        title: "Error",
        description: "Failed to delete transcripts.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (type: "selected" | "all") => {
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }
    
    setPasswordChanging(true);
    
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to change password.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPasswordChanging(false);
    }
  };

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

  // Save selection whenever user makes one in the editor
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // Only save if selection is within our editor
      if (contentRef.current?.contains(range.commonAncestorContainer)) {
        savedSelectionRef.current = range.cloneRange();
      }
    }
  };
  
  const restoreSelection = () => {
    const selection = window.getSelection();
    if (savedSelectionRef.current && selection) {
      try {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRef.current);
        return true;
      } catch (e) {
        console.error('Failed to restore selection:', e);
      }
    }
    return false;
  };

  const applyFormatting = (command: string, value?: string) => {
    // Focus the editor first
    contentRef.current?.focus();
    
    // Restore saved selection
    restoreSelection();
    
    // Small delay to ensure selection is restored before command
    requestAnimationFrame(() => {
      try {
        document.execCommand(command, false, value);
      } catch (e) {
        console.error('Format command failed:', e);
      }
      
      // Update content state
      if (contentRef.current) {
        setContent(contentRef.current.innerHTML);
      }
    });
  };

  const insertHyperlink = () => {
    // Focus the editor and restore selection first
    contentRef.current?.focus();
    restoreSelection();
    
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    
    // Prompt for URL
    const url = prompt('Enter URL:', 'https://');
    if (!url || url === 'https://') return;
    
    // If no text selected, prompt for link text
    let linkText = selectedText;
    if (!linkText) {
      linkText = prompt('Enter link text:', url) || url;
    }
    
    if (selectedText) {
      // Wrap selected text in link
      document.execCommand('createLink', false, url);
    } else {
      // Insert new link at cursor
      const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      document.execCommand('insertHTML', false, link);
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
    
    // Use a document fragment to preserve order when inserting multiple nodes
    const fragment = document.createRange().createContextualFragment(htmlContent);
    range.insertNode(fragment);
    
    // Move cursor to end of pasted content
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
        toast({
          title: "Report Deleted",
          description: "The intelligence report has been removed from the vault.",
        });
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete report. Please try again.",
        variant: "destructive"
      });
    }
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
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
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
        } else {
          throw new Error("Failed to update post");
        }
      } else {
        const response = await fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
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
        } else {
          throw new Error("Failed to create post");
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

        <div className="container mx-auto px-6 py-6 max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-900/50 border border-slate-800 mb-8">
              <TabsTrigger value="blog" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 gap-2">
                <FileText className="h-4 w-4" /> Blog Editor
              </TabsTrigger>
              <TabsTrigger value="transcripts" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 gap-2">
                <MessageSquare className="h-4 w-4" /> Transcripts
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 gap-2">
                <Settings className="h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blog">
              <div className="flex gap-8">
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
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('formatBlock', '<h1>'); }}
                                  title="Heading 1"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Heading1 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('formatBlock', '<h2>'); }}
                                  title="Heading 2"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Heading2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('formatBlock', '<h3>'); }}
                                  title="Heading 3"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Heading3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('formatBlock', '<p>'); }}
                                  title="Normal Text"
                                  className="h-8 px-2 hover:bg-slate-800 text-xs"
                                >
                                  P
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
                                <div className="w-px bg-slate-700"></div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('justifyLeft'); }}
                                  title="Align Left"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <AlignLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('justifyCenter'); }}
                                  title="Align Center"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <AlignCenter className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('justifyRight'); }}
                                  title="Align Right"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <AlignRight className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); applyFormatting('justifyFull'); }}
                                  title="Justify"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <AlignJustify className="h-4 w-4" />
                                </Button>
                                <div className="w-px bg-slate-700"></div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onMouseDown={(e) => { e.preventDefault(); insertHyperlink(); }}
                                  title="Insert Link"
                                  className="h-8 w-8 p-0 hover:bg-slate-800"
                                >
                                  <Link2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="relative">
                              <style>{`
                                .wysiwyg-editor h1 { font-size: 2rem; font-weight: 700; margin: 1.5rem 0; font-family: serif; }
                                .wysiwyg-editor h2 { font-size: 1.5rem; font-weight: 600; margin: 1.25rem 0; font-family: serif; }
                                .wysiwyg-editor h3 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0; font-family: serif; }
                                .wysiwyg-editor p { margin: 1rem 0; line-height: 1.75; }
                                .wysiwyg-editor ul { margin: 1rem 0; padding-left: 1.5rem; list-style-type: disc !important; }
                                .wysiwyg-editor ol { margin: 1rem 0; padding-left: 1.5rem; list-style-type: decimal !important; }
                                .wysiwyg-editor li { margin: 0.5rem 0; display: list-item !important; }
                                .wysiwyg-editor b, .wysiwyg-editor strong { font-weight: 700; }
                                .wysiwyg-editor i, .wysiwyg-editor em { font-style: italic; }
                                .wysiwyg-editor u { text-decoration: underline; }
                                .wysiwyg-editor a { color: #f59e0b; text-decoration: underline; }
                                .wysiwyg-editor a:hover { color: #fbbf24; }
                              `}</style>
                              <div 
                                  ref={contentRef}
                                  contentEditable
                                  onInput={handleContentChange}
                                  onPaste={handlePaste}
                                  onSelect={saveSelection}
                                  onMouseUp={saveSelection}
                                  onKeyUp={saveSelection}
                                  suppressContentEditableWarning
                                  className="wysiwyg-editor bg-slate-950 border border-slate-800 text-slate-200 min-h-[300px] font-light leading-relaxed p-4 rounded overflow-auto focus:outline-none focus:border-amber-500/30 w-full"
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
            </TabsContent>

            <TabsContent value="transcripts">
              <div className="space-y-4">
                {/* Filters Bar */}
                <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Page Size Filter */}
                    <div className="flex items-center gap-2">
                      <Label className="text-slate-400 text-xs">Show:</Label>
                      <div className="flex gap-1">
                        {[50, 100, 200, 0].map((size) => (
                          <button
                            key={size}
                            onClick={() => setPageSize(size)}
                            className={`px-2 py-1 text-xs rounded ${pageSize === size ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                          >
                            {size === 0 ? 'All' : size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-4 w-px bg-slate-700" />
                    {/* Date Filters */}
                    <div className="flex items-center gap-2">
                      <Label className="text-slate-400 text-xs">From:</Label>
                      <Input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-slate-200 h-8 text-xs w-36"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-slate-400 text-xs">To:</Label>
                      <Input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-slate-200 h-8 text-xs w-36"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-300 text-xs h-8"
                      onClick={() => { setFromDate(""); setToDate(""); }}
                    >
                      Clear
                    </Button>
                    <div className="flex-1" />
                    {/* Delete Buttons */}
                    {selectedSessionIds.size > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300 gap-2 h-8"
                        onClick={() => openDeleteDialog("selected")}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete ({selectedSessionIds.size})
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300 gap-2 h-8"
                      onClick={() => openDeleteDialog("all")}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete All
                    </Button>
                    {/* Bulk Download */}
                    <Button
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 gap-2 h-8"
                      onClick={bulkDownloadTranscripts}
                    >
                      <Download className="h-3 w-3" />
                      Download ({filteredSessions.length})
                    </Button>
                  </div>
                </div>

                {/* Split View: List + Preview */}
                {transcriptsLoading ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400">Loading transcripts...</p>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800">
                    <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No transcripts found.</p>
                    <p className="text-slate-500 text-sm mt-2">
                      {sessions.length > 0 ? "Try adjusting your date filter." : "Saved consultations will appear here."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 min-h-[500px]">
                    {/* Compact List */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
                      <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox 
                            checked={allPageSelected}
                            onCheckedChange={toggleSelectPage}
                            className="border-slate-600"
                          />
                          <span className="text-xs font-mono text-slate-400">Select All</span>
                        </label>
                        <span className="text-xs font-mono text-slate-500">
                          {pageSize === 0 ? `${filteredSessions.length} total` : `Page ${currentPage}/${totalPages}`}
                        </span>
                      </div>
                      <div className="max-h-[450px] overflow-y-auto">
                        {paginatedSessions.map((session) => (
                          <div
                            key={session.id}
                            className={`px-3 py-2 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors flex items-center gap-2 ${selectedSession?.id === session.id ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : ''} ${selectedSessionIds.has(session.id) ? 'bg-slate-800/30' : ''}`}
                          >
                            <Checkbox 
                              checked={selectedSessionIds.has(session.id)}
                              onCheckedChange={() => toggleSessionSelect(session.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="border-slate-600 flex-shrink-0"
                            />
                            <div 
                              className="flex-1 flex items-center gap-2 text-xs font-mono text-slate-400 cursor-pointer"
                              onClick={() => setSelectedSession(session)}
                            >
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span className={selectedSession?.id === session.id ? 'text-amber-500' : ''}>{formatDate(session.createdAt)}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 opacity-50 hover:opacity-100 text-slate-400 hover:text-amber-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadTranscript(session);
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {/* Pagination Controls */}
                      {pageSize > 0 && totalPages > 1 && (
                        <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="text-slate-400 hover:text-slate-200 h-7 text-xs"
                          >
                            Previous
                          </Button>
                          <span className="text-xs text-slate-500">{currentPage} / {totalPages}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="text-slate-400 hover:text-slate-200 h-7 text-xs"
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Preview Panel */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
                      {selectedSession ? (
                        <>
                          <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                            <span className="text-xs font-mono text-amber-500">{formatDate(selectedSession.createdAt)}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-amber-500 h-7 text-xs gap-1"
                              onClick={() => downloadTranscript(selectedSession)}
                            >
                              <Download className="h-3 w-3" /> Download
                            </Button>
                          </div>
                          <div className="p-4 max-h-[450px] overflow-y-auto">
                            <pre className="text-slate-300 text-sm font-light whitespace-pre-wrap leading-relaxed">
                              {selectedSession.transcript}
                            </pre>
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                          Select a transcript to preview
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="max-w-md mx-auto">
                <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <Lock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-slate-100">Change Password</h2>
                      <p className="text-xs text-slate-500">Account: hkborah@gmail.com</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Current Password</Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="bg-slate-950 border-slate-800 text-slate-200"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">New Password</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        className="bg-slate-950 border-slate-800 text-slate-200"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Confirm New Password</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="bg-slate-950 border-slate-800 text-slate-200"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 mt-6"
                      disabled={passwordChanging || !currentPassword || !newPassword || !confirmPassword}
                    >
                      {passwordChanging ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">
              {deleteType === "all" ? "Delete All Transcripts" : "Delete Selected Transcripts"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {deleteType === "all" 
                ? `This will permanently delete all ${sessions.length} transcript(s) from the database. This action cannot be undone.`
                : `This will permanently delete ${selectedSessionIds.size} selected transcript(s) from the database. This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteType === "all" ? handleDeleteAll : handleDeleteSelected}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
