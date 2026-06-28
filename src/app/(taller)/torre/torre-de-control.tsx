"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Car,
  Clock,
  MessageSquare,
  ShieldAlert,
  Phone,
  ArrowRight,
  Check,
  CalendarClock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { gestionarAlerta } from "./actions";
import type { TorreCategoria, TorreItem } from "@/lib/torre-control";

const CATEGORIA_META: Record<
  TorreCategoria,
  { icon: LucideIcon; chip: string; accent: string }
> = {
  ventas: { icon: Banknote, chip: "bg-emerald-100 text-emerald-700", accent: "border-l-emerald-400" },
  entrega: { icon: Car, chip: "bg-brand-100 text-brand-700", accent: "border-l-brand-400" },
  operativa: { icon: Clock, chip: "bg-red-100 text-red-700", accent: "border-l-red-400" },
  comunicacion: { icon: MessageSquare, chip: "bg-blue-100 text-blue-700", accent: "border-l-blue-400" },
  recurrencia: { icon: ShieldAlert, chip: "bg-violet-100 text-violet-700", accent: "border-l-violet-400" },
};

function AccionBoton({ accion, primary }: { accion: TorreItem["acciones"][number]; primary: boolean }) {
  const icon =
    accion.tipo === "whatsapp" ? (
      <MessageSquare className="h-4 w-4" />
    ) : accion.tipo === "llamar" ? (
      <Phone className="h-4 w-4" />
    ) : (
      <ArrowRight className="h-4 w-4" />
    );

  const className = "h-11 rounded-xl text-xs font-bold";

  if (accion.tipo === "ir") {
    return (
      <Button asChild variant={primary ? "default" : "outline"} className={className}>
        <Link href={accion.href}>
          {icon}
          {accion.label}
        </Link>
      </Button>
    );
  }

  // whatsapp (external) / llamar (tel:)
  const isWhatsapp = accion.tipo === "whatsapp";
  return (
    <Button
      asChild
      variant={primary ? "default" : "outline"}
      className={
        primary && isWhatsapp
          ? `${className} bg-emerald-600 text-white hover:bg-emerald-500`
          : className
      }
    >
      <a href={accion.href} target={accion.external ? "_blank" : undefined} rel={accion.external ? "noopener noreferrer" : undefined}>
        {icon}
        {accion.label}
      </a>
    </Button>
  );
}

function TorreFila({ item }: { item: TorreItem }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [hecha, setHecha] = useState(false);
  const meta = CATEGORIA_META[item.categoria];
  const Icon = meta.icon;

  function gestionar(estado: "gestionada" | "pospuesta") {
    startTransition(async () => {
      try {
        await gestionarAlerta({ alertaKey: item.key, estado });
        if (estado === "gestionada") setHecha(true);
        toast.success(estado === "gestionada" ? "Marcado como hecho" : "Pospuesto a mañana");
        router.refresh();
      } catch {
        toast.error("No se pudo guardar. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <div
      className={`rounded-2xl border border-l-4 ${meta.accent} bg-card p-4 shadow-xs transition-all ${
        hecha ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.chip}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold leading-tight">{item.titulo}</p>
            {typeof item.importe === "number" && item.importe > 0 && (
              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 tabular-nums">
                {formatMoney(item.importe)}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{item.motivo}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {item.acciones.map((a, i) => (
          <AccionBoton key={`${a.tipo}-${i}`} accion={a} primary={i === 0} />
        ))}
        {!item.agrupada && (
          <>
            <Button
              variant="outline"
              className="h-11 rounded-xl text-xs font-bold"
              onClick={() => gestionar("gestionada")}
              disabled={pending}
            >
              <Check className="h-4 w-4" />
              Marcar hecho
            </Button>
            <Button
              variant="ghost"
              className="h-11 rounded-xl text-xs font-bold text-muted-foreground"
              onClick={() => gestionar("pospuesta")}
              disabled={pending}
            >
              <CalendarClock className="h-4 w-4" />
              Posponer
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function TorreDeControl({ items }: { items: TorreItem[] }) {
  if (items.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/40">
        <CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">Todo bajo control</p>
            <p className="text-xs text-emerald-700">Nada urgente ahora mismo. Sigue a lo tuyo.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand/30 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white tabular-nums">
            {items.length}
          </span>
          Hoy requiere tu atención
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <TorreFila key={item.key} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
