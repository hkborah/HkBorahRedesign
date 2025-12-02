import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setToken(urlParams.get("token"));
      setIsInitialized(true);
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Password Reset",
          description: "Your password has been successfully reset.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reset password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!token) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full max-w-md p-8 space-y-8 relative z-10 text-center">
            <img src={logoUrl} alt="HK Borah" className="h-10 mx-auto object-contain opacity-80" />
            <h1 className="text-2xl font-serif font-bold text-slate-200">Invalid Reset Link</h1>
            <p className="text-slate-400">This password reset link is invalid or has expired.</p>
            <Link href="/login/editor">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium">
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isSuccess) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full max-w-md p-8 space-y-8 relative z-10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-serif font-bold text-slate-200">Password Reset Complete</h1>
            <p className="text-slate-400">Your password has been successfully reset. You can now log in with your new password.</p>
            <Link href="/login/editor">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-6 left-6">
          <Link href="/login/editor">
            <Button variant="ghost" className="text-slate-400 hover:text-amber-500 gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-md p-8 space-y-8 relative z-10">
          <div className="text-center space-y-4">
            <img src={logoUrl} alt="HK Borah" className="h-10 mx-auto object-contain opacity-80" />
            <h1 className="text-2xl font-serif font-bold text-slate-200">Reset Your Password</h1>
            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">Enter New Credentials</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-lg backdrop-blur-sm">
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-slate-400">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-amber-500/50" 
                  required 
                  minLength={6}
                  data-testid="input-new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-400">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-amber-500/50" 
                  required 
                  minLength={6}
                  data-testid="input-confirm-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium" 
                disabled={isLoading}
                data-testid="button-reset-password"
              >
                {isLoading ? (
                  <span className="animate-pulse">Resetting...</span>
                ) : (
                  <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Reset Password</span>
                )}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </MainLayout>
  );
}
