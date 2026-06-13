import { getDb } from "@/db";
import { clientes, vehiculos, ordenesTrabajo, lineasOrden, historialEstados } from "@/db/schema";
import { sql } from "drizzle-orm";
import { randomBytes } from "crypto";

/**
 * Precarga datos de ejemplo en un taller recién creado para que
 * el mecánico NO vea una pantalla vacía al entrar por primera vez.
 *
 * 2 clientes, 2 vehículos, 1 orden con 2 líneas.
 * Pensado para que diga "ah, así se ve cuando funciona" — y luego
 * cree su primera orden real con confianza.
 */
export async function seedDemoData(tallerId: string) {
  const db = getDb();

  try {
    // 1. Clientes de ejemplo
    const [cliente1] = await db
      .insert(clientes)
      .values({
        tallerId,
        nombre: "Antonio García (ejemplo)",
        telefono: "612345678",
      })
      .returning();

    const [cliente2] = await db
      .insert(clientes)
      .values({
        tallerId,
        nombre: "María López (ejemplo)",
        telefono: "698765432",
      })
      .returning();

    // 2. Vehículos
    const [vehiculo1] = await db
      .insert(vehiculos)
      .values({
        tallerId,
        clienteId: cliente1.id,
        matricula: "1234ABC",
        marca: "SEAT",
        modelo: "León",
        anio: 2019,
        km: 87500,
        fechaItv: "2026-09-15",
      })
      .returning();

    await db.insert(vehiculos).values({
      tallerId,
      clienteId: cliente2.id,
      matricula: "5678DRS",
      marca: "RENAULT",
      modelo: "Clio",
      anio: 2017,
      km: 112000,
    });

    // 3. Orden de ejemplo (en estado "en_reparacion" para que se vea en el kanban)
    const [orden] = await db
      .insert(ordenesTrabajo)
      .values({
        tallerId,
        vehiculoId: vehiculo1.id,
        clienteId: cliente1.id,
        numero: sql<number>`(SELECT COALESCE(MAX(${ordenesTrabajo.numero}), 0) + 1 FROM ${ordenesTrabajo} WHERE ${ordenesTrabajo.tallerId} = ${tallerId})`,
        estado: "en_reparacion",
        descripcionCliente: "Ruido al frenar, revisar pastillas y discos (orden de ejemplo)",
        motivoDeposito: "reparacion",
        kmEntrada: 87500,
        tokenPublico: randomBytes(16).toString("hex"),
      })
      .returning();

    // 4. Líneas de trabajo
    await db.insert(lineasOrden).values([
      {
        ordenId: orden.id,
        tipo: "recambio",
        descripcion: "Pastillas de freno delanteras",
        cantidad: "1",
        precioUnitario: "45.00",
        ivaPct: "21",
      },
      {
        ordenId: orden.id,
        tipo: "mano_obra",
        descripcion: "Sustitución pastillas + revisión discos",
        cantidad: "1.5",
        precioUnitario: "40.00",
        ivaPct: "21",
      },
    ]);

    // 5. Historial
    await db.insert(historialEstados).values({
      ordenId: orden.id,
      estadoNuevo: "en_reparacion",
    });
  } catch (e) {
    console.error("[seed-demo] Error:", e instanceof Error ? e.message : e);
    // No lanzar — el taller se crea igualmente aunque el seed falle
  }
}
