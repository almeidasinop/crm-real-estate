// Tipos base
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Propriedades/Imóveis
export interface Property extends BaseEntity {
  title: string;
  description: string;
  type: 'apartamento' | 'casa' | 'comercial' | 'terreno' | 'cobertura' | 'studio';
  status: 'disponivel' | 'vendido' | 'alugado' | 'reservado' | 'inativo';
  price: number;
  rentPrice?: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: string[];
  images: string[];
  documents: string[];
  agentId: string;
  owner: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  highlights: string[];
  energyRating?: string;
  condominiumFee?: number;
  iptu?: number;
  tags: string[];
}

// Clientes
export interface Client extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'pessoa_fisica' | 'pessoa_juridica';
  status: 'ativo' | 'inativo' | 'prospecto';
  source: 'site' | 'facebook' | 'google_ads' | 'indicacao' | 'whatsapp' | 'outro';
  budget: {
    min: number;
    max: number;
  };
  preferences: {
    propertyTypes: string[];
    neighborhoods: string[];
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
  };
  notes: string;
  assignedAgentId: string;
  tags: string[];
}

// Corretores/Agentes
export interface Agent extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  document: string;
  status: 'ativo' | 'inativo';
  role: 'corretor' | 'gerente' | 'admin';
  commission: number; // Percentual de comissão
  specialties: string[];
  bio: string;
  avatar?: string;
  license: string;
  experience: number; // Anos de experiência
  performance: {
    totalSales: number;
    totalRevenue: number;
    averageRating: number;
    completedDeals: number;
  };
}

// Leads
export interface Lead extends BaseEntity {
  clientId: string;
  propertyId?: string;
  status: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'fechado' | 'perdido';
  priority: 'baixa' | 'media' | 'alta';
  source: string;
  assignedAgentId: string;
  notes: string;
  nextFollowUp?: Date;
  score: number; // Score de qualificação (0-100)
  tags: string[];
}

// Visitas
export interface Visit extends BaseEntity {
  clientId: string;
  propertyId: string;
  agentId: string;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'remarcada';
  duration: number; // Em minutos
  notes: string;
  feedback?: {
    rating: number;
    comments: string;
    interested: boolean;
    nextSteps: string;
  };
  reminderSent: boolean;
}

// Contratos
export interface Contract extends BaseEntity {
  type: 'venda' | 'aluguel' | 'administracao';
  status: 'rascunho' | 'assinado' | 'ativo' | 'finalizado' | 'cancelado';
  clientId: string;
  propertyId: string;
  agentId: string;
  value: number;
  commission: number;
  startDate: Date;
  endDate?: Date;
  terms: string;
  documents: string[];
  signatures: {
    client: boolean;
    agent: boolean;
    owner: boolean;
  };
  paymentSchedule?: {
    dueDate: Date;
    amount: number;
    status: 'pendente' | 'pago' | 'atrasado';
  }[];
}

// Pipeline de Vendas
export interface Pipeline extends BaseEntity {
  name: string;
  stages: PipelineStage[];
  deals: Deal[];
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number; // Percentual de probabilidade de fechamento
  color: string;
}

export interface Deal extends BaseEntity {
  title: string;
  clientId: string;
  propertyId?: string;
  agentId: string;
  pipelineId: string;
  stageId: string;
  value: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  probability: number;
  notes: string;
  activities: Activity[];
}

// Atividades
export interface Activity extends BaseEntity {
  type: 'ligacao' | 'email' | 'visita' | 'reuniao' | 'proposta' | 'outro';
  title: string;
  description: string;
  relatedTo: {
    type: 'client' | 'property' | 'deal' | 'contract';
    id: string;
  };
  scheduledDate?: Date;
  completedDate?: Date;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  priority: 'baixa' | 'media' | 'alta';
  assignedTo: string;
  duration?: number; // Em minutos
  outcome?: string;
}

// Financeiro
export interface FinancialRecord extends BaseEntity {
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  date: Date;
  status: 'pendente' | 'pago' | 'atrasado';
  relatedTo?: {
    type: 'contract' | 'deal' | 'property';
    id: string;
  };
  paymentMethod?: string;
  receipt?: string;
  notes: string;
}

// Comissões
export interface Commission extends BaseEntity {
  agentId: string;
  contractId: string;
  amount: number;
  percentage: number;
  status: 'pendente' | 'paga' | 'cancelada';
  paymentDate?: Date;
  notes: string;
}

// Relatórios
export interface Report extends BaseEntity {
  name: string;
  type: 'vendas' | 'financeiro' | 'performance' | 'clientes' | 'propriedades';
  filters: Record<string, any>;
  data: any[];
  generatedAt: Date;
  format: 'pdf' | 'excel' | 'csv';
  url?: string;
}

// Notificações
export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipientId: string;
  read: boolean;
  actionUrl?: string;
  expiresAt?: Date;
}

// Configurações da Empresa
export interface CompanySettings extends BaseEntity {
  name: string;
  cnpj: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  logo?: string;
  primaryColor: string;
  commissionRates: {
    sale: number;
    rent: number;
    administration: number;
  };
  businessHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
} 