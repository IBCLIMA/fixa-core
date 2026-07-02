import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  date,
  time,
  pgEnum,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ═══ ENUMS ═══

export const combustibleEnum = pgEnum("combustible", [
  "gasolina",
  "diesel",
  "electrico",
  "hibrido",
  "glp",
]);

export const metodoPagoEnum = pgEnum("metodo_pago", [
  "efectivo",
  "tarjeta",
  "transferencia",
  "bizum",
  "domiciliacion",
  "otro",
]);

export const estadoOrdenEnum = pgEnum("estado_orden", [
  "recibido",
  "diagnostico",
  "presupuestado",
  "aprobado",
  "en_reparacion",
  "esperando_recambio",
  "listo",
  "entregado",
  "cancelado",
]);

export const tipoLineaEnum = pgEnum("tipo_linea", [
  "mano_obra",
  "recambio",
  "otros",
]);

export const estadoPresupuestoEnum = pgEnum("estado_presupuesto", [
  "borrador",
  "enviado",
  "aceptado",
  "rechazado",
  "expirado",
]);

export const estadoCitaEnum = pgEnum("estado_cita", [
  "programada",
  "confirmada",
  "completada",
  "cancelada",
  "no_presentado",
]);

export const tipoAvisoEnum = pgEnum("tipo_aviso", [
  "itv",
  "revision_km",
  "aceite",
  "neumaticos",
  "frenos",
  "personalizado",
]);

export const tipoFotoEnum = pgEnum("tipo_foto", [
  "entrada",
  "proceso",
  "salida",
]);

export const rolUsuarioEnum = pgEnum("rol_usuario", [
  "admin",
  "mecanico",
  "recepcion",
]);

export const estadoInspeccionEnum = pgEnum("estado_inspeccion", ["bien", "atencion", "urgente", "no_aplica"]);

export const accionAuditEnum = pgEnum("accion_audit", [
  "create",
  "read",
  "update",
  "delete",
  "export",
  "login",
]);

// ═══ TABLAS ═══

export const planEnum = pgEnum("plan", ["pendiente", "trial", "basico", "taller", "pro", "cancelado"]);

export const feedbackTipoEnum = pgEnum("feedback_tipo", ["sugerencia", "incidencia", "consulta"]);

export const estadoCobroEnum = pgEnum("estado_cobro", ["al_corriente", "impagado", "pendiente"]);

