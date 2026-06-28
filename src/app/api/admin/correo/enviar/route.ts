import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { enviar, type CuentaId } from "@/lib/correo";

export const runtime = "nodejs";
export const maxDuration = 30;

// Validación básica de email (la misma que usamos en el cliente).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    const { to, subject, text, cuenta: cuentaRaw } = body as {
      to?: string;
      subject?: string;
      text?: string;
      cuenta?: string;
    };

    const cuenta: CuentaId = (CUENTAS as string[]).includes(cuentaRaw ?? "")
      ? (cuentaRaw as CuentaId)
      : "hola";

    const destinatario = to?.trim() ?? "";
    if (!EMAIL_RE.test(destinatario)) {
      return NextResponse.json(
        { error: "El destinatario no es un email válido." },
        { status: 400 },
      );
    }
    if (!subject?.trim()) {
      return NextResponse.json(
        { error: "Falta el asunto." },
        { status: 400 },
      );
    }
    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Falta el cuerpo del mensaje." },
        { status: 400 },
      );
    }

    const { messageId } = await enviar({
      to: destinatario,
      subject: subject.trim(),
      text,
      cuenta,
    });

    return NextResponse.json({ ok: true, messageId });
  } catch (e: any) {
    console.error("Error al enviar correo:", e);
    return NextResponse.json(
      { error: e?.message || "No se pudo enviar el correo." },
      { status: 500 },
    );
  }
}
