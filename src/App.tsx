
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Componentes de Rota
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Páginas Públicas
import HomePage from "./pages/HomePage";
import PropertyDisplayPage from "./pages/PropertyDisplayPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Páginas do CRM
import DashboardPage from "./pages/DashboardPage";
import PropriedadesPage from "./pages/PropriedadesPage";
import ParcelsDetailsPage from "./pages/ParcelsDetailsPage";
import ClientesPage from "./pages/ClientesPage";
import AgentesPage from "./pages/AgentesPage";
import FinancePage from "./pages/FinancePage";
import StatsPage from "./pages/StatsPage";
import PipelinePage from "./pages/PipelinePage";
import VisitasPage from "./pages/VisitasPage";
import ContratosPage from "./pages/ContratosPage";
import FirebaseTestPage from "./pages/FirebaseTestPage";
import SettingsPage from "./pages/SettingsPage"; 

// Contextos e Utilitários
import { useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { trackPageView } from "./utils/analytics";
import { ThemeProvider } from "next-themes";

// --- Definição das Rotas ---

const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/imovel/:id", element: <PropertyDisplayPage /> },
  { path: "/login", element: <LoginPage /> },
];

// Rotas para todos os usuários logados (admin e corretor)
const crmRoutes = [
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/propriedades", element: <PropriedadesPage /> },
  { path: "/propriedades/:id", element: <ParcelsDetailsPage /> },
  { path: "/clientes", element: <ClientesPage /> },
  { path: "/agentes", element: <AgentesPage /> },
  { path: "/pipeline", element: <PipelinePage /> },
  { path: "/visitas", element: <VisitasPage /> },
  { path: "/contratos", element: <ContratosPage /> },
  { path: "/financeiro", element: <FinancePage /> },
  { path: "/estatisticas", element: <StatisticsProvider><StatsPage /></StatisticsProvider> },
  { path: "/teste-firebase", element: <FirebaseTestPage /> },
];

// Rotas exclusivas para admin
const adminRoutes = [
  { path: "/settings", element: <SettingsPage /> }
];

const redirects = [
  { from: "/relatorios", to: "/estatisticas" },
  { from: "/configuracoes", to: "/dashboard" },
  { from: "/admin", to: "/settings" },
];

// --- Configurações ---
const queryClient = new QueryClient({ /* ...opções... */ });

const RouterChangeHandler = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'home' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);
  
  return null;
};

// --- Componente Principal ---
const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AppSettingsProvider>
              <CRMProvider>
                <TooltipProvider>
                  <RouterChangeHandler />
                  <Routes>
                    {/* Rotas Públicas */}
                    {publicRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}

                    {/* Rotas Protegidas para todos os usuários logados */}
                    <Route element={<ProtectedRoute />}>
                      {crmRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
                    </Route>

                    {/* Rotas Protegidas exclusivas para Admin */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                      {adminRoutes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
                    </Route>

                    {/* Redirecionamentos */}
                    {redirects.map(r => <Route key={r.from} path={r.from} element={<Navigate to={r.to} replace />} />)}

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </CRMProvider>
            </AppSettingsProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
