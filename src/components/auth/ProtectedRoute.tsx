
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'corretor')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    // Você pode substituir isso por um spinner/componente de loading mais elaborado
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!user) {
    // Se não estiver logado, redireciona para a página de login,
    // guardando a página que ele tentou acessar para redirecioná-lo de volta depois.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role!)) {
    // Se o usuário está logado, mas não tem a permissão necessária,
    // redireciona para uma página de "Não Autorizado" ou para o dashboard.
    // Por enquanto, vamos redirecionar para o dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  // Se o usuário está logado e (não há restrição de role ou ele tem a role permitida),
  // renderiza o componente da rota solicitada.
  return <Outlet />;
};

export default ProtectedRoute;
