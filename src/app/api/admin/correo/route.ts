import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { listarMensajes, type Carpeta } from "@/lib/correo";

export const runtime = "nodejs";
export const maxDuration = 30;

const CARPETAS: Carpeta[] = ["recibidos", "enviados", "spam"];

export async function GET(request: Request) {
  try {
    const isAdmin = await getSuperAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const carpetaRaw = searchParams.get("carpeta") ?? "recibidos";
    const carpeta: Carpeta = (CARPETAS as string[]).includes(carpetaRaw)
      ? (carpetaRaw as Carpeta)
      : "recibidos";

    const limitRaw = Number(searchParams.get("limit") ?? "30");
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(1, limitRaw), 50) : 30;

    const offsetRaw = Number(searchParams.get("offset") ?? "0");
    const offset = Number.isFinite(offsetRaw) ? Math.max(0, offsetRaw) : 0;

    const buscar = (searchParams.get("q") ?? "").slice(0, 200);

    const resultado = await listarMensajes({ carpeta, limit, offset, buscar });
    return NextResponse.json(resultado);
  } catch (e: any) {
    console.error("Error al listar correo:", e);
    return NextResponse.json(
      { error: e?.message || "No se pudo conectar al buzón de correo." },
      { status: 500 },
    );
  }
}
