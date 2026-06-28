import { getDb } from "@/db";
import {
  ordenesTrabajo,
  vehiculos,
  clientes,
  historialEstados,
  presupuestos,
  alertasGestion,
} from "@/db/schema";
import { eq, and, sql, inArray, lte, gte } from "drizzle-orm";
import { formatMoney } from "@/lib/format";
import { formatWhatsAppUrl } from "@/lib/utils";

/**
 * TORRE DE CONTROL — V1 (management by exception, motor 100% determinista).
 *
 * NO inventa alertas: las 5 categorías se DERIVAN de timestamps/estados que ya
 * existen (ordenes_trabajo, historial_estados, presupuestos, vehiculos.fecha_itv).
 * La única tabla propia es `alertas_gestion`, que SOLO guarda la GESTIÓN de cada
 * alerta (gestionada / pospuesta) para suprimirla temporalmente. Cero deuda-ERP.
 *
 * Las 5 condiciones (campos reales del schema entre paréntesis):
 *  1. Comunicación — OR activa (estado ∉ entregado/cancelado y ∉ los estados que
 *     ya tienen alerta propia) cuyo último cambio (max historial_estados.created_at
 *     o updated_at) fue hace > 24h.
 *  2. Ventas — presupuesto estado='enviado' con created_at > 48h sin respuesta.
 *  3. Entrega — orden estado='listo' desde hace > 2h (fecha del cambio a 'listo').
 *  4. Operativa — orden estado='diagnostico' > 48h  Ó  'esperando_recambio' > 2 días.
 *  5. Recurrencia — vehículo con fecha_itv en los próximos 30 días (reutiliza la
 *     misma lógica de detección de ITV que el cron de avisos y ItvAlert).
 */

export type TorreCategoria =
  | "ventas"
  | "entrega"
  | "operativa"
  | "comunicacion"
  | "recurrencia";

export type TorreAccion = {
  tipo: "llamar" | "whatsapp" | "ir";
  label: string;
  href: string;
  external?: boolean; // abrir en pestaña nueva (WhatsApp)
};

export type TorreItem = {
  key: string; // alertaKey determinista: `${categoria}:${entidadId}`
  categoria: TorreCategoria;
  titulo: string;
  motivo: string;
  importe?: number;
  entidadTipo: "orden" | "presupuesto" | "vehiculo" | "grupo";
  entidadId: string;
  urgencia: "alta" | "media";
  acciones: TorreAccion[];
  href: string;
  agrupada?: boolean;
  count?: number;
};

// Estimación prudente de lo que el taller factura por una pre-ITV + gestión de
// llevar el coche a la estación. Sirve para cuantificar la oportunidad ("Xeu
// recuperables"). Es una ESTIMACIÓN, no un dato del sistema.
const PRE_ITV_ESTIMADO = 120;

// Orden de prioridad de las categorías (dinero/riesgo primero).
const PESO_CATEGORIA: Record<TorreCategoria, number> = {
  ventas: 0, // dinero a punto de cerrarse
  entrega: 1, // coche listo: satisfacción + riesgo de estancia
  operativa: 2, // trabajo parado: riesgo de plazo
  comunicacion: 3, // cliente sin novedades: satisfacción
  recurrencia: 4, // oportunidad futura (ITV)
};

// A partir de cuántos ítems del mismo tipo se agrupan en una sola línea resumen.
const UMBRAL_AGRUPAR = 3;
const MAX_ITEMS = 7;

const HORA_MS = 1000 * 60 * 60;
const DIA_MS = HORA_MS * 24;

function horasDesde(d: Date | string | number): number {
  return Math.floor((Date.now() - new Date(d).getTime()) / HORA_MS);
}

/** "5h" si < 48h, si no "3 días". Texto humano para la antigüedad. */
function antiguedad(d: Date | string | number): string {
  const horas = horasDesde(d);
  if (horas < 48) return `${horas}h`;
  const dias = Math.floor(horas / 24);
  return `${dias} ${dias === 1 ? "día" : "días"}`;
}

