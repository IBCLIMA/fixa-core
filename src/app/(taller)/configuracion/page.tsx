import { Settings } from "lucide-react";
import { getDb } from "@/db";
import { talleres, usuarios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { ConfigForm } from "./config-form";

export default async function ConfiguracionPage() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const taller = await db.query.talleres.findFirst({
    where: eq(talleres.id, tallerId),
  });

  if (!taller) return <p>Error cargando configuración</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Datos de tu taller</p>
      </div>

      <ConfigForm taller={taller} />
    </div>
  );
}
