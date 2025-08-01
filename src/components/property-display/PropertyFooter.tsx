
import { Building2, Mail, Phone } from 'lucide-react';

const PropertyFooter = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold ml-2">Sonhar Imóveis</h2>
          </div>
          <p className="text-gray-400">Sua parceira na busca pelo imóvel ideal. Oferecemos consultoria completa para compra, venda e aluguel.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              <span>(11) 99999-8888</span>
            </li>
            <li className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              <span>contato@sonharimoveis.com.br</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
          <p className="text-gray-400">CRECI: 12345-F</p>
          <p className="text-gray-400">São Paulo, SP, Brasil</p>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <p className="text-center text-gray-500 text-sm">© {new Date().getFullYear()} Sonhar Imóveis. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default PropertyFooter;
