import { Receipt, TrendingUp, Car, Users, ClipboardList, Calendar, ArrowUpRight, ArrowDownRight, AlertTriangle, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { ordenesTrabajo, lineasOrden, clientes, vehiculos, citas, usuarios } from "@/db/schema";
import { eq, and, sql, count, desc, gte } from "drizzle-orm";
import { CobrosPendientes } from "./cobros-pendientes";
import { ExportGestoria } from "./export-gestoria";

export default async function FacturacionPage() {
  let tallerId: string;
  try {
    const auth = await requireRole(["admin", "recepcion"]);
    tallerId = auth.tallerId;
  } catch {
    redirect("/");
  }
  const db = getDb();

  const now = new Date();
  const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const primerDiaMesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const ultimoDiaMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

  // Stats generales
  const [totalOrdenes] = await db.select({ count: count() }).from(ordenesTrabajo).where(eq(ordenesTrabajo.tallerId, tallerId));
  const [totalClientes] = await db.select({ count: count() }).from(clientes).where(eq(clientes.tallerId, tallerId));
  const [totalVehiculos] = await db.select({ count: count() }).from(vehiculos).where(eq(vehiculos.tallerId, tallerId));
  const [entregadas] = await db.select({ count: count() }).from(ordenesTrabajo).where(and(eq(ordenesTrabajo.tallerId, tallerId), eq(ordenesTrabajo.estado, "entregado")));

  // Órdenes este mes
  const [ordenesMes] = await db.select({ count: count() }).from(ordenesTrabajo).where(and(
    eq(ordenesTrabajo.tallerId, tallerId),
    gte(ordenesTrabajo.createdAt, new Date(primerDiaMes))
  ));

  // Citas este mes
  const [citasMes] = await db.select({ count: count() }).from(citas).where(and(
    eq(citas.tallerId, tallerId),
    gte(citas.fecha, primerDiaMes.split("T")[0])
  ));

  // Facturación total
  const [facturacionTotal] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${lineasOrden.cantidad} AS NUMERIC) * CAST(${lineasOrden.precioUnitario} AS NUMERIC) * (1 + CAST(${lineasOrden.ivaPct} AS NUMERIC) / 100)), 0)`,
    })
    .from(lineasOrden)
    .innerJoin(ordenesTrabajo, eq(lineasOrden.ordenId, ordenesTrabajo.id))
    .where(and(eq(ordenesTrabajo.tallerId, tallerId), eq(ordenesTrabajo.estado, "entregado")));

  // Facturación este mes
  const [facturacionMes] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${lineasOrden.cantidad} AS NUMERIC) * CAST(${lineasOrden.precioUnitario} AS NUMERIC) * (1 + CAST(${lineasOrden.ivaPct} AS NUMERIC) / 100)), 0)`,
    })
    .from(lineasOrden)
    .innerJoin(ordenesTrabajo, eq(lineasOrden.ordenId, ordenesTrabajo.id))
    .where(and(
      eq(ordenesTrabajo.tallerId, tallerId),
      eq(ordenesTrabajo.estado, "entregado"),
      gte(ordenesTrabajo.fechaEntrega, new Date(primerDiaMes))
    ));

  // Últimas completadas
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

  // Cobros pendientes: entregadas y no pagadas
  const ordenesPendientesCobro = await db
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
    .where(and(
      eq(ordenesTrabajo.tallerId, tallerId),
      eq(ordenesTrabajo.estado, "entregado"),
      eq(ordenesTrabajo.pagado, false)
    ))
    .orderBy(desc(ordenesTrabajo.fechaEntrega));

  // Comisiones: mecánicos con sus órdenes entregadas+pagadas este mes
  const mecanicosConComision = await db
    .select({
      id: usuarios.id,
      nombre: usuarios.nombre,
      comisionPct: usuarios.comisionPct,
    })
    .from(usuarios)
    .where(eq(usuarios.tallerId, tallerId));

  const comisionesData = await Promise.all(
    mecanicosConComision.map(async (mec) => {
      const [result] = await db
        .select({
          numOrdenes: sql<number>`count(*)`,
          totalFacturado: sql<number>`COALESCE(SUM((SELECT SUM(CAST(cantidad AS NUMERIC) * CAST(precio_unitario AS NUMERIC) * (1 + CAST(iva_pct AS NUMERIC) / 100)) FROM lineas_orden WHERE lineas_orden.orden_id = ${ordenesTrabajo.id})), 0)`,
        })
        .from(ordenesTrabajo)
        .where(
          and(
            eq(ordenesTrabajo.tallerId, tallerId),
            eq(ordenesTrabajo.asignadoA, mec.id),
            eq(ordenesTrabajo.estado, "entregado"),
            eq(ordenesTrabajo.pagado, true),
            gte(ordenesTrabajo.fechaEntrega, new Date(primerDiaMes))
          )
        );

      const pct = Number(mec.comisionPct ?? 0);
      const totalFact = Number(result?.totalFacturado ?? 0);
      return {
        ...mec,
        numOrdenes: Number(result?.numOrdenes ?? 0),
        totalFacturado: totalFact,
        comisionGanada: totalFact * (pct / 100),
        comisionPctNum: pct,
      };
    })
  );

  // Only show mechanics that have a commission set or have orders
  const comisionesVisibles = comisionesData.filter(
    (c) => c.comisionPctNum > 0 || c.numOrdenes > 0
  );

  const totalFact = Number(facturacionTotal?.total ?? 0);
  const factMes = Number(facturacionMes?.total ?? 0);
  const ticketMedio = (entregadas?.count ?? 0) > 0 ? totalFact / (entregadas?.count ?? 1) : 0;
  const mesActual = now.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Facturación e informes</h1>
          <p className="text-sm text-muted-foreground mt-0.5 capitalize">{mesActual}</p>
        </div>
        <ExportGestoria />
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Facturado total</p>
            <p className="text-2xl font-extrabold text-emerald-800 mt-1">{totalFact.toFixed(0)}€</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Este mes</p>
            <p className="text-2xl font-extrabold text-blue-800 mt-1">{factMes.toFixed(0)}€</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ticket medio</p>
            <p className="text-2xl font-extrabold mt-1">{ticketMedio.toFixed(0)}€</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completadas</p>
            <p className="text-2xl font-extrabold mt-1">{entregadas?.count ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen del mes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Resumen del mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-xl font-extrabold">{ordenesMes?.count ?? 0}</p>
              <p className="text-xs text-muted-foreground">Órdenes creadas</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-xl font-extrabold">{citasMes?.count ?? 0}</p>
              <p className="text-xs text-muted-foreground">Citas</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-xl font-extrabold">{totalClientes?.count ?? 0}</p>
              <p className="text-xs text-muted-foreground">Clientes total</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-xl font-extrabold">{totalVehiculos?.count ?? 0}</p>
              <p className="text-xs text-muted-foreground">Vehículos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Últimas completadas */}
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

      {/* Cobros pendientes */}
      <Card className={ordenesPendientesCobro.length > 0 ? "border-amber-200" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${ordenesPendientesCobro.length > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
            Cobros pendientes
            {ordenesPendientesCobro.length > 0 && (
              <Badge className="bg-amber-500 text-white text-[10px] ml-1">{ordenesPendientesCobro.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CobrosPendientes ordenes={ordenesPendientesCobro} />
        </CardContent>
      </Card>

      {/* Comisiones */}
      {comisionesVisibles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              Comisiones del mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {comisionesVisibles.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{c.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.numOrdenes} {c.numOrdenes === 1 ? "orden" : "órdenes"} completada{c.numOrdenes !== 1 ? "s" : ""}
                      {" · "}Facturado: {c.totalFacturado.toFixed(2)}€
                      {" · "}Comisión: {c.comisionPctNum}%
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-emerald-700">
                      {c.comisionGanada.toFixed(2)}€
                    </p>
                    <p className="text-[10px] text-muted-foreground">comisión</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm font-bold">Total comisiones</span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {comisionesVisibles.reduce((sum, c) => sum + c.comisionGanada, 0).toFixed(2)}€
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* VeriFactu */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="p-4 text-center space-y-2">
          <p className="text-sm font-bold text-amber-800">Facturación electrónica VeriFactu</p>
          <p className="text-xs text-amber-700">
            Obligatorio desde julio 2026. Estamos trabajando en la integración.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
