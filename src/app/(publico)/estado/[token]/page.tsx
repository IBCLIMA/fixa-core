import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Car, Clock, CheckCircle2, CalendarCheck, FileText, AlertTriangle, Receipt, ArrowRight, Phone, MessageSquare, CalendarClock, Stethoscope, ThumbsUp, Wrench, Package, PackageCheck, KeyRound, XCircle, Camera } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PortalClienteHeader } from "@/components/portal-cliente-header";
import { TimelineReparacion, type HitoTimeline } from "@/components/portal/timeline-reparacion";
import { MediaGallery } from "@/components/media-lightbox";
import { formatWhatsAppUrl } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes, talleres, historialEstados, presupuestos, averiasOcultas, documentosCobro, lineasOrden, fotosOrden } from "@/db/schema";
import { eq, desc, asc, and, inArray } from "drizzle-orm";
import { registrarApertura } from "@/lib/portal-views";

// Página privada de cliente (acceso por token): no indexable por buscadores,
// pero SÍ con tarjeta de previsualización (OG) para que al compartir el enlace
// por WhatsApp salga una tarjeta bonita con el coche, no una URL pelada.
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const db = getDb();
    const [row] = await db
      .select({ marca: vehiculos.marca, modelo: vehiculos.modelo, taller: talleres.nombre })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
      .where(eq(ordenesTrabajo.tokenPublico, token));
    const coche = [row?.marca, row?.modelo].filter(Boolean).join(" ") || "tu coche";
    const taller = row?.taller || "tu taller";
    const title = `Estado de ${coche}`;
    const description = `Sigue la reparación en ${taller}, paso a paso y en directo. Sin tener que llamar.`;
    return {
      title,
      description,
      robots: { index: false, follow: false },
      openGraph: { title, description, type: "website" as const, siteName: taller },
    };
  } catch {
    return { title: "Estado de tu coche", robots: { index: false, follow: false } };
  }
}

// ─── Secuencia canónica del seguimiento (lo que ve el cliente) ───
// esperando_recambio y entregado se insertan solo cuando son relevantes.
const PIPELINE = ["recibido", "diagnostico", "presupuestado", "aprobado", "en_reparacion", "esperando_recambio", "listo", "entregado"] as const;
const ordenIdx = (estado: string) => PIPELINE.indexOf(estado as (typeof PIPELINE)[number]);

// Título corto + frase humana por estado para cada hito del timeline.
// CERO datos inventados: solo describe el proceso, nunca precios/piezas/plazos.
const HITO_COPY: Record<string, { titulo: string; descripcion: string }> = {
  recibido: { titulo: "Recibido en el taller", descripcion: "Tenemos tu coche y lo hemos registrado." },
  diagnostico: { titulo: "En diagnóstico", descripcion: "Estamos revisando qué necesita exactamente." },
  presupuestado: { titulo: "Presupuesto preparado", descripcion: "Te hemos preparado una propuesta para que puedas decidir." },
  aprobado: { titulo: "Presupuesto aprobado", descripcion: "Nos diste el visto bueno. ¡Manos a la obra!" },
  en_reparacion: { titulo: "En reparación", descripcion: "Nuestros mecánicos están trabajando en tu coche." },
  esperando_recambio: { titulo: "Esperando una pieza", descripcion: "Hemos pedido la pieza que falta. En cuanto llegue, seguimos." },
  pieza_recibida: { titulo: "Pieza recibida", descripcion: "Ya tenemos la pieza que faltaba. Retomamos la reparación." },
  listo: { titulo: "Listo para recoger", descripcion: "Tu coche está reparado y a punto." },
  entregado: { titulo: "Entregado", descripcion: "Te hemos devuelto tu coche. ¡Gracias por confiar en nosotros!" },
};

