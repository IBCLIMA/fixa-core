import { after } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { portalViews } from "@/db/schema";

// Tipos de página pública del portal del cliente que registramos.
export type TipoApertura =
  | "estado"
  | "presupuesto"
  | "documento"
  | "informe"
  | "aprobar"
  | "cita";

const DEDUPE_MS = 30 * 60 * 1000; // 30 minutos

interface RegistrarAperturaParams {
  tallerId: string;
  tipo: TipoApertura;
  entidadId: string;
  token?: string | null;
  clienteId?: string | null;
  userAgent?: string | null;
}

/**
 * Registra una apertura del portal del cliente.
 *
 * - Fire-and-forget: se programa con `after()` para correr DESPUÉS de la
 *   respuesta, sin retrasar el render y garantizando que la escritura se
 *   completa en serverless (una promesa suelta se perdería al congelarse el
 *   lambda tras enviar la respuesta).
 * - NUNCA lanza: todo va envuelto en try/catch. El tracking jamás puede tumbar
 *   una página del cliente.
 * - Dedupe de 30 min: no inserta si ya hay una vista del mismo `tipo`+`entidadId`
 *   en los últimos 30 minutos (evita inflar la métrica con recargas/refrescos).
 */
export function registrarApertura(params: RegistrarAperturaParams): void {
  after(async () => {
    try {
      const db = getDb();
      const desde = new Date(Date.now() - DEDUPE_MS);

      const reciente = await db
        .select({ id: portalViews.id })
        .from(portalViews)
        .where(
          and(
            eq(portalViews.tipo, params.tipo),
            eq(portalViews.entidadId, params.entidadId),
            gte(portalViews.createdAt, desde)
          )
        )
        .limit(1);

      if (reciente.length > 0) return; // ya hay una apertura reciente → dedupe

      await db.insert(portalViews).values({
        tallerId: params.tallerId,
        tipo: params.tipo,
        entidadId: params.entidadId,
        token: params.token ?? null,
        clienteId: params.clienteId ?? null,
        userAgent: params.userAgent ?? null,
      });
    } catch {
      // Silencioso a propósito: el tracking nunca debe afectar al cliente.
    }
  });
}

/**
 * Agregado de aperturas de una entidad (uso futuro: métrica "aperturas por
 * reparación" y alerta "presupuesto visto pero no aceptado").
 */
export async function aperturasDeEntidad(
  tipo: TipoApertura,
  entidadId: string
): Promise<{ total: number; primera: Date | null; ultima: Date | null }> {
  try {
    const db = getDb();
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        primera: sql<Date | null>`min(${portalViews.createdAt})`,
        ultima: sql<Date | null>`max(${portalViews.createdAt})`,
      })
      .from(portalViews)
      .where(and(eq(portalViews.tipo, tipo), eq(portalViews.entidadId, entidadId)));

    return {
      total: row?.total ?? 0,
      primera: row?.primera ?? null,
      ultima: row?.ultima ?? null,
    };
  } catch {
    return { total: 0, primera: null, ultima: null };
  }
}