export const talleres = pgTable("talleres", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: text("nombre").notNull(),
  cif: text("cif"),
  direccion: text("direccion"),
  telefono: text("telefono"),
  email: text("email"),
  codigoPostal: text("codigo_postal"),
  ciudad: text("ciudad"),
  provincia: text("provincia"),
  logoUrl: text("logo_url"),
  mensajesWhatsapp: jsonb("mensajes_whatsapp").default("{}"), // { estado, informe, presupuesto, resena, averia }
  registroIndustrial: text("registro_industrial"),
  ramaActividad: text("rama_actividad").array(),
  precioHora: numeric("precio_hora", { precision: 10, scale: 2 }).default("40.00"),
  flujoTaller: jsonb("flujo_taller").default('"simple"'),
  horarioApertura: text("horario_apertura").default("08:00"),
  horarioCierre: text("horario_cierre").default("18:00"),
  trabajaSabados: boolean("trabaja_sabados").default(false),
  horarioSabadoApertura: text("horario_sabado_apertura").default("09:00"),
  horarioSabadoCierre: text("horario_sabado_cierre").default("13:00"),
  capacidadDiaria: integer("capacidad_diaria").default(4), // "simple" | "completo" | string[] (custom phases) // ['mecanica','electricidad','carroceria','pintura']
  clerkOrgId: text("clerk_org_id").unique(),
  // Suscripción
  plan: planEnum("plan").default("trial").notNull(),
  trialEndsAt: timestamp("trial_ends_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  suscripcionActiva: boolean("suscripcion_activa").default(false),
  ultimoAcceso: timestamp("ultimo_acceso"),
  activo: boolean("activo").default(true).notNull(),
  dpaAcceptedAt: timestamp("dpa_accepted_at"),
  googleReviewLink: text("google_review_link"),
  recordatorioCitas: boolean("recordatorio_citas").default(true).notNull(),
  newsletterConsent: boolean("newsletter_consent").default(false).notNull(),
  newsletterConsentAt: timestamp("newsletter_consent_at"),
  // Agrupación de talleres de un mismo dueño (uso super-admin: switcher de talleres).
  // NULL para talleres normales (no afecta a la app general).
  grupoAdmin: text("grupo_admin"),
  // Cobro SEPA manual (Ibañez Clima gira el recibo; se marca a mano).
  estadoCobro: estadoCobroEnum("estado_cobro").default("al_corriente"),
  notaCobro: text("nota_cobro"),
  // Taller fundador/piloto: acceso gratis sin trial que expire ni pantallas de pago.
  esPiloto: boolean("es_piloto").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").unique().notNull(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  rol: rolUsuarioEnum("rol").default("admin").notNull(),
  nombre: text("nombre").notNull(),
  comisionPct: numeric("comision_pct", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientes = pgTable("clientes", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  nombre: text("nombre").notNull(),
  telefono: text("telefono"),
  email: text("email"),
  nif: text("nif"),
  direccion: text("direccion"),
  notas: text("notas"),
  origenExterno: text("origen_externo"),
  origenExternoId: text("origen_externo_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_clientes_taller").on(table.tallerId),
]);

export const vehiculos = pgTable("vehiculos", {
  id: uuid("id").defaultRandom().primaryKey(),
  clienteId: uuid("cliente_id")
    .references(() => clientes.id)
    .notNull(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  matricula: text("matricula").notNull(),
  marca: text("marca"),
  modelo: text("modelo"),
  anio: integer("anio"),
  km: integer("km"),
  vin: text("vin"),
  combustible: combustibleEnum("combustible"),
  color: text("color"),
  fechaItv: date("fecha_itv"),
  notas: text("notas"),
  origenExterno: text("origen_externo"),
  origenExternoId: text("origen_externo_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_vehiculos_taller_matricula").on(table.tallerId, table.matricula),
  index("idx_vehiculos_cliente").on(table.clienteId),
]);

export const ordenesTrabajo = pgTable("ordenes_trabajo", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  vehiculoId: uuid("vehiculo_id")
    .references(() => vehiculos.id)
    .notNull(),
  clienteId: uuid("cliente_id")
    .references(() => clientes.id)
    .notNull(),
  numero: integer("numero").notNull(),
  estado: estadoOrdenEnum("estado").default("recibido").notNull(),
  kmEntrada: integer("km_entrada"),
  descripcionCliente: text("descripcion_cliente"),
  diagnostico: text("diagnostico"),
  fechaEntrada: timestamp("fecha_entrada").defaultNow().notNull(),
  fechaEstimada: timestamp("fecha_estimada"),
  fechaEntrega: timestamp("fecha_entrega"),
  asignadoA: uuid("asignado_a").references(() => usuarios.id),
  notasInternas: text("notas_internas"),
  tokenPublico: text("token_publico").unique(),
  // Legal (RD 1457/1986)
  tipoIntervencion: text("tipo_intervencion").array(), // ['mecanica','chapa','pintura','electricidad','diagnostico','mantenimiento','pre_itv','otro']
  motivoDeposito: text("motivo_deposito").default("reparacion"), // 'presupuesto' | 'reparacion'
  renunciaPresupuesto: boolean("renuncia_presupuesto").default(false),
  renunciaPiezas: boolean("renuncia_piezas").default(false),
  observacionesEntrada: text("observaciones_entrada"), // daños preexistentes
  firmaCliente: text("firma_cliente"), // base64 data URL
  firmaClienteAt: timestamp("firma_cliente_at"),
  // Seguro (chapa y pintura)
  aseguradora: text("aseguradora"),
  numPoliza: text("num_poliza"),
  numSiniestro: text("num_siniestro"),
  numPeritaje: text("num_peritaje"),
  nombrePerito: text("nombre_perito"),
  // Pago
  pagado: boolean("pagado").default(false).notNull(),
  metodoPago: metodoPagoEnum("metodo_pago"),
  fechaPago: timestamp("fecha_pago"),
  importeTotal: numeric("importe_total", { precision: 10, scale: 2 }),
  notasPago: text("notas_pago"),
  origenExterno: text("origen_externo"),
  origenExternoId: text("origen_externo_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_ordenes_taller_estado").on(table.tallerId, table.estado),
  index("idx_ordenes_taller_created").on(table.tallerId, table.createdAt),
  index("idx_ordenes_vehiculo").on(table.vehiculoId),
  index("idx_ordenes_cliente").on(table.clienteId),
]);

export const lineasOrden = pgTable("lineas_orden", {
  id: uuid("id").defaultRandom().primaryKey(),
  ordenId: uuid("orden_id")
    .references(() => ordenesTrabajo.id, { onDelete: "cascade" })
    .notNull(),
  tipo: tipoLineaEnum("tipo").notNull(),
  descripcion: text("descripcion").notNull(),
  cantidad: numeric("cantidad", { precision: 10, scale: 2 })
    .default("1")
    .notNull(),
  precioUnitario: numeric("precio_unitario", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  descuentoPct: numeric("descuento_pct", { precision: 5, scale: 2 }).default(
    "0"
  ),
  ivaPct: numeric("iva_pct", { precision: 5, scale: 2 })
    .default("21")
    .notNull(),
  tipoPieza: text("tipo_pieza").default("nueva"), // 'nueva' | 'reconstruida' | 'usada'
  referencia: text("referencia"), // Part reference number for traceability
  esAveriaOculta: boolean("es_averia_oculta").default(false),
  // Gestión de recambios — estados inline por línea
  estadoRecambio: text("estado_recambio").default("sin_pedir"), // 'sin_pedir' | 'consultado' | 'pedido' | 'recibido'
  recambistaId: uuid("recambista_id").references(() => recambistas.id),
  precioCompra: numeric("precio_compra", { precision: 10, scale: 2 }), // opcional: lo que pagó al recambista
  consultadoAt: timestamp("consultado_at"),
  pedidoAt: timestamp("pedido_at"),
  recibidoAt: timestamp("recibido_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_lineas_orden_orden").on(table.ordenId),
]);

// Recambistas del taller (proveedores de piezas)
export const recambistas = pgTable("recambistas", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id, { onDelete: "cascade" })
    .notNull(),
  nombre: text("nombre").notNull(),
  telefono: text("telefono").notNull(),
  notas: text("notas"), // ej: "bueno para frenos", "entrega rápida"
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_recambistas_taller").on(table.tallerId),
]);

export const presupuestos = pgTable("presupuestos", {
  id: uuid("id").defaultRandom().primaryKey(),
  ordenId: uuid("orden_id").references(() => ordenesTrabajo.id),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  vehiculoId: uuid("vehiculo_id")
    .references(() => vehiculos.id)
    .notNull(),
  clienteId: uuid("cliente_id")
    .references(() => clientes.id)
    .notNull(),
  numero: integer("numero").notNull(),
  estado: estadoPresupuestoEnum("estado").default("borrador").notNull(),
  validezDias: integer("validez_dias").default(30),
  notas: text("notas"),
  tokenPublico: text("token_publico").unique(),
  // Acceptance tracking (legal proof)
  aceptadoAt: timestamp("aceptado_at"),
  aceptadoIp: text("aceptado_ip"),
  aceptadoTexto: text("aceptado_texto"), // Snapshot of what the client accepted
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_presupuestos_taller_estado").on(table.tallerId, table.estado),
  index("idx_presupuestos_orden").on(table.ordenId),
]);

export const lineasPresupuesto = pgTable("lineas_presupuesto", {
  id: uuid("id").defaultRandom().primaryKey(),
  presupuestoId: uuid("presupuesto_id")
    .references(() => presupuestos.id, { onDelete: "cascade" })
    .notNull(),
  tipo: tipoLineaEnum("tipo").notNull(),
  descripcion: text("descripcion").notNull(),
  cantidad: numeric("cantidad", { precision: 10, scale: 2 })
    .default("1")
    .notNull(),
  precioUnitario: numeric("precio_unitario", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  descuentoPct: numeric("descuento_pct", { precision: 5, scale: 2 }).default(
    "0"
  ),
  ivaPct: numeric("iva_pct", { precision: 5, scale: 2 })
    .default("21")
    .notNull(),
  referencia: text("referencia"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_lineas_presupuesto_presupuesto").on(table.presupuestoId),
]);

export const citas = pgTable("citas", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  clienteId: uuid("cliente_id").references(() => clientes.id),
  vehiculoId: uuid("vehiculo_id").references(() => vehiculos.id),
  nombreCliente: text("nombre_cliente").notNull(),
  telefonoCliente: text("telefono_cliente"),
  fecha: date("fecha").notNull(),
  horaInicio: time("hora_inicio"),
  horaFin: time("hora_fin"),
  motivo: text("motivo"),
  estado: estadoCitaEnum("estado").default("programada").notNull(),
  notas: text("notas"),
  consentimientoAt: timestamp("consentimiento_at"), // RGPD: cuándo aceptó el cliente el tratamiento de datos (citas online)
  origenExterno: text("origen_externo"),
  origenExternoId: text("origen_externo_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_citas_taller_fecha").on(table.tallerId, table.fecha),
]);

export const avisos = pgTable("avisos", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  vehiculoId: uuid("vehiculo_id")
    .references(() => vehiculos.id)
    .notNull(),
  tipo: tipoAvisoEnum("tipo").notNull(),
  descripcion: text("descripcion"),
  fechaAviso: date("fecha_aviso"),
  kmAviso: integer("km_aviso"),
  enviado: boolean("enviado").default(false).notNull(),
  fechaEnvio: timestamp("fecha_envio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fotosOrden = pgTable("fotos_orden", {
  id: uuid("id").defaultRandom().primaryKey(),
  ordenId: uuid("orden_id")
    .references(() => ordenesTrabajo.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  descripcion: text("descripcion"),
  tipo: tipoFotoEnum("tipo").default("entrada"),
  esVideo: boolean("es_video").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Suscripciones web push (un dispositivo = una fila)
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id, { onDelete: "cascade" })
    .notNull(),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").unique().notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_push_subs_taller").on(table.tallerId),
]);

// Leads de marketing (lead magnet: plantilla OR, newsletter…)
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  fuente: text("fuente").default("plantilla-or").notNull(),
  consentAt: timestamp("consent_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Rate limiting distribuido (contador atómico compartido entre instancias de Vercel)
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").default(1).notNull(),
  resetAt: timestamp("reset_at").notNull(),
});

