
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyHeader = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800 ml-2">Sonhar Imóveis</h1>
        </Link>
        <div>
          <Link to="/" className="text-gray-600 hover:text-primary font-medium">Home</Link>
        </div>
      </nav>
    </header>
  );
};

export default PropertyHeader;
