import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getDb } from "@/db";
import { usuarios } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { tallerId } = await requireRole(["admin"]);
    const db = getDb();
    const { rol } = await request.json();

    if (!["admin", "mecanico", "recepcion"].includes(rol)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    await db
      .update(usuarios)
      .set({ rol })
      .where(and(eq(usuarios.id, id), eq(usuarios.tallerId, tallerId)));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
