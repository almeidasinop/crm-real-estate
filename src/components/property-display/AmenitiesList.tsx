
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CookingPot, Home, ParkingSquare, WashingMachine, Wind, Waves } from 'lucide-react';
import React from 'react';

const amenityIcons: { [key: string]: React.ElementType } = {
  'Cozinha': CookingPot,
  'Piscina': Waves,
  'Garagem': ParkingSquare,
  'Lavanderia': WashingMachine,
  'Ar Condicionado': Wind,
  'Mobiliado': Home,
};

const AmenitiesList = ({ amenities }: { amenities: string[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comodidades</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity) => {
          const Icon = amenityIcons[amenity] || Home;
          return (
            <div key={amenity} className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-gray-700">{amenity}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AmenitiesList;
