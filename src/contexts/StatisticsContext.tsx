
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types pour les différentes données statistiques
export interface YieldData {
  name: string;
  current: number;
  previous: number;
  unit: string;
}

export interface FinancialData {
  name: string;
  profitability: number;
  size: number;
  crop: string;
}

export interface CostData {
  name: string;
  value: number;
  color: string;
}

export interface EnvironmentalData {
  indicator: string;
  current: number;
  target: number;
  trend: string;
  status: 'Atingido' | 'Em progresso' | 'Atrasado';
}

interface StatisticsContextType {
  // Données de rendement
  yieldData: YieldData[];
  setYieldData: React.Dispatch<React.SetStateAction<YieldData[]>>;
  
  // Données financières
  financialData: {
    profitabilityByParcel: FinancialData[];
    costAnalysis: CostData[];
    revenueByMonth: any[];
  };
  setFinancialData: React.Dispatch<React.SetStateAction<{
    profitabilityByParcel: FinancialData[];
    costAnalysis: CostData[];
    revenueByMonth: any[];
  }>>;
  
  // Données environnementales
  environmentalData: {
    indicators: EnvironmentalData[];
    carbonFootprint: number;
    waterUsage: number;
    biodiversity: number;
  };
  setEnvironmentalData: React.Dispatch<React.SetStateAction<{
    indicators: EnvironmentalData[];
    carbonFootprint: number;
    waterUsage: number;
    biodiversity: number;
  }>>;
  
  // Données de prévision
  forecastData: any[];
  setForecastData: React.Dispatch<React.SetStateAction<any[]>>;
  
  // Période et filtres
  period: 'day' | 'week' | 'month' | 'year';
  setPeriod: React.Dispatch<React.SetStateAction<'day' | 'week' | 'month' | 'year'>>;
  cropFilter: string;
  setCropFilter: React.Dispatch<React.SetStateAction<string>>;
  
  // Fonction pour mettre à jour les données en fonction des filtres
  updateDataWithFilters: (period: string, crop: string) => void;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
};

// Données initiales
const initialYieldData: YieldData[] = [
  { name: 'Cana-de-açúcar', current: 85, previous: 75, unit: 't/m²' },
  { name: 'Banana', current: 32, previous: 30, unit: 't/m²' },
  { name: 'Abacaxi', current: 45, previous: 48, unit: 't/m²' },
  { name: 'Inhame', current: 18, previous: 15, unit: 't/m²' },
  { name: 'Mandioca', current: 22, previous: 20, unit: 't/m²' }
];

const initialProfitabilityData: FinancialData[] = [
  { name: 'Área Norte', profitability: 6250, size: 12500, crop: 'Cana-de-açúcar' },
  { name: 'Área Leste', profitability: 4900, size: 8300, crop: 'Banana' },
  { name: 'Área Sul', profitability: 7900, size: 15700, crop: 'Abacaxi' },
  { name: 'Área Oeste', profitability: 4250, size: 10200, crop: 'Inhame' },
  { name: 'Área Central', profitability: 4600, size: 6800, crop: 'Mandioca' }
];

const initialCostData: CostData[] = [
  { name: 'Sementes', value: 9000, color: '#4CAF50' },
  { name: 'Fertilizantes', value: 11000, color: '#8D6E63' },
  { name: 'Defensivos', value: 7500, color: '#FFC107' },
  { name: 'Combustível', value: 6000, color: '#2196F3' },
  { name: 'Mão de obra', value: 17500, color: '#673AB7' },
  { name: 'Mecanização', value: 14000, color: '#E91E63' },
  { name: 'Diversos', value: 4500, color: '#9E9E9E' }
];

const initialRevenueData = [
  { month: 'Jan', revenue: 142500, expenses: 100500, profit: 42000 },
  { month: 'Fev', revenue: 151000, expenses: 109000, profit: 42000 },
  { month: 'Mar', revenue: 164000, expenses: 112000, profit: 52000 },
  { month: 'Abr', revenue: 177500, expenses: 115500, profit: 62000 },
  { month: 'Mai', revenue: 191000, expenses: 117500, profit: 73500 },
  { month: 'Jun', revenue: 189000, expenses: 114500, profit: 74500 },
  { month: 'Jul', revenue: 212500, expenses: 121000, profit: 91500 },
  { month: 'Ago', revenue: 224000, expenses: 126500, profit: 97500 },
  { month: 'Set', revenue: 201000, expenses: 124000, profit: 77000 },
  { month: 'Out', revenue: 191000, expenses: 115500, profit: 75500 },
  { month: 'Nov', revenue: 182500, expenses: 112500, profit: 70000 },
  { month: 'Dez', revenue: 206000, expenses: 129000, profit: 77000 }
];

const initialEnvironmentalIndicators: EnvironmentalData[] = [
  { indicator: 'Emissões CO2 (t/m²)', current: 2.8, target: 2.5, trend: '-5%', status: 'Em progresso' },
  { indicator: 'Consumo de água (m³/m²)', current: 350, target: 320, trend: '-8%', status: 'Atingido' },
  { indicator: 'Uso de insumos (kg/m²)', current: 180, target: 150, trend: '-12%', status: 'Em progresso' },
  { indicator: 'Área em agricultura orgânica (%)', current: 15, target: 25, trend: '+5%', status: 'Em progresso' },
  { indicator: 'Biodiversidade (espécies/m²)', current: 12, target: 15, trend: '+12%', status: 'Atingido' }
];

export const StatisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [yieldData, setYieldData] = useState<YieldData[]>(initialYieldData);
  const [financialData, setFinancialData] = useState({
    profitabilityByParcel: initialProfitabilityData,
    costAnalysis: initialCostData,
    revenueByMonth: initialRevenueData
  });
  const [environmentalData, setEnvironmentalData] = useState({
    indicators: initialEnvironmentalIndicators,
    carbonFootprint: -15,
    waterUsage: -8,
    biodiversity: 12
  });
  const [forecastData, setForecastData] = useState(initialRevenueData);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('year');
  const [cropFilter, setCropFilter] = useState('all');
  
  // Fonction pour mettre à jour les données en fonction des filtres
  const updateDataWithFilters = (period: string, crop: string) => {
    // Filtrer les données de rendement par culture si nécessaire
    if (crop !== 'all') {
      const filteredYieldData = initialYieldData.filter(item => item.name === crop);
      setYieldData(filteredYieldData);
      
      // Filtrer également les données financières par culture
      const filteredProfitabilityData = initialProfitabilityData.filter(item => item.crop === crop);
      setFinancialData(prev => ({
        ...prev,
        profitabilityByParcel: filteredProfitabilityData
      }));
    } else {
      setYieldData(initialYieldData);
      setFinancialData(prev => ({
        ...prev,
        profitabilityByParcel: initialProfitabilityData
      }));
    }
    
    // Vous pourriez également ajuster les autres données en fonction de la période
  };
  
  // Mettre à jour les données lorsque les filtres changent
  useEffect(() => {
    updateDataWithFilters(period, cropFilter);
  }, [period, cropFilter]);
  
  return (
    <StatisticsContext.Provider 
      value={{ 
        yieldData, 
        setYieldData,
        financialData,
        setFinancialData,
        environmentalData,
        setEnvironmentalData,
        forecastData,
        setForecastData,
        period,
        setPeriod,
        cropFilter,
        setCropFilter,
        updateDataWithFilters
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};
