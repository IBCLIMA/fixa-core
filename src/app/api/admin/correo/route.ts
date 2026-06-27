import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { listarMensajes } from "@/lib/correo";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: Request) {
  try {
    const isAdmin = await getSuperAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitRaw = Number(searchParams.get("limit") ?? "30");
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(1, limitRaw), 50) : 30;

    const mensajes = await listarMensajes(limit);
    return NextResponse.json({ mensajes });
  } catch (e: any) {
    console.error("Error al listar correo:", e);
    return NextResponse.json(
      { error: e?.message || "No se pudo conectar al buzón de correo." },
      { status: 500 },
    );
  }
}
