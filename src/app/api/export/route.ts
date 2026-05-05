import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { talleres, clientes, vehiculos, ordenesTrabajo, lineasOrden, citas, avisos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    // Exportar todos los datos del taller
    const [taller] = await db.select().from(talleres).where(eq(talleres.id, tallerId));
    const clientesList = await db.select().from(clientes).where(eq(clientes.tallerId, tallerId)).orderBy(desc(clientes.createdAt));
    const vehiculosList = await db.select().from(vehiculos).where(eq(vehiculos.tallerId, tallerId));
    const ordenesList = await db.select().from(ordenesTrabajo).where(eq(ordenesTrabajo.tallerId, tallerId)).orderBy(desc(ordenesTrabajo.createdAt));

    // Líneas de todas las órdenes
    const ordenIds = ordenesList.map((o) => o.id);
    let lineasList: any[] = [];
    for (const oid of ordenIds) {
      const lineas = await db.select().from(lineasOrden).where(eq(lineasOrden.ordenId, oid));
      lineasList = [...lineasList, ...lineas];
    }

    const citasList = await db.select().from(citas).where(eq(citas.tallerId, tallerId));
    const avisosList = await db.select().from(avisos).where(eq(avisos.tallerId, tallerId));

    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      taller,
      clientes: clientesList,
      vehiculos: vehiculosList,
      ordenesTrabajo: ordenesList,
      lineasOrden: lineasList,
      citas: citasList,
      avisos: avisosList,
      totals: {
        clientes: clientesList.length,
        vehiculos: vehiculosList.length,
        ordenes: ordenesList.length,
        lineas: lineasList.length,
        citas: citasList.length,
        avisos: avisosList.length,
      },
    };

    const json = JSON.stringify(exportData, null, 2);
    const filename = `fixa-backup-${taller.nombre?.replace(/\s/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error al exportar" }, { status: 500 });
  }
}
