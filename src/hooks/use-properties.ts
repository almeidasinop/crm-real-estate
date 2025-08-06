
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Property } from '@/types/crm';

// Normaliza os dados da propriedade, garantindo consistência
const normalizePropertyData = (docSnap: any) => {
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as Property;
};

// Hook para buscar todas as propriedades
export const useProperties = () => {
    return useQuery<Property[], Error>({
        queryKey: ['properties'],
        queryFn: async () => {
            const propertiesCollection = collection(db, 'properties');
            const propertySnapshot = await getDocs(propertiesCollection);
            const properties = await Promise.all(propertySnapshot.docs.map(async (docSnap) => {
                const propertyData = normalizePropertyData(docSnap);
                if (propertyData.agentId) {
                    const agentDocRef = doc(db, 'agents', propertyData.agentId);
                    const agentSnap = await getDoc(agentDocRef);
                    if (agentSnap.exists()) {
                        propertyData.broker = { id: agentSnap.id, ...agentSnap.data() };
                    }
                }
                return propertyData;
            }));
            return properties;
        },
    });
};

// Hook para buscar uma única propriedade pelo ID
export const useProperty = (id: string) => {
    return useQuery<Property | null, Error>({
        queryKey: ['property', id],
        queryFn: async () => {
            if (!id) return null;
            const propertyDocRef = doc(db, 'properties', id);
            const propertySnap = await getDoc(propertyDocRef);

            if (!propertySnap.exists()) {
                return null;
            }
            
            const propertyData = normalizePropertyData(propertySnap);

            // Se existe um agentId, busca os dados do corretor (agent)
            if (propertyData.agentId) {
                const agentDocRef = doc(db, 'agents', propertyData.agentId);
                const agentSnap = await getDoc(agentDocRef);
                if (agentSnap.exists()) {
                    // Anexa os dados do corretor ao objeto da propriedade
                    propertyData.broker = { id: agentSnap.id, ...agentSnap.data() };
                }
            }
            
            return propertyData;
        },
        enabled: !!id, // A query só será executada se o ID for válido
    });
};


// Hook para criar uma nova propriedade
export const useCreateProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ property, userId }: { property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>, userId: string }) => {
            const newProperty = {
                ...property,
                ownerId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const docRef = await addDoc(collection(db, 'properties'), newProperty);
            return docRef.id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
        },
    });
};

// Hook para atualizar uma propriedade existente
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates, userId }: { id: string, updates: Partial<Property>, userId: string }) => {
      const propertyDocRef = doc(db, 'properties', id);
      const propertyToUpdate = {
        ...updates,
        updatedAt: new Date(),
        // ownerId: userId, // Mantém o proprietário original
      };
      await updateDoc(propertyDocRef, propertyToUpdate);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    },
  });
};

// Hook para deletar uma propriedade
export const useDeleteProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const propertyDocRef = doc(db, 'properties', id);
            await deleteDoc(propertyDocRef);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
        },
    });
};
