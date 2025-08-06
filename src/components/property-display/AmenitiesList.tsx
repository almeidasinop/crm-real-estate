import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CookingPot, Home, ParkingSquare, WashingMachine, Wind, Waves } from 'lucide-react';
import React from 'react';

// --- Mapeamento de Ícones (pode ser expandido) ---
const amenityIcons: { [key: string]: React.ElementType } = {
  'Cozinha': CookingPot,
  'Piscina': Waves,
  'Garagem': ParkingSquare,
  'Lavanderia': WashingMachine,
  'Ar Condicionado': Wind,
  'Mobiliado': Home,
  'Jardim': Home, // Exemplo de ícone genérico
  'Segurança': Home, // Exemplo de ícone genérico
};

interface AmenitiesListProps {
  amenities: string[];
}

const AmenitiesList = ({ amenities }: AmenitiesListProps) => {
  // --- Defensive Coding: Check for valid amenities array ---
  if (!amenities || amenities.length === 0) {
    return null; // Não renderiza nada se não houver comodidades
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Características do Imóvel</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {amenities.map((amenity) => {
          const Icon = amenityIcons[amenity] || Home;// Usa um ícone padrão se não encontrar
          return (
            <div key={amenity} className="flex items-center text-gray-700">
              <Icon className="text-brand-blue mr-3 text-xl" />
              {amenity}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmenitiesList;
