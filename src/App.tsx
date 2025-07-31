import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UploadContent from "./pages/UploadContent";
import Summarize from "./pages/Summarize";
import Flashcards from "./pages/Flashcards";
import MindMap from "./pages/MindMap";
import Chat from "./pages/Chat";
import Pomodoro from "./pages/Pomodoro";
import Quizzes from "./pages/Quizzes"; // Import the new Quizzes page
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={<UploadContent />} />
            <Route path="/summarize" element={<Summarize />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/mindmap" element={<MindMap />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/quizzes" element={<Quizzes />} /> {/* Add the new route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;