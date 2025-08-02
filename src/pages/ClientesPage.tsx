import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  User, 
  Star, 
  Search, 
  Plus, 
  Filter,
  Eye,
  Edit,
  Calendar,
  TrendingUp,
  DollarSign,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatPhone, formatDate } from '@/utils/formatters';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'lead' | 'cliente' | 'prospect';
  score: number;
  agente: string;
  fonte: string;
  ultimoContato: string;
  status: 'ativo' | 'inativo' | 'perdido' | 'convertido';
  valorPotencial: number;
  propriedadeInteresse: string;
  observacoes: string;
  dataCadastro: string;
}

const ClientesPage = () => {
  const [activeTab, setActiveTab] = useState<string>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [clientes] = useState<Cliente[]>([
    {
      id: '1',
      nome: 'Roberto Silva',
      email: 'roberto@email.com',
      telefone: '(11) 99999-1234',
      tipo: 'lead',
      score: 85,
      agente: 'Ana Silva',
      fonte: 'Site',
      ultimoContato: '2024-01-25',
      status: 'ativo',
      valorPotencial: 850000,
      propriedadeInteresse: 'Apartamento 3 quartos - Copacabana',
      observacoes: 'Cliente interessado em apartamento próximo ao metrô',
      dataCadastro: '2024-01-20'
    },
    {
      id: '2',
      nome: 'Patricia Lima',
      email: 'patricia@email.com',
      telefone: '(21) 88888-5678',
      tipo: 'cliente',
      score: 95,
      agente: 'Carlos Santos',
      fonte: 'Indicação',
      ultimoContato: '2024-01-24',
      status: 'convertido',
      valorPotencial: 1200000,
      propriedadeInteresse: 'Casa - Barra da Tijuca',
      observacoes: 'Cliente finalizou compra da casa na Barra',
      dataCadastro: '2024-01-10'
    },
    {
      id: '3',
      nome: 'Fernando Costa',
      email: 'fernando@email.com',
      telefone: '(21) 77777-9012',
      tipo: 'prospect',
      score: 70,
      agente: 'Maria Costa',
      fonte: 'Google Ads',
      ultimoContato: '2024-01-23',
      status: 'ativo',
      valorPotencial: 2100000,
      propriedadeInteresse: 'Cobertura - Ipanema',
      observacoes: 'Buscando imóvel de alto padrão com vista para o mar',
      dataCadastro: '2024-01-15'
    },
    {
      id: '4',
      nome: 'Julia Santos',
      email: 'julia@email.com',
      telefone: '(11) 66666-3456',
      tipo: 'lead',
      score: 40,
      agente: 'João Oliveira',
      fonte: 'Facebook',
      ultimoContato: '2024-01-15',
      status: 'perdido',
      valorPotencial: 450000,
      propriedadeInteresse: 'Apartamento 2 quartos - Leblon',
      observacoes: 'Perdeu interesse devido ao preço',
      dataCadastro: '2024-01-05'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'convertido':
        return 'bg-blue-100 text-blue-800';
      case 'inativo':
        return 'bg-gray-100 text-gray-800';
      case 'perdido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'lead':
        return 'bg-yellow-100 text-yellow-800';
      case 'prospect':
        return 'bg-blue-100 text-blue-800';
      case 'cliente':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.propriedadeInteresse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cliente.status === filterStatus;
    const matchesTab = activeTab === 'all' || cliente.tipo === activeTab.slice(0, -1); // Remove 's' do final
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const totalClientes = clientes.length;
  const leadsAtivos = clientes.filter(c => c.tipo === 'lead' && c.status === 'ativo').length;
  const clientesConvertidos = clientes.filter(c => c.status === 'convertido').length;
  const valorPotencialTotal = clientes.filter(c => c.status === 'ativo').reduce((total, c) => total + c.valorPotencial, 0);

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Leads e Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie relacionamentos e converta leads em vendas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClientes}</div>
              <p className="text-xs text-muted-foreground">na base</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Leads Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadsAtivos}</div>
              <p className="text-xs text-muted-foreground">em prospecção</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesConvertidos}</div>
              <p className="text-xs text-muted-foreground">este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(valorPotencialTotal)}
              </div>
              <p className="text-xs text-muted-foreground">em negociação</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different client types */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
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
                  <option value="ativo">Ativo</option>
                  <option value="convertido">Convertido</option>
                  <option value="inativo">Inativo</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <div className="space-y-4">
          {filteredClientes.map((cliente) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{cliente.nome}</h3>
                        <Badge className={getStatusColor(cliente.status)}>
                          {cliente.status}
                        </Badge>
                        <Badge className={getTipoColor(cliente.tipo)}>
                          {cliente.tipo}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span className={`font-medium ${getScoreColor(cliente.score)}`}>
                            {cliente.score}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </div>
                          <p className="font-medium">{cliente.email}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Phone className="mr-2 h-4 w-4" />
                            Telefone
                          </div>
                          <p className="font-medium">{formatPhone(cliente.telefone)}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Valor Potencial
                          </div>
                          <p className="font-medium text-green-600">
                            {formatCurrency(cliente.valorPotencial)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Building className="mr-2 h-4 w-4" />
                          Interesse
                        </div>
                        <p className="font-medium">{cliente.propriedadeInteresse}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Corretor: </span>
          <span className="font-medium">{cliente.agente}</span>
        </div>
                        <div>
                          <span className="text-muted-foreground">Fonte: </span>
                          <span className="font-medium">{cliente.fonte}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Último contato: </span>
                          <span className="font-medium">{formatDate(cliente.ultimoContato)}</span>
                        </div>
                      </div>
                      
                      {cliente.observacoes && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm">{cliente.observacoes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredClientes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Não há clientes que correspondam aos filtros selecionados.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Cliente
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ClientesPage;