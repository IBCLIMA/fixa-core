import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { leerMensaje, type Carpeta, type CuentaId } from "@/lib/correo";

export const runtime = "nodejs";
export const maxDuration = 30;

const CARPETAS: Carpeta[] = ["recibidos", "enviados", "spam"];
const CUENTAS: CuentaId[] = ["hola", "sergi"];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    const isAdmin = await getSuperAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { uid } = await params;
    const uidNum = Number(uid);
    if (!Number.isInteger(uidNum) || uidNum <= 0) {
      return NextResponse.json({ error: "UID inválido" }, { status: 400 });
    }

    const searchParams = new URL(request.url).searchParams;

    const carpetaRaw = searchParams.get("carpeta") ?? "recibidos";
    const carpeta: Carpeta = (CARPETAS as string[]).includes(carpetaRaw)
      ? (carpetaRaw as Carpeta)
      : "recibidos";

    const cuentaRaw = searchParams.get("cuenta") ?? "hola";
    const cuenta: CuentaId = (CUENTAS as string[]).includes(cuentaRaw)
      ? (cuentaRaw as CuentaId)
      : "hola";

    const mensaje = await leerMensaje(uidNum, carpeta, cuenta);
    if (!mensaje) {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ mensaje });
  } catch (e: any) {
    console.error("Error al leer correo:", e);
    return NextResponse.json(
      { error: e?.message || "No se pudo leer el mensaje." },
      { status: 500 },
    );
  }
}
