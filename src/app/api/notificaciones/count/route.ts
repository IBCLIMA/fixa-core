import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { notificaciones } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET() {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    const [result] = await db
      .select({ count: count() })
      .from(notificaciones)
      .where(and(eq(notificaciones.tallerId, tallerId), eq(notificaciones.leida, false)));

    return NextResponse.json({ count: result?.count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
