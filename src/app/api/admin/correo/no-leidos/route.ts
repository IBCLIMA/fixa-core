import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { contarNoLeidos, getConfigCuenta, type CuentaId } from "@/lib/correo";

export const runtime = "nodejs";
export const maxDuration = 15;
export const dynamic = "force-dynamic";

const CUENTAS: CuentaId[] = ["hola", "sergi"];

// Nº de correos no leídos — para el badge del nav admin.
// Suma las cuentas DISPONIBLES y devuelve el desglose por cuenta.
// Una cuenta no configurada (o que falle) cuenta 0 sin romper el resto.
export async function GET() {
  try {
    if (!(await getSuperAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const porCuenta: Record<CuentaId, number> = { hola: 0, sergi: 0 };

    await Promise.all(
      CUENTAS.map(async (id) => {
        if (!getConfigCuenta(id).disponible) return;
        try {
          porCuenta[id] = await contarNoLeidos(id);
        } catch {
          porCuenta[id] = 0;
        }
      }),
    );

    const total = porCuenta.hola + porCuenta.sergi;
    // `noLeidos` se mantiene por compatibilidad con el badge actual del nav.
    return NextResponse.json({ noLeidos: total, total, porCuenta });
  } catch {
    // Nunca rompemos el nav por un fallo de IMAP: devolvemos 0.
    return NextResponse.json({
      noLeidos: 0,
      total: 0,
      porCuenta: { hola: 0, sergi: 0 },
    });
  }
}
