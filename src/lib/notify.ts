import { getDb } from "@/db";
import { notificaciones } from "@/db/schema";
import { sendPushToTaller } from "@/lib/push";

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

  // Web push a los dispositivos del taller (también fire-and-forget)
  sendPushToTaller(params.tallerId, {
    title: params.titulo,
    body: params.mensaje,
    url: params.enlace || "/",
  }).catch(() => {});
}
