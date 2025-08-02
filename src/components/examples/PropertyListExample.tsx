import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useProperties, 
  usePropertiesByStatus, 
  usePropertiesByType,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty 
} from '@/hooks';
import { Property } from '@/types/crm';
import { toast } from 'sonner';

const PropertyListExample = () => {
  const [statusFilter, setStatusFilter] = useState<Property['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Property['type'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks do Firebase
  const { data: allProperties, isLoading: isLoadingAll, error: errorAll } = useProperties();
  const { data: propertiesByStatus, isLoading: isLoadingByStatus } = usePropertiesByStatus(
    statusFilter === 'all' ? 'disponivel' : statusFilter
  );
  const { data: propertiesByType, isLoading: isLoadingByType } = usePropertiesByType(
    typeFilter === 'all' ? 'apartamento' : typeFilter
  );

  // Mutations
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  // Determinar quais dados usar baseado nos filtros
  const getFilteredProperties = () => {
    if (statusFilter !== 'all') return propertiesByStatus || [];
    if (typeFilter !== 'all') return propertiesByType || [];
    return allProperties || [];
  };

  const properties = getFilteredProperties();
  const isLoading = isLoadingAll || isLoadingByStatus || isLoadingByType;

  // Função para criar uma propriedade de exemplo
  const handleCreateExampleProperty = () => {
    const exampleProperty: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Apartamento Exemplo',
      description: 'Apartamento moderno com 2 quartos',
      type: 'apartamento',
      status: 'disponivel',
      price: 500000,
      area: 80,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      address: {
        street: 'Rua Exemplo',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      features: ['Academia', 'Piscina', 'Portaria 24h'],
      images: [],
      documents: [],
      agentId: 'agent-example-id',
      owner: {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '(11) 99999-9999',
        document: '123.456.789-00'
      },
      highlights: ['Vista para o mar', 'Móveis planejados'],
      tags: ['novo', 'destaque']
    };

    createPropertyMutation.mutate({
      property: exampleProperty,
      userId: 'user-example-id'
    });
  };

  // Função para atualizar status de uma propriedade
  const handleUpdateStatus = (propertyId: string, newStatus: Property['status']) => {
    updatePropertyMutation.mutate({
      id: propertyId,
      updates: { status: newStatus },
      userId: 'user-example-id'
    });
  };

  // Função para deletar uma propriedade
  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta propriedade?')) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  if (errorAll) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar propriedades: {errorAll.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Property['status'] | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="alugado">Alugado</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as Property['type'] | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="cobertura">Cobertura</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Buscar propriedades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleCreateExampleProperty} disabled={createPropertyMutation.isPending}>
            {createPropertyMutation.isPending ? 'Criando...' : 'Criar Propriedade Exemplo'}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Propriedades */}
      <Card>
        <CardHeader>
          <CardTitle>Propriedades ({properties.length})</CardTitle>
          <CardDescription>
            Lista de propriedades carregadas do Firebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma propriedade encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-sm text-muted-foreground">{property.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={property.status === 'disponivel' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                      <Badge variant="outline">{property.type}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Preço:</span> R$ {property.price.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Área:</span> {property.area}m²
                    </div>
                    <div>
                      <span className="font-medium">Quartos:</span> {property.bedrooms}
                    </div>
                    <div>
                      <span className="font-medium">Banheiros:</span> {property.bathrooms}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(property.id, 'vendido')}
                      disabled={updatePropertyMutation.isPending}
                    >
                      Marcar como Vendido
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={deletePropertyMutation.isPending}
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyListExample; 