import { Plus, ClipboardList, Car, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes, usuarios } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { estadoLabels, estadoColors } from "@/lib/constants";
import { EntradaRapida } from "../entrada-rapida";
import { EliminarRapido } from "./eliminar-rapido";

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

const PER_PAGE = 20;

export default async function OrdenesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; page?: string; mecanico?: string }>;
}) {
  const params = await searchParams;
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const filtro = params.filtro || "activas";
  const mecanicoFiltro = params.mecanico || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (page - 1) * PER_PAGE;

  // Get all workshop users for the mechanic filter
  const equipoTaller = await db
    .select({ id: usuarios.id, nombre: usuarios.nombre, rol: usuarios.rol })
    .from(usuarios)
    .where(eq(usuarios.tallerId, tallerId));

  const conditions: ReturnType<typeof eq>[] = [eq(ordenesTrabajo.tallerId, tallerId)];

  if (filtro === "activas") {
    conditions.push(sql`${ordenesTrabajo.estado} NOT IN ('entregado', 'cancelado')` as any);
  } else if (filtro !== "todas") {
    conditions.push(sql`${ordenesTrabajo.estado} = ${filtro}` as any);
  }

  if (mecanicoFiltro === "sin_asignar") {
    conditions.push(sql`${ordenesTrabajo.asignadoA} IS NULL` as any);
  } else if (mecanicoFiltro) {
    conditions.push(eq(ordenesTrabajo.asignadoA, mecanicoFiltro) as any);
  }

  const whereCondition = and(...conditions);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .leftJoin(usuarios, eq(ordenesTrabajo.asignadoA, usuarios.id))
    .where(whereCondition);

  const totalPages = Math.max(1, Math.ceil(Number(total) / PER_PAGE));
  const safePage = Math.min(page, Math.max(1, totalPages));
  const safeOffset = (safePage - 1) * PER_PAGE;

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
      mecanicoNombre: usuarios.nombre,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .leftJoin(usuarios, eq(ordenesTrabajo.asignadoA, usuarios.id))
    .where(whereCondition)
    .orderBy(desc(ordenesTrabajo.createdAt))
    .limit(PER_PAGE)
    .offset(safeOffset);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Órdenes de trabajo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona las reparaciones en curso y el historial de tu taller.</p>
        </div>
        <EntradaRapida />
      </div>

      {/* Filtros */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {filtros.map((f) => (
          <Link
            key={f.value}
            href={`/ordenes?filtro=${f.value}${mecanicoFiltro ? `&mecanico=${mecanicoFiltro}` : ""}`}
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

      {/* Filtro por mecánico */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        <span className="shrink-0 text-xs text-muted-foreground font-bold self-center mr-1">Mecánico:</span>
        <Link
          href={`/ordenes?filtro=${filtro}`}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            !mecanicoFiltro
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Todos
        </Link>
        <Link
          href={`/ordenes?filtro=${filtro}&mecanico=sin_asignar`}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            mecanicoFiltro === "sin_asignar"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Sin asignar
        </Link>
        {equipoTaller.map((m) => (
          <Link
            key={m.id}
            href={`/ordenes?filtro=${filtro}&mecanico=${m.id}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              mecanicoFiltro === m.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {m.nombre}
          </Link>
        ))}
      </div>

      {/* Lista */}
      {ordenes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-bold">{filtro === "activas" ? "Aun no tienes ordenes" : "Sin ordenes con este filtro"}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {filtro === "activas"
              ? "Cada vehiculo que entre al taller tendra su orden con estado, lineas de trabajo y presupuesto."
              : "Prueba con otro filtro o crea una nueva orden."}
          </p>
          <div className="mt-4"><EntradaRapida /></div>
        </div>
      ) : (
        <div className="space-y-2">
          {ordenes.map((o) => (
            <div key={o.id} className="group relative">
            <Link href={`/ordenes/${o.id}`} className="block">
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
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-muted-foreground">{o.clienteNombre}</p>
                    {o.mecanicoNombre && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        {o.mecanicoNombre}
                      </span>
                    )}
                  </div>
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
            <div className="absolute top-3 right-3">
              <EliminarRapido ordenId={o.id} numero={o.numero} />
            </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          {safePage > 1 ? (
            <Link
              href={`/ordenes?filtro=${filtro}${mecanicoFiltro ? `&mecanico=${mecanicoFiltro}` : ""}&page=${safePage - 1}`}
              className="rounded-full px-4 py-2 text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Anterior
            </Link>
          ) : (
            <span className="rounded-full px-4 py-2 text-sm font-bold bg-muted text-muted-foreground/40">
              Anterior
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            Página {safePage} de {totalPages}
          </span>
          {safePage < totalPages ? (
            <Link
              href={`/ordenes?filtro=${filtro}${mecanicoFiltro ? `&mecanico=${mecanicoFiltro}` : ""}&page=${safePage + 1}`}
              className="rounded-full px-4 py-2 text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Siguiente
            </Link>
          ) : (
            <span className="rounded-full px-4 py-2 text-sm font-bold bg-muted text-muted-foreground/40">
              Siguiente
            </span>
          )}
        </div>
      )}
    </div>
  );
}
