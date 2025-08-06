import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReactQuill, { Quill } from 'react-quill'; // 1. Importar o Quill

// 2. Importar módulos e estilos do quill-emoji e o CSS padrão do Quill
import 'react-quill/dist/quill.snow.css';
import "quill-emoji/dist/quill-emoji.css";
import * as Emoji from "quill-emoji";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCreateProperty, useUpdateProperty } from '@/hooks/use-properties';
import { useAgents } from '@/hooks/use-agents';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { UploadCloud, X } from 'lucide-react';

// 3. Registrar o módulo de emoji com o Quill (faça isso fora do componente)
Quill.register("modules/emoji", Emoji);

const propertyTypes = ['Apartamento', 'Casa', 'Casa de Alto Padrão', 'Comercial', 'Condomínio', 'Espaço de escritório', 'Rural', 'Terreno'] as const;
const propertyStatus = ['aluguel', 'arrendamento', 'venda', 'reservado', 'vendido', 'inativo'] as const;
const predefinedFeatures = ['Ar condicionado', 'Armários', 'Biblioteca', 'Cozinha', 'Escritório', 'Espaço ao ar livre', 'Estacionamento', 'Garagem', 'Internet / Wi-Fi', 'Laje', 'Lareira', 'Lavandaria', 'Mobiliado', 'Painéis solares', 'Pátio', 'pé direito amplo', 'Piscina', 'Pisos de madeira', 'Poço de luz', 'Quarto', 'Sacada', 'Sala de mídia', 'Suíte', 'Suíte Master', 'TV Cabo'] as const;

const propertySchema = z.object({
  title: z.string().min(3, 'Título é obrigatório'),
  type: z.enum(propertyTypes),
  status: z.enum(propertyStatus),
  price: z.number().nonnegative(),
  builtArea: z.preprocess(val => (val === "" || val === null ? undefined : Number(val)), z.number().nonnegative().optional()),
  landArea: z.preprocess(val => (val === "" || val === null ? undefined : Number(val)), z.number().nonnegative().optional()),
  agentId: z.string().min(1, 'Corretor é obrigatório'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().optional(),
    neighborhood: z.string().optional(),
  }),
  location: z.object({ lat: z.number(), lng: z.number() }).optional(),
  description: z.string().optional(),
  bedrooms: z.number().nonnegative().optional(),
  bathrooms: z.number().nonnegative().optional(),
  parkingSpaces: z.number().nonnegative().optional(),
  features: z.array(z.string()).default([]),
  images: z.array(z.object({ url: z.string() })).default([]),
  condominiumFee: z.preprocess(val => (val === "" || val === null ? undefined : Number(val)), z.number().nonnegative().optional()),
  iptu: z.preprocess(val => (val === "" || val === null ? undefined : Number(val)), z.number().nonnegative().optional()),
  isFeatured: z.boolean().default(false),
  tags: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  longDescription: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const getCoordinatesFromAddress = async (address: PropertyFormData['address']) => {
    const fullAddress = `${address.street}, ${address.city}, ${address.state}`;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.status === 'OK' ? data.results[0].geometry.location : null;
    } catch { return null; }
};

