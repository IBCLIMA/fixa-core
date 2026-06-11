import { redirect } from "next/navigation";
import { checkTrialStatus, getSuperAdmin } from "@/lib/auth";

export async function TrialGuard({ pathname }: { pathname: string }) {
  // No bloquear estas rutas aunque el trial haya expirado
  const exemptRoutes = ["/trial-expirado", "/pendiente-aprobacion", "/configuracion", "/ayuda", "/admin", "/bienvenida"];
  if (exemptRoutes.some((r) => pathname.startsWith(r))) return null;

  // Superadmin nunca se bloquea
  const isSuperAdmin = await getSuperAdmin();
  if (isSuperAdmin) return null;

  const status = await checkTrialStatus();

  if (status.bloqueado) {
    // Cuenta pendiente de aprobación ≠ trial expirado: mensajes distintos
    redirect(status.plan === "pendiente" ? "/pendiente-aprobacion" : "/trial-expirado");
  }

  return null;
}
