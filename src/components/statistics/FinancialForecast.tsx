
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine
} from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calculator, RefreshCw, TrendingUp, Share2 } from "lucide-react";

// Dados de previsão para os próximos 12 meses (valores em R$)
const forecastData = [
  { month: 'Jan', revenue: 142500, expenses: 100500, forecast: 42000, previous: 36000 },
  { month: 'Fev', revenue: 151000, expenses: 109000, forecast: 42000, previous: 37500 },
  { month: 'Mar', revenue: 164000, expenses: 112000, forecast: 52000, previous: 41000 },
  { month: 'Abr', revenue: 177500, expenses: 115500, forecast: 62000, previous: 46000 },
  { month: 'Mai', revenue: 191000, expenses: 117500, forecast: 73500, previous: 53500 },
  { month: 'Jun', revenue: 189000, expenses: 114500, forecast: 74500, previous: 56000 },
  { month: 'Jul', revenue: 212500, expenses: 121000, forecast: 91500, previous: 62000 },
  { month: 'Ago', revenue: 224000, expenses: 126500, forecast: 97500, previous: 65500 },
  { month: 'Set', revenue: 201000, expenses: 124000, forecast: 77000, previous: 62000 },
  { month: 'Out', revenue: 191000, expenses: 115500, forecast: 75500, previous: 59000 },
  { month: 'Nov', revenue: 182500, expenses: 112500, forecast: 70000, previous: 54500 },
  { month: 'Dez', revenue: 206000, expenses: 129000, forecast: 77000, previous: 61000 }
];

// Dados de projeção de fluxo de caixa (valores em R$)
const cashFlowProjection = [
  { month: 'Jan', inflow: 142500, outflow: 100500, balance: 42000 },
  { month: 'Fev', inflow: 151000, outflow: 109000, balance: 84000 },
  { month: 'Mar', inflow: 164000, outflow: 112000, balance: 136000 },
  { month: 'Abr', inflow: 177500, outflow: 115500, balance: 198000 },
  { month: 'Mai', inflow: 191000, outflow: 117500, balance: 271500 },
  { month: 'Jun', inflow: 189000, outflow: 114500, balance: 346000 },
  { month: 'Jul', inflow: 212500, outflow: 121000, balance: 437500 },
  { month: 'Ago', inflow: 224000, outflow: 126500, balance: 535000 },
  { month: 'Set', inflow: 201000, outflow: 124000, balance: 612000 },
  { month: 'Out', inflow: 191000, outflow: 115500, balance: 687500 },
  { month: 'Nov', inflow: 182500, outflow: 112500, balance: 757500 },
  { month: 'Dez', inflow: 206000, outflow: 129000, balance: 834500 }
];

const FinancialForecast = () => {
  const [forecastDuration, setForecastDuration] = useState<string>("12");
  const [revenueFactor, setRevenueFactor] = useState<number[]>([100]);
  const [expenseFactor, setExpenseFactor] = useState<number[]>([100]);
  const [revenueScenario, setRevenueScenario] = useState<string>("stable");
  const [forecastModel, setForecastModel] = useState<string>("basic");
  
  const handleRefreshForecast = () => {
    toast.info("Atualizando as previsões financeiras");
    // Em uma aplicação real, isso recalcularia as previsões baseadas nos fatores selecionados
  };
  
  const handleShareForecast = () => {
    toast.success("Previsões compartilhadas por e-mail");
  };
  
  const handleRunSimulation = () => {
    toast.success("Simulação executada com sucesso");
    // Em uma aplicação real, isso executaria um modelo de previsão mais sofisticado
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Previsões Financeiras</h2>
          <p className="text-muted-foreground">Projeções para {forecastDuration} meses baseadas nos dados históricos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={forecastDuration} onValueChange={setForecastDuration}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Duração" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
              <SelectItem value="24">24 meses</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={forecastModel} onValueChange={setForecastModel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Modelo básico</SelectItem>
              <SelectItem value="seasonal">Modelo sazonal</SelectItem>
              <SelectItem value="advanced">Modelo avançado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefreshForecast} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button onClick={handleShareForecast} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Margem líquida projetada</CardTitle>
            <CardDescription>Comparação com o ano anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "forecast") return [`R$ ${value.toLocaleString('pt-BR')}`, "Previsão"];
                      if (name === "previous") return [`R$ ${value.toLocaleString('pt-BR')}`, "Ano anterior"];
                      return [`R$ ${value.toLocaleString('pt-BR')}`, name];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#4CAF50" 
                    strokeWidth={2} 
                    name="Previsão" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#9E9E9E" 
                    strokeDasharray="5 5" 
                    name="Ano anterior" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Previsão de fluxo de caixa</CardTitle>
            <CardDescription>Evolução do saldo de caixa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowProjection}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                  />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Saldo de caixa"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros de simulação</CardTitle>
          <CardDescription>Ajuste os fatores para observar seu impacto nas previsões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Evolução das receitas</Label>
                    <span className="text-sm font-medium">{revenueFactor[0]}%</span>
                  </div>
                  <Slider 
                    value={revenueFactor} 
                    onValueChange={setRevenueFactor} 
                    min={70} 
                    max={130} 
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-30%</span>
                    <span>Estável</span>
                    <span>+30%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Evolução dos custos</Label>
                    <span className="text-sm font-medium">{expenseFactor[0]}%</span>
                  </div>
                  <Slider 
                    value={expenseFactor} 
                    onValueChange={setExpenseFactor} 
                    min={70} 
                    max={130} 
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-30%</span>
                    <span>Estável</span>
                    <span>+30%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Cenário de receitas</Label>
                  <Select value={revenueScenario} onValueChange={setRevenueScenario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cenário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="optimistic">Otimista (+15%)</SelectItem>
                      <SelectItem value="stable">Estável (±0%)</SelectItem>
                      <SelectItem value="pessimistic">Pessimista (-15%)</SelectItem>
                      <SelectItem value="seasonal">Sazonal (variações)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full" onClick={handleRunSimulation}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Executar simulação
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Resultado operacional projetado</p>
                <p className="text-xl font-bold">R$ 493.000</p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% vs ano anterior</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Caixa projetado para fim do ano</p>
                <p className="text-xl font-bold">R$ 834.500</p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+32% vs ano anterior</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Rentabilidade projetada</p>
                <p className="text-xl font-bold">21,3%</p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3,2pts vs ano anterior</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialForecast;
