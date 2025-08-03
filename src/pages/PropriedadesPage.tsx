import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  Building2, 
  MapPin, 
  Eye, 
  Edit, 
  Plus,
  Filter,
  Search,
  Bed,
  Bath,
  Car,
  Ruler,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatArea } from '@/utils/formatters';
import PropertyDialog from '@/components/dialogs/PropertyDialog';
import { useProperties } from '@/hooks/use-properties';
import { useAgent } from '@/hooks/use-agents';
import { toast } from 'sonner';
import { Property } from '@/types/crm';

// Componente para exibir o nome do corretor a partir do ID
const AgentName = ({ agentId }: { agentId: string }) => {
  const { data: agent, isLoading } = useAgent(agentId);
  
  if (isLoading) return <p>Corretor: Carregando...</p>;
  if (!agent) return <p>Corretor: Não atribuído</p>;
  
  return <p>Corretor: {agent.name}</p>;
};

// Interface para o formato local de propriedade usado na UI
interface Propriedade {
  id: string;
  titulo: string;
  tipo: 'apartamento' | 'casa' | 'comercial' | 'terreno' | 'cobertura';
  status: 'disponivel' | 'vendido' | 'alugado' | 'reservado';
  preco: number;
  area: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  agente: string;
  dataInsercao: string;
  destaque: boolean;
  descricao: string;
}

const PropriedadesPage = () => {
  const navigate = useNavigate(); // 2. Inicializar o hook
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Propriedade | null>(null);
  
  // Usar o hook do Firebase para buscar propriedades
  const { data: properties, isLoading, error, refetch } = useProperties();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'bg-green-100 text-green-800';
      case 'vendido':
        return 'bg-blue-100 text-blue-800';
      case 'alugado':
        return 'bg-purple-100 text-purple-800';
      case 'reservado':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'apartamento':
        return 'bg-blue-100 text-blue-800';
      case 'casa':
        return 'bg-green-100 text-green-800';
      case 'comercial':
        return 'bg-purple-100 text-purple-800';
      case 'terreno':
        return 'bg-yellow-100 text-yellow-800';
      case 'cobertura':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Converter dados do Firebase para o formato esperado
  const propriedades = properties?.filter(property => property && property.id).map(property => ({
    id: property.id,
    titulo: property.title || 'Sem título',
    tipo: property.type || 'apartamento',
    status: property.status || 'disponivel',
    preco: property.price || 0,
    area: property.area || 0,
    quartos: property.bedrooms || 0,
    banheiros: property.bathrooms || 0,
    vagas: property.parkingSpaces || 0,
    endereco: property.address ? `${property.address.street || ''}, ${property.address.number || ''}` : 'Endereço não informado',
    bairro: property.address?.neighborhood || 'Bairro não informado',
    cidade: property.address?.city || 'Cidade não informada',
    estado: property.address?.state || 'Estado não informado',
    agente: property.agentId || 'Não atribuído',
    dataInsercao: property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A',
    destaque: property.tags?.includes('destaque') || false,
    descricao: property.description || 'Sem descrição'
  })) || [];

  const filteredPropriedades = propriedades.filter(propriedade => {
    const matchesSearch = propriedade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propriedade.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propriedade.endereco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || propriedade.status === filterStatus;
    const matchesType = filterType === 'all' || propriedade.tipo === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPropriedades = propriedades.length;
  const propriedadesDisponiveis = propriedades.filter(p => p.status === 'disponivel').length;
  const propriedadesVendidas = propriedades.filter(p => p.status === 'vendido').length;
  const valorTotal = propriedades.filter(p => p.status === 'vendido').reduce((total, p) => total + p.preco, 0);

  // Funções para controlar o popup
  const handleOpenNewPropertyDialog = () => {
    setEditingProperty(null);
    setIsPropertyDialogOpen(true);
  };

  const handleOpenEditPropertyDialog = (property: Propriedade) => {
    setEditingProperty(property);
    setIsPropertyDialogOpen(true);
  };

  const handlePropertyDialogSuccess = () => {
    setIsPropertyDialogOpen(false);
    setEditingProperty(null);
    refetch(); // Recarregar dados do Firebase
    toast.success('Propriedade salva com sucesso!');
  };

  // 3. Criar a função de navegação
  const handleViewProperty = (id: string) => {
    navigate(`/propriedades/${id}`);
  };

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Propriedades</h1>
            <p className="text-muted-foreground">
              Gerencie seu portfólio completo de imóveis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros Avançados
            </Button>
            <Button onClick={handleOpenNewPropertyDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Propriedade
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPropriedades}</div>
              <p className="text-xs text-muted-foreground">no portfólio</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{propriedadesDisponiveis}</div>
              <p className="text-xs text-muted-foreground">para venda/locação</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vendidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{propriedadesVendidas}</div>
              <p className="text-xs text-muted-foreground">este ano</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Total Vendido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(valorTotal)}
              </div>
              <p className="text-xs text-muted-foreground">em vendas</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar propriedades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Todos os Status</option>
                  <option value="disponivel">Disponível</option>
                  <option value="vendido">Vendido</option>
                  <option value="alugado">Alugado</option>
                  <option value="reservado">Reservado</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="comercial">Comercial</option>
                  <option value="terreno">Terreno</option>
                  <option value="cobertura">Cobertura</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando propriedades...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Home className="mx-auto h-12 w-12 mb-2" />
                <h3 className="text-lg font-semibold">Erro ao carregar propriedades</h3>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
              <Button onClick={() => refetch()}>
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPropriedades.map((propriedade) => (
              <motion.div
                key={propriedade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(propriedade.status)}>
                          {propriedade.status}
                        </Badge>
                        <Badge className={getTipoColor(propriedade.tipo)}>
                          {propriedade.tipo}
                        </Badge>
                        {propriedade.destaque && (
                          <Badge variant="secondary">
                            <Star className="w-3 h-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {propriedade.titulo}
                    </CardTitle>
                    <CardDescription className="text-primary text-xl font-bold">
                      {formatCurrency(propriedade.preco)}
                      {propriedade.status === 'alugado' && '/mês'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {propriedade.bairro}, {propriedade.cidade} - {propriedade.estado}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center">
                          <Ruler className="mr-1 h-4 w-4 text-muted-foreground" />
                          {formatArea(propriedade.area)}
                        </div>
                        {propriedade.quartos > 0 && (
                          <div className="flex items-center">
                            <Bed className="mr-1 h-4 w-4 text-muted-foreground" />
                            {propriedade.quartos}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Bath className="mr-1 h-4 w-4 text-muted-foreground" />
                          {propriedade.banheiros}
                        </div>
                        <div className="flex items-center">
                          <Car className="mr-1 h-4 w-4 text-muted-foreground" />
                          {propriedade.vagas}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <AgentName agentId={propriedade.agente} />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewProperty(propriedade.id)} // 4. Adicionar o onClick
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleOpenEditPropertyDialog(propriedade)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredPropriedades.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma propriedade encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {propriedades.length === 0 
                  ? 'Você ainda não tem propriedades cadastradas.'
                  : 'Não há propriedades que correspondam aos filtros selecionados.'
                }
              </p>
              <Button onClick={handleOpenNewPropertyDialog}>
                <Plus className="mr-2 h-4 w-4" />
                {propriedades.length === 0 ? 'Adicionar Primeira Propriedade' : 'Adicionar Nova Propriedade'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog para Nova/Editar Propriedade */}
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