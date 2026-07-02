import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ogCard, OG_SIZE } from "@/lib/og-card";
import { formatVehiculo } from "@/lib/utils";

export const alt = "Estado de tu coche en directo";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function EstadoOgImage({ params }: { params: { token: string } }) {
  let coche = "Tu coche";
  let taller = "Tu taller";
  try {
    const db = getDb();
    const [row] = await db
      .select({ marca: vehiculos.marca, modelo: vehiculos.modelo, taller: talleres.nombre })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
      .where(eq(ordenesTrabajo.tokenPublico, params.token));
    const desc = formatVehiculo(row?.marca, row?.modelo);
    if (desc) coche = desc;
    if (row?.taller) taller = row.taller;
  } catch {
    // Tarjeta genérica si falla la consulta.
  }
  return ogCard({
    taller,
    label: "El estado de",
    destacado: coche,
    cta: "Ver en directo",
    ctaSub: "Tu reparación, paso a paso · sin llamadas",
  });
}
