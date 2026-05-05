// Plantillas de WhatsApp para talleres mecánicos

export interface PlantillaWhatsApp {
  id: string;
  categoria: "orden" | "cita" | "aviso" | "oferta";
  label: string;
  mensaje: string;
}

export const plantillasWhatsApp: PlantillaWhatsApp[] = [
  // Órdenes
  {
    id: "coche_listo",
    categoria: "orden",
    label: "Coche listo para recoger",
    mensaje: "Hola {{nombre}}, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!",
  },
  {
    id: "presupuesto_listo",
    categoria: "orden",
    label: "Presupuesto preparado",
    mensaje: "Hola {{nombre}}, ya tenemos el presupuesto preparado para tu {{vehiculo}}. ¿Quieres que te lo enviemos o prefieres pasarte? ¡Un saludo!",
  },
  {
    id: "esperando_recambio",
    categoria: "orden",
    label: "Esperando recambio",
    mensaje: "Hola {{nombre}}, tu coche está en el taller pero estamos esperando un recambio. Te avisamos en cuanto llegue. ¡Un saludo!",
  },
  {
    id: "necesita_aprobacion",
    categoria: "orden",
    label: "Necesita aprobación",
    mensaje: "Hola {{nombre}}, hemos revisado tu {{vehiculo}} y necesitamos tu aprobación para continuar con la reparación. ¿Puedes llamarnos o pasar por el taller?",
  },

  // Citas
  {
    id: "recordatorio_cita",
    categoria: "cita",
    label: "Recordatorio de cita",
    mensaje: "Hola {{nombre}}, te recordamos que tienes cita en el taller mañana. ¡Te esperamos!",
  },
  {
    id: "confirmar_cita",
    categoria: "cita",
    label: "Confirmar cita",
    mensaje: "Hola {{nombre}}, ¿confirmamos tu cita en el taller para el {{fecha}}? Responde SÍ para confirmar. ¡Gracias!",
  },

  // Avisos
  {
    id: "aviso_itv",
    categoria: "aviso",
    label: "ITV próxima",
    mensaje: "Hola {{nombre}}, la ITV de tu {{vehiculo}} caduca pronto. ¿Quieres que te hagamos la revisión previa? ¡Pide cita!",
  },
  {
    id: "aviso_revision",
    categoria: "aviso",
    label: "Toca revisión",
    mensaje: "Hola {{nombre}}, según nuestros registros, a tu {{vehiculo}} le toca revisión. ¿Reservamos cita? ¡Un saludo!",
  },
  {
    id: "aviso_aceite",
    categoria: "aviso",
    label: "Cambio de aceite",
    mensaje: "Hola {{nombre}}, hace tiempo del último cambio de aceite de tu {{vehiculo}}. Es importante para el motor. ¿Pides cita?",
  },

  // Ofertas
  {
    id: "oferta_aceite",
    categoria: "oferta",
    label: "Oferta cambio aceite",
    mensaje: "Hola {{nombre}}, este mes tenemos oferta especial en cambio de aceite y filtros. ¿Te reservamos cita? ¡Un saludo!",
  },
  {
    id: "oferta_revision",
    categoria: "oferta",
    label: "Oferta revisión general",
    mensaje: "Hola {{nombre}}, ¿hace cuánto no revisas tu coche? Tenemos revisión general a precio especial. ¡Reserva ya!",
  },
  {
    id: "oferta_neumaticos",
    categoria: "oferta",
    label: "Oferta neumáticos",
    mensaje: "Hola {{nombre}}, es época de revisar neumáticos. Tenemos ofertas especiales. ¿Te interesa? ¡Llámanos!",
  },
  {
    id: "oferta_preitv",
    categoria: "oferta",
    label: "Oferta pre-ITV",
    mensaje: "Hola {{nombre}}, ¿tu ITV está al día? Hacemos revisión pre-ITV para que la pases a la primera. ¡Reserva ya!",
  },
];

export function generarLinkWhatsApp(telefono: string, nombre: string, mensaje: string, vehiculo?: string): string {
  let texto = mensaje
    .replace(/\{\{nombre\}\}/g, nombre.split(" ")[0])
    .replace(/\{\{vehiculo\}\}/g, vehiculo || "vehículo");

  const cleanPhone = telefono.replace(/\s/g, "");
  const fullPhone = cleanPhone.startsWith("34") ? cleanPhone : `34${cleanPhone}`;

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(texto)}`;
}
