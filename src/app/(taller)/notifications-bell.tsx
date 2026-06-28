"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, BellOff, CheckCheck } from "lucide-react";
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
  if (days < 7) return `hace ${days}d`;
  const weeks = Math.floor(days / 7);
  return `hace ${weeks}sem`;
}

type GroupKey = "Hoy" | "Esta semana" | "Anteriores";

function groupOf(dateStr: string): GroupKey {
  const d = new Date(dateStr);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (d.getTime() >= startOfToday.getTime()) return "Hoy";
  const sevenDaysAgo = startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000;
  if (d.getTime() >= sevenDaysAgo) return "Esta semana";
  return "Anteriores";
}

const GROUP_ORDER: GroupKey[] = ["Hoy", "Esta semana", "Anteriores"];

export function NotificationsBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notificaciones/count");
      const data = await res.json();
      setCount(data.count ?? 0);
    } catch {}
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notificaciones");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll unread count: on mount, every minute, and when the tab regains focus.
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    function onFocus() {
      if (document.visibilityState === "visible") fetchCount();
    }
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [fetchCount]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function toggleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    fetchItems();
    fetchCount();
  }

  async function markAllRead() {
    // Optimistic
    setCount(0);
    setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
    try {
      await fetch("/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marcarTodas: true }),
      });
    } catch {
      fetchCount();
    }
  }

  async function handleClickNotification(n: Notification) {
    if (!n.leida) {
      setCount((c) => Math.max(0, c - 1));
      setItems((prev) => prev.map((item) => (item.id === n.id ? { ...item, leida: true } : item)));
      try {
        await fetch("/api/notificaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [n.id] }),
        });
      } catch {
        fetchCount();
      }
    }
    if (n.enlace) {
      setOpen(false);
      router.push(n.enlace);
    }
  }

  // Group items (API already returns them newest-first).
  const groups = GROUP_ORDER.map((key) => ({
    key,
    items: items.filter((n) => groupOf(n.createdAt) === key),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={count > 0 ? `Notificaciones, ${count} sin leer` : "Notificaciones"}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell className="h-[18px] w-[18px]" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold tabular-nums text-white ring-2 ring-background">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notificaciones"
          className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">Notificaciones</span>
            {count > 0 && (
              <button
                onClick={markAllRead}
                className="-mr-1.5 flex items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todas
              </button>
            )}
          </div>

          <div className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain">
            {loading ? (
              <div className="divide-y divide-border/50">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-2.5 px-4 py-3">
                    <div className="mt-0.5 h-5 w-5 shrink-0 animate-pulse rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold">Sin novedades</p>
                <p className="text-xs text-muted-foreground">
                  Aquí verás presupuestos aceptados, recambios y avisos.
                </p>
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.key}>
                  <div className="sticky top-0 z-10 bg-card/95 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
                    {group.key}
                  </div>
                  {group.items.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleClickNotification(n)}
                      className={cn(
                        "flex min-h-[52px] w-full items-start gap-2.5 border-b border-border/50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted",
                        !n.leida && "bg-brand-50"
                      )}
                    >
                      <span className="mt-0.5 shrink-0 text-base">{tipoIcons[n.tipo] || "🔔"}</span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm leading-tight", !n.leida ? "font-bold" : "font-medium")}>
                          {n.titulo}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.mensaje}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.leida && (
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"
                          aria-label="Sin leer"
                        />
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          <PushToggle />
        </div>
      )}
    </div>
  );
}
