import { FileText, Plus, Send, Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { presupuestos, vehiculos, clientes, lineasPresupuesto } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

const estadoLabels: Record<string, string> = {
  borrador: "Borrador", enviado: "Enviado", aceptado: "Aceptado",
  rechazado: "Rechazado", expirado: "Expirado",
};

const estadoColors: Record<string, string> = {
  borrador: "bg-zinc-100 text-zinc-700", enviado: "bg-blue-100 text-blue-700",
  aceptado: "bg-emerald-100 text-emerald-700", rechazado: "bg-red-100 text-red-700",
  expirado: "bg-zinc-100 text-zinc-400",
};

const estadoIcons: Record<string, typeof FileText> = {
  borrador: FileText, enviado: Send, aceptado: Check,
  rechazado: X, expirado: Clock,
};

const PER_PAGE = 20;

export default async function PresupuestosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (page - 1) * PER_PAGE;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(presupuestos)
    .where(eq(presupuestos.tallerId, tallerId));

  const totalPages = Math.max(1, Math.ceil(Number(total) / PER_PAGE));
  const safePage = Math.min(page, Math.max(1, totalPages));
  const safeOffset = (safePage - 1) * PER_PAGE;

  const presupuestosList = await db
    .select({
      id: presupuestos.id,
      numero: presupuestos.numero,
      estado: presupuestos.estado,
      createdAt: presupuestos.createdAt,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      clienteNombre: clientes.nombre,
      total: sql<number>`COALESCE((SELECT SUM(CAST(cantidad AS NUMERIC) * CAST(precio_unitario AS NUMERIC) * (1 + CAST(iva_pct AS NUMERIC) / 100)) FROM lineas_presupuesto WHERE lineas_presupuesto.presupuesto_id = ${presupuestos.id}), 0)`,
    })
    .from(presupuestos)
    .leftJoin(vehiculos, eq(presupuestos.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(presupuestos.clienteId, clientes.id))
    .where(eq(presupuestos.tallerId, tallerId))
    .orderBy(desc(presupuestos.createdAt))
    .limit(PER_PAGE)
    .offset(safeOffset);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Presupuestos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{Number(total)} presupuesto{Number(total) !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {presupuestosList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-bold">Sin presupuestos</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Los presupuestos se crean desde las órdenes de trabajo. Abre una orden y genera un presupuesto con las líneas de trabajo.
          </p>
          <Link href="/ordenes" className="mt-4">
            <Button className="rounded-full">Ver órdenes</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {presupuestosList.map((p) => (
            <Link key={p.id} href={`/presupuestos/${p.id}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-accent/30 transition-all duration-200">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-muted">
                <span className="text-[10px] font-bold text-muted-foreground">PT</span>
                <span className="text-sm font-extrabold leading-none">{p.numero}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{p.matricula}</span>
                  <span className="text-xs text-muted-foreground">{p.marca} {p.modelo}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.clienteNombre}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Badge className={`text-[10px] ${estadoColors[p.estado]}`}>{estadoLabels[p.estado]}</Badge>
                <span className="text-sm font-bold">{Number(p.total).toFixed(2)}€</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          {safePage > 1 ? (
            <Link
              href={`/presupuestos?page=${safePage - 1}`}
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
              href={`/presupuestos?page=${safePage + 1}`}
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
