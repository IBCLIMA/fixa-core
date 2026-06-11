// One-off: aplica índices + columna consentimiento_at + unique constraints de token_publico
// de forma segura (IF NOT EXISTS, sin tocar datos). Ejecutar: node scripts/apply-indexes.mjs
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const statements = [
  `CREATE INDEX IF NOT EXISTS idx_clientes_taller ON clientes (taller_id)`,
  `CREATE INDEX IF NOT EXISTS idx_vehiculos_taller_matricula ON vehiculos (taller_id, matricula)`,
  `CREATE INDEX IF NOT EXISTS idx_vehiculos_cliente ON vehiculos (cliente_id)`,
  `CREATE INDEX IF NOT EXISTS idx_ordenes_taller_estado ON ordenes_trabajo (taller_id, estado)`,
  `CREATE INDEX IF NOT EXISTS idx_ordenes_taller_created ON ordenes_trabajo (taller_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_ordenes_vehiculo ON ordenes_trabajo (vehiculo_id)`,
  `CREATE INDEX IF NOT EXISTS idx_ordenes_cliente ON ordenes_trabajo (cliente_id)`,
  `CREATE INDEX IF NOT EXISTS idx_lineas_orden_orden ON lineas_orden (orden_id)`,
  `CREATE INDEX IF NOT EXISTS idx_presupuestos_taller_estado ON presupuestos (taller_id, estado)`,
  `CREATE INDEX IF NOT EXISTS idx_presupuestos_orden ON presupuestos (orden_id)`,
  `CREATE INDEX IF NOT EXISTS idx_lineas_presupuesto_presupuesto ON lineas_presupuesto (presupuesto_id)`,
  `CREATE INDEX IF NOT EXISTS idx_citas_taller_fecha ON citas (taller_id, fecha)`,
  `CREATE INDEX IF NOT EXISTS idx_notificaciones_taller_created ON notificaciones (taller_id, created_at)`,
  `ALTER TABLE citas ADD COLUMN IF NOT EXISTS consentimiento_at timestamp`,
];

for (const s of statements) {
  await sql.query(s);
  console.log("OK:", s.slice(0, 80));
}

// Unique de token_publico: solo si no hay duplicados
for (const table of ["ordenes_trabajo", "presupuestos"]) {
  const dups = await sql.query(
    `SELECT token_publico, count(*) FROM ${table} WHERE token_publico IS NOT NULL GROUP BY token_publico HAVING count(*) > 1`
  );
  if (dups.length > 0) {
    console.log(`SKIP unique en ${table}: ${dups.length} tokens duplicados — revisar manualmente`);
    continue;
  }
  await sql.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS ${table}_token_publico_unique ON ${table} (token_publico)`
  );
  console.log(`OK: unique token_publico en ${table}`);
}

console.log("DONE");
