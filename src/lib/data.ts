export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  vehiculo: string;
}

export interface Cita {
  id: string;
  clienteId: string;
  nombre: string;
  telefono: string;
  fecha: string;
  motivo: string;
}

export const plantillas = [
  {
    id: "coche_listo",
    label: "Coche listo",
    emoji: "✅",
    mensaje: "Hola {{nombre}}, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!",
  },
  {
    id: "presupuesto",
    label: "Presupuesto listo",
    emoji: "📋",
    mensaje: "Hola {{nombre}}, ya tenemos el presupuesto preparado. Pásate o llámanos para revisarlo. ¡Gracias!",
  },
  {
    id: "pide_cita",
    label: "Pide cita aquí",
    emoji: "📅",
    mensaje: "Hola {{nombre}}, puedes pedir cita en nuestro taller cuando quieras. ¿Qué día te viene mejor? ¡Un saludo!",
  },
  {
    id: "revision",
    label: "Te toca revisión",
    emoji: "🔧",
    mensaje: "Hola {{nombre}}, a tu vehículo le toca revisión. ¿Reservamos cita? ¡Un saludo!",
  },
];

export function enviarWhatsApp(telefono: string, nombre: string, mensaje: string) {
  const texto = mensaje.replace(/\{\{nombre\}\}/g, nombre.split(" ")[0]);
  window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`, "_blank");
}
