import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyService } from '@/services/firebase/properties';
import { Property } from '@/types/crm';
import { toast } from 'sonner';

// Chaves para cache do React Query
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: string) => [...propertyKeys.lists(), { filters }] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  byStatus: (status: string) => [...propertyKeys.all, 'status', status] as const,
  byType: (type: string) => [...propertyKeys.all, 'type', type] as const,
  byAgent: (agentId: string) => [...propertyKeys.all, 'agent', agentId] as const,
  featured: () => [...propertyKeys.all, 'featured'] as const,
};

// Hook para buscar todas as propriedades
export const useProperties = (limitCount = 50) => {
  return useQuery({
    queryKey: propertyKeys.lists(),
    queryFn: () => PropertyService.getAll(limitCount),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar propriedade por ID
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => PropertyService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar propriedades por status
export const usePropertiesByStatus = (status: Property['status']) => {
  return useQuery({
    queryKey: propertyKeys.byStatus(status),
    queryFn: () => PropertyService.getByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar propriedades por tipo
export const usePropertiesByType = (type: Property['type']) => {
  return useQuery({
    queryKey: propertyKeys.byType(type),
    queryFn: () => PropertyService.getByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar propriedades por corretor
export const usePropertiesByAgent = (agentId: string) => {
  return useQuery({
    queryKey: propertyKeys.byAgent(agentId),
    queryFn: () => PropertyService.getByAgent(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar propriedades em destaque
export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: propertyKeys.featured(),
    queryFn: () => PropertyService.getFeatured(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar propriedades por faixa de preço
export const usePropertiesByPriceRange = (minPrice: number, maxPrice: number) => {
  return useQuery({
    queryKey: [...propertyKeys.all, 'priceRange', minPrice, maxPrice],
    queryFn: () => PropertyService.getByPriceRange(minPrice, maxPrice),
    enabled: minPrice > 0 && maxPrice > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar propriedades por bairro
export const usePropertiesByNeighborhood = (neighborhood: string) => {
  return useQuery({
    queryKey: [...propertyKeys.all, 'neighborhood', neighborhood],
    queryFn: () => PropertyService.getByNeighborhood(neighborhood),
    enabled: !!neighborhood,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para busca por texto
export const usePropertySearch = (searchTerm: string) => {
  return useQuery({
    queryKey: [...propertyKeys.all, 'search', searchTerm],
    queryFn: () => PropertyService.searchByText(searchTerm),
    enabled: searchTerm.length >= 3,
    staleTime: 2 * 60 * 1000, // 2 minutos para buscas
  });
};

// Hook para criar propriedade
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ property, userId }: { property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>; userId: string }) =>
      PropertyService.create(property, userId),
    onSuccess: () => {
      // Invalidar todas as queries de propriedades
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
      toast.success('Propriedade criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar propriedade:', error);
      toast.error('Erro ao criar propriedade. Tente novamente.');
    },
  });
};

// Hook para atualizar propriedade
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates, userId }: { id: string; updates: Partial<Property>; userId: string }) =>
      PropertyService.update(id, updates, userId),
    onSuccess: (_, { id }) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      toast.success('Propriedade atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar propriedade:', error);
      toast.error('Erro ao atualizar propriedade. Tente novamente.');
    },
  });
};

// Hook para deletar propriedade
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PropertyService.delete(id),
    onSuccess: () => {
      // Invalidar todas as queries de propriedades
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
      toast.success('Propriedade deletada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar propriedade:', error);
      toast.error('Erro ao deletar propriedade. Tente novamente.');
    },
  });
};

// Hook para upload de imagem
export const useUploadPropertyImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, propertyId }: { file: File; propertyId: string }) =>
      PropertyService.uploadImage(file, propertyId),
    onSuccess: (_, { propertyId }) => {
      // Invalidar queries da propriedade específica
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(propertyId) });
      toast.success('Imagem enviada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao enviar imagem. Tente novamente.');
    },
  });
};

// Hook para deletar imagem
export const useDeletePropertyImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageUrl: string) => PropertyService.deleteImage(imageUrl),
    onSuccess: () => {
      // Invalidar todas as queries de propriedades
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
      toast.success('Imagem deletada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar imagem:', error);
      toast.error('Erro ao deletar imagem. Tente novamente.');
    },
  });
};

// Hook para paginação
export const usePropertiesPaginated = (pageSize = 10) => {
  return useQuery({
    queryKey: [...propertyKeys.all, 'paginated', pageSize],
    queryFn: () => PropertyService.getPaginated(undefined, pageSize),
    staleTime: 5 * 60 * 1000,
  });
}; 