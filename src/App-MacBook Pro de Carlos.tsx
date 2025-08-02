
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import PropriedadesPage from "./pages/PropriedadesPage";
import ClientesPage from "./pages/ClientesPage";
import AgentesPage from "./pages/AgentesPage";
import FinancePage from "./pages/FinancePage";
import PipelinePage from "./pages/PipelinePage";
import VisitasPage from "./pages/VisitasPage";
import ContratosPage from "./pages/ContratosPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { trackPageView } from "./utils/analytics";

import PropertyDisplayPage from "./pages/PropertyDisplayPage";

// Define routes configuration with redirects
const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/imovel/:id", element: <PropertyDisplayPage /> },
  { path: "/propriedades", element: <PropriedadesPage /> },
  { path: "/clientes", element: <ClientesPage /> },
  { path: "/agentes", element: <AgentesPage /> },
  { path: "/pipeline", element: <PipelinePage /> },
  { path: "/visitas", element: <VisitasPage /> },
  { path: "/contratos", element: <ContratosPage /> },
  { path: "/financeiro", element: <FinancePage /> },
  { path: "/configuracoes", element: <Navigate to="/dashboard" replace /> },
  // Redirects antigos para compatibilidade com URLs francesas
  { path: "/finances", element: <Navigate to="/financeiro" replace /> },
  { path: "/parametres", element: <Navigate to="/configuracoes" replace /> },
  // Old redirects for compatibility
  { path: "/parcelles", element: <Navigate to="/propriedades" replace /> },
  { path: "*", element: <NotFound /> }
];

// Create query client with enhanced configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Router change handler component
const RouterChangeHandler = () => {
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Track page view for analytics
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'dashboard' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);
  
  return null;
};

import { ThemeProvider } from "next-themes";

// Application main component with properly nested providers
const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <AppSettingsProvider>
            <CRMProvider>
              <TooltipProvider>
                <RouterChangeHandler />
                <Routes>
                  {routes.map((route) => (
                    <Route 
                      key={route.path} 
                      path={route.path} 
                      element={route.element} 
                    />
                  ))}
                </Routes>
              </TooltipProvider>
            </CRMProvider>
          </AppSettingsProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
