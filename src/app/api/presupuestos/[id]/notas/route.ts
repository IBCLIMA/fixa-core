import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { presupuestos } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();
    const { notas } = await request.json();

    await db
      .update(presupuestos)
      .set({ notas: notas || null })
      .where(and(eq(presupuestos.id, id), eq(presupuestos.tallerId, tallerId)));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
