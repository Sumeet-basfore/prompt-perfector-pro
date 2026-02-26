import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProjectsProvider } from "@/lib/contexts/ProjectsContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ProjectsSidebar } from "./components/projects/ProjectsSidebar";
import { ProjectDetail } from "./pages/ProjectDetail";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Particles } from "./components/ui/particles";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTooltip } from "@/components/ui/onboarding-tooltip";

const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { hasSeenSaveTooltip, markSaveTooltipSeen } = useOnboarding();
  const [showSaveTooltip, setShowSaveTooltip] = useState(false);

  // We need to listen for a custom event from Index.tsx since they don't share context easily here
  useEffect(() => {
    const handleSuccessfulEnhance = () => {
      if (!hasSeenSaveTooltip) {
        setShowSaveTooltip(true);
      }
    };
    window.addEventListener('vibe-prompt:success', handleSuccessfulEnhance);
    return () => window.removeEventListener('vibe-prompt:success', handleSuccessfulEnhance);
  }, [hasSeenSaveTooltip]);

  return (
    <div className="flex h-screen overflow-hidden relative bg-hero-gradient">
      {/* Magic UI Particles Background */}
      <Particles
        className="absolute inset-0 z-[-1]"
        quantity={150}
        ease={80}
        color="#a78bfa"
        refresh
      />

      <ProjectsSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} overlay={isHomePage} />

      {/* Sidebar Toggle Button (when closed) */}
      {!isSidebarOpen && (
        <div className="absolute top-4 left-4 z-50">
          <OnboardingTooltip
            isOpen={showSaveTooltip}
            onClose={() => {
              setShowSaveTooltip(false);
              markSaveTooltipSeen();
            }}
            position="right"
            title="Saved Automatically!"
            className="w-56"
          >
            Your prompt was saved. Open the sidebar to view your project history.
          </OnboardingTooltip>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/60 backdrop-blur-md shadow-sm border-border/50 hover:bg-background/80"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto w-full relative z-0">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <ProjectsProvider>
      <TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/projects/:projectId/settings" element={<ProjectDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProjectsProvider>
  </ErrorBoundary>
);

export default App;
