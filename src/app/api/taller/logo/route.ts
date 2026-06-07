import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireRole } from "@/lib/auth";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { tallerId } = await requireRole(["admin"]);
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se ha seleccionado archivo" }, { status: 400 });
    }

    // Only allow images
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Solo se permiten imágenes (JPEG, PNG, WebP, SVG)" }, { status: 400 });
    }

    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "El logo no puede superar 2MB" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`logos/${tallerId}-${Date.now()}.${file.type.split("/")[1]}`, file, {
      access: "public",
    });

    // Update taller
    const db = getDb();
    await db
      .update(talleres)
      .set({ logoUrl: blob.url })
      .where(eq(talleres.id, tallerId));

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("Error uploading logo:", e);
    return NextResponse.json({ error: "Error al subir el logo" }, { status: 500 });
  }
}
