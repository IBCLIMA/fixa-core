import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellValue, ComparisonRow } from "./comparison-data";

interface ComparisonTableProps {
  /** Nombre del competidor (cabecera de la columna derecha). */
  competitor: string;
  /** Filas de características a comparar. */
  rows: ComparisonRow[];
  className?: string;
}

/** Renderiza el valor de una celda: icono para booleano, texto si es string. */
function Cell({ value, emphasis }: { value: CellValue; emphasis?: boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex" aria-label="Sí">
        <Check
          className={cn(
            "size-5",
            emphasis ? "text-brand-600" : "text-emerald-600 dark:text-emerald-500",
          )}
          aria-hidden
        />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex" aria-label="No">
        <X className="size-5 text-muted-foreground/40" aria-hidden />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "text-sm leading-snug",
        emphasis ? "font-semibold text-foreground" : "text-muted-foreground",
      )}
    >
      {value}
    </span>
  );
}

/**
 * Tabla comparativa visual "FIXA vs {competitor}".
 * - Columna FIXA destacada con color de marca (`brand-*`) y `shadow-brand`.
 * - `<table>` semántica real (bueno para SEO y accesibilidad).
 * - Responsive: a 375px las columnas de valor son estrechas (iconos / texto corto)
 *   y la columna de característica hace wrap. Sin scroll horizontal ni overflow roto.
 */
export function ComparisonTable({ competitor, rows, className }: ComparisonTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <table className="w-full table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-[44%] sm:w-1/2" />
          <col className="w-[28%] sm:w-1/4" />
          <col className="w-[28%] sm:w-1/4" />
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className="px-3 py-4 align-bottom text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-5"
            >
              Función
            </th>
            <th
              scope="col"
              className="bg-brand-600 px-3 py-4 text-center align-bottom text-base font-bold text-white shadow-brand sm:px-5"
            >
              FIXA
            </th>
            <th
              scope="col"
              className="px-3 py-4 text-center align-bottom text-base font-semibold text-foreground sm:px-5"
            >
              {competitor}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} className="border-t border-border">
              <th
                scope="row"
                className="px-3 py-3.5 text-left text-sm font-medium text-foreground sm:px-5"
              >
                {row.feature}
              </th>
              <td
                className={cn(
                  "bg-brand-50 px-3 py-3.5 text-center align-middle sm:px-5 dark:bg-brand-950/40",
                  i === rows.length - 1 && "rounded-b-2xl",
                )}
              >
                <Cell value={row.fixa} emphasis />
              </td>
              <td className="px-3 py-3.5 text-center align-middle sm:px-5">
                <Cell value={row.competitor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
