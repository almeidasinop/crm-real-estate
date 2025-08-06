
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, UserCheck, FileWarning } from "lucide-react";
import { useCRM } from "@/contexts/CRMContext";

const icons: { [key: string]: React.ElementType } = {
  default: Bell,
  user: UserCheck,
  document: FileWarning,
};

export default function AlertsPanel() {
  // CORREÇÃO: Garante que 'alerts' seja sempre um array.
  const { alerts = [] } = useCRM() || {};

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Alertas e Notificações</CardTitle>
        <CardDescription>
          Você tem {alerts.length} novas notificações.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {alerts.map((alert) => {
          const Icon = icons[alert.type as string] || icons.default;
          return (
            <div key={alert.id} className="flex items-start space-x-4">
              <div className="bg-secondary/10 p-2 rounded-full">
                <Icon className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{alert.title}</p>
                <p className="text-sm text-muted-foreground">
                  {alert.message}
                </p>
              </div>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Nenhum alerta novo.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
