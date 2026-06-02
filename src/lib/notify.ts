import { getDb } from "@/db";
import { notificaciones } from "@/db/schema";

export async function createNotification(params: {
  tallerId: string;
  usuarioId?: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  enlace?: string;
}): Promise<void> {
  const db = getDb();

  // Fire-and-forget like audit logging
  db.insert(notificaciones)
    .values({
      tallerId: params.tallerId,
      usuarioId: params.usuarioId || null,
      tipo: params.tipo,
      titulo: params.titulo,
      mensaje: params.mensaje,
      enlace: params.enlace || null,
    })
    .then(() => {})
    .catch((err) => {
      console.error("[notify] Error creating notification:", err);
    });
}
