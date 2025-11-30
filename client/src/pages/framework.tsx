import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/hkborah-logo.png";
import bookCoverUrl from "@assets/book-cover.png";

export default function Framework() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header for internal page */}
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

        <div className="flex-1 container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-center gap-16">
            {/* Book Cover */}
            <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-amber-500 rounded blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <img 
                        src={bookCoverUrl} 
                        alt="The Order of Chaos Book Cover" 
                        className="relative rounded shadow-2xl transform transition duration-500 group-hover:-translate-y-2 w-[300px] md:w-[350px]"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 space-y-8">
                <div>
                    <span className="text-amber-500 font-mono text-sm uppercase tracking-widest mb-2 block">Architectural Scaling Framework</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-100 mb-6">The Order of Chaos</h1>
                    <p className="text-xl text-slate-400 leading-relaxed font-light">
                        A Founder's Blueprint to Scaling Businesses. This is not just a book; it is a manual for constructing enduring enterprises. 
                        Learn how to identify friction, leverage chaos, and architect systems that scale effortlessly.
                    </p>
                </div>

                <div className="space-y-4 border-l-2 border-slate-800 pl-6 py-2">
                    <h3 className="text-slate-200 font-medium text-lg">What's Inside:</h3>
                    <ul className="space-y-2 text-slate-400 font-light">
                        <li>• The Anatomy of Business Friction</li>
                        <li>• Systems Thinking for Founders</li>
                        <li>• From Startup Chaos to Enterprise Order</li>
                        <li>• The Architectural Mindset</li>
                    </ul>
                </div>

                <div className="pt-8">
                    <a href="https://notionpress.com/in/read/the-order-of-chaos" target="_blank" rel="noreferrer">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-6 text-lg font-medium rounded-none">
                            Acquire the Manual <ShoppingCart className="ml-2 h-5 w-5" />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
