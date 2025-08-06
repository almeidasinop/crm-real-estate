
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Correção da sintaxe aqui
import { 
  Home, 
  MapPin, 
  Eye, 
  Edit, 
  Plus,
  Search,
  Bed,
  Bath,
  Car,
  Ruler,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatArea } from '@/utils/formatters';
import PropertyDialog from '@/components/dialogs/PropertyDialog';
import { useProperties } from '@/hooks/use-properties';
import { useAgent } from '@/hooks/use-agents';
import { Property } from '@/types/crm';

// Componente para exibir o nome do corretor
const AgentName = ({ agentId }: { agentId: string }) => {
  const { data: agent, isLoading } = useAgent(agentId);
  if (isLoading || !agent) return null;
  return <p className="text-sm text-muted-foreground">Corretor: {agent.name}</p>;
};

const PropriedadesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  const { data: properties, isLoading, error, refetch } = useProperties();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
      case 'venda':
      case 'aluguel':
      case 'arrendamento':
        return 'bg-green-100 text-green-800';
      case 'vendido':
        return 'bg-blue-100 text-blue-800';
      case 'reservado':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProperties = (properties || []).filter(property => {
    if (!property) return false;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = property.title?.toLowerCase().includes(searchLower) ||
                         property.address?.neighborhood?.toLowerCase().includes(searchLower) ||
                         property.address?.city?.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesType = filterType === 'all' || property.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenNewPropertyDialog = () => {
    setEditingProperty(null);
    setIsPropertyDialogOpen(true);
  };

  const handleOpenEditPropertyDialog = (property: Property) => {
    setEditingProperty(property);
    setIsPropertyDialogOpen(true);
  };

  const handlePropertyDialogSuccess = () => {
    setIsPropertyDialogOpen(false);
    setEditingProperty(null);
    refetch();
  };

  const handleViewProperty = (id: string) => {
    navigate(`/imovel/${id}`);
  };

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Propriedades</h1>
            <p className="text-muted-foreground">Gerencie seu portfólio completo de imóveis</p>
          </div>
          <Button onClick={handleOpenNewPropertyDialog}><Plus className="mr-2 h-4 w-4" /> Nova Propriedade</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por título, bairro, cidade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
          </CardContent>
        </Card>

        {isLoading && <p>Carregando propriedades...</p>}
        {error && <p className="text-red-500">Erro ao carregar propriedades.</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge className={getStatusColor(property.status || 'inativo')}>{property.status}</Badge>
                      {property.isFeatured && <Badge variant="secondary"><Star className="w-3 h-3 mr-1" />Destaque</Badge>}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
                    <CardDescription className="text-primary text-xl font-bold">{formatCurrency(property.price || 0)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {property.address?.neighborhood}, {property.address?.city}
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center"><Ruler className="mr-1 h-4 w-4" />{formatArea(property.area || 0)}</div>
                        <div className="flex items-center"><Bed className="mr-1 h-4 w-4" />{property.bedrooms || 0}</div>
                        <div className="flex items-center"><Bath className="mr-1 h-4 w-4" />{property.bathrooms || 0}</div>
                        <div className="flex items-center"><Car className="mr-1 h-4 w-4" />{property.parkingSpaces || 0}</div>
                      </div>
                      {property.agentId && <AgentName agentId={property.agentId} />}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewProperty(property.id)}>
                          <Eye className="mr-2 h-4 w-4" />Ver
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenEditPropertyDialog(property)}>
                          <Edit className="mr-2 h-4 w-4" />Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredProperties.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Nenhuma propriedade encontrada</h3>
              <Button onClick={handleOpenNewPropertyDialog}><Plus className="mr-2 h-4 w-4" />Adicionar Propriedade</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <PropertyDialog
        open={isPropertyDialogOpen}
        onOpenChange={setIsPropertyDialogOpen}
        initialData={editingProperty}
        isEditing={!!editingProperty}
        onSuccess={handlePropertyDialogSuccess}
      />
    </PageLayout>
  );
};

export default PropriedadesPage;
