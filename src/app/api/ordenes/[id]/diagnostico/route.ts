import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { tallerId } = await getTallerIdFromAuth();
    const body = await request.json();
    const db = getDb();

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (body.diagnostico !== undefined) updateData.diagnostico = body.diagnostico;
    if (body.descripcion !== undefined) updateData.descripcionCliente = body.descripcion;

    await db
      .update(ordenesTrabajo)
      .set(updateData)
      .where(and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
