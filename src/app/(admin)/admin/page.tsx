import {
  Shield, Euro, Store, Users, AlertTriangle, CreditCard,
  Clock, Hourglass, UserPlus, CheckCircle2, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { getDb } from "@/db";
import { talleres, usuarios } from "@/db/schema";
import { count, desc, sql } from "drizzle-orm";
import { formatMoneyShort } from "@/lib/format";

const planColors: Record<string, string> = {
  pendiente: "bg-orange-100 text-orange-700",
  trial: "bg-amber-100 text-amber-700",
  basico: "bg-blue-100 text-blue-700",
  taller: "bg-emerald-100 text-emerald-700",
  pro: "bg-violet-100 text-violet-700",
  cancelado: "bg-zinc-100 text-zinc-400",
};

const planLabels: Record<string, string> = {
  pendiente: "Pendiente",
  trial: "Trial",
  basico: "Básico",
  taller: "Taller",
  pro: "Pro",
  cancelado: "Cancelado",
};

const DAY = 1000 * 60 * 60 * 24;

export default async function AdminResumenPage() {
  const db = getDb();

  const talleresList = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      plan: talleres.plan,
      trialEndsAt: talleres.trialEndsAt,
      activo: talleres.activo,
      estadoCobro: talleres.estadoCobro,
      ultimoAcceso: talleres.ultimoAcceso,
      createdAt: talleres.createdAt,
    })
    .from(talleres)
    .orderBy(desc(talleres.createdAt));

  const [totalTalleres] = await db.select({ count: count() }).from(talleres);
  const [totalUsuarios] = await db.select({ count: count() }).from(usuarios);

  const ahora = Date.now();
  const hace48h = ahora - 2 * DAY;

  const esPagando = (p: string) => ["basico", "taller", "pro"].includes(p);
  const trialVigente = (t: { plan: string; trialEndsAt: Date | null }) =>
    t.plan === "trial" && !!t.trialEndsAt && new Date(t.trialEndsAt).getTime() > ahora;

  const pagando = talleresList.filter((t) => esPagando(t.plan));
  const trialActivo = talleresList.filter(trialVigente);
  const trialExpirado = talleresList.filter(
    (t) => t.plan === "trial" && t.trialEndsAt && new Date(t.trialEndsAt).getTime() <= ahora
  );
  const activos = talleresList.filter((t) => t.activo);
  const pendientes = talleresList.filter((t) => t.plan === "pendiente");
  const nuevos = talleresList.filter((t) => new Date(t.createdAt).getTime() > hace48h);
  const impagados = talleresList.filter((t) => t.estadoCobro === "impagado");
  // Riesgo de fuga: cuenta que paga o está en trial vigente pero no entra hace ≥7 días.
  const enfriandose = talleresList.filter((t) => {
    if (!(esPagando(t.plan) || trialVigente(t))) return false;
    if (!t.ultimoAcceso) return false;
    return ahora - new Date(t.ultimoAcceso).getTime() >= 7 * DAY;
  });

  const mrr = pagando.reduce(
    (s, t) => s + (t.plan === "basico" ? 29 : t.plan === "taller" ? 49 : t.plan === "pro" ? 79 : 0),
    0
  );

  // Bloque "Requiere tu atención": solo lo que tiene cuenta.
  const atencion = [
    { n: pendientes.length, label: "esperando aprobación", icon: Hourglass, href: "/admin/talleres?filtro=pendiente", tone: "orange" as const },
    { n: impagados.length, label: "con recibo impagado", icon: CreditCard, href: "/admin/cobros", tone: "red" as const },
    { n: trialExpirado.length, label: "con trial expirado sin convertir", icon: AlertTriangle, href: "/admin/talleres", tone: "red" as const },
    { n: enfriandose.length, label: "enfriándose (sin entrar +7 días)", icon: Clock, href: "/admin/actividad", tone: "amber" as const },
    { n: nuevos.length, label: "registros nuevos (48 h)", icon: UserPlus, href: "/admin/talleres", tone: "blue" as const },
  ].filter((a) => a.n > 0);

  const toneRow: Record<string, string> = {
    orange: "border-orange-200 bg-orange-50/60 hover:bg-orange-50 text-orange-900",
    red: "border-red-200 bg-red-50/60 hover:bg-red-50 text-red-900",
    amber: "border-amber-200 bg-amber-50/60 hover:bg-amber-50 text-amber-900",
    blue: "border-blue-200 bg-blue-50/60 hover:bg-blue-50 text-blue-900",
  };
  const toneIcon: Record<string, string> = {
    orange: "bg-orange-500", red: "bg-red-500", amber: "bg-amber-500", blue: "bg-blue-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Centro de mando</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Estado de la plataforma de un vistazo</p>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="MRR" value={formatMoneyShort(mrr)} icon={Euro} accent="emerald" sub={`${pagando.length} taller(es) pagando`} />
        <StatCard label="Talleres" value={totalTalleres?.count ?? 0} icon={Store} accent="violet" sub={`${activos.length} activos`} />
        <StatCard label="Cuentas" value={totalUsuarios?.count ?? 0} icon={Users} accent="blue" sub="usuarios totales" />
      </div>

      {/* Requiere tu atención */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Requiere tu atención</h2>
        {atencion.length > 0 ? (
          <div className="space-y-2">
            {atencion.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className={`group flex items-center gap-3 rounded-xl border p-3.5 transition-colors ${toneRow[a.tone]}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${toneIcon[a.tone]}`}>
                  <a.icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </span>
                <p className="flex-1 text-sm font-medium">
                  <span className="font-extrabold tabular-nums">{a.n}</span>{" "}
                  {a.n === 1 ? "taller" : "talleres"} {a.label}
                </p>
                <ArrowRight className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-900">Todo en orden. Nada urgente ahora mismo.</p>
          </div>
        )}
      </section>

      {/* Cartera de un vistazo */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cartera</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { n: trialActivo.length, label: "Trial activo", cls: "text-amber-600" },
            { n: pagando.length, label: "Pagando", cls: "text-emerald-600" },
            { n: trialExpirado.length, label: "Trial expirado", cls: "text-red-600" },
            { n: activos.length, label: "Activos", cls: "text-foreground" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-foreground/[0.07]">
              <p className={`text-2xl font-extrabold tabular-nums ${c.cls}`}>{c.n}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Últimos registros */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Últimos registros</CardTitle>
          <Link href="/admin/talleres" className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
            Ver y gestionar todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {talleresList.slice(0, 5).map((t) => {
              const esNuevo = new Date(t.createdAt).getTime() > hace48h;
              return (
                <Link
                  key={t.id}
                  href={`/admin/talleres/${t.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate font-semibold">{t.nombre}</p>
                    <Badge className={`text-[10px] ${planColors[t.plan] ?? ""}`}>{planLabels[t.plan] ?? t.plan}</Badge>
                    {t.plan === "pendiente" && <Badge className="text-[10px] bg-orange-500 text-white">Por aprobar</Badge>}
                    {esNuevo && t.plan !== "pendiente" && <Badge className="text-[10px] bg-blue-500 text-white">Nuevo</Badge>}
                    {!t.activo && <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">Desactivado</Badge>}
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                    {new Date(t.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
