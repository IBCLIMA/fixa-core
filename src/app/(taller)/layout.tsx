import { getUserRole } from "@/lib/auth";
import { TallerNav } from "./taller-nav";

export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  let rol: "admin" | "mecanico" | "recepcion" = "admin";
  try {
    rol = await getUserRole();
  } catch {
    // If auth fails (e.g. not logged in), default to admin - middleware will redirect
  }

  return <TallerNav rol={rol}>{children}</TallerNav>;
}
