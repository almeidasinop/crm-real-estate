import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus,
  Filter,
  Phone,
  Mail,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Visita {
  id: string;
  cliente: string;
  corretor: string;
  propriedade: string;
  endereco: string;
  data: string;
  hora: string;
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'reagendada';
  telefone: string;
  email: string;
  observacoes: string;
  valor: number;
}

const VisitasPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  
  const [visitas] = useState<Visita[]>([
    {
      id: '1',
      cliente: 'Roberto Silva',
      corretor: 'Ana Silva',
      propriedade: 'Apartamento 3 quartos - Copacabana',
      endereco: 'Av. Copacabana, 1500 - Copacabana, RJ',
      data: '2024-01-25',
      hora: '14:00',
      status: 'confirmada',
      telefone: '(11) 99999-1234',
      email: 'roberto@email.com',
      observacoes: 'Cliente interessado, primeira visita',
      valor: 850000
    },
    {
      id: '2',
      cliente: 'Patricia Lima',
      corretor: 'Carlos Santos',
      propriedade: 'Casa 4 quartos - Barra da Tijuca',
      endereco: 'Rua das Palmeiras, 250 - Barra da Tijuca, RJ',
      data: '2024-01-25',
      hora: '16:30',
      status: 'agendada',
      telefone: '(21) 88888-5678',
      email: 'patricia@email.com',
      observacoes: 'Segunda visita, cliente muito interessado',
      valor: 1200000
    },
    {
      id: '3',
      cliente: 'Fernando Costa',
      corretor: 'Maria Costa',
      propriedade: 'Cobertura - Ipanema',
      endereco: 'Rua Vieira Souto, 100 - Ipanema, RJ',
      data: '2024-01-26',
      hora: '10:00',
      status: 'realizada',
      telefone: '(11) 77777-9101',
      email: 'fernando@email.com',
      observacoes: 'Visita realizada com sucesso, cliente fez proposta',
      valor: 2100000
    },
    {
      id: '4',
      cliente: 'Julia Santos',
      corretor: 'João Oliveira',
      propriedade: 'Apartamento 2 quartos - Leblon',
      endereco: 'Rua General Urquiza, 80 - Leblon, RJ',
      data: '2024-01-26',
      hora: '15:00',
      status: 'cancelada',
      telefone: '(21) 66666-1122',
      email: 'julia@email.com',
      observacoes: 'Cliente cancelou por motivos pessoais',
      valor: 750000
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'bg-blue-100 text-blue-800';
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'realizada':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'reagendada':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmada':
      case 'realizada':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelada':
        return <XCircle className="h-4 w-4" />;
      case 'reagendada':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const visitasHoje = visitas.filter(v => v.data === '2024-01-25');
  const visitasAmanha = visitas.filter(v => v.data === '2024-01-26');

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Visitas</h1>
            <p className="text-muted-foreground">
              Gerencie visitas às propriedades e acompanhe o status
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {viewMode === 'list' ? 'Calendário' : 'Lista'}
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Visita
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Visitas Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitasHoje.length}</div>
              <p className="text-xs text-muted-foreground">2 confirmadas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitas.length}</div>
              <p className="text-xs text-muted-foreground">+3 vs semana anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Comparecimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Valor em Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(visitas.reduce((total, v) => total + v.valor, 0))}
              </div>
              <p className="text-xs text-muted-foreground">+12% esta semana</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          )}

          {/* Visits List */}
          <div className={viewMode === 'calendar' ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="space-y-6">
              {/* Today's Visits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Visitas de Hoje ({visitasHoje.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visitasHoje.map((visita) => (
                    <motion.div
                      key={visita.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{visita.cliente}</h3>
                            <Badge className={getStatusColor(visita.status)}>
                              {getStatusIcon(visita.status)}
                              {visita.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {visita.hora}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              {visita.endereco}
                            </div>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Corretor: {visita.corretor}
                            </div>
                          </div>
                          
                          <p className="text-sm font-medium text-green-600 mt-2">
                            {formatCurrency(visita.valor)}
                          </p>
                          
                          {visita.observacoes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              {visita.observacoes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1 ml-4">
                          <Button size="sm" variant="ghost">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {visitasHoje.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <CalendarIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhuma visita agendada para hoje</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tomorrow's Visits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Visitas de Amanhã ({visitasAmanha.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visitasAmanha.map((visita) => (
                    <motion.div
                      key={visita.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{visita.cliente}</h3>
                            <Badge className={getStatusColor(visita.status)}>
                              {getStatusIcon(visita.status)}
                              {visita.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {visita.hora}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              {visita.endereco}
                            </div>
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Corretor: {visita.corretor}
                            </div>
                          </div>
                          
                          <p className="text-sm font-medium text-green-600 mt-2">
                            {formatCurrency(visita.valor)}
                          </p>
                          
                          {visita.observacoes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              {visita.observacoes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1 ml-4">
                          <Button size="sm" variant="ghost">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {visitasAmanha.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <CalendarIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhuma visita agendada para amanhã</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VisitasPage;