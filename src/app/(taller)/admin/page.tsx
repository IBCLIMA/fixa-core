import { Shield, Users, ClipboardList, Car, Calendar, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSuperAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { talleres, usuarios, clientes, vehiculos, ordenesTrabajo } from "@/db/schema";
import { count, eq, desc, sql } from "drizzle-orm";

const planColors: Record<string, string> = {
  trial: "bg-amber-100 text-amber-700",
  basico: "bg-blue-100 text-blue-700",
  taller: "bg-emerald-100 text-emerald-700",
  pro: "bg-violet-100 text-violet-700",
  cancelado: "bg-zinc-100 text-zinc-400",
};

const planLabels: Record<string, string> = {
  trial: "Trial",
  basico: "Básico 29€",
  taller: "Taller 49€",
  pro: "Pro 79€",
  cancelado: "Cancelado",
};

export default async function AdminPage() {
  const isSuperAdmin = await getSuperAdmin();
  if (!isSuperAdmin) redirect("/");

  const db = getDb();

  // Todos los talleres con stats
  const talleresList = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      email: talleres.email,
      telefono: talleres.telefono,
      cif: talleres.cif,
      plan: talleres.plan,
      trialEndsAt: talleres.trialEndsAt,
      activo: talleres.activo,
      ultimoAcceso: talleres.ultimoAcceso,
      createdAt: talleres.createdAt,
      stripeCustomerId: talleres.stripeCustomerId,
      clientesCount: sql<number>`(SELECT COUNT(*) FROM clientes WHERE clientes.taller_id = ${talleres.id})`,
      vehiculosCount: sql<number>`(SELECT COUNT(*) FROM vehiculos WHERE vehiculos.taller_id = ${talleres.id})`,
      ordenesCount: sql<number>`(SELECT COUNT(*) FROM ordenes_trabajo WHERE ordenes_trabajo.taller_id = ${talleres.id})`,
      usuariosCount: sql<number>`(SELECT COUNT(*) FROM usuarios WHERE usuarios.taller_id = ${talleres.id})`,
    })
    .from(talleres)
    .orderBy(desc(talleres.createdAt));

  // Stats globales
  const [totalTalleres] = await db.select({ count: count() }).from(talleres);
  const [totalUsuarios] = await db.select({ count: count() }).from(usuarios);
  const [totalClientes] = await db.select({ count: count() }).from(clientes);
  const [totalOrdenes] = await db.select({ count: count() }).from(ordenesTrabajo);

  const talleresActivos = talleresList.filter((t) => t.activo);
  const talleresTrialActivo = talleresList.filter((t) => {
    if (t.plan !== "trial") return false;
    if (!t.trialEndsAt) return false;
    return new Date(t.trialEndsAt) > new Date();
  });
  const talleresTrialExpirado = talleresList.filter((t) => {
    if (t.plan !== "trial") return false;
    if (!t.trialEndsAt) return false;
    return new Date(t.trialEndsAt) <= new Date();
  });
  const talleresPagando = talleresList.filter((t) => ["basico", "taller", "pro"].includes(t.plan));

  // MRR (Monthly Recurring Revenue)
  const mrr = talleresPagando.reduce((sum, t) => {
    if (t.plan === "basico") return sum + 29;
    if (t.plan === "taller") return sum + 49;
    if (t.plan === "pro") return sum + 79;
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Panel de administración</h1>
          <p className="text-sm text-muted-foreground">Control total de FIXA</p>
        </div>
      </div>

      {/* KPIs globales */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">MRR</p>
            <p className="text-2xl font-extrabold text-emerald-800 mt-1">{mrr}€</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Talleres</p>
            <p className="text-2xl font-extrabold mt-1">{totalTalleres?.count ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Usuarios</p>
            <p className="text-2xl font-extrabold mt-1">{totalUsuarios?.count ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Clientes total</p>
            <p className="text-2xl font-extrabold mt-1">{totalClientes?.count ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Órdenes total</p>
            <p className="text-2xl font-extrabold mt-1">{totalOrdenes?.count ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
          <p className="text-xl font-extrabold text-amber-700">{talleresTrialActivo.length}</p>
          <p className="text-xs text-amber-600 font-medium">Trial activo</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
          <p className="text-xl font-extrabold text-red-700">{talleresTrialExpirado.length}</p>
          <p className="text-xs text-red-600 font-medium">Trial expirado</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
          <p className="text-xl font-extrabold text-emerald-700">{talleresPagando.length}</p>
          <p className="text-xs text-emerald-600 font-medium">Pagando</p>
        </div>
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-center">
          <p className="text-xl font-extrabold text-stone-700">{talleresActivos.length}</p>
          <p className="text-xs text-stone-600 font-medium">Activos total</p>
        </div>
      </div>

      {/* Lista de talleres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Todos los talleres ({talleresList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {talleresList.map((t) => {
              const trialDaysLeft = t.trialEndsAt
                ? Math.max(0, Math.ceil((new Date(t.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                : 0;
              const trialExpired = t.plan === "trial" && trialDaysLeft === 0;

              return (
                <div key={t.id} className={`rounded-xl border p-4 ${trialExpired ? "border-red-200 bg-red-50/30" : "border-stone-200"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold">{t.nombre}</p>
                        <Badge className={`text-[10px] ${planColors[t.plan]}`}>{planLabels[t.plan]}</Badge>
                        {!t.activo && <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">Desactivado</Badge>}
                        {trialExpired && <Badge className="text-[10px] bg-red-100 text-red-700">Trial expirado</Badge>}
                        {t.plan === "trial" && !trialExpired && trialDaysLeft <= 3 && (
                          <Badge className="text-[10px] bg-amber-100 text-amber-700">{trialDaysLeft} días restantes</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        {t.email && <span>{t.email}</span>}
                        {t.telefono && <span>{t.telefono}</span>}
                        {t.cif && <span>CIF: {t.cif}</span>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t.usuariosCount} usuarios</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t.clientesCount} clientes</span>
                        <span className="flex items-center gap-1"><Car className="h-3 w-3" />{t.vehiculosCount} vehículos</span>
                        <span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" />{t.ordenesCount} órdenes</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-[10px] text-muted-foreground">
                        Registro: {new Date(t.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "2-digit" })}
                      </p>
                      {t.ultimoAcceso && (
                        <p className="text-[10px] text-muted-foreground">
                          Último acceso: {new Date(t.ultimoAcceso).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        </p>
                      )}
                      {t.plan === "trial" && t.trialEndsAt && (
                        <p className={`text-[10px] font-bold ${trialExpired ? "text-red-600" : "text-amber-600"}`}>
                          Trial: {trialExpired ? "expirado" : `${trialDaysLeft} días`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
