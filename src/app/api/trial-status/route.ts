import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    const [taller] = await db
      .select({
        plan: talleres.plan,
        trialEndsAt: talleres.trialEndsAt,
        activo: talleres.activo,
      })
      .from(talleres)
      .where(eq(talleres.id, tallerId));

    if (!taller) {
      return NextResponse.json({ plan: "trial", daysLeft: 14 });
    }

    let daysLeft = 14;
    if (taller.trialEndsAt) {
      daysLeft = Math.max(0, Math.ceil(
        (new Date(taller.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ));
    }

    return NextResponse.json({
      plan: taller.plan,
      daysLeft,
      activo: taller.activo,
    });
  } catch {
    return NextResponse.json({ plan: "trial", daysLeft: 14 });
  }
}
