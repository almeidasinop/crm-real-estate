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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Agent } from '@/types/crm';

const COLLECTION_NAME = 'agents';

export class AgentService {
  // Buscar todos os agentes
  static async getAll(limitCount = 50): Promise<Agent[]> {
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
      })) as Agent[];
    } catch (error) {
      console.error('Erro ao buscar agentes:', error);
      throw error;
    }
  }

  // Buscar agente por ID
  static async getById(id: string): Promise<Agent | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Agent;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar agente:', error);
      throw error;
    }
  }

  // Criar novo agente
  static async create(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Agent> {
    try {
      const agentData = {
        ...agent,
        createdBy: userId,
        updatedBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), agentData);
      
      return {
        id: docRef.id,
        ...agentData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Agent;
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      throw error;
    }
  }

  // Atualizar agente
  static async update(id: string, updates: Partial<Agent>, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedBy: userId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar agente:', error);
      throw error;
    }
  }

  // Deletar agente
  static async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar agente:', error);
      throw error;
    }
  }

  // Buscar agentes por status
  static async getByStatus(status: Agent['status']): Promise<Agent[]> {
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
      })) as Agent[];
    } catch (error) {
      console.error('Erro ao buscar agentes por status:', error);
      throw error;
    }
  }

  // Buscar agentes por função
  static async getByRole(role: Agent['role']): Promise<Agent[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Agent[];
    } catch (error) {
      console.error('Erro ao buscar agentes por função:', error);
      throw error;
    }
  }

  // Buscar agente por email
  static async getByEmail(email: string): Promise<Agent | null> {
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
        } as Agent;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar agente por email:', error);
      throw error;
    }
  }

  // Buscar agente por documento
  static async getByDocument(document: string): Promise<Agent | null> {
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
        } as Agent;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar agente por documento:', error);
      throw error;
    }
  }

  // Buscar agentes por especialidade
  static async getBySpecialty(specialty: string): Promise<Agent[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('specialties', 'array-contains', specialty),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Agent[];
    } catch (error) {
      console.error('Erro ao buscar agentes por especialidade:', error);
      throw error;
    }
  }

  // Buscar agentes ativos
  static async getActive(): Promise<Agent[]> {
    return this.getByStatus('ativo');
  }

  // Buscar corretores (role = 'corretor')
  static async getCorretores(): Promise<Agent[]> {
    return this.getByRole('corretor');
  }

  // Buscar gerentes
  static async getGerentes(): Promise<Agent[]> {
    return this.getByRole('gerente');
  }

  // Buscar administradores
  static async getAdmins(): Promise<Agent[]> {
    return this.getByRole('admin');
  }

  // Buscar agentes por nome (busca parcial)
  static async searchByName(name: string): Promise<Agent[]> {
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
      })) as Agent[];
    } catch (error) {
      console.error('Erro na busca de agentes por nome:', error);
      throw error;
    }
  }

  // Upload de avatar
  static async uploadAvatar(file: File, agentId: string): Promise<string> {
    try {
      const fileName = `${agentId}/avatar_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `agents/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      throw error;
    }
  }

  // Deletar avatar
  static async deleteAvatar(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Erro ao deletar avatar:', error);
      throw error;
    }
  }

  // Atualizar status do agente
  static async updateStatus(id: string, status: Agent['status'], userId: string): Promise<void> {
    await this.update(id, { status }, userId);
  }

  // Atualizar função do agente
  static async updateRole(id: string, role: Agent['role'], userId: string): Promise<void> {
    await this.update(id, { role }, userId);
  }

  // Atualizar comissão do agente
  static async updateCommission(id: string, commission: number, userId: string): Promise<void> {
    await this.update(id, { commission }, userId);
  }

  // Adicionar especialidade ao agente
  static async addSpecialty(id: string, specialty: string, userId: string): Promise<void> {
    try {
      const agent = await this.getById(id);
      if (agent && !agent.specialties.includes(specialty)) {
        const updatedSpecialties = [...agent.specialties, specialty];
        await this.update(id, { specialties: updatedSpecialties }, userId);
      }
    } catch (error) {
      console.error('Erro ao adicionar especialidade ao agente:', error);
      throw error;
    }
  }

  // Remover especialidade do agente
  static async removeSpecialty(id: string, specialty: string, userId: string): Promise<void> {
    try {
      const agent = await this.getById(id);
      if (agent) {
        const updatedSpecialties = agent.specialties.filter(s => s !== specialty);
        await this.update(id, { specialties: updatedSpecialties }, userId);
      }
    } catch (error) {
      console.error('Erro ao remover especialidade do agente:', error);
      throw error;
    }
  }

  // Atualizar performance do agente
  static async updatePerformance(id: string, performance: Agent['performance'], userId: string): Promise<void> {
    await this.update(id, { performance }, userId);
  }

  // Buscar top performers
  static async getTopPerformers(limitCount = 10): Promise<Agent[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'ativo'),
        orderBy('performance.totalRevenue', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Agent[];
    } catch (error) {
      console.error('Erro ao buscar top performers:', error);
      throw error;
    }
  }

  // Buscar agentes por experiência
  static async getByExperience(minExperience: number): Promise<Agent[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('experience', '>=', minExperience),
        orderBy('experience', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Agent[];
    } catch (error) {
      console.error('Erro ao buscar agentes por experiência:', error);
      throw error;
    }
  }
} 