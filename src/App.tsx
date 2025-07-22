
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LorcanaProvider } from "@/context/LorcanaContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import TournamentsList from "./pages/TournamentsList";
import TournamentNew from "./pages/TournamentNew";
import TournamentDetail from "./pages/TournamentDetail";
import MisMazos from "./pages/MisMazos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LorcanaProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/torneos" element={<ProtectedRoute><TournamentsList /></ProtectedRoute>} />
                <Route path="/torneos/nuevo" element={<ProtectedRoute><TournamentNew /></ProtectedRoute>} />
                <Route path="/torneos/:id" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
                <Route path="/mis-mazos" element={<ProtectedRoute><MisMazos /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LorcanaProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
