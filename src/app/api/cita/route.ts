import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { citas, talleres, diasBloqueados } from "@/db/schema";
import { eq, and, ne, count } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";
import { createNotification } from "@/lib/notify";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { success } = await rateLimit(ip, 5, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { tallerId, nombre, telefono, motivo, fecha, horaPreferida, matricula, consentimiento } = body;

    // RGPD: el consentimiento explícito es obligatorio para tratar los datos
    if (consentimiento !== true) {
      return NextResponse.json(
        { error: "Debes aceptar la política de privacidad para solicitar la cita." },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!tallerId || !nombre || !telefono || !motivo || !fecha) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, teléfono, motivo y fecha son requeridos." },
        { status: 400 }
      );
    }

    // Validate field types, lengths and phone format
    if (typeof nombre !== "string" || typeof telefono !== "string" || typeof motivo !== "string" || typeof fecha !== "string"
      || nombre.trim().length < 2 || nombre.length > 120 || motivo.length > 1000) {
      return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
    }
    const telefonoLimpio = telefono.trim();
    if (!/^[+]?[\d\s\-().]{7,20}$/.test(telefonoLimpio)) {
      return NextResponse.json({ error: "El teléfono no parece válido." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return NextResponse.json({ error: "Fecha no válida." }, { status: 400 });
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
      .select({ id: talleres.id, trabajaSabados: talleres.trabajaSabados, capacidadDiaria: talleres.capacidadDiaria })
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

    // Server-side check: blocked days (the form also checks, but never trust the client)
    const [diaBloqueado] = await db
      .select({ id: diasBloqueados.id })
      .from(diasBloqueados)
      .where(and(eq(diasBloqueados.tallerId, tallerId), eq(diasBloqueados.fecha, fecha)))
      .limit(1);
    if (diaBloqueado) {
      return NextResponse.json(
        { error: "El taller no tiene disponibilidad ese día. Elige otra fecha." },
        { status: 400 }
      );
    }

    // Server-side check: daily capacity
    if (tallerData.capacidadDiaria) {
      const [citasDia] = await db
        .select({ total: count() })
        .from(citas)
        .where(and(
          eq(citas.tallerId, tallerId),
          eq(citas.fecha, fecha),
          ne(citas.estado, "cancelada")
        ));
      if ((citasDia?.total ?? 0) >= tallerData.capacidadDiaria) {
        return NextResponse.json(
          { error: "No quedan huecos para ese día. Elige otra fecha." },
          { status: 400 }
        );
      }
    }

    // Map hora preferida to horaInicio
    let horaInicio: string | undefined;
    if (horaPreferida === "manana") horaInicio = "09:00";
    else if (horaPreferida === "tarde") horaInicio = "15:00";

    // Create cita
    await db.insert(citas).values({
      tallerId,
      nombreCliente: nombre.trim(),
      telefonoCliente: telefonoLimpio,
      consentimientoAt: new Date(),
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
