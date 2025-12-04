import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, Save, X, Sparkles, Target, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { CHAT_INITIAL_MESSAGES } from "@/lib/data";

interface Message {
  role: string;
  content: string;
}

// Targeting your working Cloud Run backend
const CHAT_API = "https://chatwithhk-6toeltovya-uc.a.run.app";

// Quick-start prompt chips
const QUICK_START_PROMPTS = [
  { icon: Target, text: "Diagnose my scaling bottleneck" },
  { icon: Lightbulb, text: "Validate my startup idea" },
  { icon: Sparkles, text: "Fix my broken processes" },
];

// Narrative loading messages that rotate
const LOADING_MESSAGES = [
  "Analyzing your challenge...",
  "Consulting the Framework...",
  "Synthesizing insights...",
  "Preparing strategic response...",
  "Almost there...",
];

export function DigitalTwin() {
  const [messages, setMessages] = React.useState<Message[]>(CHAT_INITIAL_MESSAGES);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Rotate loading messages every 1.5 seconds
  React.useEffect(() => {
    if (!isTyping) {
      setLoadingMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isTyping]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Handle quick-start chip clicks
  const handleQuickStart = async (text: string) => {
    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      history.push(userMsg);

      const response = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
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

    // 1. Prepare content for local download
    const textContent = messages
      .map(msg => {
        const role = msg.role === 'user' ? 'YOU' : 'HK BORAH';
        return `[${role}]:\n${msg.content}`;
      })
      .join('\n\n---\n\n');

    try {
      // 2. Send to local PostgreSQL database for transcript storage
      const response = await fetch('/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!response.ok) {
        console.error("Server save failed:", response.statusText);
      }

      // 3. Trigger Local Download (User confirmation action)
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HK_Borah_Chat_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // 4. Show User-Facing Success Message
      toast({
        title: "Chat Saved",
        description: "Your transcript has been saved.", // Generic message covering both
        variant: "default"
      });

    } catch (error) {
      console.error("Save error:", error);
      // Fallback: Try local download even if network failed
      try {
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
            title: "Chat Saved Locally",
            description: "Server save failed, but local copy downloaded.",
            variant: "default" 
          });
      } catch (e) {
          toast({
            title: "Save Failed",
            description: "Could not save chat.",
            variant: "destructive"
          });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/50 relative border border-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-slate-100">HK Borah</h2>
          <p className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-widest">Digital Twin & Advisor</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
        <ScrollArea className="h-full pr-2 sm:pr-4">
          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[10px] sm:text-xs font-serif font-bold text-amber-500">HK</span>
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-lg border ${
                    msg.role === 'assistant' 
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-100'
                  }`}>
                    <div className="text-sm sm:text-[15px] leading-relaxed font-light prose prose-invert max-w-none chat-content">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({children}) => <strong className="font-bold text-amber-400 block text-base mt-4 mb-2 first:mt-0">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc list-outside ml-5 mb-4 space-y-2">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-2">{children}</ol>,
                          li: ({children}) => <li className="pl-1 leading-relaxed">{children}</li>,
                          h1: ({children}) => <h1 className="text-lg font-bold text-amber-400 mb-3 mt-4 first:mt-0">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-bold text-amber-400 mb-2 mt-4 first:mt-0">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-bold text-amber-400 mb-2 mt-3 first:mt-0">{children}</h3>,
                          a: ({href, children}) => <a href={href} className="text-amber-500 underline hover:text-amber-400" target="_blank" rel="noopener noreferrer">{children}</a>,
                          code: ({children}) => <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 text-xs">{children}</code>,
                          blockquote: ({children}) => <blockquote className="border-l-2 border-amber-500 pl-4 italic text-slate-300 my-3">{children}</blockquote>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 sm:gap-4 justify-start"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[10px] sm:text-xs font-serif font-bold text-amber-500">HK</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                      </div>
                      <motion.span 
                        key={loadingMessageIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-sm text-slate-400 font-light"
                      >
                        {LOADING_MESSAGES[loadingMessageIndex]}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 sm:p-6 border-t border-slate-800 space-y-4">
        {/* Quick-start chips - show only when no user messages yet */}
        {messages.length <= 1 && !isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {QUICK_START_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickStart(prompt.text)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-full text-xs sm:text-sm text-slate-300 hover:text-amber-400 transition-all duration-200 group"
                data-testid={`chip-prompt-${index}`}
              >
                <prompt.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 group-hover:text-amber-400" />
                <span className="font-light">{prompt.text}</span>
              </button>
            ))}
          </motion.div>
        )}

        <div className="relative flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about scaling, chaos, or strategy..."
            disabled={isTyping}
            className="bg-slate-900/50 border-slate-800 h-11 sm:h-12 pl-4 pr-4 rounded-lg focus-visible:ring-amber-500/50 text-slate-200 placeholder:text-slate-500 font-light flex-1 text-sm sm:text-base"
          />
          <Button 
            size="icon" 
            onClick={handleSaveChat}
            disabled={isSaving || messages.length <= 2}
            className="h-11 w-11 sm:h-12 sm:w-12 bg-slate-900 hover:bg-slate-800 text-amber-500 disabled:text-slate-600 disabled:hover:bg-slate-900 flex-shrink-0 rounded-lg"
            title={messages.length <= 2 ? "Start a conversation to save" : "Save chat"}
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div> : <Save className="h-4 w-4" />}
          </Button>
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="h-11 w-11 sm:h-12 sm:w-12 bg-slate-900 hover:bg-slate-800 text-amber-500 flex-shrink-0 rounded-lg"
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