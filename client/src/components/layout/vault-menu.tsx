import * as React from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Lock, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface VaultMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VaultMenu({ isOpen, onClose }: VaultMenuProps) {
  const [location] = useLocation();

  const menuVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  const links = [
    { name: "Digital Twin", path: "/", label: "AI Interface" },
    { name: "Architectural Scaling Framework", path: "/framework", label: "The Codex (Book)" },
    { name: "HK's Journal", path: "/journal", label: "The Journal (Blog)" },
    { name: "About HK Borah", path: "/about", label: "About HK Borah" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          
          {/* Menu Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-slate-950 border-l border-slate-800 z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <span className="text-sm font-mono text-slate-400 tracking-widest">THE VAULT</span>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-amber-500">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-8">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Public Access</h3>
                  <nav className="flex flex-col space-y-4">
                    {links.map((link) => (
                      <Link key={link.path} href={link.path}>
                        <div 
                          className={`text-2xl font-serif cursor-pointer transition-colors duration-300 hover:text-amber-500 ${
                            location === link.path ? "text-amber-500 border-l-2 border-amber-500 pl-4" : "text-slate-200"
                          }`}
                          onClick={onClose}
                        >
                          {link.name}
                        </div>
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Contact Protocol</h3>
                  <div className="flex flex-col space-y-3">
                    <a href="mailto:hkborah@gmail.com" className="text-slate-300 hover:text-amber-500 flex items-center gap-2 transition-colors">
                      <Send className="h-4 w-4" />
                      <span>Email</span>
                    </a>
                    <a href="https://www.linkedin.com/in/hkborah/" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-500 flex items-center gap-2 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                <Separator className="bg-slate-800" />

                <div className="space-y-6">
                  <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Secure Access</h3>
                  <div className="flex flex-col space-y-3">
                    <Link href="/login/architect">
                      <div className="text-slate-400 hover:text-amber-500 flex items-center gap-2 cursor-pointer transition-colors text-sm" onClick={onClose}>
                        <Lock className="h-3 w-3" />
                        <span>Business Architect Login (Codex)</span>
                      </div>
                    </Link>
                    <Link href="/login/editor">
                      <div className="text-slate-400 hover:text-amber-500 flex items-center gap-2 cursor-pointer transition-colors text-sm" onClick={onClose}>
                        <Lock className="h-3 w-3" />
                        <span>Editor Login (Journal)</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
