-- Critical performance indexes for FIXA
-- Every query filters by taller_id, so these are essential

-- Orders
CREATE INDEX IF NOT EXISTS idx_ordenes_taller_id ON ordenes_trabajo(taller_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON ordenes_trabajo(estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_taller_estado ON ordenes_trabajo(taller_id, estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha ON ordenes_trabajo(fecha_entrada DESC);

-- Vehicles
CREATE INDEX IF NOT EXISTS idx_vehiculos_taller_id ON vehiculos(taller_id);
CREATE INDEX IF NOT EXISTS idx_vehiculos_cliente_id ON vehiculos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vehiculos_matricula ON vehiculos(matricula);

-- Clients
CREATE INDEX IF NOT EXISTS idx_clientes_taller_id ON clientes(taller_id);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_citas_taller_id ON citas(taller_id);
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_taller_fecha ON citas(taller_id, fecha);

-- Alerts
CREATE INDEX IF NOT EXISTS idx_avisos_taller_id ON avisos(taller_id);

-- Line items
CREATE INDEX IF NOT EXISTS idx_lineas_orden_id ON lineas_orden(orden_id);
CREATE INDEX IF NOT EXISTS idx_lineas_presupuesto_id ON lineas_presupuesto(presupuesto_id);

-- Photos
CREATE INDEX IF NOT EXISTS idx_fotos_orden_id ON fotos_orden(orden_id);

-- Quotes
CREATE INDEX IF NOT EXISTS idx_presupuestos_taller_id ON presupuestos(taller_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_orden_id ON presupuestos(orden_id);

-- Users
CREATE INDEX IF NOT EXISTS idx_usuarios_taller_id ON usuarios_taller(taller_id);

-- Unique constraint on order number per workshop (prevents duplicates)
CREATE UNIQUE INDEX IF NOT EXISTS idx_ordenes_taller_numero ON ordenes_trabajo(taller_id, numero);
