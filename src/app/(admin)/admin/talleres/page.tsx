import Link from "next/link";
import { Building2, ChevronRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";

export const metadata = { title: "Talleres · FIXA Admin" };

const planColors: Record<string, string> = {
  pendiente: "bg-orange-100 text-orange-700",
  trial: "bg-amber-100 text-amber-700",
  basico: "bg-blue-100 text-blue-700",
  taller: "bg-emerald-100 text-emerald-700",
  pro: "bg-violet-100 text-violet-700",
  cancelado: "bg-zinc-100 text-zinc-500",
};

const planLabels: Record<string, string> = {
  pendiente: "Pendiente",
  trial: "Trial",
  basico: "Básico",
  taller: "Taller",
  pro: "Pro",
  cancelado: "Cancelado",
};

const PLANES = ["pendiente", "trial", "basico", "taller", "pro", "cancelado"] as const;

function fecha(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function TalleresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string; estado?: string }>;
}) {
  const { q = "", plan = "", estado = "" } = await searchParams;
  const db = getDb();

  const conditions: SQL[] = [];
  if (q.trim()) {
    const like = `%${q.trim()}%`;
    conditions.push(or(ilike(talleres.nombre, like), ilike(talleres.email, like))!);
  }
  if (plan && (PLANES as readonly string[]).includes(plan)) {
    conditions.push(eq(talleres.plan, plan as (typeof PLANES)[number]));
  }
  if (estado === "activo") conditions.push(eq(talleres.activo, true));
  if (estado === "inactivo") conditions.push(eq(talleres.activo, false));

  const where = conditions.length ? and(...conditions) : undefined;

  const lista = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      email: talleres.email,
      plan: talleres.plan,
      activo: talleres.activo,
      trialEndsAt: talleres.trialEndsAt,
      ultimoAcceso: talleres.ultimoAcceso,
      createdAt: talleres.createdAt,
      ordenesCount: sql<number>`(SELECT COUNT(*) FROM ordenes_trabajo WHERE ordenes_trabajo.taller_id = ${talleres.id})`,
      usuariosCount: sql<number>`(SELECT COUNT(*) FROM usuarios WHERE usuarios.taller_id = ${talleres.id})`,
    })
    .from(talleres)
    .where(where)
    .orderBy(desc(talleres.createdAt));

  // Helper para construir URLs de filtro preservando los demás parámetros.
  function filtroHref(patch: Partial<{ q: string; plan: string; estado: string }>) {
    const next = { q, plan, estado, ...patch };
    const sp = new URLSearchParams();
    if (next.q) sp.set("q", next.q);
    if (next.plan) sp.set("plan", next.plan);
    if (next.estado) sp.set("estado", next.estado);
    const qs = sp.toString();
    return qs ? `/admin/talleres?${qs}` : "/admin/talleres";
  }

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
      active ? "bg-zinc-900 text-white" : "bg-white text-zinc-600 border border-stone-200 hover:bg-stone-50"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Talleres</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {lista.length} {lista.length === 1 ? "taller" : "talleres"}
            {(q || plan || estado) && " (filtrado)"}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="space-y-3 p-4">
          {/* Búsqueda (GET form → searchParams) */}
          <form method="GET" className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Buscar por nombre o email…"
                className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            {plan && <input type="hidden" name="plan" value={plan} />}
            {estado && <input type="hidden" name="estado" value={estado} />}
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Buscar
            </button>
          </form>

          {/* Filtro por plan */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-bold uppercase tracking-wider text-stone-400">Plan</span>
            <Link href={filtroHref({ plan: "" })} className={chip(!plan)}>Todos</Link>
            {PLANES.map((p) => (
              <Link key={p} href={filtroHref({ plan: p })} className={chip(plan === p)}>
                {planLabels[p]}
              </Link>
            ))}
          </div>

          {/* Filtro por estado */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-bold uppercase tracking-wider text-stone-400">Estado</span>
            <Link href={filtroHref({ estado: "" })} className={chip(!estado)}>Todos</Link>
            <Link href={filtroHref({ estado: "activo" })} className={chip(estado === "activo")}>Activos</Link>
            <Link href={filtroHref({ estado: "inactivo" })} className={chip(estado === "inactivo")}>Inactivos</Link>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      {lista.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-12 text-center">
          <p className="text-sm font-bold text-stone-700">Sin resultados</p>
          <p className="mt-1 text-sm text-muted-foreground">Ningún taller coincide con los filtros.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lista.map((t) => {
            const trialDaysLeft = t.trialEndsAt
              ? Math.max(0, Math.ceil((new Date(t.trialEndsAt).getTime() - Date.now()) / 86400000))
              : null;
            const trialExpired = t.plan === "trial" && trialDaysLeft === 0;
            return (
              <Link
                key={t.id}
                href={`/admin/talleres/${t.id}`}
                className={`group flex items-center gap-4 rounded-xl border bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-stone-50 ${
                  !t.activo ? "border-red-200" : "border-stone-200"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-bold">{t.nombre}</p>
                    <Badge className={`text-[10px] ${planColors[t.plan]}`}>{planLabels[t.plan]}</Badge>
                    {t.plan === "pendiente" && (
                      <Badge className="text-[10px] bg-orange-500 text-white">PENDIENTE</Badge>
                    )}
                    {!t.activo && (
                      <Badge variant="outline" className="text-[10px] border-red-200 text-red-500">
                        Desactivado
                      </Badge>
                    )}
                    {trialExpired && <Badge className="text-[10px] bg-red-100 text-red-700">Trial expirado</Badge>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    {t.email && <span className="truncate">{t.email}</span>}
                    <span>Alta: {fecha(t.createdAt)}</span>
                    <span>Últ. acceso: {fecha(t.ultimoAcceso)}</span>
                    <span>{Number(t.ordenesCount)} órdenes</span>
                    <span>{Number(t.usuariosCount)} usuarios</span>
                    {t.plan === "trial" && trialDaysLeft !== null && !trialExpired && (
                      <span className="font-semibold text-amber-600">{trialDaysLeft} días de trial</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-stone-300 group-hover:text-stone-500" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
