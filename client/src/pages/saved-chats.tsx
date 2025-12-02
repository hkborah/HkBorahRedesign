import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Download, MessageSquare, Calendar, ChevronDown, ChevronUp, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
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

const ITEMS_PER_PAGE = 10;

export default function SavedChats() {
  const { getAuthHeader } = useAuth();
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState<"selected" | "all">("selected");
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/chat/sessions", {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = sessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const currentPageIds = paginatedSessions.map(s => s.id);
  const allPageSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedIds.has(id));

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectPage = () => {
    const newSelected = new Set(selectedIds);
    if (allPageSelected) {
      currentPageIds.forEach(id => newSelected.delete(id));
    } else {
      currentPageIds.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/chat/sessions/delete-multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      if (response.ok) {
        setSelectedIds(new Set());
        await fetchSessions();
        const newTotalPages = Math.ceil((sessions.length - selectedIds.size) / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } else if (response.status === 401) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error deleting sessions:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const response = await fetch("/api/chat/sessions", {
        method: "DELETE",
        headers: getAuthHeader()
      });
      if (response.ok) {
        setSelectedIds(new Set());
        setCurrentPage(1);
        await fetchSessions();
      } else if (response.status === 401) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error deleting all sessions:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (type: "selected" | "all") => {
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getPreview = (transcript: string) => {
    const lines = transcript.split('\n').filter(line => line.trim());
    return lines.slice(0, 3).join(' ').substring(0, 150) + '...';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/">
            <img src={logoUrl} alt="HK Borah" className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-amber-500 gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" /> Back to Interface
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <span className="text-amber-500 font-mono text-sm uppercase tracking-widest mb-2 block">Archive</span>
            <h1 className="text-4xl font-serif font-bold text-slate-100 mb-4">Saved Consultations</h1>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">
              Review and download your past Idea Clinic sessions.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800">
              <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No saved consultations yet.</p>
              <p className="text-slate-500 text-sm mt-2">Start a conversation in the Idea Clinic and save it to see it here.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox 
                      checked={allPageSelected}
                      onCheckedChange={toggleSelectPage}
                      data-testid="checkbox-select-page"
                    />
                    <span className="text-slate-400 text-sm">Select Page</span>
                  </label>
                  {selectedIds.size > 0 && (
                    <span className="text-amber-500 text-sm font-mono">
                      {selectedIds.size} selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedIds.size > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300 gap-2"
                      onClick={() => openDeleteDialog("selected")}
                      data-testid="button-delete-selected"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Selected
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300 gap-2"
                    onClick={() => openDeleteDialog("all")}
                    data-testid="button-delete-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {paginatedSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-slate-900/30 border rounded-xl overflow-hidden transition-colors ${
                      selectedIds.has(session.id) ? 'border-amber-500/50' : 'border-slate-800 hover:border-slate-700'
                    }`}
                    data-testid={`card-chat-${session.id}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox 
                          checked={selectedIds.has(session.id)}
                          onCheckedChange={() => toggleSelect(session.id)}
                          className="mt-1"
                          data-testid={`checkbox-chat-${session.id}`}
                        />
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                        >
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                            <Calendar className="h-3 w-3" />
                            {formatDate(session.createdAt)}
                          </div>
                          <p className="text-slate-300 text-sm font-light">
                            {getPreview(session.transcript)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-amber-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadTranscript(session);
                            }}
                            data-testid={`button-download-${session.id}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <div 
                            className="cursor-pointer p-1"
                            onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                          >
                            {expandedId === session.id ? (
                              <ChevronUp className="h-5 w-5 text-slate-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {expandedId === session.id && (
                      <div className="px-6 pb-6 border-t border-slate-800 pt-4 ml-10">
                        <pre className="text-slate-300 text-sm font-light whitespace-pre-wrap bg-slate-950 p-4 rounded-lg max-h-96 overflow-auto">
                          {session.transcript}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:bg-slate-800"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-slate-400 font-mono text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:bg-slate-800"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">
              {deleteType === "all" ? "Delete All Chats" : "Delete Selected Chats"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              {deleteType === "all" 
                ? `This will permanently delete all ${sessions.length} chat sessions. This action cannot be undone.`
                : `This will permanently delete ${selectedIds.size} selected chat session${selectedIds.size > 1 ? 's' : ''}. This action cannot be undone.`
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
              data-testid="button-confirm-delete"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
