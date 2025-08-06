
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { Settings } from '@/types/crm';

interface AppFooterProps {
  settings: Settings;
}

const AppFooter = ({ settings }: AppFooterProps) => {
  return (
    <footer className="bg-footer-bg text-white">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            {settings.footerLogoUrl ? <img src={settings.footerLogoUrl} alt={settings.companyName} className="h-12 mb-4 mx-auto md:mx-0" /> : <h4 className="text-2xl font-extrabold mb-4">{settings.companyName}</h4>}
            <p className="text-gray-400">Transformando sonhos em realidade, encontrando o lar perfeito para cada cliente.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              {settings.footerPhone && <li className="flex items-center justify-center md:justify-start"><Phone className="mr-3 h-4 w-4" /> {settings.footerPhone}</li>}
              {settings.footerEmail && <li className="flex items-center justify-center md:justify-start"><Mail className="mr-3 h-4 w-4" /> {settings.footerEmail}</li>}
              {settings.footerAddress && <li className="flex items-center justify-center md:justify-start"><MapPin className="mr-3 h-4 w-4" /> {settings.footerAddress}</li>}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Siga-nos</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><Facebook /></a>}
              {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><Instagram /></a>}
              {/* Adicione outros ícones sociais se necessário */}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {settings.companyName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