// Hero: estado actual en lenguaje humano + frase tranquilizadora + próximo paso.
type Tono = "marca" | "exito" | "espera" | "cancelado";
const HERO_COPY: Record<string, { tono: Tono; icon: LucideIcon; titulo: string; sub: string; siguiente: string | null }> = {
  recibido: { tono: "marca", icon: Car, titulo: "Hemos recibido tu coche", sub: "Lo tenemos con nosotros y registrado. Nos ponemos en marcha.", siguiente: "No tienes que hacer nada ahora, te avisaremos." },
  diagnostico: { tono: "marca", icon: Stethoscope, titulo: "Estamos revisando qué le ocurre", sub: "Nuestros mecánicos están viendo qué necesita exactamente.", siguiente: "No tienes que hacer nada ahora, te avisaremos." },
  presupuestado: { tono: "marca", icon: FileText, titulo: "Te hemos preparado una propuesta", sub: "Hemos preparado un presupuesto para que puedas decidir.", siguiente: "Estamos esperando tu aprobación." },
  aprobado: { tono: "marca", icon: ThumbsUp, titulo: "Presupuesto aprobado, ¡gracias!", sub: "Ya tenemos todo lo necesario para empezar.", siguiente: "No tienes que hacer nada ahora, te avisaremos." },
  en_reparacion: { tono: "marca", icon: Wrench, titulo: "Tu coche ya está en reparación", sub: "Nuestros mecánicos están manos a la obra.", siguiente: "No tienes que hacer nada ahora, te avisaremos." },
  esperando_recambio: { tono: "espera", icon: Package, titulo: "Hemos pedido la pieza que falta", sub: "Tu reparación está en marcha; solo falta que llegue una pieza.", siguiente: "Te avisaremos cuando llegue la pieza." },
  pieza_recibida: { tono: "marca", icon: PackageCheck, titulo: "Ya tenemos la pieza", sub: "Tenemos lo que faltaba. Retomamos la reparación.", siguiente: "No tienes que hacer nada ahora, te avisaremos." },
  listo: { tono: "exito", icon: CheckCircle2, titulo: "Tu coche está listo para recoger", sub: "Hemos terminado. Puedes pasar a recogerlo cuando quieras.", siguiente: "Puedes pasar a recogerlo cuando quieras." },
  entregado: { tono: "exito", icon: KeyRound, titulo: "¡Gracias por confiar en nosotros!", sub: "Te hemos devuelto tu coche reparado.", siguiente: null },
  cancelado: { tono: "cancelado", icon: XCircle, titulo: "Esta orden se ha cancelado", sub: "Si tienes cualquier duda, estamos a un mensaje.", siguiente: null },
};

const TONO_CLASSES: Record<Tono, { wrap: string; icon: string; ping: string; siguiente: string }> = {
  marca: { wrap: "from-brand-50 to-card border-brand-200", icon: "from-brand-500 to-brand-600 text-white shadow-brand", ping: "bg-brand/30", siguiente: "text-brand-700" },
  exito: { wrap: "from-emerald-50 to-card border-emerald-200", icon: "from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-500/30", ping: "bg-emerald-400/30", siguiente: "text-emerald-700" },
  espera: { wrap: "from-amber-50 to-card border-amber-200", icon: "from-amber-500 to-amber-600 text-white shadow-sm shadow-amber-500/30", ping: "bg-amber-400/30", siguiente: "text-amber-700" },
  cancelado: { wrap: "from-muted to-card border-border", icon: "from-zinc-400 to-zinc-500 text-white", ping: "bg-transparent", siguiente: "text-muted-foreground" },
};

