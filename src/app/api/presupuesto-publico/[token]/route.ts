import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { presupuestos, ordenesTrabajo } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();
  const { estado } = body;

  if (!["aceptado", "rechazado"].includes(estado)) {
    return NextResponse.json({ error: "Estado no valido" }, { status: 400 });
  }

  const db = getDb();

  const [presupuesto] = await db
    .select()
    .from(presupuestos)
    .where(eq(presupuestos.tokenPublico, token))
    .limit(1);

  if (!presupuesto) {
    return NextResponse.json({ error: "Presupuesto no encontrado" }, { status: 404 });
  }

  if (presupuesto.estado !== "enviado") {
    return NextResponse.json(
      { error: "Este presupuesto no esta pendiente de respuesta" },
      { status: 400 }
    );
  }

  await db
    .update(presupuestos)
    .set({ estado })
    .where(eq(presupuestos.id, presupuesto.id));

  // If accepted and linked to an order, update order status
  if (estado === "aceptado" && presupuesto.ordenId) {
    await db
      .update(ordenesTrabajo)
      .set({ estado: "aprobado", updatedAt: new Date() })
      .where(eq(ordenesTrabajo.id, presupuesto.ordenId));
  }

  return NextResponse.json({ ok: true, estado });
}
