import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { clientes, vehiculos, presupuestos, lineasPresupuesto } from "@/db/schema";
import { eq, and, ilike, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();
    const body = await request.json();

    const { nombreCliente, telefonoCliente, matricula, marca, modelo, descripcion } = body;

    if (!nombreCliente?.trim()) {
      return NextResponse.json({ error: "Nombre del cliente es obligatorio" }, { status: 400 });
    }

    // Find or create client
    let clienteId: string;
    if (telefonoCliente) {
      const [existing] = await db
        .select({ id: clientes.id })
        .from(clientes)
        .where(and(eq(clientes.tallerId, tallerId), eq(clientes.telefono, telefonoCliente)));
      if (existing) {
        clienteId = existing.id;
      } else {
        const [newCliente] = await db
          .insert(clientes)
          .values({ tallerId, nombre: nombreCliente.trim(), telefono: telefonoCliente })
          .returning();
        clienteId = newCliente.id;
      }
    } else {
      const [newCliente] = await db
        .insert(clientes)
        .values({ tallerId, nombre: nombreCliente.trim(), telefono: telefonoCliente || null })
        .returning();
      clienteId = newCliente.id;
    }

    // Find or create vehicle
    let vehiculoId: string;
    if (matricula?.trim()) {
      const cleanPlate = matricula.trim().toUpperCase().replace(/[\s\-]/g, "");
      const [existing] = await db
        .select({ id: vehiculos.id })
        .from(vehiculos)
        .where(and(eq(vehiculos.tallerId, tallerId), eq(vehiculos.matricula, cleanPlate)));
      if (existing) {
        vehiculoId = existing.id;
      } else {
        const [newVehiculo] = await db
          .insert(vehiculos)
          .values({ tallerId, clienteId, matricula: cleanPlate, marca: marca || null, modelo: modelo || null })
          .returning();
        vehiculoId = newVehiculo.id;
      }
    } else {
      // Create placeholder vehicle
      const [newVehiculo] = await db
        .insert(vehiculos)
        .values({ tallerId, clienteId, matricula: "PENDIENTE", marca: marca || null, modelo: modelo || null })
        .returning();
      vehiculoId = newVehiculo.id;
    }

    // Get next presupuesto number
    const [maxResult] = await db
      .select({ max: sql<number>`COALESCE(MAX(${presupuestos.numero}), 0)` })
      .from(presupuestos)
      .where(eq(presupuestos.tallerId, tallerId));
    const numero = (maxResult?.max ?? 0) + 1;

    // Create presupuesto (no ordenId — independent)
    const [presupuesto] = await db
      .insert(presupuestos)
      .values({
        tallerId,
        vehiculoId,
        clienteId,
        numero,
        estado: "borrador",
        notas: descripcion || null,
        tokenPublico: randomBytes(16).toString("hex"),
      })
      .returning();

    // Create lines if provided
    if (body.lineas && Array.isArray(body.lineas) && body.lineas.length > 0) {
      const validLineas = body.lineas.filter((l: any) => l.descripcion?.trim());
      if (validLineas.length > 0) {
        await db.insert(lineasPresupuesto).values(
          validLineas.map((l: any) => ({
            presupuestoId: presupuesto.id,
            tipo: l.tipo || "mano_obra",
            descripcion: l.descripcion.trim(),
            cantidad: String(l.cantidad || 1),
            precioUnitario: String(l.precioUnitario || 0),
            referencia: l.referencia || null,
          }))
        );
      }
    }

    return NextResponse.json({ id: presupuesto.id, numero: presupuesto.numero });
  } catch (e) {
    console.error("Error creating presupuesto:", e);
    return NextResponse.json({ error: "Error al crear presupuesto" }, { status: 500 });
  }
}
