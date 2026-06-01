import { NextRequest, NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import {
  clientes,
  vehiculos,
  ordenesTrabajo,
  presupuestos,
  lineasOrden,
  lineasPresupuesto,
  fotosOrden,
  citas,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const clienteId = request.nextUrl.searchParams.get("clienteId");

    if (!clienteId) {
      return NextResponse.json({ error: "clienteId requerido" }, { status: 400 });
    }

    const db = getDb();

    // Verificar que el cliente pertenece al taller
    const cliente = await db.query.clientes.findFirst({
      where: and(eq(clientes.id, clienteId), eq(clientes.tallerId, tallerId)),
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    // Obtener todos los vehículos del cliente
    const vehiculosCliente = await db
      .select()
      .from(vehiculos)
      .where(and(eq(vehiculos.clienteId, clienteId), eq(vehiculos.tallerId, tallerId)));

    const vehiculoIds = vehiculosCliente.map((v) => v.id);

    // Obtener todas las órdenes del cliente
    const ordenesCliente = await db
      .select()
      .from(ordenesTrabajo)
      .where(and(eq(ordenesTrabajo.clienteId, clienteId), eq(ordenesTrabajo.tallerId, tallerId)));

    const ordenIds = ordenesCliente.map((o) => o.id);

    // Obtener líneas de órdenes
    const lineasOrdenes = ordenIds.length > 0
      ? await Promise.all(ordenIds.map((id) => db.select().from(lineasOrden).where(eq(lineasOrden.ordenId, id))))
      : [];

    // Obtener fotos de órdenes
    const fotosOrdenes = ordenIds.length > 0
      ? await Promise.all(ordenIds.map((id) => db.select().from(fotosOrden).where(eq(fotosOrden.ordenId, id))))
      : [];

    // Obtener presupuestos del cliente
    const presupuestosCliente = await db
      .select()
      .from(presupuestos)
      .where(and(eq(presupuestos.clienteId, clienteId), eq(presupuestos.tallerId, tallerId)));

    const presupuestoIds = presupuestosCliente.map((p) => p.id);

    // Obtener líneas de presupuestos
    const lineasPresupuestos = presupuestoIds.length > 0
      ? await Promise.all(presupuestoIds.map((id) => db.select().from(lineasPresupuesto).where(eq(lineasPresupuesto.presupuestoId, id))))
      : [];

    // Obtener citas del cliente
    const citasCliente = await db
      .select()
      .from(citas)
      .where(and(eq(citas.clienteId, clienteId), eq(citas.tallerId, tallerId)));

    const exportData = {
      exportadoEl: new Date().toISOString(),
      derechosRGPD: "Exportación de datos conforme al Art. 20 RGPD - Derecho a la portabilidad",
      cliente,
      vehiculos: vehiculosCliente,
      ordenesDeTrabajo: ordenesCliente.map((orden, i) => ({
        ...orden,
        lineas: lineasOrdenes[i] || [],
        fotos: (fotosOrdenes[i] || []).map((f) => ({ url: f.url, tipo: f.tipo, descripcion: f.descripcion })),
      })),
      presupuestos: presupuestosCliente.map((pres, i) => ({
        ...pres,
        lineas: lineasPresupuestos[i] || [],
      })),
      citas: citasCliente,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="datos-cliente-${clienteId}.json"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
