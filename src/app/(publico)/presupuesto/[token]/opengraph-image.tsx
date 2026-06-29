import { getDb } from "@/db";
import { presupuestos, vehiculos, talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ogCard, OG_SIZE } from "@/lib/og-card";

export const alt = "Presupuesto de tu coche";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function PresupuestoOgImage({ params }: { params: { token: string } }) {
  let coche = "Tu coche";
  let taller = "Tu taller";
  try {
    const db = getDb();
    const [row] = await db
      .select({ marca: vehiculos.marca, modelo: vehiculos.modelo, taller: talleres.nombre })
      .from(presupuestos)
      .leftJoin(vehiculos, eq(presupuestos.vehiculoId, vehiculos.id))
      .leftJoin(talleres, eq(presupuestos.tallerId, talleres.id))
      .where(eq(presupuestos.tokenPublico, params.token));
    const desc = [row?.marca, row?.modelo].filter(Boolean).join(" ");
    if (desc) coche = desc;
    if (row?.taller) taller = row.taller;
  } catch {
    // Tarjeta genérica si falla la consulta.
  }
  return ogCard({
    taller,
    label: "El presupuesto de",
    destacado: coche,
    cta: "Ver y aprobar",
    ctaSub: "Míralo y acéptalo desde el móvil · sin sorpresas",
  });
}
