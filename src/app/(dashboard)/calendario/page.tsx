import { CalendarDays } from "lucide-react";

export default function CalendarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendario</h1>
        <p className="text-muted-foreground">
          Agenda de citas y planificación del taller
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12">
        <CalendarDays className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Calendario próximamente</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Aquí verás la agenda diaria y semanal del taller
        </p>
      </div>
    </div>
  );
}
