import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Database, TestTube } from 'lucide-react';
import { toast } from 'sonner';

// Importar Firebase diretamente para teste
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const FirebaseTestComponent = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    config: boolean;
    connection: boolean;
    write: boolean;
    read: boolean;
  } | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Função para testar a configuração do Firebase
  const testFirebaseConfig = async () => {
    setIsTesting(true);
    setTestResults(null);

    try {
      // Testar se as variáveis de ambiente estão configuradas
      const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      };

      // Verificar se todas as variáveis estão definidas
      const missingVars = Object.entries(config)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      if (missingVars.length > 0) {
        throw new Error(`Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
      }

      // Inicializar Firebase
      const app = initializeApp(config);
      const db = getFirestore(app);

      // Testar conexão
      const testCollection = collection(db, 'test');
      
      // Testar escrita
      const testDoc = await addDoc(testCollection, {
        test: true,
        timestamp: serverTimestamp(),
        message: 'Teste de conexão Firebase'
      });

      // Testar leitura
      const querySnapshot = await getDocs(testCollection);
      const docs = querySnapshot.docs.map(doc => doc.data());

      setTestResults({
        config: true,
        connection: true,
        write: true,
        read: docs.length > 0
      });

      toast.success('Teste do Firebase realizado com sucesso!');
      
    } catch (error) {
      console.error('Erro no teste do Firebase:', error);
      setTestResults({
        config: false,
        connection: false,
        write: false,
        read: false
      });
      toast.error(`Erro no teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Função para inicializar dados de exemplo
  const initializeSampleData = async () => {
    setIsInitializing(true);

    try {
      // Configuração do Firebase
      const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      };

      const app = initializeApp(config);
      const db = getFirestore(app);

      // Dados de exemplo para agentes
      const sampleAgents = [
        {
          name: 'Ana Silva',
          email: 'ana.silva@imobiliaria.com',
          phone: '(11) 99999-1111',
          document: '123.456.789-01',
          status: 'ativo',
          role: 'corretor',
          commission: 5.0,
          specialties: ['Apartamentos', 'Casas', 'Luxo'],
          bio: 'Corretora especializada em imóveis de alto padrão com 8 anos de experiência.',
          license: 'CRECI 123456',
          experience: 8,
          performance: {
            totalSales: 45,
            totalRevenue: 25000000,
            averageRating: 4.8,
            completedDeals: 45
          },
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          name: 'Carlos Santos',
          email: 'carlos.santos@imobiliaria.com',
          phone: '(11) 99999-2222',
          document: '234.567.890-12',
          status: 'ativo',
          role: 'corretor',
          commission: 4.5,
          specialties: ['Comercial', 'Terrenos'],
          bio: 'Especialista em imóveis comerciais e terrenos para investimento.',
          license: 'CRECI 234567',
          experience: 12,
          performance: {
            totalSales: 32,
            totalRevenue: 18000000,
            averageRating: 4.6,
            completedDeals: 32
          },
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      ];

      // Dados de exemplo para clientes
      const sampleClients = [
        {
          name: 'Roberto Alves',
          email: 'roberto.alves@email.com',
          phone: '(11) 88888-1111',
          document: '456.789.012-34',
          type: 'pessoa_fisica',
          status: 'ativo',
          source: 'site',
          budget: {
            min: 800000,
            max: 1500000
          },
          preferences: {
            propertyTypes: ['apartamento', 'casa'],
            neighborhoods: ['Vila Madalena', 'Pinheiros', 'Itaim Bibi'],
            bedrooms: 3,
            bathrooms: 2,
            parkingSpaces: 2
          },
          notes: 'Cliente interessado em imóveis com 3 quartos na zona oeste',
          assignedAgentId: '', // Será preenchido após criar agentes
          tags: ['alto_padrao', 'zona_oeste'],
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          name: 'Patricia Lima',
          email: 'patricia.lima@email.com',
          phone: '(11) 88888-2222',
          document: '567.890.123-45',
          type: 'pessoa_fisica',
          status: 'prospecto',
          source: 'facebook',
          budget: {
            min: 500000,
            max: 800000
          },
          preferences: {
            propertyTypes: ['apartamento'],
            neighborhoods: ['Tatuapé', 'Vila Prudente', 'Mooca'],
            bedrooms: 2,
            bathrooms: 1,
            parkingSpaces: 1
          },
          notes: 'Prospecto para primeiro imóvel, zona leste',
          assignedAgentId: '', // Será preenchido após criar agentes
          tags: ['primeiro_imovel', 'zona_leste'],
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      ];

      // Dados de exemplo para propriedades
      const sampleProperties = [
        {
          title: 'Apartamento Moderno - Vila Madalena',
          description: 'Apartamento recém-reformado com acabamento de alto padrão, localizado em uma das regiões mais desejadas de São Paulo.',
          type: 'apartamento',
          status: 'disponivel',
          price: 1200000,
          area: 95,
          bedrooms: 3,
          bathrooms: 2,
          parkingSpaces: 2,
          address: {
            street: 'Rua Harmonia',
            number: '123',
            neighborhood: 'Vila Madalena',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '05435-000'
          },
          features: ['Academia', 'Piscina', 'Portaria 24h', 'Salão de festas', 'Churrasqueira'],
          images: [],
          documents: [],
          agentId: '', // Será preenchido após criar agentes
          owner: {
            name: 'João Silva',
            email: 'joao.silva@email.com',
            phone: '(11) 77777-1111',
            document: '123.456.789-00'
          },
          highlights: ['Vista para o parque', 'Móveis planejados', 'Cozinha americana'],
          energyRating: 'A',
          condominiumFee: 1200,
          iptu: 800,
          tags: ['alto_padrao', 'reformado', 'vila_madalena'],
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          title: 'Casa com Jardim - Pinheiros',
          description: 'Casa charmosa com jardim privativo, ideal para família que busca tranquilidade sem abrir mão da localização.',
          type: 'casa',
          status: 'disponivel',
          price: 2800000,
          area: 180,
          bedrooms: 4,
          bathrooms: 3,
          parkingSpaces: 3,
          address: {
            street: 'Rua Teodoro Sampaio',
            number: '456',
            neighborhood: 'Pinheiros',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '05406-000'
          },
          features: ['Jardim', 'Churrasqueira', 'Lavanderia', 'Quarto de serviço'],
          images: [],
          documents: [],
          agentId: '', // Será preenchido após criar agentes
          owner: {
            name: 'Maria Santos',
            email: 'maria.santos@email.com',
            phone: '(11) 77777-2222',
            document: '234.567.890-11'
          },
          highlights: ['Jardim privativo', 'Casa geminada', 'Localização privilegiada'],
          iptu: 1500,
          tags: ['casa', 'jardim', 'pinheiros'],
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      ];

      console.log('🚀 Iniciando criação de dados de exemplo...');

      // Criar agentes
      console.log('📝 Criando agentes...');
      const agentIds = [];
      for (const agent of sampleAgents) {
        const docRef = await addDoc(collection(db, 'agents'), agent);
        agentIds.push(docRef.id);
        console.log(`✅ Agente criado: ${agent.name} (ID: ${docRef.id})`);
      }

      // Atualizar clientes com agentes atribuídos
      console.log('👥 Criando clientes...');
      const clientIds = [];
      for (let i = 0; i < sampleClients.length; i++) {
        const client = {
          ...sampleClients[i],
          assignedAgentId: agentIds[i % agentIds.length]
        };
        const docRef = await addDoc(collection(db, 'clients'), client);
        clientIds.push(docRef.id);
        console.log(`✅ Cliente criado: ${client.name} (ID: ${docRef.id})`);
      }

      // Criar propriedades com agentes atribuídos
      console.log('🏠 Criando propriedades...');
      for (let i = 0; i < sampleProperties.length; i++) {
        const property = {
          ...sampleProperties[i],
          agentId: agentIds[i % agentIds.length]
        };
        const docRef = await addDoc(collection(db, 'properties'), property);
        console.log(`✅ Propriedade criada: ${property.title} (ID: ${docRef.id})`);
      }

      console.log('🎉 Dados de exemplo criados com sucesso!');
      toast.success('Dados de exemplo criados com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao criar dados de exemplo:', error);
      toast.error(`Erro ao criar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Teste do Firebase
          </CardTitle>
          <CardDescription>
            Teste a configuração do Firebase e inicialize dados de exemplo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status das variáveis de ambiente */}
          <div className="space-y-2">
            <h4 className="font-medium">Variáveis de Ambiente:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={import.meta.env.VITE_FIREBASE_API_KEY ? "default" : "destructive"}>
                  {import.meta.env.VITE_FIREBASE_API_KEY ? "✅" : "❌"}
                </Badge>
                <span>API Key</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={import.meta.env.VITE_FIREBASE_PROJECT_ID ? "default" : "destructive"}>
                  {import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✅" : "❌"}
                </Badge>
                <span>Project ID</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "default" : "destructive"}>
                  {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "✅" : "❌"}
                </Badge>
                <span>Auth Domain</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? "default" : "destructive"}>
                  {import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? "✅" : "❌"}
                </Badge>
                <span>Storage Bucket</span>
              </div>
            </div>
          </div>

          {/* Resultados do teste */}
          {testResults && (
            <div className="space-y-2">
              <h4 className="font-medium">Resultados do Teste:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {testResults.config ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span>Configuração</span>
                </div>
                <div className="flex items-center gap-2">
                  {testResults.connection ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span>Conexão</span>
                </div>
                <div className="flex items-center gap-2">
                  {testResults.write ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span>Escrita</span>
                </div>
                <div className="flex items-center gap-2">
                  {testResults.read ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span>Leitura</span>
                </div>
              </div>
            </div>
          )}

          {/* Alertas */}
          {!import.meta.env.VITE_FIREBASE_API_KEY && (
            <Alert>
              <AlertDescription>
                <strong>Erro:</strong> Variáveis de ambiente do Firebase não configuradas. 
                Crie um arquivo <code>.env.local</code> na raiz do projeto com suas credenciais do Firebase.
              </AlertDescription>
            </Alert>
          )}

          {/* Botões */}
          <div className="flex gap-4">
            <Button 
              onClick={testFirebaseConfig} 
              disabled={isTesting || !import.meta.env.VITE_FIREBASE_API_KEY}
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4" />
                  Testar Firebase
                </>
              )}
            </Button>

            <Button 
              onClick={initializeSampleData} 
              disabled={isInitializing || !import.meta.env.VITE_FIREBASE_API_KEY}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando dados...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Criar Dados de Exemplo
                </>
              )}
            </Button>
          </div>

          {/* Instruções */}
          <div className="text-sm text-muted-foreground">
            <p><strong>Como configurar:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Crie um projeto no <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Firebase Console</a></li>
              <li>Habilite Firestore Database, Authentication e Storage</li>
              <li>Adicione um aplicativo Web e copie as credenciais</li>
              <li>Crie um arquivo <code>.env.local</code> na raiz do projeto</li>
              <li>Cole as credenciais no formato mostrado no arquivo <code>env.example</code></li>
              <li>Reinicie o servidor de desenvolvimento</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseTestComponent; 