import { getUserRole } from "@/lib/auth";
import { TallerNav } from "./taller-nav";

export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  let rol: "admin" | "mecanico" | "recepcion" = "mecanico";
  try {
    rol = await getUserRole();
  } catch {
    // Default to most restricted role - middleware handles redirect
  }

  return <TallerNav rol={rol}>{children}</TallerNav>;
}
