import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { citas, talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";
import { createNotification } from "@/lib/notify";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { success } = rateLimit(ip, 5, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { tallerId, nombre, telefono, motivo, fecha, horaPreferida, matricula } = body;

    // Validate required fields
    if (!tallerId || !nombre || !telefono || !motivo || !fecha) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, teléfono, motivo y fecha son requeridos." },
        { status: 400 }
      );
    }

    // Validate date is in the future and not a weekend
    const fechaDate = new Date(fecha + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fechaDate <= today) {
      return NextResponse.json(
        { error: "La fecha debe ser en el futuro." },
        { status: 400 }
      );
    }

    // Verify taller exists and get config
    const db = getDb();
    const [tallerData] = await db
      .select({ id: talleres.id, trabajaSabados: talleres.trabajaSabados })
      .from(talleres)
      .where(eq(talleres.id, tallerId))
      .limit(1);

    if (!tallerData) {
      return NextResponse.json(
        { error: "Taller no encontrado." },
        { status: 404 }
      );
    }

    const dayOfWeek = fechaDate.getDay();
    // Always block Sundays
    if (dayOfWeek === 0) {
      return NextResponse.json(
        { error: "No abrimos los domingos." },
        { status: 400 }
      );
    }
    // Block Saturdays only if workshop doesn't work Saturdays
    if (dayOfWeek === 6 && !tallerData.trabajaSabados) {
      return NextResponse.json(
        { error: "No abrimos los sabados." },
        { status: 400 }
      );
    }

    // Map hora preferida to horaInicio
    let horaInicio: string | undefined;
    if (horaPreferida === "manana") horaInicio = "09:00";
    else if (horaPreferida === "tarde") horaInicio = "15:00";

    // Create cita
    await db.insert(citas).values({
      tallerId,
      nombreCliente: nombre,
      telefonoCliente: telefono,
      fecha,
      horaInicio,
      motivo: `${motivo}${matricula ? ` | Matrícula: ${matricula}` : ""}${horaPreferida ? ` | Horario: ${horaPreferida === "manana" ? "Mañana (9-13h)" : horaPreferida === "tarde" ? "Tarde (15-19h)" : "Indiferente"}` : ""}`,
      estado: "programada",
    });

    // Notify workshop about new online booking
    createNotification({
      tallerId,
      tipo: "cita_nueva",
      titulo: "Nueva cita online",
      mensaje: `${nombre} ha solicitado cita para el ${fecha}${matricula ? ` (${matricula})` : ""}.`,
      enlace: "/calendario",
    });

    return NextResponse.json({ ok: true, message: "Cita solicitada" });
  } catch (error) {
    console.error("Error creating cita:", error);
    return NextResponse.json(
      { error: "Error al solicitar la cita. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
