import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentService } from '@/services/firebase/agents';
import { Agent } from '@/types/crm';
import { toast } from 'sonner';

// Chaves para cache do React Query
export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (filters: string) => [...agentKeys.lists(), { filters }] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
  byStatus: (status: string) => [...agentKeys.all, 'status', status] as const,
  byRole: (role: string) => [...agentKeys.all, 'role', role] as const,
  bySpecialty: (specialty: string) => [...agentKeys.all, 'specialty', specialty] as const,
  active: () => [...agentKeys.all, 'active'] as const,
  corretores: () => [...agentKeys.all, 'corretores'] as const,
  gerentes: () => [...agentKeys.all, 'gerentes'] as const,
  admins: () => [...agentKeys.all, 'admins'] as const,
  topPerformers: () => [...agentKeys.all, 'topPerformers'] as const,
};

// Hook para buscar todos os agentes
export const useAgents = (limitCount = 50) => {
  return useQuery({
    queryKey: agentKeys.lists(),
    queryFn: () => AgentService.getAll(limitCount),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar agente por ID
export const useAgent = (id: string) => {
  return useQuery({
    queryKey: agentKeys.detail(id),
    queryFn: () => AgentService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar agentes por status
export const useAgentsByStatus = (status: Agent['status']) => {
  return useQuery({
    queryKey: agentKeys.byStatus(status),
    queryFn: () => AgentService.getByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar agentes por função
export const useAgentsByRole = (role: Agent['role']) => {
  return useQuery({
    queryKey: agentKeys.byRole(role),
    queryFn: () => AgentService.getByRole(role),
    enabled: !!role,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar agentes por especialidade
export const useAgentsBySpecialty = (specialty: string) => {
  return useQuery({
    queryKey: agentKeys.bySpecialty(specialty),
    queryFn: () => AgentService.getBySpecialty(specialty),
    enabled: !!specialty,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar agentes ativos
export const useActiveAgents = () => {
  return useQuery({
    queryKey: agentKeys.active(),
    queryFn: () => AgentService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar corretores
export const useCorretores = () => {
  return useQuery({
    queryKey: agentKeys.corretores(),
    queryFn: () => AgentService.getCorretores(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar gerentes
export const useGerentes = () => {
  return useQuery({
    queryKey: agentKeys.gerentes(),
    queryFn: () => AgentService.getGerentes(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar administradores
export const useAdmins = () => {
  return useQuery({
    queryKey: agentKeys.admins(),
    queryFn: () => AgentService.getAdmins(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar top performers
export const useTopPerformers = (limitCount = 10) => {
  return useQuery({
    queryKey: agentKeys.topPerformers(),
    queryFn: () => AgentService.getTopPerformers(limitCount),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar agente por email
export const useAgentByEmail = (email: string) => {
  return useQuery({
    queryKey: [...agentKeys.all, 'email', email],
    queryFn: () => AgentService.getByEmail(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar agente por documento
export const useAgentByDocument = (document: string) => {
  return useQuery({
    queryKey: [...agentKeys.all, 'document', document],
    queryFn: () => AgentService.getByDocument(document),
    enabled: !!document,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para buscar agentes por experiência
export const useAgentsByExperience = (minExperience: number) => {
  return useQuery({
    queryKey: [...agentKeys.all, 'experience', minExperience],
    queryFn: () => AgentService.getByExperience(minExperience),
    enabled: minExperience >= 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para busca por nome
export const useAgentSearch = (name: string) => {
  return useQuery({
    queryKey: [...agentKeys.all, 'search', name],
    queryFn: () => AgentService.searchByName(name),
    enabled: name.length >= 3,
    staleTime: 2 * 60 * 1000, // 2 minutos para buscas
  });
};

// Hook para criar agente
export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agent, userId }: { agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>; userId: string }) =>
      AgentService.create(agent, userId),
    onSuccess: () => {
      // Invalidar todas as queries de agentes
      queryClient.invalidateQueries({ queryKey: agentKeys.all });
      toast.success('Agente criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar agente:', error);
      toast.error('Erro ao criar agente. Tente novamente.');
    },
  });
};

// Hook para atualizar agente
export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates, userId }: { id: string; updates: Partial<Agent>; userId: string }) =>
      AgentService.update(id, updates, userId),
    onSuccess: (_, { id }) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast.success('Agente atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar agente:', error);
      toast.error('Erro ao atualizar agente. Tente novamente.');
    },
  });
};

// Hook para deletar agente
export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AgentService.delete(id),
    onSuccess: () => {
      // Invalidar todas as queries de agentes
      queryClient.invalidateQueries({ queryKey: agentKeys.all });
      toast.success('Agente deletado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar agente:', error);
      toast.error('Erro ao deletar agente. Tente novamente.');
    },
  });
};

// Hook para atualizar status do agente
export const useUpdateAgentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, userId }: { id: string; status: Agent['status']; userId: string }) =>
      AgentService.updateStatus(id, status, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast.success('Status do agente atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar status do agente:', error);
      toast.error('Erro ao atualizar status. Tente novamente.');
    },
  });
};

// Hook para atualizar função do agente
export const useUpdateAgentRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role, userId }: { id: string; role: Agent['role']; userId: string }) =>
      AgentService.updateRole(id, role, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast.success('Função do agente atualizada!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar função do agente:', error);
      toast.error('Erro ao atualizar função. Tente novamente.');
    },
  });
};

// Hook para atualizar comissão do agente
export const useUpdateAgentCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, commission, userId }: { id: string; commission: number; userId: string }) =>
      AgentService.updateCommission(id, commission, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast.success('Comissão do agente atualizada!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar comissão do agente:', error);
      toast.error('Erro ao atualizar comissão. Tente novamente.');
    },
  });
};

// Hook para adicionar especialidade ao agente
export const useAddAgentSpecialty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, specialty, userId }: { id: string; specialty: string; userId: string }) =>
      AgentService.addSpecialty(id, specialty, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast.success('Especialidade adicionada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao adicionar especialidade:', error);
      toast.error('Erro ao adicionar especialidade. Tente novamente.');
    },
  });
};

// Hook para remover especialidade do agente
export const useRemoveAgentSpecialty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, specialty, userId }: { id: string; specialty: string; userId: string }) =>
      AgentService.removeSpecialty(id, specialty, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast.success('Especialidade removida com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover especialidade:', error);
      toast.error('Erro ao remover especialidade. Tente novamente.');
    },
  });
};

// Hook para atualizar performance do agente
export const useUpdateAgentPerformance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, performance, userId }: { id: string; performance: Agent['performance']; userId: string }) =>
      AgentService.updatePerformance(id, performance, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agentKeys.topPerformers() });
      toast.success('Performance do agente atualizada!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar performance do agente:', error);
      toast.error('Erro ao atualizar performance. Tente novamente.');
    },
  });
};

// Hook para upload de avatar
export const useUploadAgentAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, agentId }: { file: File; agentId: string }) =>
      AgentService.uploadAvatar(file, agentId),
    onSuccess: (_, { agentId }) => {
      // Invalidar queries do agente específico
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(agentId) });
      toast.success('Avatar enviado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao fazer upload do avatar:', error);
      toast.error('Erro ao enviar avatar. Tente novamente.');
    },
  });
};

// Hook para deletar avatar
export const useDeleteAgentAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageUrl: string) => AgentService.deleteAvatar(imageUrl),
    onSuccess: () => {
      // Invalidar todas as queries de agentes
      queryClient.invalidateQueries({ queryKey: agentKeys.all });
      toast.success('Avatar deletado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar avatar:', error);
      toast.error('Erro ao deletar avatar. Tente novamente.');
    },
  });
}; 