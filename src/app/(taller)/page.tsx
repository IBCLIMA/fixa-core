import {
  Car,
  ClipboardList,
  CalendarDays,
  Receipt,
  Plus,
  ArrowRight,
  MessageSquare,
  Clock,
  Phone,
  CreditCard,
  BarChart3,
  Rocket,
  Users,
  Settings,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { EntradaRapida } from "./entrada-rapida";
import { TourGuiado } from "./tour-guiado";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, clientes, citas, vehiculos } from "@/db/schema";
import { eq, and, count, sql, desc, sum } from "drizzle-orm";
import { estadoLabels, estadoColors } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";
import { getVehicleAbandonment, type VehicleAbandonment } from "@/lib/vehicle-alerts";
import { AlertTriangle } from "lucide-react";

const estadoDots: Record<string, string> = {
  recibido: "bg-zinc-400",
  diagnostico: "bg-blue-500",
  presupuestado: "bg-amber-500",
  aprobado: "bg-emerald-500",
  en_reparacion: "bg-orange-500",
  esperando_recambio: "bg-red-500",
  listo: "bg-emerald-600",
};

export default async function PanelDelDia() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Check if this is a brand new workshop - redirect to onboarding
  const taller = await db.query.talleres.findFirst({
    where: eq(require("@/db/schema").talleres.id, tallerId),
  });
  if (taller && (!taller.nombre || taller.nombre === "Mi Taller") && !taller.telefono) {
    const { redirect } = require("next/navigation");
    redirect("/bienvenida");
  }

  const hoy = new Date().toISOString().split("T")[0];

  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  const mananaStr = manana.toISOString().split("T")[0];

  // All queries in parallel - wrapped in try/catch for resilience
  let clientesResult: any = { count: 0 };
  let ordenesActivas: any[] = [];
  let citasHoy: any[] = [];
  let cobrosPendientesResult: any = { count: 0 };
  let ordenesHoy: any[] = [];
  let entregadasHoyResult: any = { count: 0 };
  let facturacionHoyResult: any = { total: 0 };
  let citasManana: any[] = [];
  let vehiculosAbandonados: VehicleAbandonment[] = [];

  try {
  const [
    [_clientesResult],
    _ordenesActivas,
    _citasHoy,
    [cobrosPendientesResult],
    ordenesHoy,
    [entregadasHoyResult],
    [facturacionHoyResult],
    citasManana,
  ] = await Promise.all([
    // Clientes count
    db.select({ count: count() }).from(clientes).where(eq(clientes.tallerId, tallerId)),
    // Ordenes activas con vehiculo y cliente
    db
      .select({
        id: ordenesTrabajo.id,
        numero: ordenesTrabajo.numero,
        estado: ordenesTrabajo.estado,
        descripcionCliente: ordenesTrabajo.descripcionCliente,
        fechaEntrada: ordenesTrabajo.fechaEntrada,
        matricula: vehiculos.matricula,
        marca: vehiculos.marca,
        modelo: vehiculos.modelo,
        clienteNombre: clientes.nombre,
        clienteTelefono: clientes.telefono,
      })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
      .where(and(
        eq(ordenesTrabajo.tallerId, tallerId),
        sql`${ordenesTrabajo.estado} NOT IN ('entregado', 'cancelado')`
      ))
      .orderBy(desc(ordenesTrabajo.createdAt)),
    // Citas de hoy
    db
      .select({
        id: citas.id,
        nombreCliente: citas.nombreCliente,
        telefonoCliente: citas.telefonoCliente,
        horaInicio: citas.horaInicio,
        motivo: citas.motivo,
        estado: citas.estado,
      })
      .from(citas)
      .where(and(eq(citas.tallerId, tallerId), eq(citas.fecha, hoy)))
      .orderBy(citas.horaInicio),
    // Cobros pendientes
    db
      .select({ count: count() })
      .from(ordenesTrabajo)
      .where(and(
        eq(ordenesTrabajo.tallerId, tallerId),
        eq(ordenesTrabajo.estado, "entregado"),
        eq(ordenesTrabajo.pagado, false)
      )),
    // Órdenes creadas hoy
    db
      .select({
        id: ordenesTrabajo.id,
        numero: ordenesTrabajo.numero,
        matricula: vehiculos.matricula,
        clienteNombre: clientes.nombre,
      })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
      .where(and(
        eq(ordenesTrabajo.tallerId, tallerId),
        sql`${ordenesTrabajo.fechaEntrada}::date = ${hoy}`
      ))
      .orderBy(desc(ordenesTrabajo.createdAt)),
    // Órdenes entregadas hoy
    db
      .select({ count: count() })
      .from(ordenesTrabajo)
      .where(and(
        eq(ordenesTrabajo.tallerId, tallerId),
        sql`${ordenesTrabajo.fechaEntrega}::date = ${hoy}`
      )),
    // Facturación del día (pagadas hoy)
    db
      .select({ total: sum(ordenesTrabajo.importeTotal) })
      .from(ordenesTrabajo)
      .where(and(
        eq(ordenesTrabajo.tallerId, tallerId),
        eq(ordenesTrabajo.pagado, true),
        sql`${ordenesTrabajo.fechaPago}::date = ${hoy}`
      )),
    // Citas de mañana
    db
      .select({
        id: citas.id,
        nombreCliente: citas.nombreCliente,
        horaInicio: citas.horaInicio,
        motivo: citas.motivo,
      })
      .from(citas)
      .where(and(eq(citas.tallerId, tallerId), eq(citas.fecha, mananaStr)))
      .orderBy(citas.horaInicio),
  ]);

  clientesResult = _clientesResult;
  ordenesActivas = _ordenesActivas;
  citasHoy = _citasHoy;
  } catch (e) {
    console.error("Dashboard query error:", e);
  }

  try {
    vehiculosAbandonados = await getVehicleAbandonment(tallerId);
  } catch (e) {
    console.error("Vehicle abandonment query error:", e);
  }

  const cobrosPendientes = cobrosPendientesResult?.count ?? 0;
  const entregadasHoy = entregadasHoyResult?.count ?? 0;
  const facturacionHoy = Number(facturacionHoyResult?.total || 0);

  const cochesListos = ordenesActivas.filter((o) => o.estado === "listo");
  const totalClientes = clientesResult?.count ?? 0;

  const fechaHoy = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground capitalize">{fechaHoy}</p>
          <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">Panel del día</h1>
        </div>
        <div className="flex items-center gap-2">
          <TourGuiado />
          <div id="btn-entrada-rapida"><EntradaRapida /></div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div id="kpi-en-taller" className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-500/20">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-stone-900">{ordenesActivas.length}</p>
              <p className="text-xs text-stone-400 font-medium mt-0.5">En taller</p>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-blue-500/[0.04]" />
        </div>
        <div id="kpi-citas" className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm shadow-orange-500/20">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-stone-900">{citasHoy.length}</p>
              <p className="text-xs text-stone-400 font-medium mt-0.5">Citas hoy</p>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-orange-500/[0.04]" />
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-sm shadow-violet-500/20">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-stone-900">{totalClientes}</p>
              <p className="text-xs text-stone-400 font-medium mt-0.5">Clientes</p>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-violet-500/[0.04]" />
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/60 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm shadow-emerald-500/20">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none text-stone-900">{cochesListos.length}</p>
              <p className="text-xs text-stone-400 font-medium mt-0.5">Listos</p>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-500/[0.04]" />
        </div>
        <Link href="/facturacion" className={`relative overflow-hidden rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${cobrosPendientes > 0 ? "bg-amber-50 border border-amber-300" : "bg-white border border-stone-200/60"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${cobrosPendientes > 0 ? "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20" : "bg-gradient-to-br from-stone-400 to-stone-500 shadow-stone-400/20"}`}>
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className={`text-2xl font-extrabold leading-none ${cobrosPendientes > 0 ? "text-amber-900" : "text-stone-900"}`}>{cobrosPendientes}</p>
              <p className={`text-xs font-medium mt-0.5 ${cobrosPendientes > 0 ? "text-amber-600" : "text-stone-400"}`}>Cobros pend.</p>
            </div>
          </div>
          {cobrosPendientes > 0 && (
            <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          )}
          <div className={`absolute -top-4 -right-4 h-16 w-16 rounded-full ${cobrosPendientes > 0 ? "bg-amber-500/[0.08]" : "bg-stone-500/[0.04]"}`} />
        </Link>
      </div>

      {/* Primeros pasos — solo si el taller está vacío */}
      {ordenesActivas.length === 0 && totalClientes === 0 && citasHoy.length === 0 && (
        <Card className="border-brand/30 bg-brand/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">Bienvenido a FIXA</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Configura tu taller en tres pasos para empezar a trabajar.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/clientes" className="flex items-center justify-between rounded-xl bg-white border border-border p-3 hover:border-brand/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                    <Users className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">1. Añade tu primer cliente</p>
                    <p className="text-xs text-muted-foreground">Nombre, teléfono y vehículo</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <div className="flex items-center justify-between rounded-xl bg-white border border-border p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">2. Crea tu primera orden</p>
                    <p className="text-xs text-muted-foreground">Usa el boton Entrada Rapida de arriba</p>
                  </div>
                </div>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </div>
              <Link href="/configuracion" className="flex items-center justify-between rounded-xl bg-white border border-border p-3 hover:border-brand/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                    <Settings className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">3. Configura tu taller</p>
                    <p className="text-xs text-muted-foreground">Nombre, horario y cita online</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coches listos para entregar */}
      {cochesListos.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-emerald-800 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Listos para entregar ({cochesListos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cochesListos.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl bg-white border border-emerald-200 p-3">
                  <Link href={`/ordenes/${o.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div>
                      <p className="text-sm font-bold">{o.matricula}</p>
                      <p className="text-xs text-muted-foreground">{o.clienteNombre}</p>
                    </div>
                  </Link>
                  {o.clienteTelefono && (
                    <a href={formatWhatsAppUrl(o.clienteTelefono!, `Hola ${o.clienteNombre?.split(" ")[0]}, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!`)} target="_blank" className="flex h-11 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-white text-xs font-bold hover:bg-emerald-500 transition-colors">
                      <MessageSquare className="h-3 w-3" />Avisar
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehículos pendientes de recogida (abandono) */}
      {vehiculosAbandonados.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Vehiculos pendientes de recogida ({vehiculosAbandonados.length})
            </CardTitle>
            <p className="text-xs text-amber-700 mt-1">
              Estos vehiculos llevan mas de 3 dias listos sin ser recogidos. Segun la ley puedes cobrar gastos de estancia.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vehiculosAbandonados.map((v) => (
                <div key={v.ordenId} className="flex items-center justify-between rounded-xl bg-white border border-amber-200 p-3">
                  <Link href={`/ordenes/${v.ordenId}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{v.matricula}</p>
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                          {v.diasSinRecoger} dias
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{v.clienteNombre}</p>
                    </div>
                  </Link>
                  {v.clienteTelefono && (
                    <a href={formatWhatsAppUrl(v.clienteTelefono, `Hola ${v.clienteNombre.split(" ")[0]}, te recordamos que tu vehiculo esta listo para recoger desde hace ${v.diasSinRecoger} dias. Por favor, pasa a recogerlo lo antes posible. Gracias.`)} target="_blank" className="flex h-11 items-center gap-1.5 rounded-xl bg-amber-600 px-4 text-white text-xs font-bold hover:bg-amber-500 transition-colors">
                      <MessageSquare className="h-3 w-3" />Recordar
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coches en taller */}
        <Card id="coches-en-taller">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4 text-muted-foreground" />Coches en taller</CardTitle>
              <Link href="/ordenes"><Button variant="ghost" size="sm" className="text-xs">Ver todos<ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent>
            {ordenesActivas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Car className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm font-medium">No hay coches en taller</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">Cuando registres una entrada, el vehiculo aparecera aqui con su estado.</p>
                <div className="mt-3"><EntradaRapida /></div>
              </div>
            ) : (
              <div className="space-y-2">
                {ordenesActivas.slice(0, 8).map((o) => (
                  <Link key={o.id} href={`/ordenes/${o.id}`} className="flex items-center justify-between rounded-xl bg-muted/50 hover:bg-muted px-3 py-2.5 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${estadoDots[o.estado] || "bg-zinc-400"}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{o.matricula}</span>
                          <span className="text-xs text-muted-foreground truncate">{o.marca} {o.modelo}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{o.clienteNombre}{o.descripcionCliente ? ` · ${o.descripcionCliente}` : ""}</p>
                      </div>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${estadoColors[o.estado] || ""}`}>{estadoLabels[o.estado]}</Badge>
                  </Link>
                ))}
                {ordenesActivas.length > 8 && (
                  <div className="pt-1 space-y-1">
                    <p className="text-xs text-muted-foreground text-center">
                      Mostrando 8 de {ordenesActivas.length} órdenes activas
                    </p>
                    <Link href="/ordenes" className="block text-center">
                      <span className="text-xs font-bold text-brand hover:underline">
                        Ver todas las órdenes &rarr;
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Citas de hoy */}
        <Card id="citas-hoy">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" />Citas de hoy</CardTitle>
              <Link href="/calendario"><Button variant="ghost" size="sm" className="text-xs">Calendario<ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent>
            {citasHoy.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm font-medium">No hay citas para hoy</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">Programa citas de entrada para organizar tu dia.</p>
                <Link href="/calendario" className="mt-3"><Button size="sm" variant="outline" className="rounded-full"><Plus className="mr-1 h-3 w-3" />Nueva cita</Button></Link>
              </div>
            ) : (
              <div className="space-y-2">
                {citasHoy.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {c.horaInicio && <span className="text-xs font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded shrink-0">{String(c.horaInicio).slice(0, 5)}</span>}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{c.nombreCliente}</p>
                        {c.motivo && <p className="text-xs text-muted-foreground truncate">{c.motivo}</p>}
                      </div>
                    </div>
                    {c.telefonoCliente && (
                      <a href={`tel:${c.telefonoCliente}`} className="shrink-0">
                        <Phone className="h-4 w-4 text-muted-foreground hover:text-brand transition-colors" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen del día */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            Resumen del día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-2xl font-extrabold text-stone-900">{ordenesHoy.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Creadas hoy</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-2xl font-extrabold text-stone-900">{entregadasHoy}</p>
              <p className="text-xs text-muted-foreground font-medium">Entregadas hoy</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-2xl font-extrabold text-stone-900">{facturacionHoy.toFixed(2)}€</p>
              <p className="text-xs text-muted-foreground font-medium">Facturación</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-2xl font-extrabold text-stone-900">{citasManana.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Citas mañana</p>
            </div>
          </div>

          {/* Órdenes creadas hoy */}
          {ordenesHoy.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Órdenes creadas hoy</p>
              <div className="space-y-1">
                {ordenesHoy.map((o) => (
                  <Link key={o.id} href={`/ordenes/${o.id}`} className="flex items-center gap-2 rounded-lg bg-muted/50 hover:bg-muted px-3 py-2 transition-colors text-sm">
                    <span className="font-bold">OR-{o.numero}</span>
                    <span className="text-muted-foreground">{o.matricula}</span>
                    <span className="text-muted-foreground truncate">{o.clienteNombre}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Citas de mañana */}
          {citasManana.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Citas de mañana</p>
              <div className="space-y-1">
                {citasManana.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                    {c.horaInicio && <span className="font-mono text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">{String(c.horaInicio).slice(0, 5)}</span>}
                    <span className="font-medium">{c.nombreCliente}</span>
                    {c.motivo && <span className="text-muted-foreground truncate">{c.motivo}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
