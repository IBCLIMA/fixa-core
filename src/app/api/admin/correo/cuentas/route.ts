import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { listarCuentas } from "@/lib/correo";

export const runtime = "nodejs";
export const maxDuration = 15;
export const dynamic = "force-dynamic";

// Cuentas de correo disponibles para el webmail del admin (id, label, email, disponible).
export async function GET() {
  try {
    if (!(await getSuperAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.json({ cuentas: listarCuentas() });
  } catch (e: any) {
    console.error("Error al listar cuentas de correo:", e);
    return NextResponse.json(
      { error: e?.message || "No se pudieron cargar las cuentas." },
      { status: 500 },
    );
  }
}
