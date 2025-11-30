import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodexEntry } from "@/lib/data";
import { ChevronDown, CheckCircle2, Book } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CaseFileCodexProps {
  entry: CodexEntry;
}

export function CaseFileCodex({ entry }: CaseFileCodexProps) {
  return (
    <div className="w-full space-y-8 bg-slate-900/20 border border-slate-800 rounded-lg p-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className="border-amber-500/50 text-amber-500 font-mono uppercase text-[10px] tracking-widest bg-amber-500/5">
            CASE FILE: {entry.id}
          </Badge>
          <span className="text-slate-500 text-xs font-mono">///</span>
          <span className="text-slate-400 text-xs font-mono uppercase">{entry.stage} x {entry.domain}</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-100 mb-4">{entry.title}</h2>
        <p className="text-slate-400 font-light leading-relaxed max-w-3xl">
          {entry.description}
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Book className="h-4 w-4" />
          Operational Protocols
        </h3>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {entry.questions.map((q, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border border-slate-800 rounded-lg bg-slate-950/50 px-4">
              <AccordionTrigger className="text-left text-slate-200 hover:text-amber-500 transition-colors py-4 font-medium leading-snug">
                <span className="mr-4 text-amber-500/50 font-mono text-xs">0{idx + 1}</span>
                {q.q}
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6 space-y-6 text-slate-300 font-light">
                <div className="whitespace-pre-line pl-8 border-l border-slate-800">
                  {q.a}
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded p-4 flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-500 text-xs font-mono uppercase block mb-1">The Principle</span>
                    <p className="text-slate-200 text-sm italic">"{q.principle}"</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
