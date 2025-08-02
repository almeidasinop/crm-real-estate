import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client } from '@/types/crm';

const COLLECTION_NAME = 'clients';

export class ClientService {
  // Buscar todos os clientes
  static async getAll(limitCount = 50): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Client[];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  // Buscar cliente por ID
  static async getById(id: string): Promise<Client | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Client;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  // Criar novo cliente
  static async create(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Client> {
    try {
      const clientData = {
        ...client,
        createdBy: userId,
        updatedBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), clientData);
      
      return {
        id: docRef.id,
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Client;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  // Atualizar cliente
  static async update(id: string, updates: Partial<Client>, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedBy: userId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  // Deletar cliente
  static async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }

  // Buscar clientes por status
  static async getByStatus(status: Client['status']): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Client[];
    } catch (error) {
      console.error('Erro ao buscar clientes por status:', error);
      throw error;
    }
  }

  // Buscar clientes por tipo
  static async getByType(type: Client['type']): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Client[];
    } catch (error) {
      console.error('Erro ao buscar clientes por tipo:', error);
      throw error;
    }
  }

  // Buscar clientes por corretor
  static async getByAgent(agentId: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('assignedAgentId', '==', agentId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Client[];
    } catch (error) {
      console.error('Erro ao buscar clientes por corretor:', error);
      throw error;
    }
  }

  // Buscar clientes por fonte
  static async getBySource(source: Client['source']): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('source', '==', source),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Client[];
    } catch (error) {
      console.error('Erro ao buscar clientes por fonte:', error);
      throw error;
    }
  }

  // Buscar clientes por faixa de orçamento
  static async getByBudgetRange(minBudget: number, maxBudget: number): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('budget.max', '>=', minBudget),
        where('budget.min', '<=', maxBudget),
        orderBy('budget.max', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Client[];
    } catch (error) {
      console.error('Erro ao buscar clientes por faixa de orçamento:', error);
      throw error;
    }
  }

  // Buscar cliente por email
  static async getByEmail(email: string): Promise<Client | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('email', '==', email),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Client;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente por email:', error);
      throw error;
    }
  }

  // Buscar cliente por documento (CPF/CNPJ)
  static async getByDocument(document: string): Promise<Client | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('document', '==', document),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Client;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente por documento:', error);
      throw error;
    }
  }

  // Buscar clientes por tag
  static async getByTag(tag: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('tags', 'array-contains', tag),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Client[];
    } catch (error) {
      console.error('Erro ao buscar clientes por tag:', error);
      throw error;
    }
  }

  // Buscar clientes ativos
  static async getActive(): Promise<Client[]> {
    return this.getByStatus('ativo');
  }

  // Buscar prospects
  static async getProspects(): Promise<Client[]> {
    return this.getByStatus('prospecto');
  }

  // Buscar clientes por nome (busca parcial)
  static async searchByName(name: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('name', '>=', name),
        where('name', '<=', name + '\uf8ff'),
        orderBy('name'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Client[];
    } catch (error) {
      console.error('Erro na busca de clientes por nome:', error);
      throw error;
    }
  }

  // Atualizar status do cliente
  static async updateStatus(id: string, status: Client['status'], userId: string): Promise<void> {
    await this.update(id, { status }, userId);
  }

  // Atualizar corretor responsável
  static async updateAssignedAgent(id: string, agentId: string, userId: string): Promise<void> {
    await this.update(id, { assignedAgentId: agentId }, userId);
  }

  // Adicionar tag ao cliente
  static async addTag(id: string, tag: string, userId: string): Promise<void> {
    try {
      const client = await this.getById(id);
      if (client && !client.tags.includes(tag)) {
        const updatedTags = [...client.tags, tag];
        await this.update(id, { tags: updatedTags }, userId);
      }
    } catch (error) {
      console.error('Erro ao adicionar tag ao cliente:', error);
      throw error;
    }
  }

  // Remover tag do cliente
  static async removeTag(id: string, tag: string, userId: string): Promise<void> {
    try {
      const client = await this.getById(id);
      if (client) {
        const updatedTags = client.tags.filter(t => t !== tag);
        await this.update(id, { tags: updatedTags }, userId);
      }
    } catch (error) {
      console.error('Erro ao remover tag do cliente:', error);
      throw error;
    }
  }
} 