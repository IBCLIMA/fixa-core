CREATE TABLE "recambistas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taller_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"telefono" text NOT NULL,
	"notas" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lineas_orden" ADD COLUMN "estado_recambio" text DEFAULT 'sin_pedir';--> statement-breakpoint
ALTER TABLE "lineas_orden" ADD COLUMN "recambista_id" uuid;--> statement-breakpoint
ALTER TABLE "lineas_orden" ADD COLUMN "precio_compra" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lineas_orden" ADD COLUMN "consultado_at" timestamp;--> statement-breakpoint
ALTER TABLE "lineas_orden" ADD COLUMN "pedido_at" timestamp;--> statement-breakpoint
ALTER TABLE "lineas_orden" ADD COLUMN "recibido_at" timestamp;--> statement-breakpoint
ALTER TABLE "recambistas" ADD CONSTRAINT "recambistas_taller_id_talleres_id_fk" FOREIGN KEY ("taller_id") REFERENCES "public"."talleres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_recambistas_taller" ON "recambistas" USING btree ("taller_id");--> statement-breakpoint
ALTER TABLE "lineas_orden" ADD CONSTRAINT "lineas_orden_recambista_id_recambistas_id_fk" FOREIGN KEY ("recambista_id") REFERENCES "public"."recambistas"("id") ON DELETE no action ON UPDATE no action;