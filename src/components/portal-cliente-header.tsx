import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PortalClienteHeaderProps {
  /** Nombre del taller (fallback cuando no hay logo) */
  nombre?: string | null;
  /** URL del logo del taller (talleres.logoUrl). Si existe, manda sobre el nombre */
  logoUrl?: string | null;
  /** Texto secundario discreto a la derecha del identificador (p. ej. "Estado de tu vehículo") */
  subtitle?: string;
  /** Slot a la derecha de la cabecera (p. ej. OR-1234) */
  right?: ReactNode;
  /** Clases extra para el <header> (p. ej. print:border-none, no-print) */
  className?: string;
  /** Ancho del contenedor interno. Por defecto max-w-lg */
  containerClassName?: string;
}

/**
 * Cabecera white-label de las páginas que ve el CLIENTE del taller.
 * Muestra la identidad del TALLER (logo si lo tiene, si no su nombre),
 * nunca el logo de FIXA. El crédito a FIXA va discreto en el pie de cada página.
 */
export function PortalClienteHeader({
  nombre,
  logoUrl,
  subtitle,
  right,
  className,
  containerClassName,
}: PortalClienteHeaderProps) {
  return (
    <header className={cn("border-b border-border bg-card px-6 py-4", className)}>
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-3",
          containerClassName ?? "max-w-lg"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo de taller desde URL arbitraria; sin optimización
            <img
              src={logoUrl}
              alt={nombre ?? "Taller"}
              className="h-8 w-auto max-w-[160px] object-contain sm:h-9"
            />
          ) : (
            <span className="truncate font-bold tracking-tight text-foreground">
              {nombre ?? "Taller"}
            </span>
          )}
          {subtitle && (
            <span className="ml-1 shrink-0 text-xs text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}
