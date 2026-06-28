import Link from "next/link";
import {
  ShieldCheck, LogIn, LogOut, CreditCard, Power, PowerOff, CheckCircle2,
  FileText, Search, SearchX, ChevronLeft, ChevronRight, Receipt,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import { adminAudit } from "@/db/schema";
import { and, desc, gte, ilike, lte, eq, sql, type SQL } from "drizzle-orm";

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
  estado_cobro: { label: "Cambió estado de cobro", badge: "bg-sky-100 text-sky-700", icon: Receipt },
};

// Acciones conocidas → usadas para el <select> de filtro (orden estable).
const ACCIONES_FILTRO = [
  "entrar_como", "salir_como", "cambiar_plan", "activar", "desactivar", "aprobar", "estado_cobro",
] as const;

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
  if (accion === "estado_cobro") {
    if (d.estado !== undefined) {
      return `Estado: ${String(d.estado)}${d.nota ? ` · ${String(d.nota)}` : ""}`;
    }
  }

  // Fallback genérico: muestra los pares clave-valor.
  const partes = Object.entries(d).map(([k, v]) => `${k}: ${String(v)}`);
  return partes.length ? partes.join(" · ") : null;
}

const fmt = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
});

const PER_PAGE = 50;

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{
    admin?: string; accion?: string; taller?: string; desde?: string; hasta?: string; page?: string;
  }>;
}) {
  const sp = await searchParams;
  const admin = (sp.admin ?? "").trim();
  const taller = (sp.taller ?? "").trim();
  const accion = (ACCIONES_FILTRO as readonly string[]).includes(sp.accion ?? "") ? sp.accion! : "";
  const desde = (sp.desde ?? "").trim(); // YYYY-MM-DD
  const hasta = (sp.hasta ?? "").trim(); // YYYY-MM-DD
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const hayFiltros = Boolean(admin || taller || accion || desde || hasta);

  const db = getDb();

  // Construcción de condiciones server-side.
  const conditions: SQL[] = [];
  if (admin) conditions.push(ilike(adminAudit.adminEmail, `%${admin}%`));
  if (taller) conditions.push(ilike(adminAudit.tallerNombre, `%${taller}%`));
  if (accion) conditions.push(eq(adminAudit.accion, accion));
  // Fechas: `desde` desde las 00:00; `hasta` incluye todo el día (hasta 23:59:59.999).
  if (desde && !Number.isNaN(Date.parse(`${desde}T00:00:00`))) {
    conditions.push(gte(adminAudit.createdAt, new Date(`${desde}T00:00:00`)));
  }
  if (hasta && !Number.isNaN(Date.parse(`${hasta}T23:59:59.999`))) {
    conditions.push(lte(adminAudit.createdAt, new Date(`${hasta}T23:59:59.999`)));
  }
  const where = conditions.length ? and(...conditions) : undefined;

  // Total (mismo filtro) → para el rango y la paginación.
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(adminAudit)
    .where(where);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const pageClamped = Math.min(page, totalPages);
  const offset = (pageClamped - 1) * PER_PAGE;

  const filas = await db
    .select()
    .from(adminAudit)
    .where(where)
    .orderBy(desc(adminAudit.createdAt))
    .limit(PER_PAGE)
    .offset(offset);

  const rangeFrom = total === 0 ? 0 : offset + 1;
  const rangeTo = offset + filas.length;

  // Construye URLs preservando filtros (y opcionalmente cambiando de página).
  function href(patch: Partial<{ page: number }>) {
    const next = { admin, accion, taller, desde, hasta, page: pageClamped, ...patch };
    const qs = new URLSearchParams();
    if (next.admin) qs.set("admin", next.admin);
    if (next.accion) qs.set("accion", next.accion);
    if (next.taller) qs.set("taller", next.taller);
    if (next.desde) qs.set("desde", next.desde);
    if (next.hasta) qs.set("hasta", next.hasta);
    if (next.page > 1) qs.set("page", String(next.page));
    const s = qs.toString();
    return s ? `/admin/auditoria?${s}` : "/admin/auditoria";
  }

  const inputCls =
    "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Auditoría</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Registro inmutable de acciones de administración
            {hayFiltros && " (filtrado)"}
          </p>
        </div>
      </div>

      {/* Barra de filtros (form GET → searchParams, server-side). */}
      <Card>
        <CardContent className="p-4">
          {/* Al enviar se omite `page` → vuelve a la página 1 con los nuevos filtros. */}
          <form method="GET" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <label htmlFor="f-admin" className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400">
                Admin
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="f-admin"
                  type="text"
                  name="admin"
                  defaultValue={admin}
                  placeholder="email…"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label htmlFor="f-accion" className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400">
                Acción
              </label>
              <select id="f-accion" name="accion" defaultValue={accion} className={inputCls}>
                <option value="">Todas</option>
                {ACCIONES_FILTRO.map((a) => (
                  <option key={a} value={a}>{ACCIONES[a].label}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label htmlFor="f-taller" className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400">
                Taller
              </label>
              <input
                id="f-taller"
                type="text"
                name="taller"
                defaultValue={taller}
                placeholder="nombre…"
                className={inputCls}
              />
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="f-desde" className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400">
                  Desde
                </label>
                <input id="f-desde" type="date" name="desde" defaultValue={desde} className={inputCls} />
              </div>
              <div>
                <label htmlFor="f-hasta" className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400">
                  Hasta
                </label>
                <input id="f-hasta" type="date" name="hasta" defaultValue={hasta} className={inputCls} />
              </div>
            </div>

            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-12">
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                Filtrar
              </button>
              {hayFiltros && (
                <Link
                  href="/admin/auditoria"
                  className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-stone-50"
                >
                  Limpiar
                </Link>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resultados */}
      {filas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
            {hayFiltros ? <SearchX className="h-6 w-6 text-stone-400" /> : <FileText className="h-6 w-6 text-stone-400" />}
          </div>
          <p className="mt-4 text-sm font-bold text-stone-700">
            {hayFiltros ? "Sin resultados" : "Sin acciones registradas"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {hayFiltros
              ? "Ninguna acción coincide con estos filtros."
              : "Impersonar, cambiar de plan, activar o aprobar un taller quedará registrado aquí."}
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Acciones registradas</p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {rangeFrom}–{rangeTo} de {total}
              </p>
            </div>

            {/* Tabla en desktop */}
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

            {/* Tarjetas en móvil */}
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

            {/* Paginación (preserva los filtros). */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-4">
                <span className="text-xs text-muted-foreground tabular-nums">
                  Página {pageClamped} de {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  {pageClamped > 1 ? (
                    <Link
                      href={href({ page: pageClamped - 1 })}
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-stone-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Link>
                  ) : (
                    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-semibold text-stone-300">
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </span>
                  )}
                  {pageClamped < totalPages ? (
                    <Link
                      href={href({ page: pageClamped + 1 })}
                      className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-stone-50"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-semibold text-stone-300">
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
