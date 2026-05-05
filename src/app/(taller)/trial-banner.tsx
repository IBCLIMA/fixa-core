"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Clock, AlertTriangle, X, Zap } from "lucide-react";

const exemptRoutes = ["/trial-expirado", "/pendiente-aprobacion", "/configuracion", "/ayuda", "/admin", "/bienvenida"];

export function TrialBanner() {
  const [trialInfo, setTrialInfo] = useState<{ daysLeft: number; plan: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trial-status")
      .then((r) => r.json())
      .then((data) => {
        setTrialInfo(data);

        // Bloquear si pendiente de aprobación
        if (data.plan === "pendiente") {
          if (!exemptRoutes.some((r) => pathname.startsWith(r))) {
            router.replace("/pendiente-aprobacion");
          }
        }

        // Bloquear acceso si trial expirado
        if (data.plan === "trial" && data.daysLeft <= 0) {
          if (!exemptRoutes.some((r) => pathname.startsWith(r))) {
            router.replace("/trial-expirado");
          }
        }

        // Bloquear si plan cancelado
        if (data.plan === "cancelado") {
          if (!exemptRoutes.some((r) => pathname.startsWith(r))) {
            router.replace("/trial-expirado");
          }
        }
      })
      .catch(() => {});
  }, [pathname, router]);

  if (!trialInfo || dismissed) return null;
  if (trialInfo.plan !== "trial") return null;

  const { daysLeft } = trialInfo;
  const isExpired = daysLeft <= 0;

  if (isExpired) return null; // Ya redirigido

  let bgColor: string;
  let textColor: string;
  let icon: typeof Clock;
  let message: string;
  let canDismiss: boolean;

  if (daysLeft === 1) {
    bgColor = "bg-orange-500";
    textColor = "text-white";
    icon = AlertTriangle;
    message = "Tu prueba termina mañana. ¡Contacta para activar tu plan!";
    canDismiss = false;
  } else if (daysLeft <= 5) {
    bgColor = "bg-amber-400";
    textColor = "text-amber-900";
    icon = Clock;
    message = `Tu prueba termina en ${daysLeft} días. Contacta con nosotros para continuar.`;
    canDismiss = true;
  } else {
    bgColor = "bg-blue-50 border-b border-blue-200";
    textColor = "text-blue-700";
    icon = Zap;
    message = `Prueba gratuita — ${daysLeft} días restantes`;
    canDismiss = true;
  }

  const Icon = icon;

  return (
    <div className={`${bgColor} ${textColor} px-4 py-2 text-center text-sm font-medium relative`}>
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      {canDismiss && (
        <button onClick={() => setDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
        </button>
      )}
    </div>
  );
}
