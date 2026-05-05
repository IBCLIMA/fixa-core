import { Shield, Users, ClipboardList, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSuperAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { talleres, usuarios, clientes, vehiculos, ordenesTrabajo } from "@/db/schema";
import { count, desc, sql } from "drizzle-orm";
import { AdminTallerActions } from "./admin-actions";

const planColors: Record<string, string> = {
  trial: "bg-amber-100 text-amber-700",
  basico: "bg-blue-100 text-blue-700",
  taller: "bg-emerald-100 text-emerald-700",
  pro: "bg-violet-100 text-violet-700",
  cancelado: "bg-zinc-100 text-zinc-400",
};

const planLabels: Record<string, string> = {
  trial: "Trial",
  basico: "Básico 29€/mes",
  taller: "Taller 49€/mes",
  pro: "Pro 79€/mes",
  cancelado: "Cancelado",
};

export default async function AdminPage() {
  const isSuperAdmin = await getSuperAdmin();
  if (!isSuperAdmin) redirect("/");

  const db = getDb();

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
      clientesCount: sql<number>`(SELECT COUNT(*) FROM clientes WHERE clientes.taller_id = ${talleres.id})`,
      vehiculosCount: sql<number>`(SELECT COUNT(*) FROM vehiculos WHERE vehiculos.taller_id = ${talleres.id})`,
      ordenesCount: sql<number>`(SELECT COUNT(*) FROM ordenes_trabajo WHERE ordenes_trabajo.taller_id = ${talleres.id})`,
      usuariosCount: sql<number>`(SELECT COUNT(*) FROM usuarios WHERE usuarios.taller_id = ${talleres.id})`,
    })
    .from(talleres)
    .orderBy(desc(talleres.createdAt));

  const [totalTalleres] = await db.select({ count: count() }).from(talleres);
  const [totalUsuarios] = await db.select({ count: count() }).from(usuarios);
  const [totalClientes] = await db.select({ count: count() }).from(clientes);
  const [totalOrdenes] = await db.select({ count: count() }).from(ordenesTrabajo);

  const talleresPagando = talleresList.filter((t) => ["basico", "taller", "pro"].includes(t.plan));
  const talleresTrialActivo = talleresList.filter((t) => t.plan === "trial" && t.trialEndsAt && new Date(t.trialEndsAt) > new Date());
  const talleresTrialExpirado = talleresList.filter((t) => t.plan === "trial" && t.trialEndsAt && new Date(t.trialEndsAt) <= new Date());

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
          <p className="text-sm text-muted-foreground">Gestiona talleres, planes y facturación</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">MRR</p>
            <p className="text-2xl font-extrabold text-emerald-800 mt-1">{mrr}€</p>
          </CardContent>
        </Card>
        <Card><CardContent className="p-4"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Talleres</p><p className="text-2xl font-extrabold mt-1">{totalTalleres?.count ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Usuarios</p><p className="text-2xl font-extrabold mt-1">{totalUsuarios?.count ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Clientes</p><p className="text-2xl font-extrabold mt-1">{totalClientes?.count ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Órdenes</p><p className="text-2xl font-extrabold mt-1">{totalOrdenes?.count ?? 0}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center"><p className="text-xl font-extrabold text-amber-700">{talleresTrialActivo.length}</p><p className="text-xs text-amber-600 font-medium">Trial activo</p></div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center"><p className="text-xl font-extrabold text-red-700">{talleresTrialExpirado.length}</p><p className="text-xs text-red-600 font-medium">Trial expirado</p></div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center"><p className="text-xl font-extrabold text-emerald-700">{talleresPagando.length}</p><p className="text-xs text-emerald-600 font-medium">Pagando</p></div>
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-center"><p className="text-xl font-extrabold text-stone-700">{talleresList.filter((t) => t.activo).length}</p><p className="text-xs text-stone-600 font-medium">Activos</p></div>
      </div>

      {/* Talleres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Gestión de talleres ({talleresList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {talleresList.map((t) => {
              const trialDaysLeft = t.trialEndsAt ? Math.max(0, Math.ceil((new Date(t.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
              const trialExpired = t.plan === "trial" && trialDaysLeft === 0 && t.trialEndsAt;

              return (
                <div key={t.id} className={`rounded-xl border p-4 ${trialExpired ? "border-red-200 bg-red-50/30" : "border-stone-200"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold">{t.nombre}</p>
                        <Badge className={`text-[10px] ${planColors[t.plan]}`}>{planLabels[t.plan]}</Badge>
                        {!t.activo && <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">Desactivado</Badge>}
                        {trialExpired && <Badge className="text-[10px] bg-red-100 text-red-700">Expirado</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        {t.email && <span>{t.email}</span>}
                        {t.telefono && <span>{t.telefono}</span>}
                        {t.cif && <span>CIF: {t.cif}</span>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>{t.clientesCount} clientes</span>
                        <span>{t.vehiculosCount} vehículos</span>
                        <span>{t.ordenesCount} órdenes</span>
                        <span>{t.usuariosCount} usuarios</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                        <span>Registro: {new Date(t.createdAt).toLocaleDateString("es-ES")}</span>
                        {t.ultimoAcceso && <span>Último acceso: {new Date(t.ultimoAcceso).toLocaleDateString("es-ES")}</span>}
                        {t.plan === "trial" && t.trialEndsAt && <span className={trialExpired ? "text-red-600 font-bold" : "text-amber-600 font-bold"}>Trial: {trialExpired ? "expirado" : `${trialDaysLeft} días`}</span>}
                      </div>
                    </div>

                    {/* Acciones */}
                    <AdminTallerActions
                      tallerId={t.id}
                      plan={t.plan}
                      activo={t.activo}
                    />
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
