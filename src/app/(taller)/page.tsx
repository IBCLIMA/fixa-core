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
import { eq, and, count, sql, desc } from "drizzle-orm";

const estadoLabels: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "Diagnóstico",
  presupuestado: "Presupuestado",
  aprobado: "Aprobado",
  en_reparacion: "En reparación",
  esperando_recambio: "Esp. recambio",
  listo: "Listo",
  entregado: "Entregado",
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
};

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
  const hoy = new Date().toISOString().split("T")[0];

  // Queries
  const [clientesResult] = await db.select({ count: count() }).from(clientes).where(eq(clientes.tallerId, tallerId));
  const [citasCountResult] = await db.select({ count: count() }).from(citas).where(and(eq(citas.tallerId, tallerId), eq(citas.fecha, hoy)));

  // Ordenes activas con vehiculo y cliente
  const ordenesActivas = await db
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
    .orderBy(desc(ordenesTrabajo.createdAt));

  // Citas de hoy
  const citasHoy = await db
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
    .orderBy(citas.horaInicio);

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
          <Link href="/ordenes/nueva">
            <Button size="sm" variant="outline" className="rounded-full"><Plus className="mr-1.5 h-4 w-4" />Manual</Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
      </div>

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
                    <a href={`https://wa.me/34${o.clienteTelefono?.replace(/\s/g, "")}?text=${encodeURIComponent(`Hola ${o.clienteNombre?.split(" ")[0]}, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!`)}`} target="_blank" className="flex h-8 items-center gap-1 rounded-full bg-emerald-600 px-3 text-white text-xs font-bold hover:bg-emerald-500 transition-colors">
                      <MessageSquare className="h-3 w-3" />Avisar
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
                <p className="text-sm text-muted-foreground">No hay coches en taller</p>
                <Link href="/ordenes/nueva" className="mt-3"><Button size="sm" variant="outline" className="rounded-full"><Plus className="mr-1 h-3 w-3" />Nueva orden</Button></Link>
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
                <p className="text-sm text-muted-foreground">No hay citas para hoy</p>
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
    </div>
  );
}
