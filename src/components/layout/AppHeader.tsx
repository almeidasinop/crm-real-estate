
import { Link } from 'react-router-dom';
import { Settings } from '@/types/crm'; // Supondo que o tipo Settings esteja em crm.ts

interface AppHeaderProps {
  settings: Settings;
}

const AppHeader = ({ settings }: AppHeaderProps) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 force-light-card">
      <nav className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          {settings.headerLogoUrl ?
            <img src={settings.headerLogoUrl} alt={settings.companyName} className="h-10 max-h-12" /> :
            <span className="text-3xl font-extrabold text-brand-blue">{settings.companyName}</span>}
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-brand-blue transition font-medium font-sans">Home</Link>
          <Link to="/propriedades" className="text-gray-700 hover:text-brand-blue transition font-medium font-sans">Imóveis</Link>
          <Link to="/dashboard" className="bg-brand-blue text-white px-5 py-2 rounded-lg hover:bg-brand-blue-dark transition font-semibold font-sans">Área do Corretor</Link>
        </div>
        {/* Lógica para menu mobile pode ser adicionada aqui se necessário */}
      </nav>
    </header>
  );
};

export default AppHeader;
