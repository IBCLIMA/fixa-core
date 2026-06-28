import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getAveriaByToken } from "@/app/(taller)/actions/averias-ocultas";
import { AprobarAveriaClient } from "./client";
import { registrarApertura } from "@/lib/portal-views";

// Página privada de cliente (acceso por token): no indexable
export const metadata = { robots: { index: false, follow: false } };


export default async function AprobarAveriaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getAveriaByToken(token);

  if (!data) return notFound();

  // Tracking de apertura del portal (no bloquea el render; ver portal-views.ts)
  registrarApertura({
    tallerId: data.averia.tallerId,
    tipo: "aprobar",
    entidadId: data.averia.id,
    token,
    userAgent: (await headers()).get("user-agent"),
  });

  return (
    <AprobarAveriaClient
      token={token}
      averia={{
        descripcion: data.averia.descripcion,
        importeEstimado: data.averia.importeEstimado,
        estado: data.averia.estado,
        fotoUrl: data.averia.fotoUrl,
      }}
      orden={{ numero: data.orden.numero }}
      vehiculo={data.vehiculo}
      taller={data.taller}
    />
  );
}
