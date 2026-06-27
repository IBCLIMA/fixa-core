import { redirect } from "next/navigation";
import { getSuperAdmin } from "@/lib/auth";
import { CorreoCliente } from "./correo-cliente";

export const metadata = {
  title: "Correo · FIXA",
};

export default async function CorreoPage() {
  const isSuperAdmin = await getSuperAdmin();
  if (!isSuperAdmin) redirect("/");

  return <CorreoCliente />;
}
