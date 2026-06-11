"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PushToggle } from "@/components/push-toggle";

type Notification = {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  enlace: string | null;
  createdAt: string;
};

const tipoIcons: Record<string, string> = {
  cita_nueva: "📅",
  orden_lista: "✅",
  pago_pendiente: "⚠️",
  itv_proxima: "🚗",
  mantenimiento_pendiente: "🔧",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export function NotificationsBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch unread count
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/notificaciones/count");
        const data = await res.json();
        setCount(data.count ?? 0);
      } catch {}
    }
    fetchCount();
    const interval = setInterval(fetchCount, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch("/api/notificaciones");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marcarTodas: true }),
      });
      setCount(0);
      setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
    } catch {}
  }

  async function handleClickNotification(n: Notification) {
    // Mark as read
    if (!n.leida) {
      try {
        await fetch("/api/notificaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [n.id] }),
        });
        setCount((c) => Math.max(0, c - 1));
        setItems((prev) => prev.map((item) => (item.id === n.id ? { ...item, leida: true } : item)));
      } catch {}
    }
    if (n.enlace) {
      setOpen(false);
      router.push(n.enlace);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="h-[18px] w-[18px]" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-sm font-bold">Notificaciones</span>
            {count > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                Marcar todas
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="py-8 text-center text-xs text-muted-foreground">Cargando...</p>
            ) : items.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">Sin notificaciones</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClickNotification(n)}
                  className={cn(
                    "flex w-full items-start gap-2.5 px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0",
                    !n.leida && "bg-blue-50/50"
                  )}
                >
                  <span className="text-base mt-0.5 shrink-0">{tipoIcons[n.tipo] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm leading-tight", !n.leida ? "font-bold" : "font-medium")}>{n.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.mensaje}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.leida && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                </button>
              ))
            )}
          </div>
          <PushToggle />
        </div>
      )}
    </div>
  );
}
