import { NextRequest, NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { notificaciones } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

// GET - list recent notifications
export async function GET() {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    const items = await db
      .select()
      .from(notificaciones)
      .where(eq(notificaciones.tallerId, tallerId))
      .orderBy(desc(notificaciones.createdAt))
      .limit(20);

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

// POST - mark notifications as read
export async function POST(request: NextRequest) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();
    const body = await request.json();

    if (body.marcarTodas) {
      // Mark all as read
      await db
        .update(notificaciones)
        .set({ leida: true })
        .where(and(eq(notificaciones.tallerId, tallerId), eq(notificaciones.leida, false)));

      return NextResponse.json({ ok: true });
    }

    if (body.ids && Array.isArray(body.ids) && body.ids.length > 0) {
      // Mark specific notifications as read
      await db
        .update(notificaciones)
        .set({ leida: true })
        .where(and(eq(notificaciones.tallerId, tallerId), inArray(notificaciones.id, body.ids)));

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Indica ids o marcarTodas" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
