import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/hkborah-logo.png";
import { Separator } from "@/components/ui/separator";

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

        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-16">
                <div className="space-y-8">
                    <div>
                        <span className="text-amber-500 font-mono text-sm uppercase tracking-widest mb-2 block">About The Architect</span>
                        <h1 className="text-5xl font-serif font-bold text-slate-100 mb-6">HK Borah</h1>
                        <p className="text-xl text-slate-300 font-light leading-relaxed">
                            Business Architect. Systems Thinker. Author.
                        </p>
                    </div>

                    <div className="prose prose-invert prose-slate max-w-none">
                        <p>
                            HK Borah is not just a consultant; he is a Business Architect who believes that an enduring company is not stumbled upon—it is architected. With a deep understanding of organizational dynamics and systems theory, HK helps founders transition from chaotic growth to scalable order.
                        </p>
                        <p>
                            His work focuses on identifying friction points in business operations and redesigning them into engines of growth. He is the author of "The Order of Chaos," a blueprint for founders looking to build legacy institutions.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8">
                        <div>
                            <h3 className="text-3xl font-bold text-slate-200 mb-2">15+</h3>
                            <p className="text-sm font-mono text-slate-500 uppercase">Years Experience</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-200 mb-2">50+</h3>
                            <p className="text-sm font-mono text-slate-500 uppercase">Systems Architected</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden relative">
                        {/* Placeholder for HK Borah Photo - using a generic professional silhouette or pattern for now if no photo provided */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                           <span className="font-mono text-xs">[PORTRAIT]</span>
                        </div>
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
