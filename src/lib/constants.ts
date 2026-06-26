// ─── Email ───

// Remitente único de marca para todos los emails transaccionales (Resend).
export const EMAIL_FROM = "FIXA <hola@fixataller.es>";

// ─── Estado de órdenes de trabajo ───

export const estadoLabels: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "Diagnóstico",
  presupuestado: "Presupuestado",
  aprobado: "Aprobado",
  en_reparacion: "En reparación",
  esperando_recambio: "Esp. recambio",
  listo: "Finalizado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const estadoColors: Record<string, string> = {
  recibido: "bg-zinc-100 text-zinc-700",
  diagnostico: "bg-blue-100 text-blue-700",
  presupuestado: "bg-amber-100 text-amber-700",
  aprobado: "bg-emerald-100 text-emerald-700",
  en_reparacion: "bg-orange-100 text-orange-700",
  esperando_recambio: "bg-red-100 text-red-700",
  listo: "bg-emerald-200 text-emerald-800",
  entregado: "bg-zinc-100 text-zinc-400",
  cancelado: "bg-zinc-100 text-zinc-300",
};

// Labels extendidos para el detalle de orden
export const estadoLabelsDetalle: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "En diagnóstico",
  presupuestado: "Presupuestado",
  aprobado: "Aprobado",
  en_reparacion: "En reparación",
  esperando_recambio: "Esperando recambio",
  listo: "Finalizado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

// Labels para el portal del cliente
export const estadoLabelsCliente: Record<string, string> = {
  recibido: "Tu vehículo ha sido recibido en el taller",
  diagnostico: "Estamos diagnosticando tu vehículo",
  presupuestado: "Presupuesto preparado",
  aprobado: "Reparación aprobada",
  en_reparacion: "Tu vehículo está siendo reparado",
  esperando_recambio: "Esperando recambio para continuar",
  listo: "¡Tu vehículo está listo! Ya puedes venir a recogerlo.",
  entregado: "Vehículo entregado",
  cancelado: "Orden cancelada",
};
