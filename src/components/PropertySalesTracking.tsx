import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { Building2, Home, ArrowUp, ArrowDown } from 'lucide-react';
import { useStatistics } from '../contexts/StatisticsContext';
import PreviewPrintButton from './common/PreviewPrintButton';

interface SalesData {
  property: string;
  currentSales: number;
  previousSales: number;
  unit: string;
  averagePrice: number;
  category: 'Excelente' | 'Boa' | 'Média' | 'Baixa';
}

const PropertySalesTracking = () => {
  const { yieldData } = useStatistics();
  const [title, setTitle] = useState('Acompanhamento de Vendas Imobiliárias');
  const [description, setDescription] = useState('Acompanhe o desempenho de vendas por tipo de propriedade e localização');
  
  // Converter dados para vendas imobiliárias
  const [salesData, setSalesData] = useState<SalesData[]>([
    {
      property: 'Apartamentos 3 quartos',
      currentSales: 15,
      previousSales: 12,
      unit: 'unidades',
      averagePrice: 850000,
      category: 'Excelente'
    },
    {
      property: 'Casas residenciais',
      currentSales: 8,
      previousSales: 10,
      unit: 'unidades',
      averagePrice: 650000,
      category: 'Boa'
    },
    {
      property: 'Coberturas luxo',
      currentSales: 3,
      previousSales: 2,
      unit: 'unidades',
      averagePrice: 2500000,
      category: 'Excelente'
    },
    {
      property: 'Apartamentos 2 quartos',
      currentSales: 22,
      previousSales: 18,
      unit: 'unidades',
      averagePrice: 550000,
      category: 'Boa'
    },
    {
      property: 'Imóveis comerciais',
      currentSales: 5,
      previousSales: 7,
      unit: 'unidades',
      averagePrice: 1200000,
      category: 'Média'
    }
  ]);
  
  // Colunas para o tableau editable
  const columns: Column[] = [
    { id: 'property', header: 'Tipo de Propriedade', accessorKey: 'property', isEditable: true },
    { id: 'currentSales', header: 'Vendas Atuais', accessorKey: 'currentSales', type: 'number', isEditable: true },
    { id: 'previousSales', header: 'Vendas Anteriores', accessorKey: 'previousSales', type: 'number', isEditable: true },
    { id: 'unit', header: 'Unidade', accessorKey: 'unit', isEditable: true },
    { id: 'averagePrice', header: 'Preço Médio (R$)', accessorKey: 'averagePrice', type: 'number', isEditable: true },
    { id: 'category', header: 'Performance', accessorKey: 'category', isEditable: true }
  ];
  
  // Handlers
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
  };
  
  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
  };
  
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...salesData];
    const updatedRow = { ...newData[rowIndex] };
    
    if (columnId === 'currentSales' || columnId === 'previousSales' || columnId === 'averagePrice') {
      (updatedRow as any)[columnId] = Number(value);
    } else if (columnId === 'property' || columnId === 'unit' || columnId === 'category') {
      (updatedRow as any)[columnId] = String(value);
    }
    
    newData[rowIndex] = updatedRow as SalesData;
    setSalesData(newData);
    console.log('Dados de vendas atualizados');
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...salesData];
    newData.splice(rowIndex, 1);
    setSalesData(newData);
    console.log('Tipo de propriedade removido do acompanhamento');
  };
  
  const handleAddRow = (newRow: Record<string, any>) => {
    const typedRow: SalesData = {
      property: String(newRow.property || ''),
      currentSales: Number(newRow.currentSales || 0),
      previousSales: Number(newRow.previousSales || 0),
      unit: String(newRow.unit || 'unidades'),
      averagePrice: Number(newRow.averagePrice || 0),
      category: (newRow.category as SalesData['category']) || 'Média'
    };
    setSalesData([...salesData, typedRow]);
    console.log('Novo tipo de propriedade adicionado ao acompanhamento');
  };
  
  // Dados para o gráfico comparativo
  const chartData = salesData.map(item => ({
    name: item.property,
    atual: item.currentSales,
    anterior: item.previousSales,
    diferença: item.currentSales - item.previousSales,
    unidade: item.unit
  }));

  // Preparar dados para preview/print
  const printData = salesData.map(item => ({
    propriedade: item.property,
    vendas_atuais: `${item.currentSales} ${item.unit}`,
    vendas_anteriores: `${item.previousSales} ${item.unit}`,
    preco_medio: `R$ ${item.averagePrice.toLocaleString('pt-BR')}`,
    performance: item.category,
    evolucao: `${item.currentSales > item.previousSales ? '+' : ''}${(item.currentSales - item.previousSales)} ${item.unit}`
  }));
  
  // Colunas para preview/print
  const printColumns = [
    { key: "propriedade", header: "Tipo de Propriedade" },
    { key: "vendas_atuais", header: "Vendas Atuais" },
    { key: "vendas_anteriores", header: "Vendas Anteriores" },
    { key: "preco_medio", header: "Preço Médio" },
    { key: "performance", header: "Performance" },
    { key: "evolucao", header: "Evolução" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Building2 className="h-6 w-6 mr-2 text-primary" />
              <EditableField
                value={title}
                onSave={handleTitleChange}
                className="inline-block"
              />
            </h2>
            <p className="text-muted-foreground">
              <EditableField
                value={description}
                onSave={handleDescriptionChange}
                className="inline-block"
              />
            </p>
          </div>
          
          <PreviewPrintButton 
            data={printData} 
            moduleName="sales_data"
            title={title}
            columns={printColumns}
            variant="outline"
          />
        </div>
        
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'diferença') {
                    return [`${Number(value) > 0 ? '+' : ''}${value} ${props.payload.unidade}`, 'Evolução'];
                  }
                  return [`${value} ${props.payload.unidade}`, name];
                }}
              />
              <Legend />
              <Bar name="Vendas Atuais" dataKey="atual" fill="#3b82f6" />
              <Bar name="Vendas Anteriores" dataKey="anterior" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {salesData.map(item => {
            const change = item.currentSales - item.previousSales;
            const changePercent = ((change / item.previousSales) * 100).toFixed(1);
            const isPositive = change >= 0;
            
            return (
              <div key={item.property} className="bg-muted/30 rounded-lg p-4 border">
                <h3 className="font-medium mb-1 flex items-center">
                  <Home className="h-4 w-4 mr-1.5 text-primary" />
                  {item.property}
                </h3>
                <div className="text-2xl font-bold">{item.currentSales} {item.unit}</div>
                <div className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{isPositive ? '+' : ''}{change} {item.unit} ({isPositive ? '+' : ''}{changePercent}%)</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Preço médio: <span className="font-medium">R$ {item.averagePrice.toLocaleString('pt-BR')}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Performance: <span className="font-medium">{item.category}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <EditableTable
          data={salesData}
          columns={columns}
          onUpdate={handleTableUpdate}
          onDelete={handleDeleteRow}
          onAdd={handleAddRow}
          className="border-none"
        />
      </div>
    </div>
  );
};

export default PropertySalesTracking;