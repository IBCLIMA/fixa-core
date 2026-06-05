import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import {
  clientes,
  vehiculos,
  ordenesTrabajo,
  fotosOrden,
  citas,
} from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { del } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const { tallerId, usuarioId } = await getTallerIdFromAuth();
    const { clienteId } = await request.json();

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

    // 1. Eliminar fotos de Vercel Blob
    const ordenesCliente = await db
      .select({ id: ordenesTrabajo.id })
      .from(ordenesTrabajo)
      .where(and(eq(ordenesTrabajo.clienteId, clienteId), eq(ordenesTrabajo.tallerId, tallerId)));

    const ordenIds = ordenesCliente.map((o) => o.id);

    if (ordenIds.length > 0) {
      for (const ordenId of ordenIds) {
        const fotos = await db
          .select({ url: fotosOrden.url })
          .from(fotosOrden)
          .where(eq(fotosOrden.ordenId, ordenId));

        // Eliminar cada foto de Vercel Blob
        for (const foto of fotos) {
          try {
            await del(foto.url);
          } catch {
            // Continuar aunque falle la eliminación de una foto
          }
        }

        // Eliminar registros de fotos de la DB
        await db.delete(fotosOrden).where(eq(fotosOrden.ordenId, ordenId));
      }
    }

    // 2. Anonimizar citas del cliente
    await db
      .update(citas)
      .set({
        nombreCliente: "Cliente eliminado",
        telefonoCliente: null,
      })
      .where(and(eq(citas.clienteId, clienteId), eq(citas.tallerId, tallerId)));

    // 3. Anonimizar datos personales del cliente
    // Se mantienen las órdenes y vehículos para integridad referencial y obligaciones fiscales
    await db
      .update(clientes)
      .set({
        nombre: "Cliente eliminado",
        telefono: null,
        email: null,
        nif: null,
        direccion: null,
        notas: null,
      })
      .where(and(eq(clientes.id, clienteId), eq(clientes.tallerId, tallerId)));

    // 4. Limpiar notas personales de los vehículos
    await db
      .update(vehiculos)
      .set({ notas: null })
      .where(and(eq(vehiculos.clienteId, clienteId), eq(vehiculos.tallerId, tallerId)));

    // 5. Limpiar descripción del cliente en las órdenes (filter by tallerId for multi-tenant safety)
    if (ordenIds.length > 0) {
      for (const ordenId of ordenIds) {
        await db
          .update(ordenesTrabajo)
          .set({ descripcionCliente: null })
          .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));
      }
    }

    // Audit log
    console.log(
      `[RGPD] Anonimización ejecutada | clienteId=${clienteId} | tallerId=${tallerId} | usuarioId=${usuarioId} | fecha=${new Date().toISOString()}`
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Datos personales del cliente anonimizados correctamente. Los registros de órdenes y vehículos se mantienen por obligaciones fiscales.",
    });
  } catch (e: any) {
    console.error("Error al eliminar datos RGPD:", e);
    return NextResponse.json({ error: "Error al eliminar datos" }, { status: 500 });
  }
}
