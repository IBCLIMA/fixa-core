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
