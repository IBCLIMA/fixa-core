import { ShieldCheck, LogIn, LogOut, CreditCard, Power, PowerOff, CheckCircle2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import { adminAudit } from "@/db/schema";
import { desc } from "drizzle-orm";

export const metadata = { title: "Auditoría · FIXA Admin" };
export const dynamic = "force-dynamic";

// Etiqueta legible + estilo por tipo de acción registrada.
const ACCIONES: Record<string, { label: string; badge: string; icon: typeof FileText }> = {
  entrar_como: { label: "Entró como taller", badge: "bg-red-100 text-red-700", icon: LogIn },
  salir_como: { label: "Salió de impersonación", badge: "bg-stone-200 text-stone-700", icon: LogOut },
  cambiar_plan: { label: "Cambió plan", badge: "bg-violet-100 text-violet-700", icon: CreditCard },
  activar: { label: "Activó taller", badge: "bg-emerald-100 text-emerald-700", icon: Power },
  desactivar: { label: "Desactivó taller", badge: "bg-amber-100 text-amber-700", icon: PowerOff },
  aprobar: { label: "Aprobó registro", badge: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
};

function accionMeta(accion: string) {
  return ACCIONES[accion] ?? { label: accion, badge: "bg-stone-100 text-stone-600", icon: FileText };
}

// Convierte el jsonb `detalles` en un resumen legible ("plan: trial → pro").
function resumirDetalles(accion: string, detalles: unknown): string | null {
  if (!detalles || typeof detalles !== "object") return null;
  const d = detalles as Record<string, unknown>;

  if (accion === "cambiar_plan" || accion === "aprobar") {
    if (d.planAntes !== undefined || d.planDespues !== undefined) {
      return `Plan: ${d.planAntes ?? "—"} → ${d.planDespues ?? "—"}`;
    }
  }
  if (accion === "activar" || accion === "desactivar") {
    if (d.activoDespues !== undefined) {
      return `Activo: ${d.activoAntes ? "sí" : "no"} → ${d.activoDespues ? "sí" : "no"}`;
    }
  }

  // Fallback genérico: muestra los pares clave-valor.
  const partes = Object.entries(d).map(([k, v]) => `${k}: ${String(v)}`);
  return partes.length ? partes.join(" · ") : null;
}

const fmt = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
});

export default async function AuditoriaPage() {
  const db = getDb();
  const filas = await db
    .select()
    .from(adminAudit)
    .orderBy(desc(adminAudit.createdAt))
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Auditoría</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Registro inmutable de acciones de administración (últimas 100)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Acciones registradas ({filas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabla en desktop, tarjetas en móvil */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4 font-bold">Fecha</th>
                  <th className="py-2 pr-4 font-bold">Admin</th>
                  <th className="py-2 pr-4 font-bold">Acción</th>
                  <th className="py-2 pr-4 font-bold">Taller</th>
                  <th className="py-2 font-bold">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => {
                  const meta = accionMeta(f.accion);
                  const Icono = meta.icon;
                  const resumen = resumirDetalles(f.accion, f.detalles);
                  return (
                    <tr key={f.id} className="border-b border-stone-100 last:border-0 align-top">
                      <td className="py-2.5 pr-4 whitespace-nowrap text-xs text-muted-foreground">
                        {fmt.format(new Date(f.createdAt))}
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap font-medium">{f.adminEmail}</td>
                      <td className="py-2.5 pr-4">
                        <Badge className={`gap-1 text-[10px] ${meta.badge}`}>
                          <Icono className="h-3 w-3" />
                          {meta.label}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-4">{f.tallerNombre ?? <span className="text-muted-foreground">—</span>}</td>
                      <td className="py-2.5 text-xs text-muted-foreground">{resumen ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-2.5 md:hidden">
            {filas.map((f) => {
              const meta = accionMeta(f.accion);
              const Icono = meta.icon;
              const resumen = resumirDetalles(f.accion, f.detalles);
              return (
                <div key={f.id} className="rounded-xl border border-stone-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={`gap-1 text-[10px] ${meta.badge}`}>
                      <Icono className="h-3 w-3" />
                      {meta.label}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{fmt.format(new Date(f.createdAt))}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{f.tallerNombre ?? "—"}</p>
                  <p className="text-[11px] text-muted-foreground">{f.adminEmail}</p>
                  {resumen && <p className="mt-1 text-xs text-muted-foreground">{resumen}</p>}
                </div>
              );
            })}
          </div>

          {filas.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
                <FileText className="h-6 w-6 text-stone-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-700">Sin acciones registradas</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Impersonar, cambiar de plan, activar o aprobar un taller quedará registrado aquí.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
