import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { lineasOrden, ordenesTrabajo } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; lineaId: string }> }
) {
  try {
    const { id: ordenId, lineaId } = await params;
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    // Verify order belongs to this workshop
    const [orden] = await db
      .select({ id: ordenesTrabajo.id })
      .from(ordenesTrabajo)
      .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));
    if (!orden) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const body = await request.json();
    const validEstados = ["sin_pedir", "consultado", "pedido", "recibido"];
    if (!validEstados.includes(body.estadoRecambio)) {
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      estadoRecambio: body.estadoRecambio,
    };

    if (body.estadoRecambio === "consultado") updateData.consultadoAt = new Date();
    if (body.estadoRecambio === "pedido") {
      updateData.pedidoAt = new Date();
      if (body.recambistaId) updateData.recambistaId = body.recambistaId;
      if (body.precioCompra) updateData.precioCompra = body.precioCompra;
    }
    if (body.estadoRecambio === "recibido") updateData.recibidoAt = new Date();

    await db
      .update(lineasOrden)
      .set(updateData)
      .where(and(eq(lineasOrden.id, lineaId), eq(lineasOrden.ordenId, ordenId)));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
