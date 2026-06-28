import {
  Car,
  Stethoscope,
  FileText,
  ThumbsUp,
  Wrench,
  Package,
  PackageCheck,
  CheckCircle2,
  KeyRound,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type EstadoHito = "completado" | "actual" | "pendiente";

export interface HitoTimeline {
  /** Estado de la orden que representa el hito */
  estado: string;
  /** Título corto y claro para el cliente (p. ej. "En reparación") */
  titulo: string;
  /** Frase humana que explica qué significa este hito */
  descripcion: string;
  /** Fecha/hora real del cambio de estado (null si aún no ha ocurrido) */
  fecha: Date | null;
  /** Posición del hito respecto al estado actual */
  status: EstadoHito;
}

const iconoPorEstado: Record<string, LucideIcon> = {
  recibido: Car,
  diagnostico: Stethoscope,
  presupuestado: FileText,
  aprobado: ThumbsUp,
  en_reparacion: Wrench,
  esperando_recambio: Package,
  pieza_recibida: PackageCheck,
  listo: CheckCircle2,
  entregado: KeyRound,
};

function formatFecha(fecha: Date) {
  return new Date(fecha).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Línea de tiempo vertical estilo seguimiento de pedido (Amazon-like).
 * Muestra cada hito por el que pasa la reparación: pasados con check (verde),
 * el actual destacado con la marca y un sutil latido, y los futuros en gris.
 * No inventa datos: las fechas vienen de historialEstados.
 */
export function TimelineReparacion({ hitos }: { hitos: HitoTimeline[] }) {
  return (
    <ol className="relative">
      {hitos.map((hito, i) => {
        const isLast = i === hitos.length - 1;
        const Icono = iconoPorEstado[hito.estado] ?? Car;
        const completado = hito.status === "completado";
        const actual = hito.status === "actual";

        return (
          <li key={`${hito.estado}-${i}`} className="relative flex gap-4 pb-7 last:pb-0">
            {/* Conector vertical hasta el siguiente hito */}
            {!isLast && (
              <span
                aria-hidden
                className={`absolute left-[1.375rem] top-12 -bottom-0 w-0.5 ${
                  completado ? "bg-emerald-400" : "bg-border"
                }`}
              />
            )}

            {/* Punto / icono del hito */}
            <div className="relative z-10 shrink-0">
              {actual && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-brand/40 motion-safe:animate-ping"
                />
              )}
              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  actual
                    ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand ring-4 ring-brand/20"
                    : completado
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground ring-1 ring-border"
                }`}
              >
                {completado ? (
                  <Check className="h-5 w-5" strokeWidth={3} />
                ) : (
                  <Icono className="h-5 w-5" />
                )}
              </div>
            </div>

            {/* Contenido del hito */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between gap-3">
                <p
                  className={`text-sm font-extrabold leading-snug ${
                    actual
                      ? "text-brand-700"
                      : completado
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {hito.titulo}
                </p>
                {hito.fecha ? (
                  <time className="shrink-0 text-[11px] font-medium tabular-nums text-muted-foreground">
                    {formatFecha(hito.fecha)}
                  </time>
                ) : (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Pendiente
                  </span>
                )}
              </div>
              <p
                className={`mt-0.5 text-xs leading-relaxed ${
                  hito.status === "pendiente" ? "text-muted-foreground/70" : "text-muted-foreground"
                }`}
              >
                {hito.descripcion}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
