import { notFound } from "next/navigation";
import Link from "next/link";
import { Car, Clock, CheckCircle2, CalendarCheck, FileText, AlertTriangle, Receipt, ArrowRight } from "lucide-react";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes, talleres, historialEstados, presupuestos, averiasOcultas, documentosCobro } from "@/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
import { estadoLabelsCliente as estadoLabels, estadoColors } from "@/lib/constants";

// Página privada de cliente (acceso por token): no indexable
export const metadata = { robots: { index: false, follow: false } };


const estadoSteps = ["recibido", "diagnostico", "presupuestado", "aprobado", "en_reparacion", "listo", "entregado"];

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
      tallerTelefono: talleres.telefono,
      tallerId: ordenesTrabajo.tallerId,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
    .where(eq(ordenesTrabajo.tokenPublico, token))
    .limit(1);

  if (!orden[0]) return notFound();
  const o = orden[0];

  const currentStepIndex = estadoSteps.indexOf(o.estado);

  // Historial + acciones pendientes del cliente (hub: todo desde un solo link)
  const [historial, [presupuestoPendiente], averiasPendientes, [documento]] = await Promise.all([
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
  ]);

  const informeDisponible = o.estado === "listo" || o.estado === "entregado";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-lg flex items-center gap-2">
          <FixaLogo size="sm" />
          <span className="text-xs text-muted-foreground ml-1">Estado de tu vehículo</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Estado actual */}
        <div className="text-center space-y-3">
          <Badge className={`text-sm px-4 py-1.5 ${estadoColors[o.estado]}`}>
            OR-{o.numero}
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {estadoLabels[o.estado]}
          </h1>
          {o.estado === "listo" && (
            <p className="text-emerald-600 font-semibold">
              Puedes pasar a recogerlo cuando quieras
            </p>
          )}
        </div>

        {/* ── Acciones pendientes (hub) ── */}
        {presupuestoPendiente?.tokenPublico && (
          <Link href={`/presupuesto/${presupuestoPendiente.tokenPublico}`} className="block">
            <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50/50 hover:border-orange-400 transition-colors shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-sm shadow-orange-500/30">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-orange-900">Tienes un presupuesto pendiente</p>
                    <p className="text-xs text-orange-700 mt-0.5">Revísalo y acéptalo online en un minuto</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-orange-500 shrink-0" />
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

        {/* Progreso */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {estadoSteps.slice(0, -1).map((step, i) => {
                const isActive = i <= currentStepIndex;
                const isCurrent = step === o.estado;
                return (
                  <div key={step} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`h-3 w-3 rounded-full ${isActive ? (isCurrent ? "bg-brand ring-4 ring-brand/20" : "bg-brand") : "bg-muted"}`} />
                    {i < estadoSteps.length - 2 && (
                      <div className={`h-0.5 w-full ${i < currentStepIndex ? "bg-brand" : "bg-muted"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

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

        {/* Historial */}
        {historial.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground mb-3">Historial</p>
              <div className="space-y-2">
                {historial.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                      <span>{estadoLabels[h.estadoNuevo] || h.estadoNuevo}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(h.createdAt).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacto taller */}
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <p className="text-sm font-bold">{o.tallerNombre}</p>
            {o.tallerTelefono && (
              <a href={`tel:${o.tallerTelefono}`} className="text-sm text-brand font-semibold hover:underline">
                {o.tallerTelefono}
              </a>
            )}
            <p className="text-xs text-muted-foreground">Powered by FIXA</p>
          </CardContent>
        </Card>

        {/* Booking link */}
        <div className="text-center">
          <Link
            href={`/cita/${o.tallerId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-500 transition-colors"
          >
            <CalendarCheck className="h-4 w-4" />
            Necesitas otra cita? Solicita online
          </Link>
        </div>
      </main>
    </div>
  );
}
