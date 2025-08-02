# Configuração do Firebase para CRM Imobiliário

Este documento explica como configurar e usar o Firebase no projeto CRM Imobiliário.

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [Serviços Implementados](#serviços-implementados)
4. [Hooks React Query](#hooks-react-query)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Regras de Segurança](#regras-de-segurança)
7. [Deploy e Produção](#deploy-e-produção)

## 🚀 Configuração Inicial

### 1. Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: "crm-imobiliario")
4. Siga os passos de configuração

### 2. Habilitar Serviços

No Firebase Console, habilite os seguintes serviços:

- **Firestore Database** - Banco de dados NoSQL
- **Authentication** - Autenticação de usuários
- **Storage** - Armazenamento de arquivos

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Obter Credenciais

1. No Firebase Console, vá em "Configurações do projeto"
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique em "Adicionar aplicativo" e escolha "Web"
4. Copie as credenciais para o arquivo `.env.local`

## 🗄️ Estrutura do Banco de Dados

### Coleções do Firestore

```
firestore/
├── properties/          # Propriedades/Imóveis
├── clients/            # Clientes
├── agents/             # Corretores/Agentes
├── leads/              # Leads
├── visits/             # Visitas
├── contracts/          # Contratos
├── activities/         # Atividades
├── financial_records/  # Registros Financeiros
├── commissions/        # Comissões
├── reports/            # Relatórios
├── notifications/      # Notificações
└── company_settings/   # Configurações da Empresa
```

### Estrutura de Documentos

Cada documento segue o padrão:

```typescript
interface BaseEntity {
  id: string; // ID único do documento
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
  createdBy: string; // ID do usuário que criou
  updatedBy: string; // ID do usuário que atualizou
}
```

## 🔧 Serviços Implementados

### PropertyService

```typescript
// Buscar todas as propriedades
const properties = await PropertyService.getAll();

// Buscar propriedade por ID
const property = await PropertyService.getById("property-id");

// Criar nova propriedade
const newProperty = await PropertyService.create(propertyData, userId);

// Atualizar propriedade
await PropertyService.update("property-id", updates, userId);

// Deletar propriedade
await PropertyService.delete("property-id");

// Buscar por filtros
const availableProperties = await PropertyService.getByStatus("disponivel");
const apartments = await PropertyService.getByType("apartamento");
const agentProperties = await PropertyService.getByAgent("agent-id");
```

### ClientService

```typescript
// Buscar todos os clientes
const clients = await ClientService.getAll();

// Buscar cliente por ID
const client = await ClientService.getById("client-id");

// Criar novo cliente
const newClient = await ClientService.create(clientData, userId);

// Buscar por filtros
const activeClients = await ClientService.getActive();
const prospects = await ClientService.getProspects();
const agentClients = await ClientService.getByAgent("agent-id");
```

### AgentService

```typescript
// Buscar todos os agentes
const agents = await AgentService.getAll();

// Buscar agente por ID
const agent = await AgentService.getById("agent-id");

// Criar novo agente
const newAgent = await AgentService.create(agentData, userId);

// Buscar por filtros
const activeAgents = await AgentService.getActive();
const corretores = await AgentService.getCorretores();
const topPerformers = await AgentService.getTopPerformers();
```

## 🎣 Hooks React Query

### Hooks de Propriedades

```typescript
import {
  useProperties,
  useProperty,
  usePropertiesByStatus,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
} from "@/hooks";

// Buscar todas as propriedades
const { data: properties, isLoading, error } = useProperties();

// Buscar propriedade específica
const { data: property } = useProperty("property-id");

// Buscar por status
const { data: availableProperties } = usePropertiesByStatus("disponivel");

// Mutations
const createProperty = useCreateProperty();
const updateProperty = useUpdateProperty();
const deleteProperty = useDeleteProperty();

// Usar mutations
createProperty.mutate({ property: propertyData, userId: "user-id" });
updateProperty.mutate({
  id: "property-id",
  updates: { status: "vendido" },
  userId: "user-id",
});
deleteProperty.mutate("property-id");
```

### Hooks de Clientes

```typescript
import {
  useClients,
  useClient,
  useActiveClients,
  useCreateClient,
  useUpdateClient,
} from "@/hooks";

// Buscar todos os clientes
const { data: clients } = useClients();

// Buscar clientes ativos
const { data: activeClients } = useActiveClients();

// Buscar cliente específico
const { data: client } = useClient("client-id");
```

### Hooks de Agentes

```typescript
import {
  useAgents,
  useAgent,
  useCorretores,
  useTopPerformers,
  useCreateAgent,
} from "@/hooks";

// Buscar todos os agentes
const { data: agents } = useAgents();

// Buscar corretores
const { data: corretores } = useCorretores();

// Buscar top performers
const { data: topPerformers } = useTopPerformers();
```

## 📝 Exemplos de Uso

### Exemplo 1: Lista de Propriedades

```typescript
import React from "react";
import { useProperties, useCreateProperty } from "@/hooks";

const PropertyList = () => {
  const { data: properties, isLoading, error } = useProperties();
  const createProperty = useCreateProperty();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {properties?.map((property) => (
        <div key={property.id}>
          <h3>{property.title}</h3>
          <p>R$ {property.price.toLocaleString()}</p>
          <p>
            {property.address.neighborhood}, {property.address.city}
          </p>
        </div>
      ))}
    </div>
  );
};
```

### Exemplo 2: Formulário de Criação

```typescript
import React from "react";
import { useCreateProperty } from "@/hooks";
import { Property } from "@/types/crm";

const CreatePropertyForm = () => {
  const createProperty = useCreateProperty();

  const handleSubmit = (
    formData: Omit<Property, "id" | "createdAt" | "updatedAt">
  ) => {
    createProperty.mutate({
      property: formData,
      userId: "current-user-id",
    });
  };

  return <form onSubmit={handleSubmit}>{/* Campos do formulário */}</form>;
};
```

### Exemplo 3: Dashboard com Dados

```typescript
import React from "react";
import { useProperties, useClients, useAgents } from "@/hooks";

const Dashboard = () => {
  const { data: properties } = useProperties();
  const { data: clients } = useClients();
  const { data: agents } = useAgents();

  const availableProperties =
    properties?.filter((p) => p.status === "disponivel").length || 0;
  const activeClients =
    clients?.filter((c) => c.status === "ativo").length || 0;
  const activeAgents = agents?.filter((a) => a.status === "ativo").length || 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card">
        <h3>Propriedades Disponíveis</h3>
        <p className="text-2xl font-bold">{availableProperties}</p>
      </div>
      <div className="card">
        <h3>Clientes Ativos</h3>
        <p className="text-2xl font-bold">{activeClients}</p>
      </div>
      <div className="card">
        <h3>Agentes Ativos</h3>
        <p className="text-2xl font-bold">{activeAgents}</p>
      </div>
    </div>
  );
};
```

## 🔒 Regras de Segurança

### Regras do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função para verificar se o usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }

    // Função para verificar se o usuário é o dono do documento
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Regras para propriedades
    match /properties/{propertyId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() &&
        (isOwner(resource.data.createdBy) || isOwner(resource.data.agentId));
      allow delete: if isAuthenticated() && isOwner(resource.data.createdBy);
    }

    // Regras para clientes
    match /clients/{clientId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() &&
        (isOwner(resource.data.createdBy) || isOwner(resource.data.assignedAgentId));
      allow delete: if isAuthenticated() && isOwner(resource.data.createdBy);
    }

    // Regras para agentes
    match /agents/{agentId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && isOwner(agentId);
      allow delete: if isAuthenticated() && isOwner(agentId);
    }
  }
}
```

### Regras do Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Função para verificar se o usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }

    // Regras para imagens de propriedades
    match /properties/{propertyId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    // Regras para avatares de agentes
    match /agents/{agentId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == agentId;
    }
  }
}
```

## 🚀 Deploy e Produção

### 1. Configurar Produção

1. No Firebase Console, vá em "Configurações do projeto"
2. Na aba "Geral", adicione um novo aplicativo para produção
3. Configure as variáveis de ambiente de produção

### 2. Deploy do Projeto

```bash
# Build do projeto
npm run build

# Deploy para Firebase Hosting
firebase deploy
```

### 3. Configurar Domínio Personalizado

1. No Firebase Console, vá em "Hosting"
2. Clique em "Adicionar domínio personalizado"
3. Siga as instruções para configurar DNS

### 4. Monitoramento

- Use Firebase Analytics para monitorar uso
- Configure alertas no Firebase Console
- Monitore logs no Firebase Functions (se usar)

## 📚 Recursos Adicionais

- [Documentação oficial do Firebase](https://firebase.google.com/docs)
- [Firestore Querying](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [React Query + Firebase](https://tanstack.com/query/latest/docs/react/guides/important-defaults)

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação oficial do Firebase
2. Consulte os logs no Firebase Console
3. Verifique as regras de segurança
4. Teste as queries no Firebase Console

---

**Nota**: Este documento será atualizado conforme novas funcionalidades forem implementadas.
