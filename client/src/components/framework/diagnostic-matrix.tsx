import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CodexEntry, CODEX_ENTRIES } from "@/lib/data";

interface DiagnosticMatrixProps {
  onSelect: (entry: CodexEntry) => void;
  selectedEntry: CodexEntry | null;
}

export function DiagnosticMatrix({ onSelect, selectedEntry }: DiagnosticMatrixProps) {
  const stages = ["Blueprint", "Foundation", "Skyline"];
  const domains = ["Process & Systems", "Data & Metrics", "Strategy & Leadership"];

  const getEntry = (stage: string, domain: string) => {
    return CODEX_ENTRIES.find(e => e.stage === stage && e.domain === domain);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] grid grid-cols-[150px_1fr_1fr_1fr] gap-4">
        {/* Header Row */}
        <div className="col-span-1"></div>
        {domains.map(domain => (
          <div key={domain} className="text-center pb-4 border-b border-slate-800">
            <h3 className="text-amber-500 font-mono text-xs uppercase tracking-widest">{domain}</h3>
          </div>
        ))}

        {/* Grid Rows */}
        {stages.map(stage => (
          <React.Fragment key={stage}>
            {/* Row Label */}
            <div className="flex flex-col justify-center pr-4 border-r border-slate-800">
              <h3 className="text-slate-200 font-serif font-bold text-lg text-right">{stage}</h3>
              <span className="text-slate-500 text-[10px] font-mono text-right uppercase mt-1">
                {stage === "Blueprint" ? "Pre-PMF" : stage === "Foundation" ? "PMF Achieved" : "Scaling"}
              </span>
            </div>

            {/* Cells */}
            {domains.map(domain => {
              const entry = getEntry(stage, domain);
              const isSelected = selectedEntry?.id === entry?.id;

              return (
                <motion.div
                  key={`${stage}-${domain}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => entry && onSelect(entry)}
                  className={cn(
                    "h-32 p-4 rounded border cursor-pointer transition-all duration-300 flex flex-col justify-center items-center text-center gap-2 group",
                    isSelected 
                      ? "bg-amber-500/10 border-amber-500 shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]" 
                      : "bg-slate-900/30 border-slate-800 hover:border-slate-600 hover:bg-slate-900/50"
                  )}
                >
                  {entry ? (
                    <>
                      <h4 className={cn(
                        "font-medium text-sm transition-colors",
                        isSelected ? "text-amber-500" : "text-slate-300 group-hover:text-slate-100"
                      )}>
                        {entry.title}
                      </h4>
                    </>
                  ) : (
                    <span className="text-slate-700 text-xs font-mono">Coming Soon</span>
                  )}
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
