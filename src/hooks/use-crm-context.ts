import { useState, useEffect, useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF, importFromCSV, printData } from '../utils/crm-data-operations';

// Types pour le contexte CRM global
interface CRMContextState {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  activeModules: string[];
  syncDataAcrossCRM: () => void;
  updateModuleData: (moduleName: string, data: any) => void;
  getModuleData: (moduleName: string) => any;
  exportModuleData: (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: any[]) => Promise<boolean>;
  importModuleData: (moduleName: string, file: File) => Promise<boolean>;
  printModuleData: (moduleName: string, options?: any) => Promise<boolean>;
}

// Hook personnalisé pour gérer le contexte global du CRM
export const useCRMContext = (): CRMContextState => {
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [moduleData, setModuleData] = useState<Record<string, any>>({
    propriedades: {
      items: [
        { id: 1, endereco: "Rua das Flores, 123 - Copacabana", tipo: "Apartamento", quartos: 3, valor: 850000, status: "Disponível", agente: "João Silva" },
        { id: 2, endereco: "Av. Atlântica, 456 - Ipanema", tipo: "Cobertura", quartos: 4, valor: 2500000, status: "Vendido", agente: "Maria Santos" },
        { id: 3, endereco: "Rua do Catete, 789 - Catete", tipo: "Casa", quartos: 2, valor: 650000, status: "Reservado", agente: "Pedro Costa" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "endereco", header: "Endereço" },
        { key: "tipo", header: "Tipo" },
        { key: "quartos", header: "Quartos" },
        { key: "valor", header: "Valor (R$)" },
        { key: "status", header: "Status" },
        { key: "agente", header: "Agente" }
      ]
    },
    clientes: {
      items: [
        { id: 1, nome: "Ana Rodrigues", email: "ana@email.com", telefone: "(21) 99999-1111", interesse: "Apartamento 3 quartos", orcamento: 800000, status: "Ativo" },
        { id: 2, nome: "Carlos Mendes", email: "carlos@email.com", telefone: "(21) 99999-2222", interesse: "Casa 2 quartos", orcamento: 600000, status: "Proposta" },
        { id: 3, nome: "Fernanda Lima", email: "fernanda@email.com", telefone: "(21) 99999-3333", interesse: "Cobertura", orcamento: 2000000, status: "Visitou" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "nome", header: "Nome" },
        { key: "email", header: "E-mail" },
        { key: "telefone", header: "Telefone" },
        { key: "interesse", header: "Interesse" },
        { key: "orcamento", header: "Orçamento (R$)" },
        { key: "status", header: "Status" }
      ]
    },
    agentes: {
      items: [
        { id: 1, nome: "João Silva", especialidade: "Apartamentos", vendas: 15, comissao: 45000, meta: 20, desempenho: "75%" },
        { id: 2, nome: "Maria Santos", especialidade: "Imóveis de Luxo", vendas: 8, comissao: 120000, meta: 10, desempenho: "80%" },
        { id: 3, nome: "Pedro Costa", especialidade: "Casas", vendas: 12, comissao: 36000, meta: 15, desempenho: "80%" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "nome", header: "Nome" },
        { key: "especialidade", header: "Especialidade" },
        { key: "vendas", header: "Vendas" },
        { key: "comissao", header: "Comissão (R$)" },
        { key: "meta", header: "Meta" },
        { key: "desempenho", header: "Desempenho" }
      ]
    },
    contratos: {
      items: [
        { id: 1, cliente: "Ana Rodrigues", propriedade: "Rua das Flores, 123", valor: 850000, status: "Assinado", data: "2023-06-15", agente: "João Silva" },
        { id: 2, cliente: "Carlos Mendes", propriedade: "Rua do Catete, 789", valor: 650000, status: "Em análise", data: "2023-07-20", agente: "Pedro Costa" },
        { id: 3, cliente: "Fernanda Lima", propriedade: "Av. Atlântica, 456", valor: 2500000, status: "Finalizado", data: "2023-05-10", agente: "Maria Santos" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "cliente", header: "Cliente" },
        { key: "propriedade", header: "Propriedade" },
        { key: "valor", header: "Valor (R$)" },
        { key: "status", header: "Status" },
        { key: "data", header: "Data" },
        { key: "agente", header: "Agente" }
      ]
    },
    visitas: {
      items: [
        { id: 1, cliente: "Ana Rodrigues", propriedade: "Rua das Flores, 123", data: "2023-08-15", hora: "14:00", agente: "João Silva", status: "Agendada" },
        { id: 2, cliente: "Roberto Alves", propriedade: "Rua do Catete, 789", data: "2023-08-16", hora: "10:30", agente: "Pedro Costa", status: "Realizada" },
        { id: 3, cliente: "Fernanda Lima", propriedade: "Av. Atlântica, 456", data: "2023-08-17", hora: "16:00", agente: "Maria Santos", status: "Cancelada" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "cliente", header: "Cliente" },
        { key: "propriedade", header: "Propriedade" },
        { key: "data", header: "Data" },
        { key: "hora", header: "Hora" },
        { key: "agente", header: "Agente" },
        { key: "status", header: "Status" }
      ]
    }
  });
  const [activeModules, setActiveModules] = useState<string[]>([
    'propriedades',
    'clientes', 
    'agentes',
    'contratos',
    'visitas'
  ]);
  
  // Nome da empresa
  const companyName = 'Imóveis Prime';

  // Synchronisation des données à travers tous les modules du CRM
  const syncDataAcrossCRM = useCallback(() => {
    setIsRefreshing(true);
    
    // Simuler un temps de synchronisation
    setTimeout(() => {
      setLastSync(new Date());
      setIsRefreshing(false);
    }, 1500);
  }, []);

  // Mettre à jour les données d'un module spécifique
  const updateModuleData = useCallback((moduleName: string, data: any) => {
    setModuleData(prevData => ({
      ...prevData,
      [moduleName]: {
        ...prevData[moduleName],
        ...data
      }
    }));
    
    // Mettre à jour la date de dernière synchronisation
    setLastSync(new Date());
  }, []);

  // Récupérer les données d'un module spécifique
  const getModuleData = useCallback((moduleName: string) => {
    return moduleData[moduleName] || {};
  }, [moduleData]);

  // Export module data to specified format
  const exportModuleData = useCallback(async (
    moduleName: string, 
    format: 'csv' | 'excel' | 'pdf',
    customData?: any[]
  ): Promise<boolean> => {
    // Use custom data if provided, otherwise get from module
    const data = customData || getModuleData(moduleName)?.items;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return false;
    }
    
    try {
      let success = false;
      
      // Handle special cases like technical sheets and guides
      if (moduleName === 'fiche_technique') {
        return await exportToPDF(data, `${companyName}_fiche_technique`, {
          title: `${companyName} - Fiche Technique`,
          landscape: false,
          template: 'technical_sheet'
        });
      } else if (moduleName === 'guide_cultures') {
        return true;
      }
      
      // Standard formats
      switch (format) {
        case 'csv':
          success = exportToCSV(data, `${companyName}_${moduleName}`);
          break;
        case 'excel':
          success = exportToExcel(data, `${companyName}_${moduleName}`);
          break;
        case 'pdf':
          success = await exportToPDF(data, `${companyName}_${moduleName}`);
          break;
        default:
          return false;
      }
      
      return success;
    } catch (error) {
      console.error(`Error exporting ${moduleName} data:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  // Import module data
  const importModuleData = useCallback(async (moduleName: string, file: File): Promise<boolean> => {
    try {
      const importedData = await importFromCSV(file);
      
      if (importedData && importedData.length > 0) {
        updateModuleData(moduleName, {
          items: importedData
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error importing ${moduleName} data:`, error);
      return false;
    }
  }, [updateModuleData]);

  // Print module data
  const printModuleData = useCallback(async (moduleName: string, options?: any): Promise<boolean> => {
    const data = getModuleData(moduleName);
    
    if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return false;
    }
    
    const moduleNames: Record<string, string> = {
      propriedades: "Propriedades",
      clientes: "Clientes",
      agentes: "Agentes",
      contratos: "Contratos",
      visitas: "Visitas",
      fiche_technique: "Fiche Technique"
    };
    
    const title = `${companyName} - ${moduleNames[moduleName] || moduleName}`;
    
    try {
      return await printData(
        data.items,
        title,
        data.columns || Object.keys(data.items[0]).map(key => ({ key, header: key })),
        options
      );
    } catch (error) {
      console.error(`Error printing ${moduleName} data:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  // Synchronisation initiale au chargement
  useEffect(() => {
    const initialSync = setTimeout(() => {
      syncDataAcrossCRM();
    }, 1000);
    
    return () => clearTimeout(initialSync);
  }, [syncDataAcrossCRM]);

  return {
    lastSync,
    isRefreshing,
    companyName,
    activeModules,
    syncDataAcrossCRM,
    updateModuleData,
    getModuleData,
    exportModuleData,
    importModuleData,
    printModuleData
  };
};

export default useCRMContext;
