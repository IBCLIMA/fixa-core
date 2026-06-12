import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { success } = await rateLimit(`lead:${ip}`, 5, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const fuente = typeof body.fuente === "string" ? body.fuente.slice(0, 50) : "plantilla-or";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json(
        { error: "Debes aceptar la política de privacidad" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db
      .insert(leads)
      .values({ email, fuente })
      .onConflictDoNothing({ target: leads.email });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
