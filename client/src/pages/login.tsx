import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [, params] = useRoute("/login/:type");
  const title = "Journal Login";
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [googleClientId, setGoogleClientId] = React.useState<string | null>(import.meta.env.VITE_GOOGLE_CLIENT_ID || null);

  React.useEffect(() => {
    // If not found in static env (e.g. built without secret), try fetching from server
    if (!googleClientId) {
      fetch("/api/config")
        .then(res => res.json())
        .then(data => {
          if (data.googleClientId) {
            setGoogleClientId(data.googleClientId);
          }
        })
        .catch(console.error);
    }
  }, [googleClientId]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login("editor", data.token);
        toast({
          title: "Access Granted",
          description: `Welcome back, ${data.user.username}...`,
        });
        navigate("/admin/journal");
      } else {
        toast({
          title: "Access Denied",
          description: data.error || "Authentication failed. Are you the superadmin?",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "Failed to connect to authentication server.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render the Google Login or an error warning if key is missing
  const renderGoogleAuth = () => {
    if (!googleClientId) {
      return (
        <div className="bg-amber-900/30 border border-amber-800/50 rounded p-4 text-xs text-amber-200/80 mb-6 text-center">
          <p className="font-semibold text-amber-500 mb-1">Google OAuth Not Configured</p>
          <p>Please add a <code>VITE_GOOGLE_CLIENT_ID</code> secret to enable "Sign in with Google" securely for your domain.</p>
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast({
                title: "Google Auth Failed",
                description: "Failed to initialize Google Sign In. Ensure third-party cookies are allowed.",
                variant: "destructive",
              });
            }}
            theme="filled_black"
            shape="rectangular"
            size="large"
            text="signin_with"
          />
        </GoogleOAuthProvider>
      </div>
    );
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
                {renderGoogleAuth()}
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
