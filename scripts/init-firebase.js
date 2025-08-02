#!/usr/bin/env node

/**
 * Script para inicializar o Firebase com dados de exemplo
 * 
 * Uso: node scripts/init-firebase.js
 * 
 * Este script cria dados de exemplo para testar o CRM imobiliário
 */

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Configuração do Firebase (substitua pelas suas credenciais)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
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
  },
  {
    name: 'Maria Costa',
    email: 'maria.costa@imobiliaria.com',
    phone: '(11) 99999-3333',
    document: '345.678.901-23',
    status: 'ativo',
    role: 'gerente',
    commission: 6.0,
    specialties: ['Gestão', 'Vendas'],
    bio: 'Gerente de vendas com foco em resultados e desenvolvimento de equipe.',
    license: 'CRECI 345678',
    experience: 15,
    performance: {
      totalSales: 78,
      totalRevenue: 45000000,
      averageRating: 4.9,
      completedDeals: 78
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
  },
  {
    name: 'Fernando Costa',
    email: 'fernando.costa@empresa.com',
    phone: '(11) 88888-3333',
    document: '12.345.678/0001-90',
    type: 'pessoa_juridica',
    status: 'ativo',
    source: 'indicacao',
    budget: {
      min: 2000000,
      max: 5000000
    },
    preferences: {
      propertyTypes: ['comercial'],
      neighborhoods: ['Centro', 'Vila Olímpia', 'Itaim Bibi'],
      bedrooms: 0,
      bathrooms: 2,
      parkingSpaces: 5
    },
    notes: 'Empresa buscando espaço comercial para expansão',
    assignedAgentId: '', // Será preenchido após criar agentes
    tags: ['comercial', 'empresa'],
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
  },
  {
    title: 'Sala Comercial - Vila Olímpia',
    description: 'Sala comercial em prédio corporativo, ideal para empresas que buscam localização estratégica e infraestrutura completa.',
    type: 'comercial',
    status: 'disponivel',
    price: 3500000,
    area: 120,
    bedrooms: 0,
    bathrooms: 2,
    parkingSpaces: 4,
    address: {
      street: 'Rua Funchal',
      number: '789',
      neighborhood: 'Vila Olímpia',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04551-060'
    },
    features: ['Recepção', 'Ar condicionado', 'Internet', 'Segurança 24h'],
    images: [],
    documents: [],
    agentId: '', // Será preenchido após criar agentes
    owner: {
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      phone: '(11) 77777-3333',
      document: '12.345.678/0001-01'
    },
    highlights: ['Localização corporativa', 'Infraestrutura completa', 'Fácil acesso'],
    iptu: 2000,
    tags: ['comercial', 'vila_olimpia', 'corporativo'],
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

// Função para criar dados de exemplo
async function createSampleData() {
  try {
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
    console.log(`📊 Resumo:`);
    console.log(`   - ${agentIds.length} agentes criados`);
    console.log(`   - ${clientIds.length} clientes criados`);
    console.log(`   - ${sampleProperties.length} propriedades criadas`);

  } catch (error) {
    console.error('❌ Erro ao criar dados de exemplo:', error);
    process.exit(1);
  }
}

// Executar script
if (require.main === module) {
  createSampleData();
}

module.exports = { createSampleData }; 