function nombreCorto(nombre: string | null): string {
  return (nombre || "el cliente").split(" ")[0];
}

function vehiculoLabel(
  marca: string | null,
  modelo: string | null,
  matricula: string | null
): string {
  return [marca, modelo].filter(Boolean).join(" ") || matricula || "su vehículo";
}

function appUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export async function getTorreDeControl(tallerId: string): Promise<TorreItem[]> {
  const db = getDb();
  const base = appUrl();

  // ── Supresión: gestiones vigentes (gestionada < 24h  ó  pospuesta a futuro) ──
  let suprimidas = new Set<string>();
  try {
    const gestiones = await db
      .select({
        alertaKey: alertasGestion.alertaKey,
        estado: alertasGestion.estado,
        pospuestaHasta: alertasGestion.pospuestaHasta,
        createdAt: alertasGestion.createdAt,
      })
      .from(alertasGestion)
      .where(
        and(
          eq(alertasGestion.tallerId, tallerId),
          sql`(
            (${alertasGestion.estado} = 'gestionada' AND ${alertasGestion.createdAt} > NOW() - INTERVAL '24 hours')
            OR (${alertasGestion.estado} = 'pospuesta' AND ${alertasGestion.pospuestaHasta} > NOW())
          )`
        )
      );
    suprimidas = new Set(gestiones.map((g) => g.alertaKey));
  } catch (e) {
    console.error("Torre: supresión query error", e);
  }

  const candidatos: TorreItem[] = [];

  // ── 1/3/4: órdenes activas (Comunicación / Entrega / Operativa) ─────────────
  try {
    const ordenes = await db
      .select({
        id: ordenesTrabajo.id,
        numero: ordenesTrabajo.numero,
        estado: ordenesTrabajo.estado,
        updatedAt: ordenesTrabajo.updatedAt,
        matricula: vehiculos.matricula,
        marca: vehiculos.marca,
        modelo: vehiculos.modelo,
        clienteNombre: clientes.nombre,
        clienteTelefono: clientes.telefono,
      })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
      .where(
        and(
          eq(ordenesTrabajo.tallerId, tallerId),
          sql`${ordenesTrabajo.estado} NOT IN ('entregado', 'cancelado')`
        )
      );

    // Último cambio de estado real por orden (max created_at de historial_estados).
    const ordenIds = ordenes.map((o) => o.id);
    const ultimoCambio = new Map<string, Date>();
    if (ordenIds.length > 0) {
      const rows = await db
        .select({
          ordenId: historialEstados.ordenId,
          last: sql<string>`MAX(${historialEstados.createdAt})`,
        })
        .from(historialEstados)
        .where(inArray(historialEstados.ordenId, ordenIds))
        .groupBy(historialEstados.ordenId);
      for (const r of rows) ultimoCambio.set(r.ordenId, new Date(r.last));
    }

    for (const o of ordenes) {
      const desde = ultimoCambio.get(o.id) ?? o.updatedAt;
      const horas = horasDesde(desde);
      const href = `/ordenes/${o.id}`;
      const tel = o.clienteTelefono;
      const corto = nombreCorto(o.clienteNombre);
      const veh = vehiculoLabel(o.marca, o.modelo, o.matricula);

      if (o.estado === "listo") {
        // ── Entrega: listo desde hace > 2h ──
        if (Date.now() - new Date(desde).getTime() >= 2 * HORA_MS) {
          const acciones: TorreAccion[] = [];
          if (tel) {
            acciones.push({
              tipo: "whatsapp",
              label: "Avisar por WhatsApp",
              external: true,
              href: formatWhatsAppUrl(
                tel,
                `Hola ${corto}, ya tenemos listo tu ${veh}. Puedes pasar a recogerlo cuando te venga bien. ¡Un saludo!`
              ),
            });
            acciones.push({ tipo: "llamar", label: "Llamar", href: `tel:${tel}` });
          }
          acciones.push({ tipo: "ir", label: "Abrir orden", href });
          candidatos.push({
            key: `entrega:${o.id}`,
            categoria: "entrega",
            titulo: `Avisa a ${corto}`,
            motivo: "Su coche está listo y aún no lo sabe.",
            entidadTipo: "orden",
            entidadId: o.id,
            urgencia: "alta",
            acciones,
            href,
          });
        }
        continue;
      }

      if (o.estado === "diagnostico" || o.estado === "esperando_recambio") {
        // ── Operativa: diagnóstico > 48h  ó  esperando_recambio > 2 días ──
        const limite = o.estado === "diagnostico" ? 2 * DIA_MS : 2 * DIA_MS;
        if (Date.now() - new Date(desde).getTime() >= limite) {
          const acciones: TorreAccion[] = [];
          acciones.push({ tipo: "ir", label: "Actualizar estado", href });
          if (tel && o.estado === "esperando_recambio") {
            acciones.push({
              tipo: "whatsapp",
              label: "Avisar del retraso",
              external: true,
              href: formatWhatsAppUrl(
                tel,
                `Hola ${corto}, seguimos a la espera del recambio para tu ${veh}. En cuanto llegue retomamos y te aviso. Gracias por la paciencia.`
              ),
            });
          }
          candidatos.push({
            key: `operativa:${o.id}`,
            categoria: "operativa",
            titulo: `Revisa OR-${o.numero}`,
            motivo:
              o.estado === "esperando_recambio"
                ? `Lleva ${antiguedad(desde)} esperando recambio sin avanzar.`
                : `Lleva ${antiguedad(desde)} en diagnóstico sin avanzar.`,
            entidadTipo: "orden",
            entidadId: o.id,
            urgencia: "alta",
            acciones,
            href,
          });
        }
        continue;
      }

      // ── Comunicación: resto de estados activos sin novedad > 24h ──
      // (recibido, presupuestado, aprobado, en_reparacion)
      if (horas >= 24) {
        const acciones: TorreAccion[] = [];
        if (tel) {
          acciones.push({
            tipo: "whatsapp",
            label: "Dar novedades",
            external: true,
            href: formatWhatsAppUrl(
              tel,
              `Hola ${corto}, te escribo para darte novedades de tu ${veh}. Seguimos con ello y te mantengo informado. ¡Un saludo!`
            ),
          });
          acciones.push({ tipo: "llamar", label: "Llamar", href: `tel:${tel}` });
        }
        acciones.push({ tipo: "ir", label: "Actualizar estado", href });
        candidatos.push({
          key: `comunicacion:${o.id}`,
          categoria: "comunicacion",
          titulo: `Avisa a ${corto}`,
          motivo: `Su ${veh} lleva ${antiguedad(desde)} sin novedad visible.`,
          entidadTipo: "orden",
          entidadId: o.id,
          urgencia: "media",
          acciones,
          href,
        });
      }
    }
  } catch (e) {
    console.error("Torre: órdenes query error", e);
  }

  // ── 2: presupuestos enviados sin respuesta > 48h (Ventas) ───────────────────
  try {
    const presus = await db
      .select({
        id: presupuestos.id,
        numero: presupuestos.numero,
        createdAt: presupuestos.createdAt,
        tokenPublico: presupuestos.tokenPublico,
        matricula: vehiculos.matricula,
        marca: vehiculos.marca,
        modelo: vehiculos.modelo,
        clienteNombre: clientes.nombre,
        clienteTelefono: clientes.telefono,
        importe: sql<number>`COALESCE((SELECT SUM(CAST(cantidad AS NUMERIC) * CAST(precio_unitario AS NUMERIC) * (1 + CAST(iva_pct AS NUMERIC) / 100)) FROM lineas_presupuesto WHERE lineas_presupuesto.presupuesto_id = ${presupuestos.id}), 0)`,
      })
      .from(presupuestos)
      .leftJoin(vehiculos, eq(presupuestos.vehiculoId, vehiculos.id))
      .leftJoin(clientes, eq(presupuestos.clienteId, clientes.id))
      .where(
        and(
          eq(presupuestos.tallerId, tallerId),
          eq(presupuestos.estado, "enviado"),
          sql`${presupuestos.createdAt} < NOW() - INTERVAL '48 hours'`
        )
      )
      .orderBy(presupuestos.createdAt);

    for (const p of presus) {
      const importe = Number(p.importe) || 0;
      const corto = nombreCorto(p.clienteNombre);
      const tel = p.clienteTelefono;
      const href = `/presupuestos/${p.id}`;
      const acciones: TorreAccion[] = [];
      if (tel) {
        const link = p.tokenPublico ? `\n${base}/presupuesto/${p.tokenPublico}` : "";
        acciones.push({
          tipo: "whatsapp",
          label: "Recordar presupuesto",
          external: true,
          href: formatWhatsAppUrl(
            tel,
            `Hola ${corto}, ¿pudiste ver el presupuesto de tu ${vehiculoLabel(
              p.marca,
              p.modelo,
              p.matricula
            )}? Cualquier duda me dices y lo vemos.${link}`
          ),
        });
        acciones.push({ tipo: "llamar", label: "Llamar", href: `tel:${tel}` });
      }
      acciones.push({ tipo: "ir", label: "Ver presupuesto", href });
      candidatos.push({
        key: `ventas:${p.id}`,
        categoria: "ventas",
        titulo: `Persigue a ${corto}`,
        motivo: `Presupuesto de ${formatMoney(importe)} sin respuesta hace ${antiguedad(
          p.createdAt
        )}.`,
        importe,
        entidadTipo: "presupuesto",
        entidadId: p.id,
        urgencia: "alta",
        acciones,
        href,
      });
    }
  } catch (e) {
    console.error("Torre: presupuestos query error", e);
  }

  // ── 5: ITV próxima (Recurrencia) — misma lógica que el cron de avisos ───────
  try {
    const hoy = new Date().toISOString().split("T")[0];
    const en30 = new Date();
    en30.setDate(en30.getDate() + 30);
    const en30Str = en30.toISOString().split("T")[0];

    const conItv = await db
      .select({
        id: vehiculos.id,
        matricula: vehiculos.matricula,
        marca: vehiculos.marca,
        modelo: vehiculos.modelo,
        fechaItv: vehiculos.fechaItv,
        clienteNombre: clientes.nombre,
        clienteTelefono: clientes.telefono,
      })
      .from(vehiculos)
      .leftJoin(clientes, eq(vehiculos.clienteId, clientes.id))
      .where(
        and(
          eq(vehiculos.tallerId, tallerId),
          gte(vehiculos.fechaItv, hoy),
          lte(vehiculos.fechaItv, en30Str)
        )
      )
      .orderBy(vehiculos.fechaItv);

    for (const v of conItv) {
      const corto = nombreCorto(v.clienteNombre);
      const tel = v.clienteTelefono;
      const fechaFmt = v.fechaItv
        ? new Date(v.fechaItv).toLocaleDateString("es-ES", { day: "numeric", month: "long" })
        : "";
      const veh = vehiculoLabel(v.marca, v.modelo, v.matricula);
      const href = "/avisos";
      const acciones: TorreAccion[] = [];
      if (tel) {
        acciones.push({
          tipo: "whatsapp",
          label: "Ofrecer la ITV",
          external: true,
          href: formatWhatsAppUrl(
            tel,
            `Hola ${corto}, la ITV de tu ${veh} caduca el ${fechaFmt}. Si quieres nos encargamos nosotros: la pasamos por ti sin que tengas que preocuparte. ¿Te lo preparo?`
          ),
        });
        acciones.push({ tipo: "llamar", label: "Llamar", href: `tel:${tel}` });
      }
      acciones.push({ tipo: "ir", label: "Ver avisos", href });
      candidatos.push({
        key: `recurrencia:${v.id}`,
        categoria: "recurrencia",
        titulo: `Llama a ${corto}`,
        motivo: `ITV caduca el ${fechaFmt} — ${formatMoney(
          PRE_ITV_ESTIMADO
        )} recuperables si la haces tú.`,
        importe: PRE_ITV_ESTIMADO,
        entidadTipo: "vehiculo",
        entidadId: v.id,
        urgencia: "media",
        acciones,
        href,
      });
    }
  } catch (e) {
    console.error("Torre: ITV query error", e);
  }

  // ── Supresión por gestión (gestionada/pospuesta vigente) ────────────────────
  const vivos = candidatos.filter((c) => !suprimidas.has(c.key));

  // ── Agrupar categorías con muchos ítems + ordenar por prioridad ─────────────
  const porCategoria = new Map<TorreCategoria, TorreItem[]>();
  for (const c of vivos) {
    const arr = porCategoria.get(c.categoria) ?? [];
    arr.push(c);
    porCategoria.set(c.categoria, arr);
  }

  const categoriasOrden = (Object.keys(PESO_CATEGORIA) as TorreCategoria[]).sort(
    (a, b) => PESO_CATEGORIA[a] - PESO_CATEGORIA[b]
  );

  const resultado: TorreItem[] = [];
  for (const cat of categoriasOrden) {
    const items = porCategoria.get(cat) ?? [];
    if (items.length === 0) continue;
    if (items.length < UMBRAL_AGRUPAR) {
      resultado.push(...items);
    } else {
      const claveGrupo = `${cat}:grupo`;
      if (suprimidas.has(claveGrupo)) continue;
      const sumImporte = items.reduce((s, i) => s + (i.importe || 0), 0);
      resultado.push(construirGrupo(cat, items.length, sumImporte));
    }
  }

  return resultado.slice(0, MAX_ITEMS);
}

