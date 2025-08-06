
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { useCRM } from "@/contexts/CRMContext";

export default function TasksPanel() {
  // CORREÇÃO: Garante que 'tasks' seja sempre um array, mesmo que 'useCRM()' retorne undefined.
  const { tasks = [] } = useCRM() || {};

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Tarefas Pendentes</CardTitle>
        <CardDescription>
          Você tem {tasks.filter(task => !task.completed).length} tarefas para concluir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4">
              <Checkbox id={`task-${task.id}`} checked={task.completed} />
              <label
                htmlFor={`task-${task.id}`}
                className={`flex-1 text-sm font-medium leading-none ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.text}
              </label>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
