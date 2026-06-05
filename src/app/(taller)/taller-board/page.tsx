import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes, usuarios, talleres } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { TallerBoard } from "./board";
import { getActivePhases } from "@/lib/workflow";

export default async function TallerBoardPage() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  // Get taller config for workflow
  const [taller] = await db.select({ flujoTaller: talleres.flujoTaller }).from(talleres).where(eq(talleres.id, tallerId));
  const activePhases = getActivePhases(taller?.flujoTaller);
  const flujoActual = typeof taller?.flujoTaller === "string" ? taller.flujoTaller : "simple";

  // Get active orders + recently delivered (last 24h)
  const ordenes = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      estado: ordenesTrabajo.estado,
      descripcionCliente: ordenesTrabajo.descripcionCliente,
      fechaEntrada: ordenesTrabajo.fechaEntrada,
      kmEntrada: ordenesTrabajo.kmEntrada,
      asignadoA: ordenesTrabajo.asignadoA,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      color: vehiculos.color,
      clienteNombre: clientes.nombre,
      clienteTelefono: clientes.telefono,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .where(
      and(
        eq(ordenesTrabajo.tallerId, tallerId),
        sql`(${ordenesTrabajo.estado} NOT IN ('cancelado') AND (${ordenesTrabajo.estado} != 'entregado' OR ${ordenesTrabajo.updatedAt} > NOW() - INTERVAL '24 hours'))`
      )
    );

  const mecanicos = await db
    .select({ id: usuarios.id, nombre: usuarios.nombre })
    .from(usuarios)
    .where(eq(usuarios.tallerId, tallerId));

  const mecMap = Object.fromEntries(mecanicos.map((m) => [m.id, m.nombre]));

  const ordenesData = ordenes.map((o) => ({
    ...o,
    asignadoNombre: o.asignadoA ? mecMap[o.asignadoA] || null : null,
    fechaEntrada: o.fechaEntrada.toISOString(),
  }));

  return (
    <TallerBoard
      ordenes={ordenesData}
      activePhases={activePhases}
      flujoActual={flujoActual as string}
      tallerId={tallerId}
    />
  );
}
