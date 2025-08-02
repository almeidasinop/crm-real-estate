import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Plus,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Contrato {
  id: string;
  numero: string;
  cliente: string;
  corretor: string;
  propriedade: string;
  tipo: 'compra' | 'venda' | 'locacao' | 'administracao';
  status: 'rascunho' | 'enviado' | 'assinado' | 'cancelado' | 'expirado';
  valor: number;
  dataAssinatura: string;
  dataVencimento: string;
  documentos: string[];
  progresso: number;
}

const ContratosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  
  const [contratos] = useState<Contrato[]>([
    {
      id: '1',
      numero: 'CTR-2024-001',
      cliente: 'Roberto Silva',
      corretor: 'Ana Silva',
      propriedade: 'Apartamento 3 quartos - Copacabana',
      tipo: 'compra',
      status: 'assinado',
      valor: 850000,
      dataAssinatura: '2024-01-20',
      dataVencimento: '2024-02-20',
      documentos: ['RG', 'CPF', 'Comprovante de Renda', 'FGTS'],
      progresso: 100
    },
    {
      id: '2',
      numero: 'CTR-2024-002',
      cliente: 'Patricia Lima',
      corretor: 'Carlos Santos',
      propriedade: 'Casa 4 quartos - Barra da Tijuca',
      tipo: 'venda',
      status: 'enviado',
      valor: 1200000,
      dataAssinatura: '',
      dataVencimento: '2024-02-01',
      documentos: ['Escritura', 'IPTU', 'Matrícula'],
      progresso: 75
    },
    {
      id: '3',
      numero: 'CTR-2024-003',
      cliente: 'Fernando Costa',
      corretor: 'Maria Costa',
      propriedade: 'Cobertura - Ipanema',
      tipo: 'compra',
      status: 'rascunho',
      valor: 2100000,
      dataAssinatura: '',
      dataVencimento: '2024-01-30',
      documentos: ['RG', 'CPF'],
      progresso: 40
    },
    {
      id: '4',
      numero: 'CTR-2024-004',
      cliente: 'Julia Santos',
      corretor: 'João Oliveira',
      propriedade: 'Apartamento 2 quartos - Leblon',
      tipo: 'locacao',
      status: 'cancelado',
      valor: 4500,
      dataAssinatura: '',
      dataVencimento: '2024-01-25',
      documentos: [],
      progresso: 20
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rascunho':
        return 'bg-gray-100 text-gray-800';
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'assinado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'expirado':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assinado':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelado':
      case 'expirado':
        return <XCircle className="h-4 w-4" />;
      case 'enviado':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'compra':
        return 'bg-blue-100 text-blue-800';
      case 'venda':
        return 'bg-green-100 text-green-800';
      case 'locacao':
        return 'bg-purple-100 text-purple-800';
      case 'administracao':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredContratos = contratos.filter(contrato => {
    const matchesSearch = contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contrato.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contrato.propriedade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contrato.status === filterStatus;
    const matchesType = filterType === 'all' || contrato.tipo === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalContratos = contratos.length;
  const contratosAssinados = contratos.filter(c => c.status === 'assinado').length;
  const contratosPendentes = contratos.filter(c => c.status === 'enviado').length;
  const valorTotal = contratos.filter(c => c.status === 'assinado').reduce((total, c) => total + c.valor, 0);

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Contratos</h1>
            <p className="text-muted-foreground">
              Gerencie contratos, documentos e assinaturas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Contrato
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Contratos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContratos}</div>
              <p className="text-xs text-muted-foreground">+2 este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assinados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contratosAssinados}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((contratosAssinados / totalContratos) * 100)}% do total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contratosPendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando assinatura</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Fechado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(valorTotal)}
              </div>
              <p className="text-xs text-muted-foreground">Contratos assinados</p>
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
                  placeholder="Buscar contratos..."
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
                  <option value="rascunho">Rascunho</option>
                  <option value="enviado">Enviado</option>
                  <option value="assinado">Assinado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="expirado">Expirado</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="compra">Compra</option>
                  <option value="venda">Venda</option>
                  <option value="locacao">Locação</option>
                  <option value="administracao">Administração</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <div className="space-y-4">
          {filteredContratos.map((contrato) => (
            <motion.div
              key={contrato.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{contrato.numero}</h3>
                        <Badge className={getStatusColor(contrato.status)}>
                          {getStatusIcon(contrato.status)}
                          {contrato.status}
                        </Badge>
                        <Badge className={getTipoColor(contrato.tipo)}>
                          {contrato.tipo}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <User className="mr-2 h-4 w-4" />
                            Cliente
                          </div>
                          <p className="font-medium">{contrato.cliente}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Building className="mr-2 h-4 w-4" />
                            Propriedade
                          </div>
                          <p className="font-medium">{contrato.propriedade}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Valor
                          </div>
                          <p className="font-medium text-green-600">
                            {formatCurrency(contrato.valor)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>Progresso do Contrato</span>
                          <span>{contrato.progresso}%</span>
                        </div>
                        <Progress value={contrato.progresso} className="h-2" />
                      </div>
                      
                      {/* Documents */}
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Documentos ({contrato.documentos.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {contrato.documentos.map((doc, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {contrato.dataAssinatura && (
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            Assinado em: {new Date(contrato.dataAssinatura).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          Vencimento: {new Date(contrato.dataVencimento).toLocaleDateString('pt-BR')}
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
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredContratos.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum contrato encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Não há contratos que correspondam aos filtros selecionados.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Contrato
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ContratosPage;