import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodexEntry } from "@/lib/data";
import { ChevronDown, CheckCircle2, Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function formatAnswer(text: string): string {
  const lines = text.split('\n');
  const formattedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line.startsWith('**') && line.includes(':**')) {
      const headerText = line.replace(/\*\*/g, '').replace(/:$/, '');
      formattedLines.push(`<u class="underline decoration-amber-500/50 underline-offset-4 text-amber-400 font-semibold no-underline">${headerText}</u>\n`);
      formattedLines.push('');
    } else if (line.startsWith('•')) {
      const bulletContent = line.substring(1).trim();
      const colonIndex = bulletContent.indexOf(':');
      
      if (colonIndex > 0 && colonIndex < 60) {
        const subHeader = bulletContent.substring(0, colonIndex);
        let description = bulletContent.substring(colonIndex + 1).trim();
        
        const numberedPattern = /(\d+)\)\s+([^,]+?)(?:,\s*(?=\d+\))|\s*$)/g;
        const hasNumberedItems = /\d+\)\s+/.test(description);
        
        if (hasNumberedItems) {
          const parts = description.split(/(?=\d+\)\s+)/);
          const mainText = parts[0].trim();
          const numberedItems: string[] = [];
          
          for (let j = 1; j < parts.length; j++) {
            const item = parts[j].replace(/^(\d+)\)\s*/, '').replace(/,\s*$/, '').trim();
            if (item) {
              numberedItems.push(`   ${j}. ${item}`);
            }
          }
          
          if (numberedItems.length > 0) {
            formattedLines.push(`- **${subHeader}:** ${mainText}`);
            formattedLines.push('');
            numberedItems.forEach(item => formattedLines.push(item));
            formattedLines.push('');
          } else {
            formattedLines.push(`- **${subHeader}:** ${description}`);
          }
        } else {
          formattedLines.push(`- **${subHeader}:** ${description}`);
        }
      } else {
        formattedLines.push(`- ${bulletContent}`);
      }
    } else {
      formattedLines.push(line);
    }
  }
  
  return formattedLines.join('\n');
}

interface CaseFileCodexProps {
  entry: CodexEntry;
}

export function CaseFileCodex({ entry }: CaseFileCodexProps) {
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = React.useState<string | null>(null);

  const handleSectionToggle = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
    setOpenQuestion(null);
  };

  const handleQuestionToggle = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  return (
    <div className="w-full space-y-8 bg-slate-900/20 border border-slate-800 rounded-lg p-8">
      {/* Header */}
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

      {/* Core Objective */}
      {entry.coreObjective && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
          <h3 className="text-sm font-mono text-amber-500 uppercase tracking-widest mb-3">Core Objective</h3>
          <p className="text-slate-300 font-light leading-relaxed whitespace-pre-line">
            {entry.coreObjective}
          </p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Book className="h-4 w-4" />
          Operational Protocols
        </h3>

        {entry.sections && (
          <div className="space-y-3">
            {entry.sections.map((section, sectionIdx) => {
              const sectionId = section.id;
              const isOpen = openSection === sectionId;

              return (
                <div key={sectionId} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50">
                  {/* Section Header */}
                  <button
                    onClick={() => handleSectionToggle(sectionId)}
                    className="w-full flex items-start justify-between gap-4 p-4 hover:bg-slate-900/80 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-serif text-slate-100 mb-1">{section.title}</h4>
                      {!isOpen && <p className="text-slate-400 text-sm line-clamp-1">{section.description}</p>}
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-amber-500 flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Section Content - Questions */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-800 bg-slate-950/30"
                      >
                        <div className="p-4 space-y-3">
                          {(section.questions || []).map((q, qIdx) => {
                            const globalIdx =
                              entry.sections!.slice(0, sectionIdx).reduce(
                                (sum, s) => sum + (s.questions?.length || 0),
                                0
                              ) +
                              qIdx +
                              1;
                            const questionId = `${sectionId}-q${qIdx}`;
                            const isQuestionOpen = openQuestion === questionId;

                            return (
                              <div
                                key={questionId}
                                className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50"
                              >
                                {/* Question Header */}
                                <button
                                  onClick={() => handleQuestionToggle(questionId)}
                                  className="w-full flex items-start justify-between gap-3 p-4 hover:bg-slate-800/80 transition-colors text-left"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                      <span className="text-amber-500/60 font-mono text-xs flex-shrink-0">
                                        {String(globalIdx).padStart(2, "0")}
                                      </span>
                                      <p className="text-slate-200 font-medium line-clamp-2">{q.q}</p>
                                    </div>
                                  </div>
                                  <ChevronDown
                                    className={`h-4 w-4 text-amber-500/60 flex-shrink-0 transition-transform ${
                                      isQuestionOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>

                                {/* Answer Content */}
                                <AnimatePresence>
                                  {isQuestionOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="border-t border-slate-700 bg-slate-950/80"
                                    >
                                      <div className="p-6 space-y-6 text-slate-300 font-light">
                                        {/* Answer */}
                                        <div className="pl-4 border-l-2 border-amber-500/30 text-slate-300 prose prose-invert prose-sm max-w-none prose-p:my-3 prose-ul:my-3 prose-ul:pl-4 prose-li:my-1.5 prose-ol:my-2 prose-ol:pl-6 prose-strong:text-amber-400 prose-strong:font-semibold [&_u]:underline [&_u]:decoration-amber-500/50 [&_u]:underline-offset-4 [&_u]:text-amber-400 [&_u]:font-semibold [&_u]:text-base [&_u]:block [&_u]:mb-4">
                                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                            {formatAnswer(q.a)}
                                          </ReactMarkdown>
                                        </div>

                                        {/* Principle */}
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 items-start">
                                          <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                          <div>
                                            <span className="text-amber-500 text-xs font-mono uppercase block mb-2">
                                              The Principle
                                            </span>
                                            <p className="text-slate-200 text-sm italic">"{q.principle}"</p>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
