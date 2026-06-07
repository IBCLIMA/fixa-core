import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { clientes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();
    const body = await request.json();

    const updateData: Record<string, any> = {};
    if (body.telefono !== undefined) updateData.telefono = body.telefono || null;
    if (body.nombre !== undefined) updateData.nombre = body.nombre;
    if (body.email !== undefined) updateData.email = body.email || null;
    if (body.nif !== undefined) updateData.nif = body.nif || null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await db
      .update(clientes)
      .set(updateData)
      .where(and(eq(clientes.id, id), eq(clientes.tallerId, tallerId)));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
