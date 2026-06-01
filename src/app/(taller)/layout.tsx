import { getUserRole } from "@/lib/auth";
import { TallerNav } from "./taller-nav";

export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  const rol = await getUserRole();

  return <TallerNav rol={rol}>{children}</TallerNav>;
}
