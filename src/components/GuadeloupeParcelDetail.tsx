import React, { useState } from 'react';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { 
  MapPin, 
  Building, 
  DollarSign, 
  Bed, 
  Bath, 
  Ruler, 
  Users, 
  Calendar, 
  Plus, 
  Trash2, 
  Camera 
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { useParams } from 'react-router-dom';

// --- NOVAS INTERFACES --- //

interface PropertyDetails {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // m²
  description: string;
  owner: string;
  images: string[];
}

interface PropertyEvent {
  id: number;
  date: string;
  type: 'Visita' | 'Proposta' | 'Ligação' | 'Documentação' | 'Outro';
  notes: string;
  attendees: string; // Participantes
}

interface InvolvedAgent {
  id: number;
  name: string;
  agency: string;
  phone: string;
  email: string;
}

// --- DADOS MOCADOS ATUALIZADOS --- //

const propertyData: PropertyDetails = {
  id: 'prop123',
  title: 'Apartamento Moderno no Centro',
  address: 'Rua das Flores, 123, Centro, São Paulo - SP',
  price: 750000,
  type: 'Apartamento',
  bedrooms: 3,
  bathrooms: 2,
  area: 95,
  description: 'Lindo apartamento recém-reformado com vista para o parque. Possui 3 quartos, sendo 1 suíte, e 2 vagas de garagem. Condomínio com lazer completo.',
  owner: 'Maria Silva',
  images: ['property1_living_room.jpg', 'property1_kitchen.jpg', 'property1_bedroom.jpg'],
};

const initialEvents: PropertyEvent[] = [
  {
    id: 1,
    date: '2023-10-15',
    type: 'Visita',
    notes: 'Cliente interessado, agendou segunda visita.',
    attendees: 'João e Ana Pereira',
  },
  {
    id: 2,
    date: '2023-10-18',
    type: 'Proposta',
    notes: 'Proposta recebida no valor de R$730.000. Em análise.',
    attendees: 'Corretor Carlos',
  },
];

const initialAgents: InvolvedAgent[] = [
  {
    id: 1,
    name: 'Carlos Neto',
    agency: 'Imobiliária da Casa',
    phone: '(11) 98765-4321',
    email: 'carlos.neto@imobcasa.com',
  },
  {
    id: 2,
    name: 'Fernanda Lima',
    agency: 'Parceira Imóveis',
    phone: '(11) 91234-5678',
    email: 'fernanda.lima@parceira.com',
  },
];

// --- COLUNAS DAS TABELAS ATUALIZADAS --- //

const eventColumns: Column[] = [
  { id: 'date', header: 'Data', accessorKey: 'date', isEditable: true, width: '120px' },
  { id: 'type', header: 'Tipo', accessorKey: 'type', isEditable: true, width: '150px' },
  { id: 'notes', header: 'Anotações', accessorKey: 'notes', isEditable: true },
  { id: 'attendees', header: 'Participantes', accessorKey: 'attendees', isEditable: true },
];

const agentColumns: Column[] = [
  { id: 'name', header: 'Nome', accessorKey: 'name', isEditable: true },
  { id: 'agency', header: 'Imobiliária', accessorKey: 'agency', isEditable: true },
  { id: 'phone', header: 'Telefone', accessorKey: 'phone', isEditable: true },
  { id: 'email', header: 'Email', accessorKey: 'email', isEditable: true },
];

// --- COMPONENTE RENOMEADO E ATUALIZADO --- //

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetails>(propertyData);
  const [events, setEvents] = useState<PropertyEvent[]>(initialEvents);
  const [agents, setAgents] = useState<InvolvedAgent[]>(initialAgents);
  const [activeTab, setActiveTab] = useState<'info' | 'events' | 'agents'>('info');
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Handlers adaptados (simplificado para demonstração)
  const handlePropertyUpdate = (field: keyof PropertyDetails, value: any) => {
    setProperty({ ...property, [field]: value });
    toast.success('Informação do imóvel atualizada!');
  };

  const handleEventUpdate = (rowIndex: number, columnId: string, value: any) => {
    const updatedEvents = [...events];
    (updatedEvents[rowIndex] as any)[columnId] = value;
    setEvents(updatedEvents);
    toast.success('Evento atualizado!');
  };

  const handleAddEvent = (newRow: Record<string, any>) => {
    const newEvent: PropertyEvent = {
      id: Math.max(0, ...events.map(e => e.id)) + 1,
      date: newRow.date || new Date().toISOString().split('T')[0],
      type: newRow.type || 'Outro',
      notes: newRow.notes || '',
      attendees: newRow.attendees || '',
    };
    setEvents([...events, newEvent]);
    toast.success('Novo evento adicionado!');
  };

  const handleDeleteEvent = (rowIndex: number) => {
    setEvents(events.filter((_, index) => index !== rowIndex));
    toast.success('Evento excluído!');
  };

  const handleAgentUpdate = (rowIndex: number, columnId: string, value: any) => {
    const updatedAgents = [...agents];
    (updatedAgents[rowIndex] as any)[columnId] = value;
    setAgents(updatedAgents);
    toast.success('Agente atualizado!');
  };

  const handleAddAgent = (newRow: Record<string, any>) => {
    const newAgent: InvolvedAgent = {
      id: Math.max(0, ...agents.map(a => a.id)) + 1,
      name: newRow.name || '',
      agency: newRow.agency || '',
      phone: newRow.phone || '',
      email: newRow.email || '',
    };
    setAgents([...agents, newAgent]);
    toast.success('Novo agente adicionado!');
  };

  const handleDeleteAgent = (rowIndex: number) => {
    setAgents(agents.filter((_, index) => index !== rowIndex));
    toast.success('Agente excluído!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Building className="h-6 w-6 mr-2 text-primary" />
              <EditableField value={property.title} onSave={(v) => handlePropertyUpdate('title', v)} />
            </h2>
            <p className="text-muted-foreground flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1.5" />
              <EditableField value={property.address} onSave={(v) => handlePropertyUpdate('address', v)} />
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <button className={`px-4 py-2 rounded-lg ${activeTab === 'info' ? 'bg-primary text-white' : 'bg-muted'}`} onClick={() => setActiveTab('info')}>Informações</button>
            <button className={`px-4 py-2 rounded-lg ${activeTab === 'events' ? 'bg-primary text-white' : 'bg-muted'}`} onClick={() => setActiveTab('events')}>Visitas</button>
            <button className={`px-4 py-2 rounded-lg ${activeTab === 'agents' ? 'bg-primary text-white' : 'bg-muted'}`} onClick={() => setActiveTab('agents')}>Agentes</button>
          </div>
        </div>
        
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center"><DollarSign className="h-4 w-4 mr-1"/>Preço</h3>
                <EditableField value={`R$ ${property.price.toLocaleString('pt-BR')}`} onSave={(v) => handlePropertyUpdate('price', Number(v.replace(/[^0-9,]/g, '').replace(',', '.')))} className="text-xl font-bold" />
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center"><Bed className="h-4 w-4 mr-1"/>Quartos</h3>
                <EditableField value={property.bedrooms} type="number" onSave={(v) => handlePropertyUpdate('bedrooms', v)} className="text-xl font-bold" />
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center"><Bath className="h-4 w-4 mr-1"/>Banheiros</h3>
                <EditableField value={property.bathrooms} type="number" onSave={(v) => handlePropertyUpdate('bathrooms', v)} className="text-xl font-bold" />
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center"><Ruler className="h-4 w-4 mr-1"/>Área</h3>
                <div className="flex items-baseline">
                  <EditableField value={property.area} type="number" onSave={(v) => handlePropertyUpdate('area', v)} className="text-xl font-bold" />
                  <span className="ml-1 text-lg">m²</span>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição</h3>
              <EditableField value={property.description} onSave={(v) => handlePropertyUpdate('description', v)} className="text-lg" />
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Proprietário</h3>
              <EditableField value={property.owner} onSave={(v) => handlePropertyUpdate('owner', v)} className="text-lg" />
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Fotos do Imóvel</h3>
                <button className="text-sm flex items-center text-primary hover:text-primary/80" onClick={() => setShowImageUpload(!showImageUpload)}>
                  <Plus className="h-4 w-4 mr-1" />Adicionar Foto
                </button>
              </div>
              {showImageUpload && (
                <div className="mb-4 p-3 border border-dashed rounded-lg">
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Arraste uma imagem ou clique para carregar</p>
                    <Input type="file" className="max-w-xs" />
                    <div className="flex space-x-2 mt-2">
                      <button className="px-3 py-1 text-sm bg-primary text-white rounded">Enviar</button>
                      <button className="px-3 py-1 text-sm border rounded" onClick={() => setShowImageUpload(false)}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {property.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={`/placeholders/${img}`} alt={`Foto do imóvel ${index + 1}`} className="rounded-lg object-cover w-full h-32" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-white p-2 bg-red-500 rounded-full"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Registro de Visitas e Eventos</h3>
            <EditableTable columns={eventColumns} data={events} onUpdate={handleEventUpdate} onAddRow={handleAddEvent} onDeleteRow={handleDeleteEvent} />
          </div>
        )}

        {activeTab === 'agents' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Agentes Envolvidos</h3>
            <EditableTable columns={agentColumns} data={agents} onUpdate={handleAgentUpdate} onAddRow={handleAddAgent} onDeleteRow={handleDeleteAgent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
