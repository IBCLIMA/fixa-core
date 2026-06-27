import { cn } from "@/lib/utils";

/**
 * Badge de sección de la landing (pill cálida de marca).
 * Patrón repetido en 11+ secciones — extraído para tokenizar y centralizar.
 */
export function LandingBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 mb-4",
        className
      )}
    >
      {children}
    </span>
  );
}
