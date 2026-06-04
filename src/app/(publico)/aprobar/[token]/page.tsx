import { notFound } from "next/navigation";
import { getAveriaByToken } from "@/app/(taller)/actions/averias-ocultas";
import { AprobarAveriaClient } from "./client";

export default async function AprobarAveriaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getAveriaByToken(token);

  if (!data) return notFound();

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