const PropertyForm: React.FC<any> = ({ onSuccess, onCancel, initialData, isEditing = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { data: agents, isLoading: isLoadingAgents } = useAgents();
  const { user } = useAuth();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || { status: 'venda', features: [], images: [], isFeatured: false }
  });

  const images = watch('images');

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        agentId: initialData.broker?.id || initialData.agentId || '',
        features: initialData.amenities || [],
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags,
      });
    }
  }, [initialData, reset]);
  
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const uploadPromises = Array.from(files).map(file => {
      const storageRef = ref(storage, `properties/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      return new Promise<{ url: string }>((resolve, reject) => {
        uploadTask.on('state_changed', () => {}, reject, async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url: downloadURL });
        });
      });
    });
    try {
      const newImages = await Promise.all(uploadPromises);
      setValue('images', [...(images || []), ...newImages]);
      toast.success("Imagens enviadas!");
    } catch (error) { toast.error("Falha no upload."); } finally { setIsUploading(false); }
  };
  
  const handleRemoveImage = (index: number) => {
    setValue('images', images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) { toast.error("Você precisa estar logado."); return; }
    setIsSubmitting(true);
    
    const coordinates = await getCoordinatesFromAddress(data.address);
    
    const cleanData: { [key: string]: any } = {};
    Object.keys(data).forEach(key => {
        const value = (data as any)[key];
        if (value !== undefined && value !== null) {
            cleanData[key] = value;
        }
    });

    const propertyData = {
      ...cleanData,
      location: coordinates || null,
      amenities: cleanData.features,
      tags: cleanData.tags?.split(',').map((t:string) => t.trim()).filter(Boolean) || [],
    };
    delete propertyData.features;

    try {
      if (isEditing && initialData?.id) {
        await updateProperty.mutateAsync({ id: initialData.id, updates: propertyData, userId: user.uid });
      } else {
        await createProperty.mutateAsync({ property: propertyData, userId: user.uid });
      }
      toast.success(`Propriedade ${isEditing ? 'atualizada' : 'criada'}!`);
      onSuccess?.();
    } catch (error) { 
      console.error("Erro ao salvar:", error);
      toast.error('Erro ao salvar propriedade.'); 
    } finally { setIsSubmitting(false); }
  };

  // 4. Atualizar os módulos para incluir o emoji
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'emoji'], // Adicionado o botão de emoji
      ['clean']
    ],
    // Adicionadas as configurações do módulo de emoji
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="title">Título *</Label><Input id="title" {...register('title')} />{errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}</div>
                  <div className="space-y-2"><Label htmlFor="agentId">Corretor *</Label><Controller name="agentId" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value} disabled={isLoadingAgents}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{agents?.map(agent => <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>)}</SelectContent></Select>)} />{errors.agentId && <p className="text-sm text-red-500">{errors.agentId.message}</p>}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label htmlFor="type">Tipo *</Label><Controller name="type" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select>)} /></div>
                  <div className="space-y-2"><Label htmlFor="status">Condição *</Label><Controller name="status" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{propertyStatus.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>)} /></div>
                  <div className="space-y-2"><Label htmlFor="price">Preço (R$)</Label><Input id="price" type="number" {...register('price', { valueAsNumber: true })} /></div>
              </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Imagens</CardTitle></CardHeader>
          <CardContent>
              <div className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-center"><Label htmlFor="image-upload" className="cursor-pointer"><UploadCloud className="mx-auto h-8 w-8 text-gray-400" /><span className="mt-2 block text-sm font-medium">Arraste e solte ou clique para enviar</span></Label><Input id="image-upload" type="file" multiple className="hidden" onChange={(e) => handleImageUpload(e.target.files)} disabled={isUploading}/></div>
              {isUploading && <p className="text-sm text-blue-500 mt-2">Enviando...</p>}
              {images?.length > 0 && (<div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">{images.map((image, index) => (<div key={index} className="relative group"><img src={image.url} alt={`Imagem ${index + 1}`} className="w-full h-24 object-cover rounded-md" /><button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><X size={14} /></button></div>))}</div>)}
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Descrição e Vídeo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="longDescription">Descrição Completa do Imóvel</Label>
                    <Controller
                      name="longDescription"
                      control={control}
                      render={({ field }) => <ReactQuill 
                        theme="snow" 
                        value={field.value || ''} // Garantir que o valor não seja undefined
                        onChange={field.onChange} 
                        modules={quillModules} // Usar os módulos atualizados
                        placeholder="Descreva os detalhes do imóvel aqui..."
                      />}
                    />
                </div>
                <div>
                    <Label htmlFor="videoUrl">URL do Vídeo (YouTube)</Label>
                    <Input id="videoUrl" {...register('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." />
                    {errors.videoUrl && <p className="text-sm text-red-500">{errors.videoUrl.message}</p>}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Detalhes e Dimensões</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2"><Label htmlFor="builtArea">Área Construída (m²)</Label><Input id="builtArea" type="number" {...register('builtArea', { valueAsNumber: true })} /></div>
                <div className="space-y-2"><Label htmlFor="landArea">Área do Terreno (m²)</Label><Input id="landArea" type="number" {...register('landArea', { valueAsNumber: true })} /></div>
                <div className="space-y-2"><Label htmlFor="bedrooms">Quartos</Label><Input id="bedrooms" type="number" {...register('bedrooms', { valueAsNumber: true })} /></div>
                <div className="space-y-2"><Label htmlFor="bathrooms">Banheiros</Label><Input id="bathrooms" type="number" {...register('bathrooms', { valueAsNumber: true })} /></div>
                <div className="space-y-2"><Label htmlFor="parkingSpaces">Vagas</Label><Input id="parkingSpaces" type="number" {...register('parkingSpaces', { valueAsNumber: true })} /></div>
                <div className="space-y-2"><Label htmlFor="condominiumFee">Condomínio (R$)</Label><Input id="condominiumFee" type="number" {...register('condominiumFee')} /></div>
                <div className="space-y-2"><Label htmlFor="iptu">IPTU (R$)</Label><Input id="iptu" type="number" {...register('iptu')} /></div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Características do Imóvel</CardTitle></CardHeader>
          <CardContent>
              <Controller name="features" control={control} render={({ field }) => (<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{predefinedFeatures.map(feature => (<div key={feature} className="flex items-center space-x-2"><Checkbox id={feature} checked={field.value?.includes(feature)} onCheckedChange={checked => field.onChange(checked ? [...(field.value || []), feature] : (field.value || []).filter(v => v !== feature))} /><Label htmlFor={feature} className="font-normal">{feature}</Label></div>))}</div>)} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Endereço</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Label htmlFor="address.street">Rua</Label><Input id="address.street" {...register('address.street')} /></div>
              <div><Label htmlFor="address.neighborhood">Bairro</Label><Input id="address.neighborhood" {...register('address.neighborhood')} /></div>
              <div><Label htmlFor="address.city">Cidade *</Label><Input id="address.city" {...register('address.city')} />{errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}</div>
              <div><Label htmlFor="address.state">Estado *</Label><Input id="address.state" {...register('address.state')} />{errors.address?.state && <p className="text-sm text-red-500">{errors.address.state.message}</p>}</div>
              <div><Label htmlFor="address.zipCode">CEP</Label><Input id="address.zipCode" {...register('address.zipCode')} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Publicação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="tags">Tags (separadas por vírgula)</Label><Input id="tags" {...register('tags')} /></div>
              <div className="flex items-center space-x-2"><Controller name="isFeatured" control={control} render={({ field }) => (<Switch id="isFeatured" checked={field.value} onCheckedChange={field.onChange} />)} /><Label htmlFor="isFeatured">Marcar como destaque</Label></div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
    </form>
  );
};

export default PropertyForm;
