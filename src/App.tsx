import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// Componentes e Páginas
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import PropertyDisplayPage from "./pages/PropertyDisplayPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
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
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { trackPageView } from "./utils/analytics";
// --- CORREÇÃO AQUI: Revertido para o import original ---
import { ThemeProvider } from "next-themes";

// --- Definição das Rotas (sem alterações) ---
const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/imovel/:id", element: <PropertyDisplayPage /> },
  { path: "/login", element: <LoginPage /> },
];
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
const adminRoutes = [
  { path: "/settings", element: <SettingsPage /> }
];
const redirects = [
  { from: "/relatorios", to: "/estatisticas" },
  { from: "/configuracoes", to: "/dashboard" },
  { from: "/admin", to: "/settings" },
];

const queryClient = new QueryClient();

const RouterChangeHandler = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'home' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);
  
  return null;
};

// --- NOVO COMPONENTE PARA CONTROLAR O TEMA E CONTEÚDO ---
const AppContent = () => {
  const { user } = useAuth();

  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="system" 
      enableSystem
      // Força o tema claro se não houver utilizador
      forcedTheme={!user ? 'light' : undefined}
    >
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
    </ThemeProvider>
  );
};

// --- COMPONENTE PRINCIPAL REESTRUTURADO ---
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
