import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CHAT_INITIAL_MESSAGES } from "@/lib/data";

export function DigitalTwin() {
  const [messages, setMessages] = React.useState(CHAT_INITIAL_MESSAGES);
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
        content: "I process chaos into order. Tell me more about your current constraints." 
      }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/50 relative">
      <div className="flex-1 p-6 sm:p-12 flex flex-col justify-center max-w-3xl mx-auto w-full">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-8">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
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
                    {msg.role === 'assistant' && (
                      <span className="block text-[10px] font-mono text-amber-500 mb-2 uppercase tracking-wider">
                        The Business Architect
                      </span>
                    )}
                    <p className="text-sm sm:text-base leading-relaxed font-light">
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

      <div className="p-6 sm:p-12 pt-0 max-w-3xl mx-auto w-full">
        <div className="relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your chaos..."
            className="bg-slate-900/50 border-slate-800 h-14 pl-6 pr-12 rounded-xl focus-visible:ring-amber-500/50 text-slate-200 placeholder:text-slate-600 font-light"
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            className="absolute right-2 top-2 h-10 w-10 bg-amber-500 hover:bg-amber-600 text-slate-950"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
