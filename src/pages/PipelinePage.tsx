import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Filter,
  ArrowRight,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  propriedade: string;
  valor: number;
  estagio: 'lead' | 'contato' | 'visita' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  corretor: string;
  score: number;
  ultimoContato: string;
  proximaAcao: string;
  fonte: string;
}

const PipelinePage = () => {
  const [leads] = useState<Lead[]>([
    {
      id: '1',
      nome: 'Roberto Silva',
      email: 'roberto@email.com',
      telefone: '(11) 99999-1234',
      propriedade: 'Apartamento 3 quartos - Copacabana',
      valor: 850000,
      estagio: 'visita',
      corretor: 'Ana Silva',
      score: 85,
      ultimoContato: 'há 2 dias',
      proximaAcao: 'Agendar segunda visita',
      fonte: 'Site'
    },
    {
      id: '2',
      nome: 'Patricia Lima',
      email: 'patricia@email.com',
      telefone: '(21) 88888-5678',
      propriedade: 'Casa 4 quartos - Barra da Tijuca',
      valor: 1200000,
      estagio: 'proposta',
      corretor: 'Carlos Santos',
      score: 92,
      ultimoContato: 'há 1 dia',
      proximaAcao: 'Aguardar resposta da proposta',
      fonte: 'Indicação'
    },
    {
      id: '3',
      nome: 'Fernando Costa',
      email: 'fernando@email.com',
      telefone: '(11) 77777-9101',
      propriedade: 'Cobertura - Ipanema',
      valor: 2100000,
      estagio: 'negociacao',
      corretor: 'Maria Costa',
      score: 95,
      ultimoContato: 'hoje',
      proximaAcao: 'Negociar preço final',
      fonte: 'Google Ads'
    },
    {
      id: '4',
      nome: 'Julia Santos',
      email: 'julia@email.com',
      telefone: '(21) 66666-1122',
      propriedade: 'Apartamento 2 quartos - Leblon',
      valor: 750000,
      estagio: 'lead',
      corretor: 'João Oliveira',
      score: 65,
      ultimoContato: 'há 3 dias',
      proximaAcao: 'Primeiro contato',
      fonte: 'Facebook'
    }
  ]);

  const estagios = [
    { id: 'lead', nome: 'Leads', cor: 'bg-gray-100 text-gray-800' },
    { id: 'contato', nome: 'Contato Inicial', cor: 'bg-blue-100 text-blue-800' },
    { id: 'visita', nome: 'Visita Agendada', cor: 'bg-yellow-100 text-yellow-800' },
    { id: 'proposta', nome: 'Proposta Enviada', cor: 'bg-orange-100 text-orange-800' },
    { id: 'negociacao', nome: 'Negociação', cor: 'bg-purple-100 text-purple-800' },
    { id: 'fechado', nome: 'Fechado', cor: 'bg-green-100 text-green-800' },
    { id: 'perdido', nome: 'Perdido', cor: 'bg-red-100 text-red-800' }
  ];

  const getLeadsByStage = (estagio: string) => {
    return leads.filter(lead => lead.estagio === estagio);
  };

  const getTotalValue = (estagio: string) => {
    return getLeadsByStage(estagio).reduce((total, lead) => total + lead.valor, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Funil de Vendas</h1>
            <p className="text-muted-foreground">
              Acompanhe todos os seus leads através do funil de vendas
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

        {/* Pipeline Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground">+3 esta semana</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(leads.reduce((total, lead) => total + lead.valor, 0))}
              </div>
              <p className="text-xs text-muted-foreground">+15% este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5%</div>
              <p className="text-xs text-muted-foreground">+2.1% vs mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28 dias</div>
              <p className="text-xs text-muted-foreground">-3 dias vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {estagios.map((estagio) => {
            const leadsDoEstagio = getLeadsByStage(estagio.id);
            const valorTotal = getTotalValue(estagio.id);
            
            return (
              <motion.div
                key={estagio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="text-center">
                  <h3 className="font-semibold text-sm mb-1">{estagio.nome}</h3>
                  <Badge className={estagio.cor}>{leadsDoEstagio.length}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(valorTotal)}
                  </p>
                </div>
                
                <div className="space-y-2 min-h-[400px]">
                  {leadsDoEstagio.map((lead) => (
                    <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{lead.nome}</h4>
                          <Badge className={`text-xs ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {lead.propriedade}
                        </p>
                        
                        <p className="text-sm font-bold text-green-600 mb-2">
                          {formatCurrency(lead.valor)}
                        </p>
                        
                        <div className="text-xs text-muted-foreground mb-3">
                          <p>Corretor: {lead.corretor}</p>
                          <p>Último contato: {lead.ultimoContato}</p>
                          <p className="text-blue-600">📋 {lead.proximaAcao}</p>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {leadsDoEstagio.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm p-4 border-2 border-dashed border-gray-200 rounded-lg">
                      Nenhum lead neste estágio
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default PipelinePage;