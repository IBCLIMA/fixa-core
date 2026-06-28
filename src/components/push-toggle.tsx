"use client";

import { useState, useEffect } from "react";
import { BellRing, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/**
 * Activar/desactivar notificaciones push en este dispositivo.
 * Se muestra dentro del panel de la campana.
 */
export function PushToggle() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    setSupported(true);
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEnabled(!!sub))
      .catch(() => {});
  }, []);

  async function toggle() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      if (enabled) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await fetch("/api/push/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
          await sub.unsubscribe();
        }
        setEnabled(false);
        toast.success("Avisos desactivados en este dispositivo");
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          toast.error("Has bloqueado las notificaciones. Actívalas en los ajustes del navegador.");
          return;
        }
        const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!key) {
          toast.error("Notificaciones no configuradas");
          return;
        }
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
        });
        const res = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub.toJSON()),
        });
        if (!res.ok) throw new Error();
        setEnabled(true);
        toast.success("Avisos activados: te llegarán al instante en este dispositivo");
      }
    } catch {
      toast.error("No se han podido activar los avisos");
    } finally {
      setBusy(false);
    }
  }

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : enabled ? (
        <BellOff className="h-3.5 w-3.5" />
      ) : (
        <BellRing className="h-3.5 w-3.5 text-brand-500" />
      )}
      {enabled
        ? "Desactivar avisos en este dispositivo"
        : "Activar avisos en este dispositivo (recomendado)"}
    </button>
  );
}
