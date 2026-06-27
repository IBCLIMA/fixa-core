"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Clock, LogIn, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cambiarPlan, setActivo, aprobarRegistro, entrarComoTaller, type Plan } from "../acciones";

const PLAN_OPTIONS: { value: Plan; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "trial", label: "Trial" },
  { value: "basico", label: "Básico (29€/mes)" },
  { value: "taller", label: "Taller (49€/mes)" },
  { value: "pro", label: "Pro (79€/mes)" },
  { value: "cancelado", label: "Cancelado" },
];

interface Props {
  tallerId: string;
  nombre: string;
  plan: Plan;
  activo: boolean;
}

export function TallerAcciones({ tallerId, nombre, plan, activo }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [planSel, setPlanSel] = useState<Plan>(plan);

  function run(fn: () => Promise<void>, okMsg: string) {
    startTransition(async () => {
      try {
        await fn();
        toast.success(okMsg);
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error al ejecutar la acción");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Aprobar registro (solo si pendiente) */}
      {plan === "pendiente" && (
        <div className="rounded-xl border-2 border-brand-300 bg-brand-50 p-4">
          <p className="text-sm font-bold text-brand-800">Registro pendiente de aprobación</p>
          <p className="mt-0.5 text-xs text-brand-700">
            Al aprobar, el taller pasa a <strong>trial de 14 días</strong> y se activa.
          </p>
          <Button
            onClick={() => run(() => aprobarRegistro(tallerId), "Registro aprobado · trial de 14 días")}
            disabled={pending}
            className="mt-3 bg-brand-600 text-white hover:bg-brand-700"
            size="sm"
          >
            <Check className="mr-1.5 h-4 w-4" />
            Aprobar registro
          </Button>
        </div>
      )}

      {/* Cambiar plan */}
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <p className="text-sm font-bold">Plan</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Cambia el plan de suscripción del taller.</p>
        <div className="mt-3 flex items-center gap-2">
          <Select value={planSel} onValueChange={(v) => setPlanSel(v as Plan)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => run(() => cambiarPlan(tallerId, planSel), "Plan actualizado")}
            disabled={pending || planSel === plan}
            size="sm"
          >
            Guardar
          </Button>
        </div>
      </div>

      {/* Activar / desactivar */}
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <p className="text-sm font-bold">Estado del taller</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Un taller desactivado no puede acceder a la app (queda bloqueado).
        </p>
        {activo ? (
          <Button
            onClick={() => run(() => setActivo(tallerId, false), "Taller desactivado")}
            disabled={pending}
            variant="outline"
            size="sm"
            className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
          >
            <X className="mr-1.5 h-4 w-4" />
            Desactivar taller
          </Button>
        ) : (
          <Button
            onClick={() => run(() => setActivo(tallerId, true), "Taller activado")}
            disabled={pending}
            size="sm"
            className="mt-3 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Check className="mr-1.5 h-4 w-4" />
            Activar taller
          </Button>
        )}
      </div>

      {/* Entrar como taller (impersonar) */}
      <div className="rounded-xl border border-zinc-300 bg-zinc-50 p-4">
        <div className="flex items-center gap-2">
          <LogIn className="h-4 w-4 text-zinc-700" />
          <p className="text-sm font-bold">Entrar como este taller</p>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Accede a la app de FIXA como si fueras <strong>{nombre}</strong>. Verás sus órdenes, clientes y
          datos. Para salir, usa el switcher de talleres.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={pending} size="sm" className="mt-3 bg-zinc-900 text-white hover:bg-zinc-800">
              <LogIn className="mr-1.5 h-4 w-4" />
              Entrar como taller
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Vas a entrar como {nombre}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Saldrás del panel de administración y entrarás en la app operando como este taller. Todo lo
                que hagas (crear órdenes, editar datos…) afectará a sus datos reales. Asegúrate de salir
                cuando termines.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  startTransition(async () => {
                    try {
                      // entrarComoTaller redirige a "/" tras fijar la cookie.
                      await entrarComoTaller(tallerId);
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "No se pudo entrar como taller");
                    }
                  })
                }
              >
                Sí, entrar como taller
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
