import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { contarNoLeidos } from "@/lib/correo";

export const runtime = "nodejs";
export const maxDuration = 15;
export const dynamic = "force-dynamic";

// Nº de correos no leídos en la bandeja de entrada — para el badge del nav admin.
export async function GET() {
  try {
    if (!(await getSuperAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const noLeidos = await contarNoLeidos();
    return NextResponse.json({ noLeidos });
  } catch {
    // Nunca rompemos el nav por un fallo de IMAP: devolvemos 0.
    return NextResponse.json({ noLeidos: 0 });
  }
}
