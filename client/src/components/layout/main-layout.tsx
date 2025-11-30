import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VaultMenu } from "@/components/layout/vault-menu";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean; // Helper if we want to toggle the left sidebar globally, but Home manages it specifically usually
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-amber-500/30">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 pointer-events-none">
        {/* Logo Area - Visible on all pages? Design shows it top left. */}
        <div className="pointer-events-auto">
          {/* Only show simple text logo if we are NOT on home page, because home page sidebar handles the big logo */}
          {/* Actually, let's keep it consistent. The sidebar on home has the logo. On other pages, we might need a logo. */}
        </div>

        {/* Menu Trigger */}
        <Button 
          variant="ghost" 
          className="text-xs font-mono tracking-widest text-slate-400 hover:text-amber-500 pointer-events-auto flex items-center gap-2 uppercase"
          onClick={() => setIsMenuOpen(true)}
        >
          <span>The Vault</span>
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Vault Menu Overlay */}
      <VaultMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
