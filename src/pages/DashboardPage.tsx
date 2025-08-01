
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageLayout from "@/components/layout/PageLayout";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Users, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Key,
  UserCheck,
  Building,
  Target,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Star
} from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Dados fictícios para CRM Imobiliário
const salesData = [
  { month: "Jan", vendas: 600000, meta: 500000 },
  { month: "Fev", vendas: 400000, meta: 500000 },
  { month: "Mar", vendas: 750000, meta: 500000 },
  { month: "Abr", vendas: 475000, meta: 500000 },
  { month: "Mai", vendas: 900000, meta: 500000 },
  { month: "Jun", vendas: 1050000, meta: 500000 }
];

const agentPerformance = [
  { corretor: "Ana Silva", vendas: 8, meta: 6, comissao: 60000 },
  { corretor: "Carlos Santos", vendas: 6, meta: 6, comissao: 47500 },
  { corretor: "Maria Costa", vendas: 10, meta: 8, comissao: 75000 },
  { corretor: "João Oliveira", vendas: 4, meta: 6, comissao: 31000 }
];

const propertyTypes = [
  { name: "Apartamentos", value: 45 },
  { name: "Casas", value: 30 },
  { name: "Comercial", value: 15 },
  { name: "Terrenos", value: 10 }
];

const leadSourceData = [
  { source: "Site", leads: 45, conversao: 12 },
  { source: "Facebook", leads: 32, conversao: 8 },
  { source: "Google Ads", leads: 28, conversao: 15 },
  { source: "Indicação", leads: 20, conversao: 18 },
  { source: "WhatsApp", leads: 35, conversao: 10 }
];

const recentActivities = [
  { id: 1, type: "venda", message: "Ana Silva fechou venda de apartamento - R$ 1.750.000", time: "há 2 horas", corretor: "Ana Silva" },
  { id: 2, type: "lead", message: "Novo lead interessado em casa no Centro", time: "há 3 horas", corretor: "Carlos Santos" },
  { id: 3, type: "visita", message: "Visita agendada para apartamento na Zona Sul", time: "há 4 horas", corretor: "Maria Costa" },
  { id: 4, type: "contato", message: "Cliente retornou ligação sobre propriedade", time: "há 5 horas", corretor: "João Oliveira" }
];

const upcomingTasks = [
  { id: 1, task: "Visita - Apartamento Copacabana", corretor: "Ana Silva", time: "14:00", priority: "Alta" },
  { id: 2, task: "Follow-up lead - Casa Ipanema", corretor: "Carlos Santos", time: "15:30", priority: "Média" },
  { id: 3, task: "Documentação - Venda Finalizada", corretor: "Maria Costa", time: "16:00", priority: "Alta" },
  { id: 4, task: "Ligação - Cliente interessado", corretor: "João Oliveira", time: "17:00", priority: "Baixa" }
];

