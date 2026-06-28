import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { responder, type CuentaId } from "@/lib/correo";

export const runtime = "nodejs";
export const maxDuration = 30;

const CUENTAS: CuentaId[] = ["hola", "sergi"];

export async function POST(request: Request) {
  try {
    const isAdmin = await getSuperAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
    }

    const { to, subject, text, inReplyTo, references, cuenta: cuentaRaw } = body as {
      to?: string;
      subject?: string;
      text?: string;
      inReplyTo?: string | null;
      references?: string | null;
      cuenta?: string;
    };

    if (!to || !text?.trim()) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (destinatario y mensaje)." },
        { status: 400 },
      );
    }

    const cuenta: CuentaId = (CUENTAS as string[]).includes(cuentaRaw ?? "")
      ? (cuentaRaw as CuentaId)
      : "hola";

    const { messageId } = await responder({
      to,
      subject: subject ?? "(sin asunto)",
      text,
      inReplyTo: inReplyTo ?? null,
      references: references ?? null,
      cuenta,
    });

    return NextResponse.json({ ok: true, messageId });
  } catch (e: any) {
    console.error("Error al responder correo:", e);
    return NextResponse.json(
      { error: e?.message || "No se pudo enviar la respuesta." },
      { status: 500 },
    );
  }
}
