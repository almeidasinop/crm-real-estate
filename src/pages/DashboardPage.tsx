
import PageLayout from "@/components/layout/PageLayout";
import StatCards from "@/components/dashboard/StatCards";
import TasksPanel from "@/components/dashboard/TasksPanel";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { useAuth } from "@/contexts/AuthContext";

const DashboardPage = () => {
  const { user, role } = useAuth();
  
  const welcomeMessage = user 
    ? `Bem-vindo de volta, ${user.displayName || user.email}!` 
    : "Bem-vindo ao seu painel!";
  const roleDescription = role === 'admin' 
    ? "Você tem acesso total ao sistema." 
    : "Aqui você pode gerenciar seus leads e propriedades.";

  return (
    <PageLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{welcomeMessage}</h2>
            <p className="text-muted-foreground">{roleDescription}</p>
          </div>
        </div>
        
        <StatCards />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
          <TasksPanel />
          <AlertsPanel />
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
