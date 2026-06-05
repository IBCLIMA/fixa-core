"use server";

import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function cambiarFlujoTaller(flujo: string) {
  const { tallerId } = await requireRole(["admin"]);
  const db = getDb();

  await db
    .update(talleres)
    .set({ flujoTaller: flujo })
    .where(eq(talleres.id, tallerId));

  revalidatePath("/taller-board");
}
