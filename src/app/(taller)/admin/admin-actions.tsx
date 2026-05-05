"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Check, X, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Props {
  tallerId: string;
  plan: string;
  activo: boolean;
}

export function AdminTallerActions({ tallerId, plan, activo }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateTaller(data: Record<string, any>) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/talleres/${tallerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Taller actualizado");
      router.refresh();
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setLoading(false);
    }
  }

  function extenderTrial(dias: number) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + dias);
    updateTaller({ trialEndsAt: newDate.toISOString(), plan: "trial" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full shrink-0" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Cambiar plan</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => updateTaller({ plan: "basico", suscripcionActiva: true })} disabled={plan === "basico"}>
          <Check className="h-3.5 w-3.5 mr-2 text-blue-600" />Básico (29€/mes)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateTaller({ plan: "taller", suscripcionActiva: true })} disabled={plan === "taller"}>
          <Check className="h-3.5 w-3.5 mr-2 text-emerald-600" />Taller (49€/mes)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateTaller({ plan: "pro", suscripcionActiva: true })} disabled={plan === "pro"}>
          <Check className="h-3.5 w-3.5 mr-2 text-violet-600" />Pro (79€/mes)
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Trial</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => extenderTrial(14)}>
          <Clock className="h-3.5 w-3.5 mr-2" />Dar 14 días de trial
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => extenderTrial(30)}>
          <Clock className="h-3.5 w-3.5 mr-2" />Dar 30 días de trial
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Estado</DropdownMenuLabel>
        {activo ? (
          <DropdownMenuItem onClick={() => updateTaller({ activo: false })} className="text-red-600">
            <X className="h-3.5 w-3.5 mr-2" />Desactivar taller
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => updateTaller({ activo: true })} className="text-emerald-600">
            <Check className="h-3.5 w-3.5 mr-2" />Activar taller
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => updateTaller({ plan: "cancelado", suscripcionActiva: false })} className="text-red-600" disabled={plan === "cancelado"}>
          <X className="h-3.5 w-3.5 mr-2" />Cancelar suscripción
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
