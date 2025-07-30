
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { Download, Plus, Upload, Filter, RefreshCw, CalendarRange, Eye, Printer, Phone, Mail, MessageSquare, User, Star, Search } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { CRMProvider } from '../contexts/CRMContext';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PreviewPrintButton from '@/components/common/PreviewPrintButton';
import { useCRM } from '@/contexts/CRMContext';

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
  status: 'ativo' | 'inativo' | 'perdido';
  valorPotencial: number;
  propriedadeInteresse: string;
}

const CropsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const { getModuleData } = useCRM();
  
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
      ultimoContato: 'há 2 dias',
      status: 'ativo',
      valorPotencial: 850000,
      propriedadeInteresse: 'Apartamento 3 quartos'
    },
    {
      id: '2',
      nome: 'Patricia Lima',
      email: 'patricia@email.com',
      telefone: '(21) 88888-5678',
      tipo: 'cliente',
      score: 92,
      agente: 'Carlos Santos',
      fonte: 'Indicação',
      ultimoContato: 'há 1 dia',
      status: 'ativo',
      valorPotencial: 1200000,
      propriedadeInteresse: 'Casa 4 quartos'
    },
    {
      id: '3',
      nome: 'Fernando Costa',
      email: 'fernando@email.com',
      telefone: '(11) 77777-9101',
      tipo: 'prospect',
      score: 95,
      agente: 'Maria Costa',
      fonte: 'Google Ads',
      ultimoContato: 'hoje',
      status: 'ativo',
      valorPotencial: 2100000,
      propriedadeInteresse: 'Cobertura'
    }
  ]);
  
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'lead':
        return 'bg-blue-100 text-blue-800';
      case 'cliente':
        return 'bg-green-100 text-green-800';
      case 'prospect':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.propriedadeInteresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLeadsList = () => (
    <div className="space-y-4">
      {filteredClientes.map((cliente) => (
        <Card key={cliente.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold">{cliente.nome}</h3>
                  <Badge className={getTipoColor(cliente.tipo)}>
                    {cliente.tipo}
                  </Badge>
                  <Badge className={`${getScoreColor(cliente.score)} px-2 py-1`}>
                    Score: {cliente.score}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contato</p>
                    <p className="font-medium">{cliente.email}</p>
                    <p className="text-sm">{cliente.telefone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Interesse</p>
                    <p className="font-medium">{cliente.propriedadeInteresse}</p>
                    <p className="text-sm text-green-600">{formatCurrency(cliente.valorPotencial)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Agente</p>
                    <p className="font-medium">{cliente.agente}</p>
                    <p className="text-sm">Último contato: {cliente.ultimoContato}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Fonte: {cliente.fonte}</span>
                  <span>•</span>
                  <span>Status: {cliente.status}</span>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="ghost">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderClientesList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredClientes.filter(c => c.tipo === 'cliente').map((cliente) => (
        <Card key={cliente.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{cliente.nome}</CardTitle>
              <Badge className={getScoreColor(cliente.score)}>
                <Star className="h-3 w-3 mr-1" />
                {cliente.score}
              </Badge>
            </div>
            <CardDescription>{cliente.propriedadeInteresse}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-sm"><strong>Agente:</strong> {cliente.agente}</p>
              <p className="text-sm"><strong>Valor:</strong> {formatCurrency(cliente.valorPotencial)}</p>
              <p className="text-sm"><strong>Último contato:</strong> {cliente.ultimoContato}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Phone className="h-4 w-4 mr-1" />
                Ligar
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabs: TabItem[] = [
    {
      value: 'leads',
      label: 'Leads',
      content: renderLeadsList()
    },
    {
      value: 'clientes',
      label: 'Clientes',
      content: renderClientesList()
    },
    {
      value: 'prospects',
      label: 'Prospects',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClientes.filter(c => c.tipo === 'prospect').map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">{cliente.nome}</h3>
                  <Badge className={getScoreColor(cliente.score)}>
                    {cliente.score}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{cliente.propriedadeInteresse}</p>
                <p className="text-sm font-medium text-green-600 mb-3">
                  {formatCurrency(cliente.valorPotencial)}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Contatar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Clientes e Leads</h1>
            <p className="text-muted-foreground">
              Gerencie leads, clientes e prospects do seu CRM imobiliário
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
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
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.filter(c => c.tipo === 'lead').length}</div>
              <p className="text-xs text-muted-foreground">+3 esta semana</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientes.filter(c => c.tipo === 'cliente').length}</div>
              <p className="text-xs text-muted-foreground">+1 este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(clientes.reduce((acc, c) => acc + c.score, 0) / clientes.length)}
              </div>
              <p className="text-xs text-muted-foreground">+5 pontos este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(clientes.reduce((acc, c) => acc + c.valorPotencial, 0))}
              </div>
              <p className="text-xs text-muted-foreground">+15% este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes por nome, email ou interesse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <TabContainer 
          tabs={tabs}
          defaultValue={activeTab}
          onValueChange={handleTabChange}
        />
      </div>
    </PageLayout>
  );
};

export default CropsPage;
