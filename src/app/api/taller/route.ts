import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const body = await request.json();
    const db = getDb();

    await db
      .update(talleres)
      .set({
        nombre: body.nombre,
        cif: body.cif || null,
        direccion: body.direccion || null,
        telefono: body.telefono || null,
        email: body.email || null,
      })
      .where(eq(talleres.id, tallerId));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
