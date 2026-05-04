import { Plus, ClipboardList, Car, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

const estadoLabels: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "Diagnóstico",
  presupuestado: "Presupuestado",
  aprobado: "Aprobado",
  en_reparacion: "En reparación",
  esperando_recambio: "Esp. recambio",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const estadoColors: Record<string, string> = {
  recibido: "bg-zinc-100 text-zinc-700",
  diagnostico: "bg-blue-100 text-blue-700",
  presupuestado: "bg-amber-100 text-amber-700",
  aprobado: "bg-emerald-100 text-emerald-700",
  en_reparacion: "bg-orange-100 text-orange-700",
  esperando_recambio: "bg-red-100 text-red-700",
  listo: "bg-emerald-200 text-emerald-800",
  entregado: "bg-zinc-100 text-zinc-400",
  cancelado: "bg-zinc-100 text-zinc-300",
};

const filtros = [
  { value: "activas", label: "En taller" },
  { value: "todas", label: "Todas" },
  { value: "recibido", label: "Recibidas" },
  { value: "diagnostico", label: "Diagnóstico" },
  { value: "en_reparacion", label: "En reparación" },
  { value: "esperando_recambio", label: "Esp. recambio" },
  { value: "listo", label: "Listas" },
  { value: "entregado", label: "Entregadas" },
];

export default async function OrdenesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const params = await searchParams;
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const filtro = params.filtro || "activas";

  let whereCondition;
  if (filtro === "activas") {
    whereCondition = and(
      eq(ordenesTrabajo.tallerId, tallerId),
      sql`${ordenesTrabajo.estado} NOT IN ('entregado', 'cancelado')`
    );
  } else if (filtro === "todas") {
    whereCondition = eq(ordenesTrabajo.tallerId, tallerId);
  } else {
    whereCondition = and(
      eq(ordenesTrabajo.tallerId, tallerId),
      sql`${ordenesTrabajo.estado} = ${filtro}`
    );
  }

  const ordenes = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      estado: ordenesTrabajo.estado,
      descripcionCliente: ordenesTrabajo.descripcionCliente,
      fechaEntrada: ordenesTrabajo.fechaEntrada,
      kmEntrada: ordenesTrabajo.kmEntrada,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      clienteNombre: clientes.nombre,
      clienteTelefono: clientes.telefono,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .where(whereCondition)
    .orderBy(desc(ordenesTrabajo.createdAt));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Órdenes de trabajo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{ordenes.length} orden{ordenes.length !== 1 ? "es" : ""}</p>
        </div>
        <Link href="/ordenes/nueva">
          <Button className="rounded-full"><Plus className="mr-1.5 h-4 w-4" />Nueva orden</Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {filtros.map((f) => (
          <Link
            key={f.value}
            href={`/ordenes?filtro=${f.value}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              filtro === f.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Lista */}
      {ordenes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-bold">Sin órdenes</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filtro === "activas" ? "No hay coches en taller ahora mismo" : "No hay órdenes con este filtro"}
          </p>
          <Link href="/ordenes/nueva" className="mt-4">
            <Button className="rounded-full"><Plus className="mr-1.5 h-4 w-4" />Crear orden</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {ordenes.map((o) => (
            <Link key={o.id} href={`/ordenes/${o.id}`} className="block">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-accent/30 hover:border-brand/20 transition-all duration-200">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-muted">
                  <span className="text-[10px] font-bold text-muted-foreground">OR</span>
                  <span className="text-sm font-extrabold leading-none">{o.numero}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{o.matricula}</span>
                    <span className="text-xs text-muted-foreground">{o.marca} {o.modelo}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.clienteNombre}</p>
                  {o.descripcionCliente && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{o.descripcionCliente}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge className={`text-[10px] ${estadoColors[o.estado] || ""}`}>{estadoLabels[o.estado]}</Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(o.fechaEntrada).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
