import { Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalendarioPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Calendario</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Agenda de citas del taller</p>
        </div>
        <Button className="rounded-full">
          <Plus className="mr-1.5 h-4 w-4" />Nueva cita
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold">Sin citas programadas</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Programa citas para organizar las entradas de vehículos al taller
        </p>
        <Button className="mt-4 rounded-full">
          <Plus className="mr-1.5 h-4 w-4" />Crear primera cita
        </Button>
      </div>
    </div>
  );
}
