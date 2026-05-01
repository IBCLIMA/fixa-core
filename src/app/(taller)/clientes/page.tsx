import { Plus, Users, Search, Phone, Car, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getClientes } from "../actions/clientes";
import { NuevoClienteDialog } from "./nuevo-cliente-dialog";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const clientesList = await getClientes(params.q);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {clientesList.length} cliente{clientesList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <NuevoClienteDialog />
      </div>

      {/* Búsqueda */}
      <form>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Buscar por nombre, teléfono, email..."
            className="pl-9 h-10 rounded-xl"
            defaultValue={params.q}
          />
        </div>
      </form>

      {/* Lista */}
      {clientesList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-bold">
            {params.q ? "Sin resultados" : "Sin clientes"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {params.q
              ? `No se encontraron clientes para "${params.q}"`
              : "Añade tu primer cliente para empezar"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {clientesList.map((cliente) => (
            <Link
              key={cliente.id}
              href={`/clientes/${cliente.id}`}
              className="block"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-accent/50 hover:border-brand/20 transition-all duration-200">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <span className="text-sm font-extrabold text-brand">
                    {cliente.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{cliente.nombre}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    {cliente.telefono && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {cliente.telefono}
                      </span>
                    )}
                    {cliente.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </span>
                    )}
                  </div>
                </div>
                {cliente.vehiculos && cliente.vehiculos.length > 0 && (
                  <Badge variant="secondary" className="shrink-0">
                    <Car className="h-3 w-3 mr-1" />
                    {cliente.vehiculos.length}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