function construirGrupo(cat: TorreCategoria, count: number, sumImporte: number): TorreItem {
  const meta: Record<
    TorreCategoria,
    { titulo: string; motivo: string; href: string; urgencia: "alta" | "media"; conImporte: boolean }
  > = {
    ventas: {
      titulo: `${count} presupuestos sin respuesta`,
      motivo: `${formatMoney(sumImporte)} esperando respuesta del cliente.`,
      href: "/presupuestos",
      urgencia: "alta",
      conImporte: true,
    },
    entrega: {
      titulo: `${count} coches listos sin avisar`,
      motivo: "Llevan más de 2h listos y los clientes aún no lo saben.",
      href: "/ordenes?filtro=listo",
      urgencia: "alta",
      conImporte: false,
    },
    operativa: {
      titulo: `${count} órdenes sin avanzar`,
      motivo: "Paradas demasiado tiempo. Reactívalas antes de que se quejen.",
      href: "/ordenes",
      urgencia: "alta",
      conImporte: false,
    },
    comunicacion: {
      titulo: `${count} clientes sin novedades`,
      motivo: "Llevan +24h sin novedad visible de su coche.",
      href: "/ordenes",
      urgencia: "media",
      conImporte: false,
    },
    recurrencia: {
      titulo: `${count} ITV a punto de caducar`,
      motivo: `${formatMoney(sumImporte)} recuperables si las haces tú.`,
      href: "/avisos",
      urgencia: "media",
      conImporte: true,
    },
  };
  const m = meta[cat];
  return {
    key: `${cat}:grupo`,
    categoria: cat,
    titulo: m.titulo,
    motivo: m.motivo,
    importe: m.conImporte ? sumImporte : undefined,
    entidadTipo: "grupo",
    entidadId: "grupo",
    urgencia: m.urgencia,
    acciones: [{ tipo: "ir", label: "Ver todos", href: m.href }],
    href: m.href,
    agrupada: true,
    count,
  };
}
