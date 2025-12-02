import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const [, params] = useRoute("/login/:type");
  const title = "Journal Login";
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [isSendingReset, setIsSendingReset] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        login("editor", data.token);
        toast({
          title: "Access Granted",
          description: `Welcome to the Journal Editor...`,
        });
        navigate("/admin/journal");
      } else {
        toast({
          title: "Access Denied",
          description: data.error || "Invalid email or password.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "Failed to connect. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingReset(true);
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Reset Link Sent",
          description: "If an account exists with this email, you will receive a password reset link shortly.",
        });
        setShowForgotPassword(false);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send reset link",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingReset(false);
    }
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
                {!showForgotPassword ? (
                  <>
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
                              data-testid="input-email"
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
                              data-testid="input-password"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium" disabled={isLoading} data-testid="button-login">
                            {isLoading ? (
                                <span className="animate-pulse">Authenticating...</span>
                            ) : (
                                <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Access Vault</span>
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setShowForgotPassword(true)}
                        className="text-slate-500 hover:text-amber-500 text-sm transition-colors"
                        data-testid="link-forgot-password"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="forgot-email" className="text-slate-400">Email Address</Label>
                            <Input 
                              id="forgot-email" 
                              type="email" 
                              placeholder="your@email.com" 
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-amber-500/50" 
                              required 
                              data-testid="input-forgot-email"
                            />
                        </div>
                        <p className="text-slate-500 text-xs">
                          A password reset link will be sent to this email address.
                        </p>
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium" disabled={isSendingReset} data-testid="button-send-reset">
                            {isSendingReset ? (
                                <span className="animate-pulse">Sending...</span>
                            ) : (
                                <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> Send Reset Link</span>
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setShowForgotPassword(false)}
                        className="text-slate-500 hover:text-amber-500 text-sm transition-colors"
                        data-testid="link-back-to-login"
                      >
                        Back to Login
                      </button>
                    </div>
                  </>
                )}
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
