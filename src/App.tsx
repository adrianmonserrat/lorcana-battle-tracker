
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LorcanaProvider } from "@/context/LorcanaContext";
import { AuthProvider } from "@/components/auth/AuthProvider";

import Index from "./pages/Index";
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
                <Route path="/" element={<Index />} />
                <Route path="/torneos" element={<TournamentsList />} />
                <Route path="/torneos/nuevo" element={<TournamentNew />} />
                <Route path="/torneos/:id" element={<TournamentDetail />} />
                <Route path="/mis-mazos" element={<MisMazos />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LorcanaProvider>
      </AuthProvider>
    </QueryClientProvider>
  </TooltipProvider>
);

export default App;
