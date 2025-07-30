
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import PropriedadesPage from "./pages/PropriedadesPage";
import ParcelsDetailsPage from "./pages/ParcelsDetailsPage";
import ClientesPage from "./pages/ClientesPage";
import AgentesPage from "./pages/AgentesPage";
import FinancePage from "./pages/FinancePage";
import StatsPage from "./pages/StatsPage";
import PipelinePage from "./pages/PipelinePage";
import VisitasPage from "./pages/VisitasPage";
import ContratosPage from "./pages/ContratosPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { trackPageView } from "./utils/analytics";

// Define routes configuration with redirects
const routes = [
  { path: "/", element: <Index /> },
  { path: "/propriedades", element: <PropriedadesPage /> },
  { path: "/propriedades/:id", element: <ParcelsDetailsPage /> },
  { path: "/clientes", element: <ClientesPage /> },
  { path: "/agentes", element: <AgentesPage /> },
  { path: "/pipeline", element: <PipelinePage /> },
  { path: "/visitas", element: <VisitasPage /> },
  { path: "/contratos", element: <ContratosPage /> },
  { path: "/financeiro", element: <FinancePage /> },
  { path: "/estatisticas", element: <StatisticsProvider><StatsPage /></StatisticsProvider> },
  { path: "/relatorios", element: <Navigate to="/estatisticas" replace /> },
  { path: "/configuracoes", element: <Navigate to="/" replace /> },
  // Redirects antigos para compatibilidade com URLs francesas
  { path: "/finances", element: <Navigate to="/financeiro" replace /> },
  { path: "/statistiques", element: <Navigate to="/estatisticas" replace /> },
  { path: "/rapports", element: <Navigate to="/relatorios" replace /> },
  { path: "/parametres", element: <Navigate to="/configuracoes" replace /> },
  { path: "/dashboard", element: <Navigate to="/" replace /> },
  // Old redirects for compatibility
  { path: "/parcelles", element: <Navigate to="/propriedades" replace /> },
  { path: "/cultures", element: <Navigate to="/clientes" replace /> },
  { path: "/inventaire", element: <Navigate to="/agentes" replace /> },
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

// Application main component with properly nested providers
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <CRMProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </CRMProvider>
      </AppSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
