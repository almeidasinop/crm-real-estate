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
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Property } from '@/types/crm';

const COLLECTION_NAME = 'properties';

export class PropertyService {
  // Buscar todas as propriedades
  static async getAll(limitCount = 50): Promise<Property[]> {
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
      })) as Property[];
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      throw error;
    }
  }

  // Buscar propriedade por ID
  static async getById(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Property;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar propriedade:', error);
      throw error;
    }
  }

  // Criar nova propriedade
  static async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Property> {
    try {
      const propertyData = {
        ...property,
        createdBy: userId,
        updatedBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), propertyData);
      
      return {
        id: docRef.id,
        ...propertyData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Property;
    } catch (error) {
      console.error('Erro ao criar propriedade:', error);
      throw error;
    }
  }

  // Atualizar propriedade
  static async update(id: string, updates: Partial<Property>, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedBy: userId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar propriedade:', error);
      throw error;
    }
  }

  // Deletar propriedade
  static async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error);
      throw error;
    }
  }

  // Buscar propriedades por status
  static async getByStatus(status: Property['status']): Promise<Property[]> {
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
      })) as Property[];
    } catch (error) {
      console.error('Erro ao buscar propriedades por status:', error);
      throw error;
    }
  }

  // Buscar propriedades por tipo
  static async getByType(type: Property['type']): Promise<Property[]> {
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
      })) as Property[];
    } catch (error) {
      console.error('Erro ao buscar propriedades por tipo:', error);
      throw error;
    }
  }

  // Buscar propriedades por corretor
  static async getByAgent(agentId: string): Promise<Property[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('agentId', '==', agentId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Property[];
    } catch (error) {
      console.error('Erro ao buscar propriedades por corretor:', error);
      throw error;
    }
  }

  // Buscar propriedades por faixa de preço
  static async getByPriceRange(minPrice: number, maxPrice: number): Promise<Property[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('price', '>=', minPrice),
        where('price', '<=', maxPrice),
        orderBy('price', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Property[];
    } catch (error) {
      console.error('Erro ao buscar propriedades por faixa de preço:', error);
      throw error;
    }
  }

  // Buscar propriedades por bairro
  static async getByNeighborhood(neighborhood: string): Promise<Property[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('address.neighborhood', '==', neighborhood),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Property[];
    } catch (error) {
      console.error('Erro ao buscar propriedades por bairro:', error);
      throw error;
    }
  }

  // Upload de imagem
  static async uploadImage(file: File, propertyId: string): Promise<string> {
    try {
      const fileName = `${propertyId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `properties/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  // Deletar imagem
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw error;
    }
  }

  // Buscar propriedades em destaque
  static async getFeatured(): Promise<Property[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'disponivel'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Property[];
    } catch (error) {
      console.error('Erro ao buscar propriedades em destaque:', error);
      throw error;
    }
  }

  // Paginação
  static async getPaginated(
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    pageSize = 10
  ): Promise<{ properties: Property[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      let q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(
          collection(db, COLLECTION_NAME),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Property[];

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { properties, lastDoc: lastVisible };
    } catch (error) {
      console.error('Erro na paginação de propriedades:', error);
      throw error;
    }
  }

  // Busca por texto
  static async searchByText(searchTerm: string): Promise<Property[]> {
    try {
      // Nota: Firestore não suporta busca por texto nativa
      // Esta é uma implementação básica que busca por título
      // Para busca mais avançada, considere usar Algolia ou similar
      const q = query(
        collection(db, COLLECTION_NAME),
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff'),
        orderBy('title'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Property[];
    } catch (error) {
      console.error('Erro na busca de propriedades:', error);
      throw error;
    }
  }
} 