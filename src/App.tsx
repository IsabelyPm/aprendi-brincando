import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PlatformIndex from "./pages/Platform/PlatformIndex.tsx";
import Vogais from "./pages/Platform/Vogais.tsx";
import Silabas from "./pages/Platform/Silabas.tsx";
import Palavras from "./pages/Platform/Palavras.tsx";
import Frases from "./pages/Platform/Frases.tsx";
import MateriaisPage from "./pages/Platform/MateriaisPage.tsx";
import CanhaoLetras from "./pages/Platform/CanhaoLetras.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plataforma" element={<PlatformIndex />} />
          <Route path="/plataforma/vogais" element={<Vogais />} />
          <Route path="/plataforma/silabas" element={<Silabas />} />
          <Route path="/plataforma/palavras" element={<Palavras />} />
          <Route path="/plataforma/frases" element={<Frases />} />
          <Route path="/materiais" element={<MateriaisPage />} />
          <Route path="/canhao" element={<CanhaoLetras />} />
          <Route path="/pdfs" element={<MateriaisPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
