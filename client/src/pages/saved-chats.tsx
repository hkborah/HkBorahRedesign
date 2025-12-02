import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, MessageSquare, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import { motion } from "framer-motion";

interface ChatSession {
  id: string;
  transcript: string;
  createdAt: string;
}

export default function SavedChats() {
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/chat/sessions");
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
    fetchSessions();
  }, []);

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
            <Button variant="ghost" className="text-slate-400 hover:text-amber-500 gap-2">
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
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
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
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {expandedId === session.id ? (
                          <ChevronUp className="h-5 w-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedId === session.id && (
                    <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                      <pre className="text-slate-300 text-sm font-light whitespace-pre-wrap bg-slate-950 p-4 rounded-lg max-h-96 overflow-auto">
                        {session.transcript}
                      </pre>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
