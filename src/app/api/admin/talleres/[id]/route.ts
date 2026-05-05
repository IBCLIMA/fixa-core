import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await getSuperAdmin();
    if (!isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const updateData: Record<string, any> = {};

    if (body.plan !== undefined) updateData.plan = body.plan;
    if (body.activo !== undefined) updateData.activo = body.activo;
    if (body.trialEndsAt !== undefined) updateData.trialEndsAt = body.trialEndsAt ? new Date(body.trialEndsAt) : null;
    if (body.suscripcionActiva !== undefined) updateData.suscripcionActiva = body.suscripcionActiva;

    await db.update(talleres).set(updateData).where(eq(talleres.id, id));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
