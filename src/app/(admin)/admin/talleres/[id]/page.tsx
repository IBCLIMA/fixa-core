import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Building2, Users, Car, ClipboardList, CalendarDays, UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import { talleres, usuarios, clientes, vehiculos, ordenesTrabajo, citas } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { TallerAcciones } from "./acciones-cliente";
import type { Plan } from "../acciones";

export const metadata = { title: "Detalle de taller · FIXA Admin" };

const planColors: Record<string, string> = {
  pendiente: "bg-brand-100 text-brand-700",
  trial: "bg-amber-100 text-amber-700",
  basico: "bg-blue-100 text-blue-700",
  taller: "bg-emerald-100 text-emerald-700",
  pro: "bg-violet-100 text-violet-700",
  cancelado: "bg-zinc-100 text-zinc-500",
};

const planLabels: Record<string, string> = {
  pendiente: "Pendiente de aprobación",
  trial: "Trial",
  basico: "Básico · 29€/mes",
  taller: "Taller · 49€/mes",
  pro: "Pro · 79€/mes",
  cancelado: "Cancelado",
};

const rolLabels: Record<string, string> = {
  admin: "Administrador",
  mecanico: "Mecánico",
  recepcion: "Recepción",
};

function fecha(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fechaCorta(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function Dato({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-zinc-800">{value || "—"}</p>
    </div>
  );
}

function Contador({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100">
          <Icon className="h-4.5 w-4.5 text-stone-500" />
        </div>
        <div>
          <p className="text-xl font-extrabold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function TallerDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const [taller] = await db.select().from(talleres).where(eq(talleres.id, id));
  if (!taller) notFound();

  const [
    [{ count: nClientes }],
    [{ count: nVehiculos }],
    [{ count: nOrdenes }],
    [{ count: nCitas }],
    usuariosList,
  ] = await Promise.all([
    db.select({ count: count() }).from(clientes).where(eq(clientes.tallerId, id)),
    db.select({ count: count() }).from(vehiculos).where(eq(vehiculos.tallerId, id)),
    db.select({ count: count() }).from(ordenesTrabajo).where(eq(ordenesTrabajo.tallerId, id)),
    db.select({ count: count() }).from(citas).where(eq(citas.tallerId, id)),
    db
      .select({ id: usuarios.id, nombre: usuarios.nombre, rol: usuarios.rol, createdAt: usuarios.createdAt })
      .from(usuarios)
      .where(eq(usuarios.tallerId, id)),
  ]);

  const trialDaysLeft = taller.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(taller.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;
  const trialExpired = taller.plan === "trial" && trialDaysLeft === 0;
  const direccionCompleta = [taller.direccion, taller.codigoPostal, taller.ciudad, taller.provincia]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Volver */}
      <Link
        href="/admin/talleres"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Talleres
      </Link>

      {/* Cabecera */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{taller.nombre}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge className={`text-[10px] ${planColors[taller.plan]}`}>{planLabels[taller.plan]}</Badge>
              {taller.activo ? (
                <Badge className="text-[10px] bg-emerald-100 text-emerald-700">Activo</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-red-200 text-red-500">Desactivado</Badge>
              )}
              {taller.plan === "trial" && trialDaysLeft !== null && (
                <Badge className={`text-[10px] ${trialExpired ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {trialExpired ? "Trial expirado" : `${trialDaysLeft} días de trial`}
                </Badge>
              )}
              {taller.suscripcionActiva && (
                <Badge className="text-[10px] bg-blue-100 text-blue-700">Suscripción activa</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Contador icon={Users} label="Clientes" value={Number(nClientes)} />
        <Contador icon={Car} label="Vehículos" value={Number(nVehiculos)} />
        <Contador icon={ClipboardList} label="Órdenes" value={Number(nOrdenes)} />
        <Contador icon={CalendarDays} label="Citas" value={Number(nCitas)} />
        <Contador icon={UserCog} label="Usuarios" value={usuariosList.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna izquierda: datos + usuarios */}
        <div className="space-y-6 lg:col-span-2">
          {/* Datos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Datos del taller</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Dato label="Nombre" value={taller.nombre} />
              <Dato label="CIF" value={taller.cif} />
              <Dato label="Email" value={taller.email} />
              <Dato label="Teléfono" value={taller.telefono} />
              <Dato label="Dirección" value={direccionCompleta} />
              <Dato label="Registro industrial" value={taller.registroIndustrial} />
            </CardContent>
          </Card>

          {/* Suscripción / actividad */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Suscripción y actividad</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Dato label="Plan" value={planLabels[taller.plan]} />
              <Dato
                label="Fin de trial"
                value={taller.trialEndsAt ? fechaCorta(taller.trialEndsAt) : "—"}
              />
              <Dato label="Suscripción activa" value={taller.suscripcionActiva ? "Sí" : "No"} />
              <Dato label="Stripe Customer" value={taller.stripeCustomerId} />
              <Dato label="Fecha de alta" value={fecha(taller.createdAt)} />
              <Dato label="Último acceso" value={fecha(taller.ultimoAcceso)} />
            </CardContent>
          </Card>

          {/* Usuarios */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Usuarios ({usuariosList.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {usuariosList.length === 0 ? (
                <p className="text-sm text-muted-foreground">Este taller no tiene usuarios.</p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {usuariosList.map((u) => (
                    <div key={u.id} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="text-sm font-semibold">{u.nombre}</p>
                        <p className="text-xs text-muted-foreground">Alta: {fechaCorta(u.createdAt)}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{rolLabels[u.rol] ?? u.rol}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: acciones */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-stone-400">Acciones</h2>
            <TallerAcciones
              tallerId={taller.id}
              nombre={taller.nombre}
              plan={taller.plan as Plan}
              activo={taller.activo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
