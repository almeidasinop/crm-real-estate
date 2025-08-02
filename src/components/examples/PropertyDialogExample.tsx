import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit } from 'lucide-react';
import PropertyDialog from '@/components/dialogs/PropertyDialog';
import { toast } from 'sonner';

const PropertyDialogExample = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const handleOpenNewProperty = () => {
    setEditingProperty(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditProperty = () => {
    // Exemplo de dados para edição
    const exampleProperty = {
      title: 'Apartamento 3 quartos com vista para o mar',
      description: 'Apartamento moderno com vista deslumbrante para o mar de Copacabana.',
      type: 'apartamento',
      status: 'disponivel',
      price: 850000,
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 2,
      address: {
        street: 'Av. Atlântica',
        number: '1500',
        neighborhood: 'Copacabana',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '22070-001'
      },
      features: ['Academia', 'Piscina', 'Portaria 24h'],
      highlights: ['Vista para o mar', 'Móveis planejados'],
      tags: ['alto_padrao', 'vista_mar'],
      energyRating: 'A',
      condominiumFee: 1200,
      iptu: 800,
      isFeatured: true
    };
    
    setEditingProperty(exampleProperty);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingProperty(null);
    toast.success('Propriedade salva com sucesso!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exemplo de Uso do PropertyDialog</CardTitle>
          <CardDescription>
            Demonstração de como usar o popup de propriedades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={handleOpenNewProperty}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Propriedade
            </Button>
            
            <Button variant="outline" onClick={handleOpenEditProperty}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Propriedade (Exemplo)
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Funcionalidades:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Formulário completo com validação</li>
              <li>Campos dinâmicos baseados no tipo de propriedade</li>
              <li>Adicionar/remover características, destaques e tags</li>
              <li>Integração com Firebase</li>
              <li>Feedback visual com loading states</li>
              <li>Responsivo para mobile e desktop</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <PropertyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingProperty}
        isEditing={!!editingProperty}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PropertyDialogExample; 