-- ══════════════════════════════════════════════════════════════════
-- FIXA: Legal compliance fields (RD 1457/1986)
-- All changes are additive (ADD COLUMN) — safe to run on production
-- ══════════════════════════════════════════════════════════════════

-- ═══ TALLERES: datos necesarios para documentos legales ═══
ALTER TABLE talleres ADD COLUMN IF NOT EXISTS registro_industrial TEXT;
ALTER TABLE talleres ADD COLUMN IF NOT EXISTS rama_actividad TEXT[]; -- ['mecanica','electricidad','carroceria','pintura']

-- ═══ ORDENES: campos legales obligatorios ═══

-- Tipo de intervención (puede ser varias a la vez)
CREATE TYPE tipo_intervencion AS ENUM (
  'mecanica', 'electricidad', 'chapa', 'pintura',
  'diagnostico', 'mantenimiento', 'pre_itv', 'otro'
);
-- Usar array nativo no funciona bien con enums en Drizzle, usamos JSONB
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS tipo_intervencion TEXT[];

-- Motivo del depósito (obligatorio por ley)
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS motivo_deposito TEXT DEFAULT 'reparacion'; -- 'presupuesto' | 'reparacion'

-- Renuncia al presupuesto previo
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS renuncia_presupuesto BOOLEAN DEFAULT false;

-- Renuncia a recibir piezas sustituidas
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS renuncia_piezas BOOLEAN DEFAULT false;

-- Observaciones de entrada (daños preexistentes)
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS observaciones_entrada TEXT;

-- Firma del cliente (base64 data URL de la firma capturada)
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS firma_cliente TEXT;
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS firma_cliente_at TIMESTAMP;

-- Datos de seguro (para chapa y pintura)
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS aseguradora TEXT;
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS num_poliza TEXT;
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS num_siniestro TEXT;
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS num_peritaje TEXT;
ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS nombre_perito TEXT;

-- ═══ LINEAS ORDEN: tipo de pieza ═══
ALTER TABLE lineas_orden ADD COLUMN IF NOT EXISTS tipo_pieza TEXT DEFAULT 'nueva'; -- 'nueva' | 'reconstruida' | 'usada'
ALTER TABLE lineas_orden ADD COLUMN IF NOT EXISTS es_averia_oculta BOOLEAN DEFAULT false;

-- ═══ AVERÍAS OCULTAS: flujo de notificación y aprobación ═══
CREATE TABLE IF NOT EXISTS averias_ocultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_id UUID NOT NULL REFERENCES ordenes_trabajo(id) ON DELETE CASCADE,
  taller_id UUID NOT NULL REFERENCES talleres(id),
  descripcion TEXT NOT NULL,
  importe_estimado NUMERIC(10, 2),
  foto_url TEXT,
  -- Notificación
  notificado_at TIMESTAMP,
  metodo_notificacion TEXT, -- 'whatsapp' | 'email' | 'telefono' | 'presencial'
  -- Aprobación
  token_aprobacion TEXT UNIQUE,
  estado TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente' | 'aprobada' | 'rechazada'
  respondido_at TIMESTAMP,
  -- Metadata
  registrado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_averias_orden_id ON averias_ocultas(orden_id);
CREATE INDEX IF NOT EXISTS idx_averias_token ON averias_ocultas(token_aprobacion);

-- Drop the enum type we don't need (created above but not used)
DROP TYPE IF EXISTS tipo_intervencion;
