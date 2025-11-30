import { MainLayout } from "@/components/layout/main-layout";
import { IntelligenceSidebar } from "@/components/home/intelligence-sidebar";
import { DigitalTwin } from "@/components/home/digital-twin";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col lg:grid lg:grid-cols-[450px_1fr] min-h-screen">
        {/* Left Sidebar - Fixed on Desktop, Stacked on Mobile */}
        <div className="lg:block border-b lg:border-b-0 lg:border-r border-slate-900 lg:h-screen lg:sticky lg:top-0 bg-background z-10 h-auto">
          <IntelligenceSidebar />
        </div>
        
        {/* Right Content - Digital Twin - Takes remaining height on desktop, full height on mobile */}
        <div className="flex-1 lg:h-screen lg:overflow-hidden bg-slate-950 min-h-[600px]">
          <DigitalTwin />
        </div>
      </div>
    </MainLayout>
  );
}
