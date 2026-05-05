import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { fotosOrden } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { tallerId } = await getTallerIdFromAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const ordenId = formData.get("ordenId") as string;
    const tipo = (formData.get("tipo") as string) || "entrada";
    const descripcion = formData.get("descripcion") as string;

    if (!file || !ordenId) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
    }

    // Limitar tamaño a 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Imagen demasiado grande (máx 10MB)" }, { status: 400 });
    }

    // Subir a Vercel Blob
    const filename = `fixa/${tallerId}/${ordenId}/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Guardar referencia en DB
    const db = getDb();
    const [foto] = await db
      .insert(fotosOrden)
      .values({
        ordenId,
        url: blob.url,
        descripcion: descripcion || null,
        tipo: tipo as "entrada" | "proceso" | "salida",
      })
      .returning();

    revalidatePath(`/ordenes/${ordenId}`);

    return NextResponse.json({ foto, url: blob.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