const hotLeads = [
  { id: 1, nome: "Roberto Alves", propriedade: "Apt 3 quartos - Copacabana", valor: "R$ 4.250.000", corretor: "Ana Silva", score: 95 },
  { id: 2, nome: "Patricia Lima", propriedade: "Casa - Barra da Tijuca", valor: "R$ 6.000.000", corretor: "Maria Costa", score: 88 },
  { id: 3, nome: "Fernando Costa", propriedade: "Cobertura - Ipanema", valor: "R$ 10.500.000", corretor: "Carlos Santos", score: 92 }
];

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const StatCard = ({ title, value, change, icon: Icon, trend, subtitle }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {change && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend === "up" ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
              {change}
            </span>
            <span className="ml-1">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Painel de Controle CRM Imobiliário</h1>
            <p className="text-muted-foreground">
              Gestão completa de vendas e relacionamento com clientes
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Visita
            </Button>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Vendas do Mês"
            value="R$ 10,5M"
            change="+18.2%"
            icon={DollarSign}
            trend="up"
            subtitle="12 propriedades vendidas"
          />
          <StatCard
            title="Leads Ativos"
            value="147"
            change="+23"
            icon={Users}
            trend="up"
            subtitle="32 leads quentes"
          />
          <StatCard
            title="Propriedades"
            value="89"
            change="+5"
            icon={Home}
            trend="up"
            subtitle="12 em negociação"
          />
          <StatCard
            title="Taxa de Conversão"
            value="24.5%"
            change="+3.1%"
            icon={Target}
            trend="up"
            subtitle="Meta: 20%"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
            <TabsTrigger value="agentes">Performance Corretores</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Revenue Chart */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Performance de Vendas</CardTitle>
                  <CardDescription>
                    Vendas mensais vs metas
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      vendas: { label: "Vendas", color: "hsl(var(--primary))" },
                      meta: { label: "Meta", color: "hsl(var(--muted))" }
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="vendas" 
                          stackId="1"
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="meta" 
                          stackId="2"
                          stroke="hsl(var(--muted))" 
                          fill="hsl(var(--muted))"
                          fillOpacity={0.4}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Activities and Tasks */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Atividades Recentes</CardTitle>
                  <CardDescription>
                    Últimas ações da equipe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-2 p-2 bg-muted rounded-lg">
                        <div className={`h-2 w-2 rounded-full mt-2 ${
                          activity.type === 'venda' ? 'bg-green-500' :
                          activity.type === 'lead' ? 'bg-blue-500' :
                          activity.type === 'visita' ? 'bg-orange-500' :
                          'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-xs font-medium">{activity.message}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-muted-foreground">{activity.corretor}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hot Leads and Tasks */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    Leads Quentes
                  </CardTitle>
                  <CardDescription>
                    Leads com maior probabilidade de conversão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hotLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">{lead.nome}</p>
                          <p className="text-xs text-muted-foreground">{lead.propriedade}</p>
                          <p className="text-xs font-medium text-green-600">{lead.valor}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-1">
                            Score: {lead.score}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{lead.corretor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    Próximas Tarefas
                  </CardTitle>
                  <CardDescription>
                    Agenda do dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">{task.task}</p>
                          <p className="text-xs text-muted-foreground">{task.corretor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{task.time}</p>
                          <Badge variant={
                            task.priority === 'Alta' ? 'destructive' :
                            task.priority === 'Média' ? 'default' : 'secondary'
                          }>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vendas" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Property Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Propriedades</CardTitle>
                  <CardDescription>Distribuição do portfólio</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Quantidade", color: "hsl(var(--primary))" }
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={propertyTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {propertyTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Lead Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Fontes de Leads</CardTitle>
                  <CardDescription>Leads vs taxa de conversão</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      leads: { label: "Leads", color: "hsl(var(--primary))" },
                      conversao: { label: "Conversão (%)", color: "hsl(var(--secondary))" }
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadSourceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="source" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="leads" fill="hsl(var(--primary))" />
                        <Bar dataKey="conversao" fill="hsl(var(--secondary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agentes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Corretores</CardTitle>
                <CardDescription>Vendas vs metas e comissões</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    vendas: { label: "Vendas", color: "hsl(var(--primary))" },
                    meta: { label: "Meta", color: "hsl(var(--muted))" }
                  }}
                  className="h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={agentPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="corretor" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="vendas" fill="hsl(var(--primary))" />
                        <Bar dataKey="meta" fill="hsl(var(--muted))" />
                      </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Agent Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Corretores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentPerformance.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{agent.corretor}</p>
                          <p className="text-sm text-muted-foreground">
                            {agent.vendas} vendas de {agent.meta} meta
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">R$ {agent.comissao.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Comissão</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">147</div>
                  <p className="text-xs text-muted-foreground">+12% este mês</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leads Quentes</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32</div>
                  <p className="text-xs text-muted-foreground">21.8% do total</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">36</div>
                  <p className="text-xs text-muted-foreground">24.5% taxa conversão</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
