import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { CHAT_INITIAL_MESSAGES } from "@/lib/data";

interface Message {
  role: string;
  content: string;
}

const CHAT_API = "https://chatwithhk-6toeltovya-uc.a.run.app";

export function DigitalTwin() {
  const [messages, setMessages] = React.useState<Message[]>(CHAT_INITIAL_MESSAGES);
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
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      history.push(userMsg);

      const response = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history })
      });

      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm experiencing technical difficulties. Please try again." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveChat = async () => {
    if (messages.length <= 2) {
      toast({
        title: "No Chat History",
        description: "Start a conversation to save.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    const textContent = messages
      .map(msg => {
        const role = msg.role === 'user' ? 'YOU' : 'HK BORAH';
        return `[${role}]:\n${msg.content}`;
      })
      .join('\n\n---\n\n');

    try {
      await fetch('/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HK_Borah_Chat_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Chat Saved",
        description: "Your transcript has been downloaded."
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: "Could not save chat.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/50 relative border border-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-serif font-bold text-slate-100">HK Borah</h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Digital Twin & Advisor</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSaveChat}
            disabled={isSaving}
            className="text-slate-400 hover:text-amber-500 h-8 w-8"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div> : <Save className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-serif font-bold text-amber-500">HK</span>
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] p-4 rounded-lg ${
                    msg.role === 'assistant' 
                      ? 'bg-slate-100 text-slate-900' 
                      : 'bg-slate-800 text-slate-100'
                  }`}>
                    <p className="text-sm leading-relaxed font-light">
                      {msg.content}
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
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-serif font-bold text-amber-500">HK</span>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-lg flex gap-1 items-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-800">
        <div className="relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about scaling, chaos, or strategy..."
            disabled={isTyping}
            className="bg-slate-100 border-slate-300 h-12 pl-4 pr-12 rounded focus-visible:ring-amber-500 text-slate-900 placeholder:text-slate-500 font-light"
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="absolute right-1 top-1 h-10 w-10 bg-slate-900 hover:bg-slate-800 text-amber-500"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="px-6 py-3 text-center text-xs font-mono text-slate-500 bg-slate-900/20">
        POWERED BY HK BORAH
      </div>
    </div>
  );
}
