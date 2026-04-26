import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdenesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Órdenes de reparación</h1>
          <p className="text-muted-foreground">
            Gestiona las reparaciones en curso
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva orden
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12">
        <ClipboardList className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No hay órdenes</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Crea tu primera orden de reparación
        </p>
      </div>
    </div>
  );
}
