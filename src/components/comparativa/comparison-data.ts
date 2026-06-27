/**
 * Filas de las tablas comparativas "FIXA vs X".
 *
 * FUENTE DE LOS DATOS
 * -------------------
 * El frontmatter de las comparativas (ver `velite.config.ts` → colección
 * `comparisons`) solo define `title, description, slug, competitor, body`.
 * NO existe ningún campo estructurado con las filas de la tabla.
 *
 * Por eso definimos aquí un set de filas:
 *   1. `DEFAULT_ROWS`  → fallback honesto para cualquier competidor desconocido.
 *   2. `ROWS_BY_SLUG`  → override por comparativa concreta, afinado a mano con
 *      datos verificables de la web pública del competidor (junio 2026).
 *
 * REGLA DE HONESTIDAD: cuando FIXA NO tiene algo que el competidor sí (p. ej.
 * control horario de empleados en GDTaller, o contabilidad en un ERP), se marca
 * en contra de FIXA sin maquillarlo. Cuando no se puede verificar un dato del
 * competidor, se usa "Depende" en vez de inventar un sí/no.
 */

/** Valor de una celda: `true`=check, `false`=cruz, o texto literal. */
export type CellValue = boolean | string;

export interface ComparisonRow {
  /** Nombre de la característica (columna izquierda). */
  feature: string;
  /** Valor para FIXA. */
  fixa: CellValue;
  /** Valor para el competidor. */
  competitor: CellValue;
}

/** Fallback genérico cuando no hay override por slug. */
const DEFAULT_ROWS: ComparisonRow[] = [
  { feature: "Crear orden de trabajo desde el móvil", fixa: true, competitor: "Depende" },
  { feature: "Presupuestos con IVA automáticos", fixa: true, competitor: "Depende" },
  { feature: "Avisar al cliente por WhatsApp", fixa: true, competitor: "Depende" },
  { feature: "Recordatorios de ITV automáticos", fixa: true, competitor: "Depende" },
  { feature: "Sin instalación (funciona en el navegador)", fixa: true, competitor: "Depende" },
  { feature: "Pensado para usar a pie de coche", fixa: true, competitor: "Depende" },
  { feature: "Curva de aprendizaje", fixa: "Minutos", competitor: "Depende" },
  { feature: "Soporte en español", fixa: true, competitor: true },
  { feature: "Precio", fixa: "Desde 29 €/mes", competitor: "Depende" },
  { feature: "Cancela cuando quieras", fixa: true, competitor: "Depende" },
];

const ROWS_BY_SLUG: Record<string, ComparisonRow[]> = {
  "fixa-vs-papel": [
    { feature: "Crear una orden de trabajo", fixa: "10 segundos", competitor: "2-5 minutos" },
    { feature: "Encontrar el historial por matrícula", fixa: true, competitor: "Buscar en carpetas" },
    { feature: "Presupuesto con IVA", fixa: "Automático", competitor: "Calculadora + Word" },
    { feature: "Avisar al cliente", fixa: "1 toque en WhatsApp", competitor: "Llamar 2-3 veces" },
    { feature: "Recordatorios de ITV", fixa: true, competitor: false },
    { feature: "Copia de seguridad automática", fixa: true, competitor: false },
    { feature: "Acceso desde el móvil", fixa: true, competitor: false },
    { feature: "Coste real", fixa: "Desde 29 €/mes", competitor: "Horas perdidas cada semana" },
  ],
  "fixa-vs-gdtaller": [
    { feature: "Enfoque", fixa: "App móvil-first, lo esencial", competitor: "Gestión amplia, más módulos" },
    { feature: "Crear orden desde el móvil sin formación", fixa: true, competitor: "Depende" },
    { feature: "Control horario de empleados", fixa: false, competitor: true },
    { feature: "Avisar al cliente por WhatsApp", fixa: true, competitor: "Depende" },
    { feature: "Recordatorios de ITV automáticos", fixa: true, competitor: "Depende" },
    { feature: "Sin instalación (navegador)", fixa: true, competitor: "Depende" },
    { feature: "Precio publicado en la web", fixa: "Desde 29 €/mes", competitor: "Consultar" },
    { feature: "Facturación", fixa: "Mensual, cancelas cuando quieras", competitor: "Trimestral, recibo domiciliado" },
    { feature: "Soporte en español", fixa: true, competitor: true },
  ],
  "fixa-vs-erp-taller": [
    { feature: "Tiempo de implantación", fixa: "Minutos", competitor: "Semanas" },
    { feature: "Formación necesaria", fixa: "Ninguna", competitor: "Sí, normalmente" },
    { feature: "Uso desde el móvil a pie de coche", fixa: true, competitor: "Escritorio / oficina" },
    { feature: "Contabilidad y almacén con miles de referencias", fixa: false, competitor: true },
    { feature: "Avisar al cliente por WhatsApp", fixa: true, competitor: "Depende" },
    { feature: "Recordatorios de ITV automáticos", fixa: true, competitor: "Depende" },
    { feature: "Precio", fixa: "Desde 29 €/mes", competitor: "Alto + mantenimiento" },
    { feature: "Cancela cuando quieras", fixa: true, competitor: "Permanencia habitual" },
    { feature: "Ideal para taller de 1 a 5 personas", fixa: true, competitor: "Mejor para talleres grandes" },
  ],
};

/** Devuelve las filas para un slug, con fallback al set genérico. */
export function getComparisonRows(slug: string): ComparisonRow[] {
  return ROWS_BY_SLUG[slug] ?? DEFAULT_ROWS;
}
