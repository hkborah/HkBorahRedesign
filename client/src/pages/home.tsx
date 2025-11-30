import { MainLayout } from "@/components/layout/main-layout";
import { IntelligenceSidebar } from "@/components/home/intelligence-sidebar";
import { DigitalTwin } from "@/components/home/digital-twin";

export default function Home() {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] min-h-screen">
        {/* Left Sidebar - Fixed on Desktop */}
        <div className="hidden lg:block border-r border-slate-900 h-screen sticky top-0 bg-background z-10">
          <IntelligenceSidebar />
        </div>
        
        {/* Mobile Sidebar - Collapsed/Top? Design implies split. On mobile let's stack. */}
        <div className="lg:hidden bg-background border-b border-slate-900">
          <IntelligenceSidebar />
        </div>

        {/* Right Content - Digital Twin */}
        <div className="h-screen lg:overflow-hidden bg-slate-950">
          <DigitalTwin />
        </div>
      </div>
    </MainLayout>
  );
}
