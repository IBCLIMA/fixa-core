export const serviceTemplates = [
  {
    name: "Cambio de aceite + filtro",
    lines: [
      { tipo: "recambio" as const, descripcion: "Aceite motor 5W30 (5L)", cantidad: 1, precioUnitario: 35 },
      { tipo: "recambio" as const, descripcion: "Filtro de aceite", cantidad: 1, precioUnitario: 12 },
      { tipo: "mano_obra" as const, descripcion: "Mano de obra cambio aceite", cantidad: 0.5, precioUnitario: 40 },
    ],
  },
  {
    name: "Pre-ITV",
    lines: [
      { tipo: "mano_obra" as const, descripcion: "Revisión pre-ITV completa", cantidad: 1, precioUnitario: 45 },
      { tipo: "mano_obra" as const, descripcion: "Ajuste luces", cantidad: 0.25, precioUnitario: 40 },
      { tipo: "mano_obra" as const, descripcion: "Verificación emisiones", cantidad: 0.25, precioUnitario: 40 },
    ],
  },
  {
    name: "Pastillas de freno delanteras",
    lines: [
      { tipo: "recambio" as const, descripcion: "Juego pastillas freno delanteras", cantidad: 1, precioUnitario: 45 },
      { tipo: "mano_obra" as const, descripcion: "Sustitución pastillas delanteras", cantidad: 1, precioUnitario: 50 },
    ],
  },
  {
    name: "Discos + pastillas delanteros",
    lines: [
      { tipo: "recambio" as const, descripcion: "Juego discos freno delanteros", cantidad: 1, precioUnitario: 85 },
      { tipo: "recambio" as const, descripcion: "Juego pastillas freno delanteras", cantidad: 1, precioUnitario: 45 },
      { tipo: "mano_obra" as const, descripcion: "Sustitución discos y pastillas", cantidad: 1.5, precioUnitario: 50 },
    ],
  },
  {
    name: "Revisión general",
    lines: [
      { tipo: "mano_obra" as const, descripcion: "Revisión completa de niveles", cantidad: 0.5, precioUnitario: 40 },
      { tipo: "mano_obra" as const, descripcion: "Inspección visual frenos/suspensión", cantidad: 0.5, precioUnitario: 40 },
      { tipo: "mano_obra" as const, descripcion: "Check electrónico", cantidad: 0.5, precioUnitario: 40 },
    ],
  },
  {
    name: "Cambio neumáticos (4)",
    lines: [
      { tipo: "recambio" as const, descripcion: "Neumático (x4)", cantidad: 4, precioUnitario: 65 },
      { tipo: "mano_obra" as const, descripcion: "Montaje, equilibrado y válvulas (x4)", cantidad: 1, precioUnitario: 40 },
    ],
  },
  {
    name: "Cambio batería",
    lines: [
      { tipo: "recambio" as const, descripcion: "Batería", cantidad: 1, precioUnitario: 95 },
      { tipo: "mano_obra" as const, descripcion: "Sustitución batería", cantidad: 0.25, precioUnitario: 40 },
    ],
  },
  {
    name: "Distribución",
    lines: [
      { tipo: "recambio" as const, descripcion: "Kit distribución completo", cantidad: 1, precioUnitario: 180 },
      { tipo: "recambio" as const, descripcion: "Bomba de agua", cantidad: 1, precioUnitario: 65 },
      { tipo: "mano_obra" as const, descripcion: "Sustitución distribución + bomba", cantidad: 4, precioUnitario: 50 },
    ],
  },
];
