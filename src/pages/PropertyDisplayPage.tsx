import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useParams } from 'react-router-dom';
import { useProperty } from '@/hooks/use-properties';

// Importando todos os componentes necessários
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import ImageGallery from "@/components/property-display/ImageGallery";
import PropertyInfo from "@/components/property-display/PropertyInfo";
import PropertyDetailsTable from "@/components/property-display/PropertyDetailsTable";
import AmenitiesList from "@/components/property-display/AmenitiesList";
import BrokerCard from "@/components/property-display/BrokerCard";
import PropertyMap from "@/components/property-display/PropertyMap";
import BookingForm from '@/components/property-display/BookingForm';
import ProposalForm from '@/components/property-display/ProposalForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlayCircle } from 'lucide-react';

import { Settings } from '@/types/crm';

const defaultSettings: Settings = {
    companyName: "Sonhar Imóveis",
    footerPhone: "(00) 1234-5678",
    footerEmail: "contato@imobiliaria.com",
    footerAddress: "Seu Endereço Completo Aqui",
};

// Componente para a descrição longa, para manter o código principal limpo
const PropertyDescription = ({ description }: { description?: string }) => {
  if (!description) return null;
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Descrição</h2>
      <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
};

// --- NOVO COMPONENTE DE VÍDEO COM MODAL ---
const YouTubeEmbed = ({ videoUrl }: { videoUrl?: string }) => {
    if (!videoUrl) return null;

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(videoUrl);

    if (!videoId) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vídeo do Imóvel</h2>
                <p className="text-red-500">URL do vídeo do YouTube inválida.</p>
            </div>
        );
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return (
        <Dialog>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vídeo do Imóvel</h2>
                <DialogTrigger asChild>
                    <div className="relative cursor-pointer group">
                        <img src={thumbnailUrl} alt="Thumbnail do vídeo" className="w-full rounded-lg object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg transition-opacity opacity-0 group-hover:opacity-100">
                            <PlayCircle className="h-16 w-16 text-white" />
                        </div>
                    </div>
                </DialogTrigger>
            </div>

            <DialogContent className="max-w-3xl p-0 border-0 bg-transparent">
                <div className="aspect-video">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    );
};


const PropertyDisplayPage = () => {
  const { id } = useParams<{ id: string }>();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { data: property, isLoading, isError } = useProperty(id || '');

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsDocRef = doc(db, "settings", "general");
      const settingsSnap = await getDoc(settingsDocRef);
      if (settingsSnap.exists()) {
        setSettings(settingsSnap.data() as Settings);
      }
    };
    fetchSettings();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (isError || !property) {
    return <div>Erro ao carregar a propriedade ou propriedade não encontrada.</div>;
  }
  
  const imageUrls = property.images?.map(img => img.url).filter(Boolean) as string[] || [];

  return (
    <div className="bg-gray-50">
      <AppHeader settings={settings} />
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery imageUrls={imageUrls} />
            <PropertyInfo property={property} />
            <PropertyDescription description={property.longDescription} />
            <YouTubeEmbed videoUrl={property.videoUrl} />
            <PropertyDetailsTable details={{
              builtArea: property.builtArea,
              landArea: property.landArea,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              parkingSpaces: property.parkingSpaces,
            }} />
            <AmenitiesList amenities={property.amenities || []} />
            {property.location && property.location.lat && property.location.lng && (
              <PropertyMap location={property.location} />
            )}
          </div>

          {/* Barra Lateral */}
          <aside className="space-y-8 lg:sticky lg:top-28 self-start">
            {property.broker && <BrokerCard broker={property.broker} propertyId={property.id} />}
            
            <Tabs defaultValue="booking" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="booking">Agendar Visita</TabsTrigger>
                <TabsTrigger value="proposal">Enviar Proposta</TabsTrigger>
              </TabsList>
              <TabsContent value="booking">
                 <BookingForm propertyId={property.id} agentId={property.broker?.id} />
              </TabsContent>
              <TabsContent value="proposal">
                <ProposalForm propertyId={property.id} />
              </TabsContent>
            </Tabs>

          </aside>
        </div>
      </main>
      <AppFooter settings={settings} />
    </div>
  );
};

export default PropertyDisplayPage;
