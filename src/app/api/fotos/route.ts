import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { fotosOrden, ordenesTrabajo } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

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

    // Validar tipo de archivo (whitelist estricta, no confiar en client MIME)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Solo se permiten imágenes (JPEG, PNG, WebP, HEIC) o vídeos (MP4, WebM, MOV)" }, { status: 400 });
    }

    // Limitar tamaño: 30MB para vídeo, 10MB para imagen
    const maxSize = isVideo ? 30 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: isVideo ? "Vídeo demasiado grande (máx 30MB)" : "Imagen demasiado grande (máx 10MB)" }, { status: 400 });
    }

    // Verificar que la orden pertenece al taller autenticado
    const db = getDb();
    const [orden] = await db
      .select({ id: ordenesTrabajo.id })
      .from(ordenesTrabajo)
      .where(and(eq(ordenesTrabajo.id, ordenId), eq(ordenesTrabajo.tallerId, tallerId)));

    if (!orden) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // Sanitizar filename - eliminar caracteres peligrosos y path traversal
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.{2,}/g, "_");
    const filename = `fixa/${tallerId}/${ordenId}/${Date.now()}-${safeName}`;
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Guardar referencia en DB
    const [foto] = await db
      .insert(fotosOrden)
      .values({
        ordenId,
        url: blob.url,
        descripcion: descripcion || null,
        tipo: tipo as "entrada" | "proceso" | "salida",
        esVideo: isVideo,
      })
      .returning();

    revalidatePath(`/ordenes/${ordenId}`);

    return NextResponse.json({
      foto,
      url: blob.url,
      ...(isVideo ? { hint: "Vídeo subido. Recomendamos vídeos de máximo 60 segundos." } : {}),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
