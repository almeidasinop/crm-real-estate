import React from 'react';
// Revertido para o Marker original para garantir compatibilidade com o seu ambiente
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

interface PropertyMapProps {
  location: {
    lat: number;
    lng: number;
  };
}

const PropertyMap: React.FC<PropertyMapProps> = ({ location }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Carregando mapa...</div>;
  if (!location?.lat || !location?.lng) return null;

  const center = {
    lat: location.lat,
    lng: location.lng,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Localização</h2>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
        >
            {/* Usa o componente Marker original, que é compatível com sua versão */}
            <Marker position={center} />
        </GoogleMap>
    </div>
  );
};

export default PropertyMap;
