CREATE TYPE "public"."accion_audit" AS ENUM('create', 'read', 'update', 'delete', 'export', 'login');--> statement-breakpoint
CREATE TYPE "public"."combustible" AS ENUM('gasolina', 'diesel', 'electrico', 'hibrido', 'glp');--> statement-breakpoint
CREATE TYPE "public"."estado_cita" AS ENUM('programada', 'confirmada', 'completada', 'cancelada', 'no_presentado');--> statement-breakpoint
CREATE TYPE "public"."estado_inspeccion" AS ENUM('bien', 'atencion', 'urgente', 'no_aplica');--> statement-breakpoint
CREATE TYPE "public"."estado_orden" AS ENUM('recibido', 'diagnostico', 'presupuestado', 'aprobado', 'en_reparacion', 'esperando_recambio', 'listo', 'entregado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."estado_presupuesto" AS ENUM('borrador', 'enviado', 'aceptado', 'rechazado', 'expirado');--> statement-breakpoint
CREATE TYPE "public"."metodo_pago" AS ENUM('efectivo', 'tarjeta', 'transferencia', 'bizum', 'domiciliacion', 'otro');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('pendiente', 'trial', 'basico', 'taller', 'pro', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."rol_usuario" AS ENUM('admin', 'mecanico', 'recepcion');--> statement-breakpoint
CREATE TYPE "public"."tipo_aviso" AS ENUM('itv', 'revision_km', 'aceite', 'neumaticos', 'frenos', 'personalizado');--> statement-breakpoint
CREATE TYPE "public"."tipo_foto" AS ENUM('entrada', 'proceso', 'salida');--> statement-breakpoint
CREATE TYPE "public"."tipo_linea" AS ENUM('mano_obra', 'recambio', 'otros');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"action" "accion_audit" NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"details" jsonb,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "averias_ocultas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orden_id" uuid NOT NULL,
	"taller_id" uuid NOT NULL,
	"descripcion" text NOT NULL,
	"importe_estimado" numeric(10, 2),
	"foto_url" text,
	"notificado_at" timestamp,
	"metodo_notificacion" text,
	"token_aprobacion" text,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"respondido_at" timestamp,
	"registrado_por" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "averias_ocultas_token_aprobacion_unique" UNIQUE("token_aprobacion")
);
--> statement-breakpoint
CREATE TABLE "avisos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"tipo" "tipo_aviso" NOT NULL,
	"descripcion" text,
	"fecha_aviso" date,
	"km_aviso" integer,
	"enviado" boolean DEFAULT false NOT NULL,
	"fecha_envio" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "citas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"cliente_id" uuid,
	"vehiculo_id" uuid,
	"nombre_cliente" text NOT NULL,
	"telefono_cliente" text,
	"fecha" date NOT NULL,
	"hora_inicio" time,
	"hora_fin" time,
	"motivo" text,
	"estado" "estado_cita" DEFAULT 'programada' NOT NULL,
	"notas" text,
	"consentimiento_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"telefono" text,
	"email" text,
	"nif" text,
	"direccion" text,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dias_bloqueados" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"fecha" date NOT NULL,
	"motivo" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documentos_cobro" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"orden_id" uuid NOT NULL,
	"cliente_id" uuid NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"numero" integer NOT NULL,
	"taller_nombre" text NOT NULL,
	"taller_cif" text,
	"taller_direccion" text,
	"taller_telefono" text,
	"taller_email" text,
	"cliente_nombre" text NOT NULL,
	"cliente_nif" text,
	"cliente_direccion" text,
	"cliente_telefono" text,
	"matricula" text NOT NULL,
	"marca" text,
	"modelo" text,
	"km" integer,
	"base_imponible" numeric(10, 2) NOT NULL,
	"total_iva" numeric(10, 2) NOT NULL,
	"total_final" numeric(10, 2) NOT NULL,
	"lineas" jsonb NOT NULL,
	"metodo_pago" "metodo_pago",
	"fecha_pago" timestamp,
	"estado" text DEFAULT 'borrador' NOT NULL,
	"notas" text,
	"token_publico" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "documentos_cobro_token_publico_unique" UNIQUE("token_publico")
);
--> statement-breakpoint
CREATE TABLE "fotos_orden" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orden_id" uuid NOT NULL,
	"url" text NOT NULL,
	"descripcion" text,
	"tipo" "tipo_foto" DEFAULT 'entrada',
	"es_video" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "historial_estados" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orden_id" uuid NOT NULL,
	"estado_anterior" "estado_orden",
	"estado_nuevo" "estado_orden" NOT NULL,
	"usuario_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inspecciones_orden" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orden_id" uuid NOT NULL,
	"categoria" text NOT NULL,
	"item" text NOT NULL,
	"estado" "estado_inspeccion" DEFAULT 'no_aplica' NOT NULL,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invite_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"rol" "rol_usuario" DEFAULT 'mecanico' NOT NULL,
	"token" text NOT NULL,
	"usado" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "invite_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "lineas_orden" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orden_id" uuid NOT NULL,
	"tipo" "tipo_linea" NOT NULL,
	"descripcion" text NOT NULL,
	"cantidad" numeric(10, 2) DEFAULT '1' NOT NULL,
	"precio_unitario" numeric(10, 2) DEFAULT '0' NOT NULL,
	"descuento_pct" numeric(5, 2) DEFAULT '0',
	"iva_pct" numeric(5, 2) DEFAULT '21' NOT NULL,
	"tipo_pieza" text DEFAULT 'nueva',
	"referencia" text,
	"es_averia_oculta" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lineas_presupuesto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"presupuesto_id" uuid NOT NULL,
	"tipo" "tipo_linea" NOT NULL,
	"descripcion" text NOT NULL,
	"cantidad" numeric(10, 2) DEFAULT '1' NOT NULL,
	"precio_unitario" numeric(10, 2) DEFAULT '0' NOT NULL,
	"descuento_pct" numeric(5, 2) DEFAULT '0',
	"iva_pct" numeric(5, 2) DEFAULT '21' NOT NULL,
	"referencia" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"usuario_id" uuid,
	"tipo" text NOT NULL,
	"titulo" text NOT NULL,
	"mensaje" text NOT NULL,
	"leida" boolean DEFAULT false NOT NULL,
	"enlace" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ordenes_trabajo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"cliente_id" uuid NOT NULL,
	"numero" integer NOT NULL,
	"estado" "estado_orden" DEFAULT 'recibido' NOT NULL,
	"km_entrada" integer,
	"descripcion_cliente" text,
	"diagnostico" text,
	"fecha_entrada" timestamp DEFAULT now() NOT NULL,
	"fecha_estimada" timestamp,
	"fecha_entrega" timestamp,
	"asignado_a" uuid,
	"notas_internas" text,
	"token_publico" text,
	"tipo_intervencion" text[],
	"motivo_deposito" text DEFAULT 'reparacion',
	"renuncia_presupuesto" boolean DEFAULT false,
	"renuncia_piezas" boolean DEFAULT false,
	"observaciones_entrada" text,
	"firma_cliente" text,
	"firma_cliente_at" timestamp,
	"aseguradora" text,
	"num_poliza" text,
	"num_siniestro" text,
	"num_peritaje" text,
	"nombre_perito" text,
	"pagado" boolean DEFAULT false NOT NULL,
	"metodo_pago" "metodo_pago",
	"fecha_pago" timestamp,
	"importe_total" numeric(10, 2),
	"notas_pago" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ordenes_trabajo_token_publico_unique" UNIQUE("token_publico")
);
--> statement-breakpoint
CREATE TABLE "plantillas_servicio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"lineas" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "presupuestos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orden_id" uuid,
	"taller_id" uuid NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"cliente_id" uuid NOT NULL,
	"numero" integer NOT NULL,
	"estado" "estado_presupuesto" DEFAULT 'borrador' NOT NULL,
	"validez_dias" integer DEFAULT 30,
	"notas" text,
	"token_publico" text,
	"aceptado_at" timestamp,
	"aceptado_ip" text,
	"aceptado_texto" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "presupuestos_token_publico_unique" UNIQUE("token_publico")
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"reset_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recordatorios_mantenimiento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"km_intervalo" integer,
	"meses_intervalo" integer,
	"ultimo_km" integer,
	"ultima_fecha" date,
	"proximo_km" integer,
	"proxima_fecha" date,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talleres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"cif" text,
	"direccion" text,
	"telefono" text,
	"email" text,
	"codigo_postal" text,
	"ciudad" text,
	"provincia" text,
	"logo_url" text,
	"mensajes_whatsapp" jsonb DEFAULT '{}',
	"registro_industrial" text,
	"rama_actividad" text[],
	"precio_hora" numeric(10, 2) DEFAULT '40.00',
	"flujo_taller" jsonb DEFAULT '"simple"',
	"horario_apertura" text DEFAULT '08:00',
	"horario_cierre" text DEFAULT '18:00',
	"trabaja_sabados" boolean DEFAULT false,
	"horario_sabado_apertura" text DEFAULT '09:00',
	"horario_sabado_cierre" text DEFAULT '13:00',
	"capacidad_diaria" integer DEFAULT 4,
	"clerk_org_id" text,
	"plan" "plan" DEFAULT 'trial' NOT NULL,
	"trial_ends_at" timestamp,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"suscripcion_activa" boolean DEFAULT false,
	"ultimo_acceso" timestamp,
	"activo" boolean DEFAULT true NOT NULL,
	"dpa_accepted_at" timestamp,
	"google_review_link" text,
	"newsletter_consent" boolean DEFAULT false NOT NULL,
	"newsletter_consent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "talleres_clerk_org_id_unique" UNIQUE("clerk_org_id")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"taller_id" uuid NOT NULL,
	"rol" "rol_usuario" DEFAULT 'admin' NOT NULL,
	"nombre" text NOT NULL,
	"comision_pct" numeric(5, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "vehiculos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"taller_id" uuid NOT NULL,
	"matricula" text NOT NULL,
	"marca" text,
	"modelo" text,
	"anio" integer,
	"km" integer,
	"vin" text,
	"combustible" "combustible",
	"color" text,
	"fecha_itv" date,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "averias_ocultas" ADD CONSTRAINT "averias_ocultas_orden_id_ordenes_trabajo_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes_trabajo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "averias_ocultas" ADD CONSTRAINT "averias_ocultas_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "averias_ocultas" ADD CONSTRAINT "averias_ocultas_registrado_por_usuarios_id_fk" FOREIGN KEY ("registrado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avisos" ADD CONSTRAINT "avisos_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avisos" ADD CONSTRAINT "avisos_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citas" ADD CONSTRAINT "citas_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citas" ADD CONSTRAINT "citas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citas" ADD CONSTRAINT "citas_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dias_bloqueados" ADD CONSTRAINT "dias_bloqueados_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos_cobro" ADD CONSTRAINT "documentos_cobro_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos_cobro" ADD CONSTRAINT "documentos_cobro_orden_id_ordenes_trabajo_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes_trabajo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos_cobro" ADD CONSTRAINT "documentos_cobro_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos_cobro" ADD CONSTRAINT "documentos_cobro_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fotos_orden" ADD CONSTRAINT "fotos_orden_orden_id_ordenes_trabajo_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes_trabajo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_orden_id_ordenes_trabajo_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes_trabajo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspecciones_orden" ADD CONSTRAINT "inspecciones_orden_orden_id_ordenes_trabajo_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes_trabajo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineas_orden" ADD CONSTRAINT "lineas_orden_orden_id_ordenes_trabajo_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes_trabajo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineas_presupuesto" ADD CONSTRAINT "lineas_presupuesto_presupuesto_id_presupuestos_id_fk" FOREIGN KEY ("presupuesto_id") REFERENCES "public"."presupuestos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "ordenes_trabajo_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "ordenes_trabajo_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "ordenes_trabajo_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "ordenes_trabajo_asignado_a_usuarios_id_fk" FOREIGN KEY ("asignado_a") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantillas_servicio" ADD CONSTRAINT "plantillas_servicio_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_orden_id_ordenes_trabajo_id_fk" FOREIGN KEY ("orden_id") REFERENCES "public"."ordenes_trabajo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recordatorios_mantenimiento" ADD CONSTRAINT "recordatorios_mantenimiento_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recordatorios_mantenimiento" ADD CONSTRAINT "recordatorios_mantenimiento_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_logs_taller_created" ON "audit_logs" USING btree ("taller_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_citas_taller_fecha" ON "citas" USING btree ("taller_id","fecha");--> statement-breakpoint
CREATE INDEX "idx_clientes_taller" ON "clientes" USING btree ("taller_id");--> statement-breakpoint
CREATE INDEX "idx_lineas_orden_orden" ON "lineas_orden" USING btree ("orden_id");--> statement-breakpoint
CREATE INDEX "idx_lineas_presupuesto_presupuesto" ON "lineas_presupuesto" USING btree ("presupuesto_id");--> statement-breakpoint
CREATE INDEX "idx_notificaciones_taller_created" ON "notificaciones" USING btree ("taller_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_ordenes_taller_estado" ON "ordenes_trabajo" USING btree ("taller_id","estado");--> statement-breakpoint
CREATE INDEX "idx_ordenes_taller_created" ON "ordenes_trabajo" USING btree ("taller_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_ordenes_vehiculo" ON "ordenes_trabajo" USING btree ("vehiculo_id");--> statement-breakpoint
CREATE INDEX "idx_ordenes_cliente" ON "ordenes_trabajo" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "idx_presupuestos_taller_estado" ON "presupuestos" USING btree ("taller_id","estado");--> statement-breakpoint
CREATE INDEX "idx_presupuestos_orden" ON "presupuestos" USING btree ("orden_id");--> statement-breakpoint
CREATE INDEX "idx_vehiculos_taller_matricula" ON "vehiculos" USING btree ("taller_id","matricula");--> statement-breakpoint
CREATE INDEX "idx_vehiculos_cliente" ON "vehiculos" USING btree ("cliente_id");