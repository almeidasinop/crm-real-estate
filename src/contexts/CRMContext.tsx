
import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Verifique se o caminho está correto

// Interfaces para os dados
interface Client {
  id: string;
  // Adicione outras propriedades do cliente aqui
  [key: string]: any;
}

interface Property {
  id: string;
  // Adicione outras propriedades do imóvel aqui
  [key: string]: any;
}

// Interface para o contexto
interface CRMContextType {
  clients: Client[];
  properties: Property[];
  tasks: any[]; // Garante que tasks seja sempre um array
  alerts: any[]; // Garante que alerts seja sempre um array
  loading: boolean;
  error: Error | null;
}

// Criando o contexto com valores padrão
const CRMContext = createContext<CRMContextType>({
  clients: [],
  properties: [],
  tasks: [], // Inicia como array vazio
  alerts: [], // Inicia como array vazio
  loading: true,
  error: null,
});

// Hook para usar o contexto
export const useCRM = () => useContext(CRMContext);

// Provedor do contexto
export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tasks, setTasks] = useState<any[]>([]); // Inicia como array vazio
  const [alerts, setAlerts] = useState<any[]>([]); // Inicia como array vazio
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Exemplo de como buscar os dados (ajuste para suas coleções)
        const clientsCollection = collection(db, 'clients');
        const propertiesCollection = collection(db, 'properties'); // ou 'propriedades'

        const clientsSnapshot = await getDocs(clientsCollection);
        const propertiesSnapshot = await getDocs(propertiesCollection);

        setClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setProperties(propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        // Simulação de tasks e alerts - substitua pela sua lógica de busca
        setTasks([
            { id: 1, text: 'Follow up com cliente X', completed: false },
            { id: 2, text: 'Preparar contrato para imóvel Y', completed: true },
        ]);
        setAlerts([
            { id: 1, message: 'CRECI de João Silva vence em 15 dias.' },
        ]);

      } catch (err: any) {
        setError(err);
        console.error("Erro ao buscar dados do CRM:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Exemplo de listener em tempo real (opcional)
    const unsubscribe = onSnapshot(collection(db, 'clients'), (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const value = {
    clients,
    properties,
    tasks,
    alerts,
    loading,
    error,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
};
