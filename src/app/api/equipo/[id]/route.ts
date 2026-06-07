import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getDb } from "@/db";
import { usuarios } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { tallerId, usuarioId } = await requireRole(["admin"]);
    const db = getDb();

    // Can't delete yourself
    if (id === usuarioId) {
      return NextResponse.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 });
    }

    await db
      .delete(usuarios)
      .where(and(eq(usuarios.id, id), eq(usuarios.tallerId, tallerId)));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
