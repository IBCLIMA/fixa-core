export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  vehiculo: string;
  ultimaVisita?: string;
}

export interface Cita {
  id: string;
  nombre: string;
  telefono: string;
  fecha: string;
  comentario?: string;
}

export const clientesMock: Cliente[] = [
  {
    id: "1",
    nombre: "Antonio García",
    telefono: "34612345678",
    vehiculo: "Seat León 2019 — 4532 HBK",
    ultimaVisita: "2026-04-10",
  },
  {
    id: "2",
    nombre: "María López",
    telefono: "34623456789",
    vehiculo: "Renault Clio 2020 — 7891 JNM",
    ultimaVisita: "2026-03-28",
  },
  {
    id: "3",
    nombre: "Pedro Martínez",
    telefono: "34634567890",
    vehiculo: "Volkswagen Golf 2018 — 2345 FGT",
    ultimaVisita: "2026-04-15",
  },
  {
    id: "4",
    nombre: "Laura Sánchez",
    telefono: "34645678901",
    vehiculo: "Ford Focus 2021 — 8901 KLP",
  },
  {
    id: "5",
    nombre: "Carlos Ruiz",
    telefono: "34656789012",
    vehiculo: "Toyota Yaris 2017 — 3456 BMN",
    ultimaVisita: "2026-02-20",
  },
];

export const plantillasWhatsApp = [
  {
    id: "coche_listo",
    label: "Coche listo",
    emoji: "✅",
    mensaje: "Hola {{nombre}}, tu coche ya está listo para recoger. Puedes pasar cuando quieras. ¡Un saludo!",
  },
  {
    id: "presupuesto",
    label: "Presupuesto preparado",
    emoji: "📋",
    mensaje: "Hola {{nombre}}, ya tenemos el presupuesto preparado para tu vehículo. Llámanos o pásate por el taller para revisarlo. ¡Gracias!",
  },
  {
    id: "recordatorio_cita",
    label: "Recordatorio cita",
    emoji: "📅",
    mensaje: "Hola {{nombre}}, te recordamos que tienes cita en el taller mañana. Te esperamos. ¡Un saludo!",
  },
  {
    id: "itv",
    label: "Aviso ITV",
    emoji: "🔔",
    mensaje: "Hola {{nombre}}, te avisamos de que la ITV de tu vehículo caduca pronto. Si quieres, podemos hacer la revisión previa. ¡Llámanos!",
  },
  {
    id: "revision",
    label: "Toca revisión",
    emoji: "🔧",
    mensaje: "Hola {{nombre}}, según nuestros registros, a tu vehículo le toca revisión. ¿Quieres que te reservemos cita? ¡Un saludo!",
  },
];
