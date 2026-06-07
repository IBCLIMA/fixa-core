import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { presupuestos, ordenesTrabajo, clientes, vehiculos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createNotification } from "@/lib/notify";

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

  // Notify the workshop about the client's response
  try {
    const [cliente] = await db.select({ nombre: clientes.nombre }).from(clientes).where(eq(clientes.id, presupuesto.clienteId));
    const [vehiculo] = await db.select({ matricula: vehiculos.matricula }).from(vehiculos).where(eq(vehiculos.id, presupuesto.vehiculoId));
    const clienteNombre = cliente?.nombre || "Cliente";
    const matricula = vehiculo?.matricula || "";

    if (estado === "aceptado") {
      createNotification({
        tallerId: presupuesto.tallerId,
        tipo: "presupuesto_aceptado",
        titulo: `PT-${presupuesto.numero} aceptado`,
        mensaje: `${clienteNombre} ha aceptado el presupuesto para ${matricula}. Puedes proceder con la reparacion.`,
        enlace: `/presupuestos/${presupuesto.id}`,
      });
    } else {
      createNotification({
        tallerId: presupuesto.tallerId,
        tipo: "presupuesto_rechazado",
        titulo: `PT-${presupuesto.numero} rechazado`,
        mensaje: `${clienteNombre} ha rechazado el presupuesto para ${matricula}.`,
        enlace: `/presupuestos/${presupuesto.id}`,
      });
    }
  } catch (e) {
    console.error("Error creating notification for presupuesto response:", e);
  }

  return NextResponse.json({ ok: true, estado });
}
