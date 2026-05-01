import { Plus, ClipboardList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function OrdenesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Órdenes de trabajo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona las reparaciones en curso</p>
        </div>
        <Link href="/ordenes/nueva">
          <Button className="rounded-full">
            <Plus className="mr-1.5 h-4 w-4" />Nueva orden
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por matrícula, cliente..." className="pl-9 h-10 rounded-xl" />
        </div>
      </div>

      {/* Estado vacío */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold">Sin órdenes de trabajo</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Crea tu primera orden de trabajo cuando un vehículo entre al taller
        </p>
        <Link href="/ordenes/nueva" className="mt-4">
          <Button className="rounded-full">
            <Plus className="mr-1.5 h-4 w-4" />Crear primera orden
          </Button>
        </Link>
      </div>
    </div>
  );
}
