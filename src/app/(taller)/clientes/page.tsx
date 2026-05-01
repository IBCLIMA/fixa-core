import { Plus, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ClientesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Base de datos de clientes y vehículos</p>
        </div>
        <Button className="rounded-full">
          <Plus className="mr-1.5 h-4 w-4" />Nuevo cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nombre, matrícula, teléfono..." className="pl-9 h-10 rounded-xl" />
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold">Sin clientes</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Añade tu primer cliente para empezar a gestionar vehículos y reparaciones
        </p>
        <Button className="mt-4 rounded-full">
          <Plus className="mr-1.5 h-4 w-4" />Añadir primer cliente
        </Button>
      </div>
    </div>
  );
}
