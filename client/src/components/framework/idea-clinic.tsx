import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export function IdeaClinic() {
  const [messages, setMessages] = React.useState(INITIAL_MESSAGES);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { role: "user", content: input };
    setMessages([...messages, newMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "This appears to be a unique variation of a scaling bottleneck. Let's deconstruct the underlying system dynamics. Are you seeing this friction primarily in decision velocity or execution quality?" 
      }]);
    }, 1200);
  };

  return (
    <div className="w-full h-[600px] flex flex-col bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative">
      <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="font-serif font-bold text-slate-200">Idea Clinic</span>
         </div>
         <a href="https://www.linkedin.com/groups/15130009/" target="_blank" rel="noreferrer" className="text-[10px] font-mono text-slate-500 hover:text-amber-500 uppercase tracking-widest">
            Join the Community →
         </a>
      </div>

      <div className="flex-1 p-6">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            <AnimatePresence>
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
                    <p className="text-sm leading-relaxed font-light">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}
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
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            className="absolute right-1 top-1 h-10 w-10 bg-amber-500 hover:bg-amber-600 text-slate-950"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
