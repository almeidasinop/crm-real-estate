import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";

const AdminPage = () => {
  const { user, role } = useAuth();

  return (
    <PageLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Página de Administração</h1>
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Esta página só pode ser acessada por usuários com o papel de 'admin'.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong>Email do Usuário:</strong> {user?.email}</p>
            <p className="mb-2"><strong>UID do Usuário:</strong> {user?.uid}</p>
            <p className="mb-2"><strong>Papel (Role):</strong> <span className="font-bold text-primary">{role}</span></p>
            <p className="mt-4 text-sm text-muted-foreground">
              Aqui você poderia adicionar funcionalidades exclusivas para administradores, como
              gestão de usuários, configurações globais do sistema, etc.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AdminPage;
