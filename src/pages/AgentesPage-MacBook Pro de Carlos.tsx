import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Phone, 
  Mail, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Star,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Award,
  Calendar,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatPhone, formatDate, formatPercentage } from '@/utils/formatters';

interface Corretor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  status: 'ativo' | 'inativo' | 'ferias';
  vendas: number;
  metaVendas: number;
  comissao: number;
  clientes: number;
  leads: number;
  conversao: number;
  areaAtuacao: string[];
  dataContratacao: string;
  especialidade: string;
  avaliacao: number;
  vendasEsteMes: number;
  vendasUltimoMes: number;
}

const AgentesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [agentes] = useState<Corretor[]>([
    {
      id: '1',
      nome: 'Ana Silva',
      email: 'ana@imobiliaria.com',
      telefone: '(11) 99999-1234',
      cargo: 'Corretora Sênior',
      status: 'ativo',
      vendas: 12,
      metaVendas: 10,
      comissao: 85000,
      clientes: 45,
      leads: 23,
      conversao: 26.7,
      areaAtuacao: ['Copacabana', 'Ipanema', 'Leblon'],
      dataContratacao: '2022-03-15',
      especialidade: 'Apartamentos de Alto Padrão',
      avaliacao: 4.8,
      vendasEsteMes: 4,
      vendasUltimoMes: 3
    },
    {
      id: '2',
      nome: 'Carlos Santos',
      email: 'carlos@imobiliaria.com',
      telefone: '(21) 88888-5678',
      cargo: 'Corretor Pleno',
      status: 'ativo',
      vendas: 8,
      metaVendas: 8,
      comissao: 65000,
      clientes: 32,
      leads: 18,
      conversao: 25.0,
      areaAtuacao: ['Barra da Tijuca', 'Recreio'],
      dataContratacao: '2023-01-10',
      especialidade: 'Casas e Condomínios',
      avaliacao: 4.6,
      vendasEsteMes: 3,
      vendasUltimoMes: 2
    },
    {
      id: '3',
      nome: 'Maria Costa',
      email: 'maria@imobiliaria.com',
      telefone: '(21) 77777-9012',
      cargo: 'Corretora Especialista',
      status: 'ativo',
      vendas: 15,
      metaVendas: 12,
      comissao: 105000,
      clientes: 67,
      leads: 35,
      conversao: 22.4,
      areaAtuacao: ['Centro', 'Santa Teresa', 'Lapa'],
      dataContratacao: '2021-08-20',
      especialidade: 'Imóveis Comerciais',
      avaliacao: 4.9,
      vendasEsteMes: 5,
      vendasUltimoMes: 4
    },
    {
      id: '4',
      nome: 'João Oliveira',
      email: 'joao@imobiliaria.com',
      telefone: '(11) 66666-3456',
      cargo: 'Corretor Júnior',
      status: 'ativo',
      vendas: 5,
      metaVendas: 6,
      comissao: 35000,
      clientes: 20,
      leads: 15,
      conversao: 25.0,
      areaAtuacao: ['Tijuca', 'Vila Isabel'],
      dataContratacao: '2023-09-01',
      especialidade: 'Primeiros Imóveis',
      avaliacao: 4.3,
      vendasEsteMes: 2,
      vendasUltimoMes: 1
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-gray-100 text-gray-800';
      case 'ferias':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (vendas: number, meta: number) => {
    const performance = (vendas / meta) * 100;
    if (performance >= 100) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (atual: number, anterior: number) => {
    if (atual > anterior) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (atual < anterior) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <span className="h-4 w-4" />;
  };

  const filteredAgentes = agentes.filter(agente => {
    const matchesSearch = agente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agente.especialidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || agente.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalAgentes = agentes.length;
  const agentesAtivos = agentes.filter(a => a.status === 'ativo').length;
  const totalVendas = agentes.reduce((total, a) => total + a.vendas, 0);
  const totalComissao = agentes.reduce((total, a) => total + a.comissao, 0);

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Corretores</h1>
            <p className="text-muted-foreground">
              Gerencie a performance e desenvolvimento da equipe de vendas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Corretor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Corretores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAgentes}</div>
              <p className="text-xs text-muted-foreground">{agentesAtivos} ativos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVendas}</div>
              <p className="text-xs text-muted-foreground">este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Comissões Pagas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalComissao)}
              </div>
              <p className="text-xs text-muted-foreground">este ano</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversão Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(agentes.reduce((acc, a) => acc + a.conversao, 0) / agentes.length)}
              </div>
              <p className="text-xs text-muted-foreground">da equipe</p>
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
                  placeholder="Buscar corretores..."
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
                  <option value="inativo">Inativo</option>
                  <option value="ferias">Férias</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agents List */}
        <div className="space-y-4">
          {filteredAgentes.map((agente) => (
            <motion.div
              key={agente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{agente.nome}</h3>
                        <Badge className={getStatusColor(agente.status)}>
                          {agente.status}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span className="font-medium">{agente.avaliacao}</span>
                        </div>
                        {agente.vendas >= agente.metaVendas && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Award className="h-3 w-3 mr-1" />
                            Meta Atingida
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Mail className="mr-2 h-4 w-4" />
                            Contato
                          </div>
                          <p className="font-medium text-sm">{agente.email}</p>
                          <p className="font-medium text-sm">{formatPhone(agente.telefone)}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Target className="mr-2 h-4 w-4" />
                            Performance
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getPerformanceColor(agente.vendas, agente.metaVendas)}`}>
                              {agente.vendas}/{agente.metaVendas}
                            </span>
                            {getTrendIcon(agente.vendasEsteMes, agente.vendasUltimoMes)}
                          </div>
                          <Progress 
                            value={(agente.vendas / agente.metaVendas) * 100} 
                            className="h-2 mt-1"
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Comissão
                          </div>
                          <p className="font-medium text-green-600">
                            {formatCurrency(agente.comissao)}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Users className="mr-2 h-4 w-4" />
                            Clientes/Leads
                          </div>
                          <p className="font-medium">
                            {agente.clientes}/{agente.leads}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPercentage(agente.conversao)} conversão
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Building className="mr-2 h-4 w-4" />
                            Especialidade
                          </div>
                          <p className="font-medium">{agente.especialidade}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Calendar className="mr-2 h-4 w-4" />
                            Contratação
                          </div>
                          <p className="font-medium">{formatDate(agente.dataContratacao)}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Cargo: </span>
                          <span className="font-medium">{agente.cargo}</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-1">Áreas de Atuação:</p>
                        <div className="flex flex-wrap gap-1">
                          {agente.areaAtuacao.map((area, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredAgentes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum corretor encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Não há corretores que correspondam aos filtros selecionados.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Corretor
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AgentesPage;