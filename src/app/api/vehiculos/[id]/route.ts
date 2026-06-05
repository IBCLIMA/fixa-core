import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { vehiculos } from "@/db/schema";
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
    if (body.marca !== undefined) updateData.marca = body.marca || null;
    if (body.modelo !== undefined) updateData.modelo = body.modelo || null;
    if (body.anio !== undefined) updateData.anio = body.anio ? Number(body.anio) : null;
    if (body.color !== undefined) updateData.color = body.color || null;
    if (body.vin !== undefined) updateData.vin = body.vin || null;
    if (body.combustible !== undefined) updateData.combustible = body.combustible || null;

    await db
      .update(vehiculos)
      .set(updateData)
      .where(and(eq(vehiculos.id, id), eq(vehiculos.tallerId, tallerId)));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
