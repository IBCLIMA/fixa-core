import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { presupuestos, ordenesTrabajo, clientes, vehiculos, lineasPresupuesto, talleres, historialEstados } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { createNotification } from "@/lib/notify";
import { randomBytes } from "crypto";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();
  const { estado } = body;

  if (!["aceptado", "rechazado"].includes(estado)) {
    return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
  }

  const db = getDb();

  const [presupuesto] = await db
    .select()
    .from(presupuestos)
    .where(eq(presupuestos.tokenPublico, token));

  if (!presupuesto) {
    return NextResponse.json({ error: "Presupuesto no encontrado" }, { status: 404 });
  }

  if (presupuesto.estado !== "enviado" && presupuesto.estado !== "borrador") {
    return NextResponse.json(
      { error: "Este presupuesto ya ha sido respondido" },
      { status: 400 }
    );
  }

  // Get client IP for legal tracking
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  // Get presupuesto lines for the acceptance record
  const lineas = await db.select().from(lineasPresupuesto).where(eq(lineasPresupuesto.presupuestoId, presupuesto.id));
  const totalBase = lineas.reduce((sum, l) => {
    const base = Number(l.cantidad) * Number(l.precioUnitario) * (1 - Number(l.descuentoPct || 0) / 100);
    return sum + base;
  }, 0);
  const totalIva = lineas.reduce((sum, l) => {
    const base = Number(l.cantidad) * Number(l.precioUnitario) * (1 - Number(l.descuentoPct || 0) / 100);
    return sum + base * (Number(l.ivaPct || 21) / 100);
  }, 0);
  const totalFinal = totalBase + totalIva;

  // Build acceptance text (legal snapshot of what was accepted)
  const acceptanceText = estado === "aceptado"
    ? `ACEPTACIÓN DE PRESUPUESTO\n\nEl cliente acepta el presupuesto PT-${presupuesto.numero} por un importe total de ${totalFinal.toFixed(2)} EUR (IVA incluido), y autoriza al taller a realizar los trabajos descritos.\n\nDetalle:\n${lineas.map(l => `- ${l.descripcion}: ${(Number(l.cantidad) * Number(l.precioUnitario)).toFixed(2)} EUR`).join("\n")}\n\nBase: ${totalBase.toFixed(2)} EUR\nIVA: ${totalIva.toFixed(2)} EUR\nTotal: ${totalFinal.toFixed(2)} EUR\n\nFecha: ${new Date().toLocaleString("es-ES")}\nIP: ${clientIp}`
    : `RECHAZO DE PRESUPUESTO\n\nEl cliente rechaza el presupuesto PT-${presupuesto.numero}.\n\nFecha: ${new Date().toLocaleString("es-ES")}\nIP: ${clientIp}`;

  // Update presupuesto with acceptance data
  await db
    .update(presupuestos)
    .set({
      estado,
      aceptadoAt: new Date(),
      aceptadoIp: clientIp,
      aceptadoTexto: acceptanceText,
    })
    .where(eq(presupuestos.id, presupuesto.id));

  // Get client and vehicle info for notifications
  const [cliente] = await db.select({ nombre: clientes.nombre, telefono: clientes.telefono }).from(clientes).where(eq(clientes.id, presupuesto.clienteId));
  const [vehiculo] = await db.select({ matricula: vehiculos.matricula, marca: vehiculos.marca, modelo: vehiculos.modelo }).from(vehiculos).where(eq(vehiculos.id, presupuesto.vehiculoId));
  const clienteNombre = cliente?.nombre || "Cliente";
  const matricula = vehiculo?.matricula || "";
  const vehiculoDesc = [vehiculo?.marca, vehiculo?.modelo].filter(Boolean).join(" ");

  if (estado === "aceptado") {
    // If presupuesto has an existing OR → move it to "en_reparacion"
    if (presupuesto.ordenId) {
      await db
        .update(ordenesTrabajo)
        .set({ estado: "en_reparacion", updatedAt: new Date() })
        .where(eq(ordenesTrabajo.id, presupuesto.ordenId));

      await db.insert(historialEstados).values({
        ordenId: presupuesto.ordenId,
        estadoAnterior: "presupuestado",
        estadoNuevo: "en_reparacion",
      });
    }
    // If presupuesto is independent (no OR) → create a new OR automatically
    else {
      const [maxResult] = await db
        .select({ max: sql<number>`COALESCE(MAX(${ordenesTrabajo.numero}), 0)` })
        .from(ordenesTrabajo)
        .where(eq(ordenesTrabajo.tallerId, presupuesto.tallerId));
      const numero = (maxResult?.max ?? 0) + 1;

      const [nuevaOrden] = await db
        .insert(ordenesTrabajo)
        .values({
          tallerId: presupuesto.tallerId,
          vehiculoId: presupuesto.vehiculoId,
          clienteId: presupuesto.clienteId,
          numero,
          estado: "en_reparacion",
          descripcionCliente: presupuesto.notas || `Presupuesto PT-${presupuesto.numero} aceptado`,
          tokenPublico: randomBytes(16).toString("hex"),
          motivoDeposito: "reparacion",
        })
        .returning();

      // Link the presupuesto to the new OR
      await db
        .update(presupuestos)
        .set({ ordenId: nuevaOrden.id })
        .where(eq(presupuestos.id, presupuesto.id));

      // Copy presupuesto lines to the OR
      if (lineas.length > 0) {
        const { lineasOrden } = await import("@/db/schema");
        await db.insert(lineasOrden).values(
          lineas.map((l) => ({
            ordenId: nuevaOrden.id,
            tipo: l.tipo,
            descripcion: l.descripcion,
            cantidad: l.cantidad,
            precioUnitario: l.precioUnitario,
            descuentoPct: l.descuentoPct,
            ivaPct: l.ivaPct,
          }))
        );
      }

      await db.insert(historialEstados).values({
        ordenId: nuevaOrden.id,
        estadoNuevo: "en_reparacion",
      });
    }

    // Notify workshop
    createNotification({
      tallerId: presupuesto.tallerId,
      tipo: "presupuesto_aceptado",
      titulo: `${matricula} — presupuesto aceptado`,
      mensaje: `${clienteNombre} ha aceptado el presupuesto para su ${vehiculoDesc} (${matricula}) por ${totalFinal.toFixed(2)}EUR. La OR ya está en reparación.`,
      enlace: presupuesto.ordenId ? `/ordenes/${presupuesto.ordenId}` : `/presupuestos/${presupuesto.id}`,
    });
  } else {
    // Rejected
    createNotification({
      tallerId: presupuesto.tallerId,
      tipo: "presupuesto_rechazado",
      titulo: `${matricula} — presupuesto rechazado`,
      mensaje: `${clienteNombre} ha rechazado el presupuesto para su ${vehiculoDesc} (${matricula}).`,
      enlace: `/presupuestos/${presupuesto.id}`,
    });
  }

  return NextResponse.json({ ok: true, estado });
}
