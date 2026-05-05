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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ═══ ENUMS ═══

export const combustibleEnum = pgEnum("combustible", [
  "gasolina",
  "diesel",
  "electrico",
  "hibrido",
  "glp",
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

// ═══ TABLAS ═══

export const planEnum = pgEnum("plan", ["pendiente", "trial", "basico", "taller", "pro", "cancelado"]);

export const talleres = pgTable("talleres", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: text("nombre").notNull(),
  cif: text("cif"),
  direccion: text("direccion"),
  telefono: text("telefono"),
  email: text("email"),
  clerkOrgId: text("clerk_org_id").unique(),
  // Suscripción
  plan: planEnum("plan").default("trial").notNull(),
  trialEndsAt: timestamp("trial_ends_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  suscripcionActiva: boolean("suscripcion_activa").default(false),
  ultimoAcceso: timestamp("ultimo_acceso"),
  activo: boolean("activo").default(true).notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
});

// ═══ RELACIONES ═══

export const talleresRelations = relations(talleres, ({ many }) => ({
  usuarios: many(usuarios),
  clientes: many(clientes),
  vehiculos: many(vehiculos),
  ordenes: many(ordenesTrabajo),
  citas: many(citas),
  presupuestos: many(presupuestos),
  avisos: many(avisos),
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
  })
);

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
