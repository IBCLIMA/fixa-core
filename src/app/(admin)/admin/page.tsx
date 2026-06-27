import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import { talleres, usuarios } from "@/db/schema";
import { count, desc, sql } from "drizzle-orm";
import { AdminTallerActions } from "./admin-actions";
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
  pendiente: "⏳ Pendiente",
  trial: "Trial",
  basico: "Básico 29€/mes",
  taller: "Taller 49€/mes",
  pro: "Pro 79€/mes",
  cancelado: "Cancelado",
};

export default async function AdminResumenPage() {
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
      usuariosCount: sql<number>`(SELECT COUNT(*) FROM usuarios WHERE usuarios.taller_id = ${talleres.id})`,
    })
    .from(talleres)
    .orderBy(desc(talleres.createdAt));

  const [totalTalleres] = await db.select({ count: count() }).from(talleres);
  const [totalUsuarios] = await db.select({ count: count() }).from(usuarios);

  const talleresPendientes = talleresList.filter((t) => t.plan === "pendiente");
  const talleresPagando = talleresList.filter((t) => ["basico", "taller", "pro"].includes(t.plan));
  const talleresTrialActivo = talleresList.filter((t) => t.plan === "trial" && t.trialEndsAt && new Date(t.trialEndsAt) > new Date());
  const talleresTrialExpirado = talleresList.filter((t) => t.plan === "trial" && t.trialEndsAt && new Date(t.trialEndsAt) <= new Date());

  const hace48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const nuevosRegistros = talleresList.filter((t) => new Date(t.createdAt) > hace48h);

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
          <h1 className="text-2xl font-extrabold tracking-tight">Resumen de plataforma</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Talleres, planes y facturación de FIXA</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">MRR</p>
            <p className="text-2xl font-extrabold text-emerald-800 mt-1">{formatMoneyShort(mrr)}</p>
          </CardContent>
        </Card>
        <Card><CardContent className="p-4"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Talleres</p><p className="text-2xl font-extrabold mt-1">{totalTalleres?.count ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cuentas</p><p className="text-2xl font-extrabold mt-1">{totalUsuarios?.count ?? 0}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {talleresPendientes.length > 0 && (
          <div className="rounded-xl bg-orange-50 border-2 border-orange-300 p-3 text-center animate-pulse"><p className="text-xl font-extrabold text-orange-700">{talleresPendientes.length}</p><p className="text-xs text-orange-600 font-bold">PENDIENTES</p></div>
        )}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center"><p className="text-xl font-extrabold text-amber-700">{talleresTrialActivo.length}</p><p className="text-xs text-amber-600 font-medium">Trial activo</p></div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center"><p className="text-xl font-extrabold text-red-700">{talleresTrialExpirado.length}</p><p className="text-xs text-red-600 font-medium">Trial expirado</p></div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center"><p className="text-xl font-extrabold text-emerald-700">{talleresPagando.length}</p><p className="text-xs text-emerald-600 font-medium">Pagando</p></div>
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-center"><p className="text-xl font-extrabold text-stone-700">{talleresList.filter((t) => t.activo).length}</p><p className="text-xs text-stone-600 font-medium">Activos</p></div>
        {nuevosRegistros.length > 0 && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center"><p className="text-xl font-extrabold text-blue-700">{nuevosRegistros.length}</p><p className="text-xs text-blue-600 font-medium">Nuevos (48h)</p></div>
        )}
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
              const esNuevo = new Date(t.createdAt) > hace48h;

              return (
                <div key={t.id} className={`rounded-xl border p-4 ${trialExpired ? "border-red-200 bg-red-50/30" : "border-stone-200"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold">{t.nombre}</p>
                        <Badge className={`text-[10px] ${planColors[t.plan]}`}>{planLabels[t.plan]}</Badge>
                        {t.plan === "pendiente" && <Badge className="text-[10px] bg-orange-500 text-white animate-pulse">⏳ PENDIENTE APROBACIÓN</Badge>}
                        {esNuevo && t.plan !== "pendiente" && <Badge className="text-[10px] bg-blue-500 text-white">NUEVO</Badge>}
                        {!t.activo && <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">Desactivado</Badge>}
                        {trialExpired && <Badge className="text-[10px] bg-red-100 text-red-700">Expirado</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        {t.email && <span>{t.email}</span>}
                        {t.telefono && <span>{t.telefono}</span>}
                        {t.cif && <span>CIF: {t.cif}</span>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>{t.usuariosCount} cuenta(s)</span>
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
