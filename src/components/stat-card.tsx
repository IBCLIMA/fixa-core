import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatAccent =
  | "brand"
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "stone";

const ACCENT: Record<StatAccent, { tile: string; glow: string; ring: string }> = {
  brand: { tile: "from-brand-500 to-brand-600 shadow-brand-500/25", glow: "bg-brand-500/[0.06]", ring: "" },
  blue: { tile: "from-blue-500 to-blue-600 shadow-blue-500/25", glow: "bg-blue-500/[0.05]", ring: "" },
  violet: { tile: "from-violet-500 to-violet-600 shadow-violet-500/25", glow: "bg-violet-500/[0.05]", ring: "" },
  emerald: { tile: "from-emerald-500 to-emerald-600 shadow-emerald-500/25", glow: "bg-emerald-500/[0.05]", ring: "" },
  amber: { tile: "from-amber-500 to-amber-600 shadow-amber-500/25", glow: "bg-amber-500/[0.05]", ring: "" },
  stone: { tile: "from-stone-400 to-stone-500 shadow-stone-400/20", glow: "bg-stone-500/[0.04]", ring: "" },
};

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  accent?: StatAccent;
  href?: string;
  /** Estado de alerta: tiñe la tarjeta (p.ej. cobros pendientes) y muestra un punto pulsante. */
  alert?: boolean;
  /** Línea secundaria opcional de contexto bajo la etiqueta (p.ej. "12 en total", "ARR ≈ 5.000 €"). */
  sub?: React.ReactNode;
  id?: string;
};

/**
 * Tarjeta KPI compartida (Warm Premium). Icono en azulejo con degradado + glow del
 * color de acento, número con carácter y elevación cálida. Si `href`, eleva al hover.
 * Sustituye a las tarjetas KPI duplicadas e inline de panel/facturación/métricas/admin.
 */
export function StatCard({ label, value, icon: Icon, accent = "stone", href, alert = false, sub, id }: StatCardProps) {
  const a = ACCENT[accent];
  const interactive = !!href;

  const inner = (
    <>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
            alert ? "from-amber-500 to-amber-600 shadow-amber-500/25" : a.tile
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[1.7rem] font-extrabold leading-none tabular-nums tracking-tight",
              alert ? "text-amber-900" : "text-foreground"
            )}
          >
            {value}
          </p>
          <p className={cn("mt-1 text-xs font-medium", alert ? "text-amber-700" : "text-muted-foreground")}>
            {label}
          </p>
          {sub != null && (
            <p className={cn("mt-0.5 text-[11px] leading-snug", alert ? "text-amber-700/80" : "text-muted-foreground/80")}>
              {sub}
            </p>
          )}
        </div>
      </div>
      {alert && <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />}
      <div className={cn("pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full", alert ? "bg-amber-500/[0.10]" : a.glow)} />
    </>
  );

  const base = cn(
    "group/stat relative overflow-hidden rounded-2xl p-4 shadow-sm transition-all duration-200",
    alert
      ? "bg-amber-50 ring-1 ring-amber-300"
      : "bg-card ring-1 ring-foreground/[0.07]",
    interactive && "hover:-translate-y-0.5 hover:shadow-md"
  );

  if (href) {
    return (
      <Link id={id} href={href} className={base}>
        {inner}
      </Link>
    );
  }
  return (
    <div id={id} className={base}>
      {inner}
    </div>
  );
}
