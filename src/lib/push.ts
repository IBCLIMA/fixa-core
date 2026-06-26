import { getDb } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Envía una notificación push a todos los dispositivos suscritos de un taller.
 * Fire-and-forget: nunca bloquea ni rompe la operación principal.
 * Las suscripciones muertas (404/410) se eliminan automáticamente.
 */
export async function sendPushToTaller(
  tallerId: string,
  payload: { title: string; body: string; url?: string }
): Promise<void> {
  if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return;

  try {
    const db = getDb();
    const subs = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.tallerId, tallerId));

    if (subs.length === 0) return;

    const webpush = (await import("web-push")).default;
    webpush.setVapidDetails(
      "mailto:" + (process.env.ADMIN_NOTIFICATION_EMAIL || "hola@fixataller.es"),
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const body = JSON.stringify(payload);

    await Promise.allSettled(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            body
          );
        } catch (e: unknown) {
          const statusCode = (e as { statusCode?: number })?.statusCode;
          if (statusCode === 404 || statusCode === 410) {
            // Suscripción caducada: limpiar
            await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id)).catch(() => {});
          }
        }
      })
    );
  } catch (e) {
    console.error("[push] Error sending push:", e instanceof Error ? e.message : e);
  }
}
