
import PropertyCard from "./PropertyCard";

const mockProperties = [
  {
    id: 1,
    title: "Apartamento Moderno no Centro",
    location: "Centro, São Paulo",
    price: "R$ 1.200.000",
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    imageUrl: "https://via.placeholder.com/400x300/1E40AF/FFFFFF?text=Imóvel+1",
    type: "Venda",
  },
  {
    id: 2,
    title: "Casa Espaçosa com Piscina",
    location: "Jardins, São Paulo",
    price: "R$ 3.500.000",
    bedrooms: 4,
    bathrooms: 5,
    garages: 4,
    imageUrl: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Imóvel+2",
    type: "Venda",
  },
  {
    id: 3,
    title: "Cobertura Duplex com Vista",
    location: "Ipanema, Rio de Janeiro",
    price: "R$ 15.000 / mês",
    bedrooms: 3,
    bathrooms: 4,
    garages: 3,
    imageUrl: "https://via.placeholder.com/400x300/1E3A8A/FFFFFF?text=Imóvel+3",
    type: "Aluguel",
  },
    {
    id: 4,
    title: "Apartamento Moderno no Centro",
    location: "Centro, São Paulo",
    price: "R$ 1.200.000",
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    imageUrl: "https://via.placeholder.com/400x300/1E40AF/FFFFFF?text=Imóvel+1",
    type: "Venda",
  },
  {
    id: 5,
    title: "Casa Espaçosa com Piscina",
    location: "Jardins, São Paulo",
    price: "R$ 3.500.000",
    bedrooms: 4,
    bathrooms: 5,
    garages: 4,
    imageUrl: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Imóvel+2",
    type: "Venda",
  },
  {
    id: 6,
    title: "Cobertura Duplex com Vista",
    location: "Ipanema, Rio de Janeiro",
    price: "R$ 15.000 / mês",
    bedrooms: 3,
    bathrooms: 4,
    garages: 3,
    imageUrl: "https://via.placeholder.com/400x300/1E3A8A/FFFFFF?text=Imóvel+3",
    type: "Aluguel",
  },
];

const PropertyList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;
