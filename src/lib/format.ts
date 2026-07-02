/**
 * Formateadores de números/moneda en español (es-ES).
 * USAR SIEMPRE para MOSTRAR importes. No usar para values de inputs editables.
 *
 * formatMoney(1339.53) -> "1.339,53 €"
 * formatMoney(130168)  -> "130.168,00 €"
 */

const eurFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const eurFormatterNoDecimals = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-ES");

const decimal2Formatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Importe en euros con separador de miles y coma decimal: "1.339,53 €". */
export function formatMoney(value: number | null | undefined): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return eurFormatter.format(n);
}

/** Importe en euros sin decimales (para KPIs grandes y redondos): "130.168 €". */
export function formatMoneyShort(value: number | null | undefined): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return eurFormatterNoDecimals.format(n);
}

/**
 * Importe en euros con la palabra "EUR" en vez del símbolo: "1.339,53 EUR".
 * Para PDFs (@react-pdf Helvetica) donde se evita el glifo € por compatibilidad.
 */
export function formatMoneyText(value: number | null | undefined): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return `${decimal2Formatter.format(n)} EUR`;
}

/** Número con 2 decimales y separador de miles español, sin símbolo: "1.234,56". */
export function formatDecimal2(value: number | null | undefined): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return decimal2Formatter.format(n);
}

/** Número con separador de miles español: "1.234". */
export function formatNumber(value: number | null | undefined): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return numberFormatter.format(n);
}

// ─── Cálculo de importes de líneas (presupuestos y órdenes) ──────────────────
// ÚNICA fuente de verdad para base/IVA/total. Redondeo a 2 decimales POR LÍNEA,
// igual que el snapshot legal de aceptación de presupuestos: cambiar esto
// cambiaría los importes aceptados por el cliente. No tocar sin motivo legal.

/** Línea con importes tal y como llegan de la BD (numeric = string) o ya parseados. */
export interface LineaImporte {
  cantidad: string | number;
  precioUnitario: string | number;
  descuentoPct?: string | number | null;
  ivaPct?: string | number | null;
}

/** Redondeo a 2 decimales (céntimos). */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Base imponible de una línea: cantidad × precio × (1 − dto/100), redondeada a céntimos. */
export function lineaBase(l: LineaImporte): number {
  return round2(
    Number(l.cantidad) *
      Number(l.precioUnitario) *
      (1 - Number(l.descuentoPct || 0) / 100)
  );
}

/** IVA de una línea sobre su base redondeada. IVA por defecto: 21%. */
export function lineaIva(l: LineaImporte): number {
  // "|| 21" (no "?? 21") para replicar exactamente el cálculo histórico:
  // null/undefined/"" → 21. Desde BD (numeric) llega string, "0" se respeta.
  return round2(lineaBase(l) * (Number(l.ivaPct || 21) / 100));
}

/** Totales de un conjunto de líneas: suma de bases e IVAs redondeados por línea. */
export function totalLineas(lineas: LineaImporte[]): {
  base: number;
  iva: number;
  total: number;
} {
  const base = round2(lineas.reduce((sum, l) => sum + lineaBase(l), 0));
  const iva = round2(lineas.reduce((sum, l) => sum + lineaIva(l), 0));
  return { base, iva, total: round2(base + iva) };
}
