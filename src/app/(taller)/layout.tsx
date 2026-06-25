import { getUserRole, getSwitcherData } from "@/lib/auth";
import { TallerNav } from "./taller-nav";
import { redirect } from "next/navigation";

export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  let rol: "admin" | "mecanico" | "recepcion";
  try {
    rol = await getUserRole();
  } catch {
    redirect("/sign-in");
  }

  // Solo devuelve datos para super-admin; null para cualquier usuario normal.
  const switcher = await getSwitcherData();

  return <TallerNav rol={rol} switcher={switcher}>{children}</TallerNav>;
}
