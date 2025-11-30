import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/hkborah-logo.png";
import { DiagnosticMatrix } from "@/components/framework/diagnostic-matrix";
import { CaseFileCodex } from "@/components/framework/case-file-codex";
import { IdeaClinic } from "@/components/framework/idea-clinic";
import { CODEX_ENTRIES, CodexEntry } from "@/lib/data";

export default function Framework() {
  const [selectedEntry, setSelectedEntry] = React.useState<CodexEntry | null>(CODEX_ENTRIES[0]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header */}
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

        <div className="container mx-auto px-6 py-12 max-w-7xl space-y-24">
            {/* Intro */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
                <span className="text-amber-500 font-mono text-sm uppercase tracking-widest block">The Architectural Scaling Framework</span>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-100">
                    From Chaos to <span className="text-amber-500">Scale</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed font-light">
                    An enduring company is not stumbled upon; it is architected. 
                    Use the diagnostic matrix below to identify your zone of pain and access the corresponding Case File Codex.
                </p>
            </div>

            {/* ASF Introduction */}
            <div className="space-y-12">
                <div className="space-y-6">
                    <h2 className="text-4xl font-serif font-bold text-slate-100">The Architectural Scaling Framework</h2>
                    <div className="space-y-4 text-lg text-slate-400 font-light leading-relaxed">
                        <p>
                            The Architectural Scaling Framework (ASF) is my blueprint for transforming operational chaos into predictable growth. It's an ongoing, evolving methodology where you diagnose your specific scaling stage and zone of pain, then locate your challenge within our Scaling Diagnostic Matrix.
                        </p>
                        <p>
                            This identifies your architectural solutions in the Case File Codex – always the most updated form available.
                        </p>
                        <p>
                            For novel issues falling outside the documented 80% (the "other 20%"), we dissect them in the Idea Clinic on LinkedIn.
                        </p>
                        <p>
                            The entire foundational ASF system is meticulously detailed in my book, <span className="italic">The Order of Chaos.</span>
                        </p>
                    </div>
                </div>

                {/* ASF Process Diagram */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12">
                    <div className="flex gap-6 items-flex-start relative">
                        {/* Step 01 - Parallelogram */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gradient-to-br from-amber-600 to-amber-700 p-8 mb-8 h-48 flex flex-col items-center justify-center text-center" style={{ clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)' }}>
                                <div className="text-5xl mb-4">⚙️</div>
                                <h3 className="text-lg font-serif font-bold text-white mb-2">Scaling Diagnostic Matrix</h3>
                                <p className="text-sm text-amber-100">Identify Stage of Growth and Point of Pain</p>
                            </div>
                            <p className="text-xs font-mono text-amber-500 font-semibold">STEP 01</p>
                        </div>

                        {/* Step 02 - Rectangle */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-8 mb-8 h-48 flex flex-col items-center justify-center text-center">
                                <div className="text-5xl mb-4">📖</div>
                                <h3 className="text-lg font-serif font-bold text-white mb-2">Case File Codex</h3>
                                <p className="text-sm text-slate-300">Locate solutions to 80% of problems faced by founders</p>
                            </div>
                            <p className="text-xs font-mono text-slate-400 font-semibold">STEP 02</p>
                        </div>

                        {/* Step 03 - Reverse Parallelogram */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 mb-8 h-48 flex flex-col items-center justify-center text-center" style={{ clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)' }}>
                                <div className="text-5xl mb-4">💬</div>
                                <h3 className="text-lg font-serif font-bold text-white mb-2">Idea Clinic</h3>
                                <p className="text-sm text-emerald-100">Discuss solutions to 20% of unique problems</p>
                            </div>
                            <p className="text-xs font-mono text-emerald-400 font-semibold">STEP 03</p>
                        </div>
                    </div>

                    {/* Continuous Flow Line */}
                    <div className="mt-8 h-1 bg-gradient-to-r from-amber-500 via-slate-500 to-emerald-500 rounded-full"></div>
                </div>
            </div>

            {/* 1. Diagnostic Matrix */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-slate-800"></div>
                    <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">01. Scaling Diagnostic Matrix</span>
                    <div className="h-px flex-1 bg-slate-800"></div>
                </div>
                <DiagnosticMatrix onSelect={setSelectedEntry} selectedEntry={selectedEntry} />
            </div>

            {/* 2. Case File Codex */}
            <div className="space-y-8 min-h-[600px]">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-slate-800"></div>
                    <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">02. Case File Codex</span>
                    <div className="h-px flex-1 bg-slate-800"></div>
                </div>

                {/* The Structure of the Codex - Introduction before accordion */}
                <div className="space-y-6">
                    <h3 className="text-3xl font-serif font-bold text-slate-100">The Architecture Behind the Architecture</h3>
                    <div className="space-y-6 text-lg text-slate-400 font-light leading-relaxed">
                        <p>
                            The universe of startup challenges is vast, but the foundational problems are finite and predictable. This Codex is not an exhaustive encyclopedia of every possible issue. It is a curated library of the <span className="text-amber-300 font-medium">cornerstone challenges</span>—the few, critical, high-leverage problems that, when solved correctly, unlock the majority of progress at each stage.
                        </p>
                        <p>
                            Each section below focuses on these core architectural issues, allowing you to avoid distraction and apply your limited resources to the work that truly matters. The full, detailed blueprints are in the book.
                        </p>
                    </div>
                </div>
                
                {selectedEntry ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CaseFileCodex entry={selectedEntry} />
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-slate-800 rounded-lg">
                        <p className="text-slate-500 font-mono">Select a module from the matrix above to view the Case File.</p>
                    </div>
                )}
            </div>

            {/* 3. Idea Clinic */}
            <div className="space-y-8 border-t border-slate-900 pt-24">
                <div className="space-y-4">
                    <span className="text-amber-500 font-mono text-sm uppercase tracking-widest block">03. The Idea Clinic</span>
                    <h2 className="text-4xl font-serif font-bold text-slate-100">The Other 20%</h2>
                    <p className="text-slate-400 font-light leading-relaxed max-w-2xl">
                        The Codex covers the 80% of predictable scaling challenges. For the novel issues—the "other 20%"—we dissect them in the Idea Clinic community.
                    </p>
                </div>
                <div className="mt-6">
                    <a href="https://www.linkedin.com/groups/15130009/" target="_blank" rel="noreferrer">
                        <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950">
                            Join the Idea Clinic on LinkedIn
                        </Button>
                    </a>
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
