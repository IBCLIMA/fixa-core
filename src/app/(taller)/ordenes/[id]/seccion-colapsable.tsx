"use client";

import { useId, useState } from "react";
import {
  ChevronDown,
  ClipboardList,
  Shield,
  Camera,
  ClipboardCheck,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Mapa de iconos disponibles. El icono se pasa como STRING (no como componente)
 * porque esta sección es un Client Component: pasar la función de un icono de
 * lucide desde un Server Component cruza la frontera servidor→cliente y Next.js
 * no puede serializar funciones ("Functions cannot be passed to Client
 * Components"). Resolver el string aquí dentro mantiene el icono del lado cliente.
 */
const ICONOS = {
  "clipboard-list": ClipboardList,
  shield: Shield,
  camera: Camera,
  "clipboard-check": ClipboardCheck,
  "alert-triangle": AlertTriangle,
} as const;

export type SeccionIcono = keyof typeof ICONOS;

interface SeccionColapsableProps {
  /** Título visible en la cabecera. */
  title: string;
  /** Clave del icono a mostrar, ej: `icon="camera"`. Ver `ICONOS`. */
  icon: SeccionIcono;
  /** Por defecto colapsada. Pasar `true` para arrancar abierta. */
  defaultOpen?: boolean;
  /** Pista a la derecha del título (ej: contador o nº de pendientes). */
  badge?: React.ReactNode;
  /** Tono visual; `amber` para secciones que requieren atención. */
  tone?: "default" | "amber";
  /** Clases extra para el Card exterior (ej: `no-print`). */
  className?: string;
  children: React.ReactNode;
}

/**
 * Sección colapsable reutilizable para la pantalla de trabajo del mecánico.
 * Aporta la "chrome" de Card + cabecera-botón con chevron; el contenido se
 * pasa como `children`. Colapsada por defecto para acortar el scroll de las
 * secciones secundarias (datos legales, seguro, fotos, inspección, averías).
 *
 * Accesible (botón con aria-expanded/aria-controls), objetivo de toque ≥44px,
 * animación suave que respeta `prefers-reduced-motion`. En impresión el
 * contenido se fuerza visible para no perder datos legales en el PDF/print.
 */
export function SeccionColapsable({
  title,
  icon,
  defaultOpen = false,
  badge,
  tone = "default",
  className,
  children,
}: SeccionColapsableProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  const Icon = ICONOS[icon];

  return (
    <Card
      className={cn(
        "gap-0 py-0",
        tone === "amber" && "border-amber-200",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className={cn(
          "flex min-h-[3.25rem] w-full items-center gap-2 rounded-2xl px-4 text-left transition-colors",
          "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            tone === "amber" ? "text-amber-600" : "text-muted-foreground"
          )}
        />
        <span className="flex-1 text-base font-semibold">{title}</span>
        {badge}
        <ChevronDown
          aria-hidden
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-[var(--ease-out-soft)] motion-reduce:transition-none",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        id={contentId}
        className={cn(
          "grid transition-all duration-200 ease-[var(--ease-out-soft)] motion-reduce:transition-none",
          // En impresión, mostrar siempre el contenido (datos legales en el PDF).
          "print:grid-rows-[1fr]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0">{children}</div>
        </div>
      </div>
    </Card>
  );
}
