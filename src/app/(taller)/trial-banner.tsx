"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export function TrialBanner() {
  const [trialInfo, setTrialInfo] = useState<{ daysLeft: number; plan: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/trial-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.plan === "trial" && data.daysLeft <= 5) {
          setTrialInfo(data);
        }
      })
      .catch(() => {});
  }, []);

  if (!trialInfo || dismissed) return null;

  const isExpired = trialInfo.daysLeft <= 0;

  return (
    <div className={`px-4 py-2.5 text-center text-sm font-medium ${isExpired ? "bg-red-500 text-white" : "bg-amber-100 text-amber-800"}`}>
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        {isExpired ? (
          <span>Tu período de prueba ha terminado. Contacta con nosotros para activar tu plan.</span>
        ) : (
          <span>Te quedan {trialInfo.daysLeft} día{trialInfo.daysLeft !== 1 ? "s" : ""} de prueba gratuita.</span>
        )}
        <button onClick={() => setDismissed(true)} className="ml-2">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
