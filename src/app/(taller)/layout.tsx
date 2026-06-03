import { getUserRole } from "@/lib/auth";
import { TallerNav } from "./taller-nav";
import { redirect } from "next/navigation";

export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  let rol: "admin" | "mecanico" | "recepcion";
  try {
    rol = await getUserRole();
  } catch {
    redirect("/sign-in");
  }

  return <TallerNav rol={rol}>{children}</TallerNav>;
}
