import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import React, { useState, useEffect, ReactElement } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import ExamEditor from "./pages/ExamEditor.tsx";
import ExamTaking from "./pages/ExamTaking.tsx";
import Results from "./pages/Results.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoadingScreen from "./components/layout/LoadingScreen.tsx";
import AnimatedBackground from "./components/layout/AnimatedBackground";
import PageTransition from "./components/layout/PageTransition";
const queryClient = new QueryClient();

function RequireAuth({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function RequireAdmin({ children }: { children: ReactElement }) {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><RequireAuth><Dashboard /></RequireAuth></PageTransition>} />
        <Route path="/admin/dashboard" element={<PageTransition><RequireAdmin><AdminPage /></RequireAdmin></PageTransition>} />
        <Route path="/admin/exam/:id" element={<PageTransition><RequireAdmin><ExamEditor /></RequireAdmin></PageTransition>} />
        <Route path="/exam/:attemptId" element={<PageTransition><RequireAuth><ExamTaking /></RequireAuth></PageTransition>} />
        <Route path="/results/:attemptId" element={<PageTransition><RequireAuth><Results /></RequireAuth></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Artificial 2.5s delay to ensure the premium splash screen sequence is visible on initial load
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <LoadingScreen fullScreen={true} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ErrorBoundary>
              <AnimatedBackground />
              <AnimatedRoutes />
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