export default async function PortalClientePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = getDb();

  // Buscar orden por token público (no por UUID interno)
  const orden = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      estado: ordenesTrabajo.estado,
      descripcionCliente: ordenesTrabajo.descripcionCliente,
      fechaEntrada: ordenesTrabajo.fechaEntrada,
      fechaEstimada: ordenesTrabajo.fechaEstimada,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      clienteNombre: clientes.nombre,
      tallerNombre: talleres.nombre,
      tallerLogoUrl: talleres.logoUrl,
      tallerTelefono: talleres.telefono,
      tallerId: ordenesTrabajo.tallerId,
      clienteId: ordenesTrabajo.clienteId,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
    .where(eq(ordenesTrabajo.tokenPublico, token))
    .limit(1);

  if (!orden[0]) return notFound();
  const o = orden[0];

  // Tracking de apertura del portal (no bloquea el render; ver portal-views.ts)
  registrarApertura({
    tallerId: o.tallerId,
    tipo: "estado",
    entidadId: o.id,
    token,
    clienteId: o.clienteId,
    userAgent: (await headers()).get("user-agent"),
  });

  // Historial + acciones pendientes del cliente (hub: todo desde un solo link)
  // + líneas de recambio (para derivar el sub-estado "pieza recibida" sin más input del mecánico)
  const [historial, [presupuestoPendiente], averiasPendientes, [documento], lineasRecambio, fotos] = await Promise.all([
    db
      .select()
      .from(historialEstados)
      .where(eq(historialEstados.ordenId, o.id))
      .orderBy(desc(historialEstados.createdAt)),
    db
      .select({
        id: presupuestos.id,
        numero: presupuestos.numero,
        estado: presupuestos.estado,
        tokenPublico: presupuestos.tokenPublico,
      })
      .from(presupuestos)
      .where(and(
        eq(presupuestos.ordenId, o.id),
        inArray(presupuestos.estado, ["enviado", "borrador"])
      ))
      .orderBy(desc(presupuestos.createdAt))
      .limit(1),
    db
      .select({
        id: averiasOcultas.id,
        descripcion: averiasOcultas.descripcion,
        tokenAprobacion: averiasOcultas.tokenAprobacion,
      })
      .from(averiasOcultas)
      .where(and(eq(averiasOcultas.ordenId, o.id), eq(averiasOcultas.estado, "pendiente"))),
    db
      .select({ id: documentosCobro.id, tokenPublico: documentosCobro.tokenPublico, numero: documentosCobro.numero })
      .from(documentosCobro)
      .where(eq(documentosCobro.ordenId, o.id))
      .limit(1),
    db
      .select({ estadoRecambio: lineasOrden.estadoRecambio, recibidoAt: lineasOrden.recibidoAt })
      .from(lineasOrden)
      .where(eq(lineasOrden.ordenId, o.id)),
    // Fotos/vídeos que el taller ya ha tomado (SOLO LECTURA: el cliente no sube nada).
    // Orden cronológico → cuentan la historia de la reparación.
    db
      .select({ id: fotosOrden.id, url: fotosOrden.url, descripcion: fotosOrden.descripcion, esVideo: fotosOrden.esVideo })
      .from(fotosOrden)
      .where(eq(fotosOrden.ordenId, o.id))
      .orderBy(asc(fotosOrden.createdAt)),
  ]);

  const informeDisponible = o.estado === "listo" || o.estado === "entregado";

  // ── Estado granular derivado (sin más input del mecánico) ──
  // Si la orden espera recambio y alguna línea ya está marcada como recibida,
  // mostramos "Pieza recibida" en vez de "Esperando una pieza".
  const piezaRecibida =
    o.estado === "esperando_recambio" &&
    lineasRecambio.some((l) => l.estadoRecambio === "recibido" || l.recibidoAt != null);
  // Clave de copy efectiva (deriva el sub-estado de recambio)
  const copyKey = piezaRecibida ? "pieza_recibida" : o.estado;

  // ── Construcción del timeline vertical ──
  // Primera fecha en la que la orden alcanzó cada estado (historial viene desc → queda la más antigua).
  const fechaPorEstado = new Map<string, Date>();
  for (const h of historial) fechaPorEstado.set(h.estadoNuevo, new Date(h.createdAt));
  if (!fechaPorEstado.has("recibido")) fechaPorEstado.set("recibido", new Date(o.fechaEntrada));

  const currentIdx = ordenIdx(o.estado);
  const incluyeEspera = o.estado === "esperando_recambio" || fechaPorEstado.has("esperando_recambio");
  const incluyeEntregado = o.estado === "entregado" || fechaPorEstado.has("entregado");

  const stepsVisibles = PIPELINE.filter((e) => {
    if (e === "esperando_recambio") return incluyeEspera;
    if (e === "entregado") return incluyeEntregado;
    return true;
  });

  const hitos: HitoTimeline[] = o.estado === "cancelado"
    ? historial
        .slice()
        .reverse()
        .map((h, i, arr) => ({
          estado: h.estadoNuevo,
          titulo: HITO_COPY[h.estadoNuevo]?.titulo ?? h.estadoNuevo,
          descripcion: HITO_COPY[h.estadoNuevo]?.descripcion ?? "",
          fecha: new Date(h.createdAt),
          status: i === arr.length - 1 ? ("actual" as const) : ("completado" as const),
        }))
    : stepsVisibles.map((estado) => {
        const esActual = estado === o.estado;
        const alcanzado = fechaPorEstado.has(estado) || ordenIdx(estado) < currentIdx;
        const status: HitoTimeline["status"] = esActual ? "actual" : alcanzado ? "completado" : "pendiente";
        // Sub-estado de recambio: el hito de espera refleja "Pieza recibida" cuando procede
        const claveHito = estado === "esperando_recambio" && piezaRecibida ? "pieza_recibida" : estado;
        return {
          estado: claveHito,
          titulo: HITO_COPY[claveHito]?.titulo ?? estado,
          descripcion: HITO_COPY[claveHito]?.descripcion ?? "",
          fecha: status === "pendiente" ? null : (fechaPorEstado.get(estado) ?? null),
          status,
        };
      });

  const hero = HERO_COPY[copyKey] ?? HERO_COPY[o.estado] ?? HERO_COPY.recibido;
  const tono = TONO_CLASSES[hero.tono];
  const heroLatido = o.estado === "diagnostico" || o.estado === "en_reparacion" || o.estado === "esperando_recambio";
  const mostrarPrevisto = !!o.fechaEstimada && !["listo", "entregado", "cancelado"].includes(o.estado);
  const HeroIcon = hero.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header — identidad del taller (white-label) */}
      <PortalClienteHeader
        nombre={o.tallerNombre}
        logoUrl={o.tallerLogoUrl}
        subtitle="Estado de tu vehículo"
      />

      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* ── Hero de estado: el momento actual en lenguaje humano ── */}
        <section
          className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b p-6 text-center shadow-sm ${tono.wrap}`}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1 text-xs font-bold tabular-nums text-muted-foreground ring-1 ring-border">
            <Car className="h-3.5 w-3.5" /> OR-{o.numero}
            <span className="text-border">·</span>
            <span className="tracking-wider text-foreground">{o.matricula}</span>
          </span>

          <div className="relative mx-auto mt-5 w-fit">
            {heroLatido && (
              <span aria-hidden className={`absolute inset-0 rounded-2xl motion-safe:animate-ping ${tono.ping}`} />
            )}
            <div
              className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tono.icon}`}
            >
              <HeroIcon className="h-8 w-8" />
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {hero.titulo}
          </h1>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">{hero.sub}</p>

          {mostrarPrevisto && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground ring-1 ring-border">
              <CalendarClock className="h-3.5 w-3.5 text-brand-600" />
              Previsto: {new Date(o.fechaEstimada!).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
            </div>
          )}

          {hero.siguiente && (
            <div className={`mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold ${tono.siguiente}`}>
              <ArrowRight className="h-4 w-4 shrink-0" />
              <span>{hero.siguiente}</span>
            </div>
          )}
        </section>

        {/* ── Acciones pendientes (hub) ── */}
        {presupuestoPendiente?.tokenPublico && (
          <Link href={`/presupuesto/${presupuestoPendiente.tokenPublico}`} className="block">
            <Card className="border-brand-300 bg-gradient-to-br from-brand-50 to-amber-50/50 hover:border-brand-400 transition-colors shadow-brand">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-brand">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-brand-900">Tienes un presupuesto pendiente</p>
                    <p className="text-xs text-brand-700 mt-0.5">Revísalo y acéptalo online en un minuto</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-brand-500 shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {averiasPendientes.map((a) =>
          a.tokenAprobacion ? (
            <Link key={a.id} href={`/aprobar/${a.tokenAprobacion}`} className="block">
              <Card className="border-amber-300 bg-amber-50/60 hover:border-amber-400 transition-colors shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 shadow-sm shadow-amber-500/30">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-amber-900">Hemos encontrado algo más</p>
                      <p className="text-xs text-amber-700 mt-0.5 truncate">{a.descripcion} — necesitamos tu aprobación</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-amber-500 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : null
        )}

        {informeDisponible && (
          <Link href={`/informe/${token}`} className="block">
            <Card className="border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 transition-colors shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-sm shadow-emerald-600/30">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-emerald-900">Informe de la reparación</p>
                    <p className="text-xs text-emerald-700 mt-0.5">Todo lo que le hemos hecho a tu coche, con fotos</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-emerald-500 shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {documento?.tokenPublico && (
          <Link href={`/documento/${documento.tokenPublico}`} className="block">
            <Card className="border-stone-200 hover:border-stone-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-700">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold">Justificante de cobro</p>
                    <p className="text-xs text-muted-foreground mt-0.5">DOC-{String(documento.numero).padStart(4, "0")}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* ── Seguimiento de la reparación: línea de tiempo vertical (tipo tracking de pedido) ── */}
        <Card>
          <CardContent className="p-5">
            <p className="mb-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Seguimiento de la reparación
            </p>
            <TimelineReparacion hitos={hitos} />
          </CardContent>
        </Card>

        {/* ── Fotos de la reparación: prueba de transparencia (SOLO LECTURA) ── */}
        {fotos.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                  <Camera className="h-5 w-5 text-violet-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold leading-tight text-foreground">Así está tu coche</p>
                  <p className="text-xs text-muted-foreground">
                    Fotos que ha tomado el taller durante la reparación
                  </p>
                </div>
              </div>
              <MediaGallery
                items={fotos.map((f) => ({
                  id: f.id,
                  url: f.url,
                  descripcion: f.descripcion,
                  esVideo: f.esVideo ?? false,
                }))}
              />
            </CardContent>
          </Card>
        )}

        {/* Info vehículo */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-bold text-lg tracking-wider">{o.matricula}</p>
                <p className="text-sm text-muted-foreground">{o.marca} {o.modelo}</p>
              </div>
            </div>
            {o.descripcionCliente && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-bold text-muted-foreground mb-1">Motivo</p>
                <p className="text-sm">{o.descripcionCliente}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Entrada: {new Date(o.fechaEntrada).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </CardContent>
        </Card>

        {/* Contacto taller — un toque para llamar o escribir por WhatsApp */}
        <Card>
          <CardContent className="p-4 text-center space-y-3">
            <p className="text-sm font-bold">{o.tallerNombre}</p>
            {o.tallerTelefono && (
              <div className="flex gap-2">
                <a
                  href={`tel:${o.tallerTelefono}`}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold transition-colors hover:bg-muted"
                >
                  <Phone className="h-4 w-4" /> Llamar
                </a>
                <a
                  href={formatWhatsAppUrl(o.tallerTelefono)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <MessageSquare className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Powered by FIXA</p>
          </CardContent>
        </Card>

        {/* Booking link */}
        <div className="text-center">
          <Link
            href={`/cita/${o.tallerId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-500 transition-colors"
          >
            <CalendarCheck className="h-4 w-4" />
            ¿Necesitas otra cita? Solicita online
          </Link>
        </div>
      </main>
    </div>
  );
}
