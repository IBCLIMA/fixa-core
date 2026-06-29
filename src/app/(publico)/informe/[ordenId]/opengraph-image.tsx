import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ogCard, OG_SIZE } from "@/lib/og-card";

export const alt = "Informe de tu coche";
export const size = OG_SIZE;
export const contentType = "image/png";

// `ordenId` es en realidad el token público de la orden.
export default async function InformeOgImage({ params }: { params: { ordenId: string } }) {
  let coche = "Tu coche";
  let taller = "Tu taller";
  try {
    const db = getDb();
    const [row] = await db
      .select({ marca: vehiculos.marca, modelo: vehiculos.modelo, taller: talleres.nombre })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
      .where(eq(ordenesTrabajo.tokenPublico, params.ordenId));
    const desc = [row?.marca, row?.modelo].filter(Boolean).join(" ");
    if (desc) coche = desc;
    if (row?.taller) taller = row.taller;
  } catch {
    // Tarjeta genérica si falla la consulta.
  }
  return ogCard({
    taller,
    label: "El informe de",
    destacado: coche,
    cta: "Ver informe",
    ctaSub: "Todo lo que le hemos hecho · con fotos",
  });
}
