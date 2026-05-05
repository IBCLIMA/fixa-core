"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle, X, Zap } from "lucide-react";

export function TrialBanner() {
  const [trialInfo, setTrialInfo] = useState<{ daysLeft: number; plan: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/trial-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.plan === "trial") {
          setTrialInfo(data);
        }
      })
      .catch(() => {});
  }, []);

  if (!trialInfo || dismissed) return null;
  if (trialInfo.plan !== "trial") return null;

  const { daysLeft } = trialInfo;
  const isExpired = daysLeft <= 0;

  let bgColor: string;
  let textColor: string;
  let icon: typeof Clock;
  let message: string;
  let canDismiss: boolean;

  if (isExpired) {
    bgColor = "bg-red-600";
    textColor = "text-white";
    icon = AlertTriangle;
    message = "Tu período de prueba ha terminado. Contacta con nosotros para activar tu plan.";
    canDismiss = false;
  } else if (daysLeft === 1) {
    bgColor = "bg-orange-500";
    textColor = "text-white";
    icon = AlertTriangle;
    message = "Tu prueba termina mañana. ¡Activa tu plan para no perder el acceso!";
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
    message = `Estás en período de prueba gratuita. Te quedan ${daysLeft} días.`;
    canDismiss = true;
  }

  const Icon = icon;

  return (
    <div className={`${bgColor} ${textColor} px-4 py-2 text-center text-sm font-medium relative`}>
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{message}</span>
        {isExpired && (
          <a
            href="https://wa.me/34611433218?text=Hola%2C%20quiero%20activar%20mi%20plan%20de%20FIXA"
            target="_blank"
            className="ml-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            Activar plan
          </a>
        )}
      </div>
      {canDismiss && (
        <button onClick={() => setDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
        </button>
      )}
    </div>
  );
}
