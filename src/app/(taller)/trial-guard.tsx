import { redirect } from "next/navigation";
import { checkTrialStatus, getSuperAdmin } from "@/lib/auth";

export async function TrialGuard({ pathname }: { pathname: string }) {
  // No bloquear estas rutas aunque el trial haya expirado
  const exemptRoutes = ["/trial-expirado", "/configuracion", "/ayuda", "/admin", "/bienvenida"];
  if (exemptRoutes.some((r) => pathname.startsWith(r))) return null;

  // Superadmin nunca se bloquea
  const isSuperAdmin = await getSuperAdmin();
  if (isSuperAdmin) return null;

  const status = await checkTrialStatus();

  if (status.bloqueado) {
    redirect("/trial-expirado");
  }

  return null;
}
