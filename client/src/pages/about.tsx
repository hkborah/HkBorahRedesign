import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Award, Briefcase, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/hkborah-logo.png";

export default function About() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col">
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

        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
                <div className="space-y-12">
                    <div>
                        <span className="text-amber-500 font-mono text-sm uppercase tracking-widest mb-2 block">The Architect's Journey</span>
                        <h1 className="text-5xl font-serif font-bold text-slate-100 mb-6">HK Borah</h1>
                        <p className="text-xl text-slate-300 font-light leading-relaxed">
                            My career has been a decade-long obsession with a single question: Why do the most brilliant ideas so often result in the most chaotic companies? The answer is never a failure of passion. It is always a failure of architecture.
                        </p>
                    </div>

                    <div className="relative border-l border-slate-800 pl-8 space-y-12 ml-2">
                        <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-950"></div>
                            <div className="flex items-center gap-2 mb-2 text-amber-500 font-mono text-xs uppercase tracking-widest">
                                <GraduationCap className="h-4 w-4" />
                                <span>The Foundation</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-slate-100 mb-2">First Principles & Mathematics</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                My journey began in the elegant world of mathematics at Hindu College. It taught me how to deconstruct complex problems into their fundamental axioms—mastering first-principles thinking to understand a system's immutable laws.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                            <div className="flex items-center gap-2 mb-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
                                <Briefcase className="h-4 w-4" />
                                <span>The Strategy</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-slate-200 mb-2">MBA, IIM Calcutta</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                An MBA provided the translation layer, mapping the abstract beauty of systems thinking onto the practical battlefields of market dynamics, competitive strategy, and capital allocation.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                            <div className="flex items-center gap-2 mb-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
                                <Target className="h-4 w-4" />
                                <span>The Engineering</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-slate-200 mb-2">Six Sigma Master Black Belt</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                The Six Sigma discipline from ISI gave me the tools to not just admire the engine, but to take it apart, measure its tolerances to a microscopic level of precision, and rebuild it for maximum efficiency and zero defects.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                            <div className="flex items-center gap-2 mb-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
                                <Award className="h-4 w-4" />
                                <span>The Apprenticeship</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-slate-200 mb-2">Corporate Strategy</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                From HSBC to Aditya Birla Group and Accenture, I navigated rigid financial systems and massive industrial conglomerates. This journey revealed a universal truth: the symptoms of chaos may differ, but the underlying architectural flaws are always the same.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                             <div className="flex items-center gap-2 mb-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
                                <Target className="h-4 w-4" />
                                <span>The Crucible</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-slate-200 mb-2">Startup Operator</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                As a founder and leader in product and growth (Ruralnomics, Refyne), I saw firsthand that even the most brilliant founders were operating without a blueprint. This forced me to adapt corporate rigor to the agile, high-velocity needs of a startup.
                            </p>
                        </div>
                        
                         <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-950"></div>
                            <div className="flex items-center gap-2 mb-2 text-amber-500 font-mono text-xs uppercase tracking-widest">
                                <Award className="h-4 w-4" />
                                <span>The Synthesis</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-slate-100 mb-2">The Architectural Scaling Framework</h3>
                            <p className="text-slate-400 font-light leading-relaxed">
                                The ASF is the synthesis of this entire journey. It combines first-principles rigor, strategic vision, and engineering discipline—battle-tested in both corporate giants and high-growth startups.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="space-y-8">
                    <div className="aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden relative group">
                        {/* Placeholder for HK Borah Photo - using a generic professional silhouette or pattern for now if no photo provided */}
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                            <img src="https://www.hkborah.com/images/HKB%20Pinstripe.jpg" alt="HK Borah" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-lg space-y-4">
                        <h3 className="text-sm font-mono text-amber-500 uppercase tracking-widest">PICO Consulting LLP</h3>
                        <p className="text-sm text-slate-400 font-light">
                            My professional advisory services, corporate case studies, and the work of our elite IIM/IIT team are housed at PICO Consulting LLP.
                        </p>
                        <a href="https://www.thepico.org/" target="_blank" rel="noreferrer">
                            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-amber-500 hover:border-amber-500">
                                Explore PICO Consulting
                            </Button>
                        </a>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Contact Protocol</h3>
                        <div className="space-y-2 text-sm">
                             <p className="text-slate-300 flex justify-between">
                                <span className="text-slate-500">Email</span>
                                <a href="mailto:hkborah@gmail.com" className="hover:text-amber-500 transition-colors">hkborah@gmail.com</a>
                             </p>
                             <p className="text-slate-300 flex justify-between">
                                <span className="text-slate-500">LinkedIn</span>
                                <a href="https://www.linkedin.com/in/hkborah/" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">/in/hkborah</a>
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
