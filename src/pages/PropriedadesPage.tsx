import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  
  const [propriedades] = useState<Propriedade[]>([
    {
      id: '1',
      titulo: 'Apartamento 3 quartos com vista para o mar',
      tipo: 'apartamento',
      status: 'disponivel',
      preco: 850000,
      area: 120,
      quartos: 3,
      banheiros: 2,
      vagas: 2,
      endereco: 'Av. Atlântica, 1500',
      bairro: 'Copacabana',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      agente: 'Ana Silva',
      dataInsercao: '2024-01-15',
      destaque: true,
      descricao: 'Apartamento moderno com vista deslumbrante para o mar de Copacabana.'
    },
    {
      id: '2',
      titulo: 'Casa 4 quartos em condomínio fechado',
      tipo: 'casa',
      status: 'disponivel',
      preco: 1200000,
      area: 250,
      quartos: 4,
      banheiros: 3,
      vagas: 3,
      endereco: 'Rua das Palmeiras, 45',
      bairro: 'Barra da Tijuca',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      agente: 'Carlos Santos',
      dataInsercao: '2024-01-20',
      destaque: false,
      descricao: 'Casa espaçosa em condomínio fechado com área de lazer completa.'
    },
    {
      id: '3',
      titulo: 'Cobertura duplex de luxo',
      tipo: 'cobertura',
      status: 'vendido',
      preco: 2100000,
      area: 300,
      quartos: 5,
      banheiros: 4,
      vagas: 4,
      endereco: 'Rua Visconde de Pirajá, 100',
      bairro: 'Ipanema',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      agente: 'Maria Costa',
      dataInsercao: '2023-12-10',
      destaque: true,
      descricao: 'Cobertura duplex com terraço e piscina privativa em Ipanema.'
    },
    {
      id: '4',
      titulo: 'Sala comercial moderna',
      tipo: 'comercial',
      status: 'alugado',
      preco: 8500,
      area: 80,
      quartos: 0,
      banheiros: 2,
      vagas: 2,
      endereco: 'Av. Rio Branco, 200',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      agente: 'João Oliveira',
      dataInsercao: '2024-01-05',
      destaque: false,
      descricao: 'Sala comercial moderna no centro financeiro da cidade.'
    }
  ]);

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
            <Button>
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

        {/* Properties Grid */}
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
                      <p>Corretor: {propriedade.agente}</p>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
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

        {filteredPropriedades.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma propriedade encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Não há propriedades que correspondam aos filtros selecionados.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Propriedade
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default PropriedadesPage;