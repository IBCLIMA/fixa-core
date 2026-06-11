import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { tallerId, usuarioId } = await getTallerIdFromAuth();
    const db = getDb();
    const body = await request.json();

    const { endpoint, keys } = body || {};
    if (typeof endpoint !== "string" || !endpoint.startsWith("https://") || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Suscripción no válida" }, { status: 400 });
    }

    await db
      .insert(pushSubscriptions)
      .values({
        tallerId,
        usuarioId: usuarioId || null,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: { tallerId, usuarioId: usuarioId || null, p256dh: keys.p256dh, auth: keys.auth },
      });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();
    const { endpoint } = await request.json();
    if (typeof endpoint !== "string") {
      return NextResponse.json({ error: "Endpoint no válido" }, { status: 400 });
    }

    await db
      .delete(pushSubscriptions)
      .where(and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.tallerId, tallerId)));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
