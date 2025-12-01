import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock } from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

const VALID_CREDENTIALS = {
  email: "hkborah@gmail.com",
  password: "ScalingFramework2024"
};

export default function Login() {
  const [, params] = useRoute("/login/:type");
  const title = "Journal Login";
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate credentials
    setTimeout(() => {
      setIsLoading(false);
      if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
        login("editor");
        toast({
            title: "Access Granted",
            description: `Welcome to the Journal Editor...`,
        });
        navigate("/admin/journal");
      } else {
        toast({
            title: "Access Denied",
            description: "Invalid email or password.",
            variant: "destructive"
        });
      }
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-6 left-6">
             <Link href="/">
                <Button variant="ghost" className="text-slate-400 hover:text-amber-500 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Return
                </Button>
            </Link>
        </div>

        <div className="w-full max-w-md p-8 space-y-8 relative z-10">
            <div className="text-center space-y-4">
                <img src={logoUrl} alt="HK Borah" className="h-10 mx-auto object-contain opacity-80" />
                <h1 className="text-2xl font-serif font-bold text-slate-200">{title}</h1>
                <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">Secure Access Protocol</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-lg backdrop-blur-sm">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-400">Identity</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-amber-500/50" 
                          required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-400">Passcode</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="Enter passcode"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-amber-500/50" 
                          required 
                        />
                    </div>
                    <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium" disabled={isLoading}>
                        {isLoading ? (
                            <span className="animate-pulse">Authenticating...</span>
                        ) : (
                            <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Access Vault</span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
        
        {/* Background FX */}
        <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </MainLayout>
  );
}
