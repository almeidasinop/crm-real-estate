import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCreateProperty } from '@/hooks/use-properties';

// Schema de validação
const propertySchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  type: z.enum(['apartamento', 'casa', 'comercial', 'terreno', 'cobertura', 'studio']),
  status: z.enum(['disponivel', 'vendido', 'alugado', 'reservado', 'inativo']),
  price: z.number().min(0, 'Preço deve ser maior que zero'),
  area: z.number().min(1, 'Área deve ser maior que zero'),
  bedrooms: z.number().min(0, 'Número de quartos deve ser zero ou maior'),
  bathrooms: z.number().min(1, 'Deve ter pelo menos 1 banheiro'),
  parkingSpaces: z.number().min(0, 'Número de vagas deve ser zero ou maior'),
  address: z.object({
    street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
    number: z.string().min(1, 'Número é obrigatório'),
    neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
    city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().min(8, 'CEP deve ter pelo menos 8 caracteres')
  }),
  features: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  energyRating: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G']).optional(),
  condominiumFee: z.number().optional(),
  iptu: z.number().optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false)
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<PropertyFormData>;
  isEditing?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const createProperty = useCreateProperty();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'apartamento',
      status: initialData?.status || 'disponivel',
      price: initialData?.price || 0,
      area: initialData?.area || 0,
      bedrooms: initialData?.bedrooms || 0,
      bathrooms: initialData?.bathrooms || 1,
      parkingSpaces: initialData?.parkingSpaces || 0,
      address: {
        street: initialData?.address?.street || '',
        number: initialData?.address?.number || '',
        neighborhood: initialData?.address?.neighborhood || '',
        city: initialData?.address?.city || '',
        state: initialData?.address?.state || '',
        zipCode: initialData?.address?.zipCode || ''
      },
      energyRating: initialData?.energyRating || 'A',
      condominiumFee: initialData?.condominiumFee || 0,
      iptu: initialData?.iptu || 0,
      isFeatured: initialData?.isFeatured || false
    }
  });

  const watchedType = watch('type');

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    
    try {
      const propertyData = {
        ...data,
        features,
        highlights,
        tags,
        images: [],
        documents: [],
        agentId: 'system', // Será substituído pelo agente logado
        owner: {
          name: '',
          email: '',
          phone: '',
          document: ''
        }
      };

      if (isEditing) {
        // TODO: Implementar edição
        toast.success('Propriedade atualizada com sucesso!');
      } else {
        await createProperty.mutateAsync({
          property: propertyData,
          userId: 'system'
        });
        toast.success('Propriedade criada com sucesso!');
      }

      reset();
      setFeatures([]);
      setHighlights([]);
      setTags([]);
      onSuccess?.();
      
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error);
      toast.error('Erro ao salvar propriedade. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    const newFeature = prompt('Digite uma característica da propriedade:');
    if (newFeature && newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
    const newHighlight = prompt('Digite um destaque da propriedade:');
    if (newHighlight && newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()]);
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const newTag = prompt('Digite uma tag:');
    if (newTag && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>
            Dados principais da propriedade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Ex: Apartamento 3 quartos com vista para o mar"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select onValueChange={(value) => setValue('type', value as any)} defaultValue={watch('type')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="cobertura">Cobertura</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={watch('status')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="alugado">Alugado</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="0,00"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descreva detalhadamente a propriedade..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
          <CardDescription>
            Dimensões e características físicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Área (m²) *</Label>
              <Input
                id="area"
                type="number"
                {...register('area', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.area && (
                <p className="text-sm text-red-500">{errors.area.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Quartos</Label>
              <Input
                id="bedrooms"
                type="number"
                {...register('bedrooms', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.bedrooms && (
                <p className="text-sm text-red-500">{errors.bedrooms.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros *</Label>
              <Input
                id="bathrooms"
                type="number"
                {...register('bathrooms', { valueAsNumber: true })}
                placeholder="1"
              />
              {errors.bathrooms && (
                <p className="text-sm text-red-500">{errors.bathrooms.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingSpaces">Vagas</Label>
              <Input
                id="parkingSpaces"
                type="number"
                {...register('parkingSpaces', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.parkingSpaces && (
                <p className="text-sm text-red-500">{errors.parkingSpaces.message}</p>
              )}
            </div>
          </div>

          {/* Características específicas por tipo */}
          {watchedType === 'apartamento' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="energyRating">Classificação Energética</Label>
                <Select onValueChange={(value) => setValue('energyRating', value as any)} defaultValue={watch('energyRating')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condominiumFee">Taxa de Condomínio (R$)</Label>
                <Input
                  id="condominiumFee"
                  type="number"
                  {...register('condominiumFee', { valueAsNumber: true })}
                  placeholder="0,00"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="iptu">IPTU (R$)</Label>
            <Input
              id="iptu"
              type="number"
              {...register('iptu', { valueAsNumber: true })}
              placeholder="0,00"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>
            Localização da propriedade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Rua *</Label>
              <Input
                id="street"
                {...register('address.street')}
                placeholder="Nome da rua"
              />
              {errors.address?.street && (
                <p className="text-sm text-red-500">{errors.address.street.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                {...register('address.number')}
                placeholder="123"
              />
              {errors.address?.number && (
                <p className="text-sm text-red-500">{errors.address.number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                {...register('address.neighborhood')}
                placeholder="Nome do bairro"
              />
              {errors.address?.neighborhood && (
                <p className="text-sm text-red-500">{errors.address.neighborhood.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                {...register('address.city')}
                placeholder="Nome da cidade"
              />
              {errors.address?.city && (
                <p className="text-sm text-red-500">{errors.address.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                {...register('address.state')}
                placeholder="SP"
                maxLength={2}
              />
              {errors.address?.state && (
                <p className="text-sm text-red-500">{errors.address.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                {...register('address.zipCode')}
                placeholder="00000-000"
              />
              {errors.address?.zipCode && (
                <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características e Destaques</CardTitle>
          <CardDescription>
            Adicione características e destaques da propriedade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Características */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Características</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                + Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feature} readOnly />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Destaques */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Destaques</Label>
              <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                + Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={highlight} readOnly />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeHighlight(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                + Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={tag} readOnly />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTag(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Destaque */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isFeatured"
              checked={watch('isFeatured')}
              onCheckedChange={(checked) => setValue('isFeatured', checked)}
            />
            <Label htmlFor="isFeatured">Propriedade em destaque</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || createProperty.isPending}>
          {isSubmitting || createProperty.isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Propriedade'}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm; 