export const historialEstados = pgTable("historial_estados", {
  id: uuid("id").defaultRandom().primaryKey(),
  ordenId: uuid("orden_id")
    .references(() => ordenesTrabajo.id, { onDelete: "cascade" })
    .notNull(),
  estadoAnterior: estadoOrdenEnum("estado_anterior"),
  estadoNuevo: estadoOrdenEnum("estado_nuevo").notNull(),
  usuarioId: uuid("usuario_id").references(() => usuarios.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  // Timeline del portal del cliente y torre de control: consulta caliente por orden.
  index("idx_historial_orden").on(table.ordenId),
]);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tallerId: uuid("taller_id")
      .references(() => talleres.id)
      .notNull(),
    userId: text("user_id").notNull(),
    action: accionAuditEnum("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    details: jsonb("details"),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_audit_logs_taller_created").on(table.tallerId, table.createdAt),
  ]
);

export const inspeccionesOrden = pgTable("inspecciones_orden", {
  id: uuid("id").defaultRandom().primaryKey(),
  ordenId: uuid("orden_id").references(() => ordenesTrabajo.id, { onDelete: "cascade" }).notNull(),
  categoria: text("categoria").notNull(),
  item: text("item").notNull(),
  estado: estadoInspeccionEnum("estado").default("no_aplica").notNull(),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificaciones = pgTable("notificaciones", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  usuarioId: uuid("usuario_id").references(() => usuarios.id),
  tipo: text("tipo").notNull(), // "cita_nueva", "orden_lista", "pago_pendiente", "itv_proxima", "mantenimiento_pendiente"
  titulo: text("titulo").notNull(),
  mensaje: text("mensaje").notNull(),
  leida: boolean("leida").default(false).notNull(),
  enlace: text("enlace"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_notificaciones_taller_created").on(table.tallerId, table.createdAt),
]);

export const recordatoriosMantenimiento = pgTable("recordatorios_mantenimiento", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  vehiculoId: uuid("vehiculo_id")
    .references(() => vehiculos.id)
    .notNull(),
  tipo: text("tipo").notNull(),
  kmIntervalo: integer("km_intervalo"),
  mesesIntervalo: integer("meses_intervalo"),
  ultimoKm: integer("ultimo_km"),
  ultimaFecha: date("ultima_fecha"),
  proximoKm: integer("proximo_km"),
  proximaFecha: date("proxima_fecha"),
  activo: boolean("activo").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inviteTokens = pgTable("invite_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  rol: rolUsuarioEnum("rol").default("mecanico").notNull(),
  token: text("token").unique().notNull(),
  usado: boolean("usado").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const documentosCobro = pgTable("documentos_cobro", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  ordenId: uuid("orden_id")
    .references(() => ordenesTrabajo.id)
    .notNull(),
  clienteId: uuid("cliente_id")
    .references(() => clientes.id)
    .notNull(),
  vehiculoId: uuid("vehiculo_id")
    .references(() => vehiculos.id)
    .notNull(),
  numero: integer("numero").notNull(),
  // Workshop data (snapshot at time of creation)
  tallerNombre: text("taller_nombre").notNull(),
  tallerCif: text("taller_cif"),
  tallerDireccion: text("taller_direccion"),
  tallerTelefono: text("taller_telefono"),
  tallerEmail: text("taller_email"),
  // Client data (snapshot)
  clienteNombre: text("cliente_nombre").notNull(),
  clienteNif: text("cliente_nif"),
  clienteDireccion: text("cliente_direccion"),
  clienteTelefono: text("cliente_telefono"),
  // Vehicle data (snapshot)
  matricula: text("matricula").notNull(),
  marca: text("marca"),
  modelo: text("modelo"),
  km: integer("km"),
  // Financial
  baseImponible: numeric("base_imponible", { precision: 10, scale: 2 }).notNull(),
  totalIva: numeric("total_iva", { precision: 10, scale: 2 }).notNull(),
  totalFinal: numeric("total_final", { precision: 10, scale: 2 }).notNull(),
  // Lines stored as JSON snapshot (immutable once created)
  lineas: jsonb("lineas").notNull(), // Array of { tipo, descripcion, cantidad, precioUnitario, descuentoPct, ivaPct, subtotal }
  // Payment
  metodoPago: metodoPagoEnum("metodo_pago"),
  fechaPago: timestamp("fecha_pago"),
  // Metadata
  estado: text("estado").default("borrador").notNull(), // borrador | finalizado
  notas: text("notas"),
  tokenPublico: text("token_publico").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const diasBloqueados = pgTable("dias_bloqueados", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  fecha: date("fecha").notNull(),
  motivo: text("motivo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const plantillasServicio = pgTable("plantillas_servicio", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  nombre: text("nombre").notNull(),
  lineas: jsonb("lineas").notNull(), // Array of { tipo, descripcion, cantidad, precioUnitario }
  origenExterno: text("origen_externo"),
  origenExternoId: text("origen_externo_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const averiasOcultas = pgTable("averias_ocultas", {
  id: uuid("id").defaultRandom().primaryKey(),
  ordenId: uuid("orden_id")
    .references(() => ordenesTrabajo.id, { onDelete: "cascade" })
    .notNull(),
  tallerId: uuid("taller_id")
    .references(() => talleres.id)
    .notNull(),
  descripcion: text("descripcion").notNull(),
  importeEstimado: numeric("importe_estimado", { precision: 10, scale: 2 }),
  fotoUrl: text("foto_url"),
  // Notificación
  notificadoAt: timestamp("notificado_at"),
  metodoNotificacion: text("metodo_notificacion"), // 'whatsapp' | 'email' | 'telefono' | 'presencial'
  // Aprobación
  tokenAprobacion: text("token_aprobacion").unique(),
  estado: text("estado").default("pendiente").notNull(), // 'pendiente' | 'aprobada' | 'rechazada'
  respondidoAt: timestamp("respondido_at"),
  // Metadata
  registradoPor: uuid("registrado_por").references(() => usuarios.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Feedback/soporte de los talleres → buzón del super-admin en /admin
export const feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  tallerId: uuid("taller_id").references(() => talleres.id),
  usuarioId: uuid("usuario_id").references(() => usuarios.id),
  tipo: feedbackTipoEnum("tipo").default("sugerencia").notNull(),
  mensaje: text("mensaje").notNull(),
  estado: text("estado").default("nuevo").notNull(), // 'nuevo' | 'visto' | 'resuelto'
  tallerNombre: text("taller_nombre"),
  usuarioNombre: text("usuario_nombre"),
  contactoEmail: text("contacto_email"),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_feedback_estado_created").on(table.estado, table.createdAt),
]);

// Registro INMUTABLE de acciones del super-admin (impersonar, cambiar plan, cobro…).
export const adminAudit = pgTable("admin_audit", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminEmail: text("admin_email").notNull(),
  accion: text("accion").notNull(), // 'entrar_como' | 'cambiar_plan' | 'activar' | 'desactivar' | 'aprobar' | 'estado_cobro' | ...
  tallerId: uuid("taller_id"),
  tallerNombre: text("taller_nombre"),
  detalles: jsonb("detalles"), // { antes, despues, ... }
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_admin_audit_created").on(table.createdAt),
]);

// ═══ MÉTRICAS HISTÓRICAS (snapshot diario) ═══
//
// Una fila por día y por taller (tallerId NOT NULL) = timeline de uso real de
// cada taller → detecta churn ("dejó de usar FIXA el día X").
// Una fila por día con tallerId NULL = agregado de plataforma de ese día
// (MRR, registros, talleres activos…) → tendencias para el fundador.
//
// Lo rellena el cron /api/cron/daily-stats (idempotente: UPSERT por día).
// Sustituye los cálculos al vuelo de admin/metricas y admin/actividad, que no
// escalan. Aquí se LEE la serie histórica; el cron es quien CALCULA.
//
// Idempotencia con tallerId nullable: NO se usa una única unique sobre
// (fecha, tallerId) porque en Postgres dos NULL son distintos y duplicaría la
// fila de plataforma. Se usan DOS índices únicos PARCIALES (ver SQL al pie del
// fichero): uno para filas de taller y otro para la fila de plataforma. Es
// portable a cualquier versión de Postgres (no depende de NULLS NOT DISTINCT).
export const dailyStats = pgTable(
  "daily_stats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fecha: date("fecha").notNull(),
    // NULL ⇒ fila agregada de plataforma. NOT NULL ⇒ snapshot de ese taller.
    tallerId: uuid("taller_id").references(() => talleres.id, { onDelete: "cascade" }),

    // ── Actividad del día (en ambos tipos de fila) ──────────────────
    ordenesCreadas: integer("ordenes_creadas").default(0).notNull(),
    citasCreadas: integer("citas_creadas").default(0).notNull(),
    // Acumulado de órdenes del taller a fecha del snapshot (0 en fila plataforma).
    ordenesTotal: integer("ordenes_total").default(0).notNull(),
    // Per-taller: ¿hubo actividad real ese día? (orden/cita creada o acceso).
    activo: boolean("activo").default(false).notNull(),

    // ── Agregado de plataforma (solo significativo cuando tallerId IS NULL) ──
    registros: integer("registros").default(0).notNull(), // talleres nuevos ese día
    talleresTotal: integer("talleres_total").default(0).notNull(), // base operativa (no pendientes)
    talleresTrial: integer("talleres_trial").default(0).notNull(),
    talleresPagando: integer("talleres_pagando").default(0).notNull(),
    talleresActivos: integer("talleres_activos").default(0).notNull(), // con actividad ese día
    mrr: numeric("mrr", { precision: 10, scale: 2 }).default("0").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_daily_stats_fecha").on(table.fecha),
    // Un snapshot por taller y día.
    uniqueIndex("uq_daily_stats_taller_dia")
      .on(table.fecha, table.tallerId)
      .where(sql`taller_id IS NOT NULL`),
    // Una sola fila de plataforma por día.
    uniqueIndex("uq_daily_stats_plataforma_dia")
      .on(table.fecha)
      .where(sql`taller_id IS NULL`),
  ]
);

// ═══ RELACIONES ═══

export const inviteTokensRelations = relations(inviteTokens, ({ one }) => ({
  taller: one(talleres, {
    fields: [inviteTokens.tallerId],
    references: [talleres.id],
  }),
}));

export const talleresRelations = relations(talleres, ({ many }) => ({
  usuarios: many(usuarios),
  clientes: many(clientes),
  vehiculos: many(vehiculos),
  ordenes: many(ordenesTrabajo),
  inviteTokens: many(inviteTokens),
  citas: many(citas),
  presupuestos: many(presupuestos),
  avisos: many(avisos),
  notificaciones: many(notificaciones),
  documentosCobro: many(documentosCobro),
}));

export const clientesRelations = relations(clientes, ({ one, many }) => ({
  taller: one(talleres, {
    fields: [clientes.tallerId],
    references: [talleres.id],
  }),
  vehiculos: many(vehiculos),
  ordenes: many(ordenesTrabajo),
  citas: many(citas),
}));

export const vehiculosRelations = relations(vehiculos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [vehiculos.clienteId],
    references: [clientes.id],
  }),
  taller: one(talleres, {
    fields: [vehiculos.tallerId],
    references: [talleres.id],
  }),
  ordenes: many(ordenesTrabajo),
  avisos: many(avisos),
  recordatorios: many(recordatoriosMantenimiento),
}));

export const ordenesTrabajoRelations = relations(
  ordenesTrabajo,
  ({ one, many }) => ({
    taller: one(talleres, {
      fields: [ordenesTrabajo.tallerId],
      references: [talleres.id],
    }),
    vehiculo: one(vehiculos, {
      fields: [ordenesTrabajo.vehiculoId],
      references: [vehiculos.id],
    }),
    cliente: one(clientes, {
      fields: [ordenesTrabajo.clienteId],
      references: [clientes.id],
    }),
    asignado: one(usuarios, {
      fields: [ordenesTrabajo.asignadoA],
      references: [usuarios.id],
    }),
    lineas: many(lineasOrden),
    fotos: many(fotosOrden),
    historial: many(historialEstados),
    inspecciones: many(inspeccionesOrden),
    documentosCobro: many(documentosCobro),
    averiasOcultas: many(averiasOcultas),
  })
);

export const plantillasServicioRelations = relations(plantillasServicio, ({ one }) => ({
  taller: one(talleres, {
    fields: [plantillasServicio.tallerId],
    references: [talleres.id],
  }),
}));

export const averiasOcultasRelations = relations(averiasOcultas, ({ one }) => ({
  orden: one(ordenesTrabajo, {
    fields: [averiasOcultas.ordenId],
    references: [ordenesTrabajo.id],
  }),
  taller: one(talleres, {
    fields: [averiasOcultas.tallerId],
    references: [talleres.id],
  }),
  registrador: one(usuarios, {
    fields: [averiasOcultas.registradoPor],
    references: [usuarios.id],
  }),
}));

export const citasRelations = relations(citas, ({ one }) => ({
  taller: one(talleres, {
    fields: [citas.tallerId],
    references: [talleres.id],
  }),
  cliente: one(clientes, {
    fields: [citas.clienteId],
    references: [clientes.id],
  }),
  vehiculo: one(vehiculos, {
    fields: [citas.vehiculoId],
    references: [vehiculos.id],
  }),
}));

export const inspeccionesOrdenRelations = relations(inspeccionesOrden, ({ one }) => ({
  orden: one(ordenesTrabajo, {
    fields: [inspeccionesOrden.ordenId],
    references: [ordenesTrabajo.id],
  }),
}));

export const recordatoriosMantenimientoRelations = relations(recordatoriosMantenimiento, ({ one }) => ({
  taller: one(talleres, {
    fields: [recordatoriosMantenimiento.tallerId],
    references: [talleres.id],
  }),
  vehiculo: one(vehiculos, {
    fields: [recordatoriosMantenimiento.vehiculoId],
    references: [vehiculos.id],
  }),
}));

export const notificacionesRelations = relations(notificaciones, ({ one }) => ({
  taller: one(talleres, {
    fields: [notificaciones.tallerId],
    references: [talleres.id],
  }),
  usuario: one(usuarios, {
    fields: [notificaciones.usuarioId],
    references: [usuarios.id],
  }),
}));

export const documentosCobroRelations = relations(documentosCobro, ({ one }) => ({
  taller: one(talleres, {
    fields: [documentosCobro.tallerId],
    references: [talleres.id],
  }),
  orden: one(ordenesTrabajo, {
    fields: [documentosCobro.ordenId],
    references: [ordenesTrabajo.id],
  }),
  cliente: one(clientes, {
    fields: [documentosCobro.clienteId],
    references: [clientes.id],
  }),
  vehiculo: one(vehiculos, {
    fields: [documentosCobro.vehiculoId],
    references: [vehiculos.id],
  }),
}));

/* ═══════════════════════════════════════════════════════════════════════════
 * SQL a aplicar A MANO en Neon para la tabla `daily_stats` (métricas históricas).
 * No se ejecuta nada desde aquí — copiar y pegar en el SQL editor de Neon.
 * Es idempotente (IF NOT EXISTS), se puede correr varias veces sin romper nada.
 *
 *   CREATE TABLE IF NOT EXISTS daily_stats (
 *     id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *     fecha            date NOT NULL,
 *     taller_id        uuid REFERENCES talleres(id) ON DELETE CASCADE,
 *     ordenes_creadas  integer NOT NULL DEFAULT 0,
 *     citas_creadas    integer NOT NULL DEFAULT 0,
 *     ordenes_total    integer NOT NULL DEFAULT 0,
 *     activo           boolean NOT NULL DEFAULT false,
 *     registros        integer NOT NULL DEFAULT 0,
 *     talleres_total   integer NOT NULL DEFAULT 0,
 *     talleres_trial   integer NOT NULL DEFAULT 0,
 *     talleres_pagando integer NOT NULL DEFAULT 0,
 *     talleres_activos integer NOT NULL DEFAULT 0,
 *     mrr              numeric(10,2) NOT NULL DEFAULT 0,
 *     created_at       timestamp NOT NULL DEFAULT now()
 *   );
 *
 *   CREATE INDEX IF NOT EXISTS idx_daily_stats_fecha
 *     ON daily_stats (fecha);
 *
 *   -- Un snapshot por taller y día.
 *   CREATE UNIQUE INDEX IF NOT EXISTS uq_daily_stats_taller_dia
 *     ON daily_stats (fecha, taller_id) WHERE taller_id IS NOT NULL;
 *
 *   -- Una sola fila de plataforma (taller_id NULL) por día.
 *   CREATE UNIQUE INDEX IF NOT EXISTS uq_daily_stats_plataforma_dia
 *     ON daily_stats (fecha) WHERE taller_id IS NULL;
 *
 * ═══════════════════════════════════════════════════════════════════════════ */

// ── Torre de control V1 ──────────────────────────────────────────────────────
// Tracking del portal del cliente: alerta "presupuesto visto pero no aceptado"
// + métrica estrella (aperturas por reparación).
export const portalViews = pgTable(
  "portal_views",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tallerId: uuid("taller_id").references(() => talleres.id, { onDelete: "cascade" }).notNull(),
    tipo: text("tipo").notNull(), // estado | presupuesto | documento | informe | aprobar
    entidadId: uuid("entidad_id").notNull(),
    token: text("token"),
    clienteId: uuid("cliente_id"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_portal_views_entidad").on(table.tipo, table.entidadId, table.createdAt),
    index("idx_portal_views_taller").on(table.tallerId, table.createdAt),
  ]
);

// La alerta de la torre de control se DERIVA al vuelo de timestamps existentes.
// Aquí SOLO guardamos su gestión (gestionada / pospuesta) → cero deuda-ERP.
export const alertasGestion = pgTable(
  "alertas_gestion",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tallerId: uuid("taller_id").references(() => talleres.id, { onDelete: "cascade" }).notNull(),
    alertaKey: text("alerta_key").notNull(), // determinista: `${tipo}:${entidadId}`
    estado: text("estado").notNull(), // gestionada | pospuesta
    pospuestaHasta: timestamp("pospuesta_hasta"),
    accion: text("accion"),
    gestionadaPor: text("gestionada_por"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_alertas_gestion_lookup").on(table.tallerId, table.alertaKey, table.createdAt),
  ]
);
