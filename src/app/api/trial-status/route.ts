import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/db";
import { talleres, usuarios } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ plan: "none", daysLeft: 0 });

    const db = getDb();

    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.clerkUserId, userId),
    });
    if (!usuario) return NextResponse.json({ plan: "trial", daysLeft: 14 });

    const [taller] = await db
      .select({
        plan: talleres.plan,
        trialEndsAt: talleres.trialEndsAt,
        activo: talleres.activo,
      })
      .from(talleres)
      .where(eq(talleres.id, usuario.tallerId));

    if (!taller) return NextResponse.json({ plan: "trial", daysLeft: 14 });

    // Plan activo — no hay restricción
    if (["basico", "taller", "pro"].includes(taller.plan)) {
      return NextResponse.json({ plan: taller.plan, daysLeft: 999, activo: true });
    }

    // Cancelado
    if (taller.plan === "cancelado" || !taller.activo) {
      return NextResponse.json({ plan: taller.plan, daysLeft: 0, activo: false });
    }

    // Trial
    let daysLeft = 14;
    if (taller.trialEndsAt) {
      daysLeft = Math.max(0, Math.ceil(
        (new Date(taller.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ));
    }

    return NextResponse.json({ plan: "trial", daysLeft, activo: daysLeft > 0 });
  } catch {
    return NextResponse.json({ plan: "trial", daysLeft: 14 });
  }
}
