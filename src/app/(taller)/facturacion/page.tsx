import { Receipt, TrendingUp, Car, Users, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, lineasOrden, clientes, vehiculos } from "@/db/schema";
import { eq, and, sql, count, desc } from "drizzle-orm";

export default async function FacturacionPage() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Estadísticas generales
  const [totalOrdenes] = await db.select({ count: count() }).from(ordenesTrabajo).where(eq(ordenesTrabajo.tallerId, tallerId));
  const [totalClientes] = await db.select({ count: count() }).from(clientes).where(eq(clientes.tallerId, tallerId));
  const [totalVehiculos] = await db.select({ count: count() }).from(vehiculos).where(eq(vehiculos.tallerId, tallerId));
  const [entregadas] = await db.select({ count: count() }).from(ordenesTrabajo).where(and(eq(ordenesTrabajo.tallerId, tallerId), eq(ordenesTrabajo.estado, "entregado")));

  // Facturación total (suma de líneas de órdenes entregadas)
  const [facturacion] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${lineasOrden.cantidad} AS NUMERIC) * CAST(${lineasOrden.precioUnitario} AS NUMERIC) * (1 + CAST(${lineasOrden.ivaPct} AS NUMERIC) / 100)), 0)`,
    })
    .from(lineasOrden)
    .innerJoin(ordenesTrabajo, eq(lineasOrden.ordenId, ordenesTrabajo.id))
    .where(and(
      eq(ordenesTrabajo.tallerId, tallerId),
      eq(ordenesTrabajo.estado, "entregado")
    ));

  // Últimas órdenes entregadas
  const ultimasEntregadas = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      fechaEntrega: ordenesTrabajo.fechaEntrega,
      matricula: vehiculos.matricula,
      clienteNombre: clientes.nombre,
      total: sql<number>`COALESCE((SELECT SUM(CAST(cantidad AS NUMERIC) * CAST(precio_unitario AS NUMERIC) * (1 + CAST(iva_pct AS NUMERIC) / 100)) FROM lineas_orden WHERE lineas_orden.orden_id = ${ordenesTrabajo.id}), 0)`,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .where(and(eq(ordenesTrabajo.tallerId, tallerId), eq(ordenesTrabajo.estado, "entregado")))
    .orderBy(desc(ordenesTrabajo.fechaEntrega))
    .limit(10);

  const totalFacturado = Number(facturacion?.total ?? 0);
  const ticketMedio = (entregadas?.count ?? 0) > 0 ? totalFacturado / (entregadas?.count ?? 1) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Facturación</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Resumen de actividad del taller</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold leading-none">{totalFacturado.toFixed(0)}€</p>
                <p className="text-xs text-muted-foreground mt-0.5">Facturado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold leading-none">{ticketMedio.toFixed(0)}€</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ticket medio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                <ClipboardList className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-xl font-extrabold leading-none">{totalOrdenes?.count ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Órdenes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold leading-none">{totalClientes?.count ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas entregadas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Últimas órdenes completadas</CardTitle>
        </CardHeader>
        <CardContent>
          {ultimasEntregadas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No hay órdenes completadas todavía</p>
          ) : (
            <div className="space-y-2">
              {ultimasEntregadas.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-muted-foreground">OR-{o.numero}</span>
                    <span className="text-sm font-medium">{o.matricula}</span>
                    <span className="text-xs text-muted-foreground truncate">{o.clienteNombre}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold">{Number(o.total).toFixed(2)}€</span>
                    {o.fechaEntrega && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(o.fechaEntrega).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* VeriFactu */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="p-4 text-center space-y-2">
          <p className="text-sm font-bold text-amber-800">Facturación VeriFactu</p>
          <p className="text-xs text-amber-700">
            La facturación electrónica compatible con VeriFactu estará disponible próximamente. Obligatorio desde julio 2026.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
