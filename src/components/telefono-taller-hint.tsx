import { AlertTriangle } from "lucide-react";
import { esTelefonoFijoES } from "@/lib/utils";

/**
 * Aviso bajo el campo del teléfono DEL TALLER (onboarding y configuración).
 * Aclara que es el número de contacto WhatsApp que verán los clientes — NO el
 * número desde el que se envían los WhatsApp (eso sale del móvil del que pulsa).
 * Si detecta un fijo, avisa de que los clientes no podrán escribir por WhatsApp.
 */
export function TelefonoTallerHint({ telefono }: { telefono: string | null | undefined }) {
  const esFijo = esTelefonoFijoES(telefono);
  return (
    <div className="space-y-1 pt-0.5">
      <p className="text-[11px] leading-snug text-stone-400">
        Es el número con el que tus clientes te escribirán por WhatsApp. Usa un móvil con WhatsApp, no el fijo del taller.
      </p>
      {esFijo && (
        <p className="flex items-start gap-1 text-[11px] font-medium leading-snug text-amber-600">
          <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
          Parece un fijo. Tus clientes no podrán escribirte por WhatsApp a este número.
        </p>
      )}
    </div>
  );
}
