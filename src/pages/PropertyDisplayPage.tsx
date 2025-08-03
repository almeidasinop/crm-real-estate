

import AmenitiesList from "@/components/property-display/AmenitiesList";
import AdvancedSearch from "@/components/property-display/AdvancedSearch";
import BookingForm from "@/components/property-display/BookingForm";
import BrokerCard from "@/components/property-display/BrokerCard";
import ContactForm from "@/components/property-display/ContactForm";
import FinancingCalculator from "@/components/property-display/FinancingCalculator";
import ImageGallery from "@/components/property-display/ImageGallery";
import PropertyDetailsTable from "@/components/property-display/PropertyDetailsTable";
import PropertyFooter from "@/components/property-display/PropertyFooter";
import PropertyHeader from "@/components/property-display/PropertyHeader";
import PropertyInfo from "@/components/property-display/PropertyInfo";
import SidePropertyList from "@/components/property-display/SidePropertyList";
import { useParams } from 'react-router-dom';
import { useProperty, useProperties } from '@/hooks/use-properties';

// Mock data for a single property
const mockProperty = {
  id: 1,
  title: "Apartamento de Luxo com Vista para o Parque",
  price: "R$ 2.500.000",
  publishedDate: "15/07/2024",
  type: "Venda",
  description: `Este apartamento exclusivo oferece uma experiência de vida incomparável, com vistas deslumbrantes para o parque e um design de interiores sofisticado. A sala de estar em conceito aberto é perfeita para receber amigos e familiares, enquanto a suíte master proporciona um refúgio de tranquilidade.\n\nLocalizado em um dos bairros mais cobiçados da cidade, o condomínio oferece segurança 24 horas, área de lazer completa com piscina, academia e salão de festas. Uma oportunidade única para quem busca conforto, luxo e qualidade de vida.`,
  imageUrls: [
    "https://via.placeholder.com/800x600/1E40AF/FFFFFF?text=Sala+de+Estar",
    "https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Cozinha",
    "https://via.placeholder.com/800x600/1E3A8A/FFFFFF?text=Suíte+Master",
    "https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Varanda+Gourmet",
  ],
  details: {
    builtArea: "180 m²",
    landArea: "N/A",
    yearBuilt: 2022,
  },
  amenities: ["Cozinha", "Piscina", "Garagem", "Lavanderia", "Ar Condicionado", "Mobiliado"],
};

const mockBroker = {
  name: "Glaucio Plablo",
  creci: "67890-F",
  phone: "(11) 98765-4321",
  imageUrl: "https://via.placeholder.com/150/000000/FFFFFF?text=GP",
};

const recentProperties = [
  { id: 2, title: "Casa Térrea no Interior", price: "R$ 850.000" },
  { id: 3, title: "Studio Moderno", price: "R$ 600.000" },
];

const relatedProperties = [
  { id: 4, title: "Apartamento com 2 Suítes", price: "R$ 2.200.000" },
  { id: 5, title: "Cobertura com Piscina Privativa", price: "R$ 4.000.000" },
];

// Remova os dados mocados (mockProperty, mockBroker, recentProperties, relatedProperties)

const PropertyDisplayPage = () => {
  const { id } = useParams<{ id: string }>();

  // Busca a propriedade principal pelo ID
  const { data: property, isLoading, isError } = useProperty(id || '');

  // Busca propriedades recentes e relacionadas (exemplo)
  const { data: recentProperties } = useProperties(5); // 5 mais recentes
  const { data: relatedProperties } = useProperties(5); // Lógica de relacionamento pode ser mais complexa

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError || !property) {
    return <div>Erro ao carregar a propriedade ou propriedade não encontrada.</div>;
  }

  // Dados do corretor podem vir da propriedade ou de outra busca
  const broker = property.broker; // Supondo que a propriedade tenha os dados do corretor

  return (
    <div className="bg-gray-50">
      <PropertyHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery imageUrls={property.imageUrls} />
            <PropertyInfo property={property} />
            <PropertyDetailsTable details={property.details} />
            <AmenitiesList amenities={property.amenities} />
            <ContactForm />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {broker && <BrokerCard broker={broker} />}
            <BookingForm />
            <FinancingCalculator />
            <AdvancedSearch />
            <SidePropertyList title="Propriedades Recentes" properties={recentProperties || []} />
            <SidePropertyList title="Propriedades Relacionadas" properties={relatedProperties || []} />
          </aside>
        </div>
      </main>
      <PropertyFooter />
    </div>
  );
};

export default PropertyDisplayPage;
