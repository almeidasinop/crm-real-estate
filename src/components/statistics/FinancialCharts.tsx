
import React from 'react';
import { 
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialCharts = () => {
  const { financialData } = useStatistics();
  const { profitabilityByParcel, costAnalysis, revenueByMonth } = financialData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rentabilidade por área (R$/m²)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="size" 
                  name="Tamanho" 
                  unit=" m²" 
                  label={{ value: 'Tamanho (m²)', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  type="number" 
                  dataKey="profitability" 
                  name="Rentabilidade" 
                  unit=" R$/m²" 
                  label={{ value: 'Rentabilidade (R$/m²)', angle: -90, position: 'insideLeft' }} 
                />
                <ZAxis 
                  type="category" 
                  dataKey="crop" 
                  name="Especialidade" 
                  range={[100, 1000]} 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  formatter={(value, name, props) => {
                  if (name === 'Rentabilidade') return [`R$ ${value}/m²`, name];
                  if (name === 'Tamanho') return [`${value} m²`, name];
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                      <div className="bg-white p-2 border rounded shadow-sm">
                        <p className="font-medium">{payload[2]?.payload.name}</p>
                        <p>Especialidade: {payload[2]?.value}</p>
                        <p>Tamanho: {payload[0]?.value} m²</p>
                        <p>Rentabilidade: R$ {payload[1]?.value}/m²</p>
                      </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  name="Áreas" 
                  data={profitabilityByParcel} 
                  fill="#4CAF50" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costAnalysis}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    width={80} 
                  />
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
                  <Bar 
                    dataKey="value" 
                    fill="#8D6E63" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Receitas e Despesas Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueByMonth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Receitas" stroke="#4CAF50" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" name="Despesas" stroke="#F44336" />
                  <Line type="monotone" dataKey="profit" name="Lucro" stroke="#2196F3" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Financeiros Principais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">EBITDA</p>
              <p className="text-2xl font-semibold">R$ 212.500</p>
              <p className="text-xs text-green-600">32% do faturamento</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Rentabilidade</p>
              <p className="text-2xl font-semibold">18%</p>
              <p className="text-xs text-green-600">+2.5% vs ano anterior</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-2xl font-semibold">22%</p>
              <p className="text-xs text-muted-foreground">Sobre investimentos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
