import { Bell } from "lucide-react";

export default function AvisosPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Avisos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Avisos de mantenimiento e ITV</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold">Próximamente</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Avisos automáticos de ITV, revisiones y mantenimientos programados. Envío por WhatsApp al cliente.
        </p>
      </div>
    </div>
  );
}
