import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientService } from '@/services/firebase/clients';
import { Client } from '@/types/crm';
import { toast } from 'sonner';

// Chaves para cache do React Query
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: string) => [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  byStatus: (status: string) => [...clientKeys.all, 'status', status] as const,
  byType: (type: string) => [...clientKeys.all, 'type', type] as const,
  byAgent: (agentId: string) => [...clientKeys.all, 'agent', agentId] as const,
  bySource: (source: string) => [...clientKeys.all, 'source', source] as const,
  active: () => [...clientKeys.all, 'active'] as const,
  prospects: () => [...clientKeys.all, 'prospects'] as const,
};

// Hook para buscar todos os clientes
export const useClients = (limitCount = 50) => {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: () => ClientService.getAll(limitCount),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar cliente por ID
export const useClient = (id: string) => {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => ClientService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar clientes por status
export const useClientsByStatus = (status: Client['status']) => {
  return useQuery({
    queryKey: clientKeys.byStatus(status),
    queryFn: () => ClientService.getByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar clientes por tipo
export const useClientsByType = (type: Client['type']) => {
  return useQuery({
    queryKey: clientKeys.byType(type),
    queryFn: () => ClientService.getByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar clientes por corretor
export const useClientsByAgent = (agentId: string) => {
  return useQuery({
    queryKey: clientKeys.byAgent(agentId),
    queryFn: () => ClientService.getByAgent(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar clientes por fonte
export const useClientsBySource = (source: Client['source']) => {
  return useQuery({
    queryKey: clientKeys.bySource(source),
    queryFn: () => ClientService.getBySource(source),
    enabled: !!source,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar clientes ativos
export const useActiveClients = () => {
  return useQuery({
    queryKey: clientKeys.active(),
    queryFn: () => ClientService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar prospects
export const useProspects = () => {
  return useQuery({
    queryKey: clientKeys.prospects(),
    queryFn: () => ClientService.getProspects(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar clientes por faixa de orçamento
export const useClientsByBudgetRange = (minBudget: number, maxBudget: number) => {
  return useQuery({
    queryKey: [...clientKeys.all, 'budgetRange', minBudget, maxBudget],
    queryFn: () => ClientService.getByBudgetRange(minBudget, maxBudget),
    enabled: minBudget > 0 && maxBudget > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar cliente por email
export const useClientByEmail = (email: string) => {
  return useQuery({
    queryKey: [...clientKeys.all, 'email', email],
    queryFn: () => ClientService.getByEmail(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar cliente por documento
export const useClientByDocument = (document: string) => {
  return useQuery({
    queryKey: [...clientKeys.all, 'document', document],
    queryFn: () => ClientService.getByDocument(document),
    enabled: !!document,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar clientes por tag
export const useClientsByTag = (tag: string) => {
  return useQuery({
    queryKey: [...clientKeys.all, 'tag', tag],
    queryFn: () => ClientService.getByTag(tag),
    enabled: !!tag,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para busca por nome
export const useClientSearch = (name: string) => {
  return useQuery({
    queryKey: [...clientKeys.all, 'search', name],
    queryFn: () => ClientService.searchByName(name),
    enabled: name.length >= 3,
    staleTime: 2 * 60 * 1000, // 2 minutos para buscas
  });
};

// Hook para criar cliente
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ client, userId }: { client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>; userId: string }) =>
      ClientService.create(client, userId),
    onSuccess: () => {
      // Invalidar todas as queries de clientes
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      toast.success('Cliente criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao criar cliente. Tente novamente.');
    },
  });
};

// Hook para atualizar cliente
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates, userId }: { id: string; updates: Partial<Client>; userId: string }) =>
      ClientService.update(id, updates, userId),
    onSuccess: (_, { id }) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente. Tente novamente.');
    },
  });
};

// Hook para deletar cliente
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ClientService.delete(id),
    onSuccess: () => {
      // Invalidar todas as queries de clientes
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      toast.success('Cliente deletado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar cliente:', error);
      toast.error('Erro ao deletar cliente. Tente novamente.');
    },
  });
};

// Hook para atualizar status do cliente
export const useUpdateClientStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, userId }: { id: string; status: Client['status']; userId: string }) =>
      ClientService.updateStatus(id, status, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success('Status do cliente atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar status do cliente:', error);
      toast.error('Erro ao atualizar status. Tente novamente.');
    },
  });
};

// Hook para atualizar corretor responsável
export const useUpdateClientAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, agentId, userId }: { id: string; agentId: string; userId: string }) =>
      ClientService.updateAssignedAgent(id, agentId, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success('Corretor responsável atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar corretor responsável:', error);
      toast.error('Erro ao atualizar corretor. Tente novamente.');
    },
  });
};

// Hook para adicionar tag ao cliente
export const useAddClientTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tag, userId }: { id: string; tag: string; userId: string }) =>
      ClientService.addTag(id, tag, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success('Tag adicionada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao adicionar tag:', error);
      toast.error('Erro ao adicionar tag. Tente novamente.');
    },
  });
};

// Hook para remover tag do cliente
export const useRemoveClientTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tag, userId }: { id: string; tag: string; userId: string }) =>
      ClientService.removeTag(id, tag, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success('Tag removida com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover tag:', error);
      toast.error('Erro ao remover tag. Tente novamente.');
    },
  });
}; 