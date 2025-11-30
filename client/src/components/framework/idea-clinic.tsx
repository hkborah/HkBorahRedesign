import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, Sparkles, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const CHAT_API = "https://chatwithhk-6toeltovya-uc.a.run.app";
const SAVE_API = "https://savechattohk-6toeltovya-uc.a.run.app";

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content: "Welcome to the Idea Clinic."
  },
  {
    role: "assistant",
    content: "I analyze novel scaling challenges that fall outside the standard Codex. What specific friction are you encountering?"
  }
];

interface Message {
    role: string;
    content: string;
}

export function IdeaClinic() {
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
        // Prepare history for API context (last 6 messages)
        const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
        history.push(userMsg);

        const response = await fetch(CHAT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg.content, history: history })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);

    } catch (error) {
        console.error("Chat Error:", error);
        setMessages(prev => [...prev, { 
            role: "assistant", 
            content: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment." 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleSaveChat = async () => {
      if (messages.length <= 2) {
          toast({
              title: "No Chat History",
              description: "Start a conversation to save your session.",
              variant: "destructive"
          });
          return;
      }

      setIsSaving(true);
      
      // Prepare text content for download
      const textContent = messages.map(msg => {
          const role = msg.role === 'user' ? 'FOUNDER' : 'HK BORAH';
          return `[${role}]:\n${msg.content}\n-------------------`;
      }).join('\n\n');

      try {
          // Save to Server (Archival) - Silent
          await fetch(SAVE_API, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ history: messages })
          });
      } catch (error) {
          console.error("Background archival failed:", error);
      } finally {
          // Trigger Client-Side Download
          const blob = new Blob([textContent], { type: 'text/plain' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `HK_Borah_Idea_Clinic_${new Date().toISOString().slice(0,10)}.txt`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          setIsSaving(false);
          toast({
              title: "Session Saved",
              description: "Your chat transcript has been downloaded securely.",
          });
      }
  };

  return (
    <div className="w-full h-[600px] flex flex-col bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative">
      <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="font-serif font-bold text-slate-200">Idea Clinic</span>
         </div>
         <div className="flex items-center gap-3">
             <a href="https://www.linkedin.com/groups/15130009/" target="_blank" rel="noreferrer" className="text-[10px] font-mono text-slate-500 hover:text-amber-500 uppercase tracking-widest hidden sm:block">
                Join Community →
             </a>
             <Button 
               variant="outline" 
               size="sm"
               onClick={handleSaveChat} 
               disabled={isSaving} 
               className="text-slate-300 border-slate-700 hover:bg-amber-500/10 hover:border-amber-500 hover:text-amber-500 text-xs gap-2"
             >
                 {isSaving ? (
                   <>
                     <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                     Saving...
                   </>
                 ) : (
                   <>
                     <Save className="h-3 w-3" />
                     <span className="hidden sm:inline">Save Transcript</span>
                   </>
                 )}
             </Button>
         </div>
      </div>

      <div className="flex-1 p-6">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <Cpu className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] p-4 rounded-lg border ${
                    msg.role === 'assistant' 
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-100'
                  }`}>
                    <p className="text-sm leading-relaxed font-light whitespace-pre-wrap">
                      {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <Cpu className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg flex gap-1 items-center h-12">
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 bg-slate-900/30 border-t border-slate-800">
        <div className="relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your unique challenge..."
            className="bg-slate-950 border-slate-800 h-12 pl-4 pr-12 rounded focus-visible:ring-amber-500/50 text-slate-200 placeholder:text-slate-600 font-light"
            disabled={isTyping}
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="absolute right-1 top-1 h-10 w-10 bg-amber-500 hover:bg-amber-600 text-slate-950"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
