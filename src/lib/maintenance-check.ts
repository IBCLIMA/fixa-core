export interface MaintenanceAlert {
  tipo: string;
  kmDesdeUltimo: number;
  kmRecomendado: number;
  urgente: boolean;
}

interface MaintenanceRule {
  tipo: string;
  keywords: string[];
  kmIntervalo: number;
  /** If provided, alert starts at this km (e.g. 100k for distribucion at 120k) */
  kmAlerta?: number;
}

const RULES: MaintenanceRule[] = [
  {
    tipo: "Cambio de aceite",
    keywords: ["aceite", "oil", "lubricante"],
    kmIntervalo: 15000,
  },
  {
    tipo: "Filtro de aire",
    keywords: ["filtro aire", "filtro de aire", "air filter"],
    kmIntervalo: 30000,
  },
  {
    tipo: "Filtro de habitaculo",
    keywords: ["filtro habitaculo", "filtro habitáculo", "filtro polen", "filtro antipolen"],
    kmIntervalo: 20000,
  },
  {
    tipo: "Liquido de frenos",
    keywords: ["liquido freno", "líquido freno", "liquido de freno", "líquido de freno", "brake fluid"],
    kmIntervalo: 40000,
  },
  {
    tipo: "Correa de distribucion",
    keywords: ["distribucion", "distribución", "correa distrib", "timing belt"],
    kmIntervalo: 120000,
    kmAlerta: 100000,
  },
];

interface OrderWithLines {
  kmEntrada: number | null;
  fechaEntrada: Date | string;
  lineas: { descripcion: string }[];
}

/**
 * Checks maintenance alerts by comparing the current vehicle km
 * against previous order history and line item descriptions.
 */
export function checkMaintenanceAlerts(
  kmActual: number,
  previousOrders: OrderWithLines[]
): MaintenanceAlert[] {
  const alerts: MaintenanceAlert[] = [];

  for (const rule of RULES) {
    // Find the most recent order where a line item matches this maintenance type
    let lastKm: number | null = null;

    for (const order of previousOrders) {
      if (!order.kmEntrada) continue;
      const hasMatch = order.lineas.some((linea) =>
        rule.keywords.some((kw) =>
          linea.descripcion.toLowerCase().includes(kw.toLowerCase())
        )
      );
      if (hasMatch) {
        // previousOrders should be sorted by date desc, so first match is most recent
        lastKm = order.kmEntrada;
        break;
      }
    }

    if (lastKm !== null) {
      const kmDesdeUltimo = kmActual - lastKm;
      const umbral = rule.kmAlerta ?? rule.kmIntervalo;
      // Only show alert if approaching or past the interval
      // Show when within 20% of the interval or past it
      const threshold = umbral * 0.8;
      if (kmDesdeUltimo >= threshold) {
        alerts.push({
          tipo: rule.tipo,
          kmDesdeUltimo,
          kmRecomendado: rule.kmIntervalo,
          urgente: kmDesdeUltimo >= umbral,
        });
      }
    }
  }

  return alerts;
}
