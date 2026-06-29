import {
  Car,
  Stethoscope,
  FileText,
  ThumbsUp,
  Wrench,
  Package,
  PackageCheck,
  CheckCircle2,
  KeyRound,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * COPY CENTRALIZADO DEL PORTAL DEL CLIENTE.
 *
 * El portal no existe para "mostrar estados": existe para ELIMINAR
 * incertidumbre. Cada estado responde, en lenguaje humano, a las 4 preguntas
 * del cliente:
 *   1. Qué está pasando con mi vehículo  → descripcion
 *   2. (qué ha cambiado)                 → timeline (HITO_COPY)
 *   3. ¿Tengo que hacer algo?            → accionCliente (SIEMPRE, aunque sea "nada")
 *   4. ¿Cuándo vuelvo a tener noticias?  → proximaActualizacion
 *
 * Lenguaje: "tu vehículo / estamos / hemos / te avisaremos". NUNCA "estado /
 * orden / expediente / proceso / registro". Cero datos inventados: nada de
 * precios, piezas o plazos que el taller no haya puesto.
 *
 * Toda la copy vive aquí — no repartida por componentes (regla #8 del brief).
 */

export type PortalTono = "marca" | "exito" | "espera" | "cancelado";

export interface PortalStatusCopy {
  /** Título humano del momento actual ("Estamos revisando tu vehículo"). */
  titulo: string;
  /** Qué está pasando con el coche ahora mismo (bloque más importante). */
  descripcion: string;
  /** Qué tiene que hacer el cliente. SIEMPRE presente, aunque sea "nada". */
  accionCliente: string;
  /** Cuándo tendrá noticias. null cuando ya no aplica (listo/entregado/cancelado). */
  proximaActualizacion: string | null;
  /** Nivel visual / emocional. */
  tono: PortalTono;
  /** Icono del estado. */
  icon: LucideIcon;
}

const COPY: Record<string, PortalStatusCopy> = {
  recibido: {
    titulo: "Hemos recibido tu vehículo",
    descripcion: "Tu coche ya está con nosotros y registrado. Nuestro equipo lo revisará en breve.",
    accionCliente: "No tienes que hacer nada por ahora.",
    proximaActualizacion: "Te avisaremos cuando empecemos el diagnóstico.",
    tono: "marca",
    icon: Car,
  },
  diagnostico: {
    titulo: "Estamos revisando tu vehículo",
    descripcion: "Nuestro equipo está localizando la avería para prepararte una propuesta clara.",
    accionCliente: "No tienes que hacer nada por ahora.",
    proximaActualizacion: "Te avisaremos cuando tengamos el diagnóstico cerrado.",
    tono: "marca",
    icon: Stethoscope,
  },
  presupuestado: {
    titulo: "Ya tienes tu presupuesto",
    descripcion: "Hemos preparado una propuesta para que puedas decidir, sin sorpresas.",
    accionCliente: "Para continuar necesitamos tu aprobación.",
    proximaActualizacion: "En cuanto lo aceptes, nos ponemos con tu coche.",
    tono: "marca",
    icon: FileText,
  },
  aprobado: {
    titulo: "Presupuesto aceptado, ¡gracias!",
    descripcion: "Ya tenemos todo lo necesario para ponernos con tu coche.",
    accionCliente: "No tienes que hacer nada por ahora.",
    proximaActualizacion: "Te avisaremos cuando empecemos la reparación.",
    tono: "marca",
    icon: ThumbsUp,
  },
  en_reparacion: {
    titulo: "Tu coche ya está en reparación",
    descripcion: "Nuestros mecánicos están manos a la obra con tu vehículo.",
    accionCliente: "No tienes que hacer nada por ahora.",
    proximaActualizacion: "Te avisaremos en cuanto esté listo.",
    tono: "marca",
    icon: Wrench,
  },
  esperando_recambio: {
    titulo: "Hemos pedido la pieza que falta",
    descripcion: "Tu reparación está en marcha; solo falta que llegue una pieza para terminar.",
    accionCliente: "No tienes que hacer nada por ahora.",
    proximaActualizacion: "Te avisaremos cuando llegue la pieza y continuemos.",
    tono: "espera",
    icon: Package,
  },
  pieza_recibida: {
    titulo: "Ya tenemos la pieza",
    descripcion: "Ha llegado lo que faltaba. Retomamos la reparación de tu coche.",
    accionCliente: "No tienes que hacer nada por ahora.",
    proximaActualizacion: "Te avisaremos en cuanto esté listo.",
    tono: "marca",
    icon: PackageCheck,
  },
  listo: {
    titulo: "Tu coche está listo para recoger",
    descripcion: "Hemos terminado la reparación. Puedes pasar a recogerlo cuando quieras.",
    accionCliente: "Ya puedes pasar a recoger tu vehículo.",
    proximaActualizacion: null,
    tono: "exito",
    icon: CheckCircle2,
  },
  entregado: {
    titulo: "¡Gracias por confiar en nosotros!",
    descripcion: "Te hemos devuelto tu coche reparado. Esperamos que todo vaya perfecto.",
    accionCliente: "No tienes que hacer nada más.",
    proximaActualizacion: null,
    tono: "exito",
    icon: KeyRound,
  },
  cancelado: {
    titulo: "Esta reparación se ha cancelado",
    descripcion: "Si tienes cualquier duda sobre tu coche, estamos a un mensaje.",
    accionCliente: "No tienes que hacer nada.",
    proximaActualizacion: null,
    tono: "cancelado",
    icon: XCircle,
  },
};

export function getPortalStatusCopy(estado: string): PortalStatusCopy {
  return COPY[estado] ?? COPY.recibido;
}

/**
 * Copy de cada hito del timeline. En pasado y humano: cuenta la HISTORIA de la
 * reparación, no "estado cambiado a X".
 */
export const HITO_COPY: Record<string, { titulo: string; descripcion: string }> = {
  recibido: { titulo: "Recibido en el taller", descripcion: "Tenemos tu coche y lo hemos registrado." },
  diagnostico: { titulo: "Empezamos el diagnóstico", descripcion: "Nos pusimos a revisar qué necesita exactamente." },
  presupuestado: { titulo: "Te preparamos el presupuesto", descripcion: "Una propuesta clara para que pudieras decidir." },
  aprobado: { titulo: "Presupuesto aprobado", descripcion: "Nos diste el visto bueno. ¡Manos a la obra!" },
  en_reparacion: { titulo: "Empezamos la reparación", descripcion: "Nuestros mecánicos se pusieron con tu coche." },
  esperando_recambio: { titulo: "Pedimos una pieza", descripcion: "Faltaba una pieza y la pedimos para poder terminar." },
  pieza_recibida: { titulo: "Llegó la pieza", descripcion: "Ya teníamos lo que faltaba para continuar." },
  listo: { titulo: "Tu coche quedó listo", descripcion: "Terminamos la reparación y lo dejamos a punto." },
  entregado: { titulo: "Te entregamos el coche", descripcion: "Te devolvimos tu coche reparado. ¡Gracias!" },
};
