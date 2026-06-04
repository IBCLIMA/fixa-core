import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes, historialEstados } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export type VehicleAbandonment = {
  ordenId: string;
  numero: number;
  matricula: string;
  clienteNombre: string;
  clienteTelefono: string | null;
  diasSinRecoger: number;
};

/**
 * Returns orders with estado='listo' where the vehicle has been ready
 * for more than 3 days without being picked up.
 *
 * Spanish law (RD 1457/1986):
 * - After 3 business days: workshop can charge storage fees
 * - After 2 months: DGT abandonment process can begin
 */
export async function getVehicleAbandonment(
  tallerId: string
): Promise<VehicleAbandonment[]> {
  const db = getDb();

  // Get all orders in 'listo' estado with the date they became 'listo'
  // We use historial_estados to find when the order moved to 'listo',
  // falling back to updatedAt if no history exists
  const results = await db
    .select({
      ordenId: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      matricula: vehiculos.matricula,
      clienteNombre: clientes.nombre,
      clienteTelefono: clientes.telefono,
      updatedAt: ordenesTrabajo.updatedAt,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .where(
      and(
        eq(ordenesTrabajo.tallerId, tallerId),
        eq(ordenesTrabajo.estado, "listo"),
        // Only orders that have been 'listo' for more than 3 days
        sql`${ordenesTrabajo.updatedAt} < NOW() - INTERVAL '3 days'`
      )
    )
    .orderBy(ordenesTrabajo.updatedAt);

  // For each result, try to find the exact date it moved to 'listo' from historial
  const alerts: VehicleAbandonment[] = [];

  for (const r of results) {
    // Check historial for a more accurate date
    const [historial] = await db
      .select({ createdAt: historialEstados.createdAt })
      .from(historialEstados)
      .where(
        and(
          eq(historialEstados.ordenId, r.ordenId),
          eq(historialEstados.estadoNuevo, "listo")
        )
      )
      .orderBy(desc(historialEstados.createdAt))
      .limit(1);

    const fechaListo = historial?.createdAt || r.updatedAt;
    const diasSinRecoger = Math.floor(
      (Date.now() - new Date(fechaListo).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diasSinRecoger > 3) {
      alerts.push({
        ordenId: r.ordenId,
        numero: r.numero,
        matricula: r.matricula || "—",
        clienteNombre: r.clienteNombre || "—",
        clienteTelefono: r.clienteTelefono || null,
        diasSinRecoger,
      });
    }
  }

  return alerts;
